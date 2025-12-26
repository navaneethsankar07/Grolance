from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ClientProfile
from .serializers import (
    ClientProfileOverviewSerializer,
    ClientProfileUpdateSerializer
)


class ClientProfileOverviewAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return ClientProfileUpdateSerializer
        return ClientProfileOverviewSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = ClientProfileUpdateSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        read_serializer = ClientProfileOverviewSerializer(instance)
        return Response(read_serializer.data)

class ClientProfileUpdateAPIView(UpdateAPIView):
    serializer_class = ClientProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile
