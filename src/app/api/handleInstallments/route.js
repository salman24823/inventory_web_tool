import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnection from "@/config/dbConnection";
import OrderModel from "@/Models/orderModel";

// POST: Add a new installment
export async function POST(request) {
  await dbConnection();

  try {
    const { newInstallment, orderId } = await request.json();

    if (!mongoose.isValidObjectId(orderId) || !newInstallment || !newInstallment.amount || !newInstallment.transactionType || !newInstallment.date) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Validate new amountPaid does not exceed totalAmount
    const newAmountPaid = order.amountPaid + Number(newInstallment.amount);
    if (newAmountPaid > order.totalAmount) {
      return NextResponse.json({ success: false, message: "Installment amount exceeds pending amount" }, { status: 400 });
    }

    // Add new installment
    order.installments.push(newInstallment);
    order.amountPaid = newAmountPaid;
    order.pendingAmount = order.totalAmount - newAmountPaid;
    order.updatedAt = new Date();

    await order.save();

    return NextResponse.json({ success: true, message: "Installment added successfully", order });
  } catch (error) {
    console.error("Error adding installment:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove an installment
export async function DELETE(request) {
  await dbConnection();

  try {
    const { orderId, installmentIndex } = await request.json();

    if (!mongoose.isValidObjectId(orderId) || isNaN(installmentIndex)) {
      return NextResponse.json({ success: false, message: "Invalid order ID or installment index" }, { status: 400 });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const index = parseInt(installmentIndex);
    if (index === 0) {
      return NextResponse.json({ success: false, message: "Cannot delete the first installment" }, { status: 403 });
    }

    if (index < 0 || index >= order.installments.length) {
      return NextResponse.json({ success: false, message: "Invalid installment index" }, { status: 400 });
    }

    // Remove the installment and update amountPaid
    const [removedInstallment] = order.installments.splice(index, 1);
    order.amountPaid -= Number(removedInstallment.amount);
    order.pendingAmount = order.totalAmount - order.amountPaid;
    order.updatedAt = new Date();

    await order.save();

    return NextResponse.json({ success: true, message: "Installment deleted successfully", order });
  } catch (error) {
    console.error("Error deleting installment:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}