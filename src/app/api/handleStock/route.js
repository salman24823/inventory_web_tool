// app/api/handleStock/route.js
import { NextResponse } from "next/server";
import Stock from "@/Models/stockModel";
import dbConnection from "@/config/dbConnection";

// GET: Fetch all stocks
export async function GET() {
  try {
    await dbConnection();
    const stocks = await Stock.find({});
    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch stocks", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new stock
export async function POST(request) {
  try {
    await dbConnection();
    const body = await request.json();
    const newStock = new Stock(body);
    await newStock.save();
    return NextResponse.json(newStock, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create stock", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a stock
export async function PUT(request) {
  try {
    await dbConnection();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const updatedStock = await Stock.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedStock) {
      return NextResponse.json(
        { message: "Stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStock, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update stock", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a stock
export async function DELETE(request) {
  try {
    await dbConnection();
    const { id } = await request.json();

    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return NextResponse.json(
        { message: "Stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Stock deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete stock", error: error.message },
      { status: 500 }
    );
  }
}