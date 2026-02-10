from django.db import models
from django.conf import settings
from django.core.mail import send_mail

class SupportTicket(models.Model):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('resolved', 'Resolved'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    sender_role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.subject} - {self.user.email} ({self.sender_role})"

    class Meta:
        ordering = ['-created_at']