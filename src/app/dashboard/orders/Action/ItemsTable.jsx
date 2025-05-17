"use client";

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Tooltip } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";

export function ItemsTable({ items, stockData, handleRemoveItem }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table aria-label="Order items table">
        <TableHeader>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>PRICE/UNIT</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const stock = stockData.find((s) => s._id === item.stockId);
            const itemTotal = Number(item.quantity) * Number(item.salePricePerUnit);

            return (
              <TableRow key={index}>
                <TableCell>{stock?.clothQuality || "N/A"}</TableCell>
                <TableCell>
                  {item.quantity} {stock?.unitType || "Unknown Unit"}
                </TableCell>
                <TableCell>{item.salePricePerUnit}</TableCell>
                <TableCell>{itemTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="Remove">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}