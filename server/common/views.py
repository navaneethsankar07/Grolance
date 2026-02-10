from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import SupportTicket,CMSSection,FAQ
import logging
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import PlatformPercentageSerializer, CreateSupportTicketSerializer, CMSSectionSerializer, FAQAdminSerializer
from adminpanel.models import GlobalSettings
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)

class PlatformPercentageView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            settings = GlobalSettings.objects.filter(pk=1).first()
            
            if not settings:
                return Response(
                    {"commission_percentage": "10.00"}, 
                    status=status.HTTP_200_OK
                )

            serializer = PlatformPercentageSerializer(settings)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error retrieving platform percentage: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching platform settings."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserSupportTicketCreateView(generics.CreateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = CreateSupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            active_tickets_count = SupportTicket.objects.filter(
                user=request.user, 
                status='open'
            ).count()

            if active_tickets_count >= 5:
                return Response(
                    {"error": "You have reached the maximum limit of 5 active support tickets. Please wait for them to be resolved before creating a new one."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return super().create(request, *args, **kwargs)
            
        except ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating support ticket for user {request.user.id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while creating your ticket. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        serializer.save()


from rest_framework.permissions import AllowAny

class TermsAndConditionsView(generics.ListAPIView):
    serializer_class = CMSSectionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CMSSection.objects.filter(category='terms')

class PrivacyPolicyView(generics.ListAPIView):
    serializer_class = CMSSectionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CMSSection.objects.filter(category='privacy')
    



class FAQListView(generics.ListAPIView):
    queryset = FAQ.objects.filter()
    serializer_class = FAQAdminSerializer 
    permission_classes = []
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']