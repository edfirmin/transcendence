from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is42stud = models.BooleanField(default=False)
    first_name = None
    last_name = None
    profil_pic = models.URLField(default="https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-16.jpg")
    is2FA = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)
    