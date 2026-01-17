from django.db import models
from accounts.models import  User
class Contract(models.Model):
    STATUS_CHOICES = [
        ('offered', 'Offered'),     
        ('active', 'Active'),       
        ('submitted', 'Submitted'), 
        ('completed', 'Completed'), 
        ('cancelled', 'Cancelled'), 
        ('disputed', 'In Dispute'),
    ]

    project = models.OneToOneField('projects.Project', on_delete=models.CASCADE, related_name='contract')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts_as_client')
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts_as_freelancer')
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_funded = models.BooleanField(default=False) 
    paid_to_freelancer = models.BooleanField(default=False) 
    
    client_signature = models.TextField() 
    client_signature_type = models.CharField(max_length=10, choices=[('draw', 'Draw'), ('type', 'Type')])
    
    freelancer_signature = models.TextField(null=True, blank=True)
    freelancer_signature_type = models.CharField(max_length=10, choices=[('draw', 'Draw'), ('type', 'Type')], null=True)
    
    client_signed_at = models.DateTimeField(auto_now_add=True)
    client_ip = models.GenericIPAddressField(null=True)
    
    freelancer_signed_at = models.DateTimeField(null=True, blank=True)
    freelancer_ip = models.GenericIPAddressField(null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offered')