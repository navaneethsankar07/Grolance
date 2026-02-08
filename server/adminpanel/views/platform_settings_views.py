from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from adminpanel.models import GlobalSettings
from adminpanel.serializers.platform_settings_serializers import GlobalSettingsSerializer
from adminpanel.permissions import IsAdminUser

class GlobalSettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings, _ = GlobalSettings.objects.get_or_create(pk=1)
        serializer = GlobalSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings, _ = GlobalSettings.objects.get_or_create(pk=1)
        serializer = GlobalSettingsSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)