import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SetPercent } from "../services/preprocessingService";
import "./SetPercentage.css";

export default function SetPercentage ({ 
    setIsEditA, pdetails, setPredetails, setIsPDetails, setToUpdate  }) {
    
    const [isAbove100, setIsAbove100] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [percentList, setPercentList] = useState([
        pdetails.trainPercent,
        pdetails.validationPercent,
        pdetails.testPercent
    ]);

    async function handleCancelClick () {
        setIsEditA(prev => !prev)
    }

    async function handleSaveClick () {
        setIsLoading(prev => !prev)

        const sanitizedList = percentList.map(item => (isNaN(item) ? 0 : item));
        const total = sanitizedList.reduce((total, cur) => {return total + cur}, 0);

        if (total != 100) {
            toast.error("总和不等于100！")
            setIsLoading(prev => !prev)
            return;
        }

        try {
            const response = await SetPercent(pdetails.id, percentList)
            toast.success("成功储存！")
            setTimeout(() => {
                setIsPDetails(prev => !prev)
                setToUpdate(prev => !prev)
                setIsLoading(prev => !prev)
            }, 3300)
        }
        catch (error) {
            toast.error(error.message);
            setIsLoading(prev => !prev)
        }
        
    }

    async function handleInputOnChange (event) {
        const {name, value} = event.target
        const newVal = parseInt(value);

        const newArr = [...percentList];
        newArr[Number(name)] = newVal;
        setPercentList(newArr)

        const total = newArr.reduce((total, cur) => {return total + cur},0)

        if (total > 100) {
            setIsAbove100(true)
        }
        else {
            setIsAbove100(false)
        }
    }

    return (
        <>
        <div className="center-container">
            <div className="form">
                <label>训练百分比</label>
                <input
                    type="number"
                    name="0"
                    min={0}
                    value={isNaN(percentList[0]) ? 0 : percentList[0]}
                    onChange={handleInputOnChange}
                />
                <label>验证百分比</label>
                <input
                    type="number"
                    name="1"
                    min={0}
                    value={isNaN(percentList[1]) ? 0 : percentList[1]}
                    onChange={handleInputOnChange}
                />
                <label>测试百分比</label>
                <input
                    type="number"
                    name="2"
                    min={0}
                    value={isNaN(percentList[2]) ? 0 : percentList[2]}
                    onChange={handleInputOnChange}
                />

                {isAbove100 && <p style={{color:"red"}}>总和不能超过100</p>}
                
                <div className="center-btn">
                    <button
                        onClick={handleSaveClick}
                        disabled={isLoading}
                    >储存</button> 
                    <button
                        style={{backgroundColor:"#eb1f29", transition:"background-color 0.3s ease"}}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#bd1b23")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#eb1f29")}
                        onClick={handleCancelClick}
                        disabled={isLoading}
                    >取消</button>
                </div>              
            </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" closeButton={false}/>
        </>
    );
}