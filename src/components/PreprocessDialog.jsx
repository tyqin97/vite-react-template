import { useState, useEffect } from "react";
import "./PreprocessingDialog.css"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeStandardize, GetDetails, GetTableColumnByDBName, Standardize } from "../services/preprocessingService";

import TwoPanelMultiselect from "./TwoPanelMultiselect.jsx"
import SetPercentage from "./SetPercentage.jsx";

export default function PreprocessingDialog({ 
    pdetails, setPredetails, setIsPDetails, setToUpdate 
  }) {

  const [isLoading, setIsLoading] = useState(false);
  const [isEditA, setIsEditA] = useState(false);
  const [isEditB, setIsEditB] = useState(false);

  const [] = useState();
  const [xtCol, setXTCol] = useState(pdetails);

  useEffect(() => {
    async function initData () {
        const response = await GetDetails(pdetails.dbUnit.dbName);
        setPredetails(response)
        if (response.zscoreParam !== undefined) {
            setPredetails((prev) => {
            return {
                ...prev,
                zscoreParam: JSON.parse(prev.zscoreParam)
            }
            })
        }
        localStorage.setItem("pdetail", JSON.stringify(response));
    }
    initData()

    if (pdetails.xList.$values.length == 0) {
        const loadColName = async () => {
            try {
                const colName = await GetTableColumnByDBName(pdetails.dbUnit.dbName);
                setXTCol((prev) => {
                    return {
                        ...prev,
                        xList: colName.colName.$values.slice(1)
                    }
                })
            }
            catch (error) {
                toast.error(error.message)
            }
        }
        loadColName()
    }

  },[])

  async function handleCloseClick () {
    setIsPDetails(prev => !prev)
    setToUpdate(prev => !prev)
    setIsEditB(prev => !prev)
  }

  async function handleStandardizeClick(event) {
    // toast.success(event.target.textContent)
    setIsLoading(prev => !prev)
    try {
        const res = await Standardize(pdetails.dbUnitID)
        setIsPDetails(prev => !prev)
        setToUpdate(prev => !prev)
    }
    catch (error) {
        toast.error(error.message);
    }
  }

  async function handleDeStandardizeClick(event) {
    // toast.success(event.target.textContent)
    setIsLoading(prev => !prev)
    try {
        const res = await DeStandardize(pdetails.dbUnitID)
        setIsPDetails(prev => !prev)
        setToUpdate(prev => !prev)
    }
    catch (error) {
        toast.error(error.message);
    }
  }

  async function handleEditClickA() {
    if (isEditB) {
        setIsEditB(prev => !prev)
    }
    setIsEditA(prev => !prev)
  }

  async function handleEditClickB() {
    if (isEditA) {
        setIsEditA(prev => !prev)
    }
    setIsEditB(prev => !prev)
    // const response = await GetDetails(pdetails.dbUnit.dbName);
    // setPredetails(response)
    // if (response.zscoreParam !== undefined) {
    //     setPredetails((prev) => {
    //       return {
    //         ...prev,
    //         zscoreParam: JSON.parse(prev.zscoreParam)
    //       }
    //     })
    // }
    //   localStorage.setItem("pdetail", JSON.stringify(response));
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>预处理设置</h2>
        <p>归一化设置</p>
        <div className="side-by-side">
            <button
              disabled={pdetails.xStandardized || isLoading}
              onClick={handleStandardizeClick}
              style={{width:'150px'}}
            >归一化</button>
            <button
              disabled={!pdetails.xStandardized || isLoading}
              onClick={handleDeStandardizeClick}
              style={{width:'150px'}}
            >反归一化</button>
        </div>

        <p>训练，验证，测试百分比</p>
        <div className="side-by-side">
          {!isEditA ? 
            <button
            style={{width:"150px"}}
              onClick={handleEditClickA}
            >设置</button> 
            :
            <>
              <SetPercentage
                setIsEditA={setIsEditA}
                pdetails={pdetails}
                setPredetails={setPredetails}
                setIsPDetails={setIsPDetails}
                setToUpdate={setToUpdate}
              />
            </>
            }
        </div>

        <p>样本与目标</p>
        <div className="side-by-side">
            {!isEditB ? 
            <button
            style={{width:"150px"}}
              onClick={handleEditClickB}
            >设置</button> 
            :
            <>
              <TwoPanelMultiselect
                setIsEditB={setIsEditB}
                xtCol={pdetails}
                setXTCol={setPredetails}
                setIsPDetails={setIsPDetails}
                setToUpdate={setToUpdate}
              />
            </>
            }
        </div>

        {isLoading && <div style={{margin:"0 auto"}} className="spinner"></div>}
        <div className="close-btn">
            <button
                onClick={handleCloseClick}
            >关闭</button>
        </div>
        
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
