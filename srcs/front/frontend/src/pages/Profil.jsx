import "../styles/Profil.css"
import EditProfil from "../components/EditProfil";
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Navbarr from "../components/Navbar";
import tas from "../assets/tas-de-neige.png"
import profile_logo from "../assets/profile_logo.png"
import { useNavigate } from "react-router-dom";
import Snowfall from 'react-snowfall'

function Profil() {
    const [user, setUser] = useState([])
    const [edit, setEdit] = useState(false)
    
    useEffect(() => {
        inituser()
    }, []);
    
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
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
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Arrivera dans la prochaie MAJ :)</p>
                    </div>
                </div> :
            <EditProfil></EditProfil>}
        </div>
    );
}

export default Profil