import axios from "axios";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import "../styles/EditProfil.css"
import { getUser } from "../api"

function EditProfil () {
    const [newpp, setNewpp] = useState("")
    const [newmail, setNewmail] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [user, setUser] = useState([])
    const userToken = localStorage.getItem(ACCESS_TOKEN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        await axios.post("api/user/edit/", {fname ,lname, newpp, userToken, newmail})
        location.reload();
        // }
        // catch (error) {
        //     alert(error)
        // }
    }

    useEffect(() => {
        inituser()
    }, []);
    
    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    return(
        <div className="content-profil">
            <form onSubmit={handleSubmit} className="edit-form">
                <input type="text" value={fname} onChange={(f) => setFname(f.target.value)} placeholder="New Firstname"></input>
                <input type="text" value={lname} onChange={(f) => setLname(f.target.value)} placeholder="New Lastname"></input>
                <input type="text" value={newpp} onChange={(f) => setNewpp(f.target.value)} placeholder="New Profil Pictrue (URL)"></input>
                <input type="email" value={newmail} onChange={(f) => setNewmail(f.target.value)} placeholder="New E-mail"></input>
                <button type="submit">EDIT</button>
            </form>
        </div>
    )
}

export default EditProfil