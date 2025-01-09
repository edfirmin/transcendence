from django.shortcuts import render
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer, CreatUserSerializer
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
    
    return JsonResponse({"qrcode": qr_code_data_uri}, safe=False)

class CreatUserView(APIView):
    def post(self, request):
        myData = request.data
        myUserToSave = CreatUserSerializer(data=myData)

        if myUserToSave.is_valid(raise_exception=True):
            myUserToSave.save()
        
        logger.info("LE USER EST CREEE ->>>>>>>>>> %s", myData['username'])
        return Response(myUserToSave.data)

class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        code2fa = request.data['code2fa']

        user = User.objects.filter(username=username).first()

        if user is None:
            logging.info("PAS BON 1")
            raise AuthenticationFailed('pas bon user')
        
        if (user.is42stud==False):
            if not user.check_password(password):
                logging.info("PAS BON 2")
                raise AuthenticationFailed('pas bon mdp')
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

    
# def verify_2fa_otp(user, otp):
#     totp = pyotp.TOTP(user.mfa_secret)
#     totp.verify(otp)


