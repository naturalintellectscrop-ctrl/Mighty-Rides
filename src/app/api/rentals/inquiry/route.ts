import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/rentals/inquiry - Create a rental inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rentalId,
      name,
      email,
      phone,
      preferredContact,
      occasion,
      startDate,
      endDate,
      duration,
      passengerCount,
      driverOption,
      eventDetails,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Create the rental inquiry
    const inquiry = await db.rentalInquiry.create({
      data: {
        rentalId: rentalId || null,
        name,
        email,
        phone,
        occasion: occasion || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        message: [
          message,
          duration && `Duration: ${duration}`,
          passengerCount && `Passengers: ${passengerCount}`,
          driverOption && `Driver: ${driverOption}`,
          eventDetails && `Event Details: ${eventDetails}`,
          preferredContact && `Preferred Contact: ${preferredContact}`,
        ].filter(Boolean).join(" | "),
      },
    });

    return NextResponse.json({
      success: true,
      id: inquiry.id,
      message: "Rental inquiry submitted successfully"
    });
  } catch (error) {
    console.error("Rental inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit rental inquiry" },
      { status: 500 }
    );
  }
}

// GET /api/rentals/inquiry - Get all rental inquiries (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rentalId = searchParams.get("rentalId");

    const where = rentalId ? { rentalId } : {};

    const inquiries = await db.rentalInquiry.findMany({
      where,
      include: {
        rental: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Fetch rental inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rental inquiries" },
      { status: 500 }
    );
  }
}
