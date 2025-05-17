"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDisclosure } from "@heroui/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FilterSection } from "./Filters"; 
import { OrderTable } from "./salesTable";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const Detail = ({ isOpen, onOpenChange, selectedOrder, fetchOrders }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Order Details
            </ModalHeader>
            <ModalBody>
              {selectedOrder ? (
                <div>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Party:</strong> {selectedOrder.name}</p>
                  <p><strong>Total:</strong> {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'PKR',
                    minimumFractionDigits: 0 
                  }).format(selectedOrder.totalPrice || 0)}</p>
                  <p><strong>Status:</strong> {selectedOrder.totalPrice === selectedOrder.amountPaid ? "Paid" : 
                    new Date() > new Date(selectedOrder.deadline) ? "Overdue" : "Pending"}</p>
                </div>
              ) : (
                <p>No order selected</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

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
  const { data: session, status } = useSession();
  const user = session?.user?.name || null;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCanceledOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/handleCanceledOrder");
      if (!response.ok) throw new Error("Failed to fetch canceled orders");
      const data = await response.json();
      setCanceledOrders(data);
    } catch (error) {
      toast.error("Failed to fetch canceled orders");
      console.error("Error fetching canceled orders:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
      fetchCanceledOrders();
    }
  }, [status, fetchOrders, fetchCanceledOrders]);

  const filteredOrders = orders.filter((order) => {
    const checkoutDate = new Date(order.lastCheckout);
    const paymentStatus = order.totalPrice === order.amountPaid
      ? "paid"
      : order.amountPaid < order.totalPrice && new Date() > new Date(order.deadline)
      ? "overdue"
      : "pending";

    return (
      (selectedFilter === "All" || paymentStatus === selectedFilter.toLowerCase()) &&
      (selectedMonth === "Select Month" || 
       checkoutDate.toLocaleString("en-US", { month: "long" }) === selectedMonth) &&
      (selectedYear === "Select Year" || 
       checkoutDate.getFullYear().toString() === selectedYear)
    );
  });

  const deleteOrder = async (e, order) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/handleOrder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, user }),
      });
      if (!response.ok) throw new Error("Failed to delete order");
      toast.success("Order deleted successfully");
      await fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/handleOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      if (!response.ok) throw new Error("Failed to update orders");
      toast.success("Orders updated successfully");
      await fetchOrders();
    } catch (error) {
      toast.error("Failed to update orders");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalAction = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <section className="w-full flex flex-col gap-4">
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
        deleteOrder={deleteOrder}
      />
      <Detail
        isOpen={isOpen}
        selectedOrder={selectedOrder}
        fetchOrders={fetchOrders}
        onOpenChange={onOpenChange}
      />
    </section>
  );
};

export default Orders;