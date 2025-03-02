import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnection from "@/config/dbConnection";
import userModel from "@/Models/userModel";

export async function POST(req) {
  try {
    await dbConnection();
    const { name, email, phone, newPassword } = await req.json();

    console.log(name, email, phone, newPassword)
    
    // Ensure all three fields match exactly
    const Previos = await userModel.findOne({ email });
    console.log(Previos,"Previos")

    const user = await userModel.findOne({ name, email, phone });
    console.log(user,"user Found")

    if (!user) {
      return NextResponse.json({ message: "User info is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password successfully updated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
