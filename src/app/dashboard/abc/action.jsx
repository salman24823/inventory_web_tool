import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { toast } from "react-toastify"; // Assuming you're using react-hot-toast for notifications
import { CldUploadWidget } from "next-cloudinary";

export default function Action({fetchOrders,isOpen,onOpenChange}) {
  const [modalPlacement, setModalPlacement] = useState("bottom");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderName, setOrderName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [orderImage, setOrderImage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/handleOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          orderName,
          totalPrice,
          amountPaid,
          issueDate,
          deadline,
          orderImage
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to Upload");
      }

      toast.success("Successfully uploaded");

      fetchOrders()

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
                  New Order
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      className="border border-gray-300 rounded-xl"
                      label="Customer Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      label="Order Name"
                      type="text"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
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
                          {orderImage ? (
                            <>
                              <img
                                src={orderImage}
                                className="w-28"
                                alt="Order Image"
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
                            setOrderImage(result.info.secure_url)
                          }
                        >
                          {({ open }) => (
                            <button
                              className="text-gray-600 mt-2 font-semibold text-sm rounded-lg px-4 py-2 border border-gray-400"
                              onClick={() => open()}
                            >
                              Order Image
                            </button>
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
