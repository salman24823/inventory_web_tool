"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { PartyInput } from "./PartyInput";
import { OrderItemForm } from "./OrderItemForm";
import { PaymentDetails } from "./PaymentDetails";
import { ItemsTable } from "./ItemsTable";
import useGlobalStore from "@/app/store/globalstore";

export default function Action({ fetchOrders }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [transactionType, setTransactionType] = useState("Cash");
  const [partyNames, setPartyNames] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    stockId: "",
    quantity: "",
    salePricePerUnit: "",
  });

  const { stockData } = useGlobalStore();

  const [editingIndex, setEditingIndex] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");

  const { data: session } = useSession();
  const USER = session?.user?.name ? encodeURIComponent(session.user.name) : "Demo User";

  useEffect(() => {
    const fetchPartyNames = async () => {
      setPartyNames(["Usama Party", "Ali Party", "Hamza Party", "Khalid Party"]);
    };
    fetchPartyNames();
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.salePricePerUnit),
    0
  );
  const pendingAmount = totalAmount - Number(amountPaid);

  const resetForm = useCallback(() => {
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
  }, []);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      // Validate required fields
      if (!name || !phone || !issueDate) {
        toast.error("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (items.length === 0) {
        toast.error("Please add at least one item");
        setLoading(false);
        return;
      }

      // Validate items
      for (const item of items) {
        if (!item.stockId || !item.quantity || !item.salePricePerUnit) {
          toast.error("Invalid item data");
          setLoading(false);
          return;
        }
      }

      const order = {
        name,
        phone,
        items: items.map((item) => {
          const stock = stockData.find((s) => s._id === item.stockId);
          if (!stock) {
            throw new Error(`Stock not found for ID: ${item.stockId}`);
          }
          return {
            stockId: item.stockId,
            stockName: stock.clothQuality || "",
            quantity: Number(item.quantity),
            salePricePerUnit: Number(item.salePricePerUnit),
            totalPrice: Number(item.quantity) * Number(item.salePricePerUnit),
          };
        }),
        totalAmount: Number(totalAmount),
        amountPaid: Number(amountPaid) || 0,
        pendingAmount: Number(pendingAmount),
        issueDate: new Date(issueDate).toISOString(),
        deadline: deadline ? new Date(deadline).toISOString() : null,
        transactionType,
        createdBy: USER,
      };

      try {
        // Create order
        const response = await fetch("/api/handleOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        const orderData = await response.json();
        if (!response.ok) {
          throw new Error(orderData.message || `HTTP error! status: ${response.status}`);
        }

        // Handle customer (create or update)
        try {
          const customerResponse = await fetch("/api/handleCustomer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              phone,
              amountDealing: Number(totalAmount),
              amountPending: Number(pendingAmount), // Fixed property name
              issueDate,
            }),
          });

          const customerData = await customerResponse.json();
          if (!customerResponse.ok) {
            throw new Error(customerData.message || "Failed to process customer");
          }

          toast.success("Order and customer processed successfully!");
        } catch (customerError) {
          toast.error(`Failed to process customer: ${customerError.message}`);
          console.error("Customer processing error:", customerError);
        }

        await fetchOrders();
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast.error(`Failed to create order: ${error.message}`);
        console.error("Order creation error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      name,
      phone,
      issueDate,
      items,
      totalAmount,
      amountPaid,
      pendingAmount,
      deadline,
      transactionType,
      USER,
      fetchOrders,
      onOpenChange,
      stockData,
      resetForm,
    ]
  );

  const handleRemoveItem = useCallback((index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      <Button onPress={onOpen} className="bg-blue-500 text-white font-semibold text-sm">
        Add New Order <Plus className="w-5 ml-2" />
      </Button>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New Order</ModalHeader>
              <ModalBody className="overflow-y-auto max-h-[80vh]">
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}