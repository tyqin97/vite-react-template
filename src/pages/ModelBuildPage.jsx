import { useState, useEffect } from "react";
import LiveGraph from "../components/LiveGraph";

import { getDBByUser } from "../services/fileImportService";
import { GetDetails } from "../services/preprocessingService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ModelBuildPage.css";
import { saveModel, startTraining, stopTraining } from "../services/trainingService";
import ViewModel from "../components/ViewModelDialog";
import SaveDialog from "../components/SaveDialog";

export default function ModelBuild() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
    const [selectedDb, setSelectedDb] = useState("");
    const [dbList, setDbList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [preDetail, setPreDetail] = useState();
    const [model, setModel] = useState();
    const [af, setAf] = useState();

    const [isTraining, setIsTraining] = useState(false);
    const [endTraining, setEndTraining] = useState(false);

    const [viewModel, setViewModel] = useState(false);
    const [chartImg, setChartImg] = useState(null);

    const [saveDialog, setSaveDialog] = useState(false);

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
        setEndTraining(false);
        setRender(render + 1)
        setResult({
            "trainingResult": "-", 
            "validationResult": "-",
            "testResult": "-",
            "nodesNumber": "-"
        })
    }

    async function handleSaveGraphClick () {
        console.log(chartImg)
        if (chartImg) {
            const base64Image = chartImg.toBase64Image(); // Generate the image when needed
            const link = document.createElement('a');
            link.href = base64Image;
            link.download = 'chart.png';
            link.click();
        }
    }

    async function handleViewModelClick () {
        setViewModel(prev => !prev);
    }

    async function handleStopTrainClick () {
        const response = await stopTraining();

        setIsTraining(prev => !prev);
        setEndTraining(true);

        toast.info("终止训练!")
    }

    async function handleStartTrainClick () {
        setTimeout(() => {
            handleResetClick();
            setIsTraining(prev => !prev);
        }, 500)

        const response = await startTraining(selectedDb);
        setResult((prev) => ({ ...prev, testResult: response.testResult}))

        console.log(response.af)
        setModel(JSON.parse(response.model))
        setAf(response.af)

        setIsTraining(prev => !prev);
        setEndTraining(true);
        toast.info("成功移除过拟合节点!")
    }

    async function handleSaveModelClick () {
        setSaveDialog(prev => !prev);
        // try {
        //     const response = await saveModel(user.id, selectedDb, name, model.Matrices);

        //     console.log(response);
        //     toast.success("Save successfully!");
        // }
        // catch (error) {
        //     console.log(error);
        //     toast.error(error);
        // }
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
                            disabled={!isTraining}
                        >停止训练</button>
                    </>
                    }
                </div>
                <div className="right-side">
                    {isLoaded && endTraining && 
                    <>
                        <button
                            style={{backgroundColor:"#007bff", width:"120px"}}
                            onClick={handleResetClick}
                            disabled={isTraining}
                        >重置训练</button>
                        <button
                            style={{backgroundColor:"#0bbe47", width:"120px"}}
                            onClick={handleSaveModelClick}
                            disabled={isTraining}
                        >储存模型</button>
                    </>
                    }
                </div>
            </div>
            <div className="box01">
                <div className="box02">
                    <LiveGraph
                        key={render}
                        setResult={setResult}
                        setChartImg={setChartImg}
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
                        <>
                            <button
                                onClick={handleViewModelClick}
                            >查看模型</button>
                            <button
                                onClick={handleSaveGraphClick}
                            >下载图像</button>
                        </>     
                    }
                </div>
            </div>
            {viewModel &&
                <ViewModel
                    setViewModal={setViewModel}
                    model={model}
                />
            }
            {saveDialog &&
                <SaveDialog
                    setSaveDialog={setSaveDialog}
                    user={user}
                    selectedDb={selectedDb}
                    model={model}
                    af={af}
                />
            }
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}