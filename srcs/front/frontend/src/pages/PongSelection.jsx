import React, {useEffect, useState} from 'react'
import "../styles/PongSelection.css"
import {useNavigate, useLocation} from "react-router-dom"
import {v4 as uuidv4} from 'uuid';
import classic_design from '../assets/img/classic_design.png'
import tennis_design from '../assets/img/tennis_design.png'
import cool_design from '../assets/img/cool_design.png'
import sick_design from '../assets/img/sick_design.png'
import swag_design from '../assets/img/swag_design.png'
import classic_map_design from '../assets/img/classic_map_design.png'
import portal_map_design from '../assets/img/tennis_map_design.png'
import table_tennis_map_design from '../assets/img/table_tennis_map_design.png'
import fog_map_design from '../assets/img/fog_map_design.png'
import design_2 from '../assets/img/2.png'; import design_3 from '../assets/img/3.png'; import design_4 from '../assets/img/4.png';
import design_5 from '../assets/img/5.png'; import design_6 from '../assets/img/6.png'; import design_7 from '../assets/img/7.png';
import design_8 from '../assets/img/8.png'; import design_9 from '../assets/img/9.png'; 
import easy_design from '../assets/img/easy.png';
import medium_design from '../assets/img/medium.png';
import hard_design from '../assets/img/hard.png';
import no_design from '../assets/img/no.png';
import yes_design from '../assets/img/yes.png';
import Navbarr from '../components/Navbar';
import { getUser, getUserWithUsername } from "../api"
import { ACCESS_TOKEN } from "../constants";
import axios from 'axios';

function PongSelection() {
    const [user, setUser] = useState([])
    const paddle_designs = [classic_design, tennis_design, cool_design, sick_design, swag_design];
    const difficulty_designs = [easy_design, medium_design, hard_design];
    const map_designs = [classic_map_design, table_tennis_map_design, fog_map_design, portal_map_design];
    const point_design = [design_2, design_3, design_4, design_5, design_6, design_7, design_8, design_9];
    const power_up_design = [no_design, yes_design];
    const [index_design, set_index_design] = useState(0);
    const [index_map_design, set_index_map_design] = useState(0);
    const [points, set_points] = useState(0);
    const [difficulty_index, set_difficulty_index] = useState(0);
    const [power_up_index, set_power_up_index] = useState(0);
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const navigate = useNavigate();

    useEffect(() => {
      inituser();
    }, [])

    const inituser = async () => {
      const TMPuser = await getUser();
      setUser(TMPuser);
      set_index_map_design(TMPuser.default_map_index);
      set_index_design(TMPuser.default_paddle_index);
      set_points(TMPuser.default_points_index);
    }

    function handleLocalPong() {
      const roomId = uuidv4();
      navigate(`/pong/${roomId}`, {state : { isAI : false, map : index_map_design, design : index_design, points : points}});
    }

    function handleAIPong() {
      const roomId = uuidv4();
      if (difficulty_index == 0)
        navigate(`/pong/${roomId}`, {state : { isAI : true, difficulty : "easy", map : index_map_design, design : index_design, points : points}});
      if (difficulty_index == 1)
        navigate(`/pong/${roomId}`, {state : { isAI : true, difficulty : "medium", map : index_map_design, design : index_design, points : points}});
      if (difficulty_index == 2)
        navigate(`/pong/${roomId}`, {state : { isAI : true, difficulty : "hard", map : index_map_design, design : index_design, points : points}});
    }

    function handleRemotePong() {
      const roomId = uuidv4();
      navigate(`/multipong/${roomId}`,  {state : {map : index_map_design, design : index_design, points : points}});
    }

    async function handleTestRemotePong() {
      const roomId = uuidv4();
      const left_user = await getUser();
      const right_user = await getUserWithUsername("w");

      navigate(`/multipong/${roomId}`,  {state : {map : index_map_design, design : index_design, points : points, left_user: left_user, right_user: right_user}});
    }

    function handleTourneyPong() {
      navigate(`/tourney/`,  {state : {map : index_map_design, design : index_design, points : points}});
    }

    return (
        <>
            <Navbarr></Navbarr>
            <div className='select-div'>
              <div className='space'></div>
              <div className='container'>
                <div></div>
                <Selector name={"Map"} designs={map_designs} index={index_map_design} setIndex={set_index_map_design} userToken={userToken}/>
                <Selector name={"Points"} designs={point_design} index={points} setIndex={set_points} userToken={userToken} />
                <Selector name={"Difficulté IA"} designs={difficulty_designs} index={difficulty_index} setIndex={set_difficulty_index} />
                <Selector name={'Design'} designs={paddle_designs} index={index_design} setIndex={set_index_design} userToken={userToken} />
                <div></div>
              </div>
              <div className='container'>
                <div className='space'></div>
              </div>
              <div className='container'>
                <div></div>
                <Button name={'Local'} callback={handleLocalPong} icon={'🏓'} />
                <Button name={'IA'} callback={handleAIPong} icon={'🤖'}/>
                <Button name={'En ligne'} callback={handleRemotePong} icon={'🌐'}/>
                <Button name={'Tournoi'} callback={handleTourneyPong} icon={'🏆'}/>
                <div></div>
              </div>
            </div>
           {/* <button className='button' onClick={() => setDifficulty("easy")}>Easy</button>
            <button className='button' onClick={() => setDifficulty("medium")}>Medium</button>
            <button className='button' onClick={() => setDifficulty("hard")}>Hard</button>*/}
        </>
    );
}

function Button({name, callback, icon}) {
	return (
		  <button className='select-button' onClick={() => callback()}>
        <div className="theme-icon">{icon}</div>
        <span>{name}</span></button>
	)
}

function Selector({name, designs, index, setIndex, userToken = null}) {
  const [imgDesign, setImgDesign] = useState(designs[0]);
  
  useEffect(() => {setImgDesign(designs[index])}, [index])

  async function postSetDefaultMapIndex() {
    await axios.post('api/user/setDefaultMapIndex/', {userToken, default_map_index: index});
  }

  async function postSetDefaultPointsIndex() {
    await axios.post('api/user/setDefaultPointsIndex/', {userToken, default_points_index: index})
  }

  async function postSetDefaultPaddleIndex() {
    await axios.post('api/user/setDefaultPaddleIndex/', {userToken, default_paddle_index: index})
  }

  function handleOnClickLeftArrow()
  {
    setIndex(index + 1);
    index++;
    if (index >= designs.length) {
      setIndex(0);
      index = 0;
    }

    if (name == "Map")
      postSetDefaultMapIndex();
    if (name == "Points")
      postSetDefaultPointsIndex();
    if (name == "Design")
      postSetDefaultPaddleIndex();
  }

  function handleOnClickRightArrow()
  {
    setIndex(index - 1);
    index--;
    if (index < 0) {
      setIndex(designs.length - 1);
      index = designs.length - 1;
    }

    if (name == "Map")
      postSetDefaultMapIndex();
    if (name == "Points")
      postSetDefaultPointsIndex();
    if (name == "Design")
      postSetDefaultPaddleIndex();
  }

	return (
    <div className='selector'>
      <p>{name}</p>
      <div>
        <button className='arrowButton' onClick={handleOnClickRightArrow} id='leftArrow'>&lt;</button>
        <img src={imgDesign}/>
        <button className='arrowButton' onClick={handleOnClickLeftArrow} id='rightArrow'>&gt;</button>
      </div>
    </div>
  )
}

export default PongSelection;
