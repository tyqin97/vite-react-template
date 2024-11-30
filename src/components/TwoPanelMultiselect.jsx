import { useEffect, useState } from "react";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./TwoPanelMultiSelect.css";
import { DefineXT } from "../services/preprocessingService";

export default function TwoPanelMultiselect({ setIsEditB, xtCol, setXTCol, setIsPDetails, setToUpdate }) {
    const [xItems, setXItems] = useState(xtCol.xList.$values);
    const [tItems, setTItems] = useState(xtCol.tList.$values);
    const [pdId, setPdId] = useState(xtCol.id);
    const [done, setDone] = useState(false);
    
    // Move selected item to the other panel
    async function moveToT (item) {
        setXItems((prevItems) => prevItems.filter((i) => i !== item));
        setTItems((prevItems) => [...prevItems, item]);
    };

    // Move selected item back to available panel
    async function moveToX (item) {
        setTItems((prevItems) => prevItems.filter((i) => i !== item));
        setXItems((prevItems) => [...prevItems, item]);
    };

    // Move all items to the selected panel
    async function moveAllToT () {
        setTItems((prevItems) => [...prevItems, ...xItems]);
        setXItems([]);
    };

    // Move all items back to available panel
    async function moveAllToX () {
        setXItems((prevItems) => [...prevItems, ...tItems]);
        setTItems([]);
    };

    // Save button handler
    async function handleSave () {
        setDone(prev => !prev)
        try {
            const response = await DefineXT(pdId, xItems, tItems)
            toast.success("成功储存");
            setTimeout(() => {
                setIsPDetails(prev => !prev)
                setToUpdate(prev => !prev)
                setDone(prev => !prev)
            }, 3300)
            
        }
        catch (error) {
            toast.error(error.message);
            setDone(prev => !prev)
        }
    };

    const handleClose = () => {
    setIsEditB(prev => !prev)
    }

    return (
        <>
        <div>
        <div className="main-box">
        <div className="left-box">
            <h3>样本</h3>
            <ul style={{listStyleType:"none"}}>
            {xItems.map((item) => (
                <li key={item}>
                {item}{" "}
                <button onClick={() => moveToT(item)}><FaArrowCircleRight/></button>
                </li>
            ))}
            </ul>
        </div>

        <div className="middle-box">
            <div style={{display: "flex",flexDirection: "column", gap:"10px"}}>
            <button onClick={moveAllToT}>全部 <FaArrowCircleRight/></button>
            <button onClick={moveAllToX}>全部 <FaArrowCircleLeft/></button>
            </div>
        </div>

        <div className="right-box">
            <h3>目标</h3>
            <ul style={{listStyleType:"none"}}>
            {tItems.map((item) => (
                <li key={item}>
                {item}{" "}
                <button onClick={() => moveToX(item)}><FaArrowCircleLeft/></button>
                </li>
            ))}
            </ul>
        </div>
        </div>

        {/* Save Button */}
        <div className="center-btn">
        <button 
            onClick={handleSave}
            disabled={done}
        >储存
        </button>
        <button 
            style={{backgroundColor:"#eb1f29", transition:"background-color 0.3s ease"}}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bd1b23")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#eb1f29")}
            onClick={handleClose}
            disabled={done}
        >取消
        </button>
        </div>
    </div>
    <ToastContainer position="bottom-right" autoClose={3000} theme="dark" closeButton={false}/>
    </>
    );
}