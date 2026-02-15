from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from projects.models import Proposal, Invitation
from contracts.models import Contract, ContractDeliverable, ContractRevision
from .models import Notification, Message
from payments.models import Payment

def send_realtime_notification(notification):
    channel_layer = get_channel_layer()
    group_name = f"user_{notification.recipient.id}"

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification", 
            "content": {
                "id": notification.id,
                "target_role": notification.target_role,
                "message": notification.message,
                "notification_type": notification.notification_type,
                "created_at": notification.created_at.strftime("%d-%m-%Y %H:%M"),
                "is_read": notification.is_read,
                "related_id": notification.related_id
            }
        }
    )

@receiver(post_save, sender=Proposal)
def proposal_notification(sender, instance, created, **kwargs):
    if not created and instance.status == 'accepted':
        notif = Notification.objects.create(
            recipient=instance.freelancer.user,
            target_role='freelancer',
            notification_type='proposal_accepted',
            message=f"Your proposal for '{instance.project.title}' was accepted!",
            related_id=instance.id
        )
        send_realtime_notification(notif)

@receiver(post_save, sender=Invitation)
def invitation_notification(sender, instance, created, **kwargs):
    if created:
        notif = Notification.objects.create(
            recipient=instance.freelancer.user,
            target_role='freelancer',
            notification_type='invitation_received',
            message=f"You received a new invitation for '{instance.project.title}'",
            related_id=instance.id
        )
        send_realtime_notification(notif)

@receiver(post_save, sender=Contract)
def contract_status_notifications(sender, instance, created, **kwargs):
    if created and instance.status == 'offered':
        notif = Notification.objects.create(
            recipient=instance.freelancer,
            target_role='freelancer',
            notification_type='offer_received',
            message=f"You received a new contract offer for '{instance.project.title}' from {instance.client.full_name}",
            related_id=instance.id
        )
        send_realtime_notification(notif)
    
    elif not created:
        if instance.status == 'active' and instance.freelancer_signed_at:
            already_notified = Notification.objects.filter(
                related_id=instance.id, 
                notification_type='contract_started'
            ).exists()
            
            if not already_notified:
                notif = Notification.objects.create(
                    recipient=instance.client,
                    target_role='client',
                    notification_type='contract_started',
                    message=f"Freelancer signed the contract for '{instance.project.title}'. Work has started!",
                    related_id=instance.id
                )
                send_realtime_notification(notif)
        
        elif instance.status == 'completed':
            already_notified = Notification.objects.filter(
                related_id=instance.id, 
                notification_type='contract_completed'
            ).exists()

            if not already_notified:
                notif = Notification.objects.create(
                    recipient=instance.freelancer,
                    target_role='freelancer',
                    notification_type='contract_completed',
                    message=f"The contract for '{instance.project.title}' is officially complete!",
                    related_id=instance.id
                )
                send_realtime_notification(notif) 
    
@receiver(post_save, sender=ContractDeliverable)
def delivery_notifications(sender, instance, created, **kwargs):
    if created:
        notif = Notification.objects.create(
            recipient=instance.contract.client,
            target_role='client',
            notification_type='delivered',
            message=f"New work has been delivered for '{instance.contract.project.title}'",
            related_id=instance.id
        )
        send_realtime_notification(notif)

@receiver(post_save, sender=ContractRevision)
def revision_notifications(sender, instance, created, **kwargs):
    if created:
        notif = Notification.objects.create(
            recipient=instance.contract.freelancer,
            target_role='freelancer',
            notification_type='revision_requested',
            message=f"Revision requested for '{instance.contract.project.title}'",
            related_id=instance.contract.id
        )
        send_realtime_notification(notif)
    else:
        if instance.status == 'accepted':
            notif = Notification.objects.create(
                recipient=instance.contract.client,
                target_role='client',
                notification_type='revision_accepted',
                message=f"Freelancer accepted your revision request for '{instance.contract.project.title}'",
                related_id=instance.contract.id
            )
            send_realtime_notification(notif)
        elif instance.status == 'rejected':
            notif = Notification.objects.create(
                recipient=instance.contract.client,
                target_role='client',
                notification_type='revision_rejected',
                message=f"Freelancer declined the revision request for '{instance.contract.project.title}'",
                related_id=instance.contract.id
            )
            send_realtime_notification(notif)


@receiver(post_save, sender=Payment)
def payment_notifications(sender, instance, created, **kwargs):
    if not created and instance.status == 'released':
        notif = Notification.objects.create(
            recipient=instance.contract.freelancer,
            target_role='freelancer',
            notification_type='payment_credited',
            message=f"Payment of ${instance.freelancer_share} has been credited to your account!",
            related_id=instance.contract.id
        )
        send_realtime_notification(notif)

    
