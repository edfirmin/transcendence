import "../styles/Profil.css"
import EditProfil from "../components/EditProfil";
import { useState, useEffect } from "react";
import { getUser, getMatches, getHangmanGames } from "../api"
import Navbarr from "../components/Navbar";
import tas from "../assets/tas-de-neige.png"
import profile_logo from "../assets/profile_logo.png"
import { useNavigate } from "react-router-dom";
import Snowfall from 'react-snowfall'
import victory_cup from '../assets/img/victory_cup.png'
import star_icon from '../assets/img/star_icon.webp'
import classic_map_design from '../assets/img/classic_map_design.png'
import tennis_map_design from '../assets/img/tennis_map_design.png'
import table_tennis_map_design from '../assets/img/table_tennis_map_design.png'

function Profil() {
    const [user, setUser] = useState([])
    const [matches, setMatches] = useState([])
    const [hangman_games, setHangmanGames] = useState([])
    const [edit, setEdit] = useState(false)
    const [preferAIDifficulty, setPreferAIDifficulty] = useState("none")
    const [preferMap, setPreferMap] = useState(-1)
    const [averageTime, setAverageTime] = useState(null)
    const map_design = [classic_map_design, tennis_map_design, table_tennis_map_design];
    const [selectedPong, setSelectedPong] = useState(true);

    useEffect(() => {
        inituser()
        initmatches()
        inithangmangames()
    }, []);
    
    useEffect(() => {
        PreferAIDifficulty();
        PreferMap();
        AverageTime();
    }, [matches])

    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    const initmatches = async () => {
        const TMPmatches = await getMatches()
        setMatches(TMPmatches);
    }

    const inithangmangames = async () => {
        const TMPgames = await getHangmanGames()
        setHangmanGames(TMPgames);
    }

    const formEdit = () => {
        edit ? setEdit(false) : setEdit(true);
    }

    const navigate = useNavigate()
    const handleButton = () => {
            navigate("/Config2FA")
    }
    
    function PreferAIDifficulty()
    {
        let easy = 0;
        let medium = 0;
        let hard = 0;

        for (let i = 0; i < matches.length; i++) {
            if (matches[i].type == "AI easy")
                easy++;
            if (matches[i].type == "AI medium")
                medium++;
            if (matches[i].type == "AI hard")
                hard++;
        }
        
        // EASY
        if (easy > medium && easy > hard) {
            setPreferAIDifficulty("FACILE");
            return;
        }
        // MEDIUM
        if (medium > easy && medium > hard) {
            setPreferAIDifficulty("MOYEN");
            return;
        }
        // HARD
        if (hard > medium && hard > easy) {
            setPreferAIDifficulty("DIFFICILE");
            return;
        }
        // ALL
        if (easy == medium && medium == hard) {
            setPreferAIDifficulty("AUCUNE EN PARTICULIER");
            return;
        }
        // EASY - MEDIUM
        if (easy == medium) {
            setPreferAIDifficulty("FACILE - MOYEN");
            return;
        }
        // MEDIUM - HARD
        if (medium == hard) {
            setPreferAIDifficulty("MOYEN - DIFFICILE");
            return;
        }
        // EASY - HARD
        if (easy == hard) {
            setPreferAIDifficulty("FACILE - DIFFICILE");
            return;
        }
    }

    function PreferMap()
    {
        let first = 0;
        let second = 0;
        let third = 0;

        for (let i = 0; i < matches.length; i++) {
            if (matches[i].map_index == 0)
                first++;
            if (matches[i].map_index == 1)
                second++;
            if (matches[i].map_index == 2)
                third++;
        }
        
        // EASY
        if (first > second && first > third) {
            setPreferMap(0);
            return;
        }
        // MEDIUM
        if (second > first && second > third) {
            setPreferMap(1);
            return;
        }
        // HARD
        if (third > second && third > first) {
            setPreferMap(2);
            return;
        }
        
    }

    function AverageTime()
    {
        let time = 0;

        for (let i = 0; i < matches.length; i++) {
            time += matches[i].time;
        }
    
        setAverageTime(time / matches.length);
    }

    return (
        <div>
            <Navbarr></Navbarr>
            <Snowfall></Snowfall>
            {/* <Snowfall snowflakeCount={100} radius={[0.5,2]}/> */}
            {!edit ? 
                <div className="content-profil">
                    <div className="top">
                        <img src={profile_logo} className="profile-logo"/>
                    </div>
                    <img className="tas" src={tas} alt="tas" />
                    <div className="left">
                        <img className="pp" src={user.profil_pic}/>
                        <h1>{user.username}</h1>
                        <h2>Prénom: {user.first_name}</h2>
                        <h2>Nom: {user.last_name}</h2>
                        <h2>E-mail: {user.email}</h2>
                        <button onClick={formEdit} className="lb">Modifier ton profile</button>
                        <button onClick={handleButton} className="rb">Activer la 2FA</button>
                    </div>
                    <div className="rigth">
                        <div id="choose_game">
                            <button style={{borderRadius: "10px 0 0 10px", backgroundColor: selectedPong ? "gray" : "white"}} onClick={() => {setSelectedPong(true)}}>Pong</button>
                            <button style={{borderRadius: "0 10px 10px 0", backgroundColor: selectedPong ? "white" : "gray"}} onClick={() => {setSelectedPong(false)}}>Hangman</button>
                        </div>
                        { selectedPong ? 
                            <>
                            <div id="stats_up">
                                <h2>Stats</h2>
                                <div>
                                    <p>{user.tourney_win_count}</p>
                                    <img src={victory_cup} style={{height: "50px", width: "50px"}} />
                                </div>
                                
                            </div>
                            <h4 className="center">Winrate</h4>
                            <WinrateBar loses={user.lose_count} wins={user.win_count} />
                            <div>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <p>Défaites : {user.lose_count}</p><p></p><p> Victoires : {user.win_count}</p>
                            </div>
                            </div>
                            <div className="small_space"></div>
                            <h4 className="center">Préférence de difficulté IA</h4>
                            <p className="center">{preferAIDifficulty}</p>                       
                            <div className="small_space"></div>
                            <h4 className="center">Préférence de Map</h4>
                            {preferMap == -1 ? <p className="center">Aucune</p> : <img className="center" style={{width: "75px", height: "75px"}} src={map_design[preferMap]} />}
                            <div className="small_space"></div>
                            <div className="small_space"></div>

                            <h4 className="center">Durée moyenne match</h4>
                            {averageTime != null ? <p className="center">{String(Number.parseFloat(averageTime).toFixed(0)).substring(0, String(Number.parseFloat(averageTime).toFixed(0)).length - 3)} s</p> : <p className="center">No Match Play</p>}
                            <div className="small_space"></div>
                            <h4 className="center">Historique de Match</h4>
                            <MatchArray matches={matches} />
                            </>
                        :
                            <>
                            <div id="stats_up">
                                <h2>Stats</h2>
                                <div>
                                    <p>{user.hangman_score}</p>
                                    <img src={star_icon} style={{height: "50px", width: "50px"}} />
                                </div>
                            </div>
                                <h4 className="center">Winrate</h4>
                                <WinrateBar loses={user.hangman_lose_count} wins={user.hangman_win_count} />
                                <div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <p>Non trouvés : {user.hangman_lose_count}</p><p></p><p> Trouvés : {user.hangman_win_count}</p>
                                </div>
                            </div>
                            <h4 className="center">Historique des Parties</h4>
                            <HangmanArray hangman_games={hangman_games} />
                            </>
                        }
                    </div>
                </div> :
            <EditProfil></EditProfil>}
        </div>
    );
}

function WinrateBar({loses, wins}) {
    var fill;
    if (loses == 0 && wins == 0)
        fill = 50
    else
        fill = (loses / (loses + wins)) * 100

    return (
        <div id="winrate">
            <div id='progress' style={{width: fill + "%"}}> </div>
        </div>
    )
}

function MatchResult({result, date, score_left, score_right, time, type, longest_exchange, shortest_exchange, map_index, is_tourney, opponent}) {
    const [isClicked, setIsClicked] = useState(false)
    const map_design = [classic_map_design, tennis_map_design, table_tennis_map_design];

    return (
        <div onClick={() => {if (isClicked) {setIsClicked(false);} else {setIsClicked(true);} console.log(isClicked)}} className="matchResult" style={{backgroundColor: result == "VICTOIRE" ? "#0f9acc" : "#cc0f38"}}>
            { isClicked ? (
            <div>
            <span className="matchResultFirstRow">    
                <p className="matchResultResult">{score_left}-{score_right}</p>
                <p className="matchResultResult">{result}</p>
                <span><p>{date}</p></span>
            </span>
            <hr/>
            <div>   
                <div className="matchResultDataHolder">   
                <div>
                    <p>match de tournoi</p>
                    {opponent != 'null' && <p>adversaire</p>}
                    <p>durée</p>
                    <p>type</p>
                    <p>plus long échange</p>
                    <p>plus court échange</p>
                    <p>map</p>
                </div>
                <div>
                    {is_tourney ? <p>oui</p> : <p>non</p>} 
                    {opponent != 'null' && <p>{opponent}</p> }
                    <p>{time} s</p>
                    <p>{type}</p>
                    <p>{longest_exchange}</p>
                    <p>{shortest_exchange}</p>
                    <img style={{width: "50px", height: "50px"}} src={map_design[map_index]} alt="" />
                </div>
            </div>
            </div>
            </div>)
            :  (
                <div>
                    <span className="matchResultFirstRow">    
                    <p className="matchResultResult">{score_left}-{score_right}</p>
                    <p className="matchResultResult">{result}</p>
                    <span><p>{date}</p></span>
                    </span>
                </div>
            )}
        </div>
    )
}

function MatchArray({matches}) {
    let matchesResults = []
    
    for (let i = 0; i < matches.length; i++) {
        matchesResults.push(<MatchResult key={i} result={matches[i].result} date={matches[i].date} score_left={matches[i].score_left} score_right={matches[i].score_right} time={String(matches[i].time).substring(0, String(matches[i].time).length - 3)} type={matches[i].type} longest_exchange={matches[i].longest_exchange} shortest_exchange={matches[i].shortest_exchange} map_index={matches[i].map_index} is_tourney={matches[i].is_tourney} opponent={matches[i].opponent}/>)
    }
   
    return(<div id="matchHistory">
        {matchesResults.map(input=>input)}
        </div>)
}

function HangmanResult({finded, word, date, word_group, skin}) {
    const [isClicked, setIsClicked] = useState(false)

    return (
        <div onClick={() => {if (isClicked) {setIsClicked(false);} else {setIsClicked(true);} console.log(isClicked)}} className="matchResult" style={{backgroundColor: finded ? "#0f9acc" : "#cc0f38"}}>
            { isClicked ? (
            <div>
            <span className="matchResultFirstRow">    
                {finded ? <p className="matchResultResult">TROUVE</p> : <p className="matchResultResult">NON TROUVE</p>}
                <span><p>{date}</p></span>
            </span>
            <hr/>
            <div className="matchResultDataHolder">   
                <div>
                    <p>mot</p>
                    <p>groupe</p>
                    <p>skin</p>
                </div>
                <div>
                    <p>{word}</p>
                    <p>{word_group}</p>
                    <p>{skin}</p>
                </div>
            </div>
            </div>)
            :  (
                <div>
                    <span className="matchResultFirstRow">    
                    {finded ? <p className="matchResultResult">TROUVE</p> : <p className="matchResultResult">NON TROUVE</p>}
                    <span><p>{date}</p></span>
                    </span>
                </div>
            )}
        </div>
    )
}

function HangmanArray({hangman_games}) {
    let matchesResults = []
    
    for (let i = 0; i < hangman_games.length; i++) {
        matchesResults.push(<HangmanResult key={i} finded={hangman_games[i].finded} word={hangman_games[i].word} date={hangman_games[i].date} word_group={hangman_games[i].word_group} skin={hangman_games[i].skin} />)
    }
   
    return(<div id="matchHistory">
        {matchesResults.map(input=>input)}
        </div>)
}

export default Profil