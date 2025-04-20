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

export default function Action() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Main stock fields
  const [factory, setFactory] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [unitType, setUnitType] = useState("");
  const [qualityType, setQualityType] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [scratchQty, setScratchQty] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [payPerUnit, setPayPerUnit] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  // Miscellaneous Charges
  const [miscCharges, setMiscCharges] = useState([]);
  const [miscDesc, setMiscDesc] = useState("");
  const [miscCostPerUnit, setMiscCostPerUnit] = useState("");
  const [transportExpanses, setTransportExpanses] = useState("");


  const factories = [
    "Faisalabad Grey Mills",
    "Punjab Textiles",
    "Al-Noor Weaving Factory",
    "Karachi WeaveTech",
    "Lahore GreyCloth Co.",
  ];

  const purchaseOrders = ["PO 1", "PO 2", "PO 3", "PO 4", "PO 5"];

  const netCost = Number(totalQuantity || 0) * Number(costPerUnit || 0);
  const miscTotal = miscCharges.reduce(
    (sum, e) => sum + Number(e.totalCost || 0),
    0
  );
  const overallCost = netCost + miscTotal;
  const pendingPayment = overallCost - Number(paidAmount || 0);

  const addMiscCharge = () => {
    if (!miscDesc || !miscCostPerUnit || !totalQuantity) return;

    const costPerU = Number(miscCostPerUnit);
    const qty = Number(totalQuantity);
    setMiscCharges((prev) => [
      ...prev,
      {
        desc: miscDesc,
        costPerUnit: costPerU,
        totalCost: costPerU * qty,
      },
    ]);
    setMiscDesc("");
    setMiscCostPerUnit("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const stockData = {
      factory,
      purchaseOrder,
      unitType,
      qualityType,
      totalQuantity,
      scratchQty,
      costPerUnit,
      payPerUnit,
      transportExpanses, // <- add this
      paidAmount,
      pendingPayment,
      issueDate,
      deadline,
      miscCharges,
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
                    selectedKeys={[factory]}
                    onSelectionChange={(key) => setFactory(key.currentKey)}
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
                    selectedKeys={[purchaseOrder]}
                    onSelectionChange={(key) =>
                      setPurchaseOrder(key.currentKey)
                    }
                  >
                    {purchaseOrders.map((po) => (
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
                    value={qualityType}
                    onChange={(e) => setQualityType(e.target.value)}
                    required
                  />
                  <Input
                    label="Gray Cloth Quantity"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(e.target.value)}
                    required
                  />
                  <Input
                    label="Scratch Quantity"
                    value={scratchQty}
                    onChange={(e) => setScratchQty(e.target.value)}
                    required
                  />
                  <Input
                    label="Base Cost Per Unit"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    required
                  />
                  <Input
                    label="Factory Payment Per Unit"
                    value={payPerUnit}
                    onChange={(e) => setPayPerUnit(e.target.value)}
                    required
                  />

                  <Input
                    label="Total Transport Expanses"
                    value={transportExpanses}
                    onChange={(e) => setTransportExpanses(e.target.value)}
                    required
                  />


                  {/* Miscellaneous Section */}
                  <div className="border p-4 rounded-md bg-gray-50 space-y-2">
                    <p className="font-semibold text-sm">
                      Miscellaneous Charges (per unit)
                    </p>
                    {miscCharges.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm flex justify-between text-gray-700"
                      >
                        <span>{item.desc}</span>
                        <span>Rs. {item.costPerUnit} x Qty = {item.totalCost}</span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 mt-2">
                      <Input
                        placeholder="Description"
                        value={miscDesc}
                        onChange={(e) => setMiscDesc(e.target.value)}
                      />
                      <Input
                        placeholder="Cost Per Unit"
                        type="number"
                        value={miscCostPerUnit}
                        onChange={(e) => setMiscCostPerUnit(e.target.value)}
                      />
                      <Button size="sm" onPress={addMiscCharge}>
                        Add Misc Charge
                      </Button>
                    </div>
                  </div>

                  <Input
                    label="Amount Paid"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    required
                  />

                  {/* Totals */}
                  <div className="bg-gray-100 p-3 rounded-md space-y-1 text-sm border">
                    <p>
                      Net Base Cost:{" "}
                      <strong>Rs. {netCost.toFixed(2)}</strong>
                    </p>
                    <p>
                      Total Miscellaneous:{" "}
                      <strong>Rs. {miscTotal.toFixed(2)}</strong>
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
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
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
