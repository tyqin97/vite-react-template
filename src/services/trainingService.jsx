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

export const saveModel = async (userId, dbName, name, af, matrix) => {
    try {
        const response = await axiosInstance.post(`AITraining/SaveModel?userId=${userId}&dbName=${dbName}&modelName=${name}&af=${af}`,
            matrix, 
            {
                headers: {"Content-Type": 'application/json'}
            }
        )
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getModelsByUserDB = async (userId, dbId) => {
    try {
        const response = await axiosInstance.post(`AITraining/getAllModelByUserDB?userId=${userId}&dbId=${dbId}`)
        return response.data;
    }
    catch (error) {
        throw error;
    }
}