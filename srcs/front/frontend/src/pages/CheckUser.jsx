import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function CheckUser() {
    const navigate = useNavigate();

    const sendCodeToBack = async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const response = await axios.get(`http://localhost:8000/api/auth/login/?${code}`);
        console.log("Code reçu depuis 42:", code);
        console.log("RESPONSE ---> ", response)
        navigate("/home")
    }

    useEffect(() => {
        sendCodeToBack()
    }, []);

    return (
        <div>
           OUI JE SUIS ARRIVE ICI
        </div>
    );
}

export default CheckUser;