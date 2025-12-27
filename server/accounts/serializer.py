from rest_framework import serializers
from django.core.cache import cache
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "profile_photo",
            "is_freelancer",
            "current_role",
            "is_google_account",
            "is_admin",
            "is_active",
            "created_at",
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

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    
class ResetTokenValidateSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            raise serializers.ValidationError("Invalid reset link")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError("Reset link has expired or is invalid")

        attrs["user"] = user
        return attrs

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")
        password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")

        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": e.messages})

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except Exception:
            raise serializers.ValidationError("Invalid reset link")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError("Reset link is invalid or expired")

        attrs["user"] = user
        return attrs
    

class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField()



class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        validate_password(data["new_password"])
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user
    

class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        user = self.context['request'].user
        
        if not user.is_google_account:
            password = data.get("password")
            if not password:
                raise serializers.ValidationError({"password": "Password is required to delete your account."})
            if not user.check_password(password):
                raise serializers.ValidationError({"password": "Current password is incorrect."})
        
        return data