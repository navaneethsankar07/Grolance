from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('proposal_accepted', 'Proposal Accepted'),
        ('invitation_received', 'New Invitation'),
        ('offer_received', 'New Offer'),
        ('contract_started', 'Contract Started'),
        ('delivered', 'Work Delivered'),
        ('revision_requested', 'Revision Requested'),
        ('revision_accepted', 'Revision Accepted'),
        ('revision_rejected', 'Revision Rejected'),
        ('contract_completed', 'Contract Completed'),
        ('payment_credited', 'Payment Credited'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    related_id = models.IntegerField(null=True, blank=True) 
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}"