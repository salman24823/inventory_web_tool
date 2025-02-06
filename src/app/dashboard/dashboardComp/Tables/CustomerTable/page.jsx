"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export default function CustomerTable() {
  const [customers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      phone: "+92 300 1234567",
      totalPayment: "PKR 15,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      phone: "+92 310 9876543",
      totalPayment: "PKR 10,000",
      pendingAmount: "PKR 5,000",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      name: "Bilal Siddiqui",
      phone: "+92 321 4567890",
      totalPayment: "PKR 20,000",
      pendingAmount: "PKR 20,000",
      status: "overdue",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
    {
      id: 4,
      name: "Sana Malik",
      phone: "+92 333 1122334",
      totalPayment: "PKR 12,000",
      pendingAmount: "PKR 0",
      status: "paid",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    },
  ]);

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
        {customers.map((customer, index) => (
          <TableRow
            key={customer.id}
            className="hover:bg-gray-100 transition-colors"
          >
            <TableCell>{index + 1}</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>{customer.totalPayment}</TableCell>
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

            <TableCell>{customer.pendingAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
