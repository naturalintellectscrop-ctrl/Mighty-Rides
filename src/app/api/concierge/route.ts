import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Create a new concierge request (uses inquiries table with type CONCIERGE)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create as an inquiry with CONCIERGE type
    const inquiry = await db.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: "CONCIERGE",
        vehicle_id: data.vehicleId || null,
        message: data.message || null,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      id: inquiry.id
    });
  } catch (error) {
    console.error("Error creating concierge request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

// GET - List concierge requests (inquiries with type CONCIERGE)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      type: "CONCIERGE"
    };
    if (status) where.status = status;

    const requests = await db.inquiry.findMany({
      where,
      include: {
        vehicle: {
          select: {
            name: true,
            make: true,
            model: true,
            year: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching concierge requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
