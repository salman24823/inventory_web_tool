"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";
import Action from "./Action/action";

export function FilterSection({
  selectedFilter,
  setSelectedFilter,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedTab,
  setSelectedTab,
  fetchOrders,
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());

  const isFilterApplied = selectedFilter !== "All" ||
    selectedMonth !== "Select Month" ||
    selectedYear !== "Select Year";

  return (
    <div className="shadow-sm flex flex-col gap-4 w-full p-6 bg-white rounded-lg">
      <h2 className="text-lg text-gray-700 font-medium">Filter Orders</h2>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Button variant="bordered" className="w-40 flex justify-between text-gray-700 border-gray-300">
                {selectedFilter}
                <ChevronDown className="text-gray-500 w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {["All", "Paid", "Pending", "Overdue"].map((option) => (
                <DropdownItem
                  key={option}
                  onPress={() => setSelectedFilter(option)}
                  className="text-gray-700"
                >
                  {option}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Button variant="bordered" className="w-40 flex justify-between text-gray-700 border-gray-300">
                {selectedMonth}
                <ChevronDown className="text-gray-500 w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {["Select Month", ...months].map((option) => (
                <DropdownItem
                  key={option}
                  onPress={() => setSelectedMonth(option)}
                  className="text-gray-700"
                >
                  {option}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Button variant="bordered" className="w-40 flex justify-between text-gray-700 border-gray-300">
                {selectedYear}
                <ChevronDown className="text-gray-500 w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {["Select Year", ...years].map((option) => (
                <DropdownItem
                  key={option}
                  onPress={() => setSelectedYear(option)}
                  className="text-gray-700"
                >
                  {option}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 border-gray-300"
            onPress={() => {
              setSelectedFilter("All");
              setSelectedMonth("Select Month");
              setSelectedYear("Select Year");
            }}
            isDisabled={!isFilterApplied}
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Tabs
            color="primary"
            aria-label="Order Types"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            className="bg-gray-100 rounded-lg"
          >
            <Tab key="Default" title="Active Orders" />
            <Tab key="Canceled" title="Canceled Orders" />
          </Tabs>

          <Action fetchOrders={fetchOrders} />
        </div>
      </div>
    </div>
  );
}