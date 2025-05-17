"use client";

import React from "react";
import { Input } from "@heroui/react";

export function PaymentDetails({ items, amountPaid, setAmountPaid }) {
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.salePricePerUnit),
    0
  );
  const pendingAmount = totalAmount - Number(amountPaid);

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Payment Details</h3>
      <Input
        label="Amount Received"
        type="number"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        required
      />
      <div className="flex justify-between border border-gray-200 py-4 rounded-lg px-5 bg-gray-100 mt-3">
        <div>
          <p className="font-semibold">Pending:</p>
          <p>{!isNaN(pendingAmount) ? pendingAmount.toFixed(2) : "0.00"}</p>
        </div>
        <div>
          <p className="font-semibold">Total:</p>
          <p>{totalAmount.toFixed(2) || "0.00"}</p>
        </div>
      </div>
    </div>
  );
}