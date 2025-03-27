import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import React, {useEffect, useState} from 'react'
import ChatBox from "./ChatBox"
import FriendList from './FriendList';
import '../styles/ChatWrapper.css'

function ChatWrapper({isInAGame, areOthersInAGame}) {
    const location = useLocation();
    const hideChat = ['/login', '/register', '/check42user'].includes(location.pathname);
    const [privateChats, setPrivateChats] = useState(new Map());
    
    if (hideChat) return null;
  
    const handleStartPrivateChat = (user) => {
      if (!privateChats.has(user.id)) {
        const newChats = new Map(privateChats);
        newChats.set(user.id, user);
        setPrivateChats(newChats);
      }
    };
  
    const handleClosePrivateChat = (userId) => {
      const newChats = new Map(privateChats);
      newChats.delete(userId);
      setPrivateChats(newChats);
    };
  
    return (
      <div className="chat-wrapper">
        <div className="chat-sidebar">
          <FriendList onStartPrivateChat={handleStartPrivateChat} />
        </div>
      </div>
    );
  }

export default ChatWrapper;