from rest_framework import serializers
from django.core.cache import cache
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "full_name", "email", "profile_photo",
            "is_freelancer", "is_admin", "is_active",
            "created_at"
        ]

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=40)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class EmailVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField()


class ResendEmailOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        temp = cache.get(f"register_temp:{value}")  
        if not temp:
            raise serializers.ValidationError("Registration expired. Please register again.")
        return value
