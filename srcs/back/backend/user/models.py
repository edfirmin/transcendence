from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=11, unique=(True))
    is42stud = models.BooleanField(default=False)
    first_name = models.CharField(default="Undefined")
    last_name = models.CharField(default="Undefined")
    email = models.CharField(default="Undefined")
    profil_pic = models.URLField(default="https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-16.jpg")
    is2FA = models.BooleanField(default=False, null=True)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)
    lala = models.BigIntegerField()
    