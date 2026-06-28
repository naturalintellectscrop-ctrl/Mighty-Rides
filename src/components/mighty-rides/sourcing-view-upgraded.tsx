"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Search, Globe, Shield, Clock, Users, FileCheck, Car, Phone } from "lucide-react";
import { contactInfo } from "@/lib/data";

interface SourcingViewProps {
  onBack: () => void;
}

export function SourcingView({ onBack }: SourcingViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "WhatsApp",
    make: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    budgetMin: "",
    budgetMax: "",
    preferredColor: "",
    condition: "",
    urgency: "",
    additionalFeatures: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/sourcing", {
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
            eventType: "Sourcing Submit",
            category: "Sourcing",
            source: "Sourcing Page",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Network",
      description: "Access vehicles from markets worldwide through our extensive sourcing network.",
    },
    {
      icon: Search,
      title: "Verified Quality",
      description: "Every sourced vehicle undergoes thorough inspection before delivery.",
    },
    {
      icon: Shield,
      title: "Transparent Process",
      description: "Clear pricing, documentation, and timeline at every step.",
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "Efficient logistics ensure your vehicle arrives on schedule.",
    },
  ];

  const processSteps = [
    { step: 1, title: "Submit Your Request", description: "Tell us exactly what you're looking for with as much detail as possible." },
    { step: 2, title: "We Search Our Network", description: "Our team searches global markets and dealer networks for matching vehicles." },
    { step: 3, title: "Review Options", description: "Receive detailed profiles of available vehicles with photos, specs, and pricing." },
    { step: 4, title: "Secure Your Vehicle", description: "Once you've chosen, we handle verification, paperwork, and delivery." },
  ];

  const urgencyOptions = [
    { value: "Immediate", label: "Immediate - Need it soon" },
    { value: "1-3 months", label: "Within 1-3 months" },
    { value: "3-6 months", label: "Within 3-6 months" },
    { value: "Flexible", label: "Flexible timeline" },
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
              Our sourcing team will review your requirements and contact you within 24-48 hours 
              with available options.
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
                href={`https://wa.me/${contactInfo.whatsapp}?text=I submitted a sourcing request and would like to follow up`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
              >
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
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            <Search className="w-3 h-3 mr-1" />
            Vehicle Sourcing
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Let Mighty Rides source it for you. Our global network can find any vehicle 
            to your exact specifications — from rare classics to the latest releases.
          </p>
        </div>

        {/* Why Use Sourcing */}
        <div className="mb-12 p-8 rounded-lg bg-gradient-to-r from-[#1A1C1F] to-[#0F0F10] border border-border">
          <h2 className="text-2xl font-semibold text-white mb-6">Why Use Mighty Rides Sourcing?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <benefit.icon className="w-10 h-10 text-[#C6A969] shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-[#8B8F96]">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form and Process */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Tell Us What You&apos;re Looking For</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
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
                    <Label className="text-white">Phone Number *</Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Email Address *</Label>
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

                <hr className="border-border" />

                {/* Vehicle Preferences */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Make</Label>
                    <Input
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="e.g., Mercedes-Benz"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., S-Class"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Year From</Label>
                    <Input
                      type="number"
                      value={formData.yearFrom}
                      onChange={(e) => setFormData({ ...formData, yearFrom: e.target.value })}
                      placeholder="e.g., 2020"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Year To</Label>
                    <Input
                      type="number"
                      value={formData.yearTo}
                      onChange={(e) => setFormData({ ...formData, yearTo: e.target.value })}
                      placeholder="e.g., 2024"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Budget (Min USD)</Label>
                    <Input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                      placeholder="e.g., 100000"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Budget (Max USD)</Label>
                    <Input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                      placeholder="e.g., 300000"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        <SelectItem value="New" className="text-white">New</SelectItem>
                        <SelectItem value="Used" className="text-white">Used</SelectItem>
                        <SelectItem value="Certified Pre-Owned" className="text-white">Certified Pre-Owned</SelectItem>
                        <SelectItem value="Any" className="text-white">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Preferred Color</Label>
                    <Input
                      value={formData.preferredColor}
                      onChange={(e) => setFormData({ ...formData, preferredColor: e.target.value })}
                      placeholder="e.g., Black, White"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Urgency</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                      <SelectValue placeholder="When do you need the vehicle?" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F0F10] border-border">
                      {urgencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Specific Features (Optional)</Label>
                  <Input
                    value={formData.additionalFeatures}
                    onChange={(e) => setFormData({ ...formData, additionalFeatures: e.target.value })}
                    placeholder="e.g., Sunroof, Leather seats, Navigation..."
                    className="bg-[#0F0F10] border-border text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Additional Details</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any other specific requirements or preferences..."
                    rows={4}
                    className="bg-[#0F0F10] border-border text-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] py-6"
                >
                  {isSubmitting ? "Submitting..." : "Submit Sourcing Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Process Sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">How It Works</h3>
              <div className="space-y-6">
                {processSteps.map((item) => (
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
            </div>

            <Card className="bg-[#1A1C1F] border border-[#C6A969]/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileCheck className="w-6 h-6 text-[#C6A969]" />
                  <div>
                    <h4 className="font-semibold text-white">What We Handle</h4>
                    <p className="text-sm text-[#8B8F96] mt-1">
                      Vehicle search, verification, documentation, and delivery coordination.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-4">Need Immediate Assistance?</h4>
                <p className="text-sm text-[#8B8F96] mb-6">
                  Our sourcing specialists are available to discuss your requirements directly.
                </p>
                <div className="flex gap-3">
                  <a
                    href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in vehicle sourcing services`}
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
