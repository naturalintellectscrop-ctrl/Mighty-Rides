import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Create a new after-sale request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const afterSaleRequest = await db.afterSaleRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehiclePurchased: data.vehiclePurchased || null,
        requestType: data.requestType,
        urgency: data.urgency || "Standard",
        preferredDate: data.preferredDate || null,
        preferredTime: data.preferredTime || null,
        message: data.message || null,
        status: "New",
        source: "Website",
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      id: afterSaleRequest.id 
    });
  } catch (error) {
    console.error("Error creating after-sale request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

// GET - List after-sale requests (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const requestType = searchParams.get("type");
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (requestType) where.requestType = requestType;
    
    const requests = await db.afterSaleRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching after-sale requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
