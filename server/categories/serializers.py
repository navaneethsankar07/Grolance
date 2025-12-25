from rest_framework import serializers
from .models import Category,Skill

class SkillSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )
    class Meta:
        model = Skill
        fields = ["id", "name", "category", 'category_name', "is_custom"]

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



class SkillWriteSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError("Skill name cannot be empty")
        return name

    def validate(self, attrs):
        name = attrs.get("name")
        category = attrs.get("category")

        exists = Skill.objects.filter(
            name__iexact=name,
            category=category
        ).exclude(
            id=self.instance.id if self.instance else None
        ).exists()

        if exists:
            raise serializers.ValidationError(
                "This skill already exists in the selected category."
            )

        return attrs

    class Meta:
        model = Skill
        fields = ["name", "category"]
