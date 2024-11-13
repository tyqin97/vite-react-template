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