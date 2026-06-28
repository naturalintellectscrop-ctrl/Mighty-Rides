"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Fuel, Gauge, Settings, Phone } from "lucide-react";
import { vehicles, Vehicle, contactInfo } from "@/lib/data";

interface FeaturedInventoryProps {
  onViewChange: (view: string) => void;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export function FeaturedInventory({ onViewChange, onVehicleSelect }: FeaturedInventoryProps) {
  const featuredVehicles = vehicles.filter(v => v.isFeatured && !v.isSold).slice(0, 4);

  const formatPrice = (price: number) => {
    if (price === 0) {
      return "Contact for Price";
    }
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 md:py-32 bg-[#0F0F10] relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C6A969]/3 rounded-full blur-[150px] translate-x-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
              Featured Vehicles
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Inventory
            </h2>
            <p className="text-[#8B8F96] text-lg max-w-xl">
              Premium vehicles available for sale. Contact us for specifications and pricing.
            </p>
          </div>
          <Button
            onClick={() => onViewChange("inventory")}
            variant="ghost"
            className="text-[#C6A969] hover:text-[#D4B87A] hover:bg-[#C6A969]/10 group"
          >
            View All Vehicles
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Vehicle Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle, index) => (
            <Card
              key={vehicle.id}
              className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => onVehicleSelect(vehicle)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-[#0F0F10] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#1A1C1F] flex items-center justify-center">
                    <Settings className="w-8 h-8 text-[#C6A969]/50" />
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#0F0F10]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                  >
                    View Details
                  </Button>
                </div>

                {/* Condition Badge */}
                {vehicle.condition === "New" && (
                  <Badge className="absolute top-3 left-3 bg-[#C6A969] text-[#0F0F10] text-xs">
                    New
                  </Badge>
                )}
              </div>

              <CardContent className="p-5">
                {/* Make & Model */}
                <div className="mb-3">
                  <p className="text-sm text-[#8B8F96] mb-1">{vehicle.make}</p>
                  <h3 className="text-lg font-semibold text-white truncate">
                    {vehicle.model} {vehicle.year}
                  </h3>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 text-xs text-[#8B8F96] mb-4">
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5" />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <p className={`text-lg font-bold ${vehicle.price === 0 ? 'text-[#C6A969]' : 'text-white'}`}>
                    {formatPrice(vehicle.price)}
                  </p>
                  <Badge variant="secondary" className="bg-[#0F0F10] text-[#8B8F96] text-xs">
                    {vehicle.bodyType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#8B8F96] mb-4">
            Interested in a specific vehicle? Contact us for details and pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call {contactInfo.phones[0]}
            </a>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in your vehicles for sale`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
