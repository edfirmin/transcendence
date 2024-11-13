//import { useState, useEffect } from "react"
import React, {useEffect} from 'react'
import "../styles/Home.css"
import {useNavigate, useLocation} from "react-router-dom"

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }

    const handleProfil = () => {
        navigate("/profil")
    }

	return (
		<div>
			<h2>Transcendence</h2>{/*replacer par le logo*/}
			<button className="logout-button" onClick={() => handleLogout()}>Logout</button>
			<br/>
			<button onClick={() => handleProfil()}>Profil</button>
		</div>
    );
}

export default Home