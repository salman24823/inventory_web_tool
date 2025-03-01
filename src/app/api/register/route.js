import dbConnection from "@/config/dbConnection";
import userModel from "@/Models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnection();

  try {
    const { email, password, role, name , phone } = await req.json();

    // Validate input fields
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 } // 409 Conflict is better for duplicate entries
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      phone,
      role,
      name,
    });

    return NextResponse.json(
      { message: "Signup successful", userId: newUser._id },
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
