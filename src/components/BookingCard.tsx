import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Briefcase, Percent, Search, AlertCircle, RefreshCw } from "lucide-react";
import { FlightSearchQuery, TripType, CabinClass } from "../types";

interface BookingCardProps {
  onSearch: (query: FlightSearchQuery) => void;
  initialQuery?: FlightSearchQuery;
}

const POPULAR_AIRPORTS = [
  { code: "JFK", city: "New York", name: "John F. Kennedy Int'l", country: "United States" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles Int'l", country: "United States" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
  { code: "FCO", city: "Rome", name: "Fiumicino Airport", country: "Italy" },
  { code: "MLE", city: "Maldives", name: "Velana International", country: "Maldives" },
  { code: "DPS", city: "Bali", name: "Ngurah Rai", country: "Indonesia" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
];

export default function BookingCard({ onSearch, initialQuery }: BookingCardProps) {
  const [tripType, setTripType] = useState<TripType>(initialQuery?.tripType || "round-trip");
  const [origin, setOrigin] = useState(initialQuery?.origin || "JFK");
  const [destination, setDestination] = useState(initialQuery?.destination || "CDG");
  const [departureDate, setDepartureDate] = useState(initialQuery?.departureDate || "2026-07-15");
  const [returnDate, setReturnDate] = useState(initialQuery?.returnDate || "2026-07-25");
  const [passengers, setPassengers] = useState(initialQuery?.passengers || 1);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialQuery?.cabinClass || "business");
  const [promoCode, setPromoCode] = useState(initialQuery?.promoCode || "");

  // Autocomplete suggestions
  const [originInput, setOriginInput] = useState("New York (JFK)");
  const [destInput, setDestInput] = useState("Paris (CDG)");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  
  // Validation errors
  const [error, setError] = useState<string | null>(null);

  // Suggestion filtering
  const filteredOrigins = POPULAR_AIRPORTS.filter(airport => 
    airport.city.toLowerCase().includes(originInput.toLowerCase()) ||
    airport.code.toLowerCase().includes(originInput.toLowerCase()) ||
    airport.name.toLowerCase().includes(originInput.toLowerCase())
  );

  const filteredDests = POPULAR_AIRPORTS.filter(airport => 
    airport.city.toLowerCase().includes(destInput.toLowerCase()) ||
    airport.code.toLowerCase().includes(destInput.toLowerCase()) ||
    airport.name.toLowerCase().includes(destInput.toLowerCase())
  );

  const swapAirports = () => {
    const tempOrigin = origin;
    const tempOriginInput = originInput;
    setOrigin(destination);
    setOriginInput(destInput);
    setDestination(tempOrigin);
    setDestInput(tempOriginInput);
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!origin) {
      setError("Please select a valid origin airport.");
      return;
    }
    if (!destination) {
      setError("Please select a valid destination airport.");
      return;
    }
    if (origin === destination) {
      setError("Origin and Destination airports cannot be the same.");
      return;
    }
    if (!departureDate) {
      setError("Please select a departure date.");
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      setError("Please select a return date.");
      return;
    }
    if (tripType === "round-trip" && new Date(returnDate) < new Date(departureDate)) {
      setError("Return date must be on or after the departure date.");
      return;
    }
    if (passengers < 1) {
      setError("Passenger count must be at least 1.");
      return;
    }

    onSearch({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      cabinClass,
      promoCode: promoCode.trim() || undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-panel w-full rounded-[20px] p-6 md:p-8 shadow-2xl border border-white/40 transition-all hover:border-gray-200"
    >
      {/* Search Header / Trip Types */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
        <div className="flex bg-gray-100/80 p-1.5 rounded-full border border-gray-200/50">
          {(["one-way", "round-trip", "multi-city"] as TripType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTripType(type);
                if (type === "one-way") setError(null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                tripType === type
                  ? "bg-[#202A36] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
              }`}
              id={`trip-type-${type}`}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Info Label */}
        <div className="text-xs text-gray-500 font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Flexible booking active</span>
        </div>
      </div>

      <form onSubmit={handleSearchClick} className="space-y-6">
        {/* Validation Error Alert */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-start space-x-3 text-rose-800 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Airport Search Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center relative">
          {/* Origin Airport */}
          <div className="lg:col-span-5 relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <PlaneTakeoff className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Origin Airport</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value);
                  setOrigin("");
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => {
                  setShowOriginSuggestions(true);
                  setShowDestSuggestions(false);
                }}
                placeholder="Where are you flying from?"
                className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
                id="origin-input"
              />
              {origin && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {origin}
                </span>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showOriginSuggestions && (
              <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Popular Airports
                </div>
                {filteredOrigins.length === 0 ? (
                  <div className="p-4 text-xs text-gray-500">No airports found</div>
                ) : (
                  filteredOrigins.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setOrigin(airport.code);
                        setOriginInput(`${airport.city} (${airport.code})`);
                        setShowOriginSuggestions(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{airport.city}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{airport.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-[#202A36] bg-gray-100 px-2 py-1 rounded-md">
                          {airport.code}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">{airport.country}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-2 flex justify-center -my-2 lg:-my-0">
            <button
              type="button"
              onClick={swapAirports}
              className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-[#202A36] transition-all hover:rotate-180 duration-500"
              id="swap-airports-btn"
              title="Swap Departure and Arrival Airports"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="lg:col-span-5 relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <PlaneLanding className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Destination Airport</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destInput}
                onChange={(e) => {
                  setDestInput(e.target.value);
                  setDestination("");
                  setShowDestSuggestions(true);
                }}
                onFocus={() => {
                  setShowDestSuggestions(true);
                  setShowOriginSuggestions(false);
                }}
                placeholder="Where are you flying to?"
                className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
                id="destination-input"
              />
              {destination && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {destination}
                </span>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showDestSuggestions && (
              <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Popular Airports
                </div>
                {filteredDests.length === 0 ? (
                  <div className="p-4 text-xs text-gray-500">No airports found</div>
                ) : (
                  filteredDests.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setDestination(airport.code);
                        setDestInput(`${airport.city} (${airport.code})`);
                        setShowDestSuggestions(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{airport.city}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{airport.name}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-[#202A36] bg-gray-100 px-2 py-1 rounded-md">
                          {airport.code}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">{airport.country}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date and Passenger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Departure Date */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Departure Date</span>
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              id="departure-date"
            />
          </div>

          {/* Return Date */}
          <div className={`relative transition-all duration-300 ${tripType !== "round-trip" ? "opacity-40 pointer-events-none" : ""}`}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Return Date</span>
            </label>
            <input
              type="date"
              value={returnDate}
              disabled={tripType !== "round-trip"}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              id="return-date"
            />
          </div>

          {/* Passengers */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Passengers</span>
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              id="passenger-count"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </option>
              ))}
            </select>
          </div>

          {/* Cabin Class */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-[#202A36]" />
              <span>Cabin Class</span>
            </label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as CabinClass)}
              className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              id="cabin-class"
            >
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business Class</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Promo Code & Search Button */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Percent className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Promo Code (SKY20)"
              className="w-full bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold tracking-wider text-gray-800 placeholder-gray-400 uppercase focus:outline-none focus:border-[#202A36] transition-colors"
              id="promo-code"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-1/2 py-3.5 px-8 rounded-xl bg-[#202A36] text-white font-medium hover:bg-opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center space-x-2 text-base cursor-pointer"
            id="search-flights-submit-btn"
          >
            <Search className="w-5 h-5" />
            <span>Search Luxury Flights</span>
          </button>
        </div>
      </form>

      {/* Outside click suggestions dismissal handler */}
      {(showOriginSuggestions || showDestSuggestions) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowOriginSuggestions(false);
            setShowDestSuggestions(false);
          }}
        />
      )}
    </motion.div>
  );
}
