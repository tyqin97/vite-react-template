import axiosInstance from "./axiosInstance.jsx";

export const getTableByDBName = async (tableName) => {
    try {
        const response = await axiosInstance.post("Data/getTableData", 
            new URLSearchParams({
                tableName: tableName
            })
        )
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const GetTableColumnByDBName = async (tableName) => {
    try {
        const response = await axiosInstance.post("Data/getTableColumnByName",
            new URLSearchParams({
                tableName: tableName
            })
        )
        return response.data;
    }
    catch (error) {
        throw error;
    }
}