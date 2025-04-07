'use client'
import React, { useState, useEffect } from 'react'
import { Spinner } from '@heroui/react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@heroui/react'

const GrayCloth = ({ Cloths, isLoading }) => {
  const [loading, setLoading] = useState(false)

  const DeleteStock = async (id) => {
    alert(id);
    try {
      setLoading(true);
      const response = await fetch("/api/handleGrayCloth", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // ✅ wrap in object
      });
      setLoading(false);

      if (!response.ok) {
        throw new Error('Failed to delete stock');
      }

      const data = await response.json();

      if (data.message === "Stock deleted successfully") {
        alert('Stock deleted successfully');
        window.location.reload();
      } else {
        alert('Failed to delete stock');
      }

    } catch (error) {
      console.log(error, "Message from Delete");
    }
  }


  return (
    <div>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <Table
          className="overflow-x-scroll text-nowrap custom-scrollbar"
          aria-label="Stock analysis table"
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn className="min-w-40 max-w-72">STOCK TITLE</TableColumn>
            <TableColumn className="min-w-40 max-w-72">COMPANY NAME</TableColumn>
            <TableColumn className="min-w-36">STATUS</TableColumn>
            <TableColumn className="min-w-36">STOCK QUANTITY</TableColumn>
            <TableColumn className="min-w-36">PAID AMOUNT</TableColumn>
            <TableColumn className="min-w-36">TOTAL PRICE</TableColumn>
            <TableColumn className="min-w-36">ACTION</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No Stocks Found">
            {Cloths
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((Stock, index) => (
                <TableRow key={Stock._id} className="hover:bg-gray-100 space-x-10">
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="text-nowrap">
                    <p className="text-sm text-gray-500">{Stock.stockName}</p>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <p className="text-sm text-gray-500">{Stock.companyName}</p>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-4 text-xs py-1 rounded-full ${Stock.totalPrice === Stock.amountPaid
                        ? 'bg-green-100 text-green-700'
                        : new Date() > new Date(Stock.deadline)
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {Stock.totalPrice === Stock.amountPaid
                        ? 'Paid'
                        : new Date() > new Date(Stock.deadline)
                          ? 'Overdue'
                          : 'Pending'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm text-gray-700">
                      <span className="text-black font-semibold">
                        {Stock.quantity}
                      </span>{' '}
                      {Stock.unit}
                    </p>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-full`}
                    >
                      {Stock.amountPaid} PKR
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-full`}
                    >
                      {Stock.totalPrice} PKR
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button isLoading={loading} onPress={() => DeleteStock(Stock._id)}>Delete</Button>
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default GrayCloth
