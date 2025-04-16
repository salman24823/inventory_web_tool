import dbConnection from "@/config/dbConnection";
import orderModel from "@/Models/orderModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();

    const {
      selectedOrder,
      updatedInstallments
    } = data;
    
    const cashId = "67fec0187fed8958f6caeaa3";    
    const bankId = "67fec2567fed8958f6caeadb";    

    const newInstallment = updatedInstallments[updatedInstallments.length - 1];

    // Update the correct model by ID
    if (newInstallment?.transactionType === "Cash" && cashId) {
      await cashModel.findByIdAndUpdate(cashId, {
        $inc: { totalCash: newInstallment.amount }
      });
    } else if (newInstallment?.transactionType === "Bank" && bankId) {
      await bankModel.findByIdAndUpdate(bankId, {
        $inc: { totalBank: newInstallment.amount }
      });
    }

    // Update order
    const updatedOrder = await orderModel.findByIdAndUpdate(
      selectedOrder._id,
      { $set: { installments: updatedInstallments } },
      { new: true }
    );

    console.log(updatedOrder, "Installment Updated");

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
