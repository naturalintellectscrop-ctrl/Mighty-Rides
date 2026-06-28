"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Play } from "lucide-react";
import { contactInfo } from "@/lib/data";

interface HeroSectionProps {
  onViewChange: (view: string) => void;
}

export function HeroSection({ onViewChange }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0F0F10]">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#0F0F10]/80 to-[#0F0F10] z-10" />
        
        {/* Premium Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-50" />
        
        {/* Subtle Gold Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C6A969]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C6A969]/3 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full px-4 md:px-6 lg:px-0 py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1C1F] border border-[#C6A969]/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-[#C6A969] animate-pulse" />
            <span className="text-sm text-[#8B8F96]">Premium Automotive Dealership in East Africa</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 animate-fade-up stagger-1">
            Where <span className="text-gradient-gold">Premium</span>
            <br />
            Meets Performance
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#8B8F96] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-2">
            Luxury vehicle sales, premium rentals, servicing, and vehicle sourcing. 
            Your trusted automotive partner in Kampala, Uganda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up stagger-3">
            <Button
              onClick={() => onViewChange("inventory")}
              className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] font-semibold px-8 py-6 text-base group"
            >
              <span>View Vehicles</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onViewChange("rentals")}
              variant="outline"
              className="border-border text-white hover:bg-white/5 hover:text-white px-8 py-6 text-base"
            >
              <Play className="w-4 h-4 mr-2" />
              <span>View Rentals</span>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 animate-fade-up stagger-4">
            {[
              { value: "Luxury", label: "Vehicle Sales" },
              { value: "Premium", label: "Car Rentals" },
              { value: "Expert", label: "Servicing & Parts" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C6A969] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#8B8F96] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => onViewChange("inventory")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#8B8F96] hover:text-white transition-colors animate-bounce"
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C6A969]/30 to-transparent" />
    </section>
  );
}
