import React, {useEffect, useState} from 'react'
import "../styles/PongSelection.css"
import {useNavigate, useLocation} from "react-router-dom"
import {v4 as uuidv4} from 'uuid';

function PongSelection() {

    const [difficulty, setDifficulty] = useState("medium");

    const navigate = useNavigate();

    function handleLocalPong() {
        navigate('/pong', {state : { isAI : false }});
    }

    function handleAIPong() {
        navigate('/pong', {state : { isAI : true, difficult : difficulty}});
    }

    function handleRemotePong() {
      const roomId = uuidv4();
      navigate(`/multipong/${roomId}`);
    }

    return (
        <>
            <button className='button' onClick={() => setDifficulty("easy")}>Easy</button>
            <button className='button' onClick={() => setDifficulty("medium")}>Medium</button>
            <button className='button' onClick={() => setDifficulty("hard")}>Hard</button>
            <Button name={'Local'} callback={handleLocalPong} />
            <Button name={'AI'} callback={handleAIPong} />
            <Button name={'Remote'} callback={handleRemotePong} />
        </>
    );
}

function Button({name, callback}) {
	return (
	  <tr>
		<td>
		  <button className='button' onClick={() => callback()}>{name} </button>
		</td>
	  </tr>
	)
}

export default PongSelection;
