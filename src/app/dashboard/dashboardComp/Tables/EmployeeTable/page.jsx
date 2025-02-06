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

export default function EmployeeTable() {
  const [employees] = useState([
    {
      id: 1,
      name: "Ali Khan",
      phone: "+92 300 1234567",
      role: "Manager",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      phone: "+92 310 9876543",
      role: "HR Officer",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      name: "Bilal Siddiqui",
      phone: "+92 321 4567890",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
    {
      id: 4,
      name: "Sana Malik",
      phone: "+92 333 1122334",
      role: "Sales Executive",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    },
  ]);

  return (
    <Table aria-label="Employee table">
      <TableHeader>
        <TableColumn>EMPLOYEE</TableColumn>
        {/* <TableColumn>ROLE</TableColumn> */}
      </TableHeader>

      <TableBody emptyContent="NO EMPLOYEES FOUND">
        {employees.map((employee) => (
          <TableRow
            key={employee.id}
            className="hover:bg-gray-100 transition-colors"
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.role}</p>
                </div>
              </div>
            </TableCell>
            {/* <TableCell>{employee.role}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
