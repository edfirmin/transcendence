import React, {useEffect, useState, useRef} from 'react'
import {v4 as uuidv4} from 'uuid';
import "../styles/TourneyPresentation.css"
import { useNavigate, useLocation } from "react-router-dom"
import icone_1 from '../assets/img/dravaono.jpg'; import icone_2 from '../assets/img/edfirmin.jpg'; import icone_3 from '../assets/img/fpalumbo.jpg';
import icone_4 from '../assets/img/jfazi.jpg'; import icone_5 from '../assets/img/ndesprez.jpg'; import icone_6 from '../assets/img/tpenalba.jpg';
import icone_7 from '../assets/img/hdupire.jpg'; import icone_8 from '../assets/img/ychirouz.jpg'; 
import victory_cup from '../assets/img/victory_cup.png'
import branch_1 from '../assets/img/tourney_branch_0.png'; import branch_2 from '../assets/img/tourney_branch_1.png';
import branch_3 from '../assets/img/tourney_branch_2.png'; import branch_4 from '../assets/img/tourney_branch_3.png';
import branch_5 from '../assets/img/tourney_branch_4.png'; import branch_6 from '../assets/img/tourney_branch_5.png';
import branch_7 from '../assets/img/tourney_branch_6.png';

function TourneyPresentation() {
    const data = useLocation();
    const isAI = data.state == null ? false : data.state.isAI;
    const difficulty = data.state == null ? "easy" : data.state.difficulty;
    const map_index = data.state.map;
    const design_index = data.state.design;
    const p = data.state.points;
    const players = data.state.players;
    const winner = data.state.winner;
    const leftPlayerName = data.state.leftPlayerName;
	const rightPlayerName = data.state.rightPlayerName;
    const name1 = data.state.name1;
    const name2 = data.state.name2;
    const name3 = data.state.name3;
    const name4 = data.state.name4;
    const name5 = data.state.name5;
    const name6 = data.state.name6;
    const name7 = data.state.name7;
    const name8 = data.state.name8;
    const nbOfBattleInTotal = players - 1;
    const currentBattleIndex = data.state.currentBattleIndex == null ? 0 : data.state.currentBattleIndex + 1;7
    var has_ended = false;
    const navigate = useNavigate();    

    function beginNextMatch(leftPlayerName, rightPlayerName) {
        const roomId = uuidv4();
        navigate(`/pong/${roomId}`, {state : { isAI : false, map : map_index, design : design_index, points : p, players : players, leftPlayerName : leftPlayerName, rightPlayerName : rightPlayerName, returnPage : '/tourney/tourneyPresentation',
            name1 : name1, name2 : name2, name2, name3 : name3, name4 : name4, name5: name5, name6 : name6, name7 : name7, name8 : name8, currentBattleIndex : currentBattleIndex,
            matchs : { first : { left : null, right : null}, second : { left : null, right : null}, third : { left : null, right : null }, fourth : { left : null, right : null } }
        }});
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

    // Determiner prochain match
    function determineNextMatch() {
        switch (players) {
            case 0:
                if (currentBattleIndex == 0)
                    useInterval(beginNextMatch, 3000, name1, name2);
                else
                    has_ended = true;
                break;
        
            default:
                break;
        }
    }

    determineNextMatch();

    switch (players) {
        case 0:
            return (
                <>
                    <Player name={name1} image={icone_1} left={250} top={403} />
                    <img id='branch_left' src={branch_1} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={name2} image={icone_2} left={1390} top={403}/>
                    <Victory show={has_ended} winner_name={name1} winner_icone={icone_1} />
                </>
            )
        case 1:
            return (
                <>
                    <Player name={name1} image={icone_1} left={250} top={340} />
                    <Player name={name3} image={icone_3} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={name2} image={icone_2} left={1390} top={403}/>
                </>
            )

        case 2:
            return (
                <>
                    <Player name={name1} image={icone_1} left={250} top={340} />
                    <Player name={name3} image={icone_3} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={name2} image={icone_2} left={1390} top={340} />
                    <Player name={name4} image={icone_4} left={1390} top={466} />
                </>
            )

        case 3:
            return (
                <>
                    <Player name={name1} image={icone_1} left={230} top={280} />
                    <Player name={name3} image={icone_3} left={230} top={468} />
                    <Player name={name5} image={icone_5} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={name2} image={icone_2} left={1390} top={340} />
                    <Player name={name4} image={icone_4} left={1390} top={466} />
                </>
            )

        case 4:
            return (
                <>
                    <Player name={name1} image={icone_1} left={230} top={280} />
                    <Player name={name3} image={icone_3} left={230} top={468} />
                    <Player name={name5} image={icone_5} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={name2} image={icone_2} left={1415} top={280} />
                    <Player name={name4} image={icone_4} left={1415} top={468} />
                    <Player name={name6} image={icone_6} left={1415} top={595} />
                </>
            )

        case 5:
            return (
                <>
                    <Player name={name1} image={icone_1} left={230} top={215} />
                    <Player name={name3} image={icone_3} left={230} top={340} />
                    <Player name={name5} image={icone_5} left={230} top={470} />
                    <Player name={name7} image={icone_7} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={name2} image={icone_2} left={1415} top={280} />
                    <Player name={name4} image={icone_4} left={1415} top={468} />
                    <Player name={name6} image={icone_6} left={1415} top={595} />
                </>
            )

        default:
            return (
                <>
                    <Player name={name1} image={icone_1} left={230} top={215} />
                    <Player name={name3} image={icone_3} left={230} top={340} />
                    <Player name={name5} image={icone_5} left={230} top={470} />
                    <Player name={name7} image={icone_7} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_7} />
                    <Player name={name2} image={icone_2} left={1415} top={215} />
                    <Player name={name4} image={icone_4} left={1415} top={340} />
                    <Player name={name6} image={icone_6} left={1415} top={470} />
                    <Player name={name8} image={icone_8} left={1415} top={595} />
                </>
            )
    }

}

function Player({name, image, left, top, isDefeated = false}) {
    if (isDefeated) {
        return (
            <div className='player_defeated' style={{left: left+'px', top: top+'px'}}>
                <img src={image} />
                <p>{name}</p>
            </div>
        )
    }
    else {  
        return (
            <div className='player2' style={{left: left+'px', top: top+'px'}}>
                <img src={image} />
                <p>{name}</p>
            </div>
        )
    }
}

function Victory({show, winner_name, winner_icone}) {
    const navigate = useNavigate();    

    if (show) {
        return (
            <div id='victory'>
                <p>VICTOIRE DE</p>
                <div id='space'></div>
                <Player name={winner_name} image={winner_icone} left={140} top={80} />
                <Button name={"Go To Main Menu"} callback={() => {navigate("/home")}} />
            </div>
        )
    }
    else {
        return;
    }
}


function Button({name, callback}) {
	return (
	  <tr>
		<td>
		  <button className='button' onClick={() => callback()}>{name} </button>
		</td>
	  </tr>
	)
}

export default TourneyPresentation;
