import axiosInstance from "../services/axiosInstance";
import { useEffect, useState, useRef } from "react";
import { getFileByUser, uploadFile, deleteFile } from "../services/fileImportService";
import { FaCheck, FaTrash } from 'react-icons/fa';
import ConfirmationDialog from "../components/ComfirmationDialog";
import "./Home.css"

import AGTable from "../components/AGTable";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [rowData, setRowData] = useState();
  const [colDef, setColDef] = useState();
  const fileInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [fileId, setFileId] = useState();

  function getUserName () {
    const greeting = `欢迎，用户 ${user.name}`;

    return <p className="user">{greeting}</p>
  }

  async function fetchUserData () {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      const response = await getFileByUser(user.id);
      if (response.status) {
        setRowData(response.fileImports.$values);
        setColDef([
          {field: "id", headerName: 'ID', flex: 1.0},
          {field: "fileName", headerName: '文件名', flex: 5.0},
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
              onClick={() => alert(`Clicked row ID: ${params.data.id}`)}
              style={{backgroundColor: '#0bbe47', marginRight: "10px"}}
            >
               <FaCheck style={{ color: 'white' }} />
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

  async function handleOpenDialog(id) {
    setFileId(id);
    setIsDialogOpen(true);
  }

  async function handleCancel() {
    setIsDialogOpen(false);
  }

  async function handleConfirm() {
    setIsDialogOpen(false)
    try {
      const response = await deleteFile(fileId, user.id)
      if (response.status) {
        toast.success("删除成功！")
        setTimeout(() => {
          fetchUserData();
        }, 1000);
      }
    }
    catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

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
            fetchUserData();
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      }
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}
