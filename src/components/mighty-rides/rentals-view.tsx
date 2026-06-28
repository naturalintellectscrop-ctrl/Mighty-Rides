"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, Plane, Briefcase, Crown, Calendar, Clock, 
  ArrowLeft, CheckCircle, Settings, Phone
} from "lucide-react";
import { rentalCategories, rentalVehicles, RentalVehicle, contactInfo } from "@/lib/data";

interface RentalsViewProps {
  onBack: () => void;
  onRentalSelect: (rental: RentalVehicle) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Heart: Heart,
  Plane: Plane,
  Briefcase: Briefcase,
  Crown: Crown,
  Calendar: Calendar,
  Clock: Clock,
};

export function RentalsView({ onBack, onRentalSelect }: RentalsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryRental, setInquiryRental] = useState<RentalVehicle | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const filteredRentals = selectedCategory
    ? rentalVehicles.filter((r) => r.category.toLowerCase().replace("-", "") === selectedCategory || r.category === selectedCategory)
    : rentalVehicles;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryOpen(false);
      setInquirySubmitted(false);
    }, 2000);
  };

  const openInquiry = (rental: RentalVehicle) => {
    setInquiryRental(rental);
    setInquiryOpen(true);
  };

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Premium Rentals
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Luxury car rentals for weddings, corporate events, VIP transport, and more.
            Contact us for rates and availability.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null 
              ? "bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]" 
              : "border-border text-white hover:bg-white/5"
            }
          >
            All Categories
          </Button>
          {rentalCategories.map((category) => {
            const IconComponent = categoryIcons[category.icon] || Heart;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]" 
                  : "border-border text-white hover:bg-white/5"
                }
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Rental Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredRentals.map((rental) => (
            <Card
              key={rental.id}
              className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all overflow-hidden group cursor-pointer"
              onClick={() => onRentalSelect(rental)}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-[#0F0F10]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#1A1C1F] border border-[#C6A969]/30 flex items-center justify-center">
                    <Settings className="w-7 h-7 text-[#C6A969]/50" />
                  </div>
                </div>
                
                <Badge className="absolute top-3 left-3 bg-[#C6A969] text-[#0F0F10]">
                  {rental.category}
                </Badge>
                
                {rental.isAvailable && (
                  <Badge className="absolute top-3 right-3 bg-[#0F0F10]/80 text-green-400 border border-green-400/30">
                    Available
                  </Badge>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#0F0F10]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]">
                    View Details
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#C6A969] transition-colors">
                  {rental.name}
                </h3>
                <p className="text-sm text-[#8B8F96] mb-4">
                  {rental.make} {rental.model} {rental.year}
                </p>

                <p className="text-sm text-[#8B8F96] mb-6 line-clamp-2">
                  {rental.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {rental.features.slice(0, 3).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-border text-[#8B8F96] text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <Button
                    onClick={() => openInquiry(rental)}
                    className="flex-1 bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                  >
                    Inquire
                  </Button>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in the ${rental.name} rental`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="max-w-md bg-[#0F0F10] border-border">
          {inquirySubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-[#C6A969] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Inquiry Sent!</h3>
              <p className="text-[#8B8F96]">We&apos;ll contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Rental Inquiry</h2>
              {inquiryRental && (
                <p className="text-sm text-[#8B8F96] mb-6">
                  {inquiryRental.name} - {inquiryRental.make} {inquiryRental.model}
                </p>
              )}
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Full Name</Label>
                  <Input required className="bg-[#1A1C1F] border-border text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Phone</Label>
                    <Input required className="bg-[#1A1C1F] border-border text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email</Label>
                    <Input type="email" required className="bg-[#1A1C1F] border-border text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Start Date</Label>
                    <Input type="date" className="bg-[#1A1C1F] border-border text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">End Date</Label>
                    <Input type="date" className="bg-[#1A1C1F] border-border text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Message (Optional)</Label>
                  <Textarea rows={3} className="bg-[#1A1C1F] border-border text-white resize-none" />
                </div>
                <Button type="submit" className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]">
                  Submit Inquiry
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
