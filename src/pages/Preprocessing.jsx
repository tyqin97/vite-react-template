import { useEffect, useState, useRef } from "react";
import "./Preprocessing.css"
import { getDBByUser } from "../services/fileImportService";
import { getTableByDBName, GetTableColumnByDBName, DeleteDataByRowID, GetDetails } from "../services/preprocessingService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AGTable from "../components/AGTable";
import ConfirmationDialog from "../components/ComfirmationDialog";
import AddDataDialog from "../components/AddOneDataDialog";
import PreprocessingDialog from "../components/PreprocessDialog";

export default function Preprocessing() {
  const [selectedDB, setSelectedDB] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [dbList, setDbList] = useState([]);
  const [rowData, setRowData] = useState();
  const [colDef, setColDef] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isGood, setIsGood] = useState(false);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [colName, setColName] = useState();
  const [toUpdate, setToUpdate] = useState(false);
  const [selectedID, setSelectedID] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [isPDetails, setIsPDetails] = useState(false);
  const [predetails, setPredetails] = useState();
  // const [gridKey, setGridKey] = useState(0);

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

  useEffect(() => {
    if (!toUpdate) {
      return;
    }
    else {
      handleLoadingClick()
      setToUpdate(prev => !prev)
    }
  }, [toUpdate])

  useEffect(() => {
    localStorage.setItem("pdetail", JSON.stringify(predetails));
  }, [predetails])

  async function getDbList() {
    const response = await getDBByUser(user.id)
    return response.dbUnits.$values
  }

  async function fetchData() {
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
      const preResponse = await GetDetails(selectedDB);
      setPredetails(preResponse);
      if (preResponse.zscoreParam !== undefined) {
        setPredetails((prev) => {
          return {
            ...prev,
            zscoreParam: JSON.parse(prev.zscoreParam)
          }
        })
      }
      // localStorage.setItem("pdetail", JSON.stringify(preResponse));

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

      setColDef([{headerName: "Select", checkboxSelection: true, flex:0.4}, ...columnDefs])
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
    setIsPDetails(prev => !prev)
  }

  async function handleAddOneDataClick () {
    try {
      const columnResponse = await GetTableColumnByDBName(selectedDB);
      let resp = columnResponse.colName.$values.slice(1);
      setColName(resp);
      setIsDataDialogOpen(prev => !prev);
    }
    catch (error) {
      toast.error(error);
    }
  }

  async function handleDataFrmChild (selectedIds) {
    setSelectedID(selectedIds)
  }

  async function handleDeleteRowClick () {
    if (selectedID.length === 0) {
      toast.error("必须选择至少一行数据！")
      return;
    }
    setIsDelete(prev => !prev);
  }

  async function handleConfirmDelete () {
    try {
      const response = await DeleteDataByRowID(selectedDB, selectedID)
      const res = `总共删除：${response.count}行数据。`
      toast.success(String(res))
      setTimeout(() => {
        setToUpdate(prev => !prev)
        setIsDelete(prev => !prev)
      }, 3300)
    }
    catch (error) {
      toast.error(error.message)
    }
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
                  ))
            }
          </select>
          <button 
            style={{backgroundColor:'#0bbe47', width:"120px"}}
            onClick={handleLoadingClick}
            disabled={isLoading}
          >加载</button>
          {isLoading && <div className="spinner"></div>}
          <button
            style={{backgroundColor:'#007bff', width:"120px"}}
            disabled={!isGood}
            onClick={handleAddOneDataClick}
          >添加数据</button>
          <button
            style={{backgroundColor: "#eb1f29", width:"120px"}}
            disabled={!isGood}
            onClick={handleDeleteRowClick}
          >删除数据
          </button>
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
        {rowData != null && <AGTable 
          rowData={rowData} 
          colDef={colDef}
          height="63vh"
          filter={true}
          pageSize={20}
          handleDataFrmChild={handleDataFrmChild}
          // forceRefresh={gridKey}
        />}
        {isDataDialogOpen && 
          <AddDataDialog
            setClose={setIsDataDialogOpen}
            colName={colName}
            tableName={selectedDB}
            setToUpdate={setToUpdate}
          />
        }
        {isDelete && 
          <ConfirmationDialog
            message={`是否确定删除ID : [${selectedID.join(",")}]（无法撤销）`}
            onConfirm={handleConfirmDelete}
            onCancel={() => {setIsDelete(prev => !prev)}}
          />
        }
        {isPDetails &&
          <PreprocessingDialog
            pdetails={predetails}
            setPredetails={setPredetails}
            setIsPDetails={setIsPDetails}
            setToUpdate={setToUpdate}
          />
        }
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
  