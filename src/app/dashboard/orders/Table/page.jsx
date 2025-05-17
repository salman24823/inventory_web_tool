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
import CancelTab from "./cancelTab";
import DefaultTab from "./defaultTab";

export function OrderTable({
    isLoading,
    orders,
    canceledOrders,
    selectedTab,
    fetchOrders,
    modalAction,
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusProps = (order) => {
        const isPaid = order.totalAmount === order.amountPaid;
        const isOverdue = order.deadline && new Date() > new Date(order.deadline);

        return {
            className: `px-4 py-1 text-xs rounded-full ${isPaid
                ? "bg-green-100 text-green-700"
                : isOverdue
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`,
            text: isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending",
        };
    };

    return (
        <div className="relative">
            {isLoading ? (
                <div>
                    <Spinner size="sm" />
                </div>
            ) : (
                <Table
                    className="overflow-x-auto text-nowrap custom-scrollbar"
                    aria-label="Order analysis table"
                    isHeaderSticky
                >
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn>CREATED BY</TableColumn>
                        <TableColumn>PARTY</TableColumn>
                        {selectedTab === "Default" ? (
                            <>
                                <TableColumn>ITEMS</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>PENDING</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>ACTION</TableColumn>
                            </>
                        ) : (
                            <>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>DUE DATE</TableColumn>
                            </>
                        )}
                    </TableHeader>

                    <TableBody>
                        {selectedTab === "Default" ? (
                            orders.map((order, index) => {
                                const statusProps = getStatusProps(order);
                                return (
                                    <TableRow className="hover:bg-gray-100 hover:cursor-pointer" key={order._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{order.createdBy}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>
                                            {order.items.length} item
                                            {order.items.length !== 1 ? "s" : ""}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(order.totalAmount)}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(order.pendingAmount)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={statusProps.className}>
                                                {statusProps.text}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => modalAction(order)}
                                                aria-label="View order details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            canceledOrders.map((order, index) => {
                                const statusProps = getStatusProps(order);
                                return (
                                    <TableRow className="hover:bg-gray-200" key={order._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{order.createdBy}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>
                                            {formatCurrency(order.totalAmount)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={statusProps.className}>
                                                {statusProps.text}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.deadline).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}