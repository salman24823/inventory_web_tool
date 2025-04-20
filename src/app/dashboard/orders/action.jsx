"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  RadioGroup,
  Radio,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Action() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [phone, setPhone] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [transactionType, setTransactionType] = useState("Cash");
  const [stockData, setStockData] = useState([]);
  const [partyNames, setPartyName] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Order items state
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    stockId: "",
    quantity: "",
    salePricePerUnit: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const { data: session } = useSession();
  const USER = session?.user?.name || "Demo User";

  // Sample data
  useEffect(() => {
    setPartyName(["Usama Party", "Ali Party", "Hamza Party", "Khalid Party"]);
    setStockData([
      { _id: "1", quality: "22/45 Cotton", quantity: 100, unit: "Meter", costPerUnit: "500" },
      { _id: "2", quality: "12/55 PolyEster", quantity: 200, unit: "Meter", costPerUnit: "300" },
      { _id: "3", quality: "45:12 Khadar", quantity: 150, unit: "Meter", costPerUnit: "250" },
    ]);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsDropdownOpen(true);
    setSuggestions(
      partyNames.filter((party) => party.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSuggestionClick = (party) => {
    setName(party);
    setIsDropdownOpen(false);
  };

  const selectedStock = currentItem.stockId 
    ? stockData.find((s) => s._id === currentItem.stockId)
    : null;

  const parsedQuantity = Number(currentItem.quantity);
  const parsedSalePricePerUnit = Number(currentItem.salePricePerUnit);
  const parsedTotalPrice = parsedQuantity * parsedSalePricePerUnit;
  const profitPerUnit = selectedStock && parsedSalePricePerUnit
    ? (parsedSalePricePerUnit - Number(selectedStock.costPerUnit)).toFixed(2)
    : "N/A";

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.salePricePerUnit)), 0);
  const [amountPaid, setAmountPaid] = useState("");
  const pendingAmount = totalAmount - Number(amountPaid);

  const handleAddItem = () => {
    if (!currentItem.stockId || !currentItem.quantity || !currentItem.salePricePerUnit) {
      toast.error("Please fill all item fields");
      return;
    }

    if (editingIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[editingIndex] = { ...currentItem };
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      // Add new item
      setItems([...items, { ...currentItem }]);
    }

    // Reset current item
    setCurrentItem({
      stockId: "",
      quantity: "",
      salePricePerUnit: "",
    });
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

  const handleSubmit = (e) => {
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
      items: items.map(item => {
        const stock = stockData.find(s => s._id === item.stockId);
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

    console.log("Order Submitted:", order);
    toast.success("Order added successfully!");

    // Reset form
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
                    <div className="space-y-4">
                      <div className="relative" ref={dropdownRef}>
                        <Input
                          label="Party Name"
                          value={name}
                          onChange={handleChange}
                          onFocus={() => setIsDropdownOpen(true)}
                          required
                        />
                        {isDropdownOpen && suggestions.length > 0 && (
                          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                            {suggestions.map((party, index) => (
                              <li
                                key={index}
                                onClick={() => handleSuggestionClick(party)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {party}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <Input
                        label="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />

                      <Input
                        label="Issue Date"
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        required
                      />

                      <Input
                        label="Deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />

                      <RadioGroup
                        orientation="horizontal"
                        value={transactionType}
                        onValueChange={setTransactionType}
                        label="Transaction Type"
                      >
                        <Radio value="Cash">Cash</Radio>
                        <Radio value="Bank">Bank</Radio>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Add Items</h3>
                        
                        <Select
                          label={currentItem.stockId ? `Selected: ${selectedStock?.quality}` : "Select Stock"}
                          value={currentItem.stockId}
                          onChange={(e) => setCurrentItem({...currentItem, stockId: e.target.value})}
                        >
                          {stockData.map((stock) => (
                            <SelectItem key={stock._id} value={stock._id}>
                              {stock.quality} (Available: {stock.quantity})
                            </SelectItem>
                          ))}
                        </Select>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <Input
                            label="Quantity"
                            type="number"
                            value={currentItem.quantity}
                            min={1}
                            onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                          />

                          <Input
                            label="Sale Price / Unit"
                            type="number"
                            value={currentItem.salePricePerUnit}
                            onChange={(e) => setCurrentItem({...currentItem, salePricePerUnit: e.target.value})}
                          />
                        </div>

                        {selectedStock && (
                          <div className={`mt-3 border border-gray-200 py-4 rounded-lg px-5 ${
                            currentItem.quantity && currentItem.salePricePerUnit
                              ? profitPerUnit > 0
                                ? "bg-green-200"
                                : "bg-red-200"
                              : "bg-gray-100"
                          }`}>
                            <div className="grid grid-cols-2">
                              {/* <p>
                                <span className="font-semibold">Cost / Unit: </span>
                                {selectedStock.costPerUnit}
                              </p> */}
                              <p>
                                <span className="font-semibold">Profit / Unit: </span>
                                {profitPerUnit}
                              </p>
                            </div>
                            <p className="mt-2">
                              <span className="font-semibold">Available: </span>
                              {selectedStock.quantity} {selectedStock.unit}
                            </p>
                            {currentItem.quantity && (
                              <p className="mt-1">
                                <span className="font-semibold">Remaining: </span>
                                {selectedStock.quantity - Number(currentItem.quantity)} {selectedStock.unit}
                              </p>
                            )}
                          </div>
                        )}

                        <Button 
                          className="mt-3 w-full" 
                          color="primary" 
                          onPress={handleAddItem}
                          disabled={!currentItem.stockId || !currentItem.quantity || !currentItem.salePricePerUnit}
                        >
                          {editingIndex !== null ? "Update Item" : "Add Item"}
                        </Button>
                      </div>

                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Payment Details</h3>
                        
                        <Input
                          label="Amount Received"
                          type="number"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          required
                        />

                        <div className="flex justify-between border border-gray-200 py-4 rounded-lg px-5 bg-gray-100 mt-3">
                          <div>
                            <p className="font-semibold">Pending:</p>
                            <p>{!isNaN(pendingAmount) ? pendingAmount.toFixed(2) : "0.00"}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Total:</p>
                            <p>{totalAmount.toFixed(2) || "0.00"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  {items.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <Table aria-label="Order items table">
                        <TableHeader>
                          <TableColumn>STOCK</TableColumn>
                          <TableColumn>QUANTITY</TableColumn>
                          <TableColumn>PRICE/UNIT</TableColumn>
                          <TableColumn>TOTAL</TableColumn>
                          <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => {
                            const stock = stockData.find(s => s._id === item.stockId);
                            const itemTotal = Number(item.quantity) * Number(item.salePricePerUnit);
                            
                            return (
                              <TableRow key={index}>
                                <TableCell>{stock?.quality || "N/A"}</TableCell>
                                <TableCell>{item.quantity} {stock?.unit}</TableCell>
                                <TableCell>{item.salePricePerUnit}</TableCell>
                                <TableCell>{itemTotal.toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Tooltip content="Edit">
                                      <Button isIconOnly size="sm" variant="light" onPress={() => handleEditItem(index)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="Remove">
                                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleRemoveItem(index)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" disabled={loading || items.length === 0}>
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