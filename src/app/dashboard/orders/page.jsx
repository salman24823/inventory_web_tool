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
  useDisclosure,
  Button,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";
import Action from "./action";
import { Spinner } from "@heroui/react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { Check } from "lucide-react";
import { Eye } from "lucide-react";
import Detail from "./detail";

export default function Inventory() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = React.useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setOrders(data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter((order) => {
    // Determine payment status based on totalPending
    const paymentStatus =
      order.totalPrice === order.amountPaid
        ? "paid"
        : order.totalPrice !== order.amountPaid
          ? "pending"
          : new Date() == new Date(order.lastCheckout)
            ? "overdue"
            : null;

    const matchesFilter =
      selectedFilter === "All" ||
      paymentStatus === selectedFilter.toLowerCase();

    // Extract month and year from lastCheckout
    const checkoutDate = new Date(order.lastCheckout);
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

  async function DeleteOrder(e, id) {
    e.preventDefault(); // Prevent default event behavior
    setLoading(id); // Set loading state for this specific order

    if (!window.confirm("Are you sure you want to delete this order?")) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/handleOrder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to Delete");
      }

      toast.success("Successfully Deleted");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error in Deleting");
    } finally {
      setTimeout(() => {
        setLoading(null); // Ensure loading state lasts at least 1 sec
      }, 1000);
    }
  }

  async function handleConfirm() {
    try {
      const response = await fetch("/api/handleOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("Successfully updated");
      fetchOrders();
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Error in Updating");
    } finally {
      setTimeout(() => {
        setLoading(null); // Ensure loading state lasts at least 1 sec
      }, 1000);
    }
  }

  function ModalAction(order){
    console.log(order,"selected order")
    setSelectedOrder(order);
    onOpen()
  }

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-white">
        <h2 className="text-medium text-gray-700 font-normal">
          Select Filter:
        </h2>
        <div className="flex justify-between">
          <div className="relative flex gap-3 items-center">
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
                    key={option}
                    onPress={() => setSelectedFilter(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

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
                    key={option}
                    onPress={() => setSelectedMonth(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

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
                    key={option}
                    onPress={() => setSelectedYear(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onPress={() => {
                setSelectedFilter("All");
                setSelectedMonth("Select Month");
                setSelectedYear("Select Year");
              }}
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>

          <div className="flex gap-3">
            {/* {editing == false ? (
              <Button onPress={() => setEditing(true)} className="bg-green-500">
                <Pencil className="text-white w-5" />
              </Button>
            ) : (
              <Button onPress={handleConfirm} className="bg-green-500">
                <Check className="text-white" />
              </Button>
            )} */}

            <Action
              fetchOrders={fetchOrders}
            />

          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <Table
          className="overflow-x-scroll text-nowrap custom-scrollbar"
          aria-label="Order analysis table"
          loading={isLoading}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>PARTY</TableColumn>
            <TableColumn>ORDER</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>PENDING</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>DUE DATE</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No Orders Found">
            {filteredOrders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order, index) => (
                <TableRow className="hover:bg-gray-100" key={order._id}>
                  <TableCell>{index + 1}</TableCell>

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
                        className="w-10 h-10"
                        alt="Order"
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>

                  <TableCell className="max-w-52">
                    <p className="text-sm text-gray-500">{order.orderName}</p>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {" "}
                    {order.totalPrice - order.amountPaid} R.S
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-4 text-xs py-1 rounded-full  ${order.totalPrice === order.amountPaid
                        ? "bg-green-100 text-green-700" // Paid
                        : new Date() > new Date(order.deadline)
                          ? "bg-red-100 text-red-700" // Overdue
                          : "bg-yellow-100 text-yellow-700" // Pending
                        }`}
                    >
                      {order.totalPrice === order.amountPaid
                        ? "Paid"
                        : new Date() > new Date(order.deadline)
                          ? "Overdue"
                          : "Pending"}
                    </span>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <p className="text-sm">{order.deadline}</p>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {loading === order._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <div className="flex gap-3 items-center">
                        <X
                          onClick={(e) => DeleteOrder(e, order._id)}
                          className="text-red-600 hover:cursor-pointer"
                        />

                        <Eye onClick={()=> ModalAction(order)} className="text-blue-600 hover:cursor-pointer" />


                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <Detail isOpen={isOpen} selectedOrder={selectedOrder} onOpenChange={onOpenChange}  />
    </section>
  );
}
