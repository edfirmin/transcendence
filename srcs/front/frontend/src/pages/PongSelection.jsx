import React, {useEffect, useState} from 'react'
import "../styles/PongSelection.css"
import {useNavigate, useLocation} from "react-router-dom"


function PongSelection() {

    const navigate = useNavigate();

    function handleLocalPong() {
        navigate('/pong', {state : { isAI : false }});
    }

    function handleAIPong() {
        navigate('/pong', {state : { isAI : true }});
    }

    return (
        <>
            <Button name={'Local'} callback={handleLocalPong} />
            <Button name={'AI'} callback={handleAIPong} />
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
