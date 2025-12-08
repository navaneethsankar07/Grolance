from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .serializer import RegisterSerializer, EmailVerifySerializer, ResendEmailOtpSerializer
from .utils import otp_service
from .models import User

class SendOtpView(APIView):
    def post(self, request):
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
            return Response({"error": "Registration session expired. Please register again."}, status=400)

        user = User.objects.create_user(
            email=temp_data["email"],
            password=temp_data["password"],
            full_name=temp_data["full_name"],
            is_active=True,
        )

        cache.delete(f"register_temp:{email}")  # cleanup

        return Response(
            {"message": "Email verified successfully!", "user_id": user.id},
            status=200
        )


class ResendOtpView(APIView):
    def post(self, request):
        serializer = ResendEmailOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        result = otp_service.send(email, purpose="email_verify", ttl=300)

        if "error" in result:
            return Response({"error": result["error"]}, status=400)

        return Response({"message": "OTP resent successfully."}, status=200)

