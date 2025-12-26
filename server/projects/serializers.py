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
            normalized = skill_name.strip().title()
            skill, _ = Skill.objects.get_or_create(
                name=skill_name.strip(),
                defaults={"is_custom": True}
            )

            skill = Skill.objects.filter(name__iexact=normalized).first()

            if skill:
                ProjectSkill.objects.create(
                    project=project,
                    skill=skill
                )
            else:
                ProjectSkill.objects.create(
                    project=project,
                    custom_name=normalized
                )

        return project


class ProjectListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only = True
    )
    skills = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id','title','description','category_name', 'pricing_type', 'fixed_price', 'min_budget', 'max_budget', 'delivery_days', 'status', 'created_at', 'skills']

    def get_skills(self,obj):
        skills = []
        for ps in obj.project_skills.all():
            if ps.skill:
                skills.append(ps.skill.name)
            
            else:
                skills.append(ps.custom_name)
        return skills
    

from rest_framework import serializers
from .models import Project, ProjectSkill
from categories.models import Skill


class ProjectUpdateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only = True
    )
    skills_display = serializers.SerializerMethodField(read_only=True)

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
            "status",
            "skills",
            "skills_display"
        ]
    
    def get_skills_display(self, obj):
        skills = []
        for ps in obj.project_skills.all():
            if ps.skill:
                skills.append(ps.skill.name)
            else:
                skills.append(ps.custom_name)
        return skills
    
    def validate(self, attrs):
        pricing_type = attrs.get("pricing_type", self.instance.pricing_type)

        fixed_price = attrs.get("fixed_price", self.instance.fixed_price)
        min_budget = attrs.get("min_budget", self.instance.min_budget)
        max_budget = attrs.get("max_budget", self.instance.max_budget)

        if pricing_type == "fixed":
            if fixed_price is None:
                raise serializers.ValidationError({
                    "fixed_price": "Fixed price is required."
                })
            if min_budget or max_budget:
                raise serializers.ValidationError(
                    "Range budget not allowed for fixed pricing."
                )

        if pricing_type == "range":
            if min_budget is None or max_budget is None:
                raise serializers.ValidationError(
                    "Both min and max budget are required."
                )
            if min_budget >= max_budget:
                raise serializers.ValidationError(
                    "Minimum budget must be less than maximum budget."
                )
            if fixed_price:
                raise serializers.ValidationError(
                    "Fixed price not allowed for range pricing."
                )

        return attrs

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if skills_data is not None:
            instance.project_skills.all().delete()

            for skill_name in skills_data:
                normalized = skill_name.strip().title()

                skill = Skill.objects.filter(name__iexact=normalized).first()

                ProjectSkill.objects.create(
                project=instance,
                skill=skill if skill else None,
                custom_name=None if skill else normalized,
            )


        return instance
    