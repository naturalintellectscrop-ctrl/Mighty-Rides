"use client";

import { useState } from "react";
import { Vehicle, contactInfo } from "@/lib/data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  X, Phone, Fuel, Gauge, Settings, Calendar, 
  Palette, Car, ChevronLeft, ChevronRight, Settings2,
  Crown, CheckCircle, Shield, Clock
} from "lucide-react";

interface VehicleDetailModalUpgradedProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetailModalUpgraded({ vehicle, open, onOpenChange }: VehicleDetailModalUpgradedProps) {
  const [showConcierge, setShowConcierge] = useState(false);
  const [conciergeType, setConciergeType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "WhatsApp",
    purchaseTimeline: "",
    budgetRange: "",
    message: "",
  });

  if (!vehicle) return null;

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

  const specs = [
    { icon: Settings2, label: "Engine", value: vehicle.engine },
    { icon: Settings, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
    { icon: Calendar, label: "Year", value: vehicle.year.toString() },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Car, label: "Body Type", value: vehicle.bodyType },
  ];

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle.id,
          requestType: conciergeType,
          preferredVehicle: `${vehicle.make} ${vehicle.model}`,
        }),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        fetch("/api/conversion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "Concierge Request",
            category: "Sales",
            source: "Vehicle Detail Modal",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
    
    setIsSubmitting(false);
  };

  const resetModal = () => {
    setShowConcierge(false);
    setConciergeType("");
    setIsSubmitted(false);
    setFormData({
      name: "", email: "", phone: "", preferredContact: "WhatsApp",
      purchaseTimeline: "", budgetRange: "", message: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F10] border-border p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F10]/95 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8B8F96]">{vehicle.make}</p>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {vehicle.model} {vehicle.year}
              </h2>
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
            <div className="w-32 h-32 rounded-full bg-[#0F0F10] border border-[#C6A969]/30 flex items-center justify-center">
              <Car className="w-14 h-14 text-[#C6A969]/30" />
            </div>
          </div>
          
          {/* Navigation Arrows */}
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

          {/* Condition Badge */}
          <Badge className="absolute top-4 left-4 bg-[#C6A969] text-[#0F0F10]">
            {vehicle.condition}
          </Badge>
          
          {/* Premium Badge */}
          {vehicle.isFeatured && (
            <Badge className="absolute top-4 right-4 bg-[#0F0F10]/80 text-[#C6A969] border border-[#C6A969]/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Trust Reassurance */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-[#1A1C1F] border border-border">
            <Shield className="w-5 h-5 text-[#C6A969]" />
            <span className="text-sm text-[#8B8F96]">
              Professional support available before and after purchase
            </span>
          </div>

          {!showConcierge ? (
            <>
              {/* Price & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-[#8B8F96] mb-1">Price</p>
                  <p className={`text-3xl md:text-4xl font-bold ${vehicle.price === 0 ? 'text-[#C6A969]' : 'text-white'}`}>
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </div>

              {/* Premium CTAs */}
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <Button
                  onClick={() => {
                    setConciergeType("Private Viewing");
                    setShowConcierge(true);
                  }}
                  variant="outline"
                  className="h-auto py-4 flex-col border-[#C6A969]/30 hover:bg-[#C6A969]/10"
                >
                  <Calendar className="w-5 h-5 text-[#C6A969] mb-2" />
                  <span className="text-white font-medium">Request Private Viewing</span>
                  <span className="text-xs text-[#8B8F96]">Schedule at your convenience</span>
                </Button>
                <Button
                  onClick={() => {
                    setConciergeType("Advisor Consultation");
                    setShowConcierge(true);
                  }}
                  variant="outline"
                  className="h-auto py-4 flex-col border-[#C6A969]/30 hover:bg-[#C6A969]/10"
                >
                  <Phone className="w-5 h-5 text-[#C6A969] mb-2" />
                  <span className="text-white font-medium">Speak to Advisor</span>
                  <span className="text-xs text-[#8B8F96]">Get expert guidance</span>
                </Button>
                <Button
                  onClick={() => {
                    setConciergeType("Concierge Purchase");
                    setShowConcierge(true);
                  }}
                  className="h-auto py-4 flex-col bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                >
                  <Crown className="w-5 h-5 mb-2" />
                  <span className="font-medium">Start Concierge Purchase</span>
                  <span className="text-xs opacity-70">Full premium service</span>
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="flex gap-3 mb-8">
                <a
                  href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in the ${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-[#8B8F96] leading-relaxed">{vehicle.description}</p>
              </div>

              <Separator className="bg-border my-8" />

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specs.map((spec, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-[#1A1C1F] border border-border"
                    >
                      <spec.icon className="w-5 h-5 text-[#C6A969] mb-2" />
                      <p className="text-xs text-[#8B8F96] mb-1">{spec.label}</p>
                      <p className="text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border my-8" />

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
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
            </>
          ) : (
            /* Concierge Form */
            <div className="py-4">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-[#C6A969] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Request Submitted!</h3>
                  <p className="text-[#8B8F96] mb-6">
                    Our team will contact you within 24 hours to arrange your {conciergeType.toLowerCase()}.
                  </p>
                  <Button
                    onClick={resetModal}
                    variant="outline"
                    className="border-[#C6A969]/30 text-[#C6A969] hover:bg-[#C6A969]/10"
                  >
                    Back to Vehicle
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      onClick={resetModal}
                      className="text-[#8B8F96] hover:text-white -ml-4"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>
                  
                  <Badge className="bg-[#C6A969] text-[#0F0F10] mb-4">
                    {conciergeType}
                  </Badge>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </h3>
                  <p className="text-[#8B8F96] mb-6">Complete the form below and our team will contact you.</p>
                  
                  <form onSubmit={handleConciergeSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Full Name *</Label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-[#1A1C1F] border-border text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Phone *</Label>
                        <Input
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-[#1A1C1F] border-border text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Email *</Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#1A1C1F] border-border text-white"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Purchase Timeline</Label>
                        <Select
                          value={formData.purchaseTimeline}
                          onValueChange={(value) => setFormData({ ...formData, purchaseTimeline: value })}
                        >
                          <SelectTrigger className="bg-[#1A1C1F] border-border text-white">
                            <SelectValue placeholder="When?" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1C1F] border-border">
                            <SelectItem value="Immediate" className="text-white">Immediate</SelectItem>
                            <SelectItem value="1-2 weeks" className="text-white">1-2 weeks</SelectItem>
                            <SelectItem value="1-3 months" className="text-white">1-3 months</SelectItem>
                            <SelectItem value="Just exploring" className="text-white">Just exploring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Preferred Contact</Label>
                        <Select
                          value={formData.preferredContact}
                          onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                        >
                          <SelectTrigger className="bg-[#1A1C1F] border-border text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1C1F] border-border">
                            <SelectItem value="WhatsApp" className="text-white">WhatsApp</SelectItem>
                            <SelectItem value="Phone" className="text-white">Phone Call</SelectItem>
                            <SelectItem value="Email" className="text-white">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Message (Optional)</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any specific questions or requirements..."
                        rows={3}
                        className="bg-[#1A1C1F] border-border text-white resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] py-6"
                    >
                      {isSubmitting ? "Submitting..." : `Submit ${conciergeType} Request`}
                    </Button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!showConcierge && (
          <div className="sticky bottom-0 bg-[#0F0F10]/95 backdrop-blur-lg border-t border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#8B8F96]">
                Vehicle ID: <span className="text-white">{vehicle.id}</span>
              </p>
              <Button 
                onClick={() => {
                  setConciergeType("Private Viewing");
                  setShowConcierge(true);
                }}
                className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
              >
                Schedule Viewing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
