import { useState } from "react";
import MatrixVisualizer from "./MatrixVisualizer";
import "./ViewModelDialog.css";

export default function ViewModel ({ setViewModal, model }) {

    const [matrix, setMatrix] = useState();


    async function handleCloseClick () {
        setViewModal(prev => !prev)
    }

    async function handleMatrixClick (event) {
        console.log(event.target.value)
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
                <h2>View Model</h2>
                <div className="sideside">
                    <div>
                        <button
                            value={0}
                            onClick={handleMatrixClick}
                        >Input Weights</button>
                    </div>
                    <div>
                        <button
                            value={1}
                            onClick={handleMatrixClick}
                        >Biases</button>
                    </div>
                    <div>
                        <button
                            value={2}
                            onClick={handleMatrixClick}
                        >Output Weights</button>
                    </div>
                </div>
                {matrix}
                <button
                    className="closebtn"
                    onClick={handleCloseClick}
                >Close</button>
            </div>
        </div>
    );
}