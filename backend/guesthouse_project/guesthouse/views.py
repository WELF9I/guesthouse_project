import base64
import binascii 
from django.utils import timezone
from django.http import JsonResponse
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from .models import CustomUser, GuestHouse, Image, Booking, Payment
from .serializers import CustomUserSerializer, GuestHouseSerializer, ImageSerializer, BookingSerializer, PaymentSerializer, UserSerializer
from django.contrib.auth.password_validation import validate_password


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        clerk_id = self.kwargs.get('clerk_id')
        return get_object_or_404(CustomUser, clerk_id=clerk_id)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GuestHouseViewSet(viewsets.ModelViewSet):
    queryset = GuestHouse.objects.all()
    serializer_class = GuestHouseSerializer

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def create(self, request, *args, **kwargs):
        guesthouse_id = request.data.get('guesthouse')
        images_data = request.data.getlist('images')  # Use getlist to handle multiple files

        if not guesthouse_id:
            return Response({'error': 'Guesthouse ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            guesthouse = GuestHouse.objects.get(id=guesthouse_id)
        except GuestHouse.DoesNotExist:
            return Response({'error': 'Guesthouse not found.'}, status=status.HTTP_404_NOT_FOUND)

        created_images = []
        for image_data in images_data:
            image = Image.objects.create(guesthouse=guesthouse, image_blob=image_data.read())
            created_images.append(image)

        serializer = self.get_serializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        guesthouse_id = request.query_params.get('guesthouse')
        if guesthouse_id:
            queryset = self.queryset.filter(guesthouse_id=guesthouse_id)
        else:
            queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        image_instance = self.get_object()
        image_data = request.data.get('images')

        if image_data:
            if 'data:image/' in image_data:
                try:
                    image_data = image_data.split('base64,')[1]
                except IndexError:
                    return Response({'error': 'Base64 data is missing.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                image_blob = base64.b64decode(image_data)
            except (TypeError, binascii.Error) as e:
                return Response({'error': 'Invalid base64 data provided.'}, status=status.HTTP_400_BAD_REQUEST)

            image_instance.image_blob = image_blob

        serializer = self.get_serializer(image_instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Update guesthouse availability
        guesthouse = serializer.validated_data['guesthouse']
        if (serializer.validated_data['status'] == 'confirmed') :
            guesthouse.availability_status = False
        guesthouse.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Automatically update status if end_date has passed
        if instance.end_date < timezone.now().date() and instance.status != 'completed':
            instance.status = 'completed'
            instance.save()

        # Update guesthouse availability status
        guesthouse = instance.guesthouse
        self.update_guesthouse_availability(guesthouse)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        guesthouse = instance.guesthouse
        self.perform_destroy(instance)
        
        # Update guesthouse availability status after deletion
        self.update_guesthouse_availability(guesthouse)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def update_guesthouse_availability(self, guesthouse):
        # Check if there are any confirmed or pending bookings
        has_confirmed = Booking.objects.filter(guesthouse=guesthouse, status='confirmed').exists()
        has_pending = Booking.objects.filter(guesthouse=guesthouse, status='pending').exists()
        has_completed = Booking.objects.filter(guesthouse=guesthouse, status='completed').exists()

        if has_confirmed or has_pending:
            guesthouse.availability_status = False
        else:
            guesthouse.availability_status = True
        guesthouse.save()

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Get the booking and payment details
        booking = serializer.validated_data['booking']
        payment_status = serializer.validated_data['status']
        paid_amount = serializer.validated_data['amount']

        # Update booking status based on payment status and amount
        if payment_status == 'Completed' and paid_amount >= booking.total_cost:
            booking.status = 'confirmed'
            booking.save()

            # Update guesthouse availability status
            guesthouse = booking.guesthouse
            self.update_guesthouse_availability(guesthouse)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        headers = self.get_success_headers(serializer.data)

        # Get the booking and payment details
        booking = instance.booking
        payment_status = instance.status
        paid_amount = instance.amount

        # Update booking status based on payment status and amount
        if payment_status == 'Completed' and paid_amount >= booking.total_cost:
            booking.status = 'confirmed'
            booking.save()

            # Update guesthouse availability status
            guesthouse = booking.guesthouse
            self.update_guesthouse_availability(guesthouse)

        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def update_guesthouse_availability(self, guesthouse):
        # Check if there are any confirmed or pending bookings
        has_confirmed = Booking.objects.filter(guesthouse=guesthouse, status='confirmed').exists()
        has_pending = Booking.objects.filter(guesthouse=guesthouse, status='pending').exists()
        has_completed = Booking.objects.filter(guesthouse=guesthouse, status='completed').exists()

        if has_confirmed or has_pending:
            guesthouse.availability_status = False
        else:
            guesthouse.availability_status = True
        guesthouse.save()

@api_view(['POST'])
def check_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({'valid': True, 'is_admin': user.is_staff})
    else:
        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def create_or_get_user(request):
    clerk_id = request.data.get('clerk_id')
    name = request.data.get('name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    # Check if the CustomUser with the given clerk_id exists
    custom_user, created = CustomUser.objects.get_or_create(
        clerk_id=clerk_id,
        defaults={
            'name': name,
            'email': email,
            'phone': phone
        }
    )
    # If the CustomUser was not created
    # update its attributes with any new information provided
    if not created:
        if name is not None:
            custom_user.name = name
        if email is not None:
            custom_user.email = email
        if phone is not None:
            custom_user.phone = phone
        custom_user.save()

    serializer = CustomUserSerializer(custom_user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required
@require_POST
@ensure_csrf_cookie
def change_username(request):
    new_username = request.POST.get('new_username')
    if not new_username:
        return JsonResponse({'error': 'New username is required.'}, status=400)
    
    user = request.user
    user.username = new_username
    user.save()
    return JsonResponse({'message': 'Username updated successfully.'})




@login_required
@require_POST
@ensure_csrf_cookie
def change_password(request):
    old_password = request.POST.get('old_password')
    new_password = request.POST.get('new_password')
    
    if not old_password or not new_password:
        return JsonResponse({'error': 'Both old and new passwords are required.'}, status=400)
    
    user = request.user
    if not user.check_password(old_password):
        return JsonResponse({'error': 'Old password is incorrect.'}, status=400)
    
    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)  # Important to update the session
    return JsonResponse({'message': 'Password updated successfully.'})


class UpdateAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is_staff:
            return Response({"error": "Only admin users can update their details"}, status=status.HTTP_403_FORBIDDEN)

        new_username = request.data.get('username')
        new_password = request.data.get('password')

        if new_username:
            if User.objects.filter(username=new_username).exclude(id=user.id).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = new_username

        if new_password:
            try:
                validate_password(new_password, user)
                user.set_password(new_password)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.save()
        return Response({"message": "Admin details updated successfully"}, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "is_staff": user.is_staff
        })