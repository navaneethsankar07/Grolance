from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from adminpanel.serializers.user_serializers import AdminUserListSerializer
from adminpanel.pagination import AdminUserPagination
from adminpanel.permissions import IsAdminUser
from rest_framework import status


User = get_user_model()

class AdminUserListAPIView(ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [IsAdminUser]
    pagination_class = AdminUserPagination
    filter_backends = [SearchFilter, OrderingFilter]

    search_fields = ["full_name", "email"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]  

    def get_queryset(self):
        return User.objects.filter(is_admin=False)


class AdminToggleUserActiveAPIView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        if user.is_admin:
            return Response(
                {"detail": "Cannot block/unblock an admin account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_deleted:
            return Response(
                {"detail": "Cannot block/unblock a deleted user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = not user.is_active
        user.save()

        return Response({
            "id": user.id,
            "is_active": user.is_active,
            "message": "User activated" if user.is_active else "User blocked"
        })
    


class AdminSoftDeleteUserAPIView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        if user.is_admin:
            return Response(
                {"detail": "Cannot delete admin user"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.is_deleted = True
        user.is_active = False
        user.save()

        return Response(
            {"message": "User soft deleted"},
            status=status.HTTP_200_OK
        )
