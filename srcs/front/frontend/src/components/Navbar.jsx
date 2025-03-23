import React, {Component} from "react";
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import logout from "../assets/arrow.png"
import '../styles/Navbar.css';
import Snowfall from 'react-snowfall'
import logo from "../assets/logo.png"
import pong from "../assets/pong.png"
import hangman from "../assets/hangman.png"
import l from "../assets/cl.png"
import r from "../assets/cr.png"
import {useNavigate} from "react-router-dom"

function Navbarr() {
    const [user_pp, setUser] = useState([])
    const navigate = useNavigate();

    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser.profil_pic);
    }

    useEffect(() => {
        inituser()
    }, []);

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
    <Navbar bg="myBG" variant="dark" className="navi">
      <Snowfall snowflakeCount={30} radius={[0.5,0.5]}/>
        <Navbar.Brand href="/home"><img className="logo" src={logo}/></Navbar.Brand>
        <Image className="nav-cl" src={l} />
        <Image className="nav-cr" src={r} />
        <Nav.Link href="/profil"><img className="pp_nav" src={user_pp}/></Nav.Link>
        <Nav.Link onClick={() => handlePong()}><img className="nav-pong" src={pong}/></Nav.Link>
        <Nav.Link onClick={() => handleHangman()}><img className="nav-hangman" src={hangman}/></Nav.Link>
        <Nav.Link onClick={() => handleLogout()}><img className="logout-b" src={logout}/></Nav.Link>
    </Navbar>
  );
}

export default Navbarr;