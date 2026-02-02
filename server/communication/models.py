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
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    ]

    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications')
    target_role = models.CharField(
        max_length=15,
        choices=ROLE_CHOICES,
        default='freelancer'
    )
    notification_type = models.CharField(
        max_length=50, choices=NOTIFICATION_TYPES)
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



from django.db import models
from django.conf import settings

class ChatRoom(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="chat_rooms")
    name = models.CharField(max_length=255, unique=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    sender_role = models.CharField(max_length=20,default='freelancer')
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.email}: {self.text[:20]}"