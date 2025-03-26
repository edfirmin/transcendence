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


function App() {
  const [user, setUser] = useState(null);
  const [isInAGame, setIsInAGame] = useState(false);
  var global_id = useMemo(() => { return uuidv4()}, [global_id]);
  const host = import.meta.env.VITE_HOST;
  var ws = useMemo(() => {return new WebSocket(`wss://${host}:9443/ws/global`)}, [ws]);
  
  useEffect(() => {
    ws.onopen = function(event) {
      ws.send(JSON.stringify({
        'id':global_id,
        'message':'on_connect'
        }))
    }
    
    ws.onmessage = function(event) {
      let data = JSON.parse(event.data);

      if (data.type == "ping_tourney") {
        console.log("ping")
        if (data.left_opponent == user.username || data.right_opponent == user.username)
          window.confirm(`Tu es attendu pour un match de tournoi organisé par ${data.host} !`);
      }
    }
  });

	return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
          <Route path="/" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <RedirectHome/> </ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Home setUser={setUser}/> </ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Profil/> </ProtectedRoute>}/>
          <Route path="/pong" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Pong /> </ProtectedRoute>}/>
          <Route path="/hangman" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Hangman/> </ProtectedRoute>}/>
          <Route path="/Config2FA" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Config2FA/> </ProtectedRoute>}/>
          <Route path="/check42user" element={<CheckUser/>}></Route>
          <Route path="/pong/:roomid" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Pong/> </ProtectedRoute>}/>
          <Route path="setIsInAGame/multipong/:roomid" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <PongMulti/> </ProtectedRoute>}/>
          <Route path="/selection" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <PongSelection/> </ProtectedRoute>}/>
          <Route path="/oui" element={<ProtectedRoute> <Oui/> </ProtectedRoute>}></Route>
          <Route path="/tourney" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <Tourney/> </ProtectedRoute>}></Route>
          <Route path="/tourney/tourneyPresentation" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <TourneyPresentation ws={ws}/> </ProtectedRoute>}></Route>
          <Route path="/friends" element={<ProtectedRoute> <ChatWrapper isInAGame={isInAGame}/> <FriendList /> </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
	)
}

export default App
