from rest_framework import serializers
from accounts.models import User

class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "is_active",
            "is_deleted",
            "is_admin",
            "current_role",
            "created_at",
        ]
