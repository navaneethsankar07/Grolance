from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationSerializer
from .models import Notification

class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        fetch_all = self.request.query_params.get('all', 'false').lower() == 'true'
        
        if fetch_all:
            return Notification.objects.filter(recipient=user)
        return Notification.objects.filter(recipient=user, is_read=False)

class MarkNotificationReadView(UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def perform_update(self, serializer):
        serializer.save(is_read=True)