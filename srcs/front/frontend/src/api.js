import axios from "axios"
import { ACCESS_TOKEN } from "./constants";
axios.defaults.baseURL = import.meta.env.VITE_API_URL


export const getUser = async () => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const response = await axios.get("/api/user/getUser/?" + userToken);
    return (response.data)
}

export const getUserWithUsername = async (username) => {
    const response = await axios.get("/api/user/getUserWithUsername/?" + username);
    return (response.data)
}

export const getUserWithId = async (id) => {
    const response = await axios.get("/api/user/getUserWithId/?" + id);
    return (response.data)
}

export const getAllUserExceptLoggedOne = async () => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const response = await axios.get("/api/user/getAllUserExceptLoggedOne/?" + userToken);
    return (response.data)
}

export const getMatches = async () => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const response = await axios.get("/api/user/getMatches/?" + userToken);
    return (response.data)
}

export const getMatchesWithUsername = async (username) => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const response = await axios.get("/api/user/getMatchesWithUsername/?" + username);
    return (response.data)
}

export const getHangmanGames = async () => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const response = await axios.get("/api/user/getHangmanGames/?" + userToken);
    return (response.data)
}

export const getTourney = async (tourney_id) => {
    const response = await axios.get("/api/user/getTourney/?" + tourney_id);
    return (response.data)
}

export const getTourneyPlayers = async (tourney_id) => {
    const response = await axios.get("/api/user/getTourneyPlayers/?" + tourney_id);
    return (response.data)
}

export const getQR = async () => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    const oui = await axios.get("/api/user/qrcode/?" + userToken);
    return (oui.data)
}

export const getFriends = async () => {
    try {
        const userToken = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios.get(`/api/user/friends/?token=${userToken}`);
        return response.data;
    } catch (error) {
        console.log('Error fetching friends:', error);
        throw error;
    }
}

export const addFriend = async (username) => {
    try {
        const userToken = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios({
            method: 'post',
            url: `/api/user/friends/?token=${userToken}`,
            data: { username },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error adding friend:', error);
        throw error;
    }
}

export const removeFriend = async (username) => {
    try {
        const userToken = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios.delete(`/api/user/friends/${username}/?token=${userToken}`);
        return response.data;
    } catch (error) {
        console.log('Error removing friend:', error);
        throw error;
    }
}

// export const changeUser = async () => {
//     const userToken = localStorage.getItem(ACCESS_TOKEN);
//     await axios.post("api/user/edit/?" + userToken)
// }
