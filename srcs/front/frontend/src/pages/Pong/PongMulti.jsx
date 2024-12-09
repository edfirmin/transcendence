import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Pong.module.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import {v4 as uuidv4} from 'uuid';

function PongMulti() {

    const { roomid } = useParams();
	var ws;
	var id;
    const canvasRef = useRef(null);
	const keys = useRef({ left_up: false, left_down: false, right_up: false, right_down: false});
	const LPaddle = useRef({ x: 50, y: 250});
	const RPaddle = useRef({ x: 750, y: 250});
	const [score, setScore] = useState({left: 0, right: 0});
	const gameStarted = useRef(false);
    const ball = useRef({ x: 400, y: 250 });
    const obj = useRef({ x: 400, y: 250 });
    const dir = useRef(1);
    const vec = useRef(0.005);
    const speed = useRef(2);
    const lastUpdateTimeRef = useRef(0);
    const [count, setCount]  = useState(0);
	const trails = [];
	const [winner, setWinner] = useState("");
    
	useEffect(() => {
		ws = new WebSocket(`ws://localhost:8000/ws/multipong/${roomid}`);
	  	id = uuidv4();

		ws.onopen = function(event) {
			ws.send(JSON.stringify({
				'id':id,
				'message':'on_connect'
	    	}))
		}

		// When receiving a message from the back
		ws.onmessage = function(event) {
			let data = JSON.parse(event.data);
			console.log('Data:', data);
			
			if (data.type == "left_paddle_down" || data.type == "left_paddle_up") {
				LPaddle.current.y = data.message
			}
			if (data.type == "right_paddle_down" || data.type == "right_paddle_up") {
				RPaddle.current.y = data.message
			}
			if (data.type == "ball_pos") {
				ball.x = data.x;
				ball.y = data.y;
				//trails.push(new Trail(ball.x, ball.y));
			}
			if (data.type == "score") {
				setScore({left: data.left, right: data.right});
			}
			if (data.type == "hit") {
				let audio = new Audio("../../assets/sounds/pong.mp3");
				audio.play();
			}
			if (data.type == "winner") {
				setWinner(data.message + " WIN !");
			}
		}
	}, [])
    
	useEffect(() => {
    
        // Listens for KeyDown event
		const handleKeyDown = (event) => {
            switch (event.key)
			{
                case 'ArrowUp':
					keys.current.right_up = true;
					break;
                    case 'ArrowDown':
                        keys.current.right_down = true;
                        break;
                        case 'e':
                            keys.current.left_up = true;
                            break;
                            case 'd':
                                keys.current.left_down = true;
                                break;
                            }
                        };
                        
                        // Listens for KeyUp event
                        const handleKeyUp = (event) => {
                            switch (event.key)
			{
				case 'ArrowUp':
                    keys.current.right_up = false;
					break;
                    case 'ArrowDown':
                        keys.current.right_down = false;
                        break;
                        case 'e':
                            keys.current.left_up = false;
                        break;
                        case 'd':
                            keys.current.left_down = false;
                            break;
                        }
                    };
                    window.addEventListener('keydown', handleKeyDown);
                    window.addEventListener('keyup', handleKeyUp);

                    return () => {
                        window.removeEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);
		};
	}, []);

	const handlePaddlesMovement = () =>
	{
        // Moves the paddles in the corresponding direction depending on pressed keys
		// See handleKeyUp() and handleKeyDown() above
		if (keys.current.left_up)
			ws.send(JSON.stringify({
			'id':id,
        	'message':'paddle_up'
    	}))
		if (keys.current.left_down)
			ws.send(JSON.stringify({
			'id':id,
			'message':'paddle_down'
		}))
	}

	const drawBall = (ctx, x, y) => {
	// Drawing the ball at the given position
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
	};
    
	const drawPaddle = (ctx, x, y) => {
        // Drawing a paddle centered at the given position
		ctx.beginPath();
		ctx.rect(x, y - 60, 10, 120);
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	const drawWinner = (ctx) => {
		if (winner != "") {
			ctx.textAlign = "center";
			ctx.fillStyle = "grey";
			ctx.fillRect(ctx.canvas.width / 2 - ctx.canvas.width / 4 ,ctx.canvas.height / 2 - ctx.canvas.height / 4, ctx.canvas.width / 2, ctx.canvas.height / 2);

			ctx.font = "40px Arial ";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(winner, ctx.canvas.width / 2,ctx.canvas.height / 2);
		}
	}
    
	class Trail {
		constructor(x, y) {
            this.x = x;
			this.x = y;
			this.size = 50;
		}
	
		update() {
			this.size--;	
		}

		draw(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
			ctx.fillStyle = 'white';
			ctx.fill();
		}
	}

	const drawGame = (ctx) =>
	{
		// Fill background in black
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Drawing center lines for esthetics (looks nice, right ?)
		ctx.beginPath();
		for (let i = 0; i != 500; i += 10)
			ctx.rect(398, i, 4, 1);
		ctx.fillStyle = 'grey';
		ctx.fill();

		trails.forEach(element => {
			element.update();
			element.draw(ctx);
			if (element.size == 0) {
				const index = trails.indexOf(element);
				trails.splice(index, 1);
			}
		});

		drawWinner(ctx);
		
		// Drawing non-static game elements
		drawPaddle(ctx, LPaddle.current.x - 10, LPaddle.current.y);
		drawPaddle(ctx, RPaddle.current.x, RPaddle.current.y);
		drawBall(ctx, ball.x, ball.y);
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		const animate = (time) =>
		{
			handlePaddlesMovement();
			drawGame(context);

			requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animate);
    }, []);

	

    return (
		<>
        <div className={styles.MovingBall}>
			<ScoreBar score={score}/>
            <canvas ref={canvasRef} width={800} height={500} style={{ border: '5px solid white' }}></canvas>
			<div>
			</div>
        </div>
		</>
	);
}

function WinPanel({winneur}) {
	return (
		<div id='winPanel'>
			<h1>{winneur}</h1>
		</div>
	)
}

function ScoreBar({score}) {
	return (
		<div id='leftBar'>
			<span></span>
		</div>
	)
}

export default PongMulti;
