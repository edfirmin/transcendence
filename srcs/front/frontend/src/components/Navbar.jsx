import React, {Component} from "react";
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/Navbar.css';
import Snowfall from 'react-snowfall'
import logo from "../assets/logo.png"

function Navbarr() {
    const [user_pp, setUser] = useState([])

    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser.profil_pic);
    }

    useEffect(() => {
        inituser()
    }, []);
  return (
    <Navbar bg="myBG" variant="dark" className="navi">
      <Snowfall snowflakeCount={30} radius={[0.5,0.5]}/>
        <Navbar.Brand href="/home"><img className="logo" src={logo}/></Navbar.Brand>
          <Nav.Link href="/profil"><img className="pp_nav" src={user_pp}/></Nav.Link>
    </Navbar>
  );
}

export default Navbarr;