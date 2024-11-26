import { useState } from "react";
import "./SaveDialog.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveModel } from "../services/trainingService";

export default function SaveDialog({ setSaveDialog, user, selectedDb, model }) {
    const [name, setName] = useState();
    const [isClick, setIsClick] = useState(false);

    async function handleCancelClick () {
        setSaveDialog(prev => !prev);
    }

    async function handleSaveClick () {
        try {
            setIsClick(prev => !prev);
            const response = await saveModel(user.id, selectedDb, name, model.Matrices);
            toast.success("储存成功！");

            setTimeout(() => {
                setIsClick(prev => !prev);
                setSaveDialog(prev => !prev)
            }, 3300)
        }
        catch (error) {
            toast.error(error);
            setIsClick(prev => !prev);
        }
    }

    async function handleNameChange (event) {
        setName(event.target.value)
    }

    return (
        <div className="modal">
            <div 
                className="modal-content"
                style={{padding: "20px"}}
            >
                <h2>储存模型</h2>
                <div>
                    <p>模型命名: </p>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        style={{marginBottom: '20px'}}
                    />
                </div>
                <div className="side-by-side">
                    <button
                        style={{backgroundColor:"#0bbe47", width:"120px"}}
                        onClick={handleSaveClick}
                        disabled={isClick}
                    >确定</button>
                    <button
                        style={{backgroundColor:"#eb1f29", width:"120px"}}
                        onClick={handleCancelClick}
                        disabled={isClick}
                    >取消</button>
              </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark"/>
        </div>
    );
}