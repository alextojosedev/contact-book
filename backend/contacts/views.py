from django.http import JsonResponse
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Contact
from .serializers import ContactSerializer, UserSerializer, RegisterSerializer


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Contact.objects.filter(owner=user)

        # Search parameter
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(company__icontains=search) |
                Q(job_title__icontains=search) |
                Q(notes__icontains=search) |
                Q(category__icontains=search)
            )

        # Category filter
        category = self.request.query_params.get('category', '').strip()
        if category and category != 'All':
            queryset = queryset.filter(category__iexact=category)

        # Favorite filter
        favorite = self.request.query_params.get('favorite', '')
        if favorite.lower() in ['true', '1']:
            queryset = queryset.filter(is_favorite=True)

        # Ordering
        ordering = self.request.query_params.get('ordering', 'name')
        if ordering == 'recent':
            queryset = queryset.order_by('-created_at')
        elif ordering == 'name_desc':
            queryset = queryset.order_by('-name')
        elif ordering == 'company':
            queryset = queryset.order_by('company', 'name')
        else:
            queryset = queryset.order_by('-is_favorite', 'name')

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='toggle-favorite')
    def toggle_favorite(self, request, pk=None):
        contact = self.get_object()
        contact.is_favorite = not contact.is_favorite
        contact.save()
        serializer = self.get_serializer(contact)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No ids provided'}, status=status.HTTP_400_BAD_REQUEST)
        deleted_count, _ = Contact.objects.filter(owner=request.user, id__in=ids).delete()
        return Response({'deleted_count': deleted_count, 'message': f'Successfully deleted {deleted_count} contacts.'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        return Response({
            'user': user_data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Account created successfully!'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def demo_login_view(request):
    demo_username = "demo_user"
    user, created = User.objects.get_or_create(
        username=demo_username,
        defaults={
            'first_name': 'Alex',
            'last_name': 'Morgan',
            'email': 'demo@contactbook.app'
        }
    )
    if created:
        user.set_password('demo1234')
        user.save()

    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'user': user_data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Logged in as Demo User'
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth_view(request):
    """
    Handles Google OAuth login/signup.
    Accepts credential (Google JWT id_token) or direct email/name payload.
    """
    import base64
    import json

    credential = request.data.get('credential')
    email = request.data.get('email')
    name = request.data.get('name', '')
    first_name = request.data.get('given_name', '')
    last_name = request.data.get('family_name', '')

    # If credential JWT token is passed from Google Identity Services
    if credential:
        try:
            parts = credential.split('.')
            if len(parts) >= 2:
                payload_b64 = parts[1]
                payload_b64 += '=' * (-len(payload_b64) % 4)
                payload_json = base64.urlsafe_b64decode(payload_b64.encode('utf-8')).decode('utf-8')
                payload = json.loads(payload_json)

                email = payload.get('email', email)
                name = payload.get('name', name)
                first_name = payload.get('given_name', first_name)
                last_name = payload.get('family_name', last_name)
        except Exception as e:
            return Response({'error': f'Invalid Google token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    if not email:
        return Response({'error': 'Email is required for Google authentication.'}, status=status.HTTP_400_BAD_REQUEST)

    email = email.lower().strip()

    # Find or create user
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        base_username = email.split('@')[0]
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{suffix}"
            suffix += 1

        if not first_name and name:
            name_parts = name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        user.set_unusable_password()
        user.save()

    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data

    return Response({
        'user': user_data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'message': f'Signed in successfully with Google as {user.email}'
    })


def home(request):
    return JsonResponse({
        'status': 'online',
        'app': 'Contact Book API',
        'endpoints': {
            'contacts': '/api/contacts/',
            'register': '/api/auth/register/',
            'login': '/api/auth/token/',
            'refresh': '/api/auth/token/refresh/',
            'me': '/api/auth/me/',
            'demo': '/api/auth/demo-login/',
            'google': '/api/auth/google/'
        }
    })