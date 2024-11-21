import { useState, useEffect } from "react";
import { getUser } from "../api"
import "../styles/Navbar.css"
import logo from "../assets/logo.png"

function Navbar () {
    const [user_pp, setUser] = useState([])

    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser.profil_pic);
    }

    useEffect(() => {
        inituser()
    }, []);

    return(
        <nav className="navbar">
            <a href="/"><img className="logo" src={logo} alt="Logo" /></a>
            <ul>
                {/* <li><a href="">Chat</a></li> */}
                <li><select>
                    <option value="0">FR</option>
                    <option value="1">EN</option>
                    <option value="0">JP</option>
                    </select></li>
            </ul>
                <a href="/profil"><img className="pp_nav" src={user_pp} alt="profil" /></a>
         </nav>
    )
}

export default Navbar