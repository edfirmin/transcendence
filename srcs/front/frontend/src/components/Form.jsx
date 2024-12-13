import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";

function From({route, method}) {
    const [username, setUsername] = useState("")//"username" = la variable, "setUsename" = la methode pour pouvoir la modifier, "useState" = defini son type en gros
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [ffa, setis2fa] = useState(false)
    const [code2fa, set2fa] = useState("")
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register";

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
                    console.log(res.data.jwt)
                    navigate("/")
                }
            }
            else {
                const res = await axios.post(route, {username, password, code2fa})
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


    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input className="form-imput" type="text" value={username} onChange={(f) => setUsername(f.target.value)} placeholder="Username"></input>
        <input className="form-imput" type="password" value={password} onChange={(f) => setPassword(f.target.value)} placeholder="Password"></input>
        {ffa && (<div>
            <h2>2FA Authentication</h2>
            <input className="form-imput" type="text" value={code2fa} onChange={(f) => set2fa(f.target.value)} placeholder="CODE"></input>
        </div>)}
        {loading && <LoadingIndicator/>}
        <button className="form-button" type="submit">{name}</button>
    </form>

}

export default From