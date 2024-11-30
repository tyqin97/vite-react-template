import React, { useRef, useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required chart components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function ScatterGraph ({ setResult, setChartImg }) {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        datasets: [
          {
            label: "真实值 VS 预测值",
            data: [], // Initialize with empty data
            backgroundColor: "#9b59b6",
            pointRadius: 5,
          },
        ],
      });

    useEffect(() => {
        if (setResult && setResult.length > 0) {
            // Determine min and max from inputData for the line
            const xValues = setResult.map((point) => point.x);
            const yValues = setResult.map((point) => point.y);
            const minValue = Math.min(...xValues, ...yValues);
            const maxValue = Math.max(...xValues, ...yValues);

            setChartData({
                datasets: [
                    {
                        label: "真实值 VS 预测值",
                        data: setResult,
                        backgroundColor: "#9b59b6",
                        pointRadius: 5,
                    },
                    {
                        label: "真实值 = 预测值线", // Add the equality line
                        data: [
                        { x: minValue, y: minValue },
                        { x: maxValue, y: maxValue },
                        ],
                        borderColor: "#007bff", // Red line
                        borderWidth: 2,
                        pointRadius: 0, // Hide points on the line
                        type: "line", // Explicitly specify this as a line
                    },
                ],
            });
            sendImgToParent();
        }
        if (setResult == null){
            setChartData({
                datasets: [
                  {
                    label: "真实值 VS 预测值",
                    data: [], // Initialize with empty data
                    backgroundColor: "#9b59b6",
                    pointRadius: 5,
                  },
                ],
              })
        }
    }, [setResult]);

    async function sendImgToParent() {
        const chartInstance = chartRef.current; // Access the chart instance
        if (chartInstance && typeof setChartImg === 'function') {
            setChartImg(chartInstance); // Pass the chart instance to the parent
        }
    }
  
    return (
        <div style={{ width: "90%", height: "95%", alignContent:"center", margin: "0 auto" }}>
            <Scatter 
                ref={chartRef}
                data={chartData} 
                options={{
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                    scales: {
                      x: { title: { display: true, text: "真实值" } },
                      y: { title: { display: true, text: "预测值" } },
                    },
                  }}
            />
        </div>
    );    
};