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
  ArrowLeft, CheckCircle, ArrowRightLeft, Car, DollarSign, 
  Shield, Star, Phone, MessageSquare, Sparkles
} from "lucide-react";
import { contactInfo } from "@/lib/data";

interface TradeInViewProps {
  onBack: () => void;
}

export function TradeInView({ onBack }: TradeInViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "WhatsApp",
    
    // Current Vehicle
    currentMake: "",
    currentModel: "",
    currentYear: "",
    currentMileage: "",
    currentCondition: "",
    
    // Desired Upgrade
    desiredMake: "",
    desiredModel: "",
    budgetTopUp: "",
    financingNeeded: false,
    
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        // Track conversion
        fetch("/api/conversion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "Trade-in Request",
            category: "Trade-in",
            source: "Trade-in Page",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };

  const conditions = [
    { value: "Excellent", label: "Excellent - Like new, no issues" },
    { value: "Good", label: "Good - Minor wear, well maintained" },
    { value: "Fair", label: "Fair - Some issues, needs attention" },
    { value: "Poor", label: "Poor - Significant issues" },
  ];

  const budgetRanges = [
    "Under $20,000",
    "$20,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000 - $200,000",
    "$200,000+",
    "Not sure yet",
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
              Request Submitted
            </h1>
            <p className="text-[#8B8F96] text-lg mb-8">
              Thank you for your trade-in inquiry. Our team will review your vehicle 
              information and contact you within 24-48 hours with next steps.
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
                href={`https://wa.me/${contactInfo.whatsapp}?text=I submitted a trade-in request and would like to follow up`}
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
              <ArrowRightLeft className="w-3 h-3 mr-1" />
              Upgrade Program
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trade In & Step Up
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Upgrade your current vehicle to something new. Get a valuation for your trade-in 
            and explore premium upgrade options.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-[#C6A969]" />
              </div>
              <h3 className="font-semibold text-white mb-2">Fair Valuation</h3>
              <p className="text-sm text-[#8B8F96]">Competitive trade-in value for your vehicle</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[#C6A969]" />
              </div>
              <h3 className="font-semibold text-white mb-2">Easy Upgrade</h3>
              <p className="text-sm text-[#8B8F96]">Seamless transition to your new vehicle</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#C6A969]" />
              </div>
              <h3 className="font-semibold text-white mb-2">Honest Process</h3>
              <p className="text-sm text-[#8B8F96]">Transparent valuation and documentation</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Contact Details</h3>
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
                  <div className="space-y-2 mt-4">
                    <Label className="text-white">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label className="text-white">Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        <SelectItem value="WhatsApp" className="text-white">WhatsApp</SelectItem>
                        <SelectItem value="Phone" className="text-white">Phone Call</SelectItem>
                        <SelectItem value="Email" className="text-white">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Current Vehicle */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Current Vehicle</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Make *</Label>
                      <Input
                        required
                        value={formData.currentMake}
                        onChange={(e) => setFormData({ ...formData, currentMake: e.target.value })}
                        placeholder="e.g., Toyota"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Model *</Label>
                      <Input
                        required
                        value={formData.currentModel}
                        onChange={(e) => setFormData({ ...formData, currentModel: e.target.value })}
                        placeholder="e.g., Land Cruiser"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-white">Year *</Label>
                      <Input
                        required
                        type="number"
                        value={formData.currentYear}
                        onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                        placeholder="e.g., 2020"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Mileage (km)</Label>
                      <Input
                        type="number"
                        value={formData.currentMileage}
                        onChange={(e) => setFormData({ ...formData, currentMileage: e.target.value })}
                        placeholder="e.g., 50000"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label className="text-white">Condition *</Label>
                    <Select
                      value={formData.currentCondition}
                      onValueChange={(value) => setFormData({ ...formData, currentCondition: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="Select vehicle condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value} className="text-white">
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Desired Upgrade */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Desired Upgrade</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Desired Make</Label>
                      <Input
                        value={formData.desiredMake}
                        onChange={(e) => setFormData({ ...formData, desiredMake: e.target.value })}
                        placeholder="e.g., Range Rover"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Desired Model</Label>
                      <Input
                        value={formData.desiredModel}
                        onChange={(e) => setFormData({ ...formData, desiredModel: e.target.value })}
                        placeholder="e.g., Sport"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label className="text-white">Budget for Top-Up</Label>
                    <Select
                      value={formData.budgetTopUp}
                      onValueChange={(value) => setFormData({ ...formData, budgetTopUp: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="Select your top-up budget" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range} className="text-white">
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="financing"
                      checked={formData.financingNeeded}
                      onChange={(e) => setFormData({ ...formData, financingNeeded: e.target.checked })}
                      className="w-4 h-4 rounded border-border bg-[#0F0F10] text-[#C6A969] focus:ring-[#C6A969]"
                    />
                    <Label htmlFor="financing" className="text-[#8B8F96]">
                      I&apos;m interested in financing options
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Additional Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any additional details about your trade-in or upgrade..."
                    rows={4}
                    className="bg-[#0F0F10] border-border text-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] py-6"
                >
                  {isSubmitting ? "Submitting..." : "Submit Trade-In Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">How It Works</h3>
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Submit Your Details", description: "Tell us about your current vehicle and what you're looking for." },
                    { step: 2, title: "Vehicle Assessment", description: "Our team will assess your vehicle and provide a fair valuation." },
                    { step: 3, title: "Explore Options", description: "Browse our inventory for your perfect upgrade." },
                    { step: 4, title: "Complete the Trade", description: "Finalize the trade-in and drive away in your new vehicle." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#C6A969] font-semibold">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-[#8B8F96]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border border-[#C6A969]/30">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-2">PROPOSED SERVICE</h4>
                <p className="text-sm text-[#8B8F96]">
                  Trade-in services are available. Contact Mighty Rides to confirm the 
                  valuation process and available upgrade options.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-4">Questions?</h4>
                <p className="text-sm text-[#8B8F96] mb-6">
                  Our team is available to discuss your trade-in options.
                </p>
                <div className="flex gap-3">
                  <a
                    href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in trading in my vehicle`}
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
      </div>
    </section>
  );
}
