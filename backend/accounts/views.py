from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class SignupView(APIView):
    @swagger_auto_schema(
        operation_summary="User Signup",
        operation_description="Register a new user with a username, password, and optional email.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description="Unique username"),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description="Password for the user"),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, description="Email address (optional)"),
            },
        ),
        responses={
            201: openapi.Response("User created successfully", openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'username': openapi.Schema(type=openapi.TYPE_STRING),
                    'tokens': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                    }),
                },
            )),
            400: "Bad Request: Username already exists or missing fields",
        }
    )
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'User created successfully.',
            'username': user.username,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    @swagger_auto_schema(
        operation_summary="User Login",
        operation_description="Authenticate a user with username and password to receive JWT tokens.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description="Username"),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description="User password"),
            },
        ),
        responses={
            200: openapi.Response("Login successful", openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'username': openapi.Schema(type=openapi.TYPE_STRING),
                    'tokens': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                    }),
                },
            )),
            401: "Unauthorized: Invalid credentials",
        }
    )
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful.',
                'username': user.username,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
