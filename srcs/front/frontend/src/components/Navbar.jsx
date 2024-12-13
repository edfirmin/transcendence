import React, {Component} from "react";
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/Navbar.css';
import logo from "../assets/logo.png"
import 'bootstrap/dist/css/bootstrap.css';

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
        <Navbar.Brand href="/home"><img className="logo" src={logo}/></Navbar.Brand>
          <Nav>
            <Nav.Link href="/profil"><img className="pp_nav" src={user_pp}/></Nav.Link>
            <NavDropdown title="Language">
              <NavDropdown.Item href="">FR</NavDropdown.Item>
              <NavDropdown.Item href="">EN</NavDropdown.Item>
              <NavDropdown.Item href="">JP</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="">Change default language</NavDropdown.Item>
            </NavDropdown>
          </Nav>
    </Navbar>
  );
}

export default Navbarr;