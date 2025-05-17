"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { toast } from "react-toastify";
import { FilterSection } from "./Filters";
import { OrderTable } from "./Table/page"; 
import Detail from "./detail";

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Default");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {

    fetchOrders()  
   
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order || !order.issueDate) {
        return false;
      }

      const issueDate = new Date(order.issueDate);
      if (isNaN(issueDate.getTime())) {
        return false;
      }

      const paymentStatus = order.totalAmount === order.amountPaid
        ? "paid"
        : order.amountPaid < order.totalAmount && new Date() > new Date(order.deadline || Date.now())
        ? "overdue"
        : "pending";

      return (
        (selectedFilter === "All" || paymentStatus === selectedFilter.toLowerCase()) &&
        (selectedMonth === "Select Month" ||
          issueDate.toLocaleString("en-US", { month: "long" }) === selectedMonth) &&
        (selectedYear === "Select Year" ||
          issueDate.getFullYear().toString() === selectedYear)
      );
    });
  }, [orders, selectedFilter, selectedMonth, selectedYear]);

  const modalAction = useCallback((order) => {
    setSelectedOrder(order);
    onOpen();
  }, [onOpen]);

  return (
    <section className="w-full flex flex-col gap-4">
      <Button onPress={()=> console.log(orders,"orders") } >Console</Button>
      <FilterSection
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        fetchOrders={fetchOrders}
      />
      <OrderTable
        isLoading={isLoading}
        orders={filteredOrders}
        canceledOrders={canceledOrders}
        selectedTab={selectedTab}
        fetchOrders={fetchOrders}
        modalAction={modalAction}
      />
      {selectedOrder && (
        <Detail
          isOpen={isOpen}
          selectedOrder={selectedOrder}
          fetchOrders={fetchOrders}
          onOpenChange={onOpenChange}
        />
      )}
    </section>
  );
};

export default Orders;