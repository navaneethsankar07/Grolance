from rest_framework import serializers
from .models import Category,Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "category", "is_custom"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class CategoryWriteSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        name = value.strip()

        if not name:
            raise serializers.ValidationError("Category name cannot be empty")

        exists = Category.objects.filter(
            name__iexact=name
        ).exclude(
            id=self.instance.id if self.instance else None
        ).exists()

        if exists:
            raise serializers.ValidationError("Category already exists")

        return name

    class Meta:
        model = Category
        fields = ["id", "name"]