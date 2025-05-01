"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import Detail from "./detail";
import Action from "./action";

export default function Stock() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedPO, setSelectedPO] = useState("All PO Numbers");

  const dummyStocks = [
    {
      _id: "1",
      quality: "22*12 Cotton",
      quantity: 5000,
      unit: "Meters",
      status: "In-Stock",
      paymentStatus: "Paid",
      poNumber: "PO3001",
      lastCheckout: "2025-04-01",
    },
    {
      _id: "2",
      quality: "22*12 Cotton",
      quantity: 0,
      unit: "Meters",
      status: "Out-of-Stock",
      paymentStatus: "Pending",
      poNumber: "PO3002",
      lastCheckout: "2025-03-15",
    },
    {
      _id: "3",
      quality: "22*12 Cotton",
      quantity: 12000,
      unit: "Yards",
      status: "In-Stock",
      paymentStatus: "Paid",
      poNumber: "PO3003",
      lastCheckout: "2025-02-28",
    },
    {
      _id: "4",
      quality: "22*12 Cotton",
      quantity: 4500,
      unit: "Rolls",
      status: "In-Stock",
      paymentStatus: "Paid",
      poNumber: "PO3004",
      lastCheckout: "2025-04-10",
    },
    {
      _id: "5",
      quality: "22*12 Cotton",
      quantity: 0,
      unit: "Meters",
      status: "Out-of-Stock",
      paymentStatus: "Overdue",
      poNumber: "PO3005",
      lastCheckout: "2025-03-20",
    },
  ];

  const handleRowClick = (stock) => {
    alert(`Viewing details for ${stock.poNumber}`);
  };

  const handleRefillClick = (stock) => {
    alert(`Refilling stock for ${stock.poNumber}`);
  };

  const filteredStocks = dummyStocks.filter((stock) => {
    const stockStatus = stock.quantity > 0 ? "In-Stock" : "Out-of-Stock";
    const matchesStatus = selectedFilter === "All" || stockStatus === selectedFilter;
    const matchesPO = selectedPO === "All PO Numbers" || stock.poNumber === selectedPO;
    return matchesStatus && matchesPO;
  });

  const uniquePONumbers = Array.from(new Set(dummyStocks.map((stock) => stock.poNumber)));

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-white">
        <h2 className="text-medium text-gray-700 font-normal">Select Filter:</h2>
        <div className="flex justify-between">
          <div className="relative flex gap-3 items-center flex-wrap">
            {/* Filter by Status */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button variant="ghost" className="w-40 flex justify-between">
                  {selectedFilter}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["All", "In-Stock", "Out-of-Stock"].map((option) => (
                  <DropdownItem key={option} onPress={() => setSelectedFilter(option)}>
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filter by Month */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button variant="ghost" className="w-40 flex justify-between">
                  {selectedMonth}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["January", "February", "March", "April"].map((option) => (
                  <DropdownItem key={option} onPress={() => setSelectedMonth(option)}>
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filter by Year */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button variant="ghost" className="w-40 flex justify-between">
                  {selectedYear}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["2025", "2026", "2027"].map((option) => (
                  <DropdownItem key={option} onPress={() => setSelectedYear(option)}>
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filter by PO Number */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button variant="ghost" className="w-48 flex justify-between">
                  {selectedPO}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["All PO Numbers", ...uniquePONumbers].map((po) => (
                  <DropdownItem key={po} onPress={() => setSelectedPO(po)}>
                    {po}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onPress={() => {
                setSelectedFilter("All");
                setSelectedMonth("Select Month");
                setSelectedYear("Select Year");
                setSelectedPO("All PO Numbers");
              }}
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
          <Action />
        </div>
      </div>

      {/* Table */}
      <Table className="overflow-x-scroll text-nowrap custom-scrollbar" aria-label="Stock analysis table">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn className="min-w-36">PO NUMBER</TableColumn>
          <TableColumn className="min-w-40">STOCK QUALITY</TableColumn>
          <TableColumn className="min-w-36">STATUS</TableColumn>
          <TableColumn className="min-w-36">QUANTITY</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No Stocks Found">
          {filteredStocks.map((stock, index) => (
            <TableRow className="hover:bg-gray-100 space-x-10" key={stock._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{stock.poNumber}</TableCell>
              <TableCell className="text-nowrap">
                <p className="text-sm text-gray-500">{stock.quality}</p>
              </TableCell>
              <TableCell>
                <span
                  className={`px-4 text-xs py-1 rounded-full ${stock.status === "In-Stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {stock.status}
                </span>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-700">
                  <span className="text-black font-semibold">{stock.quantity}</span> {stock.unit}
                </p>
              </TableCell>
              <TableCell className="text-nowrap">
                <div className="flex gap-3 items-center">
                  {/* <Eye
                    onClick={() => handleRowClick(stock)}
                    className="text-blue-600 hover:cursor-pointer"
                  /> */}
                  <Detail />

                  <PlusCircleIcon
                    onClick={() => handleRefillClick(stock)}
                    className="text-green-600 hover:cursor-pointer"
                  />
                  <X className="text-red-600 hover:cursor-pointer" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
