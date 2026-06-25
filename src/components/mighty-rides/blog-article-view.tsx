"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin } from "lucide-react";
import { blogPosts } from "@/lib/data";

interface BlogArticleViewProps {
  article: typeof blogPosts[0];
  onBack: () => void;
  onArticleSelect: (article: typeof blogPosts[0]) => void;
}

export function BlogArticleView({ article, onBack, onArticleSelect }: BlogArticleViewProps) {
  const currentIndex = blogPosts.findIndex(p => p.id === article.id);
  const prevArticle = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextArticle = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const relatedArticles = blogPosts.filter(p => p.id !== article.id && p.category === article.category).slice(0, 2);

  // Mock article content - in production this would come from CMS
  const articleContent = `
    <p class="text-lg text-[#8B8F96] leading-relaxed mb-6">
      ${article.excerpt}
    </p>
    
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Introduction</h2>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      When it comes to purchasing a luxury vehicle in Uganda, there are several important factors to consider. 
      The market has evolved significantly over the past decade, with more options available than ever before. 
      Understanding the nuances of this market can save you time, money, and potential headaches down the road.
    </p>
    
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Key Considerations</h2>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      The first step in any luxury vehicle purchase is understanding your specific needs. Are you looking for 
      a daily driver that makes a statement? A weekend cruiser? A family vehicle that doesn't compromise on style? 
      Each of these use cases will lead you down a different path.
    </p>
    
    <h3 class="text-xl font-semibold text-white mb-3 mt-6">1. Budget Planning</h3>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      Luxury vehicles come with luxury price tags, but the purchase price is just the beginning. 
      Consider ongoing costs such as insurance, maintenance, fuel, and potential repairs. 
      A good rule of thumb is to budget an additional 10-15% of the vehicle's value annually for these expenses.
    </p>
    
    <h3 class="text-xl font-semibold text-white mb-3 mt-6">2. Import vs Local Purchase</h3>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      Uganda's import regulations and taxes significantly impact the final price of imported vehicles. 
      Purchasing from a reputable local dealer like Mighty Rides offers several advantages: 
      the vehicle has already cleared customs, you can inspect it in person, and you have local support 
      for any issues that may arise.
    </p>
    
    <h3 class="text-xl font-semibold text-white mb-3 mt-6">3. Vehicle History & Inspection</h3>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      Always request a comprehensive vehicle history report and have an independent inspection performed. 
      At Mighty Rides, we provide detailed inspection reports for every vehicle in our inventory, 
      giving you complete transparency about its condition.
    </p>
    
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Making Your Decision</h2>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      Take your time with the decision. Visit the showroom, test drive multiple vehicles, and don't be 
      afraid to ask questions. A reputable dealer will welcome your due diligence and provide all the 
      information you need to make an informed decision.
    </p>
    
    <blockquote class="border-l-4 border-[#C6A969] pl-6 py-2 my-8 bg-[#1A1C1F] rounded-r-lg">
      <p class="text-lg text-white italic mb-2">
        "The best luxury vehicle purchase is one where you feel confident about every aspect of the transaction."
      </p>
      <cite class="text-[#8B8F96] text-sm">— Mighty Rides Team</cite>
    </blockquote>
    
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Conclusion</h2>
    <p class="text-[#8B8F96] leading-relaxed mb-6">
      Purchasing a luxury vehicle is an exciting journey. With proper research and the right partner, 
      you can find the perfect vehicle that meets your needs and exceeds your expectations. 
      Visit Mighty Rides today to explore our curated selection of premium vehicles.
    </p>
  `;

  return (
    <section className="min-h-screen bg-[#0F0F10] pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#8B8F96] hover:text-white mb-8 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
              {article.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#8B8F96] mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1C1F] to-[#0F0F10] mb-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#1A1C1F] border border-[#C6A969]/30 flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#8B8F96] text-sm">Share this article:</span>
                  <Button variant="ghost" size="icon" className="text-[#8B8F96] hover:text-[#C6A969]">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-[#8B8F96] hover:text-[#C6A969]">
                    <Twitter className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-[#8B8F96] hover:text-[#C6A969]">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-[#8B8F96] hover:text-[#C6A969]">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                <Button variant="ghost" className="text-[#8B8F96] hover:text-[#C6A969]">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Article
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <button
                  onClick={() => onArticleSelect(prevArticle)}
                  className="p-6 rounded-xl bg-[#1A1C1F] border border-border hover:border-[#C6A969]/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 text-[#8B8F96] text-sm mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    Previous Article
                  </div>
                  <p className="text-white font-medium group-hover:text-[#C6A969] transition-colors line-clamp-2">
                    {prevArticle.title}
                  </p>
                </button>
              ) : <div />}
              {nextArticle && (
                <button
                  onClick={() => onArticleSelect(nextArticle)}
                  className="p-6 rounded-xl bg-[#1A1C1F] border border-border hover:border-[#C6A969]/30 transition-all text-right group"
                >
                  <div className="flex items-center justify-end gap-2 text-[#8B8F96] text-sm mb-2">
                    Next Article
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <p className="text-white font-medium group-hover:text-[#C6A969] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <button
                        key={related.id}
                        onClick={() => onArticleSelect(related)}
                        className="w-full text-left group"
                      >
                        <p className="text-sm text-[#C6A969] mb-1">{related.category}</p>
                        <p className="text-white font-medium group-hover:text-[#C6A969] transition-colors line-clamp-2">
                          {related.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-br from-[#C6A969]/20 to-[#1A1C1F] border border-[#C6A969]/30">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Find Your Dream Car?</h3>
                <p className="text-sm text-[#8B8F96] mb-4">
                  Explore our curated selection of premium vehicles.
                </p>
                <Button className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]">
                  View Inventory
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {["Buying Guide", "Maintenance", "Premium Ownership", "Imports", "Rental Insights"].map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="border-border text-[#8B8F96] hover:border-[#C6A969]/30 hover:text-[#C6A969] cursor-pointer transition-colors"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
