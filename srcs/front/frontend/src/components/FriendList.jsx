import React, { useState, useEffect, useRef } from 'react';
import { getFriends, addFriend, removeFriend , checkUserExist} from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import '../styles/FriendList.css';

const FriendList = ({ onStartPrivateChat }) => {
    const [friends, setFriends] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const ws = useRef(null);
    const host = import.meta.env.VITE_HOST;

    useEffect(() => {
        loadFriends();
        // Set up periodic refresh
        const intervalId = setInterval(loadFriends, 5000);

        // Set up WebSocket connection
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            const cleanToken = token.replace('Bearer ', '');

            ws.current = new WebSocket(`wss://${host}:9443/ws/online/?token=${cleanToken}`);
            
            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'online_users') {
                    // Refresh friend list when online status changes
                    loadFriends();
                }
            };

            ws.current.onerror = (error) => {
                console.log('WebSocket error:', error);
            };
        }

        return () => {
            clearInterval(intervalId);
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    const loadFriends = async () => {
        try {
            const data = await getFriends();
            setFriends(data);
            setError('');
        } catch (err) {
            setError('Failed to load friends');
            // console.log(err);
        }
    };

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!newFriendUsername.trim()) {
            setError('Please enter a username');
            return;
        }
        const resp = await checkUserExist(newFriendUsername.trim());
        if (resp == false) {
            setError("L'utilisateur n'existe pas !!!");
            return;
        }
        try {
            await addFriend(newFriendUsername.trim());
            setNewFriendUsername('');
            loadFriends();
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to add friend';
            setError(errorMessage);
            // console.log('Error adding friend:', err);
        }
    };

    const handleRemoveFriend = async (username) => {
        try {
            await removeFriend(username);
            loadFriends();
            setError('');
        } catch (err) {
            setError('Failed to remove friend');
        }
    };

    const goToProfile = (username) => {
        navigate(`/profil/`, {state : { username : username }});
    };

    const startChat = (friend) => {
        if (onStartPrivateChat) {
            onStartPrivateChat({
                id: friend.friend_details.id,
                username: friend.friend_details.username,
                profil_pic: friend.friend_details.profil_pic
            });
        }
    };

    return (
        <div className="friend-list-container">
            <h2>Amis</h2>
            <form onSubmit={handleAddFriend} className="add-friend-form">
                <input
                    maxLength={11}
                    type="text"
                    value={newFriendUsername}
                    onChange={(e) => setNewFriendUsername(e.target.value)}
                    placeholder="Entrer un nom d'utilisateur"
                    className="friend-input"
                />
                <button type="submit" className="add-friend-btn">Ajouter un ami</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="friends-grid">
                {friends.map((friendship) => (
                    <div key={friendship.id} className="friend-card">
                        <img 
                            src={friendship.friend_details.profil_pic} 
                            alt={friendship.friend_details.username}
                            className="friend-avatar"
                            onClick={() => goToProfile(friendship.friend_details.username)}
                        />
                        <div className="friend-info">
                            <span 
                                className={`status-indicator ${friendship.is_online ? 'online' : 'offline'}`}
                            />
                            <h3 onClick={() => goToProfile(friendship.friend_details.username)} 
                                className="friend-username">
                                {friendship.friend_details.username}
                            </h3>
                            <div className="friend-actions">
                                <button 
                                    onClick={() => handleRemoveFriend(friendship.friend_details.username)}
                                    className="remove-friend-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;