import React, {useEffect, useRef, useState} from 'react'
import "../styles/PongSelection.css"
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { useNavigate, useLocation } from "react-router-dom"
import { getUser, getAllUserExceptLoggedOne } from "../api"
import design_2 from '../assets/img/2.png'; import design_3 from '../assets/img/3.png'; import design_4 from '../assets/img/4.png';
import design_5 from '../assets/img/5.png'; import design_6 from '../assets/img/6.png'; import design_7 from '../assets/img/7.png';
import design_8 from '../assets/img/8.png';
import icone_1 from '../assets/img/dravaono.jpg'; import icone_2 from '../assets/img/edfirmin.jpg'; import icone_3 from '../assets/img/fpalumbo.jpg';
import icone_4 from '../assets/img/jfazi.jpg'; import icone_5 from '../assets/img/ndesprez.jpg'; import icone_6 from '../assets/img/tpenalba.jpg';
import icone_7 from '../assets/img/hdupire.jpg'; import icone_8 from '../assets/img/ychirouz.jpg';
import { ACCESS_TOKEN } from "../constants";
import Navbarr from '../components/Navbar';

function Tourney() {
    const navigate = useNavigate();
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const point_design = [design_2, design_3, design_4, design_5, design_6, design_7, design_8];
    const [nbPlayers, setNbPlayers] = useState(0);
    const [user, setUser] = useState()
    const [user_icone, set_user_icone] = useState()
    const [tourneyPost, SetTourneyPost] = useState(false);
    var tourney_id = useRef(null)
    
    const [names, setNames] = useState(["Player1", "Player2", "Player3", "Player4", "Player5", "Player6", "Player7", "Player8"]);
    const [isUsers, setIsUsers] = useState([true, false, false, false, false, false, false, false])
    const profiles_pics = [icone_1, icone_2, icone_3, icone_4, icone_5, icone_6, icone_7, icone_8]
    const [allNameUnique,setAllNameUnique] = useState(true) 
    
    const data = useLocation();
    const isAI = data.state == null ? false : data.state.isAI;
    const difficulty = data.state == null ? "easy" : data.state.difficulty;
    const map_index = data.state.map;
    const design_index = data.state.design;
    const p = data.state.points;

    const [users, setUsers] = useState([])

    useEffect(() => {
      inituser()
      initusers()
    }, []);

    useEffect(() => {
      if (user) {
        setName(user.username, 0);
        set_user_icone(user.profil_pic);
      }
    }, [user]);

    function setName(newName, index) {
      const newNames = [...names];
      newNames[index] = newName;
      setNames(newNames);
    }

    function setIsUser(bool, index) {
      const newU = [...isUsers];
      newU[index] = bool;
      setIsUsers(newU);
    }

    const inituser = async () => {
        const TMPuser = await getUser()
        setUser(TMPuser);
    }

    const initusers = async () => {
      const TMPuser = await getAllUserExceptLoggedOne()
      setUsers(TMPuser);
    }

    async function handleLocalPong() {
      tourney_id.current = uuidv4();

      if (areAllNameUnique()) {
        setAllNameUnique(true);

        await axios.post('api/user/addTourneyStats/', {userToken, tourney_id : tourney_id.current})

        console.log("name 1 " + names[1])
        console.log("name 2 " + names[2])

        switch (nbPlayers) {
          case 0:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            break;
          case 1:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            break;

          case 2:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[3], isUser: isUsers[3]})
            break;

          case 3:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[3], isUser: isUsers[3]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[4], isUser: isUsers[4]})
            break;

          case 4:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[3], isUser: isUsers[3]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[4], isUser: isUsers[4]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[5], isUser: isUsers[5]})
            break;

          case 5:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[3], isUser: isUsers[3]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[4], isUser: isUsers[4]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[5], isUser: isUsers[5]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[6], isUser: isUsers[6]})
            break;

          case 6:
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: user.username, isUser: true})    
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[1], isUser: isUsers[1]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[2], isUser: isUsers[2]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[3], isUser: isUsers[3]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[4], isUser: isUsers[4]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[5], isUser: isUsers[5]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[6], isUser: isUsers[6]})
            await axios.post('api/user/addTourneyPlayer/', {tourney_id: tourney_id.current, name: names[7], isUser: isUsers[7]})          
            break;

        }

        navigate(`/tourney/tourneyPresentation/`, {state : { isAI : isAI, map : map_index, design : design_index, points : p, players : nbPlayers, tourney_id : tourney_id.current}});
      }
      else
      setAllNameUnique(false);
    }
    
    function areAllNameUnique() {
      for (let i = 0; i < nbPlayers; i++) {
        for (let j = i+1; j < nbPlayers; j++) {
          if (names[i] == names[j])
            return false;          
        }        
      }
      return true;
    }

    if (!user || users.length == 0) {
      return(<></>);
    }

    return (
        <>
            <Navbarr></Navbarr>
            <div className='container'>
                <div></div>
                <Selector name={"Nombre de joueurs"} designs={point_design} index={nbPlayers} setIndex={setNbPlayers} />
                <div></div>
            </div>
            <div className='container'>
              <div></div>
            <div className='grid'>
                <PlayerUser name={user.username} image={user_icone} position={0} points={nbPlayers} />
                <Player name={names[1]} set_name={setName} index={1} set_user={setIsUser} image={profiles_pics[0]} points={nbPlayers} users={users} />
                <Player name={names[2]} set_name={setName} index={2} set_user={setIsUser} image={profiles_pics[1]} points={nbPlayers} users={users} />
                <Player name={names[3]} set_name={setName} index={3} set_user={setIsUser} image={profiles_pics[2]} points={nbPlayers} users={users} />
                <Player name={names[4]} set_name={setName} index={4} set_user={setIsUser} image={profiles_pics[3]} points={nbPlayers} users={users} />
                <Player name={names[5]} set_name={setName} index={5} set_user={setIsUser} image={profiles_pics[4]} points={nbPlayers} users={users} />
                <Player name={names[6]} set_name={setName} index={6} set_user={setIsUser} image={profiles_pics[5]} points={nbPlayers} users={users} />
                <Player name={names[7]} set_name={setName} index={7} set_user={setIsUser} image={profiles_pics[6]} points={nbPlayers} users={users} />
            </div>
              <div></div>
            </div>
            <div className='container'>
              <div></div>
              {allNameUnique ? <></> : <p className='username-register' style={{left: "29%", top: "76%"}} >Not all name are unique</p>}
              <Button name={'Play'} callback={handleLocalPong} />
              <div></div>
            </div>
        </>
    )
}

function Selector({name, designs, index, setIndex}) {
  const [imgDesign, setImgDesign] = useState(designs[0]);
  
  function handleOnClickLeftArrow()
  {
    setIndex(index + 1);
    index++;
    if (index >= designs.length) {
      setIndex(0);
      index = 0;
    }

    setImgDesign(designs[index]);
  }

  function handleOnClickRightArrow()
  {
    setIndex(index - 1);
    index--;
    if (index < 0) {
      setIndex(designs.length - 1);
      index = designs.length - 1;
    }

    setImgDesign(designs[index]);
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

function Player({name, set_name, index, set_user, image, points, users}) {
    const [isShowingUsers, setIsShowingUSers] = useState(false);  
    const userComponents = useRef([]);
    const [visibleName, setVisibleName] = useState(name);
    const [selectedUserIndex, setSelectedUserIndex] = useState(-1);

    function setName(newName) {
      set_name(newName, index);
      setVisibleName(newName);
      console.log(name);
    }

    useEffect(() => {
      if (selectedUserIndex == -1)
        return;

      setName(users[selectedUserIndex].username);
      set_user(true, index);
      setIsShowingUSers(false);
    }
    , [selectedUserIndex])

    useEffect(() => {
      for (let i = 0; i < users.length; i++) {
        userComponents.current.push(<User key={i} _user={users[i]} callback={setSelectedUserIndex} index={i}/>)
      }
    }, [])
    
    function showUsers() {
      setIsShowingUSers(!isShowingUsers);

    }

    if (index - 1 <= points)  
    {
      return (
        <div className='player_container'>
            <div className='player'>
                {selectedUserIndex == -1 ?
                  <>
                  <button onClick={showUsers}>a</button>
                  <img src={image} />
                  <input type="text" required minLength="1" maxLength="10" size="10"  value={visibleName} onChange={e => setName(e.target.value)} />
                  </>
                  :
                  <>
                  <button onClick={() => {setSelectedUserIndex(-1)}}>a</button>
                  <img src={users[selectedUserIndex].profil_pic} />
                  <p>{users[selectedUserIndex].username}</p>
                  </>
                }
            </div>
              {isShowingUsers == true && <div className='scrollUsers'>
                {userComponents.current.map(input=>input)}
            </div>}
        </div>
      )
    }
    else {
      return (<></>)
    }

}

function User({_user, callback, index}) {
  return(
    <button className='userTourney' onClick={() => {callback(index) }}>
      {_user.username}
    </button>
  )
}

function PlayerUser({name, image, position, points}) {
  if (position <= points)  
  {
    return (
          <div className='player'>
              <img src={image} />
              <p>{name}</p>
          </div>
      )
  }
  else {
    return (<></>)
  }
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

export default Tourney;