import { useState, useEffect } from "react";
import LiveGraphComponent from "../components/LiveGraph";

import { getDBByUser } from "../services/fileImportService";
import { GetDetails } from "../services/preprocessingService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ModelBuildPage.css";
import { startTraining, stopTraining } from "../services/trainingService";
import MatrixVisualizer from "../components/MatrixVisualizer";
import ViewModel from "../components/ViewModelDialog";

export default function ModelBuild() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
    const [selectedDb, setSelectedDb] = useState("");
    const [dbList, setDbList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [preDetail, setPreDetail] = useState();
    const [model, setModel] = useState();

    const [isTraining, setIsTraining] = useState(false);
    const [endTraining, setEndTraining] = useState(false);

    const [viewModel, setViewModel] = useState(false);

    const [result, setResult] = useState({
        "trainingResult": "-", 
        "validationResult": "-",
        "testResult": "-",
        "nodesNumber": "-"
    });

    const [render, setRender] = useState(0);

    useEffect(() => {
        getDBList()
      }, [])

    async function getDBList() {
        try {
            const response = await getDBByUser(user.id);
            setDbList(response.dbUnits.$values);
            return response.dbUnits.$values
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    async function getPDetails() {
        try {
          const preResponse = await GetDetails(selectedDb);
          setPreDetail(preResponse);
          if (preResponse.zscoreParam !== undefined) {
            setPreDetail((prev) => {
              return {
                ...prev,
                zscoreParam: JSON.parse(prev.zscoreParam)
              }
            })
          }
          toast.success("加载成功！")
        }
        catch (error) {
          toast.error(error.message)
        }
    }

    async function handleSelectedDB(event) {
        setSelectedDb(event.target.value)
    }

    async function handleLoadingClick () {
        if (selectedDb == "") {
          toast.error("请选择加载数据库！")
          return;
        }
        setIsLoading(prev => !prev);
    
        try {
          getPDetails();
        }
        catch (error) {
          toast.error(error.message);
        }
        setTimeout(() => {
          setIsLoading(prev => !prev);
          setIsLoaded(true);
        }, 500)
    }

    async function handleResetClick () {
        setRender(render + 1)
        setResult({
            "trainingResult": "-", 
            "validationResult": "-",
            "testResult": "-",
            "nodesNumber": "-"
        })
    }

    async function handleViewModelClick () {
        setViewModel(prev => !prev);
    }

    async function handleStopTrainClick () {
        const response = await stopTraining();

        setIsTraining(prev => !prev);
        setEndTraining(true);

        toast.info("Stopped!")
    }

    async function handleStartTrainClick () {
        handleResetClick();
        setTimeout(() => {
            setIsTraining(prev => !prev);
        }, 500)

        const response = await startTraining(selectedDb);
        setResult((prev) => ({ ...prev, testResult: response.testResult}))

        console.log(JSON.parse(response.model))
        setModel(JSON.parse(response.model))

        setIsTraining(prev => !prev);
        setEndTraining(true);
        toast.info("Removed overfit node!")
    }

    return (
        <div className="model-page">
            <h1>构建网络模型</h1>
            <div className="box0">
                <div className="left-side">
                    <label htmlFor="dbOptions">请选择加载数据库:</label>
                    <select id="dbOptions" value={selectedDb} onChange={handleSelectedDB}>
                        <option value="" disabled>请选择</option>
                        {Array.isArray(dbList) && dbList.map((item) => (
                            <option key={item.id} value={item.dbName}>{item.dbName}</option>
                        ))}
                    </select>
                    <button
                        style={{backgroundColor:'#0bbe47', width:"120px"}}
                        onClick={handleLoadingClick}
                        disabled={isLoading || isTraining}
                    >加载</button>
                    {isLoading && <div className="spinner"></div>}
                    {isLoaded && 
                    <>
                        <button
                            style={{backgroundColor:'#0bbe47', width:"120px"}}
                            onClick={handleStartTrainClick}
                            disabled={isTraining}
                        >开始训练
                        </button>
                        <button
                            style={{width:"120px"}}
                            onClick={handleStopTrainClick}
                        >停止训练</button>
                    </>
                    }
                </div>
                <div className="right-side">
                    {isLoaded && 
                    <>
                        <button
                            style={{backgroundColor:"#007bff", width:"120px"}}
                            onClick={handleResetClick}
                            disabled={isTraining}
                        >重置训练</button>
                        <button
                            style={{backgroundColor:"#0bbe47", width:"120px"}}
                            disabled={isTraining}
                        >储存模型</button>
                    </>
                    }
                </div>
            </div>
            <div className="box01">
                <div className="box02">
                    <LiveGraphComponent
                        key={render}
                        setResult={setResult} 
                    />
                </div>
                <div className="box03">
                    <h3>模型节点数</h3>
                    <h4>{result.nodesNumber}</h4>
                    <h3>训练集-均方根误差</h3>
                    <h4>{parseFloat(result.trainingResult || 0).toFixed(5)}</h4>
                    <h3>验证集-均方根误差</h3>
                    <h4>{parseFloat(result.validationResult || 0).toFixed(5)}</h4>
                    <h3>测试集-均方根误差</h3>
                    <h4>{parseFloat(result.testResult || 0).toFixed(5)}</h4>
                    {endTraining &&
                        <button
                            onClick={handleViewModelClick}
                        >查看模型</button>
                    }
                </div>
            </div>
            {viewModel &&
                <ViewModel
                    setViewModal={setViewModel}
                    model={model}
                />
            }
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}