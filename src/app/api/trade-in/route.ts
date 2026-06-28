import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Create a new trade-in request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const tradeInRequest = await db.tradeInRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredContact: data.preferredContact || "WhatsApp",
        currentMake: data.currentMake,
        currentModel: data.currentModel,
        currentYear: parseInt(data.currentYear),
        currentMileage: data.currentMileage ? parseInt(data.currentMileage) : null,
        currentCondition: data.currentCondition,
        currentPhotos: null,
        desiredMake: data.desiredMake || null,
        desiredModel: data.desiredModel || null,
        budgetTopUp: data.budgetTopUp || null,
        financingNeeded: data.financingNeeded || false,
        message: data.message || null,
        status: "New",
        source: "Website",
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      id: tradeInRequest.id 
    });
  } catch (error) {
    console.error("Error creating trade-in request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

// GET - List trade-in requests (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    
    const requests = await db.tradeInRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching trade-in requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
