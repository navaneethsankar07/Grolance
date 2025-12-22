import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .models import User
from .tasks import send_otp_email_task, send_password_reset_email_task



class OTPService:

    @staticmethod
    def generate_otp():
        print('otp generated')
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
        print('otp sended')
        send_otp_email_task.delay(
        email=email,
        subject=subject,
        text_content=text_content,
        html_content=html_content,
    )

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
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="
    margin:0;
    padding:0;
    background-color:#f5f7fa;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              max-width:520px;
              background:#ffffff;
              border-radius:8px;
              padding:32px;
              box-shadow:0 4px 12px rgba(0,0,0,0.08);
            "
          >
            <tr>
              <td style="text-align:center;">
                <h1 style="
                  margin:0 0 16px;
                  font-size:26px;
                  color:#111827;
                ">
                  Password Reset
                </h1>

                <p style="
                  margin:0 0 24px;
                  font-size:15px;
                  color:#374151;
                  line-height:1.6;
                ">
                  You requested to reset your Grolance account password.
                  Click the button below to continue.
                </p>

                <a
                  href="{reset_url}"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    background-color:#2563eb;
                    color:#ffffff;
                    font-size:16px;
                    font-weight:600;
                    text-decoration:none;
                    border-radius:6px;
                  "
                >
                  Reset Password
                </a>

                <p style="
                  margin:28px 0 0;
                  font-size:13px;
                  color:#6b7280;
                  line-height:1.5;
                ">
                  If you didn’t request this password reset, you can safely
                  ignore this email.
                </p>

                <p style="
                  margin:32px 0 0;
                  font-size:13px;
                  color:#9ca3af;
                ">
                  — Grolance Team
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


        send_password_reset_email_task.delay(
        email=email,
        subject=subject,
        text_content=text_content,
        html_content=html_content,
    )
  
reset_password_service = PasswordResetService()