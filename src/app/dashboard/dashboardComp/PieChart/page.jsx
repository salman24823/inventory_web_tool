"use client"

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Tab, Tabs } from '@heroui/react';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const DoughnutChart = () => {
  const [timeRange, setTimeRange] = useState('monthly'); // State to manage time range

  // Sample data for daily and monthly spending
  const spendingData = {
    daily: {
      labels: ['Food', 'Other'],
      datasets: [
        {
          label: 'Daily Spending',
          data: [30, 15], // Example daily spending amounts
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // Food
            'rgba(75, 192, 192, 0.6)', // Other
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    monthly: {
      labels: ['Food', 'Other'],
      datasets: [
        {
          label: 'Monthly Spending',
          data: [500, 300], // Example monthly spending amounts
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // Food
            'rgba(75, 192, 192, 0.6)', // Other
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
        <Doughnut data={spendingData[timeRange]} options={options} />
      </div>

    </div>
  );
};

export default DoughnutChart;