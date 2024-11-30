import React, { useEffect, useState, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LiveGraph({ setResult, setChartImg }) {
  const chartRef = useRef(null);

  const [data, setData] = useState({
    labels: [], // Timestamps or x-axis values
    datasets: [
      {
        label: "训练集",
        data: [], // y-axis values
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
      {
        label: "验证集", // Second graph
        data: [], // y-axis values for Line 2
        borderColor: "rgba(192,75,192,1)",
        backgroundColor: "rgba(192,75,192,0.2)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    // Initialize SignalR connection
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5008/hub") // Replace with your SignalR hub URL
      .withAutomaticReconnect()
      .build();

    connection.start().catch((err) => console.error("Connection failed: ", err));

    connection.off("ReceiveMessage"); // Clear any existing listeners
    // Listen for data from SignalR
    connection.on("ReceiveMessage", (newData) => {
      if (!newData.end) {
        setData((prevData) => {
            const nextLabel = prevData.labels.length > 0 
                ? prevData.labels[prevData.labels.length - 1] + 1 
                : 1; // Start from 1 if no labels exist
            
            const updatedLabels = [...prevData.labels, nextLabel];
            const updatedData1 = [...prevData.datasets[0].data, newData.trainingResult];
            const updatedData2 = [...prevData.datasets[1].data, newData.validationResult];
    
            setResult((prev) => {
                return {
                    ...prev,
                    nodesNumber: nextLabel,
                    trainingResult:newData.trainingResult,
                    validationResult:newData.validationResult
                }
            })
    
            return {
              ...prevData,
              labels: updatedLabels,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: updatedData1,
                },
                {
                    ...prevData.datasets[1],
                    data: updatedData2,
                  },
              ],
            };
          });
      }
      else {
        setData((prevData) => {            
            const updatedLabels = [...prevData.labels.slice(0, -1)]; 
            const updatedData1 = [...prevData.datasets[0].data.slice(0, -1)];
            const updatedData2 = [...prevData.datasets[1].data.slice(0, -1)];
    
            setResult((prev) => {
                return {
                    ...prev,
                    nodesNumber: newData.nodesNumber,
                    trainingResult:newData.trainingResult,
                    validationResult:newData.validationResult
                }
            })
            return {
              ...prevData,
              labels: updatedLabels,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: updatedData1,
                },
                {
                    ...prevData.datasets[1],
                    data: updatedData2,
                  },
              ],
            };
        });
        
        sendImgToParent();
      }        
    });

    // Cleanup on component unmount
    return () => {
      connection.stop();
    };
  }, []);

  async function sendImgToParent() {
    const chartInstance = chartRef.current; // Access the chart instance
    if (chartInstance && typeof setChartImg === 'function') {
        setChartImg(chartInstance); // Pass the chart instance to the parent
    }
  }

  return (
    <div style={{ width: "90%", height: "95%", alignContent:"center", margin: "0 auto" }}>
      <Line
        ref={chartRef}
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: { display: true, position: "top" },
          },
          scales: {
            x: { title: { display: true, text: "节点数" } },
            y: { title: { display: true, text: "均方根误差" } },
          },
        }}
      />
    </div>
  );
}