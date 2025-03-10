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
import { getUser, getMatches, getTourney, getUserWithId, getTourneyPlayers, getUserWithUsername } from "../api"
import axios from 'axios';
import { ACCESS_TOKEN } from "../constants";


function TourneyPresentation() {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    
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
    const [next_match, set_next_match] = useState(false);
    const [left_opponent, set_left_opponent] = useState();
    const [right_opponent, set_right_opponent] = useState();
    const navigate = useNavigate();    
    const [user, setUser] = useState()
    const [tourney, setTourney] = useState(null)
    const [tourneyPlayers, setTourneyPlayers] = useState([])
    const [user_icone, set_user_icone] = useState()
    const profiles_pics = [icone_1, icone_2, icone_3, icone_4, icone_5, icone_6, icone_7, icone_8]
    const [users, setUsers] = useState([])
    const [isReady, SetIsReady] = useState(false)

    useEffect(() => {
        inituser();
        inittourney();
        initplayers();
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
        if (leftPlayerName) {
            if (winner == 'LEFT')
		        await axios.post('api/user/addWinnerToTourney/', {tourney_id, winner : leftPlayerName, match_number : currentBattleIndex})
            else
                await axios.post('api/user/addWinnerToTourney/', {tourney_id, winner : rightPlayerName, match_number : currentBattleIndex})
        }
        const TMPtourney = await getTourney(tourney_id)
        setTourney(TMPtourney);
    }
    const initplayers = async () => {
        const TMPplayers = await getTourneyPlayers(tourney_id)
        setTourneyPlayers(TMPplayers);

        var TMPUsers = [];

        if (TMPplayers[0]) { if (TMPplayers[0].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[0].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[1]) { if (TMPplayers[1].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[1].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[2]) { if (TMPplayers[2].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[2].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[3]) { if (TMPplayers[3].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[3].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[4]) { if (TMPplayers[4].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[4].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[5]) { if (TMPplayers[5].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[5].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[6]) { if (TMPplayers[6].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[6].name); TMPUsers.push(tmpuser);
        }}
        if (TMPplayers[7]) { if (TMPplayers[7].isUser == true) {
            const tmpuser = await getUserWithUsername(TMPplayers[7].name); TMPUsers.push(tmpuser);
        }}
        setUsers(TMPUsers);

        await timeout(1000)
        SetIsReady(true)
    }

    function timeout(delay) {


        return new Promise( res => setTimeout(res, delay) );
    }

    function getIconeWithName(name) {
        if (tourneyPlayers[0].name == name)
            return user_icone;

        for (let i = 0; i < tourneyPlayers.length; i++) {
            if (tourneyPlayers[i].name == name) {
                if (tourneyPlayers[i].isUser) {
                    console.log("name : " + tourneyPlayers[i].name)
                    console.log("users length : " + users.length)
                        for (let j = 0; j < users.length; j++) {
                            if (tourneyPlayers[i].name == users[j].username) {
                                return users[j].profil_pic                   
                        }  
                    }
                } else
                    return profiles_pics[i -1];
            }
        }
        return icone_1;
    } 

    function isAUser(name) {
        for (let j = 0; j < users.length; j++) {
            if (name == users[j].username)
                return true
        }
        return false
    }

    useEffect(() => {
        async function addtourneywincount() {
            if (!has_ended)
                return
            
            if (winner == 'LEFT' && isAUser(leftPlayerName)) {
                await axios.post('api/user/addTourneyWinCount/', {username: leftPlayerName})
            }
            if (winner == 'RIGHT' && isAUser(rightPlayerName)) {
                await axios.post('api/user/addTourneyWinCount/', {username: rightPlayerName})
            }
        }
        addtourneywincount();
    }, [has_ended])


    useEffect(() => {
        if (!isReady)
            return;

        determineNextMatch();
    }, [isReady])

    function nextMatch(name_first, name_second) {
        set_left_opponent(name_first);
        set_right_opponent(name_second);
        set_next_match(true);
    }

    // Determiner prochain match
    function determineNextMatch() {
        if (!tourney)
            return;

        switch (players) {
            case 0:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[0].name, tourneyPlayers[1].name);
                else
                    set_has_ended(true);
                break;
        
            case 1:
                if (currentBattleIndex == 0) 
                    nextMatch(tourneyPlayers[0].name, tourneyPlayers[2].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourney.winner_match1, tourneyPlayers[1].name);
                else
                    set_has_ended(true);
                break;  

            case 2:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[0].name, tourneyPlayers[2].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourneyPlayers[1].name, tourneyPlayers[3].name);
                else if (currentBattleIndex == 2)
                    nextMatch(tourney.winner_match1, tourney.winner_match2);
                else
                    set_has_ended(true);
                break;  

            case 3:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[2].name, tourneyPlayers[4].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourneyPlayers[1].name, tourneyPlayers[3].name);
                else if (currentBattleIndex == 2)
                    nextMatch(tourneyPlayers[0].name, tourney.winner_match1);
                else if (currentBattleIndex == 3)
                    nextMatch(tourney.winner_match3, tourney.winner_match2);
                else
                    set_has_ended(true);
                break;  

            case 4:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[2].name, tourneyPlayers[4].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourneyPlayers[3].name, tourneyPlayers[5].name);
                else if (currentBattleIndex == 2)
                    nextMatch(tourneyPlayers[0].name, tourney.winner_match1);
                else if (currentBattleIndex == 3)
                    nextMatch(tourneyPlayers[1].name, tourney.winner_match2);
                else if (currentBattleIndex == 4)
                    nextMatch(tourney.winner_match3, tourney.winner_match4);
                else
                    set_has_ended(true);
                break;  

            case 5:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[0].name, tourneyPlayers[2].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourneyPlayers[4].name, tourneyPlayers[6].name);
                else if (currentBattleIndex == 2)
                    nextMatch(tourneyPlayers[3].name, tourneyPlayers[5].name);
                else if (currentBattleIndex == 3)
                    nextMatch(tourneyPlayers[1].name, tourney.winner_match3);
                else if (currentBattleIndex == 4)
                    nextMatch(tourney.winner_match1, tourney.winner_match2);
                else if (currentBattleIndex == 5)
                    nextMatch(tourney.winner_match4, tourney.winner_match5);
                else
                    set_has_ended(true);
                break;  

            case 6:
                if (currentBattleIndex == 0)
                    nextMatch(tourneyPlayers[0].name, tourneyPlayers[2].name);
                else if (currentBattleIndex == 1)
                    nextMatch(tourneyPlayers[4].name, tourneyPlayers[6].name);
                else if (currentBattleIndex == 2)
                    nextMatch(tourneyPlayers[1].name, tourneyPlayers[3].name);
                else if (currentBattleIndex == 3)
                    nextMatch(tourneyPlayers[5].name, tourneyPlayers[7].name);
                else if (currentBattleIndex == 4)
                    nextMatch(tourney.winner_match1, tourney.winner_match2);
                else if (currentBattleIndex == 5)
                    nextMatch(tourney.winner_match3, tourney.winner_match4);
                else if (currentBattleIndex == 6)
                    nextMatch(tourney.winner_match5, tourney.winner_match6);
                else
                    set_has_ended(true);
                break;  

        }
    }

    if (!tourney || !tourneyPlayers || !users || !isReady)
        return (
            <div class="spinner">
            <div></div>   
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            </div>
        )

    switch (players) {
        case 0:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={250} top={403} />
                    <img id='branch_left' src={branch_1} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={403}/>
                    <Victory show={has_ended} winner_name={tourney.winner_match1} winner_icone={getIconeWithName(tourney.winner_match1)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />
                </>
            )
        case 1:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={250} top={340} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_1} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={403}/>
                    <Victory show={has_ended} winner_name={tourney.winner_match2} winner_icone={getIconeWithName(tourney.winner_match2)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />
                </>
            )

        case 2:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={250} top={340} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={250} top={466} />
                    <img id='branch_left' src={branch_2} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={340} />
                    <Player name={tourneyPlayers[3].name} image={getIconeWithName(tourneyPlayers[3].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={466} />
                    <Victory show={has_ended} winner_name={tourney.winner_match3} winner_icone={getIconeWithName(tourney.winner_match3)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />
                </>
            )

        case 3:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={280} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={468} />
                    <Player name={tourneyPlayers[4].name} image={getIconeWithName(tourneyPlayers[4].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_3} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={340} />
                    <Player name={tourneyPlayers[3].name} image={getIconeWithName(tourneyPlayers[3].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1390} top={466} />
                    <Victory show={has_ended} winner_name={tourney.winner_match4} winner_icone={getIconeWithName(tourney.winner_match4)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />

                </>
            )

        case 4:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={280} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={468} />
                    <Player name={tourneyPlayers[4].name} image={getIconeWithName(tourneyPlayers[4].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={595} />
                    <img id='branch_left' src={branch_4} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={280} />
                    <Player name={tourneyPlayers[3].name} image={getIconeWithName(tourneyPlayers[3].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={468} />
                    <Player name={tourneyPlayers[5].name} image={getIconeWithName(tourneyPlayers[5].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.winner_match5} winner_icone={getIconeWithName(tourney.winner_match5)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />

                </>
            )

        case 5:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={215} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={340} />
                    <Player name={tourneyPlayers[4].name} image={getIconeWithName(tourneyPlayers[4].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={470} />
                    <Player name={tourneyPlayers[6].name} image={getIconeWithName(tourneyPlayers[6].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_5} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={280} />
                    <Player name={tourneyPlayers[3].name} image={getIconeWithName(tourneyPlayers[3].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={468} />
                    <Player name={tourneyPlayers[5].name} image={getIconeWithName(tourneyPlayers[5].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.winner_match6} winner_icone={getIconeWithName(tourney.winner_match6)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />

                </>
            )

        default:
            return (
                <>
                    <Player name={tourneyPlayers[0].name} image={getIconeWithName(tourneyPlayers[0].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={215} />
                    <Player name={tourneyPlayers[2].name} image={getIconeWithName(tourneyPlayers[2].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={340} />
                    <Player name={tourneyPlayers[4].name} image={getIconeWithName(tourneyPlayers[4].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={470} />
                    <Player name={tourneyPlayers[6].name} image={getIconeWithName(tourneyPlayers[6].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={230} top={595} />
                    <img id='branch_left' src={branch_6} />
                    <img id='victory_cup' src={victory_cup} alt="" />
                    <img id='branch_right' src={branch_7} />
                    <Player name={tourneyPlayers[1].name} image={getIconeWithName(tourneyPlayers[1].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={215} />
                    <Player name={tourneyPlayers[3].name} image={getIconeWithName(tourneyPlayers[3].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={340} />
                    <Player name={tourneyPlayers[5].name} image={getIconeWithName(tourneyPlayers[5].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={470} />
                    <Player name={tourneyPlayers[7].name} image={getIconeWithName(tourneyPlayers[7].name)} left_opponent={left_opponent} right_opponent={right_opponent} left={1415} top={595} />
                    <Victory show={has_ended} winner_name={tourney.winner_match7} winner_icone={getIconeWithName(tourney.winner_match7)} />
                    <NextMatch show={next_match} left_name={left_opponent} right_name={right_opponent} left_icone={getIconeWithName(left_opponent)} right_icone={getIconeWithName(right_opponent)} 
                    map_index={map_index} design_index={design_index} p={p} players={players} currentBattleIndex={currentBattleIndex} tourney_id={tourney_id} isLeftPlayerAUser={isAUser(left_opponent)} isRightPlayerAUser={isAUser(right_opponent)} />

                </>
            )
    }

}

function Player({name, image, left_opponent, right_opponent, left, top, isDefeated = false}) {
    let highlight = false;

    if (left_opponent == name || right_opponent == name) 
        highlight = true;


    if (isDefeated) {
        return (
            <div className='player_defeated' style={{left: left+'px', top: top+'px'}}>
                <img src={image} />
                <p>{name}</p>
            </div>
        )
    }
    else if (highlight) {
        return (
            <div className='player_highlight' style={{left: left+'px', top: top+'px'}}>
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

function NextMatch({show, left_name, right_name, left_icone, right_icone, map_index, design_index, p, players, currentBattleIndex, tourney_id, isLeftPlayerAUser, isRightPlayerAUser}) {
    const navigate = useNavigate();    
    
    function beginNextMatch() {
        const roomId = uuidv4();
        navigate(`/pong/${roomId}`, {state : { isAI : false, map : map_index, design : design_index, points : p, players : players, leftPlayerName : left_name, rightPlayerName : right_name, returnPage : '/tourney/tourneyPresentation', tourney_id : tourney_id, currentBattleIndex : currentBattleIndex,
            leftPlayerIsUser: isLeftPlayerAUser, rightPlayerIsUser: isRightPlayerAUser
        }});
    }
    
    if (show) {
        return (
            <div id='next_match'>
                <p>PROCHAIN MATCH</p>
                <div id='space'></div>
                <Player name={left_name}  image={left_icone} left={20} top={90} />
                <Player name={right_name} image={right_icone} left={260} top={90} />
                <Button name={"Prochain Match"} callback={() => {beginNextMatch()}} />
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
