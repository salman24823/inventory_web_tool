"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { PartyInput } from "./PartyInput";
import { OrderItemForm } from "./OrderItemForm";
import { PaymentDetails } from "./PaymentDetails";
import { ItemsTable } from "./ItemsTable";
import { useStore } from "zustand";

export default function Action({ fetchOrders }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [transactionType, setTransactionType] = useState("Cash");
  const [stockData, setStockData] = useState([]);
  const [partyNames, setPartyName] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    stockId: "",
    quantity: "",
    salePricePerUnit: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const { data: session } = useSession();
  const USER = session?.user?.name || "Demo User";

  useEffect(() => {
    setPartyName(["Usama Party", "Ali Party", "Hamza Party", "Khalid Party"]);
    setStockData([
      { _id: "1", quality: "22/45 Cotton", quantity: 100, unit: "Meter", costPerUnit: "500" },
      { _id: "2", quality: "12/55 PolyEster", quantity: 200, unit: "Meter", costPerUnit: "300" },
      { _id: "3", quality: "45:12 Khadar", quantity: 150, unit: "Meter", costPerUnit: "250" },
    ]);
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.salePricePerUnit),
    0
  );
  const pendingAmount = totalAmount - Number(amountPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (items.length === 0) {
      toast.error("Please add at least one item");
      setLoading(false);
      return;
    }

    const order = {
      name,
      phone,
      items: items.map((item) => {
        const stock = stockData.find((s) => s._id === item.stockId);
        return {
          stockId: item.stockId,
          stockName: stock?.quality || "",
          quantity: Number(item.quantity),
          salePricePerUnit: Number(item.salePricePerUnit),
          totalPrice: Number(item.quantity) * Number(item.salePricePerUnit),
        };
      }),
      totalAmount,
      amountPaid: Number(amountPaid),
      pendingAmount,
      issueDate,
      deadline,
      transactionType,
      createdBy: USER,
    };

    try {
      const response = await fetch("/api/handleOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error("Failed to create order");
      toast.success("Order added successfully!");
      await fetchOrders(); // Refresh orders list
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    } finally {
      setName("");
      setPhone("");
      setItems([]);
      setCurrentItem({
        stockId: "",
        quantity: "",
        salePricePerUnit: "",
      });
      setAmountPaid("");
      setIssueDate("");
      setDeadline("");
      setTransactionType("Cash");
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleEditItem = (index) => {
    setCurrentItem({ ...items[index] });
    setEditingIndex(index);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-blue-500 text-white font-semibold text-sm">
        Add New Order <Plus className="w-5 ml-2" />
      </Button>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="overflow-y-scroll h-[90vh]">
              <ModalHeader>New Order</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-5">
                    <PartyInput
                      name={name}
                      setName={setName}
                      phone={phone}
                      setPhone={setPhone}
                      issueDate={issueDate}
                      setIssueDate={setIssueDate}
                      deadline={deadline}
                      setDeadline={setDeadline}
                      transactionType={transactionType}
                      setTransactionType={setTransactionType}
                      partyNames={partyNames}
                    />
                    <div className="space-y-4">
                      <OrderItemForm
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        stockData={stockData}
                        items={items}
                        setItems={setItems}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                      />
                      <PaymentDetails
                        items={items}
                        amountPaid={amountPaid}
                        setAmountPaid={setAmountPaid}
                      />
                    </div>
                  </div>
                  {items.length > 0 && (
                    <ItemsTable
                      items={items}
                      stockData={stockData}
                      handleEditItem={handleEditItem}
                      handleRemoveItem={handleRemoveItem}
                    />
                  )}
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      disabled={loading || items.length === 0}
                    >
                      {loading ? "Processing..." : "Create Order"}
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}