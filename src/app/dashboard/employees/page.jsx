"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
} from "@heroui/react";
import { X, User2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function Employees() {
  const [loading, setLoading] = useState(null); // Track which employee is being deleted
  const [employees, setEmployees] = useState([]); // Store employees

  const [isLoading, setIsLoading] = React.useState(true);

  const { data: session } = useSession();
  const isAdmin = session?.user?.email === "admin@gmail.com";

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/handleEmployee"); // ✅ Fetch from Employee API
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      console.log(data, "data");
      setEmployees(data); // ✅ Access employees array
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function deleteEmployee(e, id) {
    e.preventDefault();
    setLoading(id); // Show loading spinner for the specific employee

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) {
      setLoading(null);
      return;
    }

    try {
      const response = await fetch("/api/handleEmployee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      toast.success("Successfully deleted");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error("Error in deleting employee");
    } finally {
      setTimeout(() => {
        setLoading(null); // Ensure the loading icon is visible for at least 1 second
      }, 1000);
    }
  }

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="shadow-small payment-filter flex items-center justify-between gap-3 w-full p-4 bg-white">
        <h1 className="text-xl text-gray-600 flex gap-3 font-semibold">
          <User2 className="text-blue-600" /> Manage Your Employees
        </h1>
      </div>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <Table
          className="overflow-x-scroll text-nowrap custom-scrollbar"
          aria-label="Employee Table"
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>PHONE</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No Employees Found">
            {employees
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((employee, index) => (
                <TableRow className="hover:bg-gray-100" key={employee._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex flex-col">
                    <span>{employee.name || "N/A"}</span>
                  </TableCell>
                  <TableCell>{employee.phone || "N/A"}</TableCell>
                  <TableCell>{employee.email || "N/A"}</TableCell>

                  <TableCell>
                    {loading === employee._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        {isAdmin ? (
                          <X
                            onClick={(e) => deleteEmployee(e, employee._id)}
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
    </section>
  );
}
