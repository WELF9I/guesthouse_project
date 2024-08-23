from rest_framework import serializers
from .models import CustomUser, GuestHouse, Image, Booking, Payment
from django.contrib.auth.models import User
import base64

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'clerk_id', 'name', 'email', 'phone']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'is_staff', 'password']  # Removed 'email'

    def update(self, instance, validated_data):
        # Update the username as usual
        instance.username = validated_data.get('username', instance.username)
        
        # If the password is provided, hash it and update it
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class ImageSerializer(serializers.ModelSerializer):
    image_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'guesthouse', 'image_base64', 'created_at']

    def get_image_base64(self, obj):
        return base64.b64encode(obj.image_blob).decode('utf-8')

    def create(self, validated_data):
        image_base64 = self.context['request'].data.get('image_base64')
        if image_base64:
            image_blob = base64.b64decode(image_base64)
            validated_data['image_blob'] = image_blob
        return super().create(validated_data)

class GuestHouseSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = GuestHouse
        fields = ['id', 'name', 'description', 'location', 'price_per_day', 'availability_status', 'rooms', 'images']

class BookingSerializer(serializers.ModelSerializer):
    clerk_id = serializers.CharField(write_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'clerk_id', 'guesthouse', 'start_date', 'end_date', 'total_cost', 'status']
        read_only_fields = ['custom_user']

    def create(self, validated_data):
        clerk_id = validated_data.pop('clerk_id')
        try:
            custom_user = CustomUser.objects.get(clerk_id=clerk_id)
            validated_data['custom_user'] = custom_user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this Clerk ID does not exist")
        return super().create(validated_data)
        
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("End date must be after start date.")
        
        return data

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'amount', 'status']