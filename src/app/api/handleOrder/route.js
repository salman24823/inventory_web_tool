import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import orderModel from "@/Models/orderModel";
import stockModel from "@/Models/stockModel";
import canceledOrderModel from "@/Models/canceledOrderModel";
import cashModel from "@/Models/totalCash";
import bankModel from "@/Models/bankModel";

export const revalidate = 0;

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

    console.log(data, "data");

    const {
      name,
      phone,
      user,
      unit,
      // stockName,
      quantity,
      totalPrice,
      amountPaid,
      issueDate,
      deadline,
      orderImage,
      stockId,
      quality,
      transactionType,
    } = data;

    console.log(data, "Received Order Data");

    // Convert necessary fields to numbers
    const quantityNum = Number(quantity);
    const amountPaidNum = Number(amountPaid);

    // Validate required fields
    if (
      !name ||
      !phone ||
      !quantityNum ||
      !totalPrice ||
      !amountPaidNum ||
      !issueDate ||
      !stockId ||
      !transactionType
    ) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amountPaid against totalPrice
    if (amountPaidNum > totalPrice) {
      return NextResponse.json(
        { error: "Amount paid cannot exceed total price" },
        { status: 400 }
      );
    }

    // Check stock availability
    const selectedStock = await stockModel.findById(stockId);
    if (!selectedStock) {
      return NextResponse.json(
        { error: "Stock item not found" },
        { status: 404 }
      );
    }

    if (quantityNum > selectedStock.quantity) {
      return NextResponse.json(
        { error: "Quantity exceeds available stock" },
        { status: 400 }
      );
    }

    // Create order
    const newOrder = await orderModel.create({
      name,
      user,
      phone,
      unit,
      // orderName: stockName,
      quantity: quantityNum,
      totalPrice,
      amountPaid: amountPaidNum,
      issueDate,
      deadline,
      orderImage,
      quality,
      stockId,
      installments: [{ amount: amountPaidNum, transactionType }], // Store first installment
    });

    // Update stock only if order creation succeeds
    await stockModel.findByIdAndUpdate(stockId, {
      $inc: { quantity: -quantityNum },
    });

    const cashId = "6801100d913b8db3b5893b38";
    const bankId = "68010fad913b8db3b5893b36";

    if (transactionType === "Cash") {
      await cashModel.findByIdAndUpdate(cashId, {
        $inc: { totalCash: amountPaidNum },
      });
    } else {
      await bankModel.findByIdAndUpdate(bankId, {
        $inc: { totalBank: amountPaidNum },
      });
    }

    await newOrder.save();

    console.log(newOrder, "New Order Created");

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
    const { order, USER } = await req.json(); // Parse request body

    // Hardcoded IDs for cash and bank
    const cashId = "6801100d913b8db3b5893b38";
    const bankId = "68010fad913b8db3b5893b36";

    if (!order || !order._id || !order.stockId || !order.quantity || !USER) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID, stock ID, quantity, and user are required",
        },
        { status: 400 }
      );
    }

    const {
      _id,
      name,
      stockId,
      phone,
      orderName,
      quantity,
      quality,
      totalPrice,
      amountPaid,
      issueDate,
      deadline,
      orderImage,
      userImage,
      installments = [],
    } = order;

    // Save canceled order
    await canceledOrderModel.create({
      name,
      stockId,
      phone,
      user: USER,
      orderName,
      quantity,
      quality,
      totalPrice,
      amountPaid,
      issueDate,
      deadline,
      orderImage,
      userImage,
      installments,
    });

    // Restore stock quantity
    await stockModel.findByIdAndUpdate(stockId, {
      $inc: { quantity: Number(quantity) },
    });

    // Remove order
    const deletedOrder = await orderModel.findByIdAndDelete(_id);
    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let totalCash = 0;
    let totalBank = 0;

    // Calculate total amounts for Cash and Bank installments
    for (const installment of installments) {
      if (installment.transactionType === "Cash") {
        totalCash += Number(installment.amount);
      } else if (installment.transactionType === "Bank") {
        totalBank += Number(installment.amount);
      }
    }

    // Decrement from cashModel if there is a cash amount
    if (totalCash > 0) {
      await cashModel.findByIdAndUpdate(cashId, {
        $inc: { totalCash: -totalCash },
      });
    }

    // Decrement from bankModel if there is a bank amount
    if (totalBank > 0) {
      await bankModel.findByIdAndUpdate(bankId, {
        $inc: { totalBank: -totalBank },
      });
    }

    console.log(deletedOrder, "Order Deleted");

    return NextResponse.json({
      success: true,
      message:
        "Order deleted successfully, stock updated, and payment decremented",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await dbConnection(); // Ensure DB connection

  try {
    const body = await req.json(); // Parse request body

    const cashId = "6801100d913b8db3b5893b38";
    const bankId = "68010fad913b8db3b5893b36";

    if (!body || !body.updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    const updatedOrder = body.updatedOrder; // Extract the correct object

    console.log(updatedOrder, "Order to PUT");

    // Now, correctly access properties
    const orderId = updatedOrder._id;
    const stockId = updatedOrder.stockId;
    const prevQuantity = Number(updatedOrder.quantity); // Convert to number
    const newQuantity = Number(updatedOrder.newQTY); // Convert to number
    const otherUpdates = { ...updatedOrder }; // Copy all data

    console.log(orderId, stockId, prevQuantity, newQuantity, "Here is Line");
    console.log("Here is Line bottom");

    // Determine quantity change type
    let label = "no change";
    if (newQuantity > prevQuantity) {
      label = "increment";
    } else if (newQuantity < prevQuantity) {
      label = "decrement";
    }

    // Update orderModel with all new data
    await orderModel.findByIdAndUpdate(
      orderId,
      { ...otherUpdates, quantity: newQuantity, updatedAt: new Date() },
      { new: true }
    );

    // If quantity changed, update stockModel
    if (stockId) {
      if (label === "increment") {
        const stockUpdate = -Math.abs(newQuantity - prevQuantity);
        console.log(
          `🔼 Increment: Decreasing stock by ${Math.abs(stockUpdate)}`
        );
        await stockModel.findByIdAndUpdate(
          stockId,
          { $inc: { quantity: stockUpdate } },
          { new: true }
        );
      } else if (label === "decrement") {
        const stockUpdate = Math.abs(newQuantity - prevQuantity);
        console.log(`🔽 Decrement: Increasing stock by ${stockUpdate}`);
        await stockModel.findByIdAndUpdate(
          stockId,
          { $inc: { quantity: stockUpdate } },
          { new: true }
        );
      } else {
        console.log("⚠️ No change in stock quantity");
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order updated successfully. Stock ${label}`,
      label,
    });
  } catch (error) {
    console.error("Error updating order & stock:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
