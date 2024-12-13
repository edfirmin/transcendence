from django.urls import path, include
from .views import *

urlpatterns = [
    path('getUser/', getUser, name="getUser"),
    path('register/', CreatUserView.as_view(), name="register"),
    path('token/', LoginView.as_view(), name="login"),
    path('qrcode/', getQrcode, name="get_qrcode"),
]