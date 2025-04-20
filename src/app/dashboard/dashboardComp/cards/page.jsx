"use client";

import { CoinsIcon, HandCoins, BanknoteIcon, Coins } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";


const Cards = () => {
  const cardData = [
    {
      title: "Total Payable",
      value: "PKR 150000",
      icon: <CoinsIcon className="text-red-500 w-6 h-6" />,
      bgColor: "bg-red-100",
      hoverBgColor: "hover:bg-red-200",
    },
    {
      title: "Total Receiveable",
      value: "PKR 25000",
      icon: <HandCoins className="text-green-500 w-6 h-6" />,
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
    },
    {
      title: "Bank Amount",
      value: "PKR 300000",
      icon: <BanknoteIcon className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Cash Amount",
      value: "PKR 75000",
      icon: <Coins className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },

    {
      title: "Total Expanses",
      value: "PKR 455000",
      icon: <Coins className="text-gray-500 w-6 h-6" />,
      bgColor: "bg-gray-100",
      hoverBgColor: "hover:bg-gray-200",
    },
    {
      title: "Gross Profit",
      value: "PKR 755090",
      icon: <Coins className="text-green-500 w-6 h-6" />,
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
    },
    {
      title: "Total Revenue",
      value: "PKR 275000",
      icon: <Coins className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Total Loss",
      value: "PKR -275000",
      icon: <Coins className="text-red-500 w-6 h-6" />,
      bgColor: "bg-red-100",
      hoverBgColor: "hover:bg-red-200",
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
          <p className="text-gray-500 text-xs mt-3">
            Showing data of {new Date().getFullYear()}
            {/* <Tabs
              color="white"
              radius="full"
              aria-label="Options"
              size="sm"
            >
              <Tab key="daily" title="Month" />
              <Tab key="monthly" title="Year" />
            </Tabs> */}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
