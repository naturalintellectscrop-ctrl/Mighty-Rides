import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/rentals - Get all rental vehicles with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (available === "true") where.isAvailable = true;

    const rentals = await db.rentalVehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: rentals });
  } catch (error) {
    console.error("Fetch rentals error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

// POST /api/rentals - Create a new rental vehicle (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rental = await db.rentalVehicle.create({
      data: {
        name: body.name,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        category: body.category,
        dailyRate: parseInt(body.dailyRate),
        weeklyRate: body.weeklyRate ? parseInt(body.weeklyRate) : null,
        monthlyRate: body.monthlyRate ? parseInt(body.monthlyRate) : null,
        description: body.description,
        features: body.features ? JSON.stringify(body.features) : null,
        images: body.images ? JSON.stringify(body.images) : null,
        isAvailable: body.isAvailable !== false,
      },
    });

    return NextResponse.json({ success: true, id: rental.id });
  } catch (error) {
    console.error("Rental creation error:", error);
    return NextResponse.json(
      { error: "Failed to create rental vehicle" },
      { status: 500 }
    );
  }
}
