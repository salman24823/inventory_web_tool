"use client";

import {
    Button,
    Input,
    RadioGroup,
    Radio
} from "@heroui/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Installments({ selectedOrder, setAmountPaid, installments, setInstallments }) {
    const [newInstallment, setNewInstallment] = useState({ amount: "", transactionType: "Cash", date: "" });
    const [loading, setLoading] = useState(false);

    async function addInstallment() {
        if (!newInstallment.amount || !newInstallment.date) {
            toast.error("Please fill all fields for the installment.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/handleInstallments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newInstallment, orderId: selectedOrder._id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add installment");
            }

            const data = await response.json();
            setInstallments(data.order.installments);
            setAmountPaid(data.order.amountPaid);
            setNewInstallment({ amount: "", transactionType: "Cash", date: "" });
            toast.success("Installment added successfully");
        } catch (error) {
            console.error("Error adding installment:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteInstallment(index) {
        if (index === 0) {
            toast.error("Cannot delete the first installment");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/handleInstallments", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: selectedOrder._id, installmentIndex: index }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete installment");
            }

            const data = await response.json();
            setInstallments(data.order.installments);
            setAmountPaid(data.order.amountPaid);
            toast.success("Installment deleted successfully");
        } catch (error) {
            console.error("Error deleting installment:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 mt-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">Installments History</h2>
                <div className="mt-6 grid max-md:grid-cols-2 grid-cols-4 gap-3">
                    {installments.length > 0 ? (
                        installments.map((installment, index) => (
                            <div
                                key={index}
                                className="py-3 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4"
                            >
                                <p className="text-sm text-gray-700">
                                    <strong>Amount:</strong> {installment.amount || "N/A"}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Transaction Type:</strong> {installment.transactionType || "N/A"}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Date:</strong> {installment.date || "N/A"}
                                </p>
                                {index !== 0 && (
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={() => deleteInstallment(index)}
                                        className="mt-2"
                                        disabled={loading}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic mt-4">No installments added yet.</p>
                    )}
                </div>
            </div>
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
    );
}