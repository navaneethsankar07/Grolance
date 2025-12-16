import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "grolance_backend.settings")

app = Celery("grolance_backend")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
