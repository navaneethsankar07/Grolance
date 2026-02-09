from rest_framework import serializers
from adminpanel.models import GlobalSettings

class GlobalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = ['support_email','paypal_email', 'commission_percentage', 'last_updated']
        read_only_fields = ['last_updated']

    
