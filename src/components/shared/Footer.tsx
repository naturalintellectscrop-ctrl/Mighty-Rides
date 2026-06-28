'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Youtube, Instagram, Facebook, MessageCircle, MapPin, Phone, Clock, Mail, Send, ArrowRight } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Cars for Sale' },
  { href: '/hire', label: 'Car Hire' },
  { href: '/sourcing', label: 'Vehicle Sourcing' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
]

const services = [
  { href: '/cars', label: 'Vehicle Sales' },
  { href: '/hire', label: 'Luxury Car Hire' },
  { href: '/sourcing', label: 'Vehicle Sourcing' },
  { href: '/corporate', label: 'Corporate Mobility' },
  { href: '/services', label: 'Parts & Services' },
]

const socialLinks = [
  { 
    href: 'https://www.youtube.com/@MightyRides', 
    icon: Youtube, 
    label: 'YouTube',
    hoverColor: 'hover:text-red-500 hover:bg-red-500/10'
  },
  { 
    href: 'https://instagram.com/themightyrides', 
    icon: Instagram, 
    label: 'Instagram',
    hoverColor: 'hover:text-pink-500 hover:bg-pink-500/10'
  },
  { 
    href: 'https://facebook.com/themightyrides', 
    icon: Facebook, 
    label: 'Facebook',
    hoverColor: 'hover:text-blue-500 hover:bg-blue-500/10'
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // TODO: Implement newsletter subscription
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#0A0A0A] relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C8952A]/30 to-transparent" />
      
      {/* Main Footer */}
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 md:py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <Image 
                  src="/logo-new.png" 
                  alt="Mighty Rides Logo" 
                  width={120}
                  height={64}
                  className="object-contain transition-transform duration-300 group-hover:scale-105 h-12 w-auto sm:h-14 md:h-16"
                  priority
                />
              </div>
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
              East Africa&apos;s Premium Car Dealership since 2018. Your trusted source for exotic, luxury, and performance vehicles in Kampala, Uganda.
            </p>
            
            {/* Newsletter Section */}
            <div className="mt-6 sm:mt-8">
              <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">Newsletter</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[#C8952A] text-xs sm:text-sm">
                  <Send className="w-4 h-4" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#C8952A] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#C8952A] hover:bg-[#D4A644] text-black font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    GO
                  </button>
                </form>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-6">
              <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mr-2">Follow Us</p>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 transition-all duration-300 ${social.hoverColor} hover:border-transparent`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="w-6 h-px sm:w-8 bg-[#C8952A]" />
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs sm:text-sm inline-block hover:text-[#C8952A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="w-6 h-px sm:w-8 bg-[#C8952A]" />
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs sm:text-sm inline-block hover:text-[#C8952A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="w-6 h-px sm:w-8 bg-[#C8952A]" />
              Contact Us
            </h4>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Address */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 rounded-lg bg-[#1A1A1A] border border-gray-700 group-hover:border-[#C8952A]/30 transition-colors flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8952A]" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">Address</span>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Mirembe Business Centre<br />
                    Plot 18, Lugogo Bypass<br />
                    Kampala, Uganda
                  </p>
                </div>
              </div>
              
              {/* Hours */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 rounded-lg bg-[#1A1A1A] border border-gray-700 group-hover:border-[#C8952A]/30 transition-colors flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8952A]" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">Hours</span>
                  <p className="text-gray-400 text-xs sm:text-sm">Mon – Sat: 8am – 6pm EAT</p>
                </div>
              </div>
              
              {/* WhatsApp */}
              <a
                href="https://wa.me/256700000000?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 group p-3 sm:p-3 rounded-lg bg-[#C8952A]/5 border border-[#C8952A]/20 hover:border-[#C8952A]/40 transition-all duration-300 mt-4 sm:mt-0"
              >
                <div className="p-1.5 sm:p-2 rounded-lg bg-[#C8952A]/10 group-hover:bg-[#C8952A]/20 transition-colors flex-shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8952A]" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="block text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">WhatsApp</span>
                  <span className="text-[#C8952A] text-xs sm:text-sm font-medium group-hover:text-[#D4A644] transition-colors">
                    Chat with us
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-[10px] sm:text-xs text-center md:text-left order-2 md:order-1">
            © {currentYear} Mighty Rides. East Africa&apos;s Premium Car Dealership.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-gray-500 order-1 md:order-2">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <span className="w-1 h-1 bg-gray-700 rounded-full hidden sm:block" />
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="w-1 h-1 bg-gray-700 rounded-full hidden sm:block" />
            <Link href="/cancellation" className="hover:text-gray-300 transition-colors">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
