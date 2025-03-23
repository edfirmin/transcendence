import Snowfall from 'react-snowfall'
import "../styles/Oui.css"
import axios from "axios";
import { useState, useEffect } from "react";
import poti from "../assets/potiBlagueur.jpg"
import {useNavigate} from "react-router-dom"
import { ACCESS_TOKEN } from "../constants";
import hacker from "../assets/hacker.jpg"

function RounoHome () {
    const [newmail, setNewmail] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const navigate = useNavigate();

    const handleHacker = async () => {
        if (userToken != "") {
            console.log(userToken)
            // e.preventDefault();
            const newpp = "https://i.redd.it/jbcj0uqbihg41.jpg"
            console.log(newpp)
            // try {
            await axios.post("api/user/edit/", {fname ,lname, newpp, userToken, newmail})
        }
        navigate("/profil")
      }

    return (
        <section>
            <Snowfall snowflakeCount={30} radius={[0.5,1.5]}/>
            <img src={poti} className='poti'/>
            <button className='poti-nez'  onClick={() => handleHacker()}></button>
        </section>
    )
}

export default RounoHome