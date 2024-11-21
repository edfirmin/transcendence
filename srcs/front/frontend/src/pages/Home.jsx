//import { useState, useEffect } from "react"
import React, {useEffect} from 'react'
import "../styles/Home.css"
import {useNavigate} from "react-router-dom"
import Navbar from '../components/Navbar';
import back_home from '../assets/home_back.mp4'

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }

	return (
		<div>
            {/* <video src={back_home} autoPlay muted loop /> */}
            <Navbar></Navbar>
			<button className="logout-button" onClick={() => handleLogout()}>Logout</button>
		</div>
    );
}

export default Home