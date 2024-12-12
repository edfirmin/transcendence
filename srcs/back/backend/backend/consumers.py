from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
import time
import asyncio
import logging

logging.basicConfig(level=logging.DEBUG)  # Définir le niveau des logs
logger = logging.getLogger(__name__)     # Créer un logger avec un nom unique

class GlobalConsumer(AsyncWebsocketConsumer):
    

    async def connect(self):
        await self.accept()

        await self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':'You are now connected!'
        }))

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        if (message == "left_paddle_down"):
            if self.left_paddle_pos[1] > self.down_limit:
                return

            self.left_paddle_pos[1] += 1
            await self.send(text_data=json.dumps({
                'type':'left_paddle_down',
                'message': self.left_paddle_pos[1]
        }))

        if self.game_task == None:
            self.game_task = asyncio.create_task(self.main_loop())


    async def disconnect(self, close_code):
        logger.info("salut mon pote")

class MultiPongConsumer(AsyncJsonWebsocketConsumer):
    
    players = {}
    ball_pos = {}
    ball_direction = {}
    ball_speed = {}
    left_paddle_pos = {}
    right_paddle_pos = {}
    score = {}
    game_task = {}
    up_limit = 60
    down_limit = 440
    score_to_win = 5
    is_ai = False
    difficulty = "medium"
    nb_players_connected = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomid']
        self.room_group_name = f'game_{self.room_name}'

        logger.info(f"Player connected to room {self.room_group_name}")

        if (MultiPongConsumer.nb_players_connected[self.room_name] > 2):
            return

        # Join the game group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send connection established message
        await self.send_message("connection_established_type", "connection_established")

        # Initialize game state
        if self.room_name not in MultiPongConsumer.nb_players_connected:
            MultiPongConsumer.nb_players_connected[self.room_name] = 1
        else:
            MultiPongConsumer.nb_players_connected[self.room_name] += 1

        if self.room_name not in MultiPongConsumer.players:
            MultiPongConsumer.players[self.room_name] = [None, None]
        if self.room_name not in MultiPongConsumer.ball_pos:
            MultiPongConsumer.ball_pos[self.room_name] = [400, 250]
        if self.room_name not in MultiPongConsumer.ball_speed:
            MultiPongConsumer.ball_speed[self.room_name] = 2
        if self.room_name not in MultiPongConsumer.ball_direction:
            MultiPongConsumer.ball_direction[self.room_name] = [1, 1]
        if self.room_name not in MultiPongConsumer.left_paddle_pos:
            MultiPongConsumer.left_paddle_pos[self.room_name] = [0, 250]
        if self.room_name not in MultiPongConsumer.right_paddle_pos:
            MultiPongConsumer.right_paddle_pos[self.room_name] = [0, 250]
        if self.room_name not in MultiPongConsumer.score:
            MultiPongConsumer.score[self.room_name] = [0, 0]
        if self.room_name not in MultiPongConsumer.game_task:
            MultiPongConsumer.game_task[self.room_name] = None

        if MultiPongConsumer.nb_players_connected[self.room_name] == 2:
            await self.send_message("begin_countdown_type", "oui")

        logger.info(f"nb player connected  to {self.room_name} = {MultiPongConsumer.nb_players_connected[self.room_name]}")

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']
        id = data_json['id']

        logger.info(self.ball_pos)

        if (message == "on_connect"):
            if (MultiPongConsumer.players[self.room_name][0] == None):
                MultiPongConsumer.players[self.room_name][0] = id
            else:
                MultiPongConsumer.players[self.room_name][1] = id

        if (message == "begin_match" and MultiPongConsumer.game_task[self.room_name] == None):
            MultiPongConsumer.game_task[self.room_name] = asyncio.create_task(self.main_loop())
            logger.info(f"game started")

        if (message == "paddle_down"):
            # Left
            if (id == MultiPongConsumer.players[self.room_name][0]):

                if MultiPongConsumer.left_paddle_pos[self.room_name][1] > self.down_limit:
                    return

                MultiPongConsumer.left_paddle_pos[self.room_name][1] += 5
            
                await self.send_message("left_paddle_down_type", MultiPongConsumer.left_paddle_pos[self.room_name][1])

            # Right
            else:
                
                if MultiPongConsumer.right_paddle_pos[self.room_name][1] > self.down_limit:
                    return

                MultiPongConsumer.right_paddle_pos[self.room_name][1] += 5
                await self.send_message("right_paddle_down_type", MultiPongConsumer.right_paddle_pos[self.room_name][1])


        if (message == "paddle_up"):
            # Left
            if (id == MultiPongConsumer.players[self.room_name][0]):

                if MultiPongConsumer.left_paddle_pos[self.room_name][1] < self.up_limit:
                    return

                MultiPongConsumer.left_paddle_pos[self.room_name][1] -= 5
                await self.send_message("left_paddle_up_type", MultiPongConsumer.left_paddle_pos[self.room_name][1])

            # Right
            else:
                if MultiPongConsumer.right_paddle_pos[self.room_name][1] < self.up_limit:
                    return

                MultiPongConsumer.right_paddle_pos[self.room_name][1] -= 5
                await self.send_message("right_paddle_up_type", MultiPongConsumer.right_paddle_pos[self.room_name][1])


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        MultiPongConsumer.nb_players_connected[self.room_name] -= 1
        logger.info(f"nb player connected  to {self.room_name} = {MultiPongConsumer.nb_players_connected[self.room_name]}")

        await self.send_message("winner_type", "YOU")

        if MultiPongConsumer.game_task[self.room_name]:
            MultiPongConsumer.game_task[self.room_name].cancel()

    async def main_loop(self):
        while True:
            # Ceilling and Floor Ball Detection
            if (MultiPongConsumer.ball_pos[self.room_name][1] + MultiPongConsumer.ball_direction[self.room_name][1] > 490 or MultiPongConsumer.ball_pos[self.room_name][1] + MultiPongConsumer.ball_direction[self.room_name][1] < 10):
                MultiPongConsumer.ball_direction[self.room_name][1] *= -1
               # await self.send(text_data=json.dumps({
               #     'type':'hit'
               # }))

            # right side
            if (MultiPongConsumer.ball_pos[self.room_name][0] + MultiPongConsumer.ball_direction[self.room_name][0] > 750):
                if (MultiPongConsumer.ball_pos[self.room_name][1] < MultiPongConsumer.right_paddle_pos[self.room_name][1] + 60 and MultiPongConsumer.ball_pos[self.room_name][1] > MultiPongConsumer.right_paddle_pos[self.room_name][1] - 60):
                    MultiPongConsumer.ball_direction[self.room_name][0] *= -1
                    MultiPongConsumer.ball_speed[self.room_name] += 1
                else:
                    MultiPongConsumer.score[self.room_name][0] += 1
                    # check winner
                    if (MultiPongConsumer.score[self.room_name][0] >= self.score_to_win):
                        await self.send_message("winner_type", "LEFT")
                        MultiPongConsumer.game_task[self.room_name].cancel()

                    await self.channel_layer.group_send(
                        self.room_group_name,{
                            'type':'score_type',
                            'left': MultiPongConsumer.score[self.room_name][0],
                            'right': MultiPongConsumer.score[self.room_name][1]
                        })
                    MultiPongConsumer.ball_pos[self.room_name] = [400, 250]
                    MultiPongConsumer.ball_speed[self.room_name] = 3

            # left side
            if (MultiPongConsumer.ball_pos[self.room_name][0] + MultiPongConsumer.ball_direction[self.room_name][0] < 50):
                if (MultiPongConsumer.ball_pos[self.room_name][1] < MultiPongConsumer.left_paddle_pos[self.room_name][1] + 60 and MultiPongConsumer.ball_pos[self.room_name][1] > MultiPongConsumer.left_paddle_pos[self.room_name][1] - 60):
                    MultiPongConsumer.ball_direction[self.room_name][0] *= -1
                    MultiPongConsumer.ball_speed[self.room_name] += 1
                else:
                    MultiPongConsumer.score[self.room_name][1] += 1

                    # check winner
                    if (MultiPongConsumer.score[self.room_name][1] >= self.score_to_win):
                        await self.send_message("winner_type", "RIGHT")
                        MultiPongConsumer.game_task[self.room_name].cancel()

                    await self.channel_layer.group_send(
                        self.room_group_name,{
                            'type':'score_type',
                            'left': MultiPongConsumer.score[self.room_name][0],
                            'right': MultiPongConsumer.score[self.room_name][1]
                        })

                    # re-init ball
                    MultiPongConsumer.ball_pos[self.room_name] = [400, 250]
                    MultiPongConsumer.ball_speed[self.room_name] = 3


            MultiPongConsumer.ball_pos[self.room_name][0] += MultiPongConsumer.ball_direction[self.room_name][0] * MultiPongConsumer.ball_speed[self.room_name]
            MultiPongConsumer.ball_pos[self.room_name][1] += MultiPongConsumer.ball_direction[self.room_name][1] * MultiPongConsumer.ball_speed[self.room_name]

            await self.channel_layer.group_send(
                self.room_group_name,{
                    'type':'ball_pos_type',
                    'x': MultiPongConsumer.ball_pos[self.room_name][0],
                    'y': MultiPongConsumer.ball_pos[self.room_name][1] 
                })
            await asyncio.sleep(1 / 30)

    async def ball_pos_type(self, event):
        await self.send_json({
                'type': "ball_pos",
                'x': event['x'],
                'y': event['y']
            })
        
    async def left_paddle_down_type(self, event):
        await self.send_json({
                'type': "left_paddle_down",
                'message': event['message']
            })
        
    async def begin_countdown_type(self, event):
        await self.send_json({
                'type': "begin_countdown",
                'message': ""
            })
        

    async def connection_established_type(self, event):
        await self.send_json({
                'type': "connection_established",
                'message': "connection_established"
            })
        
    async def left_paddle_up_type(self, event):
        await self.send_json({
                'type': "left_paddle_up",
                'message': event['message']
            })
        
    async def right_paddle_down_type(self, event):
        await self.send_json({
                'type': "right_paddle_down",
                'message': event['message']
            })
        
    async def right_paddle_up_type(self, event):
        await self.send_json({
                'type': "right_paddle_up",
                'message': event['message']
            })

    async def winner_type(self, event):
        await self.send_json({
                'type': "winner",
                'message': event['message']
            })

    async def score_type(self, event):
        await self.send_json({
                'type': "score",
                'left': event['left'],
                'right': event['right']
            })

    async def send_message(self, _type, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": _type,
                "message": message
            }
        )

class PongConsumer(AsyncWebsocketConsumer):
    
    ball_pos = {}
    ball_direction = {}
    ball_speed = {}
    left_paddle_pos = {}
    right_paddle_pos = {}
    score = {}
    game_task = {}
    up_limit = 60
    down_limit = 440
    score_to_win = {}
    is_ai = {}
    difficulty = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomid']
        self.room_group_name = f'game_{self.room_name}'

        # Join the game group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':'You are now connected!'
        }))

        PongConsumer.ball_pos[self.room_name] = [400, 250]
        PongConsumer.ball_speed[self.room_name] = 3
        PongConsumer.ball_direction[self.room_name] = [1, 1]
        PongConsumer.left_paddle_pos[self.room_name] = [0, 250]
        PongConsumer.right_paddle_pos[self.room_name] = [0, 250]
        PongConsumer.score[self.room_name] = [0, 0]

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        logger.info(self.ball_pos)

        if (message == "isAi"):
            PongConsumer.is_ai[self.room_name] = data_json['value']
        if (message == "difficulty"):
            PongConsumer.difficulty[self.room_name] = data_json['value']
        if (message == "points"):
            PongConsumer.score_to_win[self.room_name] = data_json['value']

        if (message == "left_paddle_down"):
            if PongConsumer.left_paddle_pos[self.room_name][1] > self.down_limit:
                return

            PongConsumer.left_paddle_pos[self.room_name][1] += 5
            await self.send(text_data=json.dumps({
                'type':'left_paddle_down',
                'message': PongConsumer.left_paddle_pos[self.room_name][1]
            }))
        if (message == "left_paddle_up"):
            
            if PongConsumer.left_paddle_pos[self.room_name][1] < self.up_limit:
                return

            PongConsumer.left_paddle_pos[self.room_name][1] -= 5
            await self.send(text_data=json.dumps({
                'type':'left_paddle_up',
                'message': PongConsumer.left_paddle_pos[self.room_name][1]
            }))
        if (message == "right_paddle_up"):
            if PongConsumer.right_paddle_pos[self.room_name][1] < self.up_limit:
                return
            
            PongConsumer.right_paddle_pos[self.room_name][1] -= 5
            await self.send(text_data=json.dumps({
                'type':'right_paddle_up',
                'message': PongConsumer.right_paddle_pos[self.room_name][1]
            }))
        if (message == "right_paddle_down"):
            if PongConsumer.right_paddle_pos[self.room_name][1] > self.down_limit:
                return

            PongConsumer.right_paddle_pos[self.room_name][1] += 5
            await self.send(text_data=json.dumps({
                'type':'right_paddle_down',
                'message': PongConsumer.right_paddle_pos[self.room_name][1]
            }))

        if (message == "begin_game"):
            PongConsumer.game_task[self.room_name] = asyncio.create_task(self.main_loop())


    async def disconnect(self, close_code):
        logger.info("salut mon pote")

        if (PongConsumer.game_task[self.room_name] != None):
            PongConsumer.game_task[self.room_name].cancel()

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        await self.close()

    async def main_loop(self):
        while True:
            # Bot
            if (PongConsumer.is_ai[self.room_name]):

                if (PongConsumer.difficulty[self.room_name] == "easy"):
                    if (PongConsumer.ball_pos[self.room_name][1] > PongConsumer.right_paddle_pos[self.room_name][1] and PongConsumer.right_paddle_pos[self.room_name][1] < self.down_limit):
                        PongConsumer.right_paddle_pos[self.room_name][1] += 2
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_down',
                            'message': PongConsumer.right_paddle_pos[self.room_name][1]
                        }))
                    elif (PongConsumer.ball_pos[self.room_name][1] < PongConsumer.right_paddle_pos[self.room_name][1] and PongConsumer.right_paddle_pos[self.room_name][1] > self.up_limit):
                        PongConsumer.right_paddle_pos[self.room_name][1] -= 2
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_up',
                            'message': PongConsumer.right_paddle_pos[self.room_name][1]
                        }))
                #elif (self.difficulty == "medium"):
                #    if (self.ball_pos[1] > self.right_paddle_pos[1] and self.right_paddle_pos[1] < self.down_limit):
                #        self.right_paddle_pos[1] += 4
                #        await self.send(text_data=json.dumps({
                #            'type':'right_paddle_down',
                #            'message': self.right_paddle_pos[1]
                #        }))
                #    elif (self.ball_pos[1] < self.right_paddle_pos[1] and self.right_paddle_pos[1] > self.up_limit):
                #        self.right_paddle_pos[1] -= 4
                #        await self.send(text_data=json.dumps({
                #            'type':'right_paddle_up',
                #            'message': self.right_paddle_pos[1]
                #        }))
                #else:
                #    if (self.ball_pos[1] > self.right_paddle_pos[1] and self.right_paddle_pos[1] < self.down_limit):
                #        self.right_paddle_pos[1] += 5
                #        await self.send(text_data=json.dumps({
                #            'type':'right_paddle_down',
                #            'message': self.right_paddle_pos[1]
                #        }))
                #    elif (self.ball_pos[1] < self.right_paddle_pos[1] and self.right_paddle_pos[1] > self.up_limit):
                #        self.right_paddle_pos[1] -= 5
                #        await self.send(text_data=json.dumps({
                #            'type':'right_paddle_up',
                #            'message': self.right_paddle_pos[1]
                #        }))

            # Ceilling and Floor Ball Detection
            if (PongConsumer.ball_pos[self.room_name][1] + PongConsumer.ball_direction[self.room_name][1] > 490 or PongConsumer.ball_pos[self.room_name][1] + PongConsumer.ball_direction[self.room_name][1] < 10):
                PongConsumer.ball_direction[self.room_name][1] *= -1
                await self.send(text_data=json.dumps({
                    'type':'hit'
                }))

            # right side
            if (PongConsumer.ball_pos[self.room_name][0] + PongConsumer.ball_direction[self.room_name][0] > 750):
                if (PongConsumer.ball_pos[self.room_name][1] < PongConsumer.right_paddle_pos[self.room_name][1] + 60 and PongConsumer.ball_pos[self.room_name][1] > PongConsumer.right_paddle_pos[self.room_name][1] - 60):
                    PongConsumer.ball_direction[self.room_name][0] *= -1
                    PongConsumer.ball_speed[self.room_name] += 1
                else:
                    PongConsumer.score[self.room_name][0] += 1
                    # check winner
                    if (PongConsumer.score[self.room_name][0] >= PongConsumer.score_to_win[self.room_name]):
                        await self.send(text_data=json.dumps({
                            'type':'winner',
                            'message': "LEFT"
                        }))
                        PongConsumer.game_task[self.room_name].cancel()

                    await self.send(text_data=json.dumps({
                        'type':'score',
                        'left': PongConsumer.score[self.room_name][0],
                        'right': PongConsumer.score[self.room_name][1]
                    }))

                    PongConsumer.ball_pos[self.room_name] = [400, 250]
                    PongConsumer.ball_speed[self.room_name] = 3

            # left side
            if (PongConsumer.ball_pos[self.room_name][0] + PongConsumer.ball_direction[self.room_name][0] < 50):
                if (PongConsumer.ball_pos[self.room_name][1] < PongConsumer.left_paddle_pos[self.room_name][1] + 60 and PongConsumer.ball_pos[self.room_name][1] > PongConsumer.left_paddle_pos[self.room_name][1] - 60):
                    PongConsumer.ball_direction[self.room_name][0] *= -1
                    PongConsumer.ball_speed[self.room_name] += 1
                else:
                    PongConsumer.score[self.room_name][1] += 1

                    # check winner
                    if (PongConsumer.score[self.room_name][1] >= PongConsumer.score_to_win[self.room_name]):
                        await self.send(text_data=json.dumps({
                            'type':'winner',
                            'message': "RIGHT"
                        }))
                        PongConsumer.game_task[self.room_name].cancel()

                    
                    await self.send(text_data=json.dumps({
                        'type':'score',
                        'left': PongConsumer.score[self.room_name][0],
                        'right': PongConsumer.score[self.room_name][1]
                    }))

                    # re-init ball
                    PongConsumer.ball_pos[self.room_name] = [400, 250]
                    PongConsumer.ball_speed[self.room_name] = 3


            PongConsumer.ball_pos[self.room_name][0] += PongConsumer.ball_direction[self.room_name][0] * PongConsumer.ball_speed[self.room_name]
            PongConsumer.ball_pos[self.room_name][1] += PongConsumer.ball_direction[self.room_name][1] * PongConsumer.ball_speed[self.room_name]

            await self.send(text_data=json.dumps({
                'type':'ball_pos',
                'x': PongConsumer.ball_pos[self.room_name][0],
                'y': PongConsumer.ball_pos[self.room_name][1]
            }))
            await asyncio.sleep(1 / 30)
        