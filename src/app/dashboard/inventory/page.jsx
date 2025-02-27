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
import Action from "./action";
import { Package } from "lucide-react";

export default function Inventory() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      phone: "+92 300 1234567",
      totalPayment: "PKR 15,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      issueDate: "15 June 2025",
      dueDate: "27 June 2025",
      order: {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5rfkFC0d81aoUmpNifA3m1dPyBtSJjxvPWd2o3b74-PndvIjTL6HnG23UTpTK6rfMx9E",
        title: "12 Bundles Wool",
        orderReference: "1025"
      }
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      phone: "+92 310 9876543",
      totalPayment: "PKR 10,000",
      pendingAmount: "PKR 5,000",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      issueDate: "10 November 2026",
      dueDate: "1 December 2026",
      order: {
        image: "https://cdn.shopify.com/s/files/1/0524/1510/3132/files/silk-fabric_480x480.jpg?v=1644370656",
        title: "5 Cotton Rolls",
        orderReference: "2058"
      }
    },
    {
      id: 3,
      name: "Bilal Siddiqui",
      phone: "+92 321 4567890",
      totalPayment: "PKR 20,000",
      pendingAmount: "PKR 20,000",
      status: "overdue",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      issueDate: "15 March 2027",
      dueDate: "5 April 2027",
      order: {
        image: "https://t4.ftcdn.net/jpg/05/46/78/21/360_F_546782133_EEH5Hy29PtaxvLsm4VH3oLbHLncr4100.jpg",
        title: "8 Silk Fabrics",
        orderReference: "3072"
      }
    },
    {
      id: 4,
      name: "Sana Malik",
      phone: "+92 333 1122334",
      totalPayment: "PKR 12,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      issueDate: "1 June 2028",
      dueDate: "17 June 2028",
      order: {
        image: "https://cdn.plantssparkjoy.com/wp-content/uploads/2022/11/01073853/growing-cotton-plant-harvesting-guide-and-tips.jpeg",
        title: "10 Leather Bags",
        orderReference: "4156"
      }
    },
    {
      id: 5,
      name: "Ahmed Raza",
      phone: "+92 344 5566778",
      totalPayment: "PKR 18,000",
      pendingAmount: "PKR 3,000",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026025d",
      issueDate: "20 February 2029",
      dueDate: "10 March 2029",
      order: {
        image: "https://3.imimg.com/data3/AJ/LE/MY-13014046/plain-silk-fabric-250x250.png",
        title: "6 Denim Jackets",
        orderReference: "5298"
      }
    },
    {
      id: 6,
      name: "Zainab Ali",
      phone: "+92 355 9988776",
      totalPayment: "PKR 25,000",
      pendingAmount: "PKR 10,000",
      status: "overdue",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      issueDate: "5 August 2030",
      dueDate: "22 August 2030",
      order: {
        image: "https://zadran.store/cdn/shop/files/727095FA-272E-425E-89BC-511214BED769_600x.jpg?v=1737042534",
        title: "15 Cotton Shirts",
        orderReference: "6934"
      }
    }
  ]);
  
  

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
      selectedMonth === "Select Month" || customer.issueDate.includes(selectedMonth);
    const matchesYear =
      selectedYear === "Select Year" || customer.issueDate.includes(selectedYear);
    return matchesFilter && matchesMonth && matchesYear;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilter("All");
    setSelectedMonth("Select Month");
    setSelectedYear("Select Year");
  };

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

          <Action />
        </div>
      </div>

      {/* Table */}
      <Table aria-label="Customer analysis table">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>ORDER</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>PENDING</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ISSUE</TableColumn>
          <TableColumn>DUE</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>

        <TableBody emptyContent="NO CUSTOMERS FOUND">
          {filteredCustomers.map((customer, index) => (
            <TableRow
              key={customer.id}
              className="hover:bg-gray-100 transition-colors"
            >
              <TableCell>{customer.order.orderReference}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {customer.order.image ? (
                  <img
                    src={customer.order.image}
                    className="w-10 h-10"
                    alt="Order"
                  />
                ) : (
                  <Package className="w-6 h-6 text-gray-500" />
                )}
              </TableCell>
              <TableCell>{customer.order.title}</TableCell>
              <TableCell>{customer.totalPayment}</TableCell>
              <TableCell>{customer.pendingAmount}</TableCell>
              <TableCell>
                <span
                  className={`px-4 text-xs py-1 rounded-full font-medium ${
                    customer.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : customer.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.status.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>{customer.issueDate}</TableCell>
              <TableCell>{customer.dueDate}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  {/* <Eye className="w-5 text-blue-600" />{" "} */}
                  <X className="text-red-600 w-5" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
