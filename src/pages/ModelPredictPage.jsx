import { useEffect, useState } from "react";
import "./ModelPredictPage.css";
import { getDBByUser } from "../services/fileImportService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getModelsByUserDB } from "../services/trainingService";

export default function ModelPredict() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
    const [selectedDbId, setSelectedDbId] = useState("");
    const [selectedModel, setSelectedModel] = useState("");

    const [isDbSelected, setIsDbSelected] = useState(false);
    const [isModelSelected, setIsModelSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [dbList, setDbList] = useState([]);
    const [modelList, setModelList] = useState([]);

    useEffect(() => {
        getDBList();
    }, [])

    useEffect(() => {
        if (selectedDbId != "") {
            setIsLoading(prev => !prev)
            getModelList()
            setTimeout(() => {setIsLoading(prev => !prev)}, 400)
        }
    }, [selectedDbId])

    async function getDBList() {
        try {
            const response = await getDBByUser(user.id);
            setDbList(response.dbUnits.$values);
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    async function getModelList() {
        try {
            const response = await getModelsByUserDB(user.id, selectedDbId);
            setModelList(response.$values);
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    async function handleSelectedDB (event) {
        setSelectedDbId(event.target.value)
        setIsDbSelected(true)
    }

    async function handleSelectedModel (event) {
        setSelectedModel(event.target.value)
        setIsModelSelected(true)
    }

    async function handleLoadingClick() {
        console.log()
    }
    
    return (
        <div className="model-page">
            <h1>模型预测</h1>
            <div className="box0">
                <div className="leftside">
                    <label>请选择数据库与模型：</label>
                    <select value={selectedDbId} onChange={handleSelectedDB}>
                        <option value="" disabled>请选择</option>
                        {Array.isArray(dbList) && dbList.map((item) => (
                            <option key={item.id} value={item.id}>{item.dbName}</option>
                        ))}
                    </select>
                    <select
                        disabled={!isDbSelected}
                        value={selectedModel}
                        onChange={handleSelectedModel}
                    >
                        <option value="" disabled>请选择</option>
                        {Array.isArray(modelList) && modelList.map((item) => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                    <button
                        style={{backgroundColor:'#0bbe47', width:"120px"}}
                        disabled={isLoading || !isDbSelected || !isModelSelected}
                        onClick={handleLoadingClick}
                    >加载</button>
                    {isLoading && <div className="spinner"></div>}
                </div>
                <div className="rightside">
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}