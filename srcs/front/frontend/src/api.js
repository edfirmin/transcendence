import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode"

axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getUser = async () => {
    const spl = jwtDecode(localStorage.getItem(ACCESS_TOKEN))
    // console.log("L'id du user: " + spl.user_id)
    const response = await axios.get("/api/user/getUser/?" + `${spl.user_id}`)
    return (response.data)
}
