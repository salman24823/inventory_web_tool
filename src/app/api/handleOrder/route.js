import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import OrderModel from "@/Models/orderModel";
import StockModel from "@/Models/stockModel"; // Assuming you have a StockModel

export async function GET() {
  try {
    await dbConnection();
    const orders = await OrderModel.find().sort({ issueDate: -1 });

    console.log(orders,"orders")

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
}

export async function POST(request) {
  await dbConnection();
  try {
    const {
      name,
      phone,
      items,
      totalAmount,
      amountPaid,
      pendingAmount,
      issueDate,
      deadline,
      transactionType,
      createdBy,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !phone ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount === undefined ||
      amountPaid === undefined ||
      pendingAmount === undefined ||
      !issueDate ||
      !transactionType ||
      !createdBy
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Validate items and stock
    for (const item of items) {
      if (
        !item.stockId ||
        !item.stockName ||
        !item.quantity ||
        !item.salePricePerUnit ||
        !item.totalPrice ||
        item.quantity < 1 ||
        item.salePricePerUnit < 0 ||
        item.totalPrice < 0
      ) {
        return NextResponse.json(
          { message: "Invalid item data" },
          { status: 400 }
        );
      }

      // Verify stock exists
      const stock = await StockModel.findById(item.stockId);
      if (!stock) {
        return NextResponse.json(
          { message: `Stock not found for ID: ${item.stockId}` },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    if (totalAmount < 0 || amountPaid < 0 || pendingAmount < 0) {
      return NextResponse.json(
        { message: "Numeric fields cannot be negative" },
        { status: 400 }
      );
    }

    // Validate amount calculations
    if (totalAmount !== amountPaid + pendingAmount) {
      return NextResponse.json(
        { message: "Total amount must equal paid plus pending amount" },
        { status: 400 }
      );
    }

    // Validate dates
    const issueDateObj = new Date(issueDate);
    if (isNaN(issueDateObj.getTime())) {
      return NextResponse.json(
        { message: "Invalid issueDate" },
        { status: 400 }
      );
    }
    let deadlineObj;
    if (deadline) {
      deadlineObj = new Date(deadline);
      if (isNaN(deadlineObj.getTime())) {
        return NextResponse.json(
          { message: "Invalid deadline" },
          { status: 400 }
        );
      }
      if (deadlineObj < issueDateObj) {
        return NextResponse.json(
          { message: "Deadline cannot be before issue date" },
          { status: 400 }
        );
      }
    }

    // Create order
    const order = await OrderModel.create({
      name,
      phone,
      items,
      totalAmount,
      amountPaid,
      pendingAmount,
      issueDate: issueDateObj,
      deadline: deadlineObj,
      transactionType,
      createdBy,
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: `Error creating order: ${error.message}` },
      { status: 500 }
    );
  }
}
