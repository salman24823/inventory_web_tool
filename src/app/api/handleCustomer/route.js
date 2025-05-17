import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import CustomerModel from "@/Models/customerModel";

export const revalidate = 0;

export async function POST(request) {
  await dbConnection();
  try {
    const { name, phone, amountDealing, amountPending, issueDate } = await request.json();

    if (!phone || amountDealing === undefined || amountPending === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if customer exists by phone
    let customer = await CustomerModel.findOne({ phone });

    if (customer) {
      // Customer exists, increment amounts and update lastCheckout
      customer = await CustomerModel.findOneAndUpdate(
        { phone },
        {
          $inc: {
            totalDealing: amountDealing,
            totalPending: amountPending,
          },
          $set: {
            name: name || customer.name, // Update name if provided
            lastCheckout: issueDate || customer.lastCheckout, // Update lastCheckout
          },
        },
        { new: true }
      );
    } else {
      // New customer, create document
      customer = await CustomerModel.create({
        name,
        phone,
        totalDealing: amountDealing,
        totalPending: amountPending,
        lastCheckout: issueDate,
      });
    }

    return NextResponse.json(
      { message: "Customer processed successfully", customer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing customer:", error);
    return NextResponse.json(
      { message: `Error processing customer: ${error.message}` },
      { status: 500 }
    );
  }
}