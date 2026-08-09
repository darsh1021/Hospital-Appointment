import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,   // required — sends the JWT cookie on every request
    headers: {
        "Content-Type": "application/json"
    },
})

export default axiosInstance