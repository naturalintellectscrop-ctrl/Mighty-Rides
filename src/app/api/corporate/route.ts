import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Create a new corporate inquiry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const corporateInquiry = await db.corporateInquiry.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        industry: data.industry || null,
        serviceType: data.serviceType,
        vehiclePreference: data.vehiclePreference || null,
        duration: data.duration || null,
        passengerCount: data.passengerCount ? parseInt(data.passengerCount) : null,
        requirements: data.requirements || null,
        message: data.message || null,
        status: "New",
        source: "Website",
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      id: corporateInquiry.id 
    });
  } catch (error) {
    console.error("Error creating corporate inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

// GET - List corporate inquiries (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const industry = searchParams.get("industry");
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    
    const inquiries = await db.corporateInquiry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Error fetching corporate inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
