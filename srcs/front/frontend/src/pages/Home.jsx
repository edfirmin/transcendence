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
      <button className='pong-button' onClick={() => handlePong()}></button>
      <button className='hangman-button' onClick={() => handleHangman()}>fdsfsfdfjkfhkjasf</button>
			<button className="logout-button" onClick={() => handleLogout()}>deconextion</button>
		</div>
    );
}

function Button({name, callback}) {
	return (
	  <tr>
		<td>
		  <button className='button' onClick={() => callback()}>{name} </button>
		</td>
	  </tr>
	)
}

export default Home