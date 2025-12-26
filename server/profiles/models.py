from django.db import models
from django.conf import settings
from categories.models import Category

class ClientProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="client_profile"
    )

    company_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)

    categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name="interested_clients"
    )

    total_spent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total_projects_posted = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"ClientProfile({self.user.email})"