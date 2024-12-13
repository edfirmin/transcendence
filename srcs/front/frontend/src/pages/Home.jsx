//import { useState, useEffect } from "react"
import React from 'react'
import "../styles/Home.css"
import {useNavigate} from "react-router-dom"
import { useState, useEffect } from "react";
import Navbarr from '../components/Navbar';
import back_home from '../assets/home_back.mp4'
import { getQR } from "../api"

function Home() {
    const navigate = useNavigate();
    const [qr, setQR] = useState([])

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }

    
    const initqr = async () => {
        const TMPuser = await getQR()
        setQR(TMPuser);
    }

    useEffect(() => {
        initqr()
    }, []);

	return (
		<div>
            {/* <video src={back_home} autoPlay muted loop /> */}
            <Navbarr></Navbarr>
			<button className="logout-button" onClick={() => handleLogout()}>Logout</button>
            <img src={qr} alt="wq" />
		</div>
    );
}

export default Home