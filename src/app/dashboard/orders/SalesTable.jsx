"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { X, Eye } from "lucide-react";
import { toast } from "react-toastify";

export function OrderTable({
  isLoading,
  orders,
  canceledOrders,
  selectedTab,
  fetchOrders,
  modalAction,
  deleteOrder,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusProps = (order) => {
    const isPaid = order.totalPrice === order.amountPaid;
    const isOverdue = new Date() > new Date(order.deadline);
    
    return {
      className: `px-4 py-1 text-xs rounded-full ${
        isPaid ? "bg-green-100 text-green-700" :
        isOverdue ? "bg-red-100 text-red-700" :
        "bg-yellow-100 text-yellow-700"
      }`,
      text: isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"
    };
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      )}
      <Table
        className="overflow-x-auto text-nowrap custom-scrollbar"
        aria-label="Order analysis table"
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>PARTY</TableColumn>
          <TableColumn>ORDER</TableColumn>
          {selectedTab === "Default" ? (
            <>
              <TableColumn>QUALITY</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>PENDING</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </>
          ) : (
            <>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DUE DATE</TableColumn>
            </>
          )}
        </TableHeader>

        <TableBody emptyContent="No Orders Found">
          {(selectedTab === "Default" ? orders : canceledOrders)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order, index) => (
              <TableRow key={order._id} className="hover:bg-gray-100">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.user || "N/A"}</TableCell>
                <TableCell className="max-w-52">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{order.name}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {order.orderImage ? (
                    <img
                      src={order.orderImage}
                      className="w-10 h-10 object-cover rounded"
                      alt="Order preview"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </TableCell>
                {selectedTab === "Default" ? (
                  <>
                    <TableCell className="max-w-52">
                      <p className="text-sm text-gray-500">{order.quality || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatCurrency(order.totalPrice || 0)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatCurrency((order.totalPrice || 0) - (order.amountPaid || 0))}</p>
                    </TableCell>
                    <TableCell>
                      <span {...getStatusProps(order)}>{getStatusProps(order).text}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={(e) => deleteOrder(e, order)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete order"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => modalAction(order)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="View order details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="max-w-52">
                      <p className="text-sm text-gray-500">{order.orderName || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatCurrency(order.totalPrice || 0)}</p>
                    </TableCell>
                    <TableCell>
                      <span {...getStatusProps(order)}>{getStatusProps(order).text}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(order.deadline).toLocaleDateString("en-US")}
                      </p>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}