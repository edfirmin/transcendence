//import { useState, useEffect } from "react"
import React from 'react'
import "../styles/Home.css"
import {useNavigate} from "react-router-dom"
import { useState, useEffect } from "react";
import Navbarr from '../components/Navbar';
import { getQR } from "../api"
import 'bootstrap/dist/css/bootstrap.css';
import logoutLogo from "../assets/logout_logo.png"

function Home() {
    const navigate = useNavigate();
    // const [qr, setQR] = useState([])

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }

    
    // const initqr = async () => {
    //     const TMPuser = await getQR()
    //     setQR(TMPuser);
    // }

    // useEffect(() => {
    //     initqr()
    // }, []);

	return (
		<div>
            <Navbarr></Navbarr>
			<button className="logout-button" onClick={() => handleLogout()}><img className='logout-logo' src={logoutLogo} alt="logoutLogo" /></button>
            {/* <img src={qr} /> */}
		</div>
    );
}

export default Home