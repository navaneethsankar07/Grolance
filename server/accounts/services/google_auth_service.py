from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from accounts.models import User

class GoogleAuthService:

    @staticmethod
    def verify_token(token: str):
        try:
            payload = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except Exception:
            return None

        return payload

    @staticmethod
    def get_or_create_user(payload):
        email = payload.get("email")
        full_name = payload.get("name", "")
        picture = payload.get("picture")
        sub = payload.get("sub")  # Google unique ID

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "is_google_account": True,
                "google_sub": sub,
                "profile_picture": picture,
            }
        )

        # 🔗 Link existing email/password user with Google
        if not created and not user.is_google_account:
            user.is_google_account = True
            user.google_sub = sub

            if not user.profile_picture:
                user.profile_picture = picture

            user.set_unusable_password()
            user.save()

        return user
