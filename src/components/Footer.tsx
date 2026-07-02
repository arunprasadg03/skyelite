import { Plane, Mail, Phone, MapPin, Globe, CreditCard } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1220] text-gray-400 py-16 border-t border-white/5 select-none font-sans">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand identity Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Plane className="w-4.5 h-4.5 -rotate-45" />
            </div>
            <span className="text-xl font-bold font-display text-white">SkyElite</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Luxury private charters, signature long-haul airline partnerships, and bespoke concierge bookings globally. Redefining elite travel since 2012.
          </p>
          <div className="text-xs space-y-2 pt-2 text-gray-400">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span>1-800-SKYELITE (VIP Concierge)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <span>concierge@skyelite.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span>Mayfair, London • Manhattan, NY</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4 text-xs">
          <h4 className="font-extrabold uppercase tracking-widest text-white">Company</h4>
          <ul className="space-y-2">
            <li><a href="#hero" className="hover:text-white transition-colors">Start Portal</a></li>
            <li><a href="#story" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#rates" className="hover:text-white transition-colors">Route Rates</a></li>
            <li><a href="#benefits" className="hover:text-white transition-colors">Amenities & Benefits</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Clarification FAQ</a></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="space-y-4 text-xs">
          <h4 className="font-extrabold uppercase tracking-widest text-white">Legal & Care</h4>
          <ul className="space-y-2">
            <li><span className="cursor-pointer hover:text-white transition-colors">Standard Carriage Terms</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Refund & Cancellation policy</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">GDPR Information Policy</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">24/7 Priority Support Desk</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Flight Schedule Updates</span></li>
          </ul>
        </div>

        {/* Download & Newsletter Column */}
        <div className="space-y-4 text-xs">
          <h4 className="font-extrabold uppercase tracking-widest text-white">Download App</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Download our verified mobile boarding app to manage gates, receive offline passes, and get active runway alerts.
          </p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => alert("Redirecting to Apple App Store")}
              className="py-2.5 px-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left flex items-center space-x-2 transition-all"
            >
              <Globe className="w-4 h-4" />
              <div>
                <span className="text-[9px] block text-gray-500 uppercase">Download on the</span>
                <span className="font-bold text-white block">Apple App Store</span>
              </div>
            </button>
            <button 
              onClick={() => alert("Redirecting to Google Play Store")}
              className="py-2.5 px-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left flex items-center space-x-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <div>
                <span className="text-[9px] block text-gray-500 uppercase">Get it on the</span>
                <span className="font-bold text-white block">Google Play Store</span>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Sub-bar */}
      <div className="max-w-7xl mx-auto px-8 pt-8 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <span>© {currentYear} SkyElite Aviation Group. All rights reserved.</span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>USD ($) • English (US)</span>
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">PCI-DSS Certified TLS Encrypted</span>
        </div>
      </div>
    </footer>
  );
}
