from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField

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

    legal_document = CloudinaryField('legal_document', resource_type="raw", null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offered')

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['client_signed_at']),
        ]


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

    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
        ]

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
    status = models.CharField(max_length=10, choices=REVISION_STATUS, default='pending')
    rejection_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Revision for Contract {self.contract.id} at {self.created_at}"
    

class Dispute(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]

    REASON_CHOICES = [
        ('scope_creep', 'Client requesting extra work outside scope'),
        ('no_feedback', 'Client is unresponsive'),
        ('Unlimited Revisions','contract does not limit the number of revisions included in the price, leading to endless edits.'),
        ('poor_quality', 'Work quality does not match proposal'),
        ('missed_deadline', 'Freelancer missed final deadline'),
        ('incomplete_work', 'Freelancer submitted unfinished work'),
        ('communication_issue', 'Communication breakdown'),
        ('other', 'Other'),
    ]

    contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE, related_name='disputes')
    
    opened_by_client = models.ForeignKey(
        'profiles.ClientProfile', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    opened_by_freelancer = models.ForeignKey(
        'profiles.FreelancerProfile', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )

    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    admin_notes = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def opener(self):
        return self.opened_by_client or self.opened_by_freelancer

    def __str__(self):
        role = "Client" if self.opened_by_client else "Freelancer"
        return f"Dispute by {role} on Contract {self.contract.id}"

class DisputeFile(models.Model):
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name='evidence')
    file_url = models.URLField(max_length=500)