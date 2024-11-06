import axiosInstance from "./axiosInstance";

export const getFileByUser = async (userId) => {
    try {
        const response = await axiosInstance.post("FileImport/GetFileByUser", 
            new URLSearchParams({
            userId: userId
        }));
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const uploadFile = async (file, userId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userID', userId)

        const response = await axiosInstance.post("FileImport/UploadFile", formData)
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const deleteFile = async (fileId, userId) => {
    try {
        const response = await axiosInstance.post("FileImport/DeleteFileById",
            new URLSearchParams({
                fileId: fileId,
                userId: userId
            })
        )
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const checkFile = async (dbName) => {
    try {
        const response = await axiosInstance.post("DBUnit/CheckDBNameExist",
            new URLSearchParams({
                dbName: dbName
            })
        )
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const createDB = async (dbName, fileName, withHeader) => {
    try {
        const response = await axiosInstance.post("DBUnit/ConvertFileToDBSimple",
            new URLSearchParams({
                FileName: fileName,
                TableName: dbName,
                WithHeader: withHeader
            })
        )
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const getDBByUser = async (userId) => {
    try {
        const response = await axiosInstance.post("DBUnit/GetDBByUser",
            new URLSearchParams({
                userId: userId
            })
        )
        return response.data;
    }
    catch (error) {
        throw error.response.data.message;
    }
}

export const dropTable = async (userId, dbId) => {
    try {
        const response = await axiosInstance.post("DBUnit/DropTable",
            new URLSearchParams({
                userId: userId,
                dbId: dbId
            })
        )
    }
    catch (error) {
        throw error.response.data.message;
    }
}