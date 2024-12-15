import "../styles/Profil.css"
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Navbarr from "../components/Navbar";
import back_home from '../assets/home_back.mp4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Profil() {
    const [user, setUser] = useState([])
    
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    useEffect(() => {
        inituser()
    }, []);


    return (
        <div>
            <video src={back_home} autoPlay muted loop />
            <Navbarr></Navbarr>
            <section className="bg-profil">
                <div className="content-profil">
                    <FontAwesomeIcon icon="check-square" />
                    <h1>{user.username}</h1>
                    <img className="pp" src={user.profil_pic}/>
                </div>
            </section>
        </div>
    );
}

export default Profil