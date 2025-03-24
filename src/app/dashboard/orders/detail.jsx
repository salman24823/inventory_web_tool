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
    RadioGroup, Radio

} from "@heroui/react";
import { useEffect, useState } from "react";
import Invoice from "./Invoice";
import { toast } from "react-toastify";

export default function Detail({ isOpen, onOpenChange, selectedOrder, fetchOrders }) {
    const [editing, setEditing] = useState(false);
    const [orderName, setOrderName] = useState(selectedOrder?.orderName || "");
    const [phone, setPhone] = useState(selectedOrder?.phone || "");
    const [quantity, setQuantity] = useState(selectedOrder?.quantity || "");
    const [quality, setQuality] = useState(selectedOrder?.quality || "");
    const [totalPrice, setTotalPrice] = useState(selectedOrder?.totalPrice || "");
    const [amountPaid, setAmountPaid] = useState(selectedOrder?.amountPaid || "");
    const [issueDate, setIssueDate] = useState(selectedOrder?.issueDate || "");
    const [displayInvoice, setDisplayInvoice] = useState(false);
    const [deadline, setDeadline] = useState(selectedOrder?.deadline || "");
    const [installments, setInstallments] = useState(selectedOrder?.installments || []);
    const [newInstallment, setNewInstallment] = useState({ amount: "", transactionType: "Cash", date: "" });

    const [newQTY, setNewQTY] = useState(quantity);
    const [loading, setLoading] = useState(false);

  

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
            newQTY,
            quality,
            totalPrice,
            amountPaid,
            issueDate,
            deadline,
            installments,
        };

        try {
            const response = await fetch("/api/handleOrder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updatedOrder }),
            });

            if (!response.ok) {
                toast.error(response.message);
            }

            toast.success("Success! Order updated")
            setEditing(false); // Exit editing mode

            fetchOrders()

            onOpenChange(false); // Close the modal after success

        } catch (error) {
            console.error("Error updating order:", error);
            setEditing(false); // Exit editing mode
        }

    }

    // Function to add a new installment
    async function addInstallment() {

        setLoading(true)

        if (newInstallment.amount && newInstallment.date) {
            const updatedInstallments = [...installments, newInstallment];

            try {

                const response = await fetch("/api/handleInstallments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updatedInstallments, selectedOrder }),
                });

                setInstallments(updatedInstallments);
                setAmountPaid((prev) => Number(prev) + Number(newInstallment.amount)); // Update amount paid
                setNewInstallment({ amount: "", transactionType: "Cash", date: "" }); // Reset form
                setLoading(false)


            } catch (error) {

                console.log(error)
                setLoading(false)


            }

        } else {

            toast.error("Please fill all fields for the installment.");
            setLoading(false)

        }
    }

    return (
        <>
            <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex bg-slate-50 flex-col gap-1">Detailed Overview</ModalHeader>
                            <ModalBody>
                                <div className="bg-white w-full">
                                    <Tabs color="white" aria-label="Options">
                                        <Tab key="orderDetails" title="Order Details">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-lg mt-6">

                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center border-b border-gray-200">
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

                                                    <div className="flex justify-between items-center border-b border-gray-200">
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

                                                    <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Quantity</h2>


                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={newQTY}
                                                                onChange={(e) => setNewQTY(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-gray-800 mt-1">{quantity}</p>
                                                        )}


                                                    </div>

                                                    <div className="flex justify-between items-center border-b border-gray-200">
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

                                                    <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Total Price</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={totalPrice}
                                                                onChange={(e) => setTotalPrice(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-blue-600 font-semibold mt-1">{totalPrice}</p>
                                                        )}
                                                    </div>

                                                    {/* <>
                                                        <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Order Status</h2>

                                                        <select
                                                            value={status}
                                                            onChange={handleStatusChange}
                                                            className={`block w-32 px-4 appearance-none cursor-pointer py-1 font-semibold text-sm mb-2 text-gray-700 ${bgColor} border border-gray-300 rounded-md shadow-sm focus:outline-none transition duration-150 ease-in-out`}
                                                        >
                                                            <option className="!bg-white" value="completed">Completed</option>
                                                            <option className="!bg-white" value="pending">Pending</option>
                                                            <option className="!bg-white" value="cancel">Canceled</option>
                                                            </select>
                                                            
                                                            </div>
                                                    </> */}

                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Amount Paid</h2>
                                                        {editing ? (
                                                            <Input
                                                                size="sm"
                                                                className="mt-1"
                                                                value={amountPaid}
                                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-green-600 font-semibold mt-1">{amountPaid}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Pending Amount</h2>
                                                        <p className="text-gray-800 mt-1">{pendingAmount}</p>
                                                    </div>

                                                    <div className="flex justify-between items-center border-b border-gray-200">
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

                                                    <div className="flex justify-between items-center border-b border-gray-200">
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

                                                    <div className="flex justify-between items-center border-b border-gray-200">
                                                        <h2 className="text-sm font-semibold text-gray-600">Invoice</h2>
                                                        <div className="py-3">
                                                            {displayInvoice ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Button size="sm" onPress={() => setDisplayInvoice(false)} className="mx-3" variant="bordered">
                                                                        Cancel
                                                                    </Button>
                                                                    <Invoice order={selectedOrder} />
                                                                </div>
                                                            ) : (
                                                                <Button onPress={() => setDisplayInvoice(true)} size="sm">
                                                                    Generate Invoice
                                                                </Button>
                                                            )}
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        </Tab>

                                        <Tab key="installments" title="Installments">


                                            <div className="space-y-8 mt-8">
                                                {/* Installments History */}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Installments History</h2>
                                                    <div className="mt-6 grid max-md:grid-cols-2 grid-cols-4 gap-3">
                                                        {installments.length > 0 ? (
                                                            installments.map((installment, index) => (
                                                                <div key={index} className="py-3 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4">
                                                                    <p className="text-sm text-gray-700"><strong>Amount:</strong> {installment.amount}</p>
                                                                    <p className="text-sm text-gray-700"><strong>Transaction Type:</strong> {installment.transactionType}</p>
                                                                    <p className="text-sm text-gray-700"><strong>Date:</strong> {installment.date}</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500 italic mt-4">No installments added yet.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Add New Installment */}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Add New Installment</h2>
                                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            placeholder="Amount"
                                                            value={newInstallment.amount}
                                                            onChange={(e) => setNewInstallment({ ...newInstallment, amount: e.target.value })}
                                                            className="border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200 rounded-md"
                                                        />
                                                        <Input
                                                            type="date"
                                                            size="sm"
                                                            value={newInstallment.date}
                                                            onChange={(e) => setNewInstallment({ ...newInstallment, date: e.target.value })}
                                                            className="border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200 rounded-md"
                                                        />
                                                        <div>
                                                            <RadioGroup
                                                                orientation="horizontal"
                                                                value={newInstallment.transactionType}
                                                                onValueChange={(value) => setNewInstallment({ ...newInstallment, transactionType: value })}
                                                                label="Transaction Type"
                                                            >
                                                                <Radio value="Cash">Cash</Radio>
                                                                <Radio value="Bank">Bank</Radio>
                                                                <Radio value="Wallet">Wallet</Radio>
                                                            </RadioGroup>
                                                        </div>
                                                        <Button
                                                            isLoading={loading}
                                                            size="md"
                                                            onPress={addInstallment}
                                                            className="col-span-full bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200 rounded-md py-2"
                                                        >
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