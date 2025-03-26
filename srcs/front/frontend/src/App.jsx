import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Profil from "./pages/Profil"
import Pong from "./pages/Pong/Pong"
import Hangman from "./pages/Hangman"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import RedirectHome from './pages/RedirectHome';
import CheckUser from './pages/CheckUser';
import PongMulti from "./pages/Pong/PongMulti"
import PongSelection from "./pages/PongSelection"
import Oui from "./pages/Oui"
import Config2FA from "./components/Config2FA"
import Tourney from "./pages/PongTourney"
import TourneyPresentation from "./pages/PongTourneyPresentation"
import ChatWrapper from "./components/ChatWrapper"
import FriendList from './components/FriendList';
import React, {useEffect, useMemo, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import { getUser, getAllUserExceptLoggedOne } from "./api"
import "./styles/App.css"

function App() {
  const [user, setUser] = useState(null);
  const [ping_tourney, set_ping_tourney] = useState(false)
  const [isInAGame, setIsInAGame] = useState(false);
  var global_id = useMemo(() => { return uuidv4()}, [global_id]);
  const host = import.meta.env.VITE_HOST;
  var ws = useMemo(() => {return new WebSocket(`wss://${host}:9443/ws/global`)}, [ws]);
  const [host_tourney, set_host_tourney] = useState(null)

  useEffect(() => {
    ws.onopen = function(event) {
      ws.send(JSON.stringify({
        'id':global_id,
        'message':'on_connect'
        }))
    }
    
    ws.onmessage = async function(event) {
      let data = JSON.parse(event.data);

      const TMPuser = await getUser()

      if (data.type == "ping_tourney") {
        if (data.left_opponent == TMPuser.username || data.right_opponent == TMPuser.username) {
          set_host_tourney(data.host);
          set_ping_tourney(true);
        }
      }
    }
  }, []);


	return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
          <Route path="/" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <RedirectHome/> </ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Home setUser={setUser}/> </ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Profil/> </ProtectedRoute>}/>
          <Route path="/hangman" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Hangman/> </ProtectedRoute>}/>
          <Route path="/Config2FA" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Config2FA/> </ProtectedRoute>}/>
          <Route path="/check42user" element={<CheckUser/>}></Route>
          <Route path="/pong/:roomid" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Pong setIsInAGame={setIsInAGame}/> </ProtectedRoute>}/>
          <Route path="/multipong/:roomid" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <PongMulti setIsInAGame={setIsInAGame}/> </ProtectedRoute>}/>
          <Route path="/selection" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <PongSelection/> </ProtectedRoute>}/>
          <Route path="/oui" element={<ProtectedRoute> <Oui/> </ProtectedRoute>}></Route>
          <Route path="/tourney" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Tourney/> </ProtectedRoute>}></Route>
          <Route path="/tourney/tourneyPresentation" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <TourneyPresentation ws={ws}/> </ProtectedRoute>}></Route>
          <Route path="/friends" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <FriendList /> </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
    {ping_tourney && <PopUpTourney host={host_tourney} set_ping_tourney={set_ping_tourney}/>}
    </>
  )
}

export default App

function PopUpTourney({host, set_ping_tourney}) {
  const close = async () => {
    set_ping_tourney(false)
  }
  
  return (
    <div id='ping_tourney'>
      <p>Tu es attendu pour un match de tournoi organisé par {host} !</p>
      <button onClick={close}>Tres bien</button>
    </div>
  )
}