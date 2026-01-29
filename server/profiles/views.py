from rest_framework.generics import RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ClientProfile,FreelancerProfile,FreelancerPaymentSettings,FreelancerPackage,FreelancerPortfolio,FreelancerSkill
from .serializers import ClientProfileOverviewSerializer,ClientProfileUpdateSerializer, FreelancerOnboardingSerializer, SendPhoneOTPSerializer, VerifyPhoneOTPSerializer, FreelancerProfileSerializer, RoleSwitchSerializer, FreelancerProfileManageSerializer, FreelancerProfileUpdateSerializer, FreelancerListingSerializer,FreelancerPaymentSettingsSerializer
from .services import send_phone_otp, verify_phone_otp
from rest_framework.pagination import PageNumberPagination
from common.pagination import AdminUserPagination
from projects.permissions import IsFreelancerUser

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
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user

        try:
            freelancer_profile, _ = FreelancerProfile.objects.get_or_create(user=user)

            if not freelancer_profile.is_phone_verified:
                return Response({"detail": "Phone number not verified"}, status=status.HTTP_400_BAD_REQUEST)

            
        except Exception as e:
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

        paypal_email = data.get("payment_details", {}).get("paypalEmail")
        
        if not paypal_email:
             return Response({"detail": "PayPal email is required for payments"}, status=400)

        FreelancerPaymentSettings.objects.update_or_create(
            user=user,
            defaults={
                "paypal_email": paypal_email,
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
    
class FreelancerProfileManageAPIView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = FreelancerProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return FreelancerProfileUpdateSerializer
        return FreelancerProfileManageSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        read_serializer = FreelancerProfileManageSerializer(instance)
        return Response(read_serializer.data)
    

class FreelancerPaymentSettingsUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = FreelancerPaymentSettings.objects.get_or_create(user=request.user)
        serializer = FreelancerPaymentSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings, _ = FreelancerPaymentSettings.objects.get_or_create(user=request.user)
        serializer = FreelancerPaymentSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FreelancerListAPIView(ListAPIView):
    serializer_class = FreelancerListingSerializer
    pagination_class = AdminUserPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__full_name', 'tagline', 'user__freelancer_skills__custom_name']
    ordering_fields = ['created_at', 'experience_level']

    def get_queryset(self):
        queryset = FreelancerProfile.objects.filter(
            is_active=True, 
            availability=True
        ).select_related('user', 'category').prefetch_related(
            'user__freelancer_skills', 
            'user__freelancer_packages'
        )
        if self.request.user.is_authenticated:
            queryset = queryset.exclude(user=self.request.user)

        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('minPrice')
        max_price = self.request.query_params.get('maxPrice')

        if category:
            queryset = queryset.filter(category__name__icontains=category)

        if min_price:
            queryset = queryset.filter(user__freelancer_packages__price__gte=min_price)

        if max_price:
            queryset = queryset.filter(user__freelancer_packages__price__lte=max_price)

        return queryset.distinct().order_by('-created_at')

class FreelancerPublicProfileAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated] 
    serializer_class = FreelancerProfileManageSerializer
    queryset = FreelancerProfile.objects.all()
    lookup_field = 'id'