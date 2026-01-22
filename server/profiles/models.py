from django.db import models
from django.conf import settings
from categories.models import Category,Skill

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
    


class FreelancerProfile(models.Model):
    EXPERIENCE_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_profile"
    )

    tagline = models.CharField(max_length=100)
    bio = models.TextField()
    phone = models.CharField(max_length=10)
    is_phone_verified = models.BooleanField(default=False)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="freelancers"
    )

    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES
    )

    availability = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    total_earnings = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

class FreelancerSkill(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    custom_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

class FreelancerPackage(models.Model):
    PACKAGE_CHOICES = [
        ("starter", "Starter"),
        ("pro", "Pro"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_packages"
    )

    package_type = models.CharField(
        max_length=20,
        choices=PACKAGE_CHOICES
    )

    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_days = models.PositiveIntegerField()
    description = models.TextField()

class FreelancerPortfolio(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_portfolios"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_url = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True)

class FreelancerBankDetails(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="freelancer_bank"
    )

    account_number = models.CharField(max_length=30)
    ifsc = models.CharField(max_length=11)
    account_holder_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    branch_name = models.CharField(max_length=255)

    is_verified = models.BooleanField(default=False)
