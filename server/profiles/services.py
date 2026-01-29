import random
import hashlib

from django.core.cache import cache
from django.conf import settings

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

OTP_LENGTH = 6
OTP_TTL_SECONDS = 300       
MAX_OTP_ATTEMPTS = 3


def _generate_otp():
    return str(random.randint(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH - 1))


def _hash_otp(otp: str):
    return hashlib.sha256(otp.encode()).hexdigest()


def _otp_cache_key(phone: str):
    return f"otp:phone:{phone}"


def _attempts_cache_key(phone: str):
    return f"otp:attempts:{phone}"



def _store_otp(phone: str, otp: str) :
    cache.set(
        _otp_cache_key(phone),
        _hash_otp(otp),
        timeout=OTP_TTL_SECONDS,
    )

    cache.set(
        _attempts_cache_key(phone),
        0,
        timeout=OTP_TTL_SECONDS,
    )


def _send_sms(phone: str, otp: str):
    print('hello')
    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

        client.messages.create(
            body=f"Your Grolance verification code is {otp}. It expires in 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=f"+91{phone}", 
        )

    except TwilioRestException as exc:
        raise RuntimeError("Failed to send OTP SMS") from exc


def send_phone_otp(phone: str) -> None:
    otp = _generate_otp()
    _store_otp(phone, otp)
    print(otp)
    # _send_sms(phone, otp)



def verify_phone_otp(phone: str, entered_otp: str) -> bool:
    otp_key = _otp_cache_key(phone)
    attempts_key = _attempts_cache_key(phone)

    stored_hash = cache.get(otp_key)
    if not stored_hash:
        return False 

    attempts = cache.get(attempts_key, 0)
    if attempts >= MAX_OTP_ATTEMPTS:
        cache.delete_many([otp_key, attempts_key])
        return False

    if _hash_otp(entered_otp) == stored_hash:
        cache.delete_many([otp_key, attempts_key])
        return True

    cache.incr(attempts_key)
    return False
