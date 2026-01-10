from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ClientProfile,FreelancerProfile,FreelancerBankDetails,FreelancerPackage,FreelancerPortfolio,FreelancerSkill
from .serializers import ClientProfileOverviewSerializer,ClientProfileUpdateSerializer, FreelancerOnboardingSerializer, SendPhoneOTPSerializer, VerifyPhoneOTPSerializer, FreelancerProfileSerializer, RoleSwitchSerializer, FreelancerProfileManageSerializer
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
        print("DEBUG: Incoming Data ->", request.data)
        
        serializer = FreelancerOnboardingSerializer(data=request.data)
        
        if not serializer.is_valid():
            print("DEBUG: Serializer Errors ->", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user

        try:
            freelancer_profile, _ = FreelancerProfile.objects.get_or_create(user=user)

            if not freelancer_profile.is_phone_verified:
                print("DEBUG: Phone not verified for user", user.email)
                return Response({"detail": "Phone number not verified"}, status=status.HTTP_400_BAD_REQUEST)

            
        except Exception as e:
            print("DEBUG: Unexpected Error ->", str(e))
            return Response({"error": str(e)}, status=500)

        freelancer_profile.tagline = data["tagline"]
        freelancer_profile.bio = data["bio"]
        freelancer_profile.category_id = data["primary_category"]
        freelancer_profile.experience_level = data["experience_level"]
        freelancer_profile.is_active = True
        freelancer_profile.save()

        FreelancerSkill.objects.filter(user=user).delete()
        for skill in data["skills"]:
            FreelancerSkill.objects.create(
                user=user,
                custom_name=skill
            )

        FreelancerPackage.objects.filter(user=user).delete()
        for package_type, pkg in data["packages"].items():
            FreelancerPackage.objects.create(
                user=user,
                package_type=package_type,
                price=pkg["price"],
                delivery_days=pkg["deliveryTime"],
                description=pkg["description"],
            )

        FreelancerPortfolio.objects.filter(user=user).delete()
        for p in data.get("portfolios", []):
            image_url = p.get("image_url") or p.get("image")

            if not image_url:
                continue  

            FreelancerPortfolio.objects.create(
                user=user,
                title=p["title"],
                description=p.get("description", ""),
                image_url=image_url,
            )


        FreelancerBankDetails.objects.update_or_create(
            user=user,
            defaults={
                "account_holder_name": data["bank_details"]["fullName"],
                "account_number": data["bank_details"]["accountNumber"],
                "ifsc": data["bank_details"]["ifscCode"],
                "bank_name": data["bank_details"]["bankName"],
                "branch_name": data["bank_details"].get("branchName", ""),
            },
        )

        user.is_freelancer = True
        user.current_role = "freelancer"
        user.save(update_fields=["is_freelancer", "current_role"])

        return Response(
            {"message": "Freelancer onboarding completed successfully"},
            status=status.HTTP_201_CREATED
        )


class SendPhoneOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendPhoneOTPSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]

        freelancer_profile, _ = FreelancerProfile.objects.get_or_create(
            user=request.user
        )

        if (
            freelancer_profile.is_phone_verified
            and freelancer_profile.phone == phone
        ):
            return Response(
                {"message": "Phone already verified"},
                status=status.HTTP_200_OK,
            )

        if freelancer_profile.phone != phone:
            freelancer_profile.phone = phone
            freelancer_profile.is_phone_verified = False
            freelancer_profile.save()

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
        freelancer_profile.is_phone_verified = True
        freelancer_profile.save()

        return Response(
            {"message": "Phone number verified successfully"},
            status=status.HTTP_200_OK,
        )
    
class FreelancerProfileMeAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FreelancerProfileSerializer

    def get_object(self):
        profile, _ = FreelancerProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile


class SwitchRoleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoleSwitchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_role = serializer.validated_data["role"]
        user = request.user

        if target_role == "freelancer":
            if not user.is_freelancer:
                return Response(
                    {"detail": "You are not registered as a freelancer"},
                    status=status.HTTP_403_FORBIDDEN
                )

        user.current_role = target_role
        user.save(update_fields=["current_role"])

        return Response(
            {
                "message": "Role switched successfully",
                "current_role": user.current_role
            },
            status=status.HTTP_200_OK
        )
    
class FreelancerProfileManageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = FreelancerProfile.objects.get_or_create(user=request.user)
        serializer = FreelancerProfileManageSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        profile = FreelancerProfile.objects.get(user=user)
        data = request.data

        profile.tagline = data.get('tagline', profile.tagline)
        profile.bio = data.get('bio', profile.bio)
        profile.category_id = data.get('category', profile.category_id)
        profile.experience_level = data.get('experience_level', profile.experience_level)
        profile.availability = data.get('availability', profile.availability)
        profile.save()

        if 'full_name' in data:
            user.full_name = data['full_name']
            user.save()

        if 'skills' in data:
            FreelancerSkill.objects.filter(user=user).delete()
            for skill_name in data['skills']:
                FreelancerSkill.objects.create(user=user, custom_name=skill_name)

        if 'packages' in data:
            FreelancerPackage.objects.filter(user=user).delete()
            for pkg_type, pkg_info in data['packages'].items():
                FreelancerPackage.objects.create(
                    user=user,
                    package_type=pkg_type,
                    price=pkg_info['price'],
                    delivery_days=pkg_info['delivery_days'],
                    description=pkg_info['description']
                )

        if 'portfolios' in data:
            FreelancerPortfolio.objects.filter(user=user).delete()
            for item in data['portfolios']:
                FreelancerPortfolio.objects.create(
                    user=user,
                    title=item['title'],
                    description=item.get('description', ''),
                    image_url=item['image_url']
                )

        return Response(FreelancerProfileManageSerializer(profile).data)