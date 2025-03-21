// app/api/handleStock/route.js
import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import stockModel from "@/Models/stockModel";

// GET: Fetch all stocks
export async function GET() {
  try {
    await dbConnection();
    const stocks = await stockModel.find({});
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
    console.log(body, "body");
    const newStock = new stockModel(body);
    console.log(newStock, "newStock");
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
    await dbConnection(); // Ensure database connection

    const stocks = await request.json(); // Parse request body
    if (!stocks) {
      return NextResponse.json(
        { success: false, message: "Stocks must be a non-empty array" },
        { status: 400 }
      );
    }

    console.log("Updating stocks:", stocks);

    const updatedStock = await stockModel.findByIdAndUpdate(stocks._id, stocks, {
      new: true,
    });

    console.log("Stocks updated successfully:", updatedStock);

    return NextResponse.json(
      {
        success: true,
        message: "Stocks updated successfully",
        updatedStocks: updatedStock,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating stocks:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update stocks",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a stock
export async function DELETE(request) {
  try {
    await dbConnection();
    const { id } = await request.json();

    const deletedStock = await stockModel.findByIdAndDelete(id);

    if (!deletedStock) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
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
