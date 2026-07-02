import { Shield, Sparkles, Car, Landmark, MapPin, Coffee, HelpCircle, Compass } from "lucide-react";

export default function PremiumServices() {
  const services = [
    { title: "VIP Airport Lounges", desc: "Access 1,200+ elite terminals with premium culinary, champagne bars, showers, and snooze suites.", icon: <Coffee className="w-5 h-5 text-amber-500" /> },
    { title: "Luxury Airport Transfers", desc: "Private chauffeur drive services from your residence directly to the runway terminal in premium sedans.", icon: <Car className="w-5 h-5 text-amber-500" /> },
    { title: "World-wide Travel Cover", desc: "Comprehensive insurance coverage providing up to $50,000 protection on medical and trip changes.", icon: <Shield className="w-5 h-5 text-amber-500" /> },
    { title: "Gourmet Catering Inflight", desc: "Specify detailed dietary, Michelin-level menus, and children catering choices during checking.", icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
    { title: "Car Rentals & Expedited Drive", desc: "Reserve certified luxury sports or SUV vehicles waiting immediately upon private tarmac landing.", icon: <Compass className="w-5 h-5 text-amber-500" /> },
    { title: "Curated Holiday Experiences", desc: "Customized resort, yacht chartering, or private villa booking setups globally via concierge.", icon: <MapPin className="w-5 h-5 text-amber-500" /> },
    { title: "Fast-track Visa Solutions", desc: "Expedited processing for business visas, tourist permits, or visa-on-arrival assistance.", icon: <Landmark className="w-5 h-5 text-amber-500" /> },
    { title: "Runway Lounge Assistance", desc: "Exclusive greeter support helping with luggage carrying and bypassing fast-track security.", icon: <HelpCircle className="w-5 h-5 text-amber-500" /> }
  ];

  return (
    <section id="benefits" className="py-24 bg-white border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full">
            Elite Amenities
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#081C3A] tracking-tight font-display">
            Premium Travel Services
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
            Complement your luxury flight experience with curated auxiliary benefits that redefine stress-free travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, idx) => (
            <div 
              key={idx}
              className="p-6 bg-gray-50/50 hover:bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 group"
              id={`service-benefit-${idx}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xs mb-5 transition-transform duration-300 group-hover:scale-110">
                {svc.icon}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#155EEF] transition-colors">{svc.title}</h3>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed font-light">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
