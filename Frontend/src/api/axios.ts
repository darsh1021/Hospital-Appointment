import axios from "axios";
// import { setupInterceptors } from './interceptors'

const axiosInstance = axios.create({
    baseURL: "http://localhost:5173",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
})


// setupInterceptors(axiosInstance)

export default axiosInstance