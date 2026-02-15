"""
ASGI config for grolance_bakend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from communication.middleware import JwtAuthMiddleware
import communication.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'grolance_backend.settings')

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket':JwtAuthMiddleware(
        URLRouter(
            communication.routing.websocket_urlpatterns            
        )
    )

})
