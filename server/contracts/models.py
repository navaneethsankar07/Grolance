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
    package = models.ForeignKey('profiles.FreelancerPackage', on_delete=models.SET_NULL, null=True, related_name='contracts')
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



class ContractDeliverable(models.Model):
    DELIVERABLE_TYPES = [
        ('file', 'File'),
        ('link', 'Link'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='deliverables')
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file_url = models.URLField(max_length=500) 
    deliverable_type = models.CharField(max_length=10, choices=DELIVERABLE_TYPES)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.contract.id}"
    

class ContractRevision(models.Model):
    REVISION_STATUS = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='revisions')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=REVISION_STATUS, default='pending')
    rejection_message = models.TextField(null=True, blank=True) # New field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Revision for Contract {self.contract.id} at {self.created_at}"