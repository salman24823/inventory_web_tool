import dbConnection from "@/config/dbConnection";
import canceledOrderModel from "@/Models/canceledOrderModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnection();
  try {
    const orders = await canceledOrderModel.find({});
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}