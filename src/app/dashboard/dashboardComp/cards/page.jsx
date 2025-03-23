"use client";

import { useEffect, useState } from "react";
import { Users, Package, Activity } from "lucide-react";
import { HandCoins } from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import { Coins } from "lucide-react";
import { BanknoteIcon } from "lucide-react";
import { Wallet } from "lucide-react";

const Cards = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalPending, setTotalPending] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const walletAmount = 2937 ;
  const bankAmount = 23000 ;
  const cashAmount = 3000 ;

  async function HandleOrders() {
    try {
      const response = await fetch("/api/handleOrder");
      const result = await response.json();

      const uniqueUsers = new Set(result.map(item => item.phone)).size;
      const revenue = result.reduce((sum, item) => sum + Number(item.totalPrice), 0);
      const pendingAmount = result.reduce((sum, item) => sum + (Number(item.totalPrice) - Number(item.amountPaid)), 0);
      const ordersCount = result.length;

      setTotalUsers(uniqueUsers);
      setTotalRevenue(revenue);
      setTotalPending(pendingAmount);
      setTotalOrders(ordersCount);
    } catch (error) {
      console.log(error, "error fromGET");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    HandleOrders();
  }, []);

  const cardData = [
    {
      title: "Total Customers",
      value: loading ? <Spinner size="sm" /> : totalUsers ?? 0,
      icon: <Users className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Total Orders",
      value: loading ? <Spinner size="sm" /> : totalOrders ?? 0,
      icon: <Package className="text-yellow-500 w-6 h-6" />,
      bgColor: "bg-yellow-100",
      hoverBgColor: "hover:bg-yellow-200",
    },
    {
      title: "Total Pendings",
      value: loading ? <Spinner size="sm" /> : `PKR ${totalPending ?? 0}`,
      icon: <HandCoins className="text-red-500 w-6 h-6" />,
      bgColor: "bg-red-100",
      hoverBgColor: "hover:bg-red-200",
    },
    {
      title: "Total Revenue",
      value: loading ? <Spinner size="sm" /> : `PKR ${totalRevenue ?? 0}`,
      icon: <Activity className="text-green-500 w-6 h-6" />,
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
    },
    // {
    //   title: "Net Profit",
    //   value: loading ? <Spinner size="sm" /> : `PKR ${totalRevenue ?? 0}`,
    //   icon: <Activity className="text-green-500 w-6 h-6" />,
    //   bgColor: "bg-blue-100",
    //   hoverBgColor: "hover:bg-blue-200",
    // },
    {
      title: "Wallet Amount",
      value: loading ? <Spinner size="sm" /> : `PKR ${walletAmount ?? 400}`,
      icon: <Wallet className="text-green-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Bank Amount",
      value: loading ? <Spinner size="sm" /> : `PKR ${bankAmount ?? 3000}`,
      icon: <BanknoteIcon className="text-green-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      title: "Cash Amount",
      value: loading ? <Spinner size="sm" /> : `PKR ${cashAmount ?? 5540}`,
      icon: <Coins className="text-green-500 w-6 h-6" />,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
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