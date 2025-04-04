import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";
import logo42 from "../assets/42logo.png"
import Snowfall from 'react-snowfall'
import connec from "../assets/login.png"
import cree from "../assets/register.png"

function From({route, method, setUser}) {
    const [username, setUsername] = useState("")//"username" = la variable, "setUsename" = la methode pour pouvoir la modifier, "useState" = defini son type en gros
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [goodpass, setGoodpass] = useState(null)
    const [loading, setLoading] = useState(false)
    const [ffa, setis2fa] = useState(false)
    const [code2fa, set2fa] = useState("")
    const navigate = useNavigate()
    const name = method === "login" ? "Se connecter" : "S'enregistrer";
    var logo = method === "login" ? connec : cree ;
    const button_text = method === "login" ? "Créer un compte" : "Vous avez déjà un compte ?";
    const [goodlogin, setGoodlogin] = useState(null)
    const [goodregister, setGoodregister] = useState(null)

    const handleSubmit = async (f) => {//pour qu'une fois le bouton "submit" est press, le formulaire reviens a sa config initial, c'est a dire: VIDE// "async" est une "method" de function qui permet de mieux gerer les cas d'erreur, d'ou de "try/catch"
        setLoading(true);
        setGoodpass(null);
        setGoodlogin(null);
        setGoodregister(null);
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
                else if (res.data == false)
                    setGoodlogin(false)
            }
            else {
                if (password != password2 | password == "" | password2 == "")
                    setGoodpass(true)
                else {
                    const res = await axios.post(route, {username, password})
                    // console.log(goodregister)
                    if (res.data == false)
                        setGoodregister(false)
                    else if (res.data == true)
                        setGoodregister(true)
                    else
                    {
                        navigate("/login")
                        setGoodpass(false)
                        // setGoodregister(null)
                    }
                }
            }
        }
        catch (error) {
            console.log(error.status)//juste pour montrer l'erreur
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
        window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e9d7e0ce496c8c400728ca5647b5d2345cf50639023aa05cd809988d37719ad3&redirect_uri=https%3A%2F%2Fc3r2p4%3A9443%2Fcheck42user&response_type=code";
    };


    return (
        <div>
            <Snowfall />
            <form onSubmit={handleSubmit} className="form-container">
                <img src={logo} alt="logo"/>
                <input className="form-imput" type="text" maxLength={11} value={username} onChange={(f) => setUsername(f.target.value)} placeholder="Nom d'utilisateur"></input>
                <input className="form-imput" type="password" value={password} onChange={(f) => setPassword(f.target.value)} placeholder="Mot de passe"></input>
                {method === "register" && (
                    <input className="form-imput" type="password" value={password2} onChange={(f) => setPassword2(f.target.value)} placeholder="Confirmer mot de passe"></input>
                    )}
                {ffa && (<div>
                    <h2>2FA Authentication</h2>
                    <input className="code2fa-input-login" maxLength={6} type="text" value={code2fa} onChange={(f) => set2fa(f.target.value)} placeholder="6-DIGIT CODE"></input>
                </div>)}
                {loading && <LoadingIndicator/>}
                <button className="form-button" type="submit">{name}</button>
            </form>
            {goodregister == true && (<p className="username-register">Nom d'utilisateur deja utilisé malheureusement</p>)}
            {goodregister == false && (<p className="username-register">Le nom d'utilisateur ne doit pas contenir "_42"</p>)}
            {goodlogin == false && (<p className="login-false">Identifiant ou mot de passe incorrect</p>)}
            {goodpass == true && (<p className="pass-false">Mot de passe pas identique/Champ vide</p>)}
            <button className="go-to-register-button" onClick={() => handleGoToRegisterOrLoginButton()}>{button_text}</button>
                {!ffa && method === "login" && (<div className="div-login42">
                    <h2>━━━━━━━━ Étudiant 42 ? ━━━━━━━━</h2>
                    <button className="login-with-42-button" onClick={handleLoginWith42}><img className="logo42" src={logo42} alt="42 Authentication"/></button>
                </div>)}
        </div>
    )

}

export default From