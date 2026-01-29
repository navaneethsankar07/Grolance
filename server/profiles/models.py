from django.db import models
from django.conf import settings
from categories.models import Category, Skill
from django.db.models.signals import post_delete
from django.dispatch import receiver

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

    class Meta:
        indexes = [
            models.Index(fields=['total_spent']),
        ]

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

    class Meta:
        indexes = [
            models.Index(fields=['availability']),
            models.Index(fields=['experience_level']),
            models.Index(fields=['total_earnings']),
            models.Index(fields=['created_at']),
        ]

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

    class Meta:
        indexes = [
            models.Index(fields=['package_type']),
            models.Index(fields=['price']),
        ]

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

    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
        ]

class FreelancerPaymentSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_settings"
    )
    paypal_email = models.EmailField(
        max_length=255, 
        help_text="The email associated with the freelancer's PayPal account"
    )
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return f"PayPal: {self.paypal_email} ({self.user.email})"

@receiver(post_delete, sender=FreelancerProfile)
def delete_freelancer_related_data(sender, instance, **kwargs):
    user = instance.user
    FreelancerSkill.objects.filter(user=user).delete()
    FreelancerPackage.objects.filter(user=user).delete()
    FreelancerPortfolio.objects.filter(user=user).delete()
    FreelancerPaymentSettings.objects.filter(user=user).delete()
    user.is_freelancer = False
    user.current_role = 'client'
    user.save()