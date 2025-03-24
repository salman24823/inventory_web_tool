import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import userModel from "@/Models/userModel";

export const revalidate = 0;


export async function GET() {
  await dbConnection();
  try {
    const users = await userModel.find({ email: { $ne: "admin@gmail.com" } });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
    await dbConnection();
  
    try {
      const { id } = await req.json(); // Extract ID from request body
  
      if (!id) {
        return NextResponse.json({ error: "Employee ID required" }, { status: 400 });
      }
  
      const deletedEmployee = await userModel.findByIdAndDelete(id);

      console.log(deletedEmployee,"deletedEmployee")

  
      if (!deletedEmployee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
  }