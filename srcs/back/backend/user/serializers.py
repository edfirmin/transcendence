from .models import User
from .models import Match
from .models import Tourney
from .models import TourneyPlayer
from .models import Hangman
from .models import Friend
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is42stud", "profil_pic", "is2FA", "first_name", "last_name", "email", "win_count", "lose_count", "tourney_win_count", "hangman_score", "hangman_win_count", "hangman_lose_count", "hangman_find_letter", "hangman_miss_letter", "default_map_index", "default_paddle_index", "default_points_index", "is_in_a_game"]
        extra_kwargs = {"password": {"write_only": True}}#pour dire a django d;accepter le mdp, dans oin cree un user, mais qu'on ne "return" pas le mdp quand on demande des info sur le user

class CreatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "is42stud", "profil_pic", "is2FA", "mfa_secret", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}#pour dire a django d;accepter le mdp, dans oin cree un user, mais qu'on ne "return" pas le mdp quand on demande des info sur le user

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None :
            instance.set_password(password)
        instance.save()
        return (instance)


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["result", "date", "score_left", "score_right", "user", "time", "type", "longest_exchange", "shortest_exchange", "map_index", "design_index", "is_tourney", "opponent"]


class TourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tourney
        fields = ["winner_match1", "winner_match2", "winner_match3", "winner_match4", "winner_match5", "winner_match6", "winner_match7", "user", "tourney_id"]


class TourneyPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourneyPlayer
        fields = ["tourney", "name", "isUser"]

class HangmanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hangman
        fields = ["user", "word", "finded", "date", "word_group", "skin"]

class FriendSerializer(serializers.ModelSerializer):
    friend_details = UserSerializer(source='friend', read_only=True)
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ['id', 'friend', 'friend_details', 'is_online', 'created_at']

    def get_is_online(self, obj):
        from backend.consumers import OnlineUsersConsumer
        return OnlineUsersConsumer.is_user_online(obj.friend.id)