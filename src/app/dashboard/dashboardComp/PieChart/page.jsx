"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Tab, Tabs } from "@heroui/react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [timeRange, setTimeRange] = useState("monthly"); // 'daily' or 'monthly'
  const [spendings, setSpendings] = useState([]);
  const [chartData, setChartData] = useState(null);

  const fetchSpendings = async () => {
    try {
      const response = await fetch("/api/handleSpendings");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSpendings(data);
    } catch (error) {
      console.error("Error fetching spendings:", error);
    }
  };

  useEffect(() => {
    fetchSpendings();
  }, []);

  useEffect(() => {
    if (spendings.length > 0) {
      // Process spending data into categories
      const categories = {};
      spendings.forEach((item) => {
        const category = item.description || "Other"; // Use 'Other' if no description
        categories[category] = (categories[category] || 0) + item.amount;
      });

      const labels = Object.keys(categories);
      const dataValues = Object.values(categories);

      setChartData({
        labels,
        datasets: [
          {
            label: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Spending`,
            data: dataValues,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [spendings, timeRange]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Spending`,
      },
    },
  };

  return (
    <div className="bg-white h-full p-6 flex flex-col rounded-lg shadow-md">
      <div className="flex justify-end mb-6">
        <Tabs
          value={timeRange}
          color="white"
          radius="full"
          aria-label="Options"
          selectedKey={timeRange}
          onSelectionChange={setTimeRange}
        >
          <Tab key="daily" title="Daily" />
          <Tab key="monthly" title="Monthly" />
        </Tabs>
      </div>

      <div>
        {chartData ? <Doughnut data={chartData} options={options} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default DoughnutChart;
