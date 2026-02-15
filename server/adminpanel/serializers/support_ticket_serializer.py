from rest_framework import serializers
from common.models import SupportTicket

class SupportTicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    admin_reply = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_email', 'user_full_name', 'sender_role', 
            'subject', 'message', 'status', 'resolved_at','created_at','admin_reply'
        ]
        read_only_fields = ['user', 'sender_role', 'subject', 'message', 'created_at']