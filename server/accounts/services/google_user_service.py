from accounts.models import User

class GoogleUserService:

    @staticmethod
    def get_or_create_user(payload):
        email = payload.get("email")
        full_name = payload.get("name")
        picture = payload.get("picture")
        sub = payload.get("sub")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "is_google_account": True,
                "google_sub": sub,
                "profile_photo": picture,
            }
        )

        # Link existing non-Google account safely
        if not created and not user.is_google_account:
            user.is_google_account = True
            user.google_sub = sub

            if not user.profile_photo:
                user.profile_photo = picture

            user.save()

        return user
