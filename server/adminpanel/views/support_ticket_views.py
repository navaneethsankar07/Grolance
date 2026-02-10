from rest_framework import generics, status
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
import logging
from adminpanel.services import support_ticket_service
from django_filters.rest_framework import DjangoFilterBackend
from common.models import SupportTicket
from adminpanel.serializers.support_ticket_serializer import SupportTicketSerializer
from adminpanel.permissions import IsAdminUser

logger = logging.getLogger(__name__)

class SupportTicketListView(generics.ListAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'sender_role']

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error fetching support tickets: {str(e)}")
            return Response(
                {"error": "Failed to retrieve support tickets."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SupportTicketDetailView(generics.RetrieveUpdateAPIView):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.status == 'resolved':
                return Response(
                    {"error": "This ticket is already resolved and cannot be modified."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return super().update(request, *args, **kwargs)
        except SupportTicket.DoesNotExist:
            return Response(
                {"error": "Support ticket not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error updating support ticket {kwargs.get('pk')}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_update(self, serializer):
        try:
            with transaction.atomic():
                admin_reply_text = serializer.validated_data.get('admin_reply')
                
                instance = serializer.save(
                    status='resolved',
                    resolved_at=timezone.now()
                )
                
                if admin_reply_text:
                    instance.admin_reply = admin_reply_text
                    try:
                        support_ticket_service.send_admin_reply(instance)
                    except Exception as mail_err:
                        logger.error(f"Email dispatch failed: {str(mail_err)}")
        except Exception as e:
            raise e