from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ContactViewSet,
    register_view,
    current_user_view,
    demo_login_view,
    google_auth_view,
)

router = DefaultRouter()
router.register('contacts', ContactViewSet, basename='contact')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register_view, name='auth_register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', current_user_view, name='auth_me'),
    path('auth/demo-login/', demo_login_view, name='auth_demo_login'),
    path('auth/google/', google_auth_view, name='auth_google'),

    # Contacts ViewSet
    path('', include(router.urls)),
]