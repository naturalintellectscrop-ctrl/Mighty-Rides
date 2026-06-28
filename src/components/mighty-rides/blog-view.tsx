"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, ArrowRight, Search } from "lucide-react";
import { blogPosts } from "@/lib/data";

interface BlogViewProps {
  onBack: () => void;
  onArticleSelect: (article: typeof blogPosts[0]) => void;
}

const categories = ["All", "Buying Guide", "Maintenance", "Premium Ownership", "Imports", "Rental Insights"];

export function BlogView({ onBack, onArticleSelect }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="min-h-screen bg-[#0F0F10] pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#8B8F96] hover:text-white mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            Insights & Guides
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Automotive Insights
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Expert guides, buying tips, and industry insights to help you make informed decisions 
            about your next premium vehicle.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8F96]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1C1F] border border-border text-white placeholder:text-[#8B8F96] focus:border-[#C6A969]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category
                  ? "bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                  : "border-border text-white hover:bg-white/5"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card
            className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all overflow-hidden mb-12 cursor-pointer group"
            onClick={() => onArticleSelect(filteredPosts[0])}
          >
            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-[#0F0F10] to-[#1A1C1F]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#0F0F10] border border-[#C6A969]/30 flex items-center justify-center">
                    <span className="text-3xl">📖</span>
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-[#C6A969] text-[#0F0F10]">
                  Featured
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] w-fit mb-4">
                  {filteredPosts[0].category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#C6A969] transition-colors">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-[#8B8F96] mb-6 leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-[#8B8F96] mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{filteredPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(filteredPosts[0].publishedAt).toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <Button className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] w-fit group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 1 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all overflow-hidden cursor-pointer group"
                onClick={() => onArticleSelect(post)}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-[#0F0F10] to-[#1A1C1F]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#0F0F10] border border-[#C6A969]/30 flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#C6A969] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#8B8F96] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#8B8F96]">
                    <span>{post.author}</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-[#8B8F96]/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
            <p className="text-[#8B8F96] mb-6">Try adjusting your search or filter</p>
            <Button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
            >
              Clear Filters
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
