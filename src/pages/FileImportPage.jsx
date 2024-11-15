import axiosInstance from "../services/axiosInstance";
import { useEffect, useState, useRef } from "react";
import { getFileByUser, uploadFile, deleteFile, getDBByUser, dropTable } from "../services/fileImportService";
import { FaCheck, FaTrash, FaDatabase } from 'react-icons/fa';
import { IoMdCreate } from "react-icons/io";
import ConfirmationDialog from "../components/ComfirmationDialog";
import "./FileImportPage.css"

import AGTable from "../components/AGTable";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DBDialog from "../components/DBDialog";

export default function FileImportPage() {
  const [rowData, setRowData] = useState();
  const [colDef, setColDef] = useState();
  const [rowData1, setRowData1] = useState();
  const [colDef1, setColDef1] = useState();
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const fileInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBuildDBOpen, setIsBuildDBOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [fileId, setFileId] = useState();
  const [fileName, setFileName] = useState();
  const [dbId, setDbId] = useState();
  const [dbName, setDbName] = useState();

  function getUserName () {
    const greeting = `欢迎，用户 ${user.name}`;

    return <p className="user">{greeting}</p>
  }

  async function fetchUserFileAPI() {
    return await getFileByUser(user.id);
  }

  async function fetchUserDBAPI() {
    return await getDBByUser(user.id);
  }

  async function fetchUserFile () {
    try {
      const response = await fetchUserFileAPI();
      if (response.status) {
        setRowData(response.fileImports.$values);
        setColDef([
          {field: "id", headerName: 'ID', flex: 0.5},
          {field: "fileName", headerName: '文件名', flex: 4.0},
          {field: "createDate", headerName: "创建日期", flex: 1.5, 
            valueFormatter: (params) => {
            const date = new Date(params.value);
            return date.toLocaleString()
          }},
          {field: "updateDate", headerName: "最近更新", flex: 1.5, 
            valueFormatter: (params) => {
            const date = new Date(params.value);
            return date.toLocaleString()
          }},
          {headerName: '操作', cellRenderer: (params) => (
            <div>
              <button 
              onClick={() => handleDBDialog(params.data.fileName)}
              style={{backgroundColor: '#0bbe47', marginRight: "10px"}}
            >
               <FaDatabase style={{ color: 'white' }} />
            </button>
            <button 
              onClick={() => handleOpenDialog(params.data.id)}
              style={{backgroundColor: '#eb1f29'}}
            >
               <FaTrash style={{ color: 'white' }} />
            </button>
            </div>
        ),},
        ]);
      }
    }
    catch (error) {
      toast.error(error)
    }
  }

  async function fetchUserDB () {
    try {
      const response = await fetchUserDBAPI();
      if (response.status) {
        setRowData1(response.dbUnits.$values);
        setColDef1([
          {field: "id", headerName: "ID", flex:0.5},
          {field: "dbName", headerName: "数据库名", flex:2.0},
          {field: "fileImportID", headerName: "使用文件ID", flex:1.0},
          {field: "createDate", headerName: "创建日期", flex: 1.0, 
            valueFormatter: (params) => {
            const date = new Date(params.value);
            return date.toLocaleString()
          }},
          {field: "updateDate", headerName: "最近更新", flex: 1.0, 
            valueFormatter: (params) => {
            const date = new Date(params.value);
            return date.toLocaleString()
          }},
          {headerName: '操作', flex:0.5, cellRenderer: (params) => (
            <div>
            <button 
              onClick={() => handleDBDeleteDialog(params.data)}
              style={{backgroundColor: '#eb1f29'}}
            >
               <FaTrash style={{ color: 'white' }} />
            </button>
            </div>
        ),},
        ])
      }
    }
    catch (error) {
      toast.error(error)
    }
  }

  async function handleDBDeleteDialog(data) {
    setDbId(data.id);
    setDbName(data.dbName);
    setIsDialogOpen1(true);
  }

  async function handleDBDialogConfirm() {
    setIsDialogOpen1(false);
    try {
      const response = await dropTable(user.id, dbId)
      toast.success("删除成功！");
      setTimeout(() => {
        fetchUserDB();
      }, 1000);
    }
    catch (error) {
      toast.error(error)
    }
  }

  async function handleDBDialogCancel() {
    setIsDialogOpen1(false);
  }

  async function handleDBDialog(fileName) {
    setFileName(fileName);
    setIsBuildDBOpen(true);
  }

  async function handleDBCancel() {
    setIsBuildDBOpen(false);
  }

  async function handleOpenDialog(id) {
    setFileId(id);
    setIsDialogOpen(true);
  }

  async function handleDialogCancel() {
    setIsDialogOpen(false);
  }

  async function handleDialogConfirm() {
    setIsDialogOpen(false)
    try {
      const response = await deleteFile(fileId, user.id)
      if (response.status) {
        toast.success("删除成功！")
        setTimeout(() => {
          fetchUserFile();
          fetchUserDB();
        }, 1000);
      }
    }
    catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchUserFile();
    fetchUserDB();
  }, [isBuildDBOpen]);

  async function handleUploadClick() {
    fileInputRef.current.click();
  }

  async function handleUploadChange(event) {
    const file = event.target.files[0];

    if (file) {
      try {
        const response = await uploadFile(file, user.id)
        if (response.status) {
          toast.success(response.message);
          setTimeout(() => {
            fetchUserFile();
          }, 1000);
        }
      }
      catch (error) {
        toast.error(error)
      }
    }
    else {
      toast.error("Please select a file first.")
    }
  }

  return (
    <div className="home-page">
      <h1>主页</h1>
      <div className="box0">
        {getUserName()}
        <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleUploadChange}
            />
        <button 
          style={{ backgroundColor: '#0bbe47' }}
          onClick={handleUploadClick}
        >数据文档上传</button>
        {/* <button style={{ backgroundColor: '#eb1f29' }}>删除数据文档</button> */}
      </div>
      <div className="box1">
        <AGTable rowData={rowData} colDef={colDef}/>
        {isDialogOpen &&
        <ConfirmationDialog 
          message="是否确定删除?"
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
        }
        {isBuildDBOpen &&
        <DBDialog 
          fileName={fileName}
          setClose={handleDBCancel}
        />
        }
      </div>
      <div className="box2">
        <AGTable rowData={rowData1} colDef={colDef1}/>
        {isDialogOpen1 &&
        <ConfirmationDialog 
          message={`是否确定删除 ${dbName} 数据库?（无法撤销）`}
          onConfirm={handleDBDialogConfirm}
          onCancel={handleDBDialogCancel}
        />
        }
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
