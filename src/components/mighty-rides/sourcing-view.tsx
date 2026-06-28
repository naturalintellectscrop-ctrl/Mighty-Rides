"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Search, Globe, Shield, Clock } from "lucide-react";
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
    make: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    budgetMin: "",
    budgetMax: "",
    preferredColor: "",
    condition: "",
    timeline: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
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
            Vehicle Sourcing
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Source Your Dream Car
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Can&apos;t find what you&apos;re looking for? Our global network can source any vehicle 
            to your exact specifications. From rare classics to the latest releases.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-[#1A1C1F] border-border">
              <CardContent className="p-6">
                <benefit.icon className="w-10 h-10 text-[#C6A969] mb-4" />
                <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#8B8F96]">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20">
          <Card className="bg-[#1A1C1F] border-border">
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-[#C6A969] mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Request Submitted!</h3>
                  <p className="text-[#8B8F96] mb-6">
                    Our sourcing team will review your requirements and contact you within 24-48 hours 
                    with available options.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "", email: "", phone: "", make: "", model: "",
                        yearFrom: "", yearTo: "", budgetMin: "", budgetMax: "",
                        preferredColor: "", condition: "", timeline: "", message: "",
                      });
                    }}
                    variant="outline"
                    className="border-[#C6A969]/30 text-[#C6A969] hover:bg-[#C6A969]/10"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Tell Us What You&apos;re Looking For</h3>
                  
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

                  <hr className="border-border" />

                  {/* Vehicle Preferences */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Preferred Make</Label>
                      <Input
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="e.g., Mercedes-Benz"
                        className="bg-[#0F0F10] border-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Preferred Model</Label>
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
                    <Label className="text-white">Timeline</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger className="bg-[#0F0F10] border-border text-white">
                        <SelectValue placeholder="When do you need the vehicle?" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F0F10] border-border">
                        <SelectItem value="immediate" className="text-white">Immediately</SelectItem>
                        <SelectItem value="1month" className="text-white">Within 1 month</SelectItem>
                        <SelectItem value="3months" className="text-white">Within 3 months</SelectItem>
                        <SelectItem value="6months" className="text-white">Within 6 months</SelectItem>
                        <SelectItem value="flexible" className="text-white">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Additional Details</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any specific features, requirements, or preferences..."
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
              )}
            </CardContent>
          </Card>

          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Submit Your Request", description: "Tell us exactly what you're looking for with as much detail as possible." },
                  { step: 2, title: "We Search Our Network", description: "Our team searches global markets and dealer networks for matching vehicles." },
                  { step: 3, title: "Review Options", description: "Receive detailed profiles of available vehicles with photos, specs, and pricing." },
                  { step: 4, title: "Secure Your Vehicle", description: "Once you've chosen, we handle verification, paperwork, and delivery." },
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
            </div>

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
