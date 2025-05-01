import dbConnection from "@/config/dbConnection";
import factoryModel from "@/Models/factoryModel";
import { NextResponse } from "next/server";

// POST API-CODE
export async function POST(req) {
  try {
    await dbConnection();
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const existingFactory = await factoryModel.findOne({ name, phone });
    if (existingFactory) {
      return NextResponse.json(
        { message: "Factory already exists" },
        { status: 409 }
      );
    }

    const newFactory = await factoryModel.create({ name, phone });

    return NextResponse.json(
      { message: "Factory added successfully", factory: newFactory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API Error:", error);
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

    const factories = await factoryModel.find();

    return NextResponse.json(
      { message: "Factories fetched successfully", factories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Factories API Error:", error);
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
        { error: "Factory ID is required" },
        { status: 400 }
      );
    }

    const deletedFactory = await factoryModel.findByIdAndDelete(id);

    if (!deletedFactory) {
      return NextResponse.json({ error: "Factory not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Factory deleted successfully", factory: deletedFactory },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Factory Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
