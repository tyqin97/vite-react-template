import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./PresetParameter.css";
import { getDBByUser } from "../services/fileImportService";
import { GetDetails, SaveModelParams } from "../services/preprocessingService";


export default function PresetParameter() {
  const defaultParam = {
    "af": "-",
    "maxNodes": 0,
    "maxCandidates": 0,
    "nodePerAdd": 0,
    "minTolerance": 0,
    "lambdas": [null],
    "regularizations": [null]
  }
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [preDetail, setPreDetail] = useState();
  const [afList, setAfList] = useState(["sigmoid", "tanh", "relu", "step"]);
  const [modelParam, setModelParam] = useState(defaultParam);
  const [dbList, setDbList] = useState([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getDBList()
  }, [])

  useEffect(() => {
    localStorage.setItem("pdetail", JSON.stringify(preDetail));
  }, [preDetail])

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
      if (preResponse.modelParams !== undefined) {
        setModelParam(preResponse.modelParams)
      }
      else {
        setModelParam(defaultParam);
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  async function handleSelectedPDetail (event) {
    setSelectedDb(event.target.value)
  }

  async function handleSelectedAF (event) {
    setModelParam((prev) => {
      return {
        ...prev,
        "af": event.target.value
      }
    })
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
      setIsLoaded(true)
    }, 500)
  }

  async function handleEditParamClick () {
    setIsEdit(prev => !prev);
  }

  async function handleCancelParamClick () {
    setIsEdit(prev => !prev)
    getPDetails()
  }

  async function handleSaveParamClick () {
    try {
      console.log(modelParam)
      const response = await SaveModelParams(selectedDb, modelParam)
      toast.success("更新成功!")
    }
    catch (error) {
      toast.error(error.message)
    }
    setIsEdit(prev => !prev)
    getPDetails()
  }

  async function handleInputChange (event) {
    const { name , value } = event.target;
    setModelParam((prev) => {
      return {
        ...prev,
        [name] : value
      }
    })
    if (name == "lambdas" || name == "regularizations") {
      setModelParam((prev) => {
        return {
          ...prev,
          [name] : value.split(",").map(parseFloat)
        }
      })
    }
    if (name == "maxCandidates" || name == "maxNodes" ||
        name == "minTolerance" || name == "nodePerAdd") {
          setModelParam((prev) => {
            return {
              ...prev,
              [name] : Number(value)
            }
          })
        }
  }

  return (
    <div className="param-page">
      <h1>配置网络参数</h1>
      <div className="box0">
        <div className="left-side">
        <label htmlFor="dbOptions">请选择加载数据库:</label>
        <select id="dbOptions" value={selectedDb} onChange={handleSelectedPDetail}>
          <option value="" disabled>请选择</option>
          {Array.isArray(dbList) && dbList.map((item) => (
                    <option key={item.id} value={item.dbName}>
                        {item.dbName}
                    </option>
                ))
          }
        </select>
        <button
          style={{backgroundColor:'#0bbe47', width:"120px"}}
          onClick={handleLoadingClick}
          disabled={isLoading}
        >加载</button>
        {isLoading && <div className="spinner"></div>}
        {!isEdit ? 
          <button
            onClick={handleEditParamClick}
            style={{width:"120px", color: "white", backgroundColor:"#007bff", transition:"background-color 0.3s ease"}}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#035fc1")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          >编辑</button>
          :
          <>
            <button
              onClick={handleSaveParamClick}
              style={{width:"120px", color: "white", backgroundColor:"#0bbe47", transition:"background-color 0.3s ease"}}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0c973b")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0bbe47")}
            >更新</button>
            <button
              onClick={handleCancelParamClick}
              style={{width:"120px", color: "white", backgroundColor:"#eb1f29", transition:"background-color 0.3s ease"}}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#bd1b23")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#eb1f29")}
            >取消</button>
          </> 
        }
        </div>
      </div>

      <div className="box01">
        {isLoaded && 
          <>
            <div className="box02">
              <h2>数据预处理参数</h2>
              <div>
                <label>数据库 ID: </label>
                <h4>{JSON.stringify(preDetail.dbUnitID)}</h4>
              </div>
              <div>
                <label>归一化: </label>
                <h4>{JSON.stringify(preDetail.xStandardized)}</h4>
              </div>
              <div>
                <label>样本列: </label>
                <h4>{preDetail.serializedXCol}</h4>
              </div>
              <div>
                <label>目标列: </label>
                <h4>{preDetail.serializedTCol}</h4>
              </div>
              <div>
                <label>训练集占比: </label>
                <h4>{JSON.stringify(preDetail.trainPercent)}%</h4>
              </div>
              <div>
                <label>验证集占比: </label>
                <h4>{JSON.stringify(preDetail.validationPercent)}%</h4>
              </div>
              <div>
                <label>测试集占比: </label>
                <h4>{JSON.stringify(preDetail.testPercent)}%</h4>
              </div>
            </div>

            <div className="box03">
              <h2>模型参数配置</h2>
              {!isEdit ?
              <>
                <div>
                  <label>激活函数: </label>
                  <h4>{modelParam.af}</h4>
                </div>
                <div>
                  <label>最大候选节点数: </label>
                  <h4>{modelParam.maxCandidates}</h4>
                </div>
                <div>
                  <label>最大节点数: </label>
                  <h4>{modelParam.maxNodes}</h4>
                </div>
                <div>
                  <label>最小误差: </label>
                  <h4>{modelParam.minTolerance}</h4>
                </div>
                <div>
                  <label>节点添加数/循环: </label>
                  <h4>{modelParam.nodePerAdd}</h4>
                </div>
                <div>
                  <label>Lambdas: </label>
                  <h4>{JSON.stringify(modelParam.lambdas)}</h4>
                </div>
                <div>
                  <label>Regularization: </label>
                  <h4>{JSON.stringify(modelParam.regularizations)}</h4>
                </div>
              </>  
              :
              <>
                <div className="stack-div">
                  <label htmlFor="afOptions">激活函数: </label>
                  <select 
                    className="custom-select"
                    id="afOptions" 
                    value={modelParam.af} 
                    onChange={handleSelectedAF}
                    name="af"
                  >
                    <option value="-" disabled>请选择</option>
                    {afList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="stack-div">
                  <label>最大候选节点数: </label>
                  <input
                    type="number"
                    defaultValue={modelParam.maxCandidates}
                    name="maxCandidates"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="stack-div">
                  <label>最大节点数: </label>
                  <input
                    type="number"
                    defaultValue={modelParam.maxNodes}
                    name="maxNodes"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="stack-div">
                  <label>最小误差: </label>
                  <input
                    type="number"
                    defaultValue={modelParam.minTolerance}
                    name="minTolerance"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="stack-div">
                  <label>节点添加数/循环: </label>
                  <input
                    type="number"
                    defaultValue={modelParam.nodePerAdd}
                    name="nodePerAdd"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="stack-div">
                  <label>Lambdas: </label>
                  <input
                    defaultValue={modelParam.lambdas}
                    name="lambdas"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="stack-div">
                  <label>Regularization: </label>
                  <input
                    defaultValue={modelParam.regularizations}
                    name="regularizations"
                    onChange={handleInputChange}
                  />
                </div>
              </>  
              }
            </div>
          </>
        }
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
