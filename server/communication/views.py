from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import viewsets, status
from .serializers import NotificationSerializer, ChatRoomSerializer, ChatUserSerializer, MessageSerializer
from .models import Notification, ChatRoom, Message
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied, ValidationError, NotFound
from django.core.exceptions import ObjectDoesNotExist
from common.pagination import AdminUserPagination
from contracts.models import Contract
import logging

logger = logging.getLogger(__name__)

class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            current_role = getattr(user, 'current_role', 'client')
            fetch_all = self.request.query_params.get('all', 'false').lower() == 'true'

            queryset = Notification.objects.filter(
                recipient=user, 
                target_role=current_role
            ).order_by('-created_at')

            if fetch_all:
                return queryset
            return queryset.filter(is_read=False)
        except Exception as e:
            logger.error(f"Error fetching notifications: {str(e)}")
            return Notification.objects.none()

class MarkNotificationReadView(UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_update(self, serializer):
        try:
            serializer.save(is_read=True)
        except Exception as e:
            logger.error(f"Error marking notification as read: {str(e)}")
            raise ValidationError({"detail": "Could not update notification status."})

    
class ChatRoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRoomSerializer
    pagination_class = AdminUserPagination

    def get_queryset(self):
        try:
            return ChatRoom.objects.filter(participants=self.request.user).order_by('-created_at')
        except Exception as e:
            logger.error(f"Error fetching chat rooms: {str(e)}")
            return ChatRoom.objects.none()

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        try:
            room = self.get_object()
            messages = room.messages.all().order_by('-created_at')
            
            # Update read status
            messages.exclude(sender=request.user).update(is_read=True)

            Notification.objects.filter(
                recipient=request.user,
                notification_type='new_message',
                related_id=room.id,
                is_read=False
            ).update(is_read=True)
            
            page = self.paginate_queryset(messages)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({"error": "Chat room not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching room messages: {str(e)}")
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE", detail="Deleting entire chat rooms is not permitted.")

    @action(detail=False, methods=['post'])
    def get_or_create_room(self, request):
        try:
            target_user_id = request.data.get('user_id')
            if not target_user_id:
                return Response({"error": "User ID required"}, status=status.HTTP_400_BAD_REQUEST)
            
            all_contracts = Contract.objects.filter(
                (Q(client=request.user) & Q(freelancer_id=target_user_id)) |
                (Q(client_id=target_user_id) & Q(freelancer=request.user))
            )

            if not all_contracts.exists():
                return Response({"error": "No contract found. You can only chat if you have a contract history."}, status=status.HTTP_403_FORBIDDEN)
            
            room = ChatRoom.objects.filter(participants=request.user).filter(participants__id=target_user_id).first()

            if not room:
                room = ChatRoom.objects.create(name=f"room_{request.user.id}_{target_user_id}")
                room.participants.add(request.user, target_user_id)

            serializer = self.get_serializer(room)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in get_or_create_room: {str(e)}")
            return Response({"error": "Could not initiate chat room."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        try:
            return Message.objects.filter(room__participants=self.request.user)
        except Exception as e:
            logger.error(f"Error fetching messages: {str(e)}")
            return Message.objects.none()
    
    def perform_create(self, serializer):
        try:
            room = serializer.validated_data['room']
            participants = room.participants.exclude(id=self.request.user.id)
            
            if not participants.exists():
                raise PermissionDenied("No other participant in this room.")

            other_user = participants.first()

            has_active_contract = Contract.objects.filter(
                (Q(client=self.request.user) & Q(freelancer=other_user)) |
                (Q(client=other_user) & Q(freelancer=self.request.user))
            ).filter(status__in=['active', 'submitted', 'disputed']).exists()

            if not has_active_contract:
                raise PermissionDenied("Messaging is disabled because the contract is completed or inactive.")

            serializer.save(sender=self.request.user)
        except PermissionDenied as e:
            raise e
        except Exception as e:
            logger.error(f"Error creating message: {str(e)}")
            raise ValidationError({"detail": "Message could not be sent."})

    def perform_destroy(self, instance):
        try:
            if instance.sender == self.request.user:
                instance.delete()
            else:
                raise PermissionDenied("You can only delete your own messages.")
        except PermissionDenied as e:
            raise e
        except Exception as e:
            logger.error(f"Error deleting message: {str(e)}")
            raise ValidationError({"detail": "Message could not be deleted."})