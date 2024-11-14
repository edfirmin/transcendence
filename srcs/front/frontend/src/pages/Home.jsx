//import { useState, useEffect } from "react"
import React, {useEffect, useState} from 'react'
import "../styles/Home.css"
import "../styles/Home2.css"
import {useNavigate, useLocation} from "react-router-dom"

function Home() {
    const navigate = useNavigate();

	const [title, setTitle] = useState("du Tufu");
  
	function changeTitle()
	{
	  if (title == "du Tufu")
		setTitle("du Past");
	  else
		setTitle("du Tufu");
	}

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }

    const handleProfil = () => {
        navigate("/profil")
    }


    const handlePong = () => {
        navigate("/pong")
    }

	return (
		<>
		  <div id="root">
			  <span id='languages'>
				<button id='fr' class='language'></button>
				<button id='en' class='language'></button>
				<button id='cv' class='language'></button>
			  </span>
			  <div id='top'>
				<div></div>
				<div id="title">
				  <button className='arrowButton' id='leftArrow' onClick={changeTitle}>&lt;</button>
				  <Title text={title} />
				  <button className='arrowButton' id='rightArrow'>&gt;</button>
				</div>
				<div></div>
			  </div>
			  <div id='bottom'>
				<Chat />
				<table id='button_div'>
				<Button name={"Play"} callback={handlePong} />
				<Button name={"Settings"}/>
				</table>
				<div></div>
			  </div>
			</div>
		</>
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

function Title({text}) {
	return(
	  <div>
		<p>Pong</p><p>{text}</p>
	  </div>
	)
}

function Chat() {
	return (
	  <div id='chat'>
		<ul>
		  <li>Bonjour</li>
		  <li>Oui</li>
		</ul>
	  </div>
	)
}  

export default Home