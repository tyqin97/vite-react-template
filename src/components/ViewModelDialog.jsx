import { useState } from "react";
import MatrixVisualizer from "./MatrixVisualizer";
import "./ViewModelDialog.css";

export default function ViewModel ({ setViewModal, model }) {

    const [matrix, setMatrix] = useState();


    async function handleCloseClick () {
        setViewModal(prev => !prev)
    }

    async function handleMatrixClick (event) {
        setMatrix(
            <div className="matrix">
                <MatrixVisualizer
                    matrix={model.Matrices[event.target.value]}
                />
            </div>
        )
    }

    return (
        <div className="modal">
            <div 
                className="modal-content"
                style={{padding: "20px"}}
            >
                <h2>模型参数</h2>
                <div className="sideside">
                    <div>
                        <button
                            value={0}
                            onClick={handleMatrixClick}
                        >输入权值</button>
                    </div>
                    <div>
                        <button
                            value={1}
                            onClick={handleMatrixClick}
                        >偏值</button>
                    </div>
                    <div>
                        <button
                            value={2}
                            onClick={handleMatrixClick}
                        >输出权值</button>
                    </div>
                </div>
                {matrix}
                <button
                    className="closebtn"
                    onClick={handleCloseClick}
                >关闭</button>
            </div>
        </div>
    );
}