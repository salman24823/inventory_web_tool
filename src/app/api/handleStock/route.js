import dbConnection from "@/config/dbConnection";
import StockModel from "@/Models/stockModel";
import { NextResponse } from "next/server";


// GET API-CODE
export async function GET() {
  await dbConnection();
  try {
    const stocks = await StockModel.find().sort({ issueDate: -1 });
    console.log(stocks);
    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.status(500).json({ message: "Failed to fetch stocks." });
  }
}

export async function POST(request) {
  await dbConnection();

  try {
    const {
      factoryName,
      purchaseOrderNumber,
      unitType,
      clothQuality,
      grayClothQuantity,
      scratchQuantity,
      baseCostPerUnit,
      factoryPaymentPerUnit,
      transportExpenses,
      issueDate,
      deadlineDate,
      perUnitCharges,
      fixedCharges,
      amountPaid,
      pendingPayment,
      netBaseCost,
      totalPerUnitCost,
      totalFixedCost,
      totalMiscellaneousCost,
    } = await request.json();


    const totalCost = netBaseCost + totalMiscellaneousCost;

    // Simulate saving data to a database
    const newStockEntry = {
      factoryName,
      purchaseOrderNumber,
      clothQuality,

      grayClothQuantity,
      scratchQuantity,
      unitType,

      baseCostPerUnit,
      factoryPaymentPerUnit,
      transportExpenses,

      perUnitCharges,
      fixedCharges,

      netBaseCost,
      totalMiscellaneousCost,
      stockQuantity : Number(grayClothQuantity) - Number(scratchQuantity),

      totalCost,

      amountPaid,
      pendingPayment,

      issueDate,
      deadlineDate,

      totalPerUnitCost,
      totalFixedCost
    };

    await StockModel.create(newStockEntry);

    // Respond with success
    return NextResponse.json(
      { message: "Stock entry added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
