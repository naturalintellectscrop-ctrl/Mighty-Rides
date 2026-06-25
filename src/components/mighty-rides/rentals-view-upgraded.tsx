"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, Plane, Briefcase, Crown, Calendar, Clock, 
  ArrowLeft, CheckCircle, Settings, Phone, Users, MapPin, Sparkles
} from "lucide-react";
import { rentalCategories, rentalVehicles, RentalVehicle, contactInfo } from "@/lib/data";

interface RentalsViewProps {
  onBack: () => void;
  onRentalSelect: (rental: RentalVehicle) => void;
}

const occasionConfig = {
  wedding: {
    icon: Heart,
    title: "Wedding",
    description: "Premium wedding vehicles for your special day",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  airport: {
    icon: Plane,
    title: "Airport Transfer",
    description: "VIP airport pickup and drop-off",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  corporate: {
    icon: Briefcase,
    title: "Executive Transport",
    description: "Professional corporate transport",
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
  },
  vip: {
    icon: Crown,
    title: "VIP Movement",
    description: "Discrete VIP transport services",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  events: {
    icon: Calendar,
    title: "Events",
    description: "Event and special occasion transport",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  longterm: {
    icon: Clock,
    title: "Long-term Rental",
    description: "Extended rental solutions",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
};

export function RentalsViewUpgraded({ onBack, onRentalSelect }: RentalsViewProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryRental, setInquiryRental] = useState<RentalVehicle | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "WhatsApp",
    occasion: "",
    startDate: "",
    endDate: "",
    duration: "",
    passengerCount: "",
    driverOption: "",
    eventDetails: "",
    message: "",
  });

  const filteredRentals = selectedOccasion
    ? rentalVehicles.filter((r) => {
        const categoryLower = r.category.toLowerCase().replace("-", "");
        const occasionLower = selectedOccasion.toLowerCase().replace("-", "");
        return categoryLower === occasionLower || 
               categoryLower.includes(occasionLower) ||
               occasionLower.includes(categoryLower);
      })
    : rentalVehicles;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/rentals/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiryData,
          rentalId: inquiryRental?.id,
        }),
      });
      
      if (response.ok) {
        setInquirySubmitted(true);
        fetch("/api/conversion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "Rental Inquiry",
            category: "Rental",
            source: "Rentals Page",
          }),
        });
        setTimeout(() => {
          setInquiryOpen(false);
          setInquirySubmitted(false);
          setInquiryData({
            name: "", email: "", phone: "", preferredContact: "WhatsApp",
            occasion: "", startDate: "", endDate: "", duration: "",
            passengerCount: "", driverOption: "", eventDetails: "", message: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    }
    
    setIsSubmitting(false);
  };

  const openInquiry = (rental: RentalVehicle, occasion?: string) => {
    setInquiryRental(rental);
    setInquiryData({
      ...inquiryData,
      occasion: occasion || rental.category,
    });
    setInquiryOpen(true);
  };

  const durationOptions = ["Hours", "Days", "Weeks", "Months"];

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
            Choose your occasion and we&apos;ll help you find the perfect vehicle. 
            From weddings to corporate events, we have you covered.
          </p>
        </div>

        {/* Occasion-Based Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">What&apos;s the Occasion?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(occasionConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              const isSelected = selectedOccasion === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedOccasion(isSelected ? null : key)}
                  className={`p-4 rounded-lg border transition-all text-center ${
                    isSelected
                      ? "bg-[#C6A969] border-[#C6A969] text-[#0F0F10]"
                      : `bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 text-white`
                  }`}
                >
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-[#0F0F10]" : config.color}`} />
                  <h3 className="font-medium text-sm">{config.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Occasion Details */}
        {selectedOccasion && occasionConfig[selectedOccasion as keyof typeof occasionConfig] && (
          <Card className="bg-[#1A1C1F] border border-[#C6A969]/30 mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {(() => {
                  const config = occasionConfig[selectedOccasion as keyof typeof occasionConfig];
                  const IconComponent = config.icon;
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{config.title} Services</h3>
                        <p className="text-sm text-[#8B8F96] mb-4">{config.description}</p>
                        <Button
                          onClick={() => {
                            setInquiryRental(null);
                            setInquiryData({ ...inquiryData, occasion: config.title });
                            setInquiryOpen(true);
                          }}
                          className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                        >
                          Inquire About {config.title} Services
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {selectedOccasion ? `${occasionConfig[selectedOccasion as keyof typeof occasionConfig]?.title} Vehicles` : "All Vehicles"}
            </h2>
            <Badge variant="outline" className="border-border text-[#8B8F96]">
              {filteredRentals.length} vehicles
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

      {/* Inquiry Modal */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#0F0F10] border-border">
          {inquirySubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-[#C6A969] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Inquiry Sent!</h3>
              <p className="text-[#8B8F96]">We&apos;ll contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">
                {inquiryRental ? `Inquire: ${inquiryRental.name}` : "Rental Inquiry"}
              </h2>
              {inquiryRental && (
                <p className="text-sm text-[#8B8F96] mb-6">
                  {inquiryRental.make} {inquiryRental.model} - {inquiryRental.category}
                </p>
              )}
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Full Name *</Label>
                    <Input 
                      required 
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      className="bg-[#1A1C1F] border-border text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Phone *</Label>
                    <Input 
                      required 
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className="bg-[#1A1C1F] border-border text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email *</Label>
                  <Input 
                    type="email" 
                    required 
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="bg-[#1A1C1F] border-border text-white" 
                  />
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  <Label className="text-white">Occasion *</Label>
                  <Select
                    value={inquiryData.occasion}
                    onValueChange={(value) => setInquiryData({ ...inquiryData, occasion: value })}
                  >
                    <SelectTrigger className="bg-[#1A1C1F] border-border text-white">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1C1F] border-border">
                      {Object.values(occasionConfig).map((config) => (
                        <SelectItem key={config.title} value={config.title} className="text-white">
                          {config.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Start Date</Label>
                    <Input 
                      type="date" 
                      value={inquiryData.startDate}
                      onChange={(e) => setInquiryData({ ...inquiryData, startDate: e.target.value })}
                      className="bg-[#1A1C1F] border-border text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">End Date</Label>
                    <Input 
                      type="date" 
                      value={inquiryData.endDate}
                      onChange={(e) => setInquiryData({ ...inquiryData, endDate: e.target.value })}
                      className="bg-[#1A1C1F] border-border text-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Duration</Label>
                    <Select
                      value={inquiryData.duration}
                      onValueChange={(value) => setInquiryData({ ...inquiryData, duration: value })}
                    >
                      <SelectTrigger className="bg-[#1A1C1F] border-border text-white">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1C1F] border-border">
                        {durationOptions.map((option) => (
                          <SelectItem key={option} value={option.toLowerCase()} className="text-white">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Passengers</Label>
                    <Input 
                      type="number" 
                      placeholder="Count"
                      value={inquiryData.passengerCount}
                      onChange={(e) => setInquiryData({ ...inquiryData, passengerCount: e.target.value })}
                      className="bg-[#1A1C1F] border-border text-white" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Driver Option</Label>
                  <Select
                    value={inquiryData.driverOption}
                    onValueChange={(value) => setInquiryData({ ...inquiryData, driverOption: value })}
                  >
                    <SelectTrigger className="bg-[#1A1C1F] border-border text-white">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1C1F] border-border">
                      <SelectItem value="with_driver" className="text-white">With Driver</SelectItem>
                      <SelectItem value="self_drive" className="text-white">Self Drive</SelectItem>
                      <SelectItem value="either" className="text-white">Either is fine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Event Details</Label>
                  <Input 
                    placeholder="Venue, special requirements..."
                    value={inquiryData.eventDetails}
                    onChange={(e) => setInquiryData({ ...inquiryData, eventDetails: e.target.value })}
                    className="bg-[#1A1C1F] border-border text-white" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Additional Message</Label>
                  <Textarea 
                    rows={3} 
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    className="bg-[#1A1C1F] border-border text-white resize-none" 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
