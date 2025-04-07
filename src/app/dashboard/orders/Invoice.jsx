"use client";
import { PrinterIcon } from "lucide-react";
import { Printer } from "lucide-react";
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
    window.location.reload(); // Reload to restore the original content
  };

  return (
    <div>
      <button
        onClick={handlePrint}
      >
        <PrinterIcon className="text-blue-600 w-6 h-6" />
      </button>

      {/* Print Area */}
      <div ref={componentRef} className="bg-white p-5 hidden max-w-md mx-auto">
        {/* Company Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Your Company Name</h1>
          <p className="text-sm">123 Company Address, City, State, ZIP</p>
          <p className="text-sm">Phone: (123) 456-7890 | Email: info@company.com</p>
          <p className="text-sm">Website: www.company.com</p>
        </div>

        {/* Invoice Title */}
        <h2 className="text-xl font-bold text-center mb-4 border-b-2 border-black pb-2">
          INVOICE
        </h2>

        {/* Customer and Order Details */}
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-bold py-1">Invoice Number:</td>
              <td className="py-1">
                {/* {order.invoiceNumber} */}
                267
                </td>
              <td className="font-bold py-1">Issue Date:</td>
              <td className="py-1">{order.issueDate}</td>
            </tr>
            <tr>
              <td className="font-bold py-1">Customer Name:</td>
              <td className="py-1">{order.name}</td>
              {/* <td className="font-bold py-1">Deadline:</td> */}
              {/* <td className="py-1">{order.deadline}</td> */}
            </tr>
            <tr>
              <td className="font-bold py-1">Phone:</td>
              <td className="py-1">{order.phone}</td>
              <td className="font-bold py-1">Order:</td>
              <td className="py-1">{order.orderName}</td>
            </tr>
          </tbody>
        </table>

        {/* Order Summary Table */}
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">Description</th>
              <th className="border border-black p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Total Price</td>
              <td className="border border-black p-2">Rs. {order.totalPrice}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Amount Paid</td>
              <td className="border border-black p-2">Rs. {order.amountPaid}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Amount Pending</td>
              <td className="border border-black p-2 font-bold">
                Rs. {order.totalPrice - order.amountPaid}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="text-center text-sm mt-6">
          <p>Thank you for your business!</p>
          <p>Please make payments payable to: Your Company Name</p>
        </div>

        <div className="mt-60 flex justify-between items-center gap-10">
          <div className="text-center">
            {session?.user?.name}
            <p className="border-t border-gray-700 w-48 mx-auto"></p>
            <p className="mt-2 text-gray-800">Reference Name</p>
          </div>
          <div className="text-center">
            <p className="border-t border-gray-700 w-48 mx-auto"></p>
            <p className="mt-2 text-gray-800">Admin</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Invoice;