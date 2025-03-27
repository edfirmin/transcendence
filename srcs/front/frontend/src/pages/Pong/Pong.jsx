import React, { useState, useMemo, useEffect, useRef, Prompt } from 'react';
import { Shake } from 'reshake';
import styles from './Pong.module.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classic_paddle_design from '../../assets/img/classic_paddle_design.png'
import classic_ball_design from '../../assets/img/classic_ball_design.png'
import tennis_paddle_design from '../../assets/img/tennis_paddle_design.png'
import tennis_ball_design from '../../assets/img/tennis_ball_design.png'
import cool_paddle_design from '../../assets/img/cool_paddle_design.png'
import cool_ball_design from '../../assets/img/cool_ball_design.png'
import sick_paddle_design from '../../assets/img/sick_paddle_design.png'
import sick_ball_design from '../../assets/img/sick_ball_design.png'
import swag_paddle_design from '../../assets/img/swag_paddle_design.png'
import swag_ball_design from '../../assets/img/swag_ball_design.png'
import classic_map from '../../assets/img/classic_map.png'
import tennis_map from '../../assets/img/portal_map.png'
import table_tennis_map from '../../assets/img/table_tennis_map.png'
import fog_map from '../../assets/img/fog_map_background.png'
import fog from '../../assets/img/fog_map_fog.png'
import fog_corner from '../../assets/img/fog_map_fog_corner.png'
import portal_red from '../../assets/img/portal_red.png'
import portal_green from '../../assets/img/portal_green.png'
import { ACCESS_TOKEN } from "../../constants";
import Navbarr from "../../components/Navbar";
import Snowfall from 'react-snowfall'


function Pong({setIsInAGame}) {

    const { roomid } = useParams();
	const userToken = localStorage.getItem(ACCESS_TOKEN);

	const host = import.meta.env.VITE_HOST;

    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
	const keys = useRef({ left_up: false, left_down: false, right_up: false, right_down: false});
	const LPaddle = useRef({ x: 50, y: 250});
	const RPaddle = useRef({ x: 750, y: 250});
	const middlePaddle = useRef({ x: 391, y: 250});
	const [score, setScore] = useState({left: 0, right: 0});
	const ball_history = useRef([]);
	const ball_history_max_size = 10;
    const ball = useRef({ x: 400, y: 250 });
    const obj = useRef({ x: 400, y: 250 });
    const dir = useRef(1);
    const vec = useRef(0.005);
    const speed = useRef(2);
	const paddle_size = useRef(60);
    const lastUpdateTimeRef = useRef(0);
    const [count, setCount]  = useState(0);
	const [winner, setWinner] = useState("");
	const [longest_exchange, set_longest_exchange] = useState(0);
	const [shortest_exchange, set_shortest_exchange] = useState(0);
	const hit_history = useRef([]);
	const [shake, set_shake] = useState(false);
	const [time_start, set_time_start] = useState(0)
	const AIGoUp = useRef(null);
	const timeoutAI = useRef(null);
	const AIBallPos = useRef({ x: 400, y: 250})
	//const [score_history, set_score_history] = useState([])
	
	const map_design = [classic_map, table_tennis_map, fog_map, tennis_map ];
	const ball_design = [classic_ball_design, tennis_ball_design, cool_ball_design, sick_ball_design, swag_ball_design];
	const paddle_design = [classic_paddle_design, tennis_paddle_design, cool_paddle_design, sick_paddle_design, swag_paddle_design];
	
	const data = useLocation();
	const isAI = data.state == null ? false : data.state.isAI;
	const difficulty = data.state == null ? "easy" : data.state.difficulty;
	const map_index = data.state == null ? 0 : data.state.map;
	const design_index = data.state == null ? 0 : data.state.design;
	const points = data.state == null ? 2 : data.state.points + 2;
	const players = data.state == null ? 0 : data.state.players;
	const leftPlayerName = data.state == null ? 0 : data.state.leftPlayerName;
	const rightPlayerName = data.state == null ? 0 : data.state.rightPlayerName;
	const tourney_id = data.state == null ? 0 : data.state.tourney_id;
    const currentBattleIndex = data.state == null ? 0 : data.state.currentBattleIndex;
	const returnPage = data.state == null ? 0 : (data.state.returnPage == null ? '/selection' : data.state.returnPage);
	const leftPlayerIsUser = data.state == null ? 0 : data.state.leftPlayerIsUser;
	const rightPlayerIsUser = data.state == null ? 0 : data.state.rightPlayerIsUser;
	const power_up = data.state == null ? 0 : data.state.power_up_on;
	
	var ws = useMemo(() => {return data.state == null ? new WebSocket("") : new WebSocket(`wss://${host}:9443/ws/pong/${roomid}`)}, [ws]);
	const [countdown, setCountdown] = useState(-1);
	
    const navigate = useNavigate();
	
	useEffect(() => {
		setIsInAGame(true)

		return () => {
			setIsInAGame(false)
		}
	})

    // When receiving a message from the back
    ws.onmessage = function(event) {
        let data = JSON.parse(event.data);
      //  console.log('Data:', data);
    
		if (data.type == "connection_established") {
			ws.send(JSON.stringify({
				'message':'points',
				'value': points
			}));
	/*		ws.send(JSON.stringify({
				'message':'power_up',
				'value':power_up
			}));*/
			ws.send(JSON.stringify({
				'message':'map',
				'value':map_index
			}));
			ws.send(JSON.stringify({
				'message':'isAi',
				'value': isAI
			}));
			if (isAI){
				ws.send(JSON.stringify({
					'message':'difficulty',
					'value': difficulty
				}));
			}
			setCountdown(3);	
		}

        if (data.type == "left_paddle_down" || data.type == "left_paddle_up") {
            LPaddle.current.y = data.message
        }
        if (data.type == "right_paddle_down" || data.type == "right_paddle_up") {
            RPaddle.current.y = data.message
        }
        if (data.type == "middle_paddle_pos") {
            middlePaddle.current.y = data.message
        }
		if (data.type == "paddle_size") {
            paddle_size.current = data.message
        }
        if (data.type == "ball_pos") {
            ball.x = data.x;
            ball.y = data.y;

			ball_history.current.push({x : ball.x, y : ball.y});
			if (ball_history.current.length >= ball_history_max_size) {
				ball_history.current.shift();
			}
        }
		if (data.type == "score") {
			set_shake(true);
			setTimeout(() => { set_shake(false); }, 200);
			setScore({left: data.left, right: data.right});
			//set_score_history([...score_history, data.winner])
		}
		if (data.type == "hit") {
			let dix = data.dx;
			let diy = data.dy;

			//let audio = new Audio("../../assets/sounds/pong.mp3");
			//audio.play();

			hit_history.current.length = 0;
			let rand = 5 + (Math.random() * (10-5));
			for (let i = 0; i < rand; i++) {
				dix -= -3 + (Math.random() * (5+3));
				diy -= -3 + (Math.random() * (5+3));
				hit_history.current.push({x : ball.x, y : ball.y, dx : dix, dy : diy, time: 10, a : 1});
			}
		}
		if (data.type == "winner") {
			set_longest_exchange(data.longest_exchange);
			set_shortest_exchange(data.shortest_exchange);
			setWinner(data.winner + " WIN !");
			//set_score_history([...score_history, data.winner])
			setTimeout(() => { navigate(returnPage, {state : { isAI : isAI, map : map_index, design : design_index, points : points - 2, players : players, winner : data.winner, leftPlayerName : leftPlayerName, rightPlayerName : rightPlayerName, tourney_id : tourney_id, currentBattleIndex : currentBattleIndex
			}}) }, 3000);
		}
	}

	useInterval(() => {AIBallPos.current.y = ball.current.y;}, 1000)
	
	function EasyAIBehaviour() {
		let proba = Math.random();
		let duration_movement = Math.random() * (500 - 300) + 300;
		let duration_pause = Math.random() * (200 - 100) + 100;

		if (timeoutAI.current != null)
			clearTimeout(timeoutAI.current);

		if (proba < 0.45)
			AIGoUp.current = true;
		else if (proba < 0.90)
			AIGoUp.current = false;
		else 
			AIGoUp.current = null;

			timeoutAI.current = setTimeout(AIPause, duration_movement, duration_pause, EasyAIBehaviour);
	}

	function MediumAIBehaviour() {
		let proba = Math.random();
		let duration_movement = Math.random() * (500 - 300) + 300;
		let duration_pause = Math.random() * (500 - 300) + 300;

		if (timeoutAI.current != null)
			clearTimeout(timeoutAI.current);

		if (RPaddle.current.y > AIBallPos.current.y) {
			if (proba < 0.95)
				AIGoUp.current = true;
			else if (proba < 0.95)
				AIGoUp.current = false;
			else 
				AIGoUp.current = null;
		}
		else {
			if (proba < 0.95)
				AIGoUp.current = false;
			else if (proba < 0.95)
				AIGoUp.current = true;
			else 
				AIGoUp.current = null;
		}

		timeoutAI.current = setTimeout(AIPause, duration_movement, duration_pause, MediumAIBehaviour);
	}

	function AIPause(new_duration, callback) {		
		AIGoUp.current = null;
		
		if (timeoutAI.current != null)
			clearTimeout(timeoutAI.current);

		timeoutAI.current = setTimeout(callback, new_duration);
	}

	function HardAIBehaviour() {
		let proba = Math.random();
		let new_duration = Math.random() * (1800 - 1000) + 1000;

		if (timeoutAI.current != null)
			clearTimeout(timeoutAI.current);

		if (proba < 0.45)
			AIGoUp.current = true;
		else if (proba < 0.90)
			AIGoUp.current = false;
		else 
			AIGoUp.current = null;

		timeoutAI.current = setTimeout(HardAIBehaviour, new_duration);
	}

	function useInterval(callback, delay) {
		const savedCallback = useRef();
	   
		// Remember the latest callback.
		useEffect(() => {
		  savedCallback.current = callback;
		}, [callback]);
	   
		// Set up the interval.
		useEffect(() => {
		  function tick() {
			savedCallback.current();
		  }
		  if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		  }
		}, [delay]);
	}

	async function postMatchStats() {
		if (winner == "")
			return

		var result;
		if (winner == 'LEFT WIN !') {
			result = "VICTOIRE"
			score.left += 1;	
		}
		else {
			result = "DEFAITE"
			score.right += 1;	
		}
		
		const d = new Date();
		var day = d.getDate();
		if (day.toString().length == 1)
			day = '0' + day;
		var month = d.getMonth()+1;
		if (month.toString().length == 1)
			month = '0' + month;
		const year = d.getFullYear();
		const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		const a = + d.getHours() + ':' + min + '  ' + year + '-' + month + '-' + day;

		var time;
		if (time_start == null || time_start <= 0)
			time = 0;
		else
			time = d.getTime() - time_start.getTime();
		
		if (isAI)
			await axios.post('api/user/addMatchStats/', {userToken, result, date: a, score_left: score.left, score_right: score.right, time: time, type: "AI " + difficulty, longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false})
		else
			if (tourney_id != null) {
				if (leftPlayerIsUser) {
					if (winner == 'LEFT WIN !') 
						await axios.post('api/user/addMatchStatsWithUsername/', {username: leftPlayerName, result: "VICTOIRE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Local", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: true, opponent: rightPlayerName})
					else
						await axios.post('api/user/addMatchStatsWithUsername/', {username: leftPlayerName, result: "DEFAITE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Local", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: true, opponent: rightPlayerName})
				}
				if (rightPlayerIsUser) {
					if (winner == 'LEFT WIN !')
						await axios.post('api/user/addMatchStatsWithUsername/', {username: rightPlayerName, result: "DEFAITE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Local", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: true, opponent: leftPlayerName})
					else
						await axios.post('api/user/addMatchStatsWithUsername/', {username: rightPlayerName, result: "VICTOIRE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Local", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: true, opponent: leftPlayerName})
				}
			}
			else
				await axios.post('api/user/addMatchStats/', {userToken, result, date: a, score_left: score.left, score_right: score.right, time: time, type: "Local", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false})
	}

	useEffect(() => {
		postMatchStats();
	}, [winner])

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
				case 'E':
				case 'e':
					keys.current.left_up = true;
					break;
				case 'D':
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
				case 'E':
				case 'e':
					keys.current.left_up = false;
					break;
				case 'D':
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
			ws.close();
		};
	}, []);

	const handlePaddlesMovement = () =>
	{
		// Moves the paddles in the corresponding direction depending on pressed keys
		// See handleKeyUp() and handleKeyDown() above
		if (keys.current.left_up)
			ws.send(JSON.stringify({
				'message':'left_paddle_up'
			}))
		if (keys.current.left_down)
			ws.send(JSON.stringify({
				'message':'left_paddle_down'
			}))
		if (keys.current.right_up && !isAI)
			ws.send(JSON.stringify({
				'message':'right_paddle_up'
			}))
		if (keys.current.right_down && !isAI)
			ws.send(JSON.stringify({
				'message':'right_paddle_down'
			}))
	}

	const drawBall = (ctx, x, y, img) => {
		ctx.globalAlpha = 0
		for (let i = 0; i < ball_history.current.length; i++) {
			ctx.globalAlpha = ctx.globalAlpha + 0.1;
			ctx.beginPath();
			ctx.drawImage(img, ball_history.current[i].x - 8, ball_history.current[i].y - 8);
			ctx.fill();
		}

		// Drawing the ball at the given position
		ctx.globalAlpha = 1
		ctx.beginPath();
		ctx.drawImage(img, x - 8, y - 8);
		ctx.fill();
	};

	const drawPaddle = (ctx, x, y, img) => {
		// Drawing a paddle centered at the given position
		ctx.beginPath();
		ctx.drawImage(img, x, y - paddle_size.current, 18, paddle_size.current * 2);
		ctx.fill();
	}

	const drawWinner = (ctx) => {
		if (winner != "") {
			ctx.textAlign = "center";
			ctx.fillStyle = "#0f9acc";
			ctx.fillRect(ctx.canvas.width / 2 - ctx.canvas.width / 4 ,ctx.canvas.height / 2 - ctx.canvas.height / 4, ctx.canvas.width / 2, ctx.canvas.height / 2);

			ctx.font = "40px Futurama ";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(winner, ctx.canvas.width / 2,ctx.canvas.height / 2);
		}
	}

	const drawCountdown = (ctx) => {
		if (countdown != -1) {
			ctx.textAlign = "center";
			ctx.fillStyle = "#0f9acc";
			ctx.fillRect(ctx.canvas.width / 2 - ctx.canvas.width / 4 ,ctx.canvas.height / 2 - ctx.canvas.height / 4, ctx.canvas.width / 2, ctx.canvas.height / 2);

			ctx.font = "40px Futurama ";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(countdown, ctx.canvas.width / 2,ctx.canvas.height / 2);
		}
	}

	const drawHits = (ctx) => {
		for (let i = 0; i < hit_history.current.length; i++) {
		//	ctx.globalAlpha = hit_history.current[i].a;
			ctx.fillStyle = "#bdbaba";
			ctx.fillRect(hit_history.current[i].x , hit_history.current[i].y, 16, 16);	
			hit_history.current[i].x += hit_history.current[i].dx;
			hit_history.current[i].y += hit_history.current[i].dy;
		//	hit_history.current[i].a += 0.05;
		}
	}

	const drawFog = (ctx) => {
		ctx.beginPath();
		var img = new Image();
		img.src = fog;
		ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
		ctx.beginPath();
		var img = new Image();
		img.src = fog_corner;
		ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
	}

	const drawPortal = (ctx, x, y, image) => {
		// Drawing a paddle centered at the given position
		ctx.beginPath();
		var img = new Image();
		img.src = image;
		ctx.drawImage(img, x, y, 119, 5);
		ctx.fill();
	}

	const drawGame = (ctx, background, paddle_img, ball_img) =>
	{
		// Fill background in black
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
		
		/*ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		*/
		if (winner != "") {
			drawWinner(ctx);
		}
		else if (countdown > 0) {
			drawCountdown(ctx);
		}
		else {
			// Drawing non-static game elements
			drawPaddle(ctx, LPaddle.current.x - 10, LPaddle.current.y, paddle_img);
			drawPaddle(ctx, RPaddle.current.x, RPaddle.current.y, paddle_img);
			drawBall(ctx, ball.x, ball.y, ball_img);
			drawHits(ctx);
			if (map_index == 1)
				drawPaddle(ctx, middlePaddle.current.x, middlePaddle.current.y, paddle_img);
			if (map_index == 2)
				drawFog(ctx);
			if (map_index == 3) {
				drawPortal(ctx, 100, 0, portal_red);
				drawPortal(ctx, 600, 495, portal_green);
				drawPortal(ctx, 100, 495, portal_green);
				drawPortal(ctx, 600, 0, portal_red);
			}
		}
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		var background = new Image();
		var paddle_img = new Image();
		var ball_img = new Image();
		
		background.src = map_design[map_index];
		context.drawImage(background, 0, 0);
		background.onload = function(){
			context.drawImage(background,0,0);   
		}

		paddle_img.src = paddle_design[design_index];
		ball_img.src = ball_design[design_index];

		const animate = (time) =>
		{
			handlePaddlesMovement();
			drawGame(context, background, paddle_img, ball_img);

			requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animate);
    }, [winner, countdown]);

	useEffect(() => {
		const canvas = canvasRef2.current;
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.fillStyle = 'grey';
		ctx.fillRect(ctx.canvas.width / 2 - 1, 0, 2, ctx.canvas.height);

		ctx.shadowBlur = 10;
		ctx.shadowColor = "black";
		ctx.fillStyle = `rgb(
			0
			${Math.floor(255 / points * score.left)}
			${Math.floor(255 / points * score.left)})`;
		ctx.fillRect(2, 2, score.left * ctx.canvas.width / 2 / points, ctx.canvas.height - 6);

		ctx.fillStyle = `rgb(
			${Math.floor(255 / points * score.right)}
			0
			${Math.floor(255 / points * score.right)})`;
		ctx.fillRect(ctx.canvas.width - score.right * ctx.canvas.width / 2 / points, 2, score.right * ctx.canvas.width / 2 / points - 2, ctx.canvas.height - 6);

		ctx.fillStyle = 'white';
		let dist = ctx.canvas.width / (points * 2);
		for (let i = 1; i < points * 2; i++) {
			if (i == points) {
				ctx.fillRect(dist * i - 2, 0, 4, 15);
				ctx.fillRect(dist * i - 2, ctx.canvas.height - 15, 4, 15);
			}
			else {
				ctx.fillRect(dist * i - 2, 0, 4, 10);
				ctx.fillRect(dist * i - 2, ctx.canvas.height - 10, 4, 10);
			}
		}

    }, [score]);

	useEffect(() => {
		countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
		if (countdown == 0) {
			ws.send(JSON.stringify({
				'message':'begin_game'
			}));
			
			set_time_start(new Date())

			/*if (isAI) {
				if (difficulty == "easy")
					EasyAIBehaviour();
				else if (difficulty == "medium")
					MediumAIBehaviour();
				else
					HardAIBehaviour();	
			}*/
		}
	}, [countdown]);
	
	/*useInterval(() => {
		if (AIGoUp.current == true) 
			ws.send(JSON.stringify({
				'message':'right_paddle_up'
			}))
		else if (AIGoUp.current == false)
			ws.send(JSON.stringify({
				'message':'right_paddle_down'
			}))
	}, 1);
*/
	return (
		<>
		<Navbarr></Navbarr>
		<Snowfall></Snowfall>
		{data.state == null ? 
		<div>
			<h1 style={{ textAlign: "center", color:"white", top: "40%", left: "40%", position: "absolute"}}>La Partie est invalide !!</h1>
			<canvas ref={canvasRef2} width={0} height={0} style={{ border: '5px solid white', borderRadius: '5px', marginBottom: '5px' }}></canvas>
			<canvas ref={canvasRef} width={0} height={0} style={{ border: '5px solid white' }}></canvas>
		</div>	
		:
        <div className={styles.MovingBall}>
			<canvas ref={canvasRef2} width={800} height={50} style={{ border: '5px solid white', borderRadius: '5px', marginBottom: '5px' }}></canvas>
			<canvas ref={canvasRef} width={800} height={500} style={{ border: '5px solid white' }}></canvas>
		</div>
		}
		</>
	);

}

export default Pong;
