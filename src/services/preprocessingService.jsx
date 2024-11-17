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

export const AddNewDataByDBName = async (tableName, columnName, listData) => {
    try {
        const data = {
            dbName : tableName,
            colName : columnName,
            data : [listData]
        }
        const response = await axiosInstance.post("Data/addData", data, {
            headers: {"Content-Type": 'application/json'}}
        )
        return response.data
    }
    catch (error) {
        throw error;
    }
}

export const DeleteDataByRowID = async (tableName, listID) => {
    try {
        const response = await axiosInstance.post(`Preprocessing/dropRow?dbName=${tableName}`, listID)
        return response.data
    }
    catch (error) {
        throw error;
    }
}

export const CreateOnePD = async (tableName) => {
    try {
        const response = await axiosInstance.post("Preprocessing/createOnePD", 
            new URLSearchParams({
                dbName: tableName
            })
        )
        return response.data
    }
    catch (error) {
        throw error;
    }
}

export const GetDetails = async (tableName) => {
    try {
        const response = await axiosInstance.get(`Preprocessing/${tableName}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const CalcZScoreParam = async (tableName) => {
    try {
        const response = await axiosInstance.post("Preprocessing/calcAndstoreZscoreParam",
            new URLSearchParams({
                dbname: tableName
            })
        )
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const Standardize = async (tableId) => {
    try {
        const response = await axiosInstance.post("Preprocessing/replaceWithZscore",
            new URLSearchParams({
                dbUnitId: tableId
            })
        )
    }
    catch (error) {
        throw error;
    }
}

export const DeStandardize = async (tableId) => {
    try {
        const response = await axiosInstance.post("Preprocessing/replaceWithDenormZscore",
            new URLSearchParams({
                dbUnitId: tableId
            })
        )
    }
    catch (error) {
        throw error;
    }
}