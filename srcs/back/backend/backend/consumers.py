from channels.generic.websocket import AsyncWebsocketConsumer
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

    async def connect(self):
        await self.accept()

        await self.send(text_data=json.dumps({
            'type':'connection_established',
            'message':'You are now connected!'
        }))

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        logger.info(self.ball_pos)

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


    async def main_loop(self):
        while True:
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
                    self.ball_pos = [400, 250]
                    await self.send(text_data=json.dumps({
                        'type':'score',
                        'left': self.score[0],
                        'right': self.score[1]
                    }))
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
        



