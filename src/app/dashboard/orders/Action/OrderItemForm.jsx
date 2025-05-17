"use client";

import React, { useEffect } from "react";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { toast } from "react-toastify";
import useGlobalStore from "@/app/store/globalstore";

export function OrderItemForm({
  currentItem,
  setCurrentItem,
  items,
  setItems,
  editingIndex,
  setEditingIndex,
}) {
  const { fetchStock, stockData } = useGlobalStore();

  const selectedStock = currentItem.stockId
    ? stockData.find((s) => s._id === currentItem.stockId)
    : null;

  const parsedQuantity = Number(currentItem.quantity);
  const parsedSalePricePerUnit = Number(currentItem.salePricePerUnit);
  const profitPerUnit = selectedStock && parsedSalePricePerUnit
    ? (parsedSalePricePerUnit - Number(selectedStock.baseCostPerUnit)).toFixed(2)
    : "N/A";
  const totalProfit = profitPerUnit !== "N/A" && parsedQuantity
    ? (profitPerUnit * parsedQuantity).toFixed(2)
    : "N/A";

  const handleAddItem = () => {
    if (!currentItem.stockId || !currentItem.quantity || !currentItem.salePricePerUnit) {
      toast.error("Please fill all item fields");
      return;
    }
    const quantity = Number(currentItem.quantity);
    if (quantity > selectedStock.stockQuantity) {
      toast.error(`Quantity cannot exceed available stock: ${selectedStock.stockQuantity}`);
      return;
    }
    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = { ...currentItem };
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      setItems([...items, { ...currentItem }]);
    }
    setCurrentItem({
      stockId: "",
      quantity: "",
      salePricePerUnit: "",
    });
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-semibold mb-3" onClick={()=> console.log(stockData,"stockData") }>Add Items</h3>
      
      <Select
        label={currentItem.stockId ? `Selected: ${selectedStock?.clothQuality}` : "Select Stock"}
        value={currentItem.stockId}
        onChange={(e) => setCurrentItem({ ...currentItem, stockId: e.target.value })}
      >
        {stockData.map((stock) => (
          <SelectItem key={stock._id} value={stock._id}>
            {stock.clothQuality} (Available: {stock.stockQuantity} {stock.unitType})
          </SelectItem>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Input
          label="Quantity"
          type="number"
          value={currentItem.quantity}
          min={1}
          onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
        />
        <Input
          label="Sale Price / Unit"
          type="number"
          value={currentItem.salePricePerUnit}
          onChange={(e) => setCurrentItem({ ...currentItem, salePricePerUnit: e.target.value })}
        />
      </div>

      {selectedStock && (
        <div
          className={`mt-3 border border-gray-200 py-4 rounded-lg px-5 ${
            currentItem.quantity && currentItem.salePricePerUnit
              ? profitPerUnit > 0
                ? "bg-green-200"
                : "bg-red-200"
              : "bg-gray-100"
          }`}
        >
          <div className="grid grid-cols-2">
            <p>
              <span className="font-semibold">Profit / Unit: </span>
              {profitPerUnit}
            </p>
            <p>
              <span className="font-semibold">Total Profit: </span>
              {totalProfit}
            </p>
          </div>
          <p className="mt-2">
            <span className="font-semibold">Available: </span>
            {selectedStock.stockQuantity} {selectedStock.unitType || "Unknown Unit"}
          </p>
          {currentItem.quantity && (
            <p className="mt-1">
              <span className="font-semibold">Remaining: </span>
              {selectedStock.stockQuantity - Number(currentItem.quantity)} {selectedStock.unitType || "Unknown Unit"}
            </p>
          )}
          {profitPerUnit < 0 && (
            <p className="mt-1 text-red-600">
              Warning: Negative profit per unit
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
  );
}