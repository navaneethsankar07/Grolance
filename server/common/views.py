from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PlatformPercentageSerializer
from adminpanel.models import GlobalSettings

class PlatformPercentageView(APIView):
    permission_classes = []

    def get(self,request):
        settings = GlobalSettings.objects.filter(pk=1).first()
        
        if not settings:
            return Response({"commission_percentage_fallback": "10.00"})

        serializer = PlatformPercentageSerializer(settings)
        
        return Response(serializer.data)
