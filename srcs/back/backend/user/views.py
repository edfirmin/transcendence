from django.shortcuts import render
from .models import User
from .models import Match
from .models import Tourney
from rest_framework.views import APIView
from .serializers import UserSerializer, CreatUserSerializer, MatchSerializer, TourneySerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.http import JsonResponse
import logging
logger = logging.getLogger(__name__)
import jwt, datetime
import pyotp
import qrcode
import io
import base64
# Create your views here.

def check2fa(user, code):
    totp = pyotp.TOTP(user.mfa_secret)
    if totp.verify(code):
        user.is2FA = True
        user.save()
        return True
    return (False)

def is2fa(username):
    user = User.objects.filter(username=username).first()
    if user is None:
        return (False)
    if user.is2FA == True :
        return (True)
    return (False)

def getQrcode(request):
    myPath = request.build_absolute_uri()
    token_string = myPath.split("?")[1]
    token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
    user_id = token.get('id')
    user = User.objects.get(id=user_id)


    if not user.mfa_secret:
        user.mfa_secret = pyotp.random_base32()
        user.save()

    otp_uri = pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(
        name=user.username,
        issuer_name="SnowPong"
    )

    qr = qrcode.make(otp_uri)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")

    buffer.seek(0)
    qr_code = base64.b64encode(buffer.getvalue()).decode("utf-8")

    qr_code_data_uri = f"data:image/png;base64,{qr_code}"
    data = {
        "qrcode": qr_code_data_uri,
        "key" : user.mfa_secret
    }
    
    return JsonResponse(data, safe=False)

class CreatUserView(APIView):
    def post(self, request):
        # if (request.data['username'] == "" | request.data['password'] == ""):
        #     return Response(False)
        myData = request.data
        username = myData['username']
        if (User.objects.filter(username=username).first()):
            return Response (True)
        if (username.find("_42") != -1):
            return Response(False)
        myUserToSave = CreatUserSerializer(data=myData)
        if myUserToSave.is_valid(raise_exception=True):
            myUserToSave.save()
        
        logger.info("LE USER EST CREEE ->>>>>>>>>> %s", myData['username'])
        return JsonResponse(username, safe=False)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        code2fa = request.data['code2fa']

        user = User.objects.filter(username=username).first()

        if user is None:
            logging.info("PAS BON 1")
            return Response(False)
        
        if (user.is42stud==False):
            if not user.check_password(password):
                logging.info("PAS BON 2")
                return Response(False)
        if (is2fa(username)) :
            if (code2fa == ""):
                return JsonResponse({"is2fa": "true"}, safe=False)
            else :
                if (check2fa(user ,code2fa)):
                    pass
                else :
                    raise AuthenticationFailed('pas bon code 2FA')

        payload = {
            'id' : user.id,
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=1000000000),
            'iat' : datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.data = {
            'jwt' : token
        }
        # decode = jwt.decode(token, 'secret', algorithms=['HS256'])
        # logging.info("MON TOKEN C'EST ->>>>>>>> %s", decode.get('id'))

        return response


def getUser(request):
    myPath = request.build_absolute_uri()
    token_string = myPath.split("?")[1]
    token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
    user_id = token.get('id')
    myUser = User.objects.get(id=user_id)

    # logger.info("OBJET DB myUsfrom django.contrib.auth importer ---> %s", myUser)
    myUserSer = UserSerializer(myUser)

    # logger.info("myUserSer ---> %s", myUserSer)

    myUserFinal = myUserSer.data

    # logger.info("myUserFinal ---> %s", myUserFinal)

    return JsonResponse(myUserFinal, safe=False)

def getMatches(request):
    myPath = request.build_absolute_uri()
    token_string = myPath.split("?")[1]
    token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
    user_id = token.get('id')
    matches = Match.objects.filter(user=user_id)

    matchesSer = MatchSerializer(matches, many=True)
    return JsonResponse(matchesSer.data, safe=False)

def getTourney(request):
    myPath = request.build_absolute_uri()
    token_string = myPath.split("?")[1]
    tourney = Tourney.objects.get(tourney_id=token_string)

    logger.info(tourney)
    tourneySer = TourneySerializer(tourney, many=False)
    return JsonResponse(tourneySer.data, safe=False)


class EditUserView(APIView):
    def post (self, request):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        user = User.objects.get(id=user_id)

        fname = request.data['fname']
        lname = request.data['lname']
        pp = request.data['newpp']
        mail = request.data['newmail']

        if fname:
            user.first_name = fname
        if lname:
            user.last_name = lname
        if pp:
            user.profil_pic = pp
        if mail:
            user.email = mail
        user.save()
        return Response(request.data)

class Enable2FAView(APIView):
    def post(self, request):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        myUser = User.objects.get(id=user_id)

        code = request.data['code2fa']
        if (check2fa(myUser, code)):
            myUser.is2FA = True
            myUser.save()
            return Response(True)
        else :
            return Response(False)

class Disable2FAView(APIView):
    def post(self, rePlayer2quest):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        myUser = User.objects.get(id=user_id)

        myUser.is2FA = False
        myUser.save()
        return Response(True)

# def verify_2fa_otp(user, otp):
#     totp = pyotp.TOTP(user.mfa_secret)
#     totp.verify(otp)

class AddMatchStats(APIView):
    def post(self, request):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        myUser = User.objects.get(id=user_id)

        #create match
        match = Match(user=myUser, result=request.data['result'], date=request.data['date'],
                      score_left=request.data['score_left'], score_right=request.data['score_right'],
                      time=request.data['time'], type=request.data['type'], longest_exchange=request.data['longest_exchange'],
                      shortest_exchange=request.data['shortest_exchange'])
        match.save()

        if (request.data['result'] == "VICTOIRE"):
            myUser.win_count = myUser.win_count + 1
        else:
            myUser.lose_count = myUser.lose_count + 1

        myUser.save()
        return Response(True)
    
class AddTourneyStats(APIView):
    def post(self, request):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        myUser = User.objects.get(id=user_id)

        tourney = Tourney(user=myUser, name1=request.data['name1'], name2=request.data['name2'],
                          name3=request.data['name3'], name4=request.data['name4'],
                          name5=request.data['name5'], name6=request.data['name6'],
                          name7=request.data['name7'], name8=request.data['name8'],
                          tourney_id=request.data['tourney_id'])

        tourney.save()
        return Response(True)
    
class AddWinnerToTourney(APIView):
    def post(self, request):
        tourney_id = request.data['tourney_id']
        tourney = Tourney.objects.get(tourney_id=tourney_id)

        winner = request.data['winner']
        match_number = request.data['match_number']
        if (match_number == 1):
            tourney.winner_match1 = winner
        if (match_number == 2):
            tourney.winner_match2 = winner        
        if (match_number == 3):
            tourney.winner_match3 = winner
        if (match_number == 4):
            tourney.winner_match4 = winner
        if (match_number == 5):
            tourney.winner_match5 = winner
        if (match_number == 6):
            tourney.winner_match6 = winner
        if (match_number == 7):
            tourney.winner_match7 = winner
        
        tourney.save()
        return Response(True)
    
class AddTourneyWinCount(APIView):
    def post(self, request):
        token_string = request.data['userToken']
        token = jwt.decode(token_string, 'secret', algorithms=['HS256'])
        user_id = token.get('id')
        myUser = User.objects.get(id=user_id)

        myUser.tourney_win_count = myUser.tourney_win_count + 1

        myUser.save()
        return Response(True)