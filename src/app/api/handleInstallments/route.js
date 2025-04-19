import dbConnection from "@/config/dbConnection";
import bankModel from "@/Models/bankModel";
import orderModel from "@/Models/orderModel";
import cashModel from "@/Models/totalCash";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();

    const { selectedOrder, updatedInstallments } = data;
    
    const cashId = "67fec0187fed8958f6caeaa3";    
    const bankId = "67fec2567fed8958f6caeadb";    

    const newInstallment = updatedInstallments[updatedInstallments.length - 1];

    // Update cash or bank total
    if (newInstallment?.transactionType === "Cash" && cashId) {
      await cashModel.findByIdAndUpdate(cashId, {
        $inc: { totalCash: newInstallment.amount }
      });
    } else if (newInstallment?.transactionType === "Bank" && bankId) {
      await bankModel.findByIdAndUpdate(bankId, {
        $inc: { totalBank: newInstallment.amount }
      });
    }

    // Calculate new amountPaid as a string
    const currentPaid = Number(selectedOrder.amountPaid || 0);
    const additionalAmount = Number(newInstallment.amount || 0);
    const newPaid = (currentPaid + additionalAmount).toString();

    // Update order with new installments and updated amountPaid
    const updatedOrder = await orderModel.findByIdAndUpdate(
      selectedOrder._id,
      {
        $set: {
          installments: updatedInstallments,
          amountPaid: newPaid
        }
      },
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
