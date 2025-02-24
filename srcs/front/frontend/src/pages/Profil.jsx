import "../styles/Profil.css"
import EditProfil from "../components/EditProfil";
import { useState, useEffect } from "react";
import { getUser, getMatches } from "../api"
import Navbarr from "../components/Navbar";
import tas from "../assets/tas-de-neige.png"
import profile_logo from "../assets/profile_logo.png"
import { useNavigate } from "react-router-dom";
import Snowfall from 'react-snowfall'

function Profil() {
    const [user, setUser] = useState([])
    const [matches, setMatches] = useState([])
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        inituser()
        initmatches()
        console.log(matches)
    }, []);
    
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    const initmatches = async () => {
        const TMPmatches = await getMatches()
        setMatches(TMPmatches);
    }

    const formEdit = () => {
        edit ? setEdit(false) : setEdit(true);
    }

    const navigate = useNavigate()
    const handleButton = () => {
            navigate("/Config2FA")
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
                        <h2>Stats</h2>
                        <h4 className="center">Winrate</h4>
                        <WinrateBar loses={user.lose_count} wins={user.win_count} />
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <p>Defaites : {user.lose_count}</p><p></p><p> Victoires : {user.win_count}</p>
                        </div>
                        <h4 className="center">Match History</h4>
                        <MatchArray matches={matches} />
                    </div>
                </div> :
            <EditProfil></EditProfil>}
        </div>
    );
}

function WinrateBar({loses = 0, wins = 1}) {
    var fill = (loses / (loses + wins)) * 100
    console.log(fill)

    return (
        <div id="winrate">
            <div id='progress' style={{width: fill + "%"}}> </div>
        </div>
    )
}

function MatchResult({result, date}) {
    return (
        <div className="matchResult" style={{backgroundColor: result == "VICTOIRE" ? "#0f9acc" : "#cc0f38"}}>
            <p>{result}</p>
            <p></p>
            <p>{date}</p>
        </div>
    )
}

function MatchArray({matches}) {
    let matchesResults = []
    
    for (let i = 0; i < matches.length; i++) {
        matchesResults.push(<MatchResult result={matches[i].result} date={matches[i].date} />)
    }
   
    return(<div id="matchHistory">
        {matchesResults.map(input=>input)}
        </div>)
}

export default Profil