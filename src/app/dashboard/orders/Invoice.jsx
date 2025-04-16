"use client";
import { PrinterIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";

const Invoice = ({ order }) => {
  const componentRef = useRef();
  const { data: session } = useSession();

  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const transaction = order.installments?.[0] || {};
  const totalPrice = parseInt(order.totalPrice || "0");
  const amountPaid = parseInt(order.amountPaid || "0");
  const pendingAmount = totalPrice - amountPaid;

  return (
    <div>
      <button onClick={handlePrint}>
        <PrinterIcon className="text-blue-600 w-6 h-6" />
      </button>

      {/* Print Area */}
      <div ref={componentRef} className="bg-white p-5 hidden max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold m-0">YOUR COMPANY NAME</h1>
            <p className="text-sm my-1">123 Anywhere St., Any City</p>
            <p className="text-sm my-1">123-456-7890 | company@gmail.com</p>
            <p className="text-sm my-1">Website : company.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold m-0">INVOICE</h2>
            <p className="text-lg my-1">{order._id?.slice(-6).toUpperCase() || "#"}</p>
          </div>
        </div>

        <hr className="border-gray-200 my-6" />

        {/* Billing Info */}
        <div className="flex justify-between mb-10">
          <div>
            <h3 className="text-base font-bold mb-2">INVOICE TO:</h3>
            <p className="text-sm my-1">{order.name}</p>
            <p className="text-sm my-1">{order.phone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-base font-bold mb-2">ISSUE DATE</h3>
            <p className="text-base my-1">{order.issueDate || "N/A"}</p>
            <p className="text-green-500 font-bold">
              {totalPrice === amountPaid ? "Paid" : "Pending"}
            </p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-10 border-collapse">
          <thead>
            <tr className="print-payable">
              <th className="text-white text-left py-3 px-4 font-semibold">QUALITY</th>
              <th className="text-white text-left py-3 px-4 font-semibold">QUANTITY</th>
              <th className="text-white text-left py-3 px-4 font-semibold">RATE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 py-3 px-4">{order.quality}</td>
              <td className="border border-gray-300 py-3 px-4">{order.quantity} Meter</td>
              <td className="border border-gray-300 py-3 px-4">
                {totalPrice / parseInt(order.quantity)} / Meter
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-10 ">
          <div className="w-72">
            <div className="flex justify-between mb-2">
              <span>Total Amount:</span>
              <span>{totalPrice} PKR</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Pending Amount:</span>
              <span>{pendingAmount} PKR</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Transaction Type:</span>
              <span>{transaction.transactionType || "NA"}</span>
            </div>
            <div className="flex justify-between print-payable p-3">
              <span>Amount Paid:</span>
              <span>{amountPaid} PKR</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mb-10">
          <p className="text-base">Thank you for your business! Please make payments payable to: Your Company Name</p>
        </div>

        <div className="mt-20 flex justify-between items-center gap-10">
          <div className="text-center">
            {session?.user?.name}
            <p className="border-t border-black w-48 mx-auto"></p>
            <p className="mt-2 text-gray-800">Reference Name</p>
          </div>
          <div className="text-center">
            <p className="border-t border-black w-48 mx-auto"></p>
            <p className="mt-2 text-gray-800">Administration</p>
          </div>
        </div>

        <div className="bg-black h-8 mt-24"></div>
      </div>
    </div>
  );
};

export default Invoice;
