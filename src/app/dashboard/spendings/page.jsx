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
import { ChevronDown, X, Plus } from "lucide-react";
import { Spinner } from "@heroui/react";
import { toast } from "react-toastify";
import Action from "./action";
import { useSession } from "next-auth/react";

export default function Spendings() {
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [loading, setLoading] = useState(false);
  const [spendings, setSpendings] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const isAdmin = session?.user?.email === "admin@gmail.com";

  const fetchSpendings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/handleSpendings");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSpendings(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching spendings:", error);
    }
  };

  useEffect(() => {
    fetchSpendings();
  }, []);

  const months = [...Array(12)].map((_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );
  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

  const filteredSpendings = spendings.filter((spending) => {
    const spendingDate = new Date(spending.date);
    const spendingMonth = spendingDate.toLocaleString("en-US", {
      month: "long",
    });
    const spendingYear = spendingDate.getFullYear().toString();

    const matchesMonth =
      selectedMonth === "Select Month" || spendingMonth === selectedMonth;
    const matchesYear =
      selectedYear === "Select Year" || spendingYear === selectedYear;

    return matchesMonth && matchesYear;
  });

  async function deleteSpending(e, id) {
    e.preventDefault();
    setLoading(id);
    if (!window.confirm("Are you sure you want to delete this spending?")) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/handleSpendings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Successfully Deleted");
      fetchSpendings();
    } catch (error) {
      console.error(error);
      toast.error("Error in Deleting");
    } finally {
      setTimeout(() => setLoading(null), 1000);
    }
  }

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex flex-col gap-3 w-full p-4 bg-white">
        <h2 className="text-medium text-gray-700 font-normal">
          Select Filter:
        </h2>
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <Dropdown>
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

            <Dropdown>
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
              onPress={() => {
                setSelectedMonth("Select Month");
                setSelectedYear("Select Year");
              }}
            >
              <X className="w-4 h-4" /> Clear Filters
            </Button>
          </div>
          <div className="flex gap-3">
          
            <Button
              onPress={onOpen}
              className="bg-blue-500 text-white font-semibold text-sm"
            >
              Add Spending <Plus className="w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>METHOD</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No Spendings Found">
            {filteredSpendings.map((spending, index) => (
              <TableRow className="hover:bg-gray-100" key={spending._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{spending.amount} R.S</TableCell>
                <TableCell>{spending.description}</TableCell>
                <TableCell>
                  {new Date(spending.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "Asia/Karachi",
                  })}
                </TableCell>
                <TableCell>{spending.method}</TableCell>

                <TableCell>
                  {loading === spending._id ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      {isAdmin ? (
                        <X
                          onClick={(e) => deleteSpending(e, spending._id)}
                          className="text-red-600 hover:cursor-pointer"
                        />
                      ) : (
                        "-"
                      )}
                    </>
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
        fetchSpendings={fetchSpendings}
      />
    </section>
  );
}
