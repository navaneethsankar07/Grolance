from django.urls import path
from .views.user_views import (
    AdminUserListAPIView,
    AdminToggleUserActiveAPIView,
    AdminSoftDeleteUserAPIView,
)
urlpatterns = [
    path("users/", AdminUserListAPIView.as_view(), name="admin-user-list"),
    path("users/<int:user_id>/toggle-active/",AdminToggleUserActiveAPIView.as_view(),name="admin-user-toggle-active",),
    path("users/<int:user_id>/soft-delete/",AdminSoftDeleteUserAPIView.as_view(),name="admin-user-soft-delete",),
]