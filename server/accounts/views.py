from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from django.core.cache import cache
from django.contrib.auth import authenticate
from .serializer import RegisterSerializer, EmailVerifySerializer, ResendEmailOtpSerializer, UserSerializer, ForgotPasswordSerializer, ResetTokenValidateSerializer, ResetPasswordSerializer, GoogleAuthSerializer, ChangePasswordSerializer,DeleteAccountSerializer
from .utils import otp_service, reset_password_service
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from django.conf import settings
from .services.google_auth import GoogleAuthService
from .services.google_user_service import GoogleUserService

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
        return Response({"message": "OTP sent to your email. Please verify."}, status=200)



class VerifyOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp_code"]

        otp_result = otp_service.verify(email, otp_code, purpose="email_verify")
        if "error" in otp_result:
            return Response({"error": otp_result["error"]}, status=400)

        temp_data = cache.get(f"register_temp:{email}")
        if not temp_data:
            return Response(
                {"error": "Registration session expired. Please register again."},
                status=400,
            )

        email = temp_data["email"]

        if User.objects.filter(email=email, is_deleted=True).exists():
            return Response(
                {"error": "An account with this email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            email=email,
            password=temp_data["password"],
            full_name=temp_data["full_name"],
            is_active=True,
        )

        cache.delete(f"register_temp:{email}")

        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "message": "Email verified successfully!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                },
                "access_token": str(refresh.access_token),
            },
            status=200,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 3600,
        )

        return response


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
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        user = authenticate(request, email=email, password=password)

        if not user or user.is_deleted:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_active:
            return Response(
                {"error": "Your account has been blocked by admin"},
                status=403,
            )

        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "is_admin": user.is_admin,
                },
            }
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 3600,
        )

        return response

    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data})
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh")

            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK
            )

            response.delete_cookie("refresh")

            return response

        except Exception:
            return Response(
                {"error": "Logout failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
    

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ForgotPasswordSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If an account exists, a reset link has been sent."},
                status=200
            )
        
        token_data = reset_password_service.generatetoken(user)
        uid = token_data["uid"]
        token = token_data["token"]

        reset_password_service.send_reset_link(
            email=user.email,
            uid=uid,
            token=token
        )

        return Response(
            {"message": "If this email exists, a reset link has been sent."},
            status=200
        )
        
        
class ValidateResetTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        uid = request.query_params.get("uid")
        token = request.query_params.get("token")

        serializer = ResetTokenValidateSerializer(
            data={"uid": uid, "token": token}
        )

        if serializer.is_valid():
            return Response(
                {"message": "Reset link is valid"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Reset link is invalid or expired"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        new_password = serializer.validated_data["new_password"]

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
    

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]

        payload = GoogleAuthService.verify_id_token(token)
        if not payload:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = GoogleUserService.get_or_create_user(payload)

        refresh = RefreshToken.for_user(user)

        response = Response({
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "profile_photo": user.profile_photo,
            }
        })

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            max_age=7 * 24 * 3600,
        )

        return response
    
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password updated successfully."},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.is_active = False
        user.is_deleted = True
        user.save()

        response = Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)
        # Clear cookies on deletion
        response.delete_cookie("refresh_token")
        return response