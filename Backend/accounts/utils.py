import random
from django.core.cache import cache
from django.core.mail import send_mail


class OTPService:

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send(email, purpose="default", ttl=300):
        """
        ttl = OTP lifetime (seconds)
        cooldown = 60 seconds per email
        """

        cooldown_key = f"otp_cooldown:{email}"
        otp_key = f"otp:{purpose}:{email}"

        if cache.get(cooldown_key):
            return {"error": "Please wait before requesting another OTP."}

        otp = OTPService.generate_otp()

        cache.set(otp_key, otp, timeout=ttl)

        cache.set(cooldown_key, True, timeout=60)

        subject = "Your Grolance OTP"
        message = (
            f"Your OTP is: {otp}\n"
            "This OTP will expire in 5 minutes.\n"
        )

        try:
            send_mail(subject, message, None, [email], fail_silently=False)
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
