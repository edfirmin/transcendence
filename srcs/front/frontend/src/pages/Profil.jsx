import "../styles/Profil.css"
import EditProfil from "../components/EditProfil";
import { useState, useEffect } from "react";
import { getUser } from "../api"
import Navbarr from "../components/Navbar";
import tas from "../assets/tas-de-neige.png"
import { Space } from "antd";
import { useNavigate } from "react-router-dom";

function Profil() {
    const [user, setUser] = useState([])
    const [edit, setEdit] = useState(false)
    
    useEffect(() => {
        inituser()
    }, []);
    
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    const formEdit = () => {
        edit ? setEdit(false) : setEdit(true);
    }

    const navigate = useNavigate()
    const handleButton = () => {
            navigate("/Config2FA")
    }

    return (
        <div>
            <Navbarr></Navbarr>
            {/* <Snowfall snowflakeCount={100} radius={[0.5,2]}/> */}
            {!edit ? 
                <div className="content-profil">
                    <div className="top">
                        <h1>Profile</h1>
                    </div>
                    <img className="tas" src={tas} alt="tas" />
                    <div className="left">
                        <img className="pp" src={user.profil_pic}/>
                        <h1>{user.username}</h1>
                        <h2>FirstName: {user.first_name}</h2>
                        <h2>LastName: {user.last_name}</h2>
                        <h2>E-mail: {user.email}</h2>
                        <button onClick={formEdit} className="lb">Edit your profil</button>
                        <button onClick={handleButton} className="rb">Active 2FA</button>
                    </div>
                    <div className="rigth">
                    <p>l Arrivera dans la prochaie MAJ :)</p>
                    </div>
                </div> :
            <EditProfil></EditProfil>}
        </div>
    );
}

export default Profil