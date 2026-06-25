"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Sparkles, Search, Car, Package, ClipboardCheck, ArrowRight } from "lucide-react";
import { services } from "@/lib/data";

interface ServicesSectionProps {
  onViewChange: (view: string) => void;
}

const serviceIcons: Record<string, React.ElementType> = {
  Wrench: Wrench,
  Sparkles: Sparkles,
  Search: Search,
  Car: Car,
  Package: Package,
  ClipboardCheck: ClipboardCheck,
};

export function ServicesSection({ onViewChange }: ServicesSectionProps) {
  const featuredServices = services.filter(s => s.isFeatured);

  return (
    <section className="py-20 md:py-32 bg-[#0F0F10] relative">
      {/* Background */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#C6A969]/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete Automotive Care
          </h2>
          <p className="text-[#8B8F96] text-lg max-w-2xl mx-auto">
            Beyond sales and rentals, we offer comprehensive automotive services 
            to keep your vehicle in peak condition.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredServices.map((service) => {
            const IconComponent = serviceIcons[service.icon] || Wrench;
            return (
              <Card
                key={service.id}
                className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => onViewChange("services")}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-[#C6A969]/10 flex items-center justify-center mb-5 group-hover:bg-[#C6A969]/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-[#C6A969]" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#C6A969] transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm text-[#8B8F96] mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center text-[#C6A969] text-sm font-medium group-hover:text-[#D4B87A] transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Source a Car CTA */}
        <div className="bg-gradient-to-r from-[#1A1C1F] to-[#0F0F10] rounded-2xl border border-border overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Can&apos;t Find What You&apos;re Looking For?
              </h3>
              <p className="text-[#8B8F96] max-w-xl">
                Our global network can source any vehicle to your exact specifications. 
                From rare classics to the latest releases, we&apos;ll find your dream car.
              </p>
            </div>
            <Button
              onClick={() => onViewChange("sourcing")}
              className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] px-8 py-6 text-base whitespace-nowrap"
            >
              Source a Car
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
