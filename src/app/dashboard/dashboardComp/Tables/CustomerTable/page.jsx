"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);

  const processCustomersData = (orders) => {
    const customersMap = new Map();

    orders.forEach((order) => {
      if (!customersMap.has(order.phone)) {
        customersMap.set(order.phone, {
          name: order.name,
          phone: order.phone,
          avatar: order.userImage || "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg",
          totalPayment: 0,
          pendingAmount: 0,
          status: "pending",
        });
      }

      const customer = customersMap.get(order.phone);
      customer.totalPayment += parseFloat(order.totalPrice);
      customer.pendingAmount += parseFloat(order.totalPrice) - parseFloat(order.amountPaid);

      // Determine status
      if (customer.pendingAmount === 0) {
        customer.status = "paid";
      } else {
        const isOverdue = new Date(order.deadline) < new Date();
        customer.status = isOverdue ? "overdue" : "pending";
      }
    });

    return Array.from(customersMap.values())
      .sort((a, b) => {
        const statusOrder = { overdue: 0, pending: 1, paid: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
      .slice(0, 5);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const processedCustomers = processCustomersData(data);
      setCustomers(processedCustomers);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Ensure the table always has 5 rows
  const displayedCustomers = [...customers];
  while (displayedCustomers.length < 5) {
    displayedCustomers.push({
      name: "",
      phone: "",
      avatar: "",
      totalPayment: 0,
      pendingAmount: 0,
      status: "",
    });
  }

  return (
    <Table aria-label="Customer analysis table">
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>CUSTOMER</TableColumn>
        <TableColumn>TOTAL PAYMENT</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>PENDING AMOUNT</TableColumn>
      </TableHeader>

      <TableBody emptyContent="NO CUSTOMERS FOUND">
        {displayedCustomers.map((customer, index) => (
          <TableRow key={index} className="hover:bg-gray-100 transition-colors">
            <TableCell>{customer.name ? index + 1 : ""}</TableCell>
            <TableCell>
              {customer.name ? (
                <div className="flex items-center gap-3">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="h-10" />
              )}
            </TableCell>
            <TableCell>
              {customer.name ? `${customer.totalPayment.toFixed(2)} PKR` : ""}
            </TableCell>
            <TableCell>
              {customer.name && (
                <span
                  className={`px-4 text-xs py-1 rounded-full font-medium ${
                    customer.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : customer.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : customer.status === "overdue"
                      ? "bg-red-100 text-red-700"
                      : ""
                  }`}
                >
                  {customer.status.toUpperCase()}
                </span>
              )}
            </TableCell>
            <TableCell>
              {customer.name ? `${customer.pendingAmount.toFixed(2)} PKR` : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
