import dbConnection from "@/config/dbConnection";
import orderModel from "@/Models/orderModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const data = await req.json();

    const updatedOrder = await orderModel.findByIdAndUpdate(
      data.selectedOrder._id, // Filter by ID
      { $set: { installments: data.updatedInstallments } }, // Correct update format
      { new: true } // Return the updated document
    );

    console.log(updatedOrder, "update");

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
