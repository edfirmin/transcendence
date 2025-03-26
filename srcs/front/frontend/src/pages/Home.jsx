//import { useState, useEffect } from "react"
import React from 'react'
import "../styles/Home.css"
import {useNavigate} from "react-router-dom"
import { getUser } from "../api"
import Navbarr from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from "react";
import select from "../assets/select.png"
import ou from "../assets/ou.png"
import pongg from "../assets/pongg.gif"
import kermit from "../assets/kermit-hangman.gif"


function Home({setUser}) {
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.clear();
      navigate("/login")
  }

  const handlePong = () => {
      navigate("/selection")
  }

  const handleHangman = () => {
    navigate("/hangman")
  }

  useEffect(() => {
      inituser()
  }, []);

  const inituser = async () => {
      const TMPuser = await getUser()
      setUser(TMPuser);
  }

	return (
		<div>
      <Navbarr></Navbarr>
      <div className='home-div'>
        <div className='home-top'><img src={select} /></div>
        <button  onClick={() => handlePong()}><img className='home-buttonP' src={pongg} /></button>
        <img className='home-ou' src={ou} />
        <button onClick={() => handleHangman()}><img className='home-buttonH' src={kermit} /></button>
      </div>
		</div>
  );
}

export default Home