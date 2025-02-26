import dbConnection from "@/config/dbConnection";
import userModel from "@/Models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnection();

    try {
        const { email, password, role , name } = await req.json();

        // Validate input data
        if (!email || !password || !role || !name) {
            return NextResponse.json({
                status: 400,
                error: "Please fill all the fields",
            });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to MongoDB
        const newUser = new userModel({ email, password: hashedPassword, role , name });
        await newUser.save();

        return NextResponse.json({
            status: 201,
            message: "Signup successfully",
        });

    } catch (error) {
        console.error("Error from register API:", error);

        return NextResponse.json({
            status: 500,
            error: "Internal Server Error",
        });
    }
}
