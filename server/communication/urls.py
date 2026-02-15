from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationListView, MarkNotificationReadView, ChatRoomViewSet,MessageViewSet

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chat-room')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
]