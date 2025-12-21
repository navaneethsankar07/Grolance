from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

class GoogleAuthService:

    @staticmethod
    def verify_id_token(token: str):
        try:
            payload = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            return payload
        except Exception:
            return None
