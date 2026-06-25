import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Track a conversion event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const event = await db.conversionEvent.create({
      data: {
        eventType: data.eventType,
        category: data.category || null,
        source: data.source || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        sessionId: data.sessionId || null,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      id: event.id 
    });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    // Don't fail the user request if tracking fails
    return NextResponse.json({ success: false, error: "Tracking failed" }, { status: 500 });
  }
}

// GET - Get conversion analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("eventType");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    const where: Record<string, unknown> = {};
    if (eventType) where.eventType = eventType;
    if (category) where.category = category;
    
    // Get total counts by event type
    const eventCounts = await db.conversionEvent.groupBy({
      by: ['eventType'],
      _count: {
        id: true,
      },
      where,
    });
    
    // Get total counts by category
    const categoryCounts = await db.conversionEvent.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where,
    });
    
    // Get recent events
    const recentEvents = await db.conversionEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    
    return NextResponse.json({ 
      success: true, 
      analytics: {
        byEventType: eventCounts,
        byCategory: categoryCounts,
        recent: recentEvents,
      }
    });
  } catch (error) {
    console.error("Error fetching conversion analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
