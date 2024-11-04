import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5008/',
});

export default axiosInstance;