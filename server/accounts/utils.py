import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .models import User
class OTPService:

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send(email, purpose="default", ttl=300):
        cooldown_key = f"otp_cooldown:{email}"
        otp_key = f"otp:{purpose}:{email}"

        if not cache.add(cooldown_key, True, timeout=60):
            return {"error": "Please wait before requesting another OTP."}

        otp = OTPService.generate_otp()

        cache.set(otp_key, otp, timeout=ttl)

        cache.set(cooldown_key, True, timeout=60)

        subject = "Your Grolance Verification Code"

        text_content = (
            f"Your OTP code is {otp}. "
            f"It is valid for {ttl // 60} minutes."
        )

        html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #111827;">Grolance Email Verification</h2>
          
          <p>Your One-Time Password (OTP) is:</p>

          <div style="
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #2563eb;
              text-align: center;
              padding: 12px;
              border: 2px dashed #2563eb;
              border-radius: 6px;
              margin: 20px 0;
          ">
            {otp}
          </div>

          <p>This OTP is valid for <strong>{ttl // 60} minutes</strong>.</p>

          <p style="color: #6b7280; font-size: 13px;">
            If you didn’t request this, please ignore this email.
          </p>

          <p style="margin-top: 20px;">
            — Grolance Team
          </p>
        </div>
      </body>
        </html>
    """
        try:
            email_message = EmailMultiAlternatives(
            subject=subject,
            body=text_content,          # fallback text
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
            )

            email_message.attach_alternative(html_content, "text/html")
            email_message.send()
            
        except Exception as e:
            cache.delete(otp_key)
            cache.delete(cooldown_key)
            return {"error": f"Failed to send email: {e}"}

        return {"success": True}

    @staticmethod
    def verify(email, user_otp, purpose="default"):
        otp_key = f"otp:{purpose}:{email}"
        saved_otp = cache.get(otp_key)

        if not saved_otp:
            return {"error": "OTP expired"}

        if saved_otp != user_otp:
            return {"error": "Invalid OTP"}

        cache.delete(otp_key)

        return {"success": True}


otp_service = OTPService()


class PasswordResetService:
  token_generator = PasswordResetTokenGenerator()
  @staticmethod
  def generatetoken(user:User):
      uid = urlsafe_base64_encode(force_bytes(user.pk))
      token = PasswordResetService.token_generator.make_token(user)
      return {
            "uid": uid,
            "token": token
        }

  @staticmethod
  def validate_token(uid, token) :
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return None
        
        if PasswordResetService.token_generator.check_token(user, token):
            return user

        return None


  
  @staticmethod
  def send_reset_link(email, uid, token):
        reset_url = (
            f"{settings.FRONTEND_URL}/reset-password"
            f"?uid={uid}&token={token}"
        )

        subject = "Reset your Grolance password"

        text_content = f"""
        You requested a password reset.

        Click the link below to reset your password:
        {reset_url}

        If you didn’t request this, ignore this email.
        """

        html_content = f"""
        <html>
          <body style="font-family: Arial;">
            <h2>Password Reset</h2>
            <p>Click the button below to reset your password:</p>

            <a href="{reset_url}"
               style="padding:12px 20px;background:#2563eb;color:#fff;
                      text-decoration:none;border-radius:6px;">
              Reset Password
            </a>

            <p style="margin-top:20px;color:#6b7280;">
              If you didn’t request this, ignore this email.
            </p>
          </body>
        </html>
        """

        email_message = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        email_message.attach_alternative(html_content, "text/html")
        email_message.send()
  
reset_password_service = PasswordResetService()