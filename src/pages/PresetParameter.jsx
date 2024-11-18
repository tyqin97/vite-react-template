import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./PresetParameter.css";
import { getDBByUser } from "../services/fileImportService";
import { GetDetails } from "../services/preprocessingService";


export default function PresetParameter() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [preDetail, setPreDetail] = useState();
  const [dbList, setDbList] = useState([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  async function handleSelectedPDetail (event) {
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
    setIsLoading(prev => !prev);
    setTimeout(() => {
      setIsLoaded(true)
    }, 500)
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
        </div>
      </div>

      <div className="box01">
        {isLoaded && 
          <>
            <div className="box02">
              <h2>Preprocessing of Data</h2>
              <div>
                <label>DB Unit ID: </label>
                <h4>{JSON.stringify(preDetail.dbUnitID)}</h4>
              </div>
              <div>
                <label>Standardized: </label>
                <h4>{JSON.stringify(preDetail.xStandardized)}</h4>
              </div>
              <div>
                <label>X Column: </label>
                <h4>{preDetail.serializedXCol}</h4>
              </div>
              <div>
                <label>T Column: </label>
                <h4>{preDetail.serializedTCol}</h4>
              </div>
              <div>
                <label>Training Allocate Percent: </label>
                <h4>{JSON.stringify(preDetail.trainPercent)}%</h4>
              </div>
              <div>
                <label>Validation Allocate Percent: </label>
                <h4>{JSON.stringify(preDetail.validationPercent)}%</h4>
              </div>
              <div>
                <label>Test Allocate Percent: </label>
                <h4>{JSON.stringify(preDetail.testPercent)}%</h4>
              </div>
            </div>

            <div className="box03">
              <h2>Model Parameters Setup</h2>

              <button>Edit</button>
            </div>
          </>
        }
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
