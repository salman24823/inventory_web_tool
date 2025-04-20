"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Tab, Tabs } from "@heroui/react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [timeRange, setTimeRange] = useState("monthly");

  const dummyData = {
    daily: [
      { date: "2025-04-14", totalPrice: 220 },
      { date: "2025-04-15", totalPrice: 150 },
      { date: "2025-04-16", totalPrice: 300 },
      { date: "2025-04-17", totalPrice: 250 },
      { date: "2025-04-18", totalPrice: 180 },
    ],
    monthly: [
      { date: "2025-01", totalPrice: 1200 },
      { date: "2025-02", totalPrice: 980 },
      { date: "2025-03", totalPrice: 1340 },
      { date: "2025-04", totalPrice: 1600 },
    ],
    yearly: [
      { date: "2022", totalPrice: 8900 },
      { date: "2023", totalPrice: 10500 },
      { date: "2024", totalPrice: 11300 },
      { date: "2025", totalPrice: 9700 },
    ],
  };

  const selectedData = dummyData[timeRange];
  const labels = selectedData.map((item) => item.date);
  const values = selectedData.map((item) => item.totalPrice);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Sales`,
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
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
      <div className="flex-1 mt-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
