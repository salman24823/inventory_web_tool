import { NextResponse } from "next/server";
import dbConnect from "@/config/dbConnection"
import Spending from "@/Models/spendingsModel";

export async function GET() {
  try {
    await dbConnect();
    const spendings = await Spending.find().sort({ date: -1 });
    return NextResponse.json(spendings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { amount, description, date } = await req.json();

    const newSpending = new Spending({ amount, description, date });
    await newSpending.save();

    return NextResponse.json({ message: "Record added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add record" }, { status: 500 });
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
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();

    const deletedSpending = await Spending.findByIdAndDelete(id);
    if (!deletedSpending) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete record" }, { status: 500 });
  }
}
