"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, FileText, ArrowRight, Loader2 } from "lucide-react";

// Blog post type
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  category: string;
}

// Format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format category for display
const formatCategory = (category: string): string => {
  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default function RelatedPosts({ currentPostId, category }: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch posts from the same category
        const response = await fetch(`/api/blog?category=${category}&limit=4`);
        if (!response.ok) {
          throw new Error("Failed to fetch related posts");
        }

        const data = await response.json();
        // Filter out the current post and take first 3
        const related = data.posts
          .filter((post: BlogPost) => post.id !== currentPostId)
          .slice(0, 3);

        setPosts(related);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, category]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  // No related posts
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">No related articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group bg-surface border border-border hover:border-gold-dim transition-all overflow-hidden"
        >
          {/* Image Container */}
          <div className="aspect-[16/10] relative overflow-hidden">
            {post.coverImageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${post.coverImageUrl}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted" />
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-gold text-black text-xs font-medium">
                {formatCategory(post.category)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-base text-white mb-2 group-hover:text-gold transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Read More Link */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors group/link"
            >
              Read Article
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
