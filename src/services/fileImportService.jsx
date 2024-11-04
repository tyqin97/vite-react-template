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