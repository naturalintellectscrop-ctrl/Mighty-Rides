"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, CheckCircle, Wrench, Package, ClipboardCheck, 
  HelpCircle, Calendar, Clock, Phone, MessageSquare, Shield
} from "lucide-react";
import { contactInfo } from "@/lib/data";

interface AfterSaleViewProps {
  onBack: () => void;
}

export function AfterSaleView({ onBack }: AfterSaleViewProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehiclePurchased: "",
    requestType: "",
    urgency: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/after-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        fetch("/api/conversion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "After-sale Request",
            category: "Service",
            source: "After-sale Support Page",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };

  const serviceTypes = [
    {
      id: "service",
      icon: Wrench,
      title: "Book a Service",
      description: "Schedule a service appointment for your vehicle.",
    },
    {
      id: "parts",
      icon: Package,
      title: "Request Parts",
      description: "Order spare parts for your vehicle.",
    },
    {
      id: "maintenance",
      icon: ClipboardCheck,
      title: "Maintenance Support",
      description: "Get help with ongoing maintenance needs.",
    },
    {
      id: "ownership",
      icon: HelpCircle,
      title: "Ownership Assistance",
      description: "Questions about your vehicle or ownership.",
    },
  ];

  const urgencyLevels = [
    { value: "Urgent", label: "Urgent - Need help today" },
    { value: "Standard", label: "Standard - Within a few days" },
    { value: "Scheduled", label: "Scheduled - Planning ahead" },
  ];

  const timeSlots = [
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 3:00 PM)",
    "Evening (3:00 PM - 6:00 PM)",
  ];

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-[#0F0F10] pt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#8B8F96] hover:text-white mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-[#C6A969]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Request Received
            </h1>
            <p className="text-[#8B8F96] text-lg mb-8">
              Thank you for reaching out. Our service team will contact you shortly 
              to confirm your appointment or address your request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=I need after-sale support for my vehicle`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-[#C6A969] text-[#0F0F10]">
              <Shield className="w-3 h-3 mr-1" />
              Owner Support
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            After-Sale Support
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            We&apos;re here to support you throughout your ownership journey. 
            Book services, request parts, or get assistance with your vehicle.
          </p>
        </div>

        {/* Service Selection */}
        {!selectedService ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {serviceTypes.map((service) => (
              <Card
                key={service.id}
                className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedService(service.id);
                  setFormData({ ...formData, requestType: service.title });
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C6A969]/20 transition-colors">
                    <service.icon className="w-8 h-8 text-[#C6A969]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-[#C6A969] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#8B8F96]">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 pb-20">
            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedService(null)}
                    className="text-[#8B8F96] hover:text-white -ml-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-6">
                  {serviceTypes.find(s => s.id === selectedService)?.title}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name *</Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Phone *</Label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#0F0F10] border-border text-white"
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
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Vehicle</Label>
                    <Input
                      value={formData.vehiclePurchased}
                      onChange={(e) => setFormData({ ...formData, vehiclePurchased: e.target.value })}
                      placeholder="e.g., 2023 Mercedes S-Class"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="How urgent is your request?" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value} className="text-white">
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedService === "service" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Preferred Date</Label>
                        <Input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="bg-[#0F0F10] border-border text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Preferred Time</Label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
                        >
                          <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0F0F10] border-border">
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot} className="text-white">
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-white">Details</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your request or concern..."
                      rows={4}
                      className="bg-[#0F0F10] border-border text-white resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] py-6"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">What to Expect</h3>
                  <ul className="space-y-4">
                    {[
                      "Quick response from our service team",
                      "Professional service by trained technicians",
                      "Quality parts and materials",
                      "Clear communication throughout",
                      "Convenient scheduling options",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#C6A969] mt-0.5" />
                        <span className="text-[#8B8F96]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-4">Service Hours</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B8F96]">Monday - Friday</span>
                      <span className="text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B8F96]">Saturday</span>
                      <span className="text-white">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B8F96]">Sunday</span>
                      <span className="text-white">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-4">Need Immediate Help?</h4>
                  <div className="flex gap-3">
                    <a
                      href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp}?text=I need after-sale support`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
