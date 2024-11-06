import { useEffect, useState } from "react";
import "./Preprocessing.css"
import { getDBByUser } from "../services/fileImportService";
import { getTableByDBName, GetTableColumnByDBName } from "../services/preprocessingService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AGTable from "../components/AGTable";

export default function Preprocessing() {
  const [selectedDB, setSelectedDB] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [dbList, setDbList] = useState([]);
  const [rowData, setRowData] = useState();
  const [colDef, setColDef] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isGood, setIsGood] = useState(false);

  useEffect(() => {
    async function fetchList() {
      try {
        const response = await getDbList();
        setDbList(response)
      }
      catch (error) {
        toast.error(error);
      }
    }

    fetchList();
  }, [])

  async function getDbList() {
    const response = await getDBByUser(user.id)
    return response.dbUnits.$values
  }

  async function handleSelectedDBChange(event) {
    setSelectedDB(event.target.value);
  }

  async function handleLoadingClick() {
    if (selectedDB == "") {
      toast.error("请选择加载数据库！")
      return;
    }

    setIsLoading(prev => !prev)

    try {
      const dataResponse = await getTableByDBName(selectedDB);
      const columnResponse = await GetTableColumnByDBName(selectedDB);

      const rows = dataResponse.res.$values
      const columns = columnResponse.colName.$values;
      const columnDefs = columnResponse.colName.$values.map((col) => ({
        field: col,
        headerName: col,
        flex:1.0
      }))
      const formattedRowData = rows.map((row) => {
        const values = row["$values"];
        return columns.reduce((acc, col, index) => {
          acc[col] = values[index];
          return acc;
        }, {})
      })

      setColDef(columnDefs)
      setRowData(formattedRowData)
      
      toast.success(`加载数据库 ${selectedDB} 完成。`)
      setIsLoading(prev => !prev)
      setIsGood(true)
    }
    catch (error) {
      toast.error(error);
    }
  }

  async function handleConfigClick () {
    alert(`Configuration button ${selectedDB} clicked!`);
  }

  return (
    <div className="preprocessing-page">
      <h1>数据预处理</h1>
      <div className="box0">
        <div className="left-side">
          <label htmlFor="dbOptions">请选择加载数据库:</label>
          <select id="dbOptions" value={selectedDB} onChange={handleSelectedDBChange}>
            <option value="" disabled>请选择</option>
            {Array.isArray(dbList) && dbList.map((item) => (
                      <option key={item.id} value={item.dbName}>
                          {item.dbName}
                      </option>
                  ))}
          </select>
          <button 
            style={{backgroundColor:'#0bbe47', width:"150px"}}
            onClick={handleLoadingClick}
            disabled={isLoading}
          >加载</button>
          {isLoading && <div className="spinner"></div>}
        </div>
        <div className="right-side">
          <button
            style={{backgroundColor:'#007bff', width:"150px"}}
            disabled={!isGood}
            onClick={handleConfigClick}
          >预处理设置</button>
        </div>
      </div>
      <div className="box1">
        <AGTable 
          rowData={rowData} 
          colDef={colDef}
          height="63vh"
          pageSize={20}
        />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
  