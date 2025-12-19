from rest_framework import serializers
from .models import Project, ProjectSkill
from categories.models import Skill


class ProjectCreateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )

    class Meta:
        model = Project
        fields = [
            "title",
            "description",
            "requirements",
            "expected_deliverables",
            "category",
            "pricing_type",
            "fixed_price",
            "min_budget",
            "max_budget",
            "delivery_days",
            "skills",
        ]

    def validate(self, attrs):
        pricing_type = attrs.get("pricing_type")

        fixed_price = attrs.get("fixed_price")
        min_budget = attrs.get("min_budget")
        max_budget = attrs.get("max_budget")

        if pricing_type == "fixed":
            if fixed_price is None:
                raise serializers.ValidationError({
                    "fixed_price": "Fixed price is required for fixed pricing."
                })
            if min_budget or max_budget:
                raise serializers.ValidationError(
                    "Range budgets are not allowed for fixed price projects."
                )

        if pricing_type == "range":
            if min_budget is None or max_budget is None:
                raise serializers.ValidationError(
                    "Both min and max budget are required for range pricing."
                )
            if min_budget >= max_budget:
                raise serializers.ValidationError(
                    "Minimum budget must be less than maximum budget."
                )
            if fixed_price:
                raise serializers.ValidationError(
                    "Fixed price is not allowed for range pricing."
                )

        return attrs

    def create(self, validated_data):
        skills_data = validated_data.pop("skills")
        user = self.context["request"].user

        project = Project.objects.create(
            client=user,
            **validated_data
        )

        for skill_name in skills_data:
            skill_name = skill_name.strip().title()

            skill, _ = Skill.objects.get_or_create(
                name=skill_name,
                defaults={"is_custom": True}
            )

            ProjectSkill.objects.create(
                project=project,
                skill=skill
            )

        return project
