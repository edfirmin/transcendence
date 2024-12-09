import React, {useEffect, useState} from 'react'
import "../styles/PongSelection.css"
import {useNavigate, useLocation} from "react-router-dom"
import {v4 as uuidv4} from 'uuid';
import classic_design from '../assets/img/classic_design.png'
import tennis_design from '../assets/img/tennis_design.png'
import classic_map_design from '../assets/img/classic_map_design.png'
import tennis_map_design from '../assets/img/tennis_map_design.png'


function PongSelection() {

    const [difficulty, setDifficulty] = useState("medium");
    const paddle_designs = [classic_design, tennis_design];
    const map_designs = [classic_map_design, tennis_map_design];

    const navigate = useNavigate();

    function handleLocalPong() {
        navigate('/pong', {state : { isAI : false, map : classic_map_design, design : tennis_design}});
    }

    function handleAIPong() {
        navigate('/pong', {state : { isAI : true, difficult : difficulty, map : classic_map_design, design : classic_design}});
    }

    function handleRemotePong() {
      const roomId = uuidv4();
      navigate(`/multipong/${roomId}`);
    }

    function handlePoints() {
      
    }

    return (
        <>
            <div className='container'>
              <div></div>
              <Selector name={"Map"} designs={map_designs} />
              <Selector name={'Design'} designs={paddle_designs}/>
              {/*<Selector name={'PowerUp'} img_src={"../assets/img/classic_design.png"} />*/}
              <div></div>
            </div>
            <div id="points">
              <input type="range" min="1" max="100" value="50" class="slider" id="myRange" onInput={handlePoints}/>
            </div>
            <div className='container'>
              <div></div>
              <Button name={'Local'} callback={handleLocalPong} />
              <Button name={'AI'} callback={handleAIPong} />
              <Button name={'Remote'} callback={handleRemotePong} />
              <div></div>
            </div>
           {/* <button className='button' onClick={() => setDifficulty("easy")}>Easy</button>
            <button className='button' onClick={() => setDifficulty("medium")}>Medium</button>
            <button className='button' onClick={() => setDifficulty("hard")}>Hard</button>*/}
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

function Selector({name, designs}) {
  let index = 0;
  const [imgDesign, setImgDesign] = useState(designs[0]);
  
  function handleOnClick()
  {
    index++;
    if (index >= designs.length)
      index = 0;

    setImgDesign(designs[index]);
  }

	return (
    <div className='selector'>
      <p>{name}</p>
      <div>
        <button className='arrowButton' onClick={handleOnClick} id='leftArrow'>&lt;</button>
        <img src={imgDesign}/>
        <button className='arrowButton' onClick={handleOnClick} id='rightArrow'>&gt;</button>
      </div>
    </div>
  )
}

export default PongSelection;
