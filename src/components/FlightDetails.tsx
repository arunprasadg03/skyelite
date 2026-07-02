import { useState } from "react";
import { Flight, FlightSearchQuery } from "../types";
import { 
  ArrowLeft, Clock, ShieldCheck, HelpCircle, AlertCircle, Info,
  Luggage, Tv, Zap, Coffee, ChevronRight, FileText, Gift
} from "lucide-react";

interface FlightDetailsProps {
  flight: Flight;
  searchQuery: FlightSearchQuery;
  onBackToResults: () => void;
  onProceedToSeats: (hasInsurance: boolean) => void;
}

export default function FlightDetails({ flight, searchQuery, onBackToResults, onProceedToSeats }: FlightDetailsProps) {
  const [activeTab, setActiveTab] = useState<"amenities" | "policies" | "fare">("amenities");
  const [includeInsurance, setIncludeInsurance] = useState(true);

  // Fare calculations
  const numPassengers = searchQuery.passengers;
  const baseFareTotal = flight.price * numPassengers;
  const taxesFeesTotal = Math.round(baseFareTotal * 0.12);
  const insuranceTotal = includeInsurance ? 49 * numPassengers : 0;
  const grandTotal = baseFareTotal + taxesFeesTotal + insuranceTotal;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      {/* Premium Airline Banner */}
      <div className="relative h-48 bg-gradient-to-r from-[#081C3A] to-[#155EEF] p-8 flex flex-col justify-end">
        {/* Abstract luxury geometric mesh in background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <button
          onClick={onBackToResults}
          className="absolute top-6 left-6 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-xs transition-all flex items-center space-x-1.5"
          id="details-back-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Flights</span>
        </button>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              <img src={flight.airlineLogo} alt={flight.airlineName} className="object-contain max-h-full" referrerPolicy="no-referrer" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold tracking-tight">{flight.airlineName}</h2>
              <p className="text-xs text-blue-150 font-mono opacity-80">{flight.flightNumber} • {flight.aircraftType}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Signature Service</span>
            <span className="text-2xl font-extrabold text-white">${flight.price} <span className="text-xs font-normal text-white/70">/ pax</span></span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Timeline & Detailed Tabs */}
        <div className="md:col-span-2 space-y-6">
          {/* Journey Timeline */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Journey Timeline</h3>
            <div className="relative border-l-2 border-dashed border-gray-300 pl-6 ml-3 space-y-6">
              
              {/* Point 1: Departure */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#081C3A] border-4 border-white flex items-center justify-center"></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-gray-900">{flight.departureTime}</span>
                    <span className="text-sm font-semibold text-gray-700">Departure</span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">{searchQuery.origin} Airport Terminal 2</span>
                </div>
              </div>

              {/* Transit/Duration Line */}
              <div className="text-xs text-gray-400 flex items-center space-x-2 pl-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{flight.duration} flight duration {flight.stops > 0 ? `with layover in ${flight.layover}` : "(Non-stop)"}</span>
              </div>

              {/* Point 2: Arrival */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#155EEF] border-4 border-white flex items-center justify-center"></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-gray-900">{flight.arrivalTime}</span>
                    <span className="text-sm font-semibold text-gray-700">Arrival</span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">{searchQuery.destination} Airport Terminal 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tab Switcher */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-100">
              {(["amenities", "policies", "fare"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-3 text-sm font-semibold text-center uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab
                      ? "text-[#081C3A] border-[#081C3A]"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                  id={`details-tab-${tab}`}
                >
                  {tab === "amenities" ? "Luxury Cabin Amenities" : tab === "policies" ? "Luggage & Policies" : "Fare & Insurance"}
                </button>
              ))}
            </div>

            {/* Tab 1: Amenities */}
            {activeTab === "amenities" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-xl text-[#081C3A] shadow-xs">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Premium Entertainment</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      13-inch custom high-definition screen featuring over 2,500 movies, series, and live news channels.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-xl text-[#081C3A] shadow-xs">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Fine Dining Meals</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Gourmet menus designed by Michelin-star chefs, customized premium spirits, and vintage champagnes.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-xl text-[#081C3A] shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Power & Connectivity</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Equipped with AC universal power sockets, USB ports, and satellite high-speed internet.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-xl text-[#081C3A] shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Legroom & Bed</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Spacious {flight.seatType} layout with 45-78 inch seat pitch, active massage support, and luxurious linens.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Policies */}
            {activeTab === "policies" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                    <Luggage className="w-4 h-4 text-blue-600" />
                    <span>Included Baggage Allowance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="block text-gray-400 font-bold uppercase tracking-wider mb-0.5">Cabin Bag</span>
                      <span className="font-extrabold text-gray-800 text-sm">2 Pieces (Up to 14kg total)</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="block text-gray-400 font-bold uppercase tracking-wider mb-0.5">Check-in Luggage</span>
                      <span className="font-extrabold text-gray-800 text-sm">{flight.baggage} Allowance</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-100/50 rounded-2xl space-y-2 text-xs text-rose-800">
                  <div className="flex items-center space-x-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Cancellation & Amendment Policy</span>
                  </div>
                  <p className="leading-relaxed">
                    {flight.refundable 
                      ? "This premium ticket is eligible for free cancellations and 100% full refunds up to 24 hours prior to flight departure. Flight date changes are permitted with zero modification penalties."
                      : "This flight is non-refundable. Re-bookings are permitted for a charge of $150 plus any fare difference that applies."}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Fare */}
            {activeTab === "fare" && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Base Fare (${flight.price} x {numPassengers} Traveler{numPassengers > 1 ? "s" : ""})</span>
                  <span className="text-gray-900 font-bold font-mono">${baseFareTotal}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Government Flight Taxes & Surcharges (12%)</span>
                  <span className="text-gray-900 font-bold font-mono">${taxesFeesTotal}</span>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between font-medium text-emerald-700">
                    <span>Premium Travel Cover Surcharges ($49 x {numPassengers})</span>
                    <span className="font-bold font-mono">${insuranceTotal}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-extrabold">
                  <span className="text-gray-800">Grand Estimated Total:</span>
                  <span className="text-gray-900 font-mono text-base">${grandTotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Insurance Add-on & Sidebar Sticky Proceed */}
        <div className="space-y-6">
          {/* Insurance / Protect Card */}
          <div className="bg-[#081C3A] text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 text-xs bg-white/10 w-fit px-2.5 py-1 rounded-full border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-bold tracking-wider uppercase">Highly Recommended</span>
              </div>
              <div>
                <h4 className="font-bold text-base leading-tight">Secure Premium Journey Cover</h4>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Protect against unexpected trip cancellations, lost bags, medical emergencies, and delays up to $50,000.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="block text-xl font-extrabold text-white">$49 <span className="text-[10px] text-gray-400 font-normal">/ guest</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeInsurance(!includeInsurance)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    includeInsurance 
                      ? "bg-emerald-500 text-white shadow-xs" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {includeInsurance ? "Protected" : "Add Cover"}
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Summary Proceed Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Checkout</h4>
            
            <div className="space-y-1">
              <span className="block text-xs text-gray-500">Estimated Grand Total ({numPassengers} Pax)</span>
              <span className="text-3xl font-extrabold text-gray-900 font-mono">${grandTotal}</span>
            </div>

            <button
              onClick={() => onProceedToSeats(includeInsurance)}
              className="w-full py-3.5 bg-[#202A36] text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center space-x-1"
              id="details-proceed-btn"
            >
              <span>Choose Seats</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center space-x-1">
              <Info className="w-3 h-3" />
              <span>Fare is guaranteed for 15 minutes</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
