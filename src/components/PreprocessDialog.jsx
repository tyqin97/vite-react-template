import { useState, useEffect } from "react";
import "./PreprocessingDialog.css"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeStandardize, GetTableColumnByDBName, Standardize } from "../services/preprocessingService";

import TwoPanelMultiselect from "./TwoPanelMultiselect.jsx"

export default function PreprocessingDialog({ 
    pdetails, setPredetails, setIsPDetails, setToUpdate 
  }) {

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [xtCol, setXTCol] = useState({
    x: pdetails.xList.$values, 
    t: pdetails.tList.$values
  });

  useEffect(() => {
    if (xtCol.x.length == 0) {
        const loadColName = async () => {
            try {
                const colName = await GetTableColumnByDBName(pdetails.dbUnit.dbName);
                setXTCol((prev) => {
                    return {
                        ...prev,
                        x: colName.colName.$values.slice(1)
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
    setIsEdit(prev => !prev)
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

  async function handleEditClick() {
    setIsEdit(prev => !prev)
  }

  async function handleEditDoneClick () {
    setIsEdit(prev => !prev)
    alert("Done editing")
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Preprocessing Menu</h2>
        <p>Standardization</p>
        <div className="side-by-side">
            <button
              disabled={pdetails.xStandardized || isLoading}
              onClick={handleStandardizeClick}
              style={{width:'150px'}}
            >Standardize</button>
            <button
              disabled={!pdetails.xStandardized || isLoading}
              onClick={handleDeStandardizeClick}
              style={{width:'150px'}}
            >De-Standardize</button>
        </div>

        <p>Define X and T</p>
        <div className="side-by-side">
            
            {!isEdit ? 
            <button
            style={{width:"330px"}}
              onClick={handleEditClick}
            >Edit</button> 
            :
            <>
              <TwoPanelMultiselect
                setIsEdit={setIsEdit}
                xtCol={xtCol}
                setXTCol={setXTCol}
              />
            </>
            }
            
        </div>

        {isLoading && <div style={{margin:"0 auto"}} className="spinner"></div>}
        <div className="close-btn">
            <button
                onClick={handleCloseClick}
            >Close</button>
        </div>
        
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
    </div>
  );
}
