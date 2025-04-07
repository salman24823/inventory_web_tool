import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Detail({ isOpen, onOpenChange, selectedStock, fetchStocks }) {
  const [editing, setEditing] = useState(false);

  const [stockName, setStockName] = useState(selectedStock?.stockName);
  const [quantity, setQuantity] = useState(selectedStock?.quantity);
  const [unit, setUnit] = useState(selectedStock?.unit);
  const [quality, setQuality] = useState(selectedStock?.quality);
  const [totalPrice, setTotalPrice] = useState(selectedStock?.totalPrice);
  const [amountPaid, setAmountPaid] = useState(selectedStock?.amountPaid);
  const [companyName, setCompanyName] = useState(selectedStock?.companyName);
  const [phone, setPhone] = useState(selectedStock?.phone);
  const [issueDate, setIssueDate] = useState(selectedStock?.issueDate);
  const [deadline, setDeadline] = useState(selectedStock?.deadline);

  useEffect(() => {
    if (selectedStock) {
      setEditing(false); // Add this
      setStockName(selectedStock.stockName || '');
      setQuantity(selectedStock.quantity || '');
      setUnit(selectedStock.unit || '');
      setQuality(selectedStock.quality || '');
      setTotalPrice(selectedStock.totalPrice || '');
      setAmountPaid(selectedStock.amountPaid || '');
      setCompanyName(selectedStock.companyName || '');
      setPhone(selectedStock.phone || '');
      setIssueDate(selectedStock.issueDate || '');
      setDeadline(selectedStock.deadline || '');
    }
  }, [selectedStock]);


  async function handleConfirm() {
    try {
      const updatedStock = {
        ...selectedStock,
        stockName,
        quantity,
        unit,
        quality,
        totalPrice,
        amountPaid,
        companyName,
        phone,
        issueDate,
        deadline,
      };

      const response = await fetch("/api/handleStock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStock),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("Successfully updated");
      fetchStocks();
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Error in Updating");
    }
  }

  return (
    <>
      <Modal size="6xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Detailed Overview :</ModalHeader>
              <ModalBody>
                <div onClick={() => console.log(selectedStock, "selectedStock")} className="bg-white w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Column */}
                    <div className="space-y-4">

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Title</h2>
                        {editing ? (
                          <Input
                            className="border border-gray-400 rounded-none"
                            value={stockName} onChange={(e) => setStockName(e.target.value)} />
                        ) : (
                          <p className="text-gray-600">{stockName}</p>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Stock Status</h2>
                        <p className={`font-medium ${selectedStock.quantity == 0 ? "text-red-600" : "text-green-600"}`}>
                          {selectedStock.quantity == 0 ? "Out of Stock" : "In Stock"}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Stock Quantity</h2>
                            {editing ? (
                              <Input
                                className="border border-gray-400 rounded-none"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                              />
                            ) : (
                              <p className="text-gray-600">{quantity} {unit}</p>
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Stock Quality</h2>
                            {editing ? (
                              <Input
                                className="border border-gray-400 rounded-none"

                                type="text"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                                placeholder="Enter quality"
                              />
                            ) : (
                              <p className="text-gray-600">{quality || "Null"}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Total Cost</h2>
                            {editing ? (
                              <Input
                                className="border border-gray-400 rounded-none"

                                type="number"
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(e.target.value)}
                              />
                            ) : (
                              <p className="text-gray-600">{totalPrice} PKR</p>
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Cost Per Unit</h2>
                            <p className="text-gray-600">{(Number(totalPrice) / Number(quantity)).toFixed(2)} PKR</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="grid grid-cols-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Amount Paid</h2>
                            {editing ? (
                              <Input
                                className="border border-gray-400 rounded-none"

                                type="number"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                              />
                            ) : (
                              <p className="text-gray-600">{amountPaid} PKR</p>
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700">Remaining Amount</h2>
                            <p className="text-gray-600">{Number(totalPrice) - Number(amountPaid)} PKR</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 border-l border-gray-200 pl-6">
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <div className="text-center">
                          {selectedStock?.companyLogo ? (
                            <img src={selectedStock.companyLogo} alt="Company Logo" className="w-20 h-20 mx-auto rounded-full" />
                          ) : (
                            <div className="bg-blue-100 p-3 rounded-full inline-block">
                              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                            </div>
                          )}
                          <h1 className="text-xl font-bold text-gray-800 mt-3">
                            {editing ? (
                              <Input
                                className="border border-gray-400 rounded-none"
                                value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            ) : (
                              companyName
                            )}
                          </h1>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Company Phone</h2>
                        {editing ? (
                          <Input
                            className="border border-gray-400 rounded-none"
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                        ) : (
                          <p className="text-gray-600">{phone}</p>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Issue Date</h2>
                        {editing ? (
                          <Input
                            className="border border-gray-400 rounded-none"

                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-600">{new Date(issueDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Status</h2>
                        <p className={`font-medium ${amountPaid >= totalPrice ? "text-green-600" : "text-red-600"}`}>
                          {amountPaid >= totalPrice ? "Paid" : "Unpaid"}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-gray-300 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Payment Deadline</h2>
                        {editing ? (
                          <Input
                            className="border border-gray-400 rounded-none"

                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-600">{new Date(deadline).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>

                {editing ? (
                  <Button color="danger" variant="light" onPress={() => setEditing(false)}>
                    Cancel
                  </Button>
                ) : (
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                )}
                {editing ? (
                  <Button color="primary" onPress={handleConfirm}>
                    Confirm
                  </Button>
                ) : (
                  <Button color="primary" onPress={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}