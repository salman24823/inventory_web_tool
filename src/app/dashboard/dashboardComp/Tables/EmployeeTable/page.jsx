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

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]); // Store employees

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/handleEmployee"); // ✅ Fetch from Employee API
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data.slice(0, 5)); // ✅ Ensure only 5 employees are stored
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fill remaining rows with empty placeholders if less than 5 employees exist
  const filledEmployees = [...employees, ...Array(5 - employees.length).fill(null)];

  return (
    <Table aria-label="Employee table">
      <TableHeader>
        <TableColumn>EMPLOYEE</TableColumn>
      </TableHeader>

      <TableBody emptyContent="NO EMPLOYEES FOUND">
        {filledEmployees.map((employee, index) => (
          <TableRow key={index} className="hover:bg-gray-100 transition-colors">
            <TableCell>
              {employee ? (
                <div className="flex items-center gap-3">
                  <img
                    src={employee.image || "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg"}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
              ) : (
                <div className="h-10"></div> // Empty row without an index
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
