from django.urls import re_path
from django.urls import path
from . import consumers

websocket_urlpatterns= [
    re_path(r'ws/global', consumers.GlobalConsumer.as_asgi()),
    path('ws/pong/<str:roomid>', consumers.PongConsumer.as_asgi()),
    path('ws/multipong/<str:roomid>', consumers.MultiPongConsumer.as_asgi())
]