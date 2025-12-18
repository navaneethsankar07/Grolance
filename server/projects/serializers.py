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
            "budget",
            "delivery_days",
            "skills",
        ]

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
                name=skill_name.strip(),
                defaults={"is_custom": True}
            )
            ProjectSkill.objects.create(
                project=project,
                skill=skill
            )

        return project
