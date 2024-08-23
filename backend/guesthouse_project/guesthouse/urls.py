from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomUserViewSet, UserView, UserViewSet, GuestHouseViewSet, ImageViewSet, BookingViewSet, PaymentViewSet, check_user, create_or_get_user,UpdateAdminView


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'guesthouses', GuestHouseViewSet)
router.register(r'images', ImageViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('customusers/', CustomUserViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='customuser-list'),
    path('customusers/<str:clerk_id>/', CustomUserViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update'
    }), name='customuser-detail'),
    path('check-user/', check_user, name='check_user'),
    path('create-or-get-user/', create_or_get_user, name='create_or_get_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update-admin/', UpdateAdminView.as_view(), name='update_admin'),
    path('users/', UserView.as_view(), name='user_info'),
]