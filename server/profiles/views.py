from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ClientProfile,FreelancerProfile
from .serializers import ClientProfileOverviewSerializer,ClientProfileUpdateSerializer, FreelancerOnboardingSerializer, SendPhoneOTPSerializer, VerifyPhoneOTPSerializer
from .services import send_phone_otp, verify_phone_otp


class ClientProfileOverviewAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return ClientProfileUpdateSerializer
        return ClientProfileOverviewSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = ClientProfileUpdateSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        read_serializer = ClientProfileOverviewSerializer(instance)
        return Response(read_serializer.data)

class ClientProfileUpdateAPIView(UpdateAPIView):
    serializer_class = ClientProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        read_serializer = ClientProfileOverviewSerializer(instance)
        return Response(read_serializer.data)
    



class FreelancerOnboardingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FreelancerOnboardingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data

        if not user.is_phone_verified:
            return Response(
                {"detail": "Phone number not verified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Freelancer onboarding completed"},
            status=status.HTTP_201_CREATED
        )
    

class SendPhoneOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendPhoneOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]

        send_phone_otp(phone)

        return Response(
            {"message": "OTP sent successfully"},
            status=status.HTTP_200_OK,
        )


class VerifyPhoneOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPhoneOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        otp = serializer.validated_data["otp"]

        if not verify_phone_otp(phone, otp):
            return Response(
                {"message": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        freelancer_profile, _ = FreelancerProfile.objects.get_or_create(
            user=request.user
        )

        freelancer_profile.phone = phone
        freelancer_profile.phone_verified = True
        freelancer_profile.save()

        return Response(
            {"message": "Phone number verified successfully"},
            status=status.HTTP_200_OK,
        )
