import dbConnection from "@/config/dbConnection";
import poModel from "@/Models/poModel";
import { NextResponse } from "next/server";

// POST API-CODE
export async function POST(req) {
  try {
    await dbConnection();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const existingPO = await poModel.findOne({ name });
    if (existingPO) {
      return NextResponse.json(
        { message: "PO already exists" },
        { status: 409 }
      );
    }

    const newPO = await poModel.create({ name });

    return NextResponse.json(
      { message: "PO added successfully", po: newPO },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register PO API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// GET API-CODE
export async function GET() {
  try {
    await dbConnection();

    const pos = await poModel.find();

    return NextResponse.json(
      { message: "POs fetched successfully", pos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get POs API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE API CODE
export async function DELETE(req) {
  try {
    await dbConnection();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "PO ID is required" },
        { status: 400 }
      );
    }

    const deletedPO = await poModel.findByIdAndDelete(id);

    if (!deletedPO) {
      return NextResponse.json({ error: "PO not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "PO deleted successfully", po: deletedPO },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE PO Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
