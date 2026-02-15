from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 5})
def send_support_reply_email_task(self, email, subject, text_content, html_content):
    print(f'Sending support reply to {email}')
    email_message = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()