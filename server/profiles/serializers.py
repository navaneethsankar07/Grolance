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
    categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(), 
        required=False
    )

    class Meta:
        model = ClientProfile
        fields = ["company_name", "location", "categories"]

    def update(self, instance, validated_data):
        categories = validated_data.pop("categories", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if categories is not None:
            instance.categories.set(categories)

        instance.save()
        return instance