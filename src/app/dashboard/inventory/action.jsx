import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@heroui/react";
import { toast } from "react-toastify"; // Assuming you're using react-hot-toast for notifications
import { CldUploadWidget } from "next-cloudinary";

export default function Action({ fetchStocks, isOpen, onOpenChange }) {
  const [modalPlacement, setModalPlacement] = useState("bottom");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [stockName, setStockName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [quantity, setQuantity] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [stockImage, setStockImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/handleStock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          phone,
          stockName,
          totalPrice,
          amountPaid,
          quantity,
          issueDate,
          deadline,
          stockImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to Upload");
      }

      toast.success("Successfully uploaded");

      fetchStocks(); // Refresh the stock list
      onOpenChange(false); // Close the modal on success
    } catch (error) {
      console.error(error);
      toast.error("Error in Uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <div className="overflow-y-scroll">
        <Modal
          className="h-[85vh]"
          isOpen={isOpen}
          placement={modalPlacement}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="overflow-y-scroll">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add New Stock
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Company Name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Stock Name"
                      type="text"
                      value={stockName}
                      onChange={(e) => setStockName(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Total Price"
                      type="text"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Amount Paid"
                      type="text"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Stock Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="w-full" variant="bordered">Select Unit</Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions">
                            <DropdownItem key="meter" >Meter</DropdownItem>
                            <DropdownItem key="guaze" >Gauze</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Issue Date"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                    />
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />

                    <div className="flex flex-col gap-5">
                      <div className="flex gap-5">
                        <div className="flex gap-5">
                          {stockImage ? (
                            <>
                              <img
                                src={stockImage}
                                className="w-28"
                                alt="Stock Image"
                              />
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-5">
                        <CldUploadWidget
                          uploadPreset="ml_default"
                          options={{ sources: ["local", "url"] }}
                          onSuccess={(result) =>
                            setStockImage(result.info.secure_url)
                          }
                        >
                          {({ open }) => (
                            <Button
                            variant="bordered"
                              className="w-full"
                              onPress={() => open()}
                            >
                              Upload Stock Image
                            </Button>
                          )}
                        </CldUploadWidget>
                      </div>
                    </div>

                    <ModalFooter className="px-0">
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
    </div>
  );
}