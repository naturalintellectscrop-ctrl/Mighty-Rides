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
  ArrowLeft, CheckCircle, Building2, Users, Plane, Calendar, 
  Clock, Shield, Star, Phone, MessageSquare, Briefcase, Crown, Car
} from "lucide-react";
import { contactInfo } from "@/lib/data";

interface CorporateViewProps {
  onBack: () => void;
}

export function CorporateView({ onBack }: CorporateViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    serviceType: "",
    vehiclePreference: "",
    duration: "",
    passengerCount: "",
    requirements: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/corporate", {
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
            eventType: "Corporate Inquiry",
            category: "Corporate",
            source: "Corporate Mobility Page",
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    setIsSubmitting(false);
  };

  const corporateServices = [
    {
      icon: Briefcase,
      title: "Executive Transport",
      description: "Professional executive transportation for daily business needs.",
    },
    {
      icon: Clock,
      title: "Long-term Corporate Rental",
      description: "Flexible long-term rental solutions for your organization.",
    },
    {
      icon: Users,
      title: "Fleet Requests",
      description: "Multiple vehicle solutions for corporate fleets.",
    },
    {
      icon: Calendar,
      title: "Recurring Transport",
      description: "Scheduled recurring transport services for your team.",
    },
    {
      icon: Crown,
      title: "VIP Mobility",
      description: "Premium VIP transport for executives and dignitaries.",
    },
    {
      icon: Plane,
      title: "Airport Transfers",
      description: "Reliable airport pickup and drop-off for business travelers.",
    },
  ];

  const industries = [
    "Corporate",
    "Embassy",
    "NGO",
    "Government",
    "Hospitality",
    "Other",
  ];

  const durations = [
    "One-time",
    "Monthly",
    "Quarterly",
    "Annual",
    "Ongoing",
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
              Inquiry Submitted
            </h1>
            <p className="text-[#8B8F96] text-lg mb-8">
              Thank you for your interest in our Corporate Mobility solutions. 
              Our business team will contact you within 24 hours to discuss your requirements.
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
                href={`https://wa.me/${contactInfo.whatsapp}?text=I submitted a corporate mobility inquiry and would like to follow up`}
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
              <Building2 className="w-3 h-3 mr-1" />
              B2B Solutions
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Corporate Mobility Desk
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Dedicated business solutions for executive transport, corporate rentals, 
            fleet management, and VIP mobility. Serving embassies, NGOs, and enterprises.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {corporateServices.map((service, index) => (
            <Card key={index} className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all">
              <CardContent className="p-6">
                <service.icon className="w-10 h-10 text-[#C6A969] mb-4" />
                <h3 className="font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-[#8B8F96]">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Section */}
        <div className="flex flex-wrap gap-6 mb-12 p-6 rounded-lg bg-[#1A1C1F] border border-border">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#C6A969]" />
            <span className="text-[#8B8F96]">Professional & Discrete Service</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#C6A969]" />
            <span className="text-[#8B8F96]">Flexible Contract Terms</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#C6A969]" />
            <span className="text-[#8B8F96]">Dedicated Account Management</span>
          </div>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Request Corporate Mobility Services
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Company Name *</Label>
                    <Input
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Contact Person *</Label>
                    <Input
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
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
                  <Label className="text-white">Industry / Organization Type *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F0F10] border-border">
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()} className="text-white">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <hr className="border-border" />

                {/* Service Details */}
                <div className="space-y-2">
                  <Label className="text-white">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F0F10] border-border">
                      <SelectItem value="Executive Transport" className="text-white">Executive Transport</SelectItem>
                      <SelectItem value="Long-term Corporate Rental" className="text-white">Long-term Corporate Rental</SelectItem>
                      <SelectItem value="Fleet Request" className="text-white">Fleet Request</SelectItem>
                      <SelectItem value="Recurring Transport" className="text-white">Recurring Transport</SelectItem>
                      <SelectItem value="VIP Mobility" className="text-white">VIP Mobility</SelectItem>
                      <SelectItem value="Airport Transfers" className="text-white">Airport Transfers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Duration</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration.toLowerCase()} className="text-white">
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Passenger Count</Label>
                    <Input
                      type="number"
                      value={formData.passengerCount}
                      onChange={(e) => setFormData({ ...formData, passengerCount: e.target.value })}
                      placeholder="Estimated passengers"
                      className="bg-[#0F0F10] border-border text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Vehicle Preference</Label>
                  <Input
                    value={formData.vehiclePreference}
                    onChange={(e) => setFormData({ ...formData, vehiclePreference: e.target.value })}
                    placeholder="e.g., SUVs, Sedans, specific models..."
                    className="bg-[#0F0F10] border-border text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Additional Requirements</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Any specific requirements, schedules, or preferences..."
                    rows={3}
                    className="bg-[#0F0F10] border-border text-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any additional information..."
                    rows={3}
                    className="bg-[#0F0F10] border-border text-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] py-6"
                >
                  {isSubmitting ? "Submitting..." : "Submit Corporate Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Why Choose Mighty Rides for Business?</h3>
                <ul className="space-y-4">
                  {[
                    "Professional and reliable service",
                    "Flexible contract terms",
                    "Wide range of premium vehicles",
                    "Experienced drivers available",
                    "Competitive corporate rates",
                    "Dedicated account support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C6A969] mt-0.5" />
                      <span className="text-[#8B8F96]">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border border-[#C6A969]/30">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-2">PROPOSED SERVICE</h4>
                <p className="text-sm text-[#8B8F96] mb-4">
                  Corporate mobility services are available on request. Contact us to discuss 
                  your specific business requirements and receive a customized proposal.
                </p>
                <p className="text-xs text-[#8B8F96]">
                  Services may include: executive transport, long-term rentals, fleet solutions, 
                  and dedicated mobility support for organizations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-4">Contact Our Business Team</h4>
                <p className="text-sm text-[#8B8F96] mb-6">
                  Speak directly with our corporate mobility specialists.
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
                    href={`https://wa.me/${contactInfo.whatsapp}?text=I'm inquiring about corporate mobility services for my organization`}
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
