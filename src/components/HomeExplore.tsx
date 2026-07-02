import React, { useState, useEffect } from "react";
import { DESTINATIONS, DEALS, AIRLINES } from "../data";
import { Destination, Deal } from "../types";
import { Heart, Star, Clock, CloudSun, Calendar, ChevronRight, Compass } from "lucide-react";

interface HomeExploreProps {
  onQuickBook: (city: string) => void;
}

// Countdown timer helper for Deal cards
function DealTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Deal Expired");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <span className="text-[10px] font-mono font-extrabold bg-[#202A36] text-[#F5B301] px-2.5 py-1 rounded-md tracking-wider uppercase animate-pulse">
      ⌛ {timeLeft}
    </span>
  );
}

export default function HomeExplore({ onQuickBook }: HomeExploreProps) {
  const [favorites, setFavorites] = useState<string[]>(["paris", "maldives"]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <div className="space-y-24">
      
      {/* SECTION 1: POPULAR DESTINATIONS GRID */}
      <section id="rates" className="py-12">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full">
            Elite Gateways
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#081C3A] tracking-tight font-display">
            Popular Luxury Destinations
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
            Compare active seasonal rates and luxury flight durations for the world's most desired holiday destinations.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div 
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group flex flex-col h-full relative"
              id={`destination-card-${dest.id}`}
            >
              {/* Image box with badges */}
              <div className="relative aspect-4/3 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Weather details floating info */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-sm text-[10px] font-bold text-gray-800 flex items-center space-x-1 border border-white/20 select-none">
                  <CloudSun className="w-3.5 h-3.5 text-blue-500" />
                  <span>{dest.weather}</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-sm text-[10px] font-extrabold text-gray-800 flex items-center space-x-0.5 border border-white/20 select-none">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>{dest.rating.toFixed(1)}</span>
                </div>

                {/* Favorite Toggle button */}
                <button
                  onClick={() => toggleFavorite(dest.id)}
                  className={`absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-sm transition-transform active:scale-90 ${
                    favorites.includes(dest.id) ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
                  }`}
                  title="Save to favorites"
                >
                  <Heart className={`w-4.5 h-4.5 ${favorites.includes(dest.id) ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-base">{dest.city}</h4>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{dest.country}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">From</span>
                      <span className="text-lg font-black text-[#202A36] font-mono">${dest.price}</span>
                    </div>
                  </div>

                  {/* Travel details list */}
                  <div className="pt-3 border-t border-gray-100 flex justify-between text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{dest.duration}</span>
                    </span>
                    <span className="text-right">Best: {dest.bestSeason.split(" ")[0]}</span>
                  </div>

                  {/* Partners list */}
                  <div className="text-[10px] text-gray-400 flex items-center gap-1.5 flex-wrap pt-1 select-none">
                    <span className="font-bold">Airlines:</span>
                    {dest.airlinePartners.map((pt) => (
                      <span key={pt} className="bg-gray-100 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-gray-600 font-mono">
                        {pt.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick book button */}
                <button
                  onClick={() => onQuickBook(dest.city)}
                  className="w-full mt-4 py-2.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 group cursor-pointer shadow-xs"
                >
                  <span>Quick Book</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: FEATURED DEALS CAROUSEL */}
      <section className="py-12 bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full">
              Flash Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#081C3A] tracking-tight font-display mt-3">
              Featured Flight Deals
            </h2>
          </div>
          <p className="text-xs md:text-sm text-gray-500 max-w-sm font-light leading-relaxed">
            Flash luxury class ticket vouchers available for a strictly limited duration.
          </p>
        </div>

        {/* Carousel Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEALS.map((deal) => (
            <div 
              key={deal.id}
              className="bg-gray-50/50 hover:bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all shadow-xs hover:shadow-lg p-4 flex flex-col justify-between"
              id={`deal-card-${deal.id}`}
            >
              <div className="space-y-4">
                {/* Deal Image header */}
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={deal.image} alt={deal.city} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  {/* Discount Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-[#F5B301] text-gray-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase shadow-xs">
                    {deal.discountBadge}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">{deal.city}, {deal.country}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">📅 Travel: {deal.travelDates}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 line-through block font-mono">${deal.originalPrice}</span>
                    <span className="text-lg font-black text-rose-600 block font-mono">${deal.offerPrice}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Countdown & Action */}
              <div className="pt-4 border-t border-gray-100/80 mt-4 flex justify-between items-center">
                <DealTimer endsAt={deal.endsAt} />
                <button
                  onClick={() => onQuickBook(deal.city)}
                  className="px-4 py-2 bg-[#202A36] text-white text-xs font-bold rounded-xl hover:bg-opacity-95 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PREMIUM AIRLINES PARTNERS */}
      <section className="py-8 select-none">
        <h3 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">Our Premium Airline Alliances</h3>
        
        {/* Logos container with greyscale effect */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-4 opacity-75">
          {AIRLINES.map((air) => (
            <div 
              key={air.name}
              className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all duration-300 scale-95 hover:scale-105 cursor-pointer"
              title={`${air.name} Signature Partner`}
            >
              <span className="text-2xl">{air.logo}</span>
              <span className="font-display font-semibold text-gray-700 hover:text-gray-900 text-sm">
                {air.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LUXURY NEWSLETTER SUBSCRIPTION */}
      <section className="bg-gradient-to-tr from-[#081C3A] via-[#103061] to-[#155EEF] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
            Exclusive Airfares
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Discover Undisclosed Fares
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
            Subscribe to our weekly private newsletter for luxury flash deals, exclusive lounge invitations, and custom charter route rates worldwide.
          </p>

          {subscribed ? (
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-xs font-bold text-yellow-300 animate-fade-in flex items-center justify-center space-x-2">
              <span>✓ Welcome to SkyElite Club. Please check your inbox for verification code SKY20.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email for private fares"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-[#F5B301] transition-all"
              />
              <button
                type="submit"
                className="py-3 px-6 bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Join SkyElite
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
