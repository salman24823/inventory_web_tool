"use client";

import React, { useEffect, useState } from "react";
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
import { Eye } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function Customers() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");

  const [customers, setCustomers] = useState([]);

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

  const years = [
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
  ];

  // Filter logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesFilter =
      selectedFilter === "All" ||
      customer.status === selectedFilter.toLowerCase();
    const matchesMonth =
      selectedMonth === "Select Month" || customer.date.includes(selectedMonth);
    const matchesYear =
      selectedYear === "Select Year" || customer.date.includes(selectedYear);
    return matchesFilter && matchesMonth && matchesYear;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilter("All");
    setSelectedMonth("Select Month");
    setSelectedYear("Select Year");
  };

  // fetch

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-white">
        <h2 className="text-medium text-gray-700 font-normal">
          Select Filter :
        </h2>
        <div className="flex justify-between">
          <div className="relative flex gap-3 items-center">
            {/* Filter by Status */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 flex justify-between"
                >
                  {selectedFilter}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["All", "Paid", "Pending", "Overdue"].map((option) => (
                  <DropdownItem
                    className="text-gray-600 hover:text-gray-900 hover:!bg-gray-100"
                    key={option}
                    onPress={() => setSelectedFilter(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filter by Month */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 flex justify-between"
                >
                  {selectedMonth}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {months.map((option) => (
                  <DropdownItem
                    className="text-gray-600 hover:text-gray-900 hover:!bg-gray-100"
                    key={option}
                    onPress={() => setSelectedMonth(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filter by Year */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 flex justify-between"
                >
                  {selectedYear}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {years.map((option) => (
                  <DropdownItem
                    className="text-gray-600 hover:text-gray-900 hover:!bg-gray-100"
                    key={option}
                    onPress={() => setSelectedYear(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Clear Filters Button */}
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onPress={clearFilters}
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table aria-label="Customer analysis table">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>TOTAL PAYMENT</TableColumn>
          <TableColumn>TOTAL PENDING</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>LAST CHECKOUT</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>

        <TableBody emptyContent="NO CUSTOMERS FOUND">
          {customers.map((customer, index) => (
            <TableRow
              key={customer.id}
              className="hover:bg-gray-100 transition-colors"
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-10 h-10 rounded-full"
                  /> */}
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.totalPrice}</TableCell>
              <TableCell>{customer.totalPrice - customer.amountPaid}</TableCell>
              <TableCell>
                <span
                  className={`px-4 text-xs py-1 rounded-full font-medium ${
                    customer.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : customer.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.paymentStatus.charAt(0).toUpperCase() +
                    customer.paymentStatus.slice(1)}
                </span>
              </TableCell>
              <TableCell>{customer.issueDate}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Eye className="w-5 text-blue-600" />{" "}
                  <Trash2 className="text-red-600 w-5" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
