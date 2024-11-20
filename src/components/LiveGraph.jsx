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
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LiveGraph() {
  const [data, setData] = useState({
    labels: [], // Timestamps or x-axis values
    datasets: [
      {
        label: "Training Data",
        data: [], // y-axis values
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
      {
        label: "Validation Data", // Second graph
        data: [], // y-axis values for Line 2
        borderColor: "rgba(192,75,192,1)",
        backgroundColor: "rgba(192,75,192,0.2)",
        tension: 0.4,
      },
    ],
  });

  const labelCounter = useRef(1);

  useEffect(() => {
    // Initialize SignalR connection
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5008/hub") // Replace with your SignalR hub URL
      .withAutomaticReconnect()
      .build();

    connection.start().catch((err) => console.error("Connection failed: ", err));

    // Listen for data from SignalR
    connection.on("ReceiveMessage", (newData) => {
      console.log(newData)

      setData((prevData) => {
        const updatedLabels = [...prevData.labels, labelCounter.current];
        const updatedData1 = [...prevData.datasets[0].data, newData.trainingResult];
        const updatedData2 = [...prevData.datasets[1].data, newData.validationResult];

        // labelCounter += 1;

        // Keep the graph to a fixed number of points (e.g., 50)
        if (updatedLabels.length > 50) {
          updatedLabels.shift();
          updatedData1.shift();
          updatedData2.shift();
        }

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
    });

    // Cleanup on component unmount
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ width: "80%", alignContent:"center", margin: "0 auto" }}>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
          },
          scales: {
            x: { title: { display: true, text: "Number of Nodes" } },
            y: { title: { display: true, text: "RMSE" } },
          },
        }}
      />
    </div>
  );
}