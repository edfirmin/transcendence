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
    
    ball_pos = [400, 250]
    ball_direction = [1, 1]
    ball_speed = 3
    left_paddle_pos = [0, 250]
    right_paddle_pos = [0, 250]
    score = [0, 0]
    game_task = None
    up_limit = 60
    down_limit = 440
    score_to_win = 5
    is_ai = False
    difficulty = "medium"

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomid']
        self.room_group_name = f'game_{self.room_name}'

        logger.info(f"Player connected to room {self.room_group_name}")

        # Join the game group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send connection established message
        #await self.send_message("connection_established", "connection_established")

        # Initialize game state
        self.ball_pos = [400, 250]
        self.ball_speed = 2
        self.left_paddle_pos = [0, 250]
        self.right_paddle_pos = [0, 250]

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        logger.info(self.ball_pos)

        if (message == "left_paddle_down"):
            if self.left_paddle_pos[1] > self.down_limit:
                return

            self.left_paddle_pos[1] += 5
            
            await self.send_message("left_paddle_down_type", self.left_paddle_pos[1])

        if (message == "left_paddle_up"):
            
            if self.left_paddle_pos[1] < self.up_limit:
                return

            self.left_paddle_pos[1] -= 5
            await self.send_message("left_paddle_up_type", self.left_paddle_pos[1])

        if (message == "right_paddle_up"):
            if self.right_paddle_pos[1] < self.up_limit:
                return
            
            self.right_paddle_pos[1] -= 5
            await self.send_message("right_paddle_up_type", self.right_paddle_pos[1])

        if (message == "right_paddle_down"):
            if self.right_paddle_pos[1] > self.down_limit:
                return

            self.right_paddle_pos[1] += 5
            await self.send_message("right_paddle_down_type", self.right_paddle_pos[1])

        if self.game_task == None:
            self.game_task = asyncio.create_task(self.main_loop())


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if self.game_task:
            self.game_task.cancel()

    async def main_loop(self):
        while True:
            # Ceilling and Floor Ball Detection
            if (self.ball_pos[1] + self.ball_direction[1] > 490 or self.ball_pos[1] + self.ball_direction[1] < 10):
                self.ball_direction[1] *= -1
               # await self.send(text_data=json.dumps({
               #     'type':'hit'
               # }))

            # right side
            if (self.ball_pos[0] + self.ball_direction[0] > 750):
                if (self.ball_pos[1] < self.right_paddle_pos[1] + 60 and self.ball_pos[1] > self.right_paddle_pos[1] - 60):
                    self.ball_direction[0] *= -1
                    self.ball_speed += 1
                else:
                    self.score[0] += 1
                    # check winner
                    if (self.score[0] >= self.score_to_win):
                        await self.send_message("winner_type", "LEFT")
                        self.game_task.cancel()

                    await self.channel_layer.group_send(
                        self.room_group_name,{
                            'type':'score_type',
                            'left': self.score[0],
                            'right': self.score[1]
                        })
                    self.ball_pos = [400, 250]
                    self.ball_speed = 3

            # left side
            if (self.ball_pos[0] + self.ball_direction[0] < 50):
                if (self.ball_pos[1] < self.left_paddle_pos[1] + 60 and self.ball_pos[1] > self.left_paddle_pos[1] - 60):
                    self.ball_direction[0] *= -1
                    self.ball_speed += 1
                else:
                    self.score[1] += 1

                    # check winner
                    if (self.score[1] >= self.score_to_win):
                        await self.send_message("winner_type", "RIGHT")
                        self.game_task.cancel()

                    await self.channel_layer.group_send(
                        self.room_group_name,{
                            'type':'score_type',
                            'left': self.score[0],
                            'right': self.score[1]
                        })

                    # re-init ball
                    self.ball_pos = [400, 250]
                    self.ball_speed = 3


            self.ball_pos[0] += self.ball_direction[0] * self.ball_speed
            self.ball_pos[1] += self.ball_direction[1] * self.ball_speed

            logger.info(f'{self.ball_pos}')

            await self.channel_layer.group_send(
                self.room_group_name,{
                    'type':'ball_pos_type',
                    'x': self.ball_pos[0],
                    'y': self.ball_pos[1]
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
    
    ball_pos = [400, 250]
    ball_direction = [1, 1]
    ball_speed = 3
    left_paddle_pos = [0, 250]
    right_paddle_pos = [0, 250]
    score = [0, 0]
    game_task = None
    up_limit = 60
    down_limit = 440
    score_to_win = 5
    is_ai = False
    difficulty = "medium"

    async def connect(self):
        await self.accept()

        await self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':'You are now connected!'
        }))

        self.ball_pos = [400, 250]
        self.ball_speed = 2
        self.left_paddle_pos = [0, 250]
        self.right_paddle_pos = [0, 250]

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        logger.info(self.ball_pos)

        if (message == "isAi"):
            self.is_ai = data_json['value']
        if (message == "difficulty"):
            self.difficulty = data_json['value']


        if (message == "left_paddle_down"):
            if self.left_paddle_pos[1] > self.down_limit:
                return

            self.left_paddle_pos[1] += 5
            await self.send(text_data=json.dumps({
                'type':'left_paddle_down',
                'message': self.left_paddle_pos[1]
            }))
        if (message == "left_paddle_up"):
            
            if self.left_paddle_pos[1] < self.up_limit:
                return

            self.left_paddle_pos[1] -= 5
            await self.send(text_data=json.dumps({
                'type':'left_paddle_up',
                'message': self.left_paddle_pos[1]
            }))
        if (message == "right_paddle_up"):
            if self.right_paddle_pos[1] < self.up_limit:
                return
            
            self.right_paddle_pos[1] -= 5
            await self.send(text_data=json.dumps({
                'type':'right_paddle_up',
                'message': self.right_paddle_pos[1]
            }))
        if (message == "right_paddle_down"):
            if self.right_paddle_pos[1] > self.down_limit:
                return

            self.right_paddle_pos[1] += 5
            await self.send(text_data=json.dumps({
                'type':'right_paddle_down',
                'message': self.right_paddle_pos[1]
            }))

        if self.game_task == None:
            self.game_task = asyncio.create_task(self.main_loop())


    async def disconnect(self, close_code):
        logger.info("salut mon pote")

        if (self.game_task):
            self.game_task.cancel()


    async def main_loop(self):
        while True:
            # Bot
            if (self.is_ai):

                if (self.difficulty == "easy"):
                    if (self.ball_pos[1] > self.right_paddle_pos[1] and self.right_paddle_pos[1] < self.down_limit):
                        self.right_paddle_pos[1] += 2
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_down',
                            'message': self.right_paddle_pos[1]
                        }))
                    elif (self.ball_pos[1] < self.right_paddle_pos[1] and self.right_paddle_pos[1] > self.up_limit):
                        self.right_paddle_pos[1] -= 2
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_up',
                            'message': self.right_paddle_pos[1]
                        }))
                elif (self.difficulty == "medium"):
                    if (self.ball_pos[1] > self.right_paddle_pos[1] and self.right_paddle_pos[1] < self.down_limit):
                        self.right_paddle_pos[1] += 4
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_down',
                            'message': self.right_paddle_pos[1]
                        }))
                    elif (self.ball_pos[1] < self.right_paddle_pos[1] and self.right_paddle_pos[1] > self.up_limit):
                        self.right_paddle_pos[1] -= 4
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_up',
                            'message': self.right_paddle_pos[1]
                        }))
                else:
                    if (self.ball_pos[1] > self.right_paddle_pos[1] and self.right_paddle_pos[1] < self.down_limit):
                        self.right_paddle_pos[1] += 5
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_down',
                            'message': self.right_paddle_pos[1]
                        }))
                    elif (self.ball_pos[1] < self.right_paddle_pos[1] and self.right_paddle_pos[1] > self.up_limit):
                        self.right_paddle_pos[1] -= 5
                        await self.send(text_data=json.dumps({
                            'type':'right_paddle_up',
                            'message': self.right_paddle_pos[1]
                        }))

            # Ceilling and Floor Ball Detection
            if (self.ball_pos[1] + self.ball_direction[1] > 490 or self.ball_pos[1] + self.ball_direction[1] < 10):
                self.ball_direction[1] *= -1
                await self.send(text_data=json.dumps({
                    'type':'hit'
                }))

            # right side
            if (self.ball_pos[0] + self.ball_direction[0] > 750):
                if (self.ball_pos[1] < self.right_paddle_pos[1] + 60 and self.ball_pos[1] > self.right_paddle_pos[1] - 60):
                    self.ball_direction[0] *= -1
                    self.ball_speed += 1
                else:
                    self.score[0] += 1
                    # check winner
                    if (self.score[0] >= self.score_to_win):
                        await self.send(text_data=json.dumps({
                            'type':'winner',
                            'message': "LEFT"
                        }))
                        self.game_task.cancel()

                    await self.send(text_data=json.dumps({
                        'type':'score',
                        'left': self.score[0],
                        'right': self.score[1]
                    }))

                    self.ball_pos = [400, 250]
                    self.ball_speed = 3

            # left side
            if (self.ball_pos[0] + self.ball_direction[0] < 50):
                if (self.ball_pos[1] < self.left_paddle_pos[1] + 60 and self.ball_pos[1] > self.left_paddle_pos[1] - 60):
                    self.ball_direction[0] *= -1
                    self.ball_speed += 1
                else:
                    self.score[1] += 1

                    # check winner
                    if (self.score[1] >= self.score_to_win):
                        await self.send(text_data=json.dumps({
                            'type':'winner',
                            'message': "RIGHT"
                        }))
                        self.game_task.cancel()

                    
                    await self.send(text_data=json.dumps({
                        'type':'score',
                        'left': self.score[0],
                        'right': self.score[1]
                    }))

                    # re-init ball
                    self.ball_pos = [400, 250]
                    self.ball_speed = 3


            self.ball_pos[0] += self.ball_direction[0] * self.ball_speed
            self.ball_pos[1] += self.ball_direction[1] * self.ball_speed

            logger.info(f"{self.ball_pos}")

            await self.send(text_data=json.dumps({
                'type':'ball_pos',
                'x': self.ball_pos[0],
                'y': self.ball_pos[1]
            }))
            await asyncio.sleep(1 / 30)
        