"use client";

import React, { useState } from "react";
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
  const [timeRange, setTimeRange] = React.useState("monthly");

  const salesData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Daily Sales",
          data: [300, 250, 200, 350, 400, 400, 300],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "#e1e1e12e", // Slightly more opaque to highlight the background
          tension: 0.4,
          fill: true, // Enables background fill under the line
        },
      ],
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Monthly Sales",
          data: [
            9000, 7500, 1000, 2000, 12000, 9000, 7500, 8500, 9500, 10000, 11000,
            12000,
          ],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "#e1e1e12e", // Slightly more opaque to highlight the background
          tension: 0.4,
          fill: true, // Enables background fill under the line
        },
      ],
    },
    yearly: {
      labels: [ "2019" , "2020" ,"2021","2022", "2023", "2024", "2025"],
      datasets: [
        {
          label: "Yearly Sales",
          data: [ 70000 , 15000 , 10000 , 30000, 45000, 60000, 90000],
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "#e1e1e12e", // Slightly more opaque to highlight the background
          tension: 0.4,
          fill: true, // Enables background fill under the line
        },
      ],
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // plugins: {
    //   legend: {
    //     position: "top",
    //   },
    //   title: {
    //     display: true,
    //     text: `Sales Data (${
    //       timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
    //     })`,
    //   },
    // },
    scales: {
      x: {
        grid: {
          display: true, // Enables vertical grid lines for a boxed background
          color: "rgba(200, 200, 200, 0.2)", // Light gray for subtle grid effect
        },
      },
      y: {
        grid: {
          display: true, // Enables horizontal grid lines for a boxed background
          color: "rgba(200, 200, 200, 0.2)", // Light gray to match the x-axis grid
        },
      },
    },
  };

  return (
    <div className="bg-white h-full flex flex-col p-6 rounded-lg shadow-md">


      <div className="w-full flex justify-between">
        <h1 className="py-2 px-10 bg-gray-100 rounded-full shadow-sm">
          Detailed Analysis
        </h1>
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
        <Line data={salesData[timeRange]} options={options} />
      </div>


    </div>
  );
};

export default LineChart;
