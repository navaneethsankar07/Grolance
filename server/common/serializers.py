from rest_framework import serializers
from adminpanel.models import GlobalSettings

class PlatformPercentageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = ['commission_percentage']