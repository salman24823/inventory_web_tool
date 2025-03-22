"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Tabs,
    Tab,
    Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function Detail({ isOpen, onOpenChange, selectedOrder }) {
    const [editing, setEditing] = useState(false);
    const [orderName, setOrderName] = useState(selectedOrder?.orderName || "");
    const [phone, setPhone] = useState(selectedOrder?.phone || "");
    const [quantity, setQuantity] = useState(selectedOrder?.quantity || "");
    const [quality, setQuality] = useState(selectedOrder?.quality || "");
    const [totalPrice, setTotalPrice] = useState(selectedOrder?.totalPrice || "");
    const [amountPaid, setAmountPaid] = useState(selectedOrder?.amountPaid || "");
    const [issueDate, setIssueDate] = useState(selectedOrder?.issueDate || "");
    const [deadline, setDeadline] = useState(selectedOrder?.deadline || "");
    const [installments, setInstallments] = useState(selectedOrder?.installments || []);
    const [newInstallment, setNewInstallment] = useState({ amount: "", transactionType: "Cash", date: "" });

    // Calculate pending amount
    const pendingAmount = Number(totalPrice) - Number(amountPaid);

    // Update state when selectedOrder changes
    useEffect(() => {
        if (selectedOrder) {
            setOrderName(selectedOrder.orderName || "");
            setPhone(selectedOrder.phone || "");
            setQuantity(selectedOrder.quantity || "");
            setQuality(selectedOrder.quality || "");
            setTotalPrice(selectedOrder.totalPrice || "");
            setAmountPaid(selectedOrder.amountPaid || "");
            setIssueDate(selectedOrder.issueDate || "");
            setDeadline(selectedOrder.deadline || "");
            setInstallments(selectedOrder.installments || []);
        }
    }, [selectedOrder]);

    // Function to handle confirmation and update the order
    async function handleConfirm() {
        const updatedOrder = {
            ...selectedOrder,
            orderName,
            phone,
            quantity,
            quality,
            totalPrice,
            amountPaid,
            issueDate,
            deadline,
            installments,
        };

        console.log("Updated Order:", updatedOrder);
        // Add your logic to save the updated order (e.g., API call)
        setEditing(false); // Exit editing mode
    }

    // Function to add a new installment
    function addInstallment() {
        if (newInstallment.amount && newInstallment.date) {
            const updatedInstallments = [...installments, newInstallment];
            setInstallments(updatedInstallments);
            setAmountPaid((prev) => Number(prev) + Number(newInstallment.amount)); // Update amount paid
            setNewInstallment({ amount: "", transactionType: "Cash", date: "" }); // Reset form
        } else {
            alert("Please fill all fields for the installment.");
        }
    }

    return (
        <>
            <Modal size="6xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Detailed Overview</ModalHeader>
                            <ModalBody>
                                <div className="bg-white w-full">
                                    <Tabs color="white" aria-label="Options">
                                        <Tab key="orderDetails" title="Order Details">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Order Name</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={orderName}
                                                                onChange={(e) => setOrderName(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{orderName}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Phone</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{phone}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Quantity</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={quantity}
                                                                onChange={(e) => setQuantity(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{quantity}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Quality</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={quality}
                                                                onChange={(e) => setQuality(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{quality}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Total Price</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={totalPrice}
                                                                onChange={(e) => setTotalPrice(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{totalPrice}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-4">
                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Amount Paid</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={amountPaid}
                                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{amountPaid}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Pending Amount</h2>
                                                        <p className="text-gray-800 mt-1">{pendingAmount}</p>
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Issue Date</h2>
                                                        {editing ? (
                                                            <Input
                                                                type="date"
                                                                size="sm"
                                                                className="mt-1"
                                                                value={issueDate}
                                                                onChange={(e) => setIssueDate(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{issueDate}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Deadline</h2>
                                                        {editing ? (
                                                            <Input
                                                                type="date"
                                                                size="sm"
                                                                className="mt-1"
                                                                value={deadline}
                                                                onChange={(e) => setDeadline(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{deadline}</p>
                                                        )}
                                                    </div>

                                                    {/* <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">Order Image</h2>
                                                        <img src={selectedOrder?.orderImage} alt="Order" className="w-20 h-auto rounded-lg mt-1" />
                                                    </div>

                                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                        <h2 className="text-sm font-semibold text-gray-600">User Image</h2>
                                                        <img src={selectedOrder?.userImage} alt="User" className="w-20 h-auto rounded-lg mt-1" />
                                                    </div> */}
                                                </div>
                                            </div>
                                        </Tab>

                                        <Tab key="installments" title="Installments">
                                            <div className="space-y-4 mt-6">
                                                {/* Installments List */}
                                                <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                    <h2 className="text-sm font-semibold text-gray-600">Installments History</h2>
                                                    {installments.map((installment, index) => (
                                                        <div key={index} className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                                                            <p className="text-sm text-gray-700"><strong>Amount:</strong> {installment.amount}</p>
                                                            <p className="text-sm text-gray-700"><strong>Transaction Type:</strong> {installment.transactionType}</p>
                                                            <p className="text-sm text-gray-700"><strong>Date:</strong> {installment.date}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add New Installment Form */}
                                                <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
                                                    <h2 className="text-sm font-semibold text-gray-600">Add New Installment</h2>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            placeholder="Amount"
                                                            value={newInstallment.amount}
                                                            onChange={(e) => setNewInstallment({ ...newInstallment, amount: e.target.value })}
                                                        />
                                                        <Input
                                                            type="date"
                                                            size="sm"
                                                            placeholder="Date"
                                                            value={newInstallment.date}
                                                            onChange={(e) => setNewInstallment({ ...newInstallment, date: e.target.value })}
                                                        />
                                                        <Button size="sm" onPress={addInstallment} className="w-full">
                                                            Add Installment
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {editing ? (
                                    <Button color="danger" variant="light" onPress={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                )}
                                {editing ? (
                                    <Button color="primary" onPress={handleConfirm}>
                                        Confirm
                                    </Button>
                                ) : (
                                    <Button color="primary" onPress={() => setEditing(true)}>
                                        Edit
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}