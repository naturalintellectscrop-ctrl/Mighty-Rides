import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const post = await db.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
