import { NextResponse } from "next/server";
import dbConnect from "@/config/dbConnection";
import Spending from "@/Models/spendingsModel";
import bankModel from "@/Models/bankModel";
import cashModel from "@/Models/totalCash";

export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const spendings = await Spending.find().sort({ date: -1 });
    return NextResponse.json(spendings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    console.log("🟡 [1] POST /api/handleSpendings hit");

    await dbConnect();
    console.log("✅ [2] Database connected");

    const { amount, description, date, Method } = await req.json();
    console.log("📦 [3] Extracted from body:", {
      amount,
      description,
      date,
      Method,
    });

    console.log("🔍 [4] Values:", amount, description, date, Method);

    const parsedAmount = Number(amount);
    console.log("🔢 [5] Parsed amount:", parsedAmount);

    if (isNaN(parsedAmount)) {
      console.log("❌ [6] Amount is not a valid number");
      return NextResponse.json(
        { message: "Amount must be a number" },
        { status: 400 }
      );
    }

    const newSpending = new Spending({
      amount: parsedAmount,
      description,
      date,
      method: Method,
    });
    console.log("🆕 [7] Spending object created:", newSpending);

    await newSpending.save();
    console.log("💾 [8] Spending saved to DB");

    const cashId = "6801100d913b8db3b5893b38";
    const bankId = "68010fad913b8db3b5893b36";
    console.log("💳 [9] IDs set", { cashId, bankId });

    if (Method == "bank") {
      console.log("🏦 [10] Updating bank total...");
      const result = await bankModel.findByIdAndUpdate(bankId, {
        $inc: { totalBank: -parsedAmount },
      });
      console.log("✅ [11] Bank update result:", result);
    } else {
      console.log("💵 [12] Updating cash total...");
      const result = await cashModel.findByIdAndUpdate(cashId, {
        $inc: { totalCash: -parsedAmount },
      });
      console.log("✅ [13] Cash update result:", result);
    }

    console.log("🎉 [14] Spending and totals updated successfully");

    return NextResponse.json(
      { message: "Record added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 [15] Error in /api/handleSpendings:", error);
    return NextResponse.json(
      { message: "Failed to add record", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    await dbConnect();
    const { id, amount, description, date } = await req.json();

    const updatedSpending = await Spending.findByIdAndUpdate(
      id,
      { amount, description, date },
      { new: true }
    );

    if (!updatedSpending) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Record updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();

    const deletedSpending = await Spending.findByIdAndDelete(id);
    if (!deletedSpending) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete record" },
      { status: 500 }
    );
  }
}
