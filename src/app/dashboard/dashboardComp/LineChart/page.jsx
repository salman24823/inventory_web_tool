"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Tab, Tabs } from "@heroui/react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly");

  async function HandleOrders() {
    try {
      const response = await fetch("/api/handleOrder");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.log(error, "error from GET");
    }
  }

  useEffect(() => {
    HandleOrders();
  }, []);

  const processData = (range) => {
    const groupedData = {};

    data.forEach((order) => {
      let key;
      if (range === "daily") {
        key = order.issueDate;
      } else if (range === "monthly") {
        key = order.issueDate.slice(0, 7); // YYYY-MM
      } else if (range === "yearly") {
        key = order.issueDate.slice(0, 4); // YYYY
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += parseFloat(order.totalPrice);
    });

    const labels = Object.keys(groupedData).sort();
    const values = labels.map((key) => groupedData[key]);

    return { labels, values };
  };

  const { labels, values } = processData(timeRange);

  const salesData = {
    labels,
    datasets: [
      {
        label: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Sales`,
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "#e1e1e12e",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      y: {
        grid: {
          display: true,
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
  };

  return (
    <div className="bg-white h-full flex flex-col p-6 rounded-lg shadow-md">

      <div className="w-full flex justify-between">
        <h1 className="py-2 px-10 bg-gray-100 rounded-full shadow-sm">Detailed Analysis</h1>
        <Tabs
          color="white"
          value={timeRange}
          radius="full"
          aria-label="Options"
          selectedKey={timeRange}
          onSelectionChange={setTimeRange}
        >
          <Tab key="daily" title="Daily" />
          <Tab key="monthly" title="Monthly" />
          <Tab key="yearly" title="Yearly" />
        </Tabs>
      </div>
      <div className="flex-1">
        <Line data={salesData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;