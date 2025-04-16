import { NextResponse } from "next/server";
import dbConnection from "@/config/dbConnection";
import cashModel from "@/Models/totalCash";
import bankModel from "@/Models/bankModel";

export const revalidate = 0;

export async function GET() {
  await dbConnection();
  try {
    const cash = await cashModel.find({});
    const bank = await bankModel.find({});

    console.log(cash , bank , "Data")

    return NextResponse.json(({cash , bank}), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}