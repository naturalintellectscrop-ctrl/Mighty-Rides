"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Plane, Briefcase, Crown, Calendar, Clock, ArrowRight, Settings } from "lucide-react";
import { rentalCategories, contactInfo } from "@/lib/data";

interface RentalsPreviewProps {
  onViewChange: (view: string) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Heart: Heart,
  Plane: Plane,
  Briefcase: Briefcase,
  Crown: Crown,
  Calendar: Calendar,
  Clock: Clock,
};

export function RentalsPreview({ onViewChange }: RentalsPreviewProps) {
  return (
    <section className="py-20 md:py-32 bg-[#1A1C1F] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-pattern opacity-30" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            Premium Rentals
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Luxury for Every Occasion
          </h2>
          <p className="text-[#8B8F96] text-lg max-w-2xl mx-auto">
            Premium car rentals for weddings, corporate events, VIP transport, and more.
            Contact us for rates and availability.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rentalCategories.map((category, index) => {
            const IconComponent = categoryIcons[category.icon] || Heart;
            return (
              <Card
                key={category.id}
                className="bg-[#0F0F10] border-border hover:border-[#C6A969]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => onViewChange("rentals")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#C6A969]/10 flex items-center justify-center group-hover:bg-[#C6A969]/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-[#C6A969]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#C6A969] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[#8B8F96]">
                        {category.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#8B8F96] group-hover:text-[#C6A969] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-[#0F0F10] rounded-2xl border border-border overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Premium Vehicle?
            </h3>
            <p className="text-[#8B8F96] max-w-xl mx-auto mb-8">
              Contact us for rental rates and availability. We offer flexible options 
              for weddings, corporate events, VIP transport, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Call {contactInfo.phones[0]}
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in your rental services`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
