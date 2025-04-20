"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@heroui/react";
import { Eye } from "lucide-react";

export default function Detail() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const stock = {
    quality: "22*12 Cotton",
    quantity: 120,
    unit: "kg",
    totalPrice: 24000,
    costPerUnit: 200,
    amountPaid: 12000,
    companyLogo: "",
    companyName: "Fresh Agro Pvt Ltd",
    phone: "0300-1234567",
    issueDate: "2025-04-15",
    deadline: "2025-05-01",
  };

  // Miscellaneous Charges
  const [miscCharges] = useState([
    { description: "Dyes", cost: 500 },
    { description: "Cutting", cost: 300 },
    { description: "Printing", cost: 400 },
    { description: "Packing", cost: 200 },
  ]);

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
                Detailed Overview :
              </ModalHeader>
              <ModalBody>
                <div className="bg-white w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Quality</h2>
                        <p className="text-gray-600">{stock.quality}</p>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Quantity</h2>
                        <div className="flex gap-2">

                          <p className="text-gray-600">{stock.quantity} {stock.unit}</p>

                          <p className={`font-medium ${stock.quantity === 0 ? "text-red-600" : "text-green-600"}`}>
                            {stock.quantity === 0 ? "Out of Stock" : "In Stock"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Total Cost</h2>
                            <p className="text-gray-600">{stock.totalPrice} PKR</p>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Cost Per Unit</h2>
                            <p className="text-gray-600">{stock.costPerUnit} PKR</p>
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
                            <p className="text-gray-600">
                              {stock.totalPrice - stock.amountPaid} PKR
                            </p>
                          </div>
                        </div>
                      </div>

        
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h1 className="text-xl font-bold text-gray-800 mt-3">{stock.companyName}</h1>
                        <p className="text-gray-600">{stock.phone}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 border-l border-gray-200 pl-6">

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Issue Date</h2>
                        <p className="text-gray-600">{new Date(stock.issueDate).toLocaleDateString()}</p>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Status</h2>
                        <p className={`font-medium ${stock.amountPaid >= stock.totalPrice ? "text-green-600" : "text-red-600"}`}>
                          {stock.amountPaid >= stock.totalPrice ? "Clear" : "Pending Payment"}
                        </p>
                      </div>

                      {stock.deadline && (
                        <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                          <h2 className="text-lg font-semibold text-gray-700">Payment Deadline</h2>
                          <p className="text-red-600 font-semibold">{new Date(stock.deadline).toLocaleDateString()}</p>
                        </div>
                      )}

                      {/* Miscellaneous Charges Section */}
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Miscellaneous Charges</h2>
                        <div className="space-y-2">
                          {miscCharges.map((charge, index) => (
                            <div key={index} className="flex justify-between">
                              <p className="text-gray-600">{charge.description}</p>
                              <p className="text-gray-600">{charge.cost} PKR</p>
                            </div>
                          ))}
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
