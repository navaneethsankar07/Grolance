from django.db import models
from django.conf import settings

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('escrow', 'Held in Escrow'),
        ('released', 'Released to Freelancer'),
        ('refunded', 'Refunded to Client'),
    ]

    contract = models.OneToOneField('contracts.Contract', on_delete=models.CASCADE, related_name='escrow_details')
    paypal_order_id = models.CharField(max_length=100, unique=True)
    paypal_capture_id = models.CharField(max_length=100, blank=True, null=True)
    
    amount_total = models.DecimalField(max_digits=10, decimal_places=2)  
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)  
    freelancer_share = models.DecimalField(max_digits=10, decimal_places=2) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PlatformAnalytics(models.Model):
    total_business_volume = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_platform_profit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    completed_projects_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return "Global Platform Stats"