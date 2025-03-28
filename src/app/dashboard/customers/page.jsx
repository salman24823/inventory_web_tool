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
  Spinner,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";

const processCustomersData = (orders) => {
  const customersMap = new Map();

  orders.forEach((order) => {
    if (!customersMap.has(order.phone)) {
      customersMap.set(order.phone, {
        name: order.name,
        phone: order.phone,
        userImage: order.userImage,
        orders: [],
        totalPrice: 0,
        totalPending: 0,
        lastCheckout: order.issueDate,
      });
    }

    const customer = customersMap.get(order.phone);
    customer.orders.push(order);
    customer.totalPrice += parseFloat(order.totalPrice);
    customer.totalPending +=
      parseFloat(order.totalPrice) - parseFloat(order.amountPaid);

    // Update last checkout date
    if (new Date(order.issueDate) > new Date(customer.lastCheckout)) {
      customer.lastCheckout = order.issueDate;
    }
  });

  return Array.from(customersMap.values());
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [isLoading, setIsLoading] = React.useState(true);

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

  const filteredCustomers = customers.filter((customer) => {
    // Determine payment status based on totalPending
    const paymentStatus =
      customer.totalPending === 0
        ? "paid"
        : customer.totalPending !== 0
        ? "pending"
        : new Date() == new Date(customer.lastCheckout)
        ? "overdue"
        : null;

    const matchesFilter =
      selectedFilter === "All" ||
      paymentStatus === selectedFilter.toLowerCase();

    // Extract month and year from lastCheckout
    const checkoutDate = new Date(customer.lastCheckout);
    const checkoutMonth = checkoutDate.toLocaleString("en-US", {
      month: "long",
    });
    const checkoutYear = checkoutDate.getFullYear().toString();

    const matchesMonth =
      selectedMonth === "Select Month" || checkoutMonth === selectedMonth;

    const matchesYear =
      selectedYear === "Select Year" || checkoutYear === selectedYear;

    return matchesFilter && matchesMonth && matchesYear;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilter("All");
    setSelectedMonth("Select Month");
    setSelectedYear("Select Year");
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const processedCustomers = processCustomersData(data);
      setCustomers(processedCustomers);
      setIsLoading(false);
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

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <Table aria-label="Customer Orders Summary">
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>TOTAL PAYMENT</TableColumn>
            <TableColumn>TOTAL PENDING</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>LAST CHECKOUT</TableColumn>
          </TableHeader>

          <TableBody emptyContent="NO CUSTOMERS FOUND">
            {filteredCustomers.map((customer, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-100 transition-colors"
              >
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.userImage}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="text-green-600 font-semibold">
                    {customer.totalPrice}
                  </p>
                </TableCell>

                <TableCell>
                  <p
                    className={`${
                      customer.totalPending === 0
                        ? "text-black"
                        : "text-yellow-500"
                    } font-semibold`}
                  >
                    {customer.totalPending}
                  </p>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-4 text-xs py-1 rounded-full  ${
                      customer.totalPending === 0
                        ? "bg-green-100 text-green-700" // Paid
                        : new Date() > new Date(customer.deadline)
                        ? "bg-red-100 text-red-700" // Overdue
                        : "bg-yellow-100 text-yellow-700" // Pending
                    }`}
                  >
                    {customer.totalPending === 0
                      ? "Paid"
                      : new Date() > new Date(customer.deadline)
                      ? "Overdue"
                      : "Pending"}
                  </span>
                </TableCell>

                <TableCell>{customer.lastCheckout}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
