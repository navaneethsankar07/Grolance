from django.conf import settings
from .tasks import send_support_reply_email_task

class SupportTicketService:
    @staticmethod
    def send_admin_reply(ticket):
        subject = f"Update on your Support Ticket #{ticket.id}: {ticket.subject}"
        
        text_content = (
            f"Hello {ticket.user.full_name},\n\n"
            f"An admin has replied to your support ticket:\n\n"
            f"Reply: {ticket.admin_reply}\n\n"
            f"Status: {ticket.get_status_display()}\n\n"
            f"Thank you for using Grolance."
        )

        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h2 style="color: #111827; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Support Ticket Update</h2>
              <p style="color: #374151; font-size: 16px;">Hello <strong>{ticket.user.full_name}</strong>,</p>
              <p style="color: #374151;">Our support team has responded to your ticket regarding <strong>"{ticket.subject}"</strong>.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; color: #1f2937; margin-bottom: 8px;">Admin Response:</p>
                <p style="margin: 0; color: #4b5563; line-height: 1.6;">{ticket.admin_reply}</p>
              </div>

              <p style="font-size: 14px; color: #6b7280;">
                Current Status: <span style="font-weight: bold; color: #2563eb;">{ticket.status}</span>
              </p>
              
              <p style="margin-top: 30px; border-top: 1px solid #f3f4f6; pt-20px; color: #9ca3af; font-size: 12px;">
                — Grolance Support Team
              </p>
            </div>
          </body>
        </html>
        """

        send_support_reply_email_task.delay(
            email=ticket.user.email,
            subject=subject,
            text_content=text_content,
            html_content=html_content
        )

support_ticket_service = SupportTicketService()