from rest_framework import serializers
from .models import ClientProfile
from categories.models import Category



class ClientProfileOverviewSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_photo = serializers.URLField(source="user.profile_photo", read_only=True)
    joined_at = serializers.DateTimeField(source="user.created_at", read_only=True)
    is_google_account = serializers.BooleanField(source="user.is_google_account", read_only=True)

    categories = serializers.StringRelatedField(many=True)

    class Meta:
        model = ClientProfile
        fields = [
            "full_name",
            "email",
            "profile_photo",
            "company_name",
            "location",
            "categories",
            "joined_at",
            "is_google_account"
        ]


class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False)
    profile_photo = serializers.URLField(required=False, allow_null=True)
    
    categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(), 
        required=False
    )

    class Meta:
        model = ClientProfile
        fields = ["company_name", "location", "categories", "full_name", "profile_photo"]

    def update(self, instance, validated_data):
        full_name = validated_data.pop("full_name", None)
        profile_photo = validated_data.pop("profile_photo", None)
        categories = validated_data.pop("categories", None)

        user = instance.user
        if full_name is not None:
            user.full_name = full_name
        if profile_photo is not None:
            user.profile_photo = profile_photo
        
        if full_name or profile_photo:
            user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if categories is not None:
            instance.categories.set(categories)

        instance.save()
        return instance