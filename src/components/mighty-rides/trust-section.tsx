"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Clock, Users, CheckCircle, Star } from "lucide-react";

export function TrustSection() {
  const trustPoints = [
    {
      icon: Shield,
      title: "Verified Quality",
      description: "Every vehicle undergoes thorough inspection before sale.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Professional team with extensive automotive expertise.",
    },
    {
      icon: Clock,
      title: "Reliable Support",
      description: "Dedicated support before and after your purchase.",
    },
    {
      icon: Award,
      title: "Premium Standards",
      description: "Committed to excellence in every transaction.",
    },
  ];

  const buyerBenefits = [
    "Professional guidance throughout your buying journey",
    "Transparent pricing and documentation",
    "Quality-assured vehicles",
    "After-sale support and service options",
    "Flexible viewing appointments",
    "Expert advice on vehicle selection",
  ];

  return (
    <section className="py-20 md:py-32 bg-[#1A1C1F]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Buyer Confidence
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Buyers Trust Mighty Rides
          </h2>
          <p className="text-[#8B8F96] text-lg max-w-2xl mx-auto">
            We&apos;re committed to providing a premium, trustworthy experience 
            for every customer.
          </p>
        </div>

        {/* Trust Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustPoints.map((point, index) => (
            <Card key={index} className="bg-[#0F0F10] border-border hover:border-[#C6A969]/30 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-7 h-7 text-[#C6A969]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-sm text-[#8B8F96]">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Buyer Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">
              Premium Buying Support
            </h3>
            <div className="space-y-4">
              {buyerBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C6A969] mt-0.5" />
                  <span className="text-[#8B8F96]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-[#0F0F10] border border-[#C6A969]/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-[#C6A969]" />
                <h4 className="text-xl font-semibold text-white">Our Commitment</h4>
              </div>
              <p className="text-[#8B8F96] mb-6">
                At Mighty Rides, we believe in building lasting relationships with our customers. 
                From your first inquiry to years after your purchase, we&apos;re here to support 
                your automotive journey.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-[#1A1C1F]">
                  <p className="text-2xl font-bold text-[#C6A969]">Premium</p>
                  <p className="text-xs text-[#8B8F96]">Vehicle Selection</p>
                </div>
                <div className="p-4 rounded-lg bg-[#1A1C1F]">
                  <p className="text-2xl font-bold text-[#C6A969]">Dedicated</p>
                  <p className="text-xs text-[#8B8F96]">Customer Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reassurance Block */}
        <div className="mt-16 p-8 rounded-lg bg-[#0F0F10] border border-border text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            Ready to Find Your Next Vehicle?
          </h3>
          <p className="text-[#8B8F96] mb-6 max-w-2xl mx-auto">
            Visit us at Mirembe Business Centre, Lugogo Bypass, Kampala. Our team is ready 
            to assist you with professional guidance and premium service.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 rounded-full bg-[#1A1C1F] text-sm text-[#8B8F96]">
              Professional Team
            </span>
            <span className="px-4 py-2 rounded-full bg-[#1A1C1F] text-sm text-[#8B8F96]">
              Quality Vehicles
            </span>
            <span className="px-4 py-2 rounded-full bg-[#1A1C1F] text-sm text-[#8B8F96]">
              After-Sale Support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
