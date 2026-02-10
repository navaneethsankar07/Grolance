from rest_framework import serializers
from adminpanel.models import GlobalSettings
from .models import SupportTicket

class PlatformPercentageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = ['commission_percentage']



class CreateSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['subject', 'message']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        
        role = getattr(user, 'current_role', 'client') 

        return SupportTicket.objects.create(
            user=user,
            sender_role=role,
            **validated_data
        )