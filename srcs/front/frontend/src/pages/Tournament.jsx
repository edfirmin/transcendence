import Form from "../components/Form"
import {useNavigate, useParams, useLocation} from "react-router-dom"
import Snowfall from 'react-snowfall'
import logo_42auth from "../assets/42logo.png"
import '../styles/Tournament.css'
import { useEffect, useMemo, useState, useRef } from 'react'
import {v4 as uuidv4} from 'uuid';


function Tournament() {

    const { roomid } = useParams();
	const ws = useMemo(() => {return new WebSocket(`ws://localhost:8000/ws/tournament/${roomid}`)}, []); 
	const id = useMemo(() => {return uuidv4()}, []);

    const data = useLocation();
    const [map_index, set_map_index] = useState(0);
    const [design_index, set_design_index] = useState(0); 
    const [points, set_points] = useState(5);
    const [nb_players, set_nb_players] = useState(4);

    const navigate = useNavigate();


    useEffect(() => {
        
        ws.onopen = function(event) {
            
        }  
    })

    return (
        <div id="root">
        <Snowfall />
            <div id="tourney">
                <p>Tournament</p>
            </div>
        <Snowfall />
        </div>
    );
}

export default Tournament