from django.shortcuts import render
from .models import User
from rest_framework.views import APIView
from .serializers import UserSerializer, CreatUserSerializer
from rest_framework.response import Response
from django.http import JsonResponse
import logging
logger = logging.getLogger(__name__)
import jwt, datetime
# Create your views here.

class CreatUserView(APIView):
    def post(self, request):
        myData = request.data
        myUserToSave = CreatUserSerializer(data=myData)

        if myUserToSave.is_valid():
            myUserToSave.save()
        
        logger.info("LE USER EST CREEE")
        return Response(myUserToSave.data)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username=username).first()

        if user is None:
            logging.info("PAS BON 1")
            return Response({
                'message' : 'pas bon user'
            })
        
        if (user.is42stud==False):
            if not user.check_password(password):
                logging.info("PAS BON 2")
                return Response({
                   'message' : 'pas bon mdp'
                })
        
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
    # logger.info("MON ID USER ---> %s", user_id)
    myUser = User.objects.get(id=user_id)

    # logger.info("OBJET DB myUser ---> %s", myUser)
    myUserSer = UserSerializer(myUser)

    # logger.info("myUserSer ---> %s", myUserSer

    myUserFinal = myUserSer.data

    # logger.info("myUserFinal ---> %s", myUserFinal)

    return JsonResponse(myUserFinal, safe=False)


        
