"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Award, Clock, Users, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { contactInfo } from "@/lib/data";

interface AboutViewProps {
  onBack: () => void;
}

export function AboutView({ onBack }: AboutViewProps) {
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
            About Mighty Rides
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            A premium automotive dealership based in Kampala, Uganda.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
              Our Story
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Premium Automotive Services
            </h2>
            <div className="space-y-4 text-[#8B8F96] leading-relaxed">
              <p>
                Mighty Rides is a premium automotive dealership located in Kampala, Uganda. 
                We specialize in luxury vehicle sales, premium car rentals, and comprehensive 
                automotive services for clients across East Africa.
              </p>
              <p>
                Our commitment to quality and customer satisfaction drives everything we do. 
                From helping you find the perfect vehicle to providing expert maintenance 
                services, we are your trusted automotive partner.
              </p>
              <p>
                We offer a curated selection of vehicles, along with vehicle sourcing services 
                to help you find exactly what you&apos;re looking for.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#1A1C1F] to-[#0F0F10] border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#C6A969]/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12 text-[#C6A969]/50" />
                </div>
                <p className="text-[#8B8F96]">Premium Dealership</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Shield, 
                title: "Trust & Integrity", 
                description: "Transparent transactions and honest advice." 
              },
              { 
                icon: Award, 
                title: "Premium Quality", 
                description: "Carefully selected vehicles and services." 
              },
              { 
                icon: Clock, 
                title: "Reliability", 
                description: "Consistent, dependable service." 
              },
              { 
                icon: Users, 
                title: "Client Focus", 
                description: "Your satisfaction is our priority." 
              },
            ].map((value, index) => (
              <Card key={index} className="bg-[#1A1C1F] border-border text-center">
                <CardContent className="p-8">
                  <value.icon className="w-12 h-12 text-[#C6A969] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-sm text-[#8B8F96]">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-[#1A1C1F] rounded-2xl border border-border overflow-hidden mb-20">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Luxury vehicle sales",
                "Premium car rentals",
                "Vehicle servicing & maintenance",
                "Spare parts",
                "Body kits & customization",
                "Vehicle sourcing services",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C6A969] shrink-0" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#1A1C1F] rounded-2xl border border-border overflow-hidden mb-20">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Visit Our Location
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Location</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Phone</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.phones[0]}</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.phones[1]}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Email</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Hours</p>
                  <p className="text-sm text-[#8B8F96]">Mon-Fri: {contactInfo.hours.weekdays}</p>
                  <p className="text-sm text-[#8B8F96]">Sat: {contactInfo.hours.saturday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
