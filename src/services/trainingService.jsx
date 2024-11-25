import axiosInstance from "./axiosInstance.jsx";

export const startTraining = async (dbName) => {
    try {
        const response = await axiosInstance.post(`AITraining/startTraining?dbName=${dbName}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const stopTraining = async () => {
    try {
        const response = await axiosInstance.get("AITraining");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}