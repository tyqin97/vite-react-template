import { useEffect, useState, useRef } from "react";
import "./ModelPredictPage.css";
import { getDBByUser } from "../services/fileImportService";

import Papa from "papaparse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getModelsByUserDB, predictModel } from "../services/trainingService";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS
import { BsFiletypeCsv } from "react-icons/bs";
import { GetDetails } from "../services/preprocessingService";
import LiveGraph from "../components/LiveGraph";

export default function ModelPredict() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
    const [selectedDbId, setSelectedDbId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [selectedMode, setSelectedMode] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [preDetail, setPreDetail] = useState({});
    const [XT, setXT] = useState();

    const [isDbSelected, setIsDbSelected] = useState(false);
    const [isModelSelected, setIsModelSelected] = useState(false);
    const [isModeSelected, setIsModeSelected] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFileLoaded, setIsFileLoaded] = useState(false);

    const [dbList, setDbList] = useState([]);
    const [modelList, setModelList] = useState([]);

    const [isOpt1, setIsOpt1] = useState(true);

    const fileInputRef = useRef(null);
    const [header, setHeader] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [refresh, setRefresh] = useState(0);

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

    useEffect(() => {
        setRowData([])
        setColumnDefs([])
    }, [refresh])

    useEffect(() => {
        if (XT != null) {
            setIsLoading(prev => !prev)
            const fetchData = async () => {
                try{
                    const response = await predictModel(selectedModelId, XT.X, XT.T)
                    console.log(response)
                }
                catch (error) {
                    toast.error(error.message)
                }
                finally{
                    setIsLoading(prev => !prev)
                }
            }
            fetchData();
        }
    }, [XT])


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

    async function handleToggle () {
        setIsOpt1(prev => !prev)
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
        setIsLoading(prev => !prev)

        const response = await GetDetails(selectedDbId.split(",")[1])
        setPreDetail(response)

        if (selectedMode == "with") {
            setHeader([...response.xList.$values, ...response.tList.$values]);
        }
        if (selectedMode == "without") {
            setHeader(response.xList.$values);
        }
        setTimeout(() => {
            setIsLoading(prev => !prev)
            setIsModelLoaded(true);
            setSelectedFile("");
            setIsFileLoaded(false)
            setRefresh(refresh + 1);
        }, 400)
        
        toast.success("模型加载成功！")
    }

    async function handleUploadClick() {
        fileInputRef.current.click();
    }

    async function handleRemoveUploadClick () {
        setSelectedFile("")
        setIsFileLoaded(false)
        setRefresh(refresh + 1)
    }

    async function handleUploadChange(event) {
        const file = event.target.files[0];
        if (!file) return ;

        setIsFileLoaded(true);
        setSelectedFile(file);
        setRefresh(refresh + 1);

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
                const column = header.map((col) => ({
                    field: col,
                    header: col,
                    flex: 1.0,
                    valueFormatter: (params) => {
                        return parseFloat(params.value).toFixed(10);  // Show 4 decimal places
                    }
                }))
                setRowData(formattedRowData)
                setColumnDefs(column)
            }
        })
        

        event.target.value = null;
    }

    async function handleStartPredictClick () {
        setXT(null);

        try {
            if (selectedMode == "with"){
                splitData();
            }
            if (selectedMode == "without"){
                const nestedArray = rowData.map(row => Object.values(row));
                setXT(prev => ({...prev, X: nestedArray}))
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    function splitData () {
        const Z = rowData;
        const xList = preDetail.xList.$values;
        const tList = preDetail.tList.$values;
        let Xi = [];
        let Ti = [];

        Z.forEach(row => {
            const xRow = xList.map(col => parseFloat(row[col]));
            Xi.push(xRow);
            const tRow = tList.map(col => parseFloat(row[col]));
            Ti.push(tRow);
        })
        setXT((prev) => ({...prev, X:Xi, T:Ti}))
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
                        style={{backgroundColor:'#0bbe47', width:"150px"}}
                        disabled={isLoading || !isDbSelected || !isModelSelected || !isModeSelected}
                        onClick={handleLoadingClick}
                    >加载</button>
                    {isLoading && <div className="spinner"></div>}
                </div>
                {isModelLoaded &&
                    <div className="right-side" style={{ textAlign: "center"}}>
                        <label>显示切换：</label>
                        <div
                            className="toggle-container"
                            onClick={handleToggle}
                            style={{justifyContent: isOpt1 ? "flex-start" : "flex-end"}}
                        >
                            <div
                            className="toggle-button"
                            style={{
                                backgroundColor: isOpt1 ? "#4A90E2" : "#9B59B6",
                                animation: isOpt1 ? "slide-left 0.3s ease" : "slide-right 0.3s ease"
                            }}
                            >
                            {isOpt1 ? "表数据" : "图数据"}
                            </div>
                        </div>
                    </div>
                }
                
                
            </div>
            <div className="box01">
                {isOpt1 ? 
                    <div className="ag-theme-quartz box04" style={{ height: "63vh", width: '100%' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={{ sortable: true, filter: false, resizable: false }}
                            enableCellTextSelection={true}
                            pagination
                            paginationPageSize={20}
                            paginationPageSizeSelector={[5,10,20]}
                            rowSelection='multiple'
                            key={refresh}
                        />
                    </div>
                :
                    <div className="box04" style={{ height: "63vh", width: '100%' }}>
                        <LiveGraph
                            key={refresh}
                            // setResult={setResult}
                            // setChartImg={setChartImg}
                        />
                    </div>
                }
                
                {isModelLoaded && 
                    <div className="box05">
                        <h2>操作面板</h2>
                        <div>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleUploadChange}
                            />
                            <button
                                style={{ 
                                    backgroundColor: '#0bbe47',
                                    margin: "10px 0px",
                                    color: "white",
                                    transition:"background-color 0.3s ease",
                                    width: "40%"
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "black")}
                                onMouseLeave={(e) => (e.target.style.color = "white")}
                                onClick={handleUploadClick}
                            >预测数据上传</button>
                            <button
                                style={{
                                    backgroundColor:"#eb1f29", 
                                    margin: "10px 0px",
                                    marginLeft: "10px",
                                    color: "white",
                                    width: "40%",
                                    transition:"background-color 0.3s ease"
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "black")}
                                onMouseLeave={(e) => (e.target.style.color = "white")}
                                onClick={handleRemoveUploadClick}
                                disabled={!isFileLoaded}
                            >移除上传文档
                            </button>
                        </div>
                        {isFileLoaded ?
                            <div>
                                <div>
                                    <h4>已选文件：</h4>
                                </div>
                                <div className="fileupload">
                                    <h4>{selectedFile.name.split(".")[0]}</h4>
                                    <BsFiletypeCsv style={{padding:"5px"}} size={30}/>
                                </div>
                                <div className="panel">
                                    <button
                                        style={{ 
                                            backgroundColor: '#0bbe47',
                                            width: "70%",
                                            margin: "15px 0px",
                                            color: "white",
                                            transition:"background-color 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => (e.target.style.color = "black")}
                                        onMouseLeave={(e) => (e.target.style.color = "white")}
                                        onClick={handleStartPredictClick}
                                        disabled={isLoading}
                                    >开始预测</button>
                                    <h4>测试结果：</h4>
                                </div>
                            </div>  
                            :
                            <div>
                                <h4>请先选择上传文档！</h4>
                            </div>
                        }
                        
     
                    </div>
                }
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}