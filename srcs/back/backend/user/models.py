from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=11, unique=(True))
    is42stud = models.BooleanField(default=False)
    first_name = models.CharField(default="S/O")
    last_name = models.CharField(default="S/O")
    email = models.CharField(default="S/O")
    profil_pic = models.URLField(default="https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-16.jpg")
    is2FA = models.BooleanField(default=False, null=True)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)
    win_count = models.BigIntegerField(default=0)
    lose_count = models.BigIntegerField(default=0)
    tourney_win_count = models.BigIntegerField(default=0)
    hangman_score = models.BigIntegerField(default=0)
    hangman_win_count = models.BigIntegerField(default=0)
    hangman_lose_count = models.BigIntegerField(default=0)
    hangman_find_letter = models.BigIntegerField(default=0)
    hangman_miss_letter = models.BigIntegerField(default=0)
    default_map_index = models.IntegerField(default=0)
    default_paddle_index = models.IntegerField(default=0)
    default_points_index = models.IntegerField(default=0)
    is_in_a_game = models.BooleanField(default=False)

class Hangman(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    word = models.CharField()
    finded = models.BooleanField(default=False)
    date = models.CharField()
    word_group = models.CharField(default="Normal")
    skin = models.URLField(default="Normal")

class Match(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    result = models.CharField(max_length=15)
    score_left = models.IntegerField(default=0)
    score_right = models.IntegerField(default=0)
    date = models.CharField()
    time = models.BigIntegerField(default=0)
    type = models.CharField(default="Undefined")
    longest_exchange = models.BigIntegerField(default=0)
    shortest_exchange = models.BigIntegerField(default=0)
    map_index = models.IntegerField(default=0)
    design_index = models.IntegerField(default=0)
    is_tourney = models.BooleanField(default=False)
    opponent = models.CharField(default="null")
    #score_history = ArrayField(models.CharField())

class Tourney(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    
    winner_match1 = models.CharField(unique=(False))
    winner_match2 = models.CharField(unique=(False))
    winner_match3 = models.CharField(unique=(False))
    winner_match4 = models.CharField(unique=(False))
    winner_match5 = models.CharField(unique=(False))
    winner_match6 = models.CharField(unique=(False))
    winner_match7 = models.CharField(unique=(False))

    tourney_id = models.CharField(unique=(True))

class TourneyPlayer(models.Model):
    name = models.CharField(unique=(False))
    tourney = models.CharField()
    isUser = models.BooleanField(default=False)

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_sessions'

class BlockedUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blocking')
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_blocked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blocked_users'
        unique_together = ('user', 'blocked_user')

class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')  # Prevent duplicate friendships