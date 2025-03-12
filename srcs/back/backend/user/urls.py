from django.urls import path, include
from .views import *

urlpatterns = [
    path('getUser/', getUser, name="getUser"),
    path('getUserWithUsername/', getUserWithUsername, name="getUserWithUsername"),
    path('getUserWithId/', getUserWithId, name="getUserWithId"),
    path('getAllUserExceptLoggedOne/', getAllUserExceptLoggedOne, name="getAllUserExceptLoggedOne"),
    path('getMatches/', getMatches, name="getMatches"),
    path('getTourney/', getTourney, name="getTourney"),
    path('getTourneyPlayers/', getTourneyPlayers, name="getTourneyPlayers"),
    path('register/', CreatUserView.as_view(), name="register"),
    path('token/', LoginView.as_view(), name="login"),
    path('qrcode/', getQrcode, name="get_qrcode"),
    path('edit/', EditUserView.as_view(), name="EditUser"),
    path('active2fa/',Enable2FAView.as_view() ,name="active2fa"),
    path('desactiver2fa/',Disable2FAView.as_view() ,name="desactiver2fa"),
    path('addMatchStats/', AddMatchStats.as_view() ,name="addMatchStats"),
    path('addMatchStatsWithUsername/', AddMatchStatsWithUsername.as_view() ,name="addMatchStatsWithUsername"),
    path('addTourneyStats/', AddTourneyStats.as_view() ,name="addTourneyStats"),
    path('addWinnerToTourney/', AddWinnerToTourney.as_view() ,name="addWinnerToTourney"),
    path('addTourneyWinCount/', AddTourneyWinCount.as_view() ,name="addTourneyWinCount"),
    path('addTourneyPlayer/', AddTourneyPlayer.as_view() ,name="addTourneyPlayer"),
    path('addScoreHangman/', AddScoreHangman.as_view() ,name="addScoreHangman")
]