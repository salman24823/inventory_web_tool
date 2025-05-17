"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Tabs,
    Tab
} from "@heroui/react";
import { useEffect, useState } from "react";
import Invoice from "./Invoice";
import Installments from "./Installments";
import { toast } from "react-toastify";

export default function Detail({ isOpen, onOpenChange, selectedOrder }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [installments, setInstallments] = useState([]);
    const [displayInvoice, setDisplayInvoice] = useState(false);

    const pendingAmount = Number(totalAmount) - Number(amountPaid);

    useEffect(() => {
        if (selectedOrder) {
            setName(selectedOrder.name || "");
            setPhone(selectedOrder.phone || "");
            setItems(selectedOrder.items || []);
            setTotalAmount(selectedOrder.totalAmount || "");
            setAmountPaid(selectedOrder.amountPaid || "");
            setIssueDate(selectedOrder.issueDate
                ? new Date(selectedOrder.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : "");
            setDeadline(selectedOrder.deadline
                ? new Date(selectedOrder.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : "");
            const initialInstallments = selectedOrder.installments || [];
            if (selectedOrder.amountPaid && !initialInstallments.length) {
                setInstallments([{
                    amount: selectedOrder.amountPaid,
                    transactionType: selectedOrder.transactionType || "Cash",
                    date: selectedOrder.issueDate
                        ? new Date(selectedOrder.issueDate).toISOString().split("T")[0]
                        : ""
                }]);
            } else {
                setInstallments(initialInstallments);
            }
        }
    }, [selectedOrder]);

    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex bg-slate-50 flex-col gap-1">Order Details</ModalHeader>
                        <ModalBody>
                            <div className="bg-white w-full">
                                <Tabs color="white" aria-label="Options">
                                    <Tab key="orderDetails" title="Order Details">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-lg mt-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Customer Name</h2>
                                                    <p className="text-gray-800">{name || "N/A"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Phone</h2>
                                                    <p className="text-gray-800">{phone || "N/A"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Issue Date</h2>
                                                    <p className="text-gray-800">{issueDate || "N/A"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Deadline</h2>
                                                    <p className="text-gray-800">{deadline || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Total Amount</h2>
                                                    <p className="text-blue-600 font-semibold">{totalAmount || "0"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Amount Paid</h2>
                                                    <p className="text-green-600 font-semibold">{amountPaid || "0"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Pending Amount</h2>
                                                    <p className="text-gray-800">{pendingAmount || "0"}</p>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                                                    <h2 className="text-sm font-semibold text-gray-600">Invoice</h2>
                                                    <div className="py-3">
                                                        {displayInvoice ? (
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onPress={() => setDisplayInvoice(false)}
                                                                    className="mx-3"
                                                                    variant="bordered"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Invoice order={selectedOrder} />
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                onPress={() => setDisplayInvoice(true)}
                                                                size="sm"
                                                            >
                                                                Generate Invoice
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Items</h2>
                                            {items.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-700">
                                                        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3">Item Name</th>
                                                                <th scope="col" className="px-6 py-3">Quantity</th>
                                                                <th scope="col" className="px-6 py-3">Price/Unit</th>
                                                                <th scope="col" className="px-6 py-3">Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.map((item, index) => (
                                                                <tr key={item._id || index} className="bg-white border-b hover:bg-gray-50">
                                                                    <td className="px-6 py-4">{item.stockName || "N/A"}</td>
                                                                    <td className="px-6 py-4">{item.quantity || "N/A"}</td>
                                                                    <td className="px-6 py-4">{item.salePricePerUnit || "0"}</td>
                                                                    <td className="px-6 py-4">{item.totalPrice || "0"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic mt-4">No items available</p>
                                            )}
                                        </div>
                                    </Tab>
                                    <Tab key="installments" title="Installments">
                                        <Installments
                                            selectedOrder={selectedOrder}
                                            setAmountPaid={setAmountPaid}
                                            installments={installments}
                                            setInstallments={setInstallments}
                                        />
                                    </Tab>
                                </Tabs>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}