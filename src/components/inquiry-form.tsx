"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface InquiryFormProps {
  vehicleId: string;
  vehicleName: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function InquiryForm({ vehicleId, vehicleName }: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: `I'm interested in the ${vehicleName}. Please provide more information about availability, pricing, and financing options.`,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          type: "PURCHASE",
          vehicleId: vehicleId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };
  
  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-500/20 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="font-display text-xl text-white mb-2">Inquiry Sent!</h3>
        <p className="text-sm text-silver mb-4">
          Thank you for your interest. Our team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-gold hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs text-muted uppercase tracking-wider mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Enter your full name"
        />
      </div>
      
      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-xs text-muted uppercase tracking-wider mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="+256 XXX XXX XXX"
        />
      </div>
      
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs text-muted uppercase tracking-wider mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="your@email.com"
        />
      </div>
      
      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs text-muted uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none"
          placeholder="Tell us about your requirements..."
        />
      </div>
      
      {/* Error Message */}
      {status === "error" && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-3 border border-gold text-gold hover:bg-gold/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Inquire Now</span>
          </>
        )}
      </button>
      
      <p className="text-xs text-muted text-center">
        By submitting, you agree to our{" "}
        <a href="/privacy" className="text-silver hover:text-gold transition-colors">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
