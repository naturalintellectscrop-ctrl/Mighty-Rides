"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Clock, Users } from "lucide-react";
import { testimonials } from "@/lib/data";

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-[#1A1C1F] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#C6A969]/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built on Trust
          </h2>
          <p className="text-[#8B8F96] text-lg max-w-2xl mx-auto">
            Mighty Rides is a premium automotive dealership committed to quality, 
            transparency, and exceptional service.
          </p>
        </div>

        {/* Trust Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: Shield, 
              title: "Trust & Integrity", 
              description: "Transparent transactions and honest advice in every interaction." 
            },
            { 
              icon: Award, 
              title: "Premium Quality", 
              description: "Carefully selected vehicles and premium service standards." 
            },
            { 
              icon: Clock, 
              title: "Reliable Service", 
              description: "Consistent, dependable service you can count on." 
            },
            { 
              icon: Users, 
              title: "Client Focus", 
              description: "Your satisfaction drives everything we do." 
            },
          ].map((value, index) => (
            <Card key={index} className="bg-[#0F0F10] border-border">
              <CardContent className="p-6 text-center">
                <value.icon className="w-10 h-10 text-[#C6A969] mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">{value.title}</h4>
                <p className="text-sm text-[#8B8F96]">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Overview */}
        <div className="bg-[#0F0F10] rounded-2xl border border-border overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Our Core Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Luxury Car Sales",
                "Premium Car Rentals", 
                "Vehicle Servicing & Maintenance",
                "Body Kits & Customization",
                "Spare Parts",
                "Vehicle Sourcing",
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#1A1C1F] border border-border"
                >
                  <div className="w-2 h-2 rounded-full bg-[#C6A969]" />
                  <span className="text-white font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
