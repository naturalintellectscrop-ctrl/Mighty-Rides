import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// GET /api/blog - List all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {
      published: true,
    };

    if (category) {
      where.category = category.toUpperCase();
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { published_at: "desc" },
        take: limit,
        skip: offset,
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
