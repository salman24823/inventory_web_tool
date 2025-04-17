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
  RadioGroup, Radio
} from "@heroui/react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
// import { CldUploadWidget } from "next-cloudinary";

export default function Action({ fetchOrders }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [phone, setPhone] = useState("");
  const [stockId, setStockId] = useState(""); // Changed from quality to stockId
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [transactionType, setTransactionType] = React.useState(null);

  const { data: session } = useSession();

  const USER = session?.user?.name || null

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for the dropdown container
  const dropdownRef = useRef(null);

  // Dummy Data for Party Names
  const [partyNames, setPartyName] = useState([]);

  // get suggested party names from database
  async function getSuggest() {
    try {
      const response = await fetch("/api/handleOrder");
      if (!response.ok) {
        toast.error("Failed to get Parties");
        return;
      }
      const data = await response.json();
      setPartyName(data.map((party) => party.name));
    } catch (error) {
      toast.error("Failed to get Parties");
    }
  }

  // Handle Input Change
  const handleChange = (e) => {
    const value = e.target.value;
    setName(value);

    // Filter Suggestions
    if (value.trim() === "") {
      setSuggestions([]); // Clear suggestions if input is empty
    } else {
      setSuggestions(
        partyNames.filter((party) =>
          party.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    // Open dropdown when typing
    setIsDropdownOpen(true);
  };

  // Handle Suggestion Selection
  const handleSuggestionClick = (party) => {
    setName(party); // Set the selected party name
    setSuggestions([]); // Clear suggestions after selection
    setIsDropdownOpen(false); // Close dropdown
  };

  async function GETSTOCK() {
    try {
      const response = await fetch("/api/handleStock");
      if (!response.ok) {
        toast.error("Failed to get Inventory");
        return;
      }
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.log("Error fetching inventory");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedStock = stockData.find((item) => item._id === stockId); // Find by _id

    if (!selectedStock) {
      toast.error("Invalid stock selection");
      return;
    }
    if (quantity > selectedStock.quantity) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/handleOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: USER,
          name,
          phone,
          quality: selectedStock.quality, // Use selectedStock.quality
          quantity,
          totalPrice,
          amountPaid,
          issueDate,
          deadline,
          unit : selectedStock.unit ,
          stockId,
          transactionType,
        }),
      });
      if (!response.ok) throw new Error("Failed to Upload");
      toast.success("Successfully uploaded");
      fetchOrders();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Error in Uploading");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    getSuggest()
    GETSTOCK();
    console.log(partyNames, "partyNames")

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };


  }, [fetchOrders]);

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-blue-500 text-white font-semibold text-sm"
      >
        Add New Order <Plus className="w-5" />
      </Button>

      <div className="flex justify-center items-center flex-col gap-4">
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>New Order</ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit} className="space-y-4 ">

                    <div className="grid grid-cols-2 gap-5">

                      <div className="space-y-4">

                        <div className="relative" ref={dropdownRef}>
                          {/* Input Field */}
                          <Input
                            label="Party Name"
                            value={name}
                            onChange={handleChange}
                            onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
                            required
                          />

                          {/* Suggestions Dropdown */}
                          {isDropdownOpen && suggestions.length > 0 && (
                            <ul
                              className={`absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg transition-opacity duration-300 ease-in-out`}
                            >
                              {suggestions.map((party, index) => (
                                <li
                                  key={index}
                                  onClick={() => handleSuggestionClick(party)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
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

                        <Select
                          label={stockId ? `Selected: ${selectedStock?.quality || "N/A"}` : "Select Stock"}
                          value={stockId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setStockId(selectedId); // Update stockId
                            const stock = stockData.find((s) => s._id === selectedId);
                            setSelectedStock(stock || null); // Update selectedStock
                          }}
                          placeholder="Select a Stock"
                          className="text-black"
                          items={stockData}
                          required
                        >
                          {stockData.map((stock) => (
                            <SelectItem key={stock._id} value={stock._id}>
                              {stock.quality} (Available: {stock.quantity})
                            </SelectItem>
                          ))}
                        </Select>

                        <div>
                          <Input
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex bg-gray-100 border border-gray-200  py-4 rounded-lg justify-between px-5">
                          <p className="flex gap-3">
                            Available:{" "}
                            {
                              selectedStock ? <p className="flex gap-2"> {selectedStock.quantity} {selectedStock.unit} </p> : "N/A"
                            }
                          </p>
                          <p>
                            Remaining:{" "}
                            {(() => {
                              const selectedStock = stockData.find((s) => s._id === stockId);
                              if (!selectedStock) return "N/A";

                              const remaining = selectedStock.quantity - Number(quantity);
                              return isNaN(remaining) ? <p className="flex gap-1"> {selectedStock.quantity} {selectedStock.unit} </p> : remaining;
                            })()}
                          </p>
                        </div>

                      </div>

                      <div className="space-y-4">

                        <Input
                          label="Total Price"
                          value={totalPrice}
                          onChange={(e) => setTotalPrice(e.target.value)}
                          required
                        />

                        <div
                          className={`grid grid-cols-2 border border-gray-200 py-4 rounded-lg px-5 ${selectedStock && selectedStock.costPerUnit && quantity && totalPrice
                              ? (totalPrice / quantity - parseFloat(selectedStock.costPerUnit)) > 0
                                ? "bg-green-200" // Profit
                                : "bg-red-200" // Loss
                              : "bg-gray-100" // Default
                            }`}
                        >
                          <p onClick={() => console.log(selectedStock, "selected stock")}>
                            <span className="font-semibold">Cost / Unit: </span>
                            {selectedStock?.costPerUnit
                              ? parseFloat(selectedStock.costPerUnit).toFixed(2)
                              : "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Sale Price / Unit: </span>
                            {quantity && totalPrice ? (totalPrice / quantity).toFixed(2) : "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Profit / Unit: </span>
                            {selectedStock?.costPerUnit && quantity && totalPrice
                              ? ((totalPrice / quantity) - parseFloat(selectedStock.costPerUnit)).toFixed(2)
                              : "N/A"}
                          </p>
                        </div>


                        <Input
                          label="Amount Paid"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
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

                        <div>
                          <RadioGroup orientation="horizontal"
                            value={transactionType}
                            onValueChange={setTransactionType}
                            label="Transaction Type">
                            <Radio value="Cash">Cash</Radio>
                            <Radio value="Bank">Bank</Radio>
                            {/* <Radio value="Wallet">Wallet</Radio> */}
                          </RadioGroup>
                        </div>

                      </div>

                    </div>

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
    </>

  );
}