"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Eye } from "lucide-react";

export default function Detail({ stock }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Combine perUnitCharges and fixedCharges for miscellaneous charges
  const miscCharges = [
    ...(stock.perUnitCharges || []).map((charge) => ({
      description: charge.desc,
      cost: charge.totalCost,
    })),
    ...(stock.fixedCharges || []).map((charge) => ({
      description: charge.desc,
      cost: charge.totalCost,
    })),
    ...(stock.transportExpenses
      ? [{ description: "Transport", cost: stock.transportExpenses }]
      : []),
  ];

  return (
    <>
      <Eye
        onClick={onOpen}
        className="text-blue-600 hover:cursor-pointer"
      />
      <Modal size="6xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detailed Overview: {stock.factoryName} | {stock.purchaseOrderNumber}
              </ModalHeader>
              <ModalBody>
                <div className="bg-white w-full">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Quality</h2>
                        <p className="text-gray-600">{stock.clothQuality}</p>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Quantity</h2>
                        <div className="flex gap-2">
                          <p className="text-gray-600">
                            {stock.stockQuantity} {stock.unitType || "N/A"}
                          </p>
                          <p
                            className={`font-medium ${
                              stock.stockQuantity === 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {stock.stockQuantity === 0 ? "Out of Stock" : "In Stock"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Total Cost</h2>
                            <p className="text-gray-600">{stock.totalCost} PKR</p>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Cost Per Unit</h2>
                            <p className="text-gray-600">{stock.baseCostPerUnit} PKR</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Amount Paid</h2>
                            <p className="text-gray-600">{stock.amountPaid} PKR</p>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Remaining Amount</h2>
                            <p className="text-gray-600">{stock.pendingPayment} PKR</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 border-l border-gray-200 pl-6">
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Issue Date</h2>
                        <p className="text-gray-600">
                          {new Date(stock.issueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Status</h2>
                        <p
                          className={`font-medium ${
                            stock.pendingPayment === 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stock.pendingPayment === 0 ? "Clear" : "Pending Payment"}
                        </p>
                      </div>

                      {stock.deadlineDate && (
                        <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                          <h2 className="text-lg font-semibold text-gray-700">Payment Deadline</h2>
                          <p className="text-red-600 font-semibold">
                            {new Date(stock.deadlineDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Miscellaneous Charges Section */}
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Miscellaneous Charges</h2>
                        <div className="space-y-2">
                          {miscCharges.length > 0 ? (
                            miscCharges.map((charge, index) => (
                              <div key={index} className="flex justify-between">
                                <p className="text-gray-600">{charge.description}</p>
                                <p className="text-gray-600">{charge.cost} PKR</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600">No miscellaneous charges</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}