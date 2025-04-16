import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  RadioGroup, Radio
} from "@heroui/react";
import { toast } from "react-toastify";

export default function Action({ fetchSpendings, isOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [Method, setMethod] = React.useState("bank");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/handleSpendings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, amount, date , Method }),
      });

      if (!response.ok) {
        throw new Error("Failed to add spending");
      }

      toast.success("Spending added successfully");
      fetchSpendings();
      onOpenChange(false);
      setDescription("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error(error);
      toast.error("Error adding spending");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New Spending</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <Input
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <RadioGroup
                    label="Pay Mathod"
                    value={Method}
                    onValueChange={setMethod}
                  >
                    <Radio value="bank">Bank</Radio>
                    <Radio value="cash">Cash</Radio>
                  </RadioGroup>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add"}
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
