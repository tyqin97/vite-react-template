import { useEffect, useState } from "react";

import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

import "./TwoPanelMultiSelect.css";
import { DefineXT } from "../services/preprocessingService";

export default function TwoPanelMultiselect({ setIsEdit, xtCol, setXTCol, setIsPDetails, setToUpdate }) {
    const [xItems, setXItems] = useState(xtCol.xList.$values);
    const [tItems, setTItems] = useState(xtCol.tList.$values);
    const [pdId, setPdId] = useState(xtCol.id);
    const [done, setDone] = useState(false);

    // useEffect(() => {
    //     async function alterLS() {
    //         const pdetail = JSON.parse(localStorage.getItem("pdetail"));
    //         const data = {
    //             ...pdetail,
    //             xList: {
    //                 $values: xItems
    //             },
    //             tList: {
    //                 $values: tItems
    //             }
    //         }
    //         console.log(data)
    //         localStorage.setItem("pdetail",JSON.stringify(data));
    //         setDone(prev => !prev);
    //     }

    //     alterLS()
    // }, [done])
    
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
        try {
            const response = await DefineXT(pdId, xItems, tItems)
            setIsEdit(prev => !prev)
            setIsPDetails(prev => !prev)
            setToUpdate(prev => !prev)
        }
        catch (error) {
            console.log(error.message);
        }
    };

    const handleClose = () => {
    setIsEdit(prev => !prev)
    }

    return (
    <div>
        <div className="main-box">
        <div className="left-box">
            <h3>X Columns</h3>
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
            <button onClick={moveAllToT}>Move All<FaArrowCircleRight/></button>
            <button onClick={moveAllToX}>Move All<FaArrowCircleLeft/></button>
            </div>
        </div>

        <div className="right-box">
            <h3>T Columns</h3>
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
        >Save
        </button>
        <button 
            style={{backgroundColor:"#eb1f29", transition:"background-color 0.3s ease"}}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bd1b23")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#eb1f29")}
            onClick={handleClose}
        >Cancel
        </button>
        </div>
    </div>
    );
}