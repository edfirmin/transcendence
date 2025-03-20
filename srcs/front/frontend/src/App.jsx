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
import RounoHome from "./pages/RounoHome"
import Config2FA from "./components/Config2FA"
import Tourney from "./pages/PongTourney"
import TourneyPresentation from "./pages/PongTourneyPresentation"
import ChatWrapper from "./components/ChatWrapper"
import FriendList from './components/FriendList';
import React, {useMemo} from 'react';



function App() {
  // var ws = useMemo(() => {return new WebSocket("ws://c4r1p1:9443/ws/global")}, [ws]);
	return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
          <Route path="/" element={<ProtectedRoute> <ChatWrapper /> <RedirectHome/> </ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute> <ChatWrapper /> <Home/> </ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute> <ChatWrapper /> <Profil/> </ProtectedRoute>}/>
          <Route path="/pong" element={<ProtectedRoute> <ChatWrapper /> <Pong/> </ProtectedRoute>}/>
          <Route path="/hangman" element={<ProtectedRoute> <ChatWrapper /> <Hangman/> </ProtectedRoute>}/>
          <Route path="/Config2FA" element={<ProtectedRoute> <ChatWrapper /> <Config2FA/> </ProtectedRoute>}/>
          <Route path="/check42user" element={<CheckUser/>}></Route>
          <Route path="/pong/:roomid" element={<ProtectedRoute> <ChatWrapper /> <Pong/> </ProtectedRoute>}/>
          <Route path="/multipong/:roomid" element={<ProtectedRoute> <ChatWrapper /> <PongMulti/> </ProtectedRoute>}/>
          <Route path="/selection" element={<ProtectedRoute> <ChatWrapper /> <PongSelection/> </ProtectedRoute>}/>
          <Route path="/rounohome" element={<ProtectedRoute> <ChatWrapper /> <RounoHome/> </ProtectedRoute>}></Route>
          <Route path="/tourney" element={<ProtectedRoute> <ChatWrapper /> <Tourney/> </ProtectedRoute>}></Route>
          <Route path="/tourney/tourneyPresentation" element={<ProtectedRoute> <ChatWrapper /> <TourneyPresentation/> </ProtectedRoute>}></Route>
          <Route path="/friends" element={<ProtectedRoute> <ChatWrapper /> <FriendList /> </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
	)
}

export default App
