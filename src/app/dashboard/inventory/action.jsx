"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function Action({ factories, poNumbers }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Main stock fields
  const [factoryName, setFactoryName] = useState("");
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [unitType, setUnitType] = useState("");
  const [clothQuality, setClothQuality] = useState("");
  const [grayClothQuantity, setGrayClothQuantity] = useState("");
  const [scratchQuantity, setScratchQuantity] = useState("");
  const [baseCostPerUnit, setBaseCostPerUnit] = useState("");
  const [factoryPaymentPerUnit, setFactoryPaymentPerUnit] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Per Unit Charges
  const [perUnitCharges, setPerUnitCharges] = useState([]);
  const [perUnitDescription, setPerUnitDescription] = useState("");
  const [perUnitCost, setPerUnitCost] = useState("");

  // Fixed Charges
  const [fixedCharges, setFixedCharges] = useState([]);
  const [fixedDescription, setFixedDescription] = useState("");
  const [fixedCost, setFixedCost] = useState("");

  // Transport Expenses
  const [transportExpenses, setTransportExpenses] = useState("");

  // Calculations
  const netBaseCost = Number(grayClothQuantity || 0) * Number(baseCostPerUnit || 0);
  const totalPerUnitCost = perUnitCharges.reduce(
    (sum, e) => sum + Number(e.totalCost || 0),
    0
  );
  const totalFixedCost = fixedCharges.reduce(
    (sum, e) => sum + Number(e.totalCost || 0),
    0
  );
  const totalMiscellaneousCost = totalPerUnitCost + totalFixedCost;
  const totalCost = netBaseCost + totalMiscellaneousCost;
  const pendingPayment = totalCost - Number(amountPaid || 0);

  const addPerUnitCharge = () => {
    if (!perUnitDescription || !perUnitCost || !grayClothQuantity) return;

    const costPerUnit = Number(perUnitCost);
    const quantity = Number(grayClothQuantity);
    setPerUnitCharges((prev) => [
      ...prev,
      {
        desc: perUnitDescription,
        costPerUnit,
        totalCost: costPerUnit * quantity,
      },
    ]);
    setPerUnitDescription("");
    setPerUnitCost("");
  };

  const addFixedCharge = () => {
    if (!fixedDescription || !fixedCost) return;

    const totalCost = Number(fixedCost);
    setFixedCharges((prev) => [
      ...prev,
      {
        desc: fixedDescription,
        totalCost,
      },
    ]);
    setFixedDescription("");
    setFixedCost("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const stockData = {
      factoryName,
      purchaseOrderNumber,
      unitType,
      clothQuality,
      grayClothQuantity,
      scratchQuantity,
      baseCostPerUnit,
      factoryPaymentPerUnit,
      transportExpenses,
      amountPaid,
      pendingPayment,
      issueDate,
      deadlineDate,
      perUnitCharges,
      fixedCharges,
    };

    console.log("Stock Record Submitted:", stockData);
    toast.success("Stock entry added successfully!");
    setLoading(false);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-blue-500 text-white font-semibold text-sm"
      >
        Add New Stock <Plus className="w-5 ml-1" />
      </Button>

      <Modal
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
        className="h-[85vh]"
      >
        <ModalContent className="overflow-y-scroll">
          {(onClose) => (
            <>
              <ModalHeader>Add New Stock Entry</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Factory */}
                  <Select
                    label="Factory"
                    placeholder="Choose a factory"
                    selectedKeys={[factoryName]}
                    onSelectionChange={(key) => setFactoryName(key.currentKey)}
                  >
                    {factories.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* PO */}
                  <Select
                    label="Purchase Order"
                    placeholder="Choose PO"
                    selectedKeys={[purchaseOrderNumber]}
                    onSelectionChange={(key) =>
                      setPurchaseOrderNumber(key.currentKey)
                    }
                  >
                    {poNumbers?.map((po) => (
                      <SelectItem key={po} value={po}>
                        {po}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Unit Type */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="w-full" variant="bordered">
                        {unitType || "Select Unit Type"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {["Meter", "Yard", "Kg", "Pcs"].map((u) => (
                        <DropdownItem key={u} onPress={() => setUnitType(u)}>
                          {u}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>

                  <Input
                    label="Cloth Quality"
                    value={clothQuality}
                    onChange={(e) => setClothQuality(e.target.value)}
                    required
                  />
                  <Input
                    label="Gray Cloth Quantity"
                    value={grayClothQuantity}
                    onChange={(e) => setGrayClothQuantity(e.target.value)}
                    required
                  />
                  <Input
                    label="Scratch Quantity"
                    value={scratchQuantity}
                    onChange={(e) => setScratchQuantity(e.target.value)}
                    required
                  />
                  <Input
                    label="Base Cost Per Unit"
                    value={baseCostPerUnit}
                    onChange={(e) => setBaseCostPerUnit(e.target.value)}
                    required
                  />
                  <Input
                    label="Factory Payment Per Unit"
                    value={factoryPaymentPerUnit}
                    onChange={(e) => setFactoryPaymentPerUnit(e.target.value)}
                    required
                  />
                  <Input
                    label="Total Transport Expenses"
                    value={transportExpenses}
                    onChange={(e) => setTransportExpenses(e.target.value)}
                    required
                  />

                  {/* Per Unit Charges Section */}
                  <div className="border p-4 rounded-md bg-gray-50 space-y-2">
                    <p className="font-semibold text-sm">Per Unit Charges</p>
                    {perUnitCharges.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm flex justify-between text-gray-700"
                      >
                        <span>{item.desc}</span>
                        <span>
                          Rs. {item.costPerUnit} x {grayClothQuantity} = {item.totalCost}
                        </span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 mt-2">
                      <Input
                        placeholder="Description"
                        value={perUnitDescription}
                        onChange={(e) => setPerUnitDescription(e.target.value)}
                      />
                      <Input
                        placeholder="Cost Per Unit"
                        type="number"
                        value={perUnitCost}
                        onChange={(e) => setPerUnitCost(e.target.value)}
                      />
                      <Button size="sm" onPress={addPerUnitCharge}>
                        Add Per Unit Charge
                      </Button>
                    </div>
                  </div>

                  {/* Fixed Charges Section */}
                  <div className="border p-4 rounded-md bg-gray-50 space-y-2">
                    <p className="font-semibold text-sm">Fixed Charges</p>
                    {fixedCharges.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm flex justify-between text-gray-700"
                      >
                        <span>{item.desc}</span>
                        <span>Rs. {item.totalCost}</span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 mt-2">
                      <Input
                        placeholder="Description"
                        value={fixedDescription}
                        onChange={(e) => setFixedDescription(e.target.value)}
                      />
                      <Input
                        placeholder="Total Cost"
                        type="number"
                        value={fixedCost}
                        onChange={(e) => setFixedCost(e.target.value)}
                      />
                      <Button size="sm" onPress={addFixedCharge}>
                        Add Fixed Charge
                      </Button>
                    </div>
                  </div>

                  <Input
                    label="Amount Paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    required
                  />

                  {/* Totals */}
                  <div className="bg-gray-100 p-3 rounded-md space-y-1 text-sm border">
                    <p>
                      Net Base Cost:{" "}
                      <strong>Rs. {netBaseCost.toFixed(2)}</strong>
                    </p>
                    <p>
                      Total Per Unit Charges:{" "}
                      <strong>Rs. {totalPerUnitCost.toFixed(2)}</strong>
                    </p>
                    <p>
                      Total Fixed Charges:{" "}
                      <strong>Rs. {totalFixedCost.toFixed(2)}</strong>
                    </p>
                    <p>
                      Total Miscellaneous:{" "}
                      <strong>Rs. {totalMiscellaneousCost.toFixed(2)}</strong>
                    </p>
                    <p>
                      Total Pending:{" "}
                      <strong>Rs. {pendingPayment.toFixed(2)}</strong>
                    </p>
                  </div>

                  {/* Dates */}
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
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                  />

                  <ModalFooter className="px-0">
                    <Button variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? "Adding..." : "Add Stock"}
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