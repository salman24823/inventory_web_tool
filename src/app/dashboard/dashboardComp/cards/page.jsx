"use client";

import { useState } from "react";
import { Users, Package, Activity } from "lucide-react";
import { HandCoins } from "lucide-react";

const Cards = () => {
  const [stats, setStats] = useState({
    users: 20000,
    products: 15000,
    pendings: 5000,
    revenue: 250000,
  });

  const cardData = [
    {
      title: "Total Customers",
      value: stats.users,
      icon: <Users className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Total Orders",
      value: stats.products,
      icon: <Package className="text-yellow-500 w-6 h-6" />,
      bgColor: "bg-yellow-100",
      hoverBgColor: "hover:bg-yellow-200",
    },
    {
      title: "Total Pendings",
      value: `PKR ${stats.pendings.toLocaleString()}`,
      icon: <HandCoins className="text-red-500 w-6 h-6" />,
      bgColor: "bg-red-100",
      hoverBgColor: "hover:bg-red-200",
    },
    {
      title: "Total Revenue",
      value: `PKR ${stats.revenue.toLocaleString()}`,
      icon: <Activity className="text-green-500 w-6 h-6" />,
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.hoverBgColor} hover:-translate-y-1 cursor-pointer rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out transform`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                {card.title}
              </h4>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </h2>
            </div>
            <div className={`p-3 !bg-white rounded-full ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">From 01, March</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
