import "../styles/Profil.css"
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Navbar from "../components/Navbar";
import back_home from '../assets/home_back.mp4'

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
            <Navbar></Navbar>
            <section className="bg-profil">
                <div className="content-profil">
                    <h1>{user.username}</h1>
                    <img className="pp" src={user.profil_pic}/>
                </div>
            </section>
        </div>
    );
}

export default Profil