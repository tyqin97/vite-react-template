import axiosInstance from "./axiosInstance.jsx";

export const getUserProfile = async (userId) => {
    try {
        const response = await axiosInstance.get(`User/${userId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const loginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post("User/Login", new URLSearchParams({
            email: email,
            password: password}));
        return response.data;
    }
    catch (error) {
        throw error;
    }
}