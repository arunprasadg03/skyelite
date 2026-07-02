import { useState, useMemo } from "react";
import { Flight, FlightSearchQuery, CabinClass } from "../types";
import { MOCK_FLIGHTS } from "../data";
import { 
  Wifi, Utensils, ShieldCheck, Clock, Luggage, Star, SlidersHorizontal,
  ChevronDown, ArrowRight, Plane, ArrowUpDown, RefreshCw, X
} from "lucide-react";

interface FlightResultsProps {
  searchQuery: FlightSearchQuery;
  onSelectFlight: (flight: Flight) => void;
  onBackToSearch: () => void;
}

type SortOption = "cheapest" | "fastest" | "best" | "recommended";

export default function FlightResults({ searchQuery, onSelectFlight, onBackToSearch }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter] = useState<number | null>(null); // null = Any, 0 = Non-stop, 1 = 1 Stop
  const [onlyRefundable, setOnlyRefundable] = useState(false);
  const [requireWifi, setRequireWifi] = useState(false);
  const [requireMeals, setRequireMeals] = useState(false);

  // List of all airlines from mock data to show in filter checkboxes
  const airlinesList = useMemo(() => {
    return Array.from(new Set(MOCK_FLIGHTS.map((f) => f.airlineName)));
  }, []);

  // Filter and Sort flights based on search query + user selections
  const processedFlights = useMemo(() => {
    let result = MOCK_FLIGHTS.map((f) => {
      // Dynamically adjust price based on chosen Cabin Class to simulate true class difference
      let finalPrice = f.price;
      if (searchQuery.cabinClass === "economy") {
        finalPrice = Math.round(f.price * 0.22);
      } else if (searchQuery.cabinClass === "premium-economy") {
        finalPrice = Math.round(f.price * 0.45);
      } else if (searchQuery.cabinClass === "first") {
        finalPrice = Math.round(f.price * 1.85);
      }

      // Apply promotional code reduction (e.g. SKY20 gives 20% discount)
      if (searchQuery.promoCode?.toUpperCase() === "SKY20") {
        finalPrice = Math.round(finalPrice * 0.8);
      }

      return {
        ...f,
        price: finalPrice,
        cabin: searchQuery.cabinClass
      };
    });

    // 1. Filter by Price
    result = result.filter((f) => f.price <= maxPrice);

    // 2. Filter by Airlines
    if (selectedAirlines.length > 0) {
      result = result.filter((f) => selectedAirlines.includes(f.airlineName));
    }

    // 3. Filter by Stops
    if (stopsFilter !== null) {
      result = result.filter((f) => f.stops === stopsFilter);
    }

    // 4. Filter by Refundable
    if (onlyRefundable) {
      result = result.filter((f) => f.refundable);
    }

    // 5. Filter by Amenities
    if (requireWifi) {
      result = result.filter((f) => f.wifi);
    }
    if (requireMeals) {
      result = result.filter((f) => f.meals);
    }

    // 6. Sort
    return result.sort((a, b) => {
      if (sortBy === "cheapest") {
        return a.price - b.price;
      }
      if (sortBy === "fastest") {
        // Convert duration string like "6h 30m" to total minutes
        const getMinutes = (d: string) => {
          const hours = parseInt(d.split("h")[0]) || 0;
          const mins = parseInt(d.split("h")[1]?.replace("m", "")) || 0;
          return hours * 60 + mins;
        };
        return getMinutes(a.duration) - getMinutes(b.duration);
      }
      if (sortBy === "best") {
        return b.rating - a.rating;
      }
      // "recommended" mixes rating and competitive price
      return b.rating * 1000 - b.price - (a.rating * 1000 - a.price);
    });
  }, [searchQuery, sortBy, maxPrice, selectedAirlines, stopsFilter, onlyRefundable, requireWifi, requireMeals]);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  const resetFilters = () => {
    setMaxPrice(5000);
    setSelectedAirlines([]);
    setStopsFilter(null);
    setOnlyRefundable(false);
    setRequireWifi(false);
    setRequireMeals(false);
  };

  return (
    <div className="w-full">
      {/* Search Query Summary Ribbon */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-xl text-[#202A36]">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
              <span>{searchQuery.origin}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span>{searchQuery.destination}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full capitalize">
                {searchQuery.tripType.replace("-", " ")}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4">
              <span>📅 {searchQuery.departureDate} {searchQuery.returnDate ? `to ${searchQuery.returnDate}` : ""}</span>
              <span>👤 {searchQuery.passengers} Passenger{searchQuery.passengers > 1 ? "s" : ""}</span>
              <span className="capitalize">✨ {searchQuery.cabinClass.replace("-", " ")}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onBackToSearch}
          className="text-xs font-semibold text-[#202A36] hover:text-opacity-80 transition-colors border border-gray-200 hover:border-gray-300 py-2 px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer bg-white"
          id="back-to-search-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Modify Search</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side Filters (Desktop: visible, Mobile: toggled) */}
        <div className={`lg:col-span-1 ${showFilters ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden lg:block"} lg:relative lg:p-0 lg:z-auto lg:bg-transparent`}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-gray-900 flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span>Advanced Filters</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-gray-700 font-semibold"
                  id="reset-filters-btn"
                >
                  Reset
                </button>
                {showFilters && (
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 bg-gray-100 rounded-md text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Max Price: <span className="text-gray-900 font-mono font-bold">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="200"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#202A36] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                id="filter-price-slider"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>$200</span>
                <span>$5,000</span>
              </div>
            </div>

            {/* Stops Filter */}
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stops</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Any", value: null },
                  { label: "Non-stop", value: 0 },
                  { label: "1 Stop", value: 1 }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setStopsFilter(item.value)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      stopsFilter === item.value
                        ? "bg-[#202A36] border-[#202A36] text-white"
                        : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Airlines Filter */}
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Airlines</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {airlinesList.map((airline) => (
                  <label key={airline} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="rounded text-[#202A36] focus:ring-[#202A36] border-gray-300 w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Refundable */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyRefundable}
                  onChange={(e) => setOnlyRefundable(e.target.checked)}
                  className="rounded text-[#202A36] focus:ring-[#202A36] border-gray-300 w-4 h-4"
                />
                <span className="font-medium text-gray-700">Fully Refundable</span>
              </label>
            </div>

            {/* Amenities */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amenities</span>
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireWifi}
                  onChange={(e) => setRequireWifi(e.target.checked)}
                  className="rounded text-[#202A36] focus:ring-[#202A36] border-gray-300 w-4 h-4"
                />
                <span className="font-medium text-gray-700">In-flight Wi-Fi</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireMeals}
                  onChange={(e) => setRequireMeals(e.target.checked)}
                  className="rounded text-[#202A36] focus:ring-[#202A36] border-gray-300 w-4 h-4"
                />
                <span className="font-medium text-gray-700">Complementary Meals</span>
              </label>
            </div>

            {showFilters && (
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-[#202A36] text-white text-sm font-semibold rounded-xl"
              >
                Apply Filters
              </button>
            )}
          </div>
        </div>

        {/* Right Side Search Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting Ribbon */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs flex flex-wrap justify-between items-center gap-3">
            <div className="flex space-x-1 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              {([
                { key: "recommended", label: "Recommended" },
                { key: "cheapest", label: "Cheapest" },
                { key: "fastest", label: "Fastest" },
                { key: "best", label: "Best Experiential" }
              ] as { key: SortOption; label: string }[]).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    sortBy === option.key
                      ? "bg-gray-100 text-[#202A36] shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  id={`sort-option-${option.key}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-500 hidden md:inline">
                {processedFlights.length} premium options found
              </span>
              {/* Mobile filter trigger */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white flex items-center space-x-1"
                id="mobile-filters-trigger"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Flights List */}
          {processedFlights.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Plane className="w-8 h-8 -rotate-45" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No flights matches found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                We couldn't find any flights matching your current filter criteria. Try expanding your price limit or selecting other airlines.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#202A36] text-white rounded-xl text-sm font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            processedFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white border border-gray-100 hover:border-gray-300 rounded-[20px] p-5 md:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-stretch gap-6 group"
                id={`flight-card-${flight.id}`}
              >
                {/* Airline & Times Segment */}
                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 md:pr-6 md:border-r border-gray-100">
                  {/* Airline Info */}
                  <div className="flex items-center space-x-4 self-start md:self-center w-full md:w-auto">
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airlineName}
                      className="w-12 h-12 rounded-xl border border-gray-100 object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{flight.airlineName}</h4>
                      <p className="text-xs text-gray-400 font-mono">{flight.flightNumber} • {flight.aircraftType}</p>
                    </div>
                  </div>

                  {/* Flight Times Timeline */}
                  <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-start">
                    {/* Departure */}
                    <div className="text-left">
                      <span className="block text-lg font-extrabold text-gray-900">{flight.departureTime}</span>
                      <span className="text-xs text-gray-400 font-bold">{searchQuery.origin}</span>
                    </div>

                    {/* Timeline Line */}
                    <div className="flex-1 md:w-28 flex flex-col items-center px-4 relative">
                      <span className="text-[10px] text-gray-400 font-semibold mb-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{flight.duration}</span>
                      </span>
                      <div className="w-full h-0.5 bg-gray-200 rounded-full relative flex items-center justify-center">
                        {flight.stops > 0 ? (
                          <div className="absolute w-2 h-2 rounded-full bg-[#F5B301]" title={flight.layover} />
                        ) : (
                          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold mt-1">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop (${flight.layover?.split(" ")[0]})`}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <span className="block text-lg font-extrabold text-gray-900">{flight.arrivalTime}</span>
                      <span className="text-xs text-gray-400 font-bold">{searchQuery.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities & Price checkout Segment */}
                <div className="w-full md:w-56 flex flex-row md:flex-col justify-between items-center md:items-end gap-4 self-center">
                  {/* Icons / Amenities */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {flight.wifi && (
                      <span className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors" title="High-speed Wi-Fi Included">
                        <Wifi className="w-4 h-4" />
                      </span>
                    )}
                    {flight.meals && (
                      <span className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors" title="Complementary Fine Dining Meal">
                        <Utensils className="w-4 h-4" />
                      </span>
                    )}
                    {flight.refundable && (
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-medium text-[10px] uppercase px-2 flex items-center space-x-1" title="100% Refundable Ticket">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Refundable</span>
                      </span>
                    )}
                    <span className="p-1.5 rounded-lg bg-gray-50 text-yellow-500 text-[10px] font-bold px-2 flex items-center space-x-0.5">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      <span>{flight.rating}</span>
                    </span>
                  </div>

                  {/* Price & Selection */}
                  <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                    <div className="mr-4 md:mr-0">
                      <span className="text-2xl font-extrabold text-[#202A36]">${flight.price}</span>
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">All taxes & fees incl.</span>
                    </div>
                    <button
                      onClick={() => onSelectFlight(flight)}
                      className="mt-2 px-5 py-2.5 bg-[#202A36] hover:bg-opacity-95 text-white text-xs font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                      id={`select-flight-btn-${flight.id}`}
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
