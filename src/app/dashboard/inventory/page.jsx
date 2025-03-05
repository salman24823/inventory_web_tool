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
import { Plus } from "lucide-react";

export default function Stock() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [Stocks, setStocks] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = React.useState(false);

  const fetchStocks = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/handleStock");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setStocks(data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
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

  const filteredStocks = Stocks.filter((Stock) => {
    // Determine stock status based on stock quantity
    const stockStatus =
      Stock.quantity > 0
        ? "in-stock"
        : Stock.quantity === 0
        ? "out-of-stock"
        : null;

    const matchesFilter =
      selectedFilter === "All" || stockStatus === selectedFilter.toLowerCase();

    // Extract month and year from lastCheckout
    const checkoutDate = new Date(Stock.lastCheckout);
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

  async function DeleteStock(e, id) {
    e.preventDefault(); // Prevent default event behavior
    setLoading(id); // Set loading state for this specific Stock

    if (!window.confirm("Are you sure you want to delete this Stock?")) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/handleStock", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to Delete");
      }

      toast.success("Successfully Deleted");
      fetchStocks();
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
      const response = await fetch("/api/handleStock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Stocks),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("Successfully updated");
      fetchStocks();
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
                <Button variant="ghost" className="w-40 flex justify-between">
                  {selectedFilter}
                  <ChevronDown className="text-gray-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {["All", "In-Stock", "Out-of-Stock"].map((option) => (
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
                <Button variant="ghost" className="w-40 flex justify-between">
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
                <Button variant="ghost" className="w-40 flex justify-between">
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
            {editing == false ? (
              <Button onPress={() => setEditing(true)} className="bg-green-500">
                <Pencil className="text-white w-5" />
              </Button>
            ) : (
              <Button onPress={handleConfirm} className="bg-green-500">
                <Check className="text-white" />
              </Button>
            )}

            <Button
              onPress={onOpen}
              className="bg-blue-500 text-white font-semibold text-sm"
            >
              Add New Stock <Plus className="w-5" />
            </Button>
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
          aria-label="Stock analysis table"
          loading={isLoading}
        >
          <TableHeader>
            <TableColumn >#</TableColumn>
            <TableColumn className="min-w-36" >COMPANY NAME / PHONE</TableColumn>
            <TableColumn className="min-w-36" >COMPANY LOGO</TableColumn>
            <TableColumn className="min-w-36" >STOCK</TableColumn>
            <TableColumn className="min-w-36" >STOCK TITLE</TableColumn>
            <TableColumn className="min-w-36" >TOTAL</TableColumn>
            <TableColumn className="min-w-36" >PAID</TableColumn>
            <TableColumn className="min-w-36" >PENDING</TableColumn>
            <TableColumn className="min-w-36" >STATUS</TableColumn>
            <TableColumn className="min-w-36" >STOCK QUANTITY</TableColumn>
            <TableColumn className="min-w-36" >STOCK STATUS</TableColumn>
            <TableColumn className="min-w-36" >ISSUE DATE</TableColumn>
            <TableColumn className="min-w-36" >DEADLINE</TableColumn>
            <TableColumn >ACTION</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No Stocks Found">
            {filteredStocks
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((Stock, index) => (
                <TableRow className="hover:bg-gray-100 space-x-10" key={Stock._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        {editing ? (
                          <input
                            type="text"
                            className="bStock border border-gray-300 px-2 py-1 w-full"
                            value={Stock.companyName}
                            onChange={(e) => {
                              const updatedStocks = Stocks.map((o) =>
                                o._id === Stock._id
                                  ? { ...o, companyName: e.target.value }
                                  : o
                              );
                              setStocks(updatedStocks);
                            }}
                          />
                        ) : (
                          <p className="font-semibold">{Stock.companyName}</p>
                        )}

                        {editing ? (
                          <input
                            type="text"
                            className="bStock border border-gray-300 px-2 py-1 w-full"
                            value={Stock.phone}
                            onChange={(e) => {
                              const updatedStocks = Stocks.map((o) =>
                                o._id === Stock._id
                                  ? { ...o, phone: e.target.value }
                                  : o
                              );
                              setStocks(updatedStocks);
                            }}
                          />
                        ) : (
                          <p className="text-sm text-gray-500">{Stock.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {Stock.companyLogo ? (
                      <img
                        src={Stock.companyLogo}
                        className="w-10 h-10"
                        alt="Company Logo"
                      />
                    ) : (
                      "No Logo"
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {Stock.stockImage ? (
                      <img
                        src={Stock.stockImage}
                        className="w-10 h-10"
                        alt="Stock"
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {editing ? (
                      <input
                        type="text"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.stockName}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, stockName: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">{Stock.stockName}</p>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {editing ? (
                      <input
                        type="text"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.totalPrice}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, totalPrice: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p className="text-sm">{Stock.totalPrice} R.S</p>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {editing ? (
                      <input
                        type="text"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.amountPaid}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, amountPaid: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p
                        className={` ${
                          Stock.amountPaid == 0
                            ? "text-black"
                            : "text-green-600 font-semibold"
                        }`}
                      >
                        {Stock.amountPaid} R.S
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {" "}
                    {Stock.totalPrice - Stock.amountPaid} R.S
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-4 text-xs py-1 rounded-full  ${
                        Stock.totalPrice === Stock.amountPaid
                          ? "bg-green-100 text-green-700" // Paid
                          : new Date() > new Date(Stock.deadline)
                          ? "bg-red-100 text-red-700" // Overdue
                          : "bg-yellow-100 text-yellow-700" // Pending
                      }`}
                    >
                      {Stock.totalPrice === Stock.amountPaid
                        ? "Paid"
                        : new Date() > new Date(Stock.deadline)
                        ? "Overdue"
                        : "Pending"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {editing ? (
                      <input
                        type="number"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.quantity}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, quantity: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p className="text-sm text-gray-700"> <span className="text-black font-semibold"> {Stock.quantity} </span> {Stock.unit} </p>
                    )}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-4 text-xs py-1 rounded-full  ${
                        Stock.quantity > 0
                          ? "bg-green-100 text-green-700" // In-Stock
                          : "bg-red-100 text-red-700" // Out-of-Stock
                      }`}
                    >
                      {Stock.quantity > 0 ? "In-Stock" : "Out-of-Stock"}
                    </span>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {editing ? (
                      <input
                        type="date"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.issueDate}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, issueDate: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p className="text-sm">
                        {new Date(Stock.issueDate).toLocaleDateString("en-PK", {
                          timeZone: "Asia/Karachi",
                        })}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {editing ? (
                      <input
                        type="date"
                        className="bStock border border-gray-300 px-2 py-1 w-full"
                        value={Stock.deadline}
                        onChange={(e) => {
                          const updatedStocks = Stocks.map((o) =>
                            o._id === Stock._id
                              ? { ...o, deadline: e.target.value }
                              : o
                          );
                          setStocks(updatedStocks);
                        }}
                      />
                    ) : (
                      <p className="text-sm">
                        {new Date(Stock.deadline).toLocaleDateString("en-PK", {
                          timeZone: "Asia/Karachi",
                        })}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {loading === Stock._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <div className="flex gap-3 items-center">
                        <X
                          onClick={(e) => DeleteStock(e, Stock._id)}
                          className="text-red-600 hover:cursor-pointer"
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      <Action
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        fetchStocks={fetchStocks}
      />
    </section>
  );
}
