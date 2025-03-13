//import { useState, useEffect } from "react"
import React from 'react'
import "../styles/Home.css"
import {useNavigate} from "react-router-dom"
import Navbarr from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.css';

function Home() {
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

	return (
		<div>
      <Navbarr></Navbarr>
      <button style={{height: "150px", width:"300px", position: "absolute", left:"500px", top:"400px"}} className='button' onClick={() => handlePong()}>Pong</button>
      <button style={{height: "150px", width:"350px", position: "absolute", left:"1000px", top:"400px"}} className='button' onClick={() => handleHangman()}>Hangman</button>
			<button className="logout-button" onClick={() => handleLogout()}>deconextion</button>
		</div>
  );
}

function Button({name, callback}) {
	return (
		  <button className='button' onClick={() => callback()}>{name} </button>
	)
}

export default Home