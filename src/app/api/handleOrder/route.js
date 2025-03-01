import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import orderModel from "@/Models/orderModel";

export async function GET() {
  await dbConnection();
  try {
    const orders = await orderModel.find({});
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnection();
  try {
    const data = await req.json();
    const {
      name,
      phone,
      orderName,
      totalPrice,
      amountPaid,
      issueDate,
      deadline,
      orderImage,
    } = data;

    console.log(data,"data")

    if (
      !name ||
      !phone ||
      !orderName ||
      !totalPrice ||
      !amountPaid ||
      !issueDate ||
      !deadline 
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await orderModel.create({
      name,
      phone,
      orderName,
      totalPrice,
      amountPaid,
      issueDate,
      deadline,
      orderImage,
    });

    console.log(newOrder,"newOrder")

    return NextResponse.json(
      { success: true, order: newOrder },
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

export async function DELETE(req) {
  await dbConnection(); // Ensure DB connection
  try {
    const { id } = await req.json(); // Parse request body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }
    console.log(id, "Order ID DELTE");
    const deletedOrder = await orderModel.findByIdAndDelete(id); // Delete order by ID
    console.log(deletedOrder, "Order ID DELTE");

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
