from django.db import models
from django.conf import settings
from categories.models import Skill
from categories.models import Category

# Project Model

class Project(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,   
        related_name="projects"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField()
    expected_deliverables = models.TextField()

    budget = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_days = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open"
    )

    is_active = models.BooleanField(default=True)  # soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ProjectSkill(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="project_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.PROTECT,  
        related_name="project_skills"
    )

    class Meta:
        unique_together = ("project", "skill")

    def __str__(self):
        return f"{self.project.title} - {self.skill.name}"
