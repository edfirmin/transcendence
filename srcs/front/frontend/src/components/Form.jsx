import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";
import logo42 from "../assets/42logo.png"
import Snowfall from 'react-snowfall'

function From({route, method}) {
    const [username, setUsername] = useState("")//"username" = la variable, "setUsename" = la methode pour pouvoir la modifier, "useState" = defini son type en gros
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [ffa, setis2fa] = useState(false)
    const [code2fa, set2fa] = useState("")
    const navigate = useNavigate()
    const name = method === "login" ? "Login" : "Register";
    var logo = method === "login" ? "src/assets/login.png" : "src/assets/register.png" ;
    const button_text = method === "login" ? "Create an account" : "Already have an account ?";

    const handleSubmit = async (f) => {//pour qu'une fois le bouton "submit" est press, le formulaire reviens a sa config initial, c'est a dire: VIDE// "async" est une "method" de function qui permet de mieux gerer les cas d'erreur, d'ou de "try/catch"
        setLoading(true);
        f.preventDefault();

        try {
            if (method === "login") {
                // setMfa(await axios.get("api/user/check2fa/", {username}))
                const res = await axios.post(route, {username, password, code2fa})
                if (res.data.is2fa) {
                    setis2fa(true)
                }
                else if (res.data.jwt){
                    localStorage.setItem(ACCESS_TOKEN, res.data.jwt)
                    navigate("/")
                }
            }
            else {
                await axios.post(route, {username, password, code2fa})
                navigate("/login")
            }
        }
        catch (error) {
            alert(error)//juste pour montrer l'erreur
        }
        finally {
            setLoading(false)
        }
    }

    const handleGoToRegisterOrLoginButton = () => {
        localStorage.clear();
        if (method == "register")
            navigate("/login")
        else
            navigate("/register")
    }

    const handleLoginWith42 = () => {
        window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-efb8810a6794b0509ab1b30b4baeb56fff909df009eb5c29cde1d675f5309a75&redirect_uri=https%3A%2F%2Flocalhost%3A5173%2Fcheck42user&response_type=code";
    };


    return (
        <div>
            <Snowfall />
            <form onSubmit={handleSubmit} className="form-container">
                <img src={logo} alt="logo"/>
                <input className="form-imput" type="text" value={username} onChange={(f) => setUsername(f.target.value)} placeholder="Username"></input>
                <input className="form-imput" type="password" value={password} onChange={(f) => setPassword(f.target.value)} placeholder="Password"></input>
                {ffa && (<div>
                    <h2>2FA Authentication</h2>
                    <input className="code2fa-input" maxLength={6} type="text" value={code2fa} onChange={(f) => set2fa(f.target.value)} placeholder="CODE"></input>
                </div>)}
                {loading && <LoadingIndicator/>}
                <button className="form-button" type="submit">{name}</button>
            </form>
            <button className="go-to-register-button" onClick={() => handleGoToRegisterOrLoginButton()}>{button_text}</button>
                {!ffa && (<div>
                    <h2>━━━━━━━━ Or continue with ━━━━━━━━</h2>
                    <button className="login-with-42-button" onClick={handleLoginWith42}><img className="logo42" src={logo42} alt="42 Authentication"/></button>
                </div>)}
        </div>
    )

}

export default From