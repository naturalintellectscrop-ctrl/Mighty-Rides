"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  ArrowLeft, CheckCircle, Crown, Calendar, Phone, MessageSquare, 
  Shield, Clock, Users, Star, ChevronRight
} from "lucide-react";
import { contactInfo } from "@/lib/data";

interface ConciergeViewProps {
  onBack: () => void;
}

export function ConciergeView({ onBack }: ConciergeViewProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "WhatsApp",
    requestType: "",
    preferredVehicle: "",
    purchaseTimeline: "",
    budgetRange: "",
    financingPreference: "",
    tradeInConsideration: false,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/concierge", {
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
            eventType: "Concierge Request",
            category: "Sales",
            source: "Concierge Page",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };

  const conciergeServices = [
    {
      icon: Calendar,
      title: "Private Viewing",
      description: "Schedule an exclusive viewing of your preferred vehicle at your convenience.",
      requestType: "Private Viewing",
    },
    {
      icon: Users,
      title: "Vehicle Advisor",
      description: "Speak with our expert advisors for personalized guidance on your purchase.",
      requestType: "Advisor Consultation",
    },
    {
      icon: Crown,
      title: "Concierge Purchase",
      description: "Full-service premium buying experience with dedicated support from start to finish.",
      requestType: "Concierge Purchase",
    },
  ];

  const timelineOptions = [
    { value: "Immediate", label: "Immediate" },
    { value: "1-2 weeks", label: "Within 1-2 weeks" },
    { value: "1-3 months", label: "Within 1-3 months" },
    { value: "3+ months", label: "3+ months" },
    { value: "Just exploring", label: "Just exploring options" },
  ];

  const budgetOptions = [
    { value: "Under $50k", label: "Under $50,000" },
    { value: "$50k-$100k", label: "$50,000 - $100,000" },
    { value: "$100k-$200k", label: "$100,000 - $200,000" },
    { value: "$200k-$500k", label: "$200,000 - $500,000" },
    { value: "$500k+", label: "$500,000+" },
  ];

  const financingOptions = [
    { value: "Cash", label: "Cash Purchase" },
    { value: "Finance", label: "Finance" },
    { value: "Lease", label: "Lease" },
    { value: "Open to options", label: "Open to Options" },
  ];

  const trustPoints = [
    { icon: Shield, text: "Premium support before and after purchase" },
    { icon: Clock, text: "Flexible scheduling at your convenience" },
    { icon: Star, text: "Dedicated advisor throughout your journey" },
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
              Thank you for choosing the Private Buyer Concierge. Our dedicated team will 
              contact you within 24 hours to begin your premium buying experience.
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
                href={`https://wa.me/${contactInfo.whatsapp}?text=I submitted a concierge request and would like to follow up`}
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
              <Crown className="w-3 h-3 mr-1" />
              Premium Service
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Private Buyer Concierge
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Experience a premium, guided buying journey designed for serious buyers. 
            Our dedicated team provides personalized support from selection to delivery.
          </p>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap gap-6 mb-12 p-6 rounded-lg bg-[#1A1C1F] border border-border">
          {trustPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <point.icon className="w-5 h-5 text-[#C6A969]" />
              <span className="text-[#8B8F96]">{point.text}</span>
            </div>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-[#C6A969] text-[#0F0F10]"
                    : "bg-[#1A1C1F] text-[#8B8F96] border border-border"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s ? "bg-[#C6A969]" : "bg-[#1A1C1F]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">
          <div>
            {step === 1 && (
              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Select Your Service Type
                  </h2>
                  <div className="space-y-4">
                    {conciergeServices.map((service) => (
                      <button
                        key={service.requestType}
                        onClick={() => {
                          setFormData({ ...formData, requestType: service.requestType });
                          setStep(2);
                        }}
                        className="w-full text-left p-4 rounded-lg border border-border hover:border-[#C6A969]/50 bg-[#0F0F10] transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <service.icon className="w-8 h-8 text-[#C6A969] mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium text-white group-hover:text-[#C6A969] transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-sm text-[#8B8F96] mt-1">
                              {service.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#8B8F96] group-hover:text-[#C6A969] transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Your Preferences
                  </h2>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white">Preferred Vehicle (Optional)</Label>
                      <Input
                        value={formData.preferredVehicle}
                        onChange={(e) => setFormData({ ...formData, preferredVehicle: e.target.value })}
                        placeholder="e.g., Mercedes S-Class, Range Rover..."
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Purchase Timeline *</Label>
                      <Select
                        value={formData.purchaseTimeline}
                        onValueChange={(value) => setFormData({ ...formData, purchaseTimeline: value })}
                      >
                        <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                          <SelectValue placeholder="When do you plan to purchase?" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F0F10] border-border">
                          {timelineOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Budget Range *</Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                      >
                        <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F0F10] border-border">
                          {budgetOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Financing Preference</Label>
                      <Select
                        value={formData.financingPreference}
                        onValueChange={(value) => setFormData({ ...formData, financingPreference: value })}
                      >
                        <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                          <SelectValue placeholder="How do you plan to pay?" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F0F10] border-border">
                          {financingOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="tradeIn"
                        checked={formData.tradeInConsideration}
                        onChange={(e) => setFormData({ ...formData, tradeInConsideration: e.target.checked })}
                        className="w-4 h-4 rounded border-border bg-[#0F0F10] text-[#C6A969] focus:ring-[#C6A969]"
                      />
                      <Label htmlFor="tradeIn" className="text-[#8B8F96]">
                        I have a vehicle to trade in
                      </Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-border text-white hover:bg-white/5"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!formData.purchaseTimeline || !formData.budgetRange}
                        className="flex-1 bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="bg-[#1A1C1F] border-border">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Your Contact Details
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

                    <div className="space-y-2">
                      <Label className="text-white">Additional Message (Optional)</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any specific requirements or questions..."
                        rows={4}
                        className="bg-[#0F0F10] border-border text-white resize-none"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="border-border text-white hover:bg-white/5"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Concierge Request"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Your Selection</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8F96]">Service Type</span>
                    <span className="text-white">{formData.requestType || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8F96]">Vehicle Preference</span>
                    <span className="text-white">{formData.preferredVehicle || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8F96]">Timeline</span>
                    <span className="text-white">{formData.purchaseTimeline || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8F96]">Budget</span>
                    <span className="text-white">{formData.budgetRange || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8F96]">Trade-in</span>
                    <span className="text-white">{formData.tradeInConsideration ? "Yes" : "No"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border border-[#C6A969]/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#C6A969]" />
                  <div>
                    <h4 className="font-semibold text-white">Premium Support</h4>
                    <p className="text-sm text-[#8B8F96] mt-1">
                      Our concierge team provides dedicated support throughout your buying journey.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#8B8F96]">
                  PROPOSED FEATURE: This is a premium service offering. Contact Mighty Rides to confirm availability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-4">Need Immediate Assistance?</h4>
                <div className="flex gap-3">
                  <a
                    href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in the Private Buyer Concierge service`}
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
