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

    PRICING_TYPE_CHOICES = [
        ("fixed", "Fixed Price"),
        ("range", "Range Price"),
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

    pricing_type = models.CharField(
        max_length=10,
        choices=PRICING_TYPE_CHOICES,
        default="fixed"
    )

    # pricing fields
    fixed_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    min_budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    max_budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    delivery_days = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="open"
    )

    is_active = models.BooleanField(default=True)
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
        null=True,
        blank=True,
        related_name="project_skills"
    )

    custom_name = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(skill__isnull=False, custom_name__isnull=True) |
                    models.Q(skill__isnull=True, custom_name__isnull=False)
                ),
                name="projectskill_requires_skill_or_custom_name"
            )
        ]

    def __str__(self):
        return self.custom_name or self.skill.name
