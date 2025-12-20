from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CLIENT = "client"
    ROLE_FREELANCER = "freelancer"

    ROLE_CHOICES = [
        (ROLE_CLIENT, "Client"),
        (ROLE_FREELANCER, "Freelancer"),
    ]

    full_name = models.CharField(max_length=40)
    email = models.EmailField(unique=True)
    profile_photo = models.URLField(blank=True, null=True)

    is_admin = models.BooleanField(default=False)
    is_freelancer = models.BooleanField(default=False)
    is_google_account = models.BooleanField(default=False)
    google_sub = models.CharField(max_length=255, blank=True, null=True)
    current_role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CLIENT,
    )

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email

