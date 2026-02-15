from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification, ChatRoom, Message
from contracts.models import Contract
from django.db.models import Q

User = get_user_model()

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'message', 'is_read', 'created_at', 'related_id']


class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_photo', 'current_role']

class MessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_role', 'text', 'is_read', 'created_at', 'is_me']

    def get_is_me(self, obj):
        return obj.sender == self.context['request'].user

class ChatRoomSerializer(serializers.ModelSerializer):
    can_chat = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'other_participant', 'last_message', 'created_at','can_chat']
    
    def get_can_chat(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return False
            
        other_user = obj.participants.exclude(id=request.user.id).first()
        if not other_user:
            return False

        return Contract.objects.filter(
            (Q(client=request.user) & Q(freelancer=other_user)) |
            (Q(client=other_user) & Q(freelancer=request.user))
        ).filter(status__in=['active', 'submitted', 'disputed']).exists()

    def get_other_participant(self, obj):
        user = self.context['request'].user
        other = obj.participants.exclude(id=user.id).first()
        if other:
            return ChatUserSerializer(other).data
        return None

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return MessageSerializer(last_msg, context=self.context).data
        return None