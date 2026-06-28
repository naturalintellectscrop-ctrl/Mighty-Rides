"use client";

import { RentalVehicle, contactInfo } from "@/lib/data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Phone, ChevronLeft, ChevronRight, CheckCircle, Calendar, Users, Fuel, Settings, Settings2 } from "lucide-react";

interface RentalDetailModalProps {
  rental: RentalVehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RentalDetailModal({ rental, open, onOpenChange }: RentalDetailModalProps) {
  if (!rental) return null;

  const useCases: Record<string, string[]> = {
    "Wedding": ["Bridal transport", "VIP guest pickup", "Photo shoots", "Reception arrivals"],
    "Airport Pickup": ["Executive arrivals", "Corporate delegations", "Family transfers", "VIP meet & greet"],
    "Corporate": ["Client pickups", "Executive meetings", "Business travel", "Conferences"],
    "VIP": ["Dignitary transport", "High-profile events", "Secure travel", "Discrete service"],
    "Events": ["Galas & ceremonies", "Award shows", "Premieres", "Private functions"],
    "Long-term": ["Expatriate assignments", "Project vehicles", "Corporate fleets", "Extended travel"],
  };

  const terms = [
    "Valid driver's license required",
    "Security deposit may apply",
    "Comprehensive insurance available",
    "24/7 support available",
    "Flexible rental terms",
    "Additional driver options available",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F10] border-border p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F10]/95 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-2">
                {rental.category}
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {rental.name}
              </h2>
              <p className="text-sm text-[#8B8F96]">{rental.make} {rental.model} {rental.year}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-[#8B8F96] hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative aspect-[16/9] bg-[#1A1C1F]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#0F0F10] border border-[#C6A969]/30 flex items-center justify-center">
              <Settings2 className="w-10 h-10 text-[#C6A969]/50" />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0F0F10]/50 text-white hover:bg-[#0F0F10]/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0F0F10]/50 text-white hover:bg-[#0F0F10]/80"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {rental.isAvailable && (
            <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-400/30">
              Available Now
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Pricing Notice */}
          <div className="bg-[#1A1C1F] rounded-xl p-6 border border-border mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Rental Rates</h3>
            <p className="text-[#C6A969] text-lg font-medium mb-3">
              Contact us for pricing and availability
            </p>
            <p className="text-[#8B8F96] text-sm">
              Rates vary based on rental duration, occasion, and specific requirements. 
              Contact us for a personalized quote.
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">About This Vehicle</h3>
            <p className="text-[#8B8F96] leading-relaxed">{rental.description}</p>
          </div>

          <Separator className="bg-border my-8" />

          {/* Use Cases */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Perfect For</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(useCases[rental.category] || useCases["Events"]).map((useCase, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1C1F]">
                  <CheckCircle className="w-4 h-4 text-[#C6A969] shrink-0" />
                  <span className="text-sm text-white">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border my-8" />

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Included Features</h3>
            <div className="flex flex-wrap gap-2">
              {rental.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-[#C6A969]/30 text-[#8B8F96] px-3 py-1"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-border my-8" />

          {/* Terms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Rental Terms</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {terms.map((term, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#C6A969] shrink-0" />
                  <span className="text-sm text-[#8B8F96]">{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-[#1A1C1F] border border-border text-center">
              <Calendar className="w-5 h-5 text-[#C6A969] mx-auto mb-2" />
              <p className="text-sm text-white">{rental.year}</p>
              <p className="text-xs text-[#8B8F96]">Year</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1A1C1F] border border-border text-center">
              <Users className="w-5 h-5 text-[#C6A969] mx-auto mb-2" />
              <p className="text-sm text-white">4+</p>
              <p className="text-xs text-[#8B8F96]">Seats</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1A1C1F] border border-border text-center">
              <Settings className="w-5 h-5 text-[#C6A969] mx-auto mb-2" />
              <p className="text-sm text-white">Auto</p>
              <p className="text-xs text-[#8B8F96]">Trans.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1A1C1F] border border-border text-center">
              <Fuel className="w-5 h-5 text-[#C6A969] mx-auto mb-2" />
              <p className="text-sm text-white">Petrol</p>
              <p className="text-xs text-[#8B8F96]">Fuel</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0F0F10]/95 backdrop-blur-lg border-t border-border px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#8B8F96] hidden sm:block">
              Interested? Book now or contact us for availability.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <a
                href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in renting the ${rental.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
