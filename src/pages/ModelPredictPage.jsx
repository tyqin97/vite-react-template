import { useEffect, useState, useRef } from "react";
import "./ModelPredictPage.css";
import { getDBByUser } from "../services/fileImportService";

import Papa from "papaparse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getModelsByUserDB } from "../services/trainingService";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS
import { GetDetails } from "../services/preprocessingService";

export default function ModelPredict() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
    const [selectedDbId, setSelectedDbId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [selectedMode, setSelectedMode] = useState("");
    const [preDetail, setPreDetail] = useState({});

    const [isDbSelected, setIsDbSelected] = useState(false);
    const [isModelSelected, setIsModelSelected] = useState(false);
    const [isModeSelected, setIsModeSelected] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [dbList, setDbList] = useState([]);
    const [modelList, setModelList] = useState([]);

    const fileInputRef = useRef(null);
    const [header, setHeader] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

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
            const response = await getModelsByUserDB(user.id, selectedDbId.split(",")[0]);
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
        setSelectedModelId(event.target.value)
        setIsModelSelected(true)
    }

    async function handleSelectedMode (event) {
        setSelectedMode(event.target.value)
        setIsModeSelected(true)
    }

    async function handleLoadingClick() {
        setIsModelLoaded(true);

        const response = await GetDetails(selectedDbId.split(",")[1])
        setPreDetail(response)

        if (selectedMode == "with") {
            setHeader([...response.xList.$values, ...response.tList.$values]);
        }
        if (selectedMode == "without") {
            setHeader(response.xList.$values);
        }
        
    }

    async function handleUploadClick() {
        fileInputRef.current.click();
    }

    async function handleUploadChange(event) {
        const file = event.target.files[0];
        if (!file) return ;

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (result) => {
                const formattedRowData = result.data.map((row) => {
                    return header.reduce((acc, col, index) => {
                      acc[col] = row[index];
                      return acc;
                    }, {})
                })
                const data = result.data;
                const column = header.map((col) => ({
                    field: col,
                    header: col,
                    flex: 1.0
                }))
                setRowData(formattedRowData)
                setColumnDefs(column)
            }
        })
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
                            <option key={item.id} value={[item.id, item.dbName]}>{item.dbName}</option>
                        ))}
                    </select>
                    <select
                        disabled={!isDbSelected}
                        value={selectedModelId}
                        onChange={handleSelectedModel}
                    >
                        <option value="" disabled>请选择</option>
                        {Array.isArray(modelList) && modelList.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <select
                        disabled={!isDbSelected}
                        value={selectedMode}
                        onChange={handleSelectedMode}
                    >
                        <option value="" disabled>请选择</option>
                        <option key={0} value={"with"}>有目标预测</option>
                        <option key={1} value={"without"}>无目标预测</option>
                    </select>
                    <button
                        style={{backgroundColor:'#0bbe47', width:"120px"}}
                        disabled={isLoading || !isDbSelected || !isModelSelected || !isModeSelected}
                        onClick={handleLoadingClick}
                    >加载</button>
                    {isLoading && <div className="spinner"></div>}
                </div>
                {isModelLoaded && 
                    <div className="rightside">
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleUploadChange}
                        />
                        <button
                            style={{ backgroundColor: '#0bbe47' }}
                            onClick={handleUploadClick}
                        >数据文档上传</button>
                </div>
                }
                
            </div>
            <div className="box01">
                <div className="ag-theme-quartz box04" style={{ height: "63vh", width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={{ sortable: true, filter: false, resizable: false }}
                        enableCellTextSelection={true}
                        pagination
                        paginationPageSize={20}
                        paginationPageSizeSelector={[5,10,20]}
                    />
                </div>
                <div className="box05">
                    <h3>{JSON.stringify(preDetail)}</h3>
                    <h3>{selectedMode}</h3>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}