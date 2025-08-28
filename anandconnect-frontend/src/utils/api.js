import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // your backend API base URL
});

export default api;
