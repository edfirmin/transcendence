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
import { getUser, getMatches, getTourney } from "../api"


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
    const nbOfBattleInTotal = players - 1;
    const tourney_id = data.state.tourney_id;
    const currentBattleIndex = data.state.currentBattleIndex == null ? 0 : data.state.currentBattleIndex + 1;
    const [has_ended, set_has_ended] = useState(false);
    const navigate = useNavigate();    
    const [user, setUser] = useState()
    const [tourney, setTourney] = useState(null)
    const [user_icone, set_user_icone] = useState()

    useEffect(() => {
        inituser();
        inittourney();
        console.log(currentBattleIndex);
        //addwinnertourney();
    }, []);
  
    useEffect(() => {
        if (user) {
            set_user_icone(user.profil_pic);
        }
    }, [user]);
  
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }
    const inittourney = async () => {
        const TMPtourney = await getTourney(tourney_id)
        setTourney(TMPtourney);
    }

    const addwinnertourney = async () => {
        if (leftPlayerName) {
            if (winner == 'LEFT')
		        await axios.post('api/user/addWinnerToTourney/', {tourney_id, winner : leftPlayerName, match_number : currentBattleIndex})
            else
                await axios.post('api/user/addWinnerToTourney/', {tourney_id, winner : rightPlayerName, match_number : currentBattleIndex})
        }
        setTourney(tourney);
    }

    function beginNextMatch(leftPlayerName, rightPlayerName) {
        const roomId = uuidv4();
        navigate(`/pong/${roomId}`, {state : { isAI : false, map : map_index, design : design_index, points : p, players : players, leftPlayerName : leftPlayerName, rightPlayerName : rightPlayerName, returnPage : '/tourney/tourneyPresentation', tourney_id : tourney_id, currentBattleIndex : currentBattleIndex
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

    useEffect(() => {
        determineNextMatch();
    }, [tourney])

    // Determiner prochain match
    function determineNextMatch() {
        if (!tourney)
            return;

        switch (players) {
            case 0:
                if (currentBattleIndex == 0)
                    setTimeout(beginNextMatch, 5000, tourney.name1, tourney.name2);
                else
                    set_has_ended(true);
                break;
        
            case 1:
                if (currentBattleIndex == 0)
                    setTimeout(beginNextMatch, 5000, tourney.name1, tourney.name2);
                else if (currentBattleIndex == 1)
                    setTimeout(beginNextMatch, 5000, tourney.winner_match1, tourney.name2);
                else
                    set_has_ended(true);
                break;  

            default:
                break;
        }
    }

    if (!tourney)
        return

    switch (players) {
        case 0:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={250} top={403} />
                    <img id='branch_left' src={branch_1} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={tourney.name2} image={icone_1} left={1390} top={403}/>
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                </>
            )
        case 1:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={250} top={340} />
                    <Player name={tourney.name3} image={icone_2} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={tourney.name2} image={icone_1} left={1390} top={403}/>
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                </>
            )

        case 2:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={250} top={340} />
                    <Player name={tourney.name3} image={icone_2} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={tourney.name2} image={icone_1} left={1390} top={340} />
                    <Player name={tourney.name4} image={icone_3} left={1390} top={466} />
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                
                </>
            )

        case 3:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={230} top={280} />
                    <Player name={tourney.name3} image={icone_2} left={230} top={468} />
                    <Player name={tourney.name5} image={icone_4} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={tourney.name2} image={icone_1} left={1390} top={340} />
                    <Player name={tourney.name4} image={icone_3} left={1390} top={466} />
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                
                </>
            )

        case 4:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={230} top={280} />
                    <Player name={tourney.name3} image={icone_2} left={230} top={468} />
                    <Player name={tourney.name5} image={icone_4} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={tourney.name2} image={icone_1} left={1415} top={280} />
                    <Player name={tourney.name4} image={icone_3} left={1415} top={468} />
                    <Player name={tourney.name6} image={icone_5} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                
                </>
            )

        case 5:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={230} top={215} />
                    <Player name={tourney.name3} image={icone_2} left={230} top={340} />
                    <Player name={tourney.name5} image={icone_4} left={230} top={470} />
                    <Player name={tourney.name7} image={icone_6} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={tourney.name2} image={icone_1} left={1415} top={280} />
                    <Player name={tourney.name4} image={icone_3} left={1415} top={468} />
                    <Player name={tourney.name6} image={icone_5} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                
                </>
            )

        default:
            return (
                <>
                    <Player name={tourney.name1} image={user_icone} left={230} top={215} />
                    <Player name={tourney.name3} image={icone_2} left={230} top={340} />
                    <Player name={tourney.name5} image={icone_4} left={230} top={470} />
                    <Player name={tourney.name7} image={icone_6} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_7} />
                    <Player name={tourney.name2} image={icone_1} left={1415} top={215} />
                    <Player name={tourney.name4} image={icone_3} left={1415} top={340} />
                    <Player name={tourney.name6} image={icone_5} left={1415} top={470} />
                    <Player name={tourney.name8} image={icone_7} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.name1} winner_icone={icone_1} />
                
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
