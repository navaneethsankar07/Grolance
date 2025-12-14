from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from django.core.cache import cache
from django.contrib.auth import authenticate
from .serializer import RegisterSerializer, EmailVerifySerializer, ResendEmailOtpSerializer, UserSerializer
from .utils import otp_service
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
class SendOtpView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        email = data["email"]

        cache.set(
            f"register_temp:{email}",
            {
                "full_name": data["full_name"],
                "email": email,
                "password": data["password"],
            },
            timeout=600
        )

        result = otp_service.send(email, purpose="email_verify", ttl=300)

        if "error" in result:
            return Response({"error": result["error"]}, status=400)
        print(request.data)
        return Response({"message": "OTP sent to your email. Please verify."}, status=200)



class VerifyOtpView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]
        print(request.data)
        serializer = EmailVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]

        otp_result = otp_service.verify(email, otp_code, purpose="email_verify")
        if "error" in otp_result:
            return Response({"error": otp_result["error"]}, status=400)

        temp_data = cache.get(f"register_temp:{email}")
        if not temp_data:
            return Response({"error": "Registration session expired. Please register again."}, status=400)
        
        if User.objects.filter(email=temp_data["email"]).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            email=temp_data["email"],
            password=temp_data["password"],
            full_name=temp_data["full_name"],
            is_active=True,
        )

        cache.delete(f"register_temp:{email}")  

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        resp = Response(
            {
                "message": "Email verified successfully!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name
                },
                "access_token": access_token,
                "refresh": str(refresh)
            },
            status=status.HTTP_200_OK
        )
        resp.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,             
            samesite="Lax",            
            max_age=7*24*3600
        )
        return resp


class ResendOtpView(APIView):
    def post(self, request):
        serializer = ResendEmailOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        result = otp_service.send(email, purpose="email_verify", ttl=300)

        if "error" in result:
            return Response({"error": result["error"]}, status=400)

        return Response({"message": "OTP resent successfully."}, status=200)


class RefreshTokenView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)
        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            return Response({"access": new_access}, status=200)
        except TokenError:
            return Response({"error": "Invalid refresh token"}, status=401)
        

class LoginView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        user = authenticate(request, email=email, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)

        resp = Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            }
            })

        resp.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7*24*3600
            )

        return resp

    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data})
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully."})
        
        response.delete_cookie("refresh_token")

        return response