import "./AddOneDataDialog.css";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AddNewDataByDBName } from "../services/preprocessingService";

export default function AddDataDialog({ setClose, colName, tableName, setToUpdate }) {
    const [inputVal, setInputVal] = useState(Array(colName.length).fill(''));
    const [isClick, setIsClick] = useState(false);

  async function handleClose() {
    setClose(prev => !prev);
  }

  async function handleAdd() {
    setIsClick(prev => !prev)
    const combinedVal = inputVal.map(value => value === '' ? Number(0) : Number(value));

    try {
        const res = await AddNewDataByDBName(tableName, colName, combinedVal)
        toast.success("添加成功！");
        setTimeout(() => {
            setClose(prev => !prev)
            setToUpdate(prev => !prev)
            setIsClick(prev => !prev)
        }, 3500)
    }
    catch (error) {
        toast.error(error)
    }
  }

  async function handleInputChange(e, index) {
    const newInputVal = [...inputVal];
    newInputVal[index] = e.target.value;
    setInputVal(newInputVal);
  }

  return (
    <div className="modal">
        <div className="modal-content">
            <h2>添加新数据</h2>
            {colName.map((name, index) => (
                <div className="input-container" key={index}>
                    <label>{name}</label>
                    <input
                        type="number"
                        value={inputVal[index]}
                        onChange={(e) => handleInputChange(e, index)}    
                    />
                </div>
            ))}
            <button
              onClick={handleAdd}
              style={{backgroundColor: "#0bbe47", margin: "10px", width: "100px"}}
              disabled={isClick}
            >添加
            </button>
            <button
              onClick={handleClose}
              style={{ backgroundColor: '#eb1f29', margin: "10px", width: "100px"}}
              disabled={isClick}
            >取消</button>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}