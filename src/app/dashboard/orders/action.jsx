import { useEffect, useState } from "react";
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
} from "@heroui/react";
import { toast } from "react-toastify";
// import { CldUploadWidget } from "next-cloudinary";

export default function Action({ fetchOrders, isOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stockId, setStockId] = useState(""); // Changed from stockName to stockId
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [orderImage, setOrderImage] = useState();
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
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
    GETSTOCK();
  }, [fetchOrders]);

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
          name,
          phone,
          stockName: selectedStock.stockName, // Use selectedStock.stockName
          quantity,
          totalPrice,
          amountPaid,
          issueDate,
          deadline,
          orderImage,
          stockId,
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

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New Order</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    label={
                      stockId
                        ? `Selected: ${
                            stockData.find((s) => s._id === stockId)?.stockName || "N/A"
                          }`
                        : "Select Stock"
                    }
                    value={stockId}
                    onChange={(e) => setStockId(e.target.value)} // Set stockId
                    placeholder="Select a Stock"
                    className="text-black"
                    items={stockData}
                    required
                  >
                    {stockData.map((stock) => (
                      <SelectItem key={stock._id} value={stock._id}>
                        {stock.stockName} (Available: {stock.quantity})
                      </SelectItem>
                    ))}
                  </Select>

                  {stockId && (
                    <>
                      <Input
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                      <div className="flex justify-between px-5">
                        <p className="flex gap-3">
                          Available:{" "}
                          {(() => {
                            const selectedStock = stockData.find((s) => s._id === stockId);
                            return selectedStock ? <p className="flex gap-2"> { selectedStock.quantity } {selectedStock.unit} </p> : "N/A";
                          })()}
                        </p>
                        <p>
                          Remaining:{" "}
                          {(() => {
                            const selectedStock = stockData.find((s) => s._id === stockId);
                            if (!selectedStock) return "N/A";

                            const remaining = selectedStock.quantity - Number(quantity);
                            return isNaN(remaining) ? <p className="flex gap-1"> { selectedStock.quantity } {selectedStock.unit} </p>  : remaining;
                          })()}
                        </p>
                      </div>
                    </>
                  )}

                  <Input
                    label="Customer Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Total Price"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    required
                  />
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
                    required
                  />

                  {/* {orderImage && <img src={orderImage} className="w-28" alt="Order Image" />}

                  <CldUploadWidget
                    uploadPreset="ml_default"
                    options={{ sources: ["local", "url"] }}
                    onSuccess={(result) => setOrderImage(result.info.secure_url)}
                  >
                    {({ open }) => (
                      <button className="text-gray-600 font-semibold text-sm border px-4 py-2" onClick={() => open()}>Upload Image</button>
                    )}
                  </CldUploadWidget> */}

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