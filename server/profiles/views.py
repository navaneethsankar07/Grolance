from rest_framework.generics import RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView, ListAPIView, CreateAPIView
from rest_framework.views import APIView 
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from contracts.models import Contract
from django.db.models import Count,Q, ExpressionWrapper, F, FloatField
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import status
from django.db import transaction, DatabaseError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.functions import Coalesce
from .models import (
    ClientProfile, FreelancerProfile, FreelancerPaymentSettings,
    FreelancerPackage, FreelancerPortfolio, FreelancerSkill, Review,FreelancerToDo
)
from .serializers import (
    ClientProfileOverviewSerializer, ClientProfileUpdateSerializer,
    FreelancerOnboardingSerializer, SendPhoneOTPSerializer, VerifyPhoneOTPSerializer,
    FreelancerProfileSerializer, RoleSwitchSerializer, FreelancerProfileManageSerializer,
    FreelancerProfileUpdateSerializer, FreelancerListingSerializer, FreelancerPaymentSettingsSerializer, ReviewSerializer,FreelancerReviewListSerializer,FreelancerToDoSerializer
)
from .services import send_phone_otp, verify_phone_otp
from common.pagination import AdminUserPagination
from projects.permissions import IsFreelancerUser
import logging

logger = logging.getLogger(__name__)


class ClientProfileOverviewAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            profile, _ = ClientProfile.objects.get_or_create(
                user=self.request.user)
            return profile
        except DatabaseError as e:
            logger.error(f"Database error fetching client profile: {str(e)}")
            return None

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return ClientProfileUpdateSerializer
        return ClientProfileOverviewSerializer

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if not instance:
                return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = ClientProfileUpdateSerializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            read_serializer = ClientProfileOverviewSerializer(instance)
            return Response(read_serializer.data)
        except Exception as e:
            logger.error(f"Error updating client profile: {str(e)}")
            return Response({"error": "An internal error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClientProfileUpdateAPIView(UpdateAPIView):
    serializer_class = ClientProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            read_serializer = ClientProfileOverviewSerializer(instance)
            return Response(read_serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FreelancerOnboardingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FreelancerOnboardingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user

        try:
            with transaction.atomic():
                freelancer_profile, _ = FreelancerProfile.objects.get_or_create(
                    user=user)

                if not freelancer_profile.is_phone_verified:
                    return Response({"detail": "Phone number not verified"}, status=status.HTTP_400_BAD_REQUEST)

                freelancer_profile.tagline = data["tagline"]
                freelancer_profile.bio = data["bio"]
                freelancer_profile.category_id = data["primary_category"]
                freelancer_profile.experience_level = data["experience_level"]
                freelancer_profile.is_active = True
                freelancer_profile.save()

                FreelancerSkill.objects.filter(user=user).delete()
                for skill in data["skills"]:
                    FreelancerSkill.objects.create(
                        user=user, custom_name=skill)

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
                    if image_url:
                        FreelancerPortfolio.objects.create(
                            user=user,
                            title=p["title"],
                            description=p.get("description", ""),
                            image_url=image_url,
                        )

                paypal_email = data.get(
                    "payment_details", {}).get("paypalEmail")
                if not paypal_email:
                    return Response({"detail": "PayPal email is required"}, status=status.HTTP_400_BAD_REQUEST)

                FreelancerPaymentSettings.objects.update_or_create(
                    user=user,
                    defaults={"paypal_email": paypal_email},
                )

                user.is_freelancer = True
                user.current_role = "freelancer"
                user.save(update_fields=["is_freelancer", "current_role"])

            return Response({"message": "Onboarding completed"}, status=status.HTTP_201_CREATED)
        except DatabaseError as e:
            logger.error(f"Onboarding database error: {str(e)}")
            return Response({"error": "Database error during onboarding"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Onboarding error: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SendPhoneOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = SendPhoneOTPSerializer(
                data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            phone = serializer.validated_data["phone"]

            freelancer_profile, _ = FreelancerProfile.objects.get_or_create(
                user=request.user)

            if freelancer_profile.is_phone_verified and freelancer_profile.phone == phone:
                return Response({"message": "Phone already verified"}, status=status.HTTP_200_OK)

            if freelancer_profile.phone != phone:
                freelancer_profile.phone = phone
                freelancer_profile.is_phone_verified = False
                freelancer_profile.save()

            send_phone_otp(phone)
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"OTP send error: {str(e)}")
            return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPhoneOTPAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = VerifyPhoneOTPSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            phone = serializer.validated_data["phone"]
            otp = serializer.validated_data["otp"]

            if not verify_phone_otp(phone, otp):
                return Response({"message": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

            freelancer_profile, _ = FreelancerProfile.objects.get_or_create(
                user=request.user)
            freelancer_profile.phone = phone
            freelancer_profile.is_phone_verified = True
            freelancer_profile.save()

            return Response({"message": "Phone number verified"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Verification failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FreelancerProfileMeAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FreelancerProfileSerializer

    def get_object(self):
        try:
            profile, _ = FreelancerProfile.objects.get_or_create(
                user=self.request.user)
            return profile
        except Exception:
            return None


class SwitchRoleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = RoleSwitchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            target_role = serializer.validated_data["role"]
            user = request.user

            if target_role == "freelancer" and not user.is_freelancer:
                return Response({"detail": "Not registered as freelancer"}, status=status.HTTP_403_FORBIDDEN)

            user.current_role = target_role
            user.save(update_fields=["current_role"])
            return Response({"message": "Role switched", "current_role": user.current_role})
        except Exception as e:
            return Response({"error": "Role switch failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FreelancerProfileManageAPIView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = FreelancerProfile.objects.get_or_create(
            user=self.request.user)
        return profile

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return FreelancerProfileUpdateSerializer
        return FreelancerProfileManageSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', True)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(FreelancerProfileManageSerializer(instance).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FreelancerPaymentSettingsUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            settings, _ = FreelancerPaymentSettings.objects.get_or_create(
                user=request.user)
            return Response(FreelancerPaymentSettingsSerializer(settings).data)
        except Exception:
            return Response({"error": "Failed to fetch settings"}, status=500)

    def put(self, request):
        try:
            settings, _ = FreelancerPaymentSettings.objects.get_or_create(
                user=request.user)
            serializer = FreelancerPaymentSettingsSerializer(
                settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class FreelancerListAPIView(ListAPIView):
    serializer_class = FreelancerListingSerializer
    pagination_class = AdminUserPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__full_name', 'tagline',
                     'user__freelancer_skills__custom_name']
    ordering_fields = ['created_at', 'experience_level']

    def get_queryset(self):
        try:
            queryset = FreelancerProfile.objects.filter(is_active=True, availability=True).select_related(
                'user', 'category').prefetch_related('user__freelancer_skills', 'user__freelancer_packages')
            if self.request.user.is_authenticated:
                queryset = queryset.exclude(user=self.request.user)

            category = self.request.query_params.get('category')
            min_price = self.request.query_params.get('minPrice')
            max_price = self.request.query_params.get('maxPrice')

            if category:
                queryset = queryset.filter(category__name__icontains=category)
            if min_price:
                queryset = queryset.filter(
                    user__freelancer_packages__price__gte=min_price)
            if max_price:
                queryset = queryset.filter(
                    user__freelancer_packages__price__lte=max_price)

            return queryset.distinct().order_by('-created_at')
        except Exception:
            return FreelancerProfile.objects.none()


class FreelancerPublicProfileAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FreelancerProfileManageSerializer
    queryset = FreelancerProfile.objects.all()
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except ObjectDoesNotExist:
            return Response({"error": "Freelancer not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ReviewCreateView(CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            contract_id = self.request.data.get('contract')
            reviewee_id = self.request.data.get('reviewee')
            review_type = self.request.data.get('review_type')
            reviewer = self.request.user

            if not all([contract_id, reviewee_id, review_type]):
                raise ValidationError({"detail": "Missing required fields: contract, reviewee, or review_type."})

            contract = get_object_or_404(Contract, id=contract_id)

            if contract.status not in ['completed', 'refunded']:
                raise ValidationError({
                    "detail": "You can only leave a review for a completed contract."
                })

            try:
                reviewee_id_int = int(reviewee_id)
            except (ValueError, TypeError):
                raise ValidationError({"reviewee": "Invalid reviewee ID format."})

            if review_type == 'freelancer':
                if contract.client != reviewer or contract.freelancer.id != reviewee_id_int:
                    raise PermissionDenied({"detail": "You are not authorized to review this freelancer for this contract."})
            
            elif review_type == 'client':
                if contract.freelancer != reviewer or contract.client.id != reviewee_id_int:
                    raise PermissionDenied({"detail": "You are not authorized to review this client for this contract."})
            else:
                raise ValidationError({"review_type": "Invalid review type."})

            already_exists = Review.objects.filter(
                reviewer=reviewer,
                contract=contract,
                review_type=review_type
            ).exists()

            if already_exists:
                raise ValidationError({
                    "detail": f"You have already submitted a {review_type} review for this contract."
                })

            serializer.save(reviewer=reviewer, contract=contract)
        except ValidationError as e:
            raise e
        except PermissionDenied as e:
            raise e
        except Exception as e:
            raise ValidationError({"detail": str(e)})

class FreelancerReviewListView(ListAPIView):
    serializer_class = FreelancerReviewListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile_id = self.kwargs.get('freelancer_id')
        if not profile_id:
            return Review.objects.none()
            
        profile = get_object_or_404(FreelancerProfile.objects.select_related('user'), id=profile_id)
        
        return Review.objects.filter(
            reviewee=profile.user,
            review_type='freelancer'
        ).order_by('-created_at')

class ClientReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = []

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if not user_id:
            return Review.objects.none()
            
        return Review.objects.filter(
            reviewee_id=user_id, 
            review_type='client'
        ).order_by('-created_at')
    

class RecommendedFreelancersView(ListAPIView):
    serializer_class = FreelancerListingSerializer

    def get_queryset(self):
        try:
            return FreelancerProfile.objects.filter(
                is_active=True,
                average_rating__gte=3.0
            ).annotate(
                total_contracts=Count(
                    'user__contracts_as_freelancer', 
                    distinct=True
                ),
                completed_contracts=Count(
                    'user__contracts_as_freelancer', 
                    filter=Q(user__contracts_as_freelancer__status='completed'),
                    distinct=True
                ),
                safe_rating=Coalesce(F('average_rating'), 0.0, output_field=FloatField()),
                safe_earnings=Coalesce(F('total_earnings'), 0.0, output_field=FloatField())
            ).annotate(
                recommendation_score=ExpressionWrapper(
                    (F('safe_rating') * 10.0) + (F('safe_earnings') / 100.0) + F('completed_contracts'),
                    output_field=FloatField()
                )
            ).order_by('-recommendation_score', '-average_rating')[:5]
            
        except Exception as e:
            logger.error(f"Error calculating recommended freelancers: {str(e)}")
            return FreelancerProfile.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            
            if not queryset.exists():
                return Response(
                    {"detail": "No highly rated freelancers found at this time."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        except DatabaseError as e:
            logger.error(f"Database error in recommendations: {str(e)}")
            return Response(
                {"error": "Database service temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Unexpected error in recommendations: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class FreelancerToDoViewSet(viewsets.ModelViewSet):
    serializer_class = FreelancerToDoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FreelancerToDo.objects.filter(user=self.request.user).order_by('is_completed', '-id')

    def perform_create(self, serializer):
        user_todo_count = FreelancerToDo.objects.filter(user=self.request.user).count()
        
        if user_todo_count >= 10:
            raise ValidationError(
                {"detail": "To-do limit reached. Please delete existing tasks to add new ones."}
            )
        
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-complete')
    def mark_complete(self, request, pk=None):
        todo = self.get_object()
        todo.is_completed = True
        todo.save()
        return Response(
            {'status': 'task marked as completed', 'is_completed': todo.is_completed},
            status=status.HTTP_200_OK
        )