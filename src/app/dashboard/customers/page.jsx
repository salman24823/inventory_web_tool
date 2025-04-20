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

// Dummy data
const dummyOrders = [
  {
    name: "Ayesha Khan",
    phone: "03011234567",
    userImage: "https://i.pravatar.cc/150?img=1",
    totalPrice: "10000",
    amountPaid: "5000",
    issueDate: "2025-04-15",
    deadline: "2025-05-01",
    status: "Partially Paid"
  },
  {
    name: "Bilal Ahmed",
    phone: "03087654321",
    userImage: "https://i.pravatar.cc/150?img=2",
    totalPrice: "25000",
    amountPaid: "25000",
    issueDate: "2025-03-05",
    deadline: "2025-03-25",
    status: "Paid"
  },
  {
    name: "Sarah Malik",
    phone: "03123456789",
    userImage: "https://i.pravatar.cc/150?img=3",
    totalPrice: "18000",
    amountPaid: "12000",
    issueDate: "2025-02-10",
    deadline: "2025-03-10",
    status: "Partially Paid"
  },
  {
    name: "Faisal Raza",
    phone: "03345678901",
    userImage: "https://i.pravatar.cc/150?img=4",
    totalPrice: "35000",
    amountPaid: "35000",
    issueDate: "2025-01-20",
    deadline: "2025-02-15",
    status: "Paid"
  },
  {
    name: "Mariam Shah",
    phone: "03211223344",
    userImage: "https://i.pravatar.cc/150?img=5",
    totalPrice: "50000",
    amountPaid: "0",
    issueDate: "2025-04-01",
    deadline: "2025-04-25",
    status: "Pending"
  },
  {
    name: "Omer Javed",
    phone: "03092223344",
    userImage: "https://i.pravatar.cc/150?img=6",
    totalPrice: "80000",
    amountPaid: "50000",
    issueDate: "2025-03-18",
    deadline: "2025-04-05",
    status: "Partially Paid"
  },
  {
    name: "Zara Iqbal",
    phone: "03112223345",
    userImage: "https://i.pravatar.cc/150?img=7",
    totalPrice: "65000",
    amountPaid: "65000",
    issueDate: "2025-02-25",
    deadline: "2025-03-15",
    status: "Paid"
  },
  {
    name: "Hassan Nawaz",
    phone: "03055555555",
    userImage: "https://i.pravatar.cc/150?img=8",
    totalPrice: "90000",
    amountPaid: "60000",
    issueDate: "2025-01-12",
    deadline: "2025-02-01",
    status: "Partially Paid"
  },
  {
    name: "Saira Tariq",
    phone: "03225554433",
    userImage: "https://i.pravatar.cc/150?img=9",
    totalPrice: "120000",
    amountPaid: "120000",
    issueDate: "2025-04-10",
    deadline: "2025-05-01",
    status: "Paid"
  },
  {
    name: "Usman Ahmed",
    phone: "03324445556",
    userImage: "https://i.pravatar.cc/150?img=10",
    totalPrice: "150000",
    amountPaid: "0",
    issueDate: "2025-03-02",
    deadline: "2025-03-25",
    status: "Pending"
  }
];


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
        deadline: order.deadline,
      });
    }

    const customer = customersMap.get(order.phone);
    customer.orders.push(order);
    customer.totalPrice += parseFloat(order.totalPrice);
    customer.totalPending +=
      parseFloat(order.totalPrice) - parseFloat(order.amountPaid);

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
  const [isLoading, setIsLoading] = useState(true);

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
  ];

  useEffect(() => {
    const processed = processCustomersData(dummyOrders);
    setCustomers(processed);
    setIsLoading(false);
  }, []);

  const clearFilters = () => {
    setSelectedFilter("All");
    setSelectedMonth("Select Month");
    setSelectedYear("Select Year");
  };

  const filteredCustomers = customers.filter((customer) => {
    const status =
      customer.totalPending === 0
        ? "paid"
        : new Date() > new Date(customer.deadline)
        ? "overdue"
        : "pending";

    const matchesFilter =
      selectedFilter === "All" || selectedFilter.toLowerCase() === status;

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
                <Button variant="bordered" className="w-40 flex justify-between">
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
                <Button variant="bordered" className="w-40 flex justify-between">
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
                <Button variant="bordered" className="w-40 flex justify-between">
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

            {/* Clear Filters */}
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
                        ? "bg-green-100 text-green-700"
                        : new Date() > new Date(customer.deadline)
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
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
