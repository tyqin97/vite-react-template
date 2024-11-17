import { useEffect, useState } from "react";
import "./DBDialog.css"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkFile, createDB } from "../services/fileImportService";
import { CalcZScoreParam } from "../services/preprocessingService";
import { CreateOnePD } from "../services/preprocessingService";

export default function DBDialog({ fileName, setClose }) {
  const [dbName, setDbName] = useState('');
  const [hasHeader, setHasHeader] = useState(false);
  const [isClick, setIsClick] = useState(false);

  async function handleConfirm() {
    try {
      if (dbName == '') {
        toast.error("数据库名不能为空！")
        return;
      }
      const response = await checkFile(dbName)

      try{
        const res1 = await createDB(dbName, fileName, hasHeader)
        const res2 = await CreateOnePD(dbName)
        const res3 = await CalcZScoreParam(dbName)

        toast.success(`成功生成数据库：${dbName}`)
        setIsClick((prevState) => !prevState);
        setTimeout(() => {
          setClose((e) => !e)
        }, 3500)
      }
      catch (error) {
        toast.error(error)
      } 
    }
    catch (error) {
      toast.error(error)
    }
  }

  function handleCancel() {
    setClose((e) => !e)
  }

  function handleTextChange(event) {
    setDbName(event.target.value)
  }

  function toggleTrueFalse(){
    setHasHeader((e) => !e);
  }

  return (
    <div className="modal">
          <div className="modal-content">
            <h2>生成新数据库</h2>
            <h3>{fileName}</h3>
            <form>
              <div className="side-by-side">
                <p>数据库名字:</p>
                <input
                  type="text"
                  value={dbName}
                  onChange={handleTextChange}
                />
              </div>
              <div className="side-by-side">
                <p>包含标题？</p>
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={toggleTrueFalse}
                />
              </div>
              <div style={{color:"red"}}>* 标题只接受英文！(可接受符号:"_")</div>
              <div className="modal-button">
                <button 
                  disabled={isClick}
                  type="button" 
                  onClick={handleConfirm} 
                >确定</button>
                <button  
                  disabled={isClick}
                  type="button" 
                  onClick={handleCancel}
                >取消</button>
              </div>
            </form>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}