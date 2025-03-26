import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Pong.module.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
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
import { ACCESS_TOKEN } from "../../constants";
import { getUser } from '../../api';
import portal_red from '../../assets/img/portal_red.png'
import portal_green from '../../assets/img/portal_green.png'
import Navbarr from "../../components/Navbar";
import Snowfall from 'react-snowfall'

function PongMulti() {

    const { roomid } = useParams();
	const userToken = localStorage.getItem(ACCESS_TOKEN);

	const host = import.meta.env.VITE_HOST;
	const ws = useMemo(() => {return new WebSocket(`wss://${host}:9443/ws/multipong/${roomid}`)}, []);

	const id = useMemo(() => {return uuidv4()}, []);
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
	const keys = useRef({ left_up: false, left_down: false, right_up: false, right_down: false});
	const LPaddle = useRef({ x: 50, y: 250});
	const RPaddle = useRef({ x: 750, y: 250});
	const middlePaddle = useRef({ x: 391, y: 250});
	const [score, setScore] = useState({left: 0, right: 0});
	const gameStarted = useRef(false);
    const ball = useRef({ x: 400, y: 250 });
	const ball_history = useRef([]);
	const ball_history_max_size = 10;
    const obj = useRef({ x: 400, y: 250 });
    const dir = useRef(1);
    const vec = useRef(0.005);
    const speed = useRef(2);
    const lastUpdateTimeRef = useRef(0);
    const [count, setCount]  = useState(0);
	const [winner, setWinner] = useState("");
	const [longest_exchange, set_longest_exchange] = useState(0);
	const [shortest_exchange, set_shortest_exchange] = useState(0);
	const hit_history = useRef([]);
	const [time_start, set_time_start] = useState(0)
	const paddle_size = useRef(60);
	const [id_winner, set_id_winner] = useState(0);

	const map_design = [classic_map, table_tennis_map, fog_map, tennis_map ];
	const ball_design = [classic_ball_design, tennis_ball_design, cool_ball_design, sick_ball_design, swag_ball_design];
	const paddle_design = [classic_paddle_design, tennis_paddle_design, cool_paddle_design, sick_paddle_design, swag_paddle_design];

	const data = useLocation();
	const [map_index, set_map_index] = useState(data.state == null ? 0 : data.state.map);
	const [design_index, set_design_index] = useState(data.state == null ? 0 : data.state.design);
	const [points, set_points] = useState(data.state == null ? 5 : data.state.points + 2);
	const [left_user, set_left_user] = useState(data.state == null ? null : data.state.left_user);
	const [right_user, set_right_user] = useState(data.state == null ? null : data.state.right_user);

	const [countdown, setCountdown] = useState(-1);
	
	const navigate = useNavigate();


	useEffect(() => {

		ws.onopen = function(event) {
			ws.send(JSON.stringify({
				'id':id,
				'message':'on_connect'
	    	}))
			
			if (data.state != null) {
				if (left_user == undefined) {
					ws.send(JSON.stringify({
						'id':id,
						'message':'game_custom_options',
						'map':map_index,
						'design':design_index,
						'points':points,
						'left_user':null,
						'right_user':null
					}))
				}
				else
					ws.send(JSON.stringify({
						'id':id,
						'message':'game_custom_options',
						'map':map_index,
						'design':design_index,
						'points':points,
						'left_user':left_user,
						'right_user':right_user
					}))
			}
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
			if (data.type == "middle_paddle_pos") {
				middlePaddle.current.y = data.message
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
				setScore({left: data.left, right: data.right});
			}
			if (data.type == "hit") {
				let audio = new Audio("../../assets/sounds/pong.mp3");
				audio.play();
			}
			if (data.type == "winner") {
				set_longest_exchange(data.longest_exchange);
				set_shortest_exchange(data.shortest_exchange);
				set_id_winner(data.id);
				setWinner(data.winner + " WIN !");
				setTimeout(() => { navigate('/selection', {state : {map : map_index, design : design_index, points : points - 2, winner : data.winner
				}}) }, 3000);
			}
			if (data.type == "begin_countdown") {
				setCountdown(3);
			}
			if (data.type == "game_custom_options" ){
				set_design_index(data.design_index);
				set_map_index(data.map_index);
				set_points(data.points);
				set_left_user(data.left_user);
				set_right_user(data.right_user);
			}
		}

		ws.onclose = (event) => {
			console.log("The connection has been closed successfully.");
			setWinner('LEFT WIN !');
		}
	}, [])

	async function postMatchStats() {
		if (winner == "")
			return

		var result;
		if (winner == 'LEFT WIN !') {
			result = "VICTOIRE"
			//score.left += 1;	
		}
		else {
			result = "DEFAITE"
			//score.right += 1;	
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

		console.log("id : " + id)
		console.log("id_winner : " + id_winner)
		console.log("left_user : " + left_user)

		if (left_user == null || left_user == undefined || left_user == -1) {
			if (id == id_winner)
				await axios.post('api/user/addMatchStats/', {userToken, result, date: a, score_left: score.left, score_right: score.right, time: time, type: "Remote", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false})
		}
		else {
			const user = await getUser();
			if (winner == "LEFT WIN !" && user.username == left_user.username)
				await axios.post('api/user/addMatchStatsWithUsername/', {username: left_user.username, result: "VICTOIRE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Remote", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false, opponent: right_user.username});
			if (winner == "LEFT WIN !" && user.username == right_user.username)
				await axios.post('api/user/addMatchStatsWithUsername/', {username: right_user.username, result: "DEFAITE", date: a, score_left: score.right, score_right: score.left, time: time, type: "Remote", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false, opponent: left_user.username});
			if (winner != "LEFT WIN !" && user.username == left_user.username)
				await axios.post('api/user/addMatchStatsWithUsername/', {username: left_user.username, result: "DEFAITE", date: a, score_left: score.left, score_right: score.right, time: time, type: "Remote", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false, opponent: right_user.username});
			if (winner != "LEFT WIN !" && user.username == right_user.username)
				await axios.post('api/user/addMatchStatsWithUsername/', {username: right_user.username, result: "VICTOIRE", date: a, score_left: score.right, score_right: score.left, time: time, type: "Remote", longest_exchange, shortest_exchange, map_index, design_index, is_tourney: false, opponent: left_user.username});
		}

		ws.close();

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
					window.onbeforeunload = function () {return false;}

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
			'id':id,
        	'message':'paddle_up'
    	}))
		if (keys.current.left_down)
			ws.send(JSON.stringify({
			'id':id,
			'message':'paddle_down'
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

    }, [score, points]);

	useEffect(() => {
		countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
		if (countdown == 0){
			ws.send(JSON.stringify({
				'id':id,
				'message':'begin_game'
			}));

			set_time_start(new Date())
			console.log("begin_game");
		}
	}, [countdown]);

    return (
		<>
		<Navbarr></Navbarr>
		<Snowfall></Snowfall>
		{ (left_user != undefined && left_user != null && left_user != -1) && <PlayerUser name={left_user.username} image={left_user.profil_pic} left={560} top={70} /> }
		{ (right_user != undefined && right_user != null && right_user != -1) && <PlayerUser name={right_user.username} image={right_user.profil_pic} left={1120} top={70} />}
        <div className={styles.MovingBall}>
			<canvas ref={canvasRef2} width={800} height={50} style={{ border: '5px solid white', borderRadius: '5px', marginBottom: '5px' }}></canvas>
            <canvas ref={canvasRef} width={800} height={500} style={{ border: '5px solid white' }}></canvas>
        </div>
		</>
	);
}

function PlayerUser({name, image, left, top}) {
	return (
			<div className='player' style={{left: left+"px", top: top+"px", position: "absolute"}} >
				<img src={image} />
				<p>{name}</p>
			</div>
		)
}


export default PongMulti;
