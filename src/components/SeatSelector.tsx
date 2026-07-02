import { useState, useMemo } from "react";
import { Seat, FlightSearchQuery, Flight } from "../types";
import { Plane, AlertTriangle, Users, CheckCircle, Info } from "lucide-react";

interface SeatSelectorProps {
  flight: Flight;
  searchQuery: FlightSearchQuery;
  onBackToDetails: () => void;
  onProceedToPassengers: (selectedSeats: string[]) => void;
}

export default function SeatSelector({ flight, searchQuery, onBackToDetails, onProceedToPassengers }: SeatSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const requiredCount = searchQuery.passengers;

  // Generate dynamic seating arrangement
  const seats: Seat[] = useMemo(() => {
    const list: Seat[] = [];
    const rows = 12; // 12 rows
    const cols = ["A", "B", "C", "D", "E", "F"]; // 6 columns
    
    // Seed standard mock occupied seats
    const occupiedSeeds = [
      "1A", "1F", "2B", "3C", "3D", "4A", "4E", "5F", "6B", "6C", 
      "7D", "8A", "8F", "9B", "9E", "10C", "11D", "12A", "12F"
    ];

    for (let r = 1; r <= rows; r++) {
      cols.forEach((col) => {
        const id = `${r}${col}`;
        const isOccupied = occupiedSeeds.includes(id);
        
        let type: "standard" | "extra-legroom" | "premium" | "exit-row" = "standard";
        let priceExtra = 0;
        
        if (r <= 2) {
          type = "premium";
          priceExtra = 150; // Premium charge
        } else if (r === 6) {
          type = "exit-row";
          priceExtra = 75; // Exit Row charge
        } else if (r === 3 || r === 4) {
          type = "extra-legroom";
          priceExtra = 45; // Extra legroom
        }

        list.push({
          id,
          row: r,
          letter: col,
          type,
          isOccupied,
          priceExtra
        });
      });
    }
    return list;
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((s) => s !== seat.id);
      }
      
      // If we already selected the maximum allowed based on passengers
      if (prev.length >= requiredCount) {
        // Swap out the first one
        return [...prev.slice(1), seat.id];
      }
      
      return [...prev, seat.id];
    });
  };

  const selectedSeatsDetails = useMemo(() => {
    return seats.filter((s) => selectedSeats.includes(s.id));
  }, [selectedSeats, seats]);

  const extraFeesTotal = useMemo(() => {
    return selectedSeatsDetails.reduce((sum, s) => sum + s.priceExtra, 0);
  }, [selectedSeatsDetails]);

  const getSeatColorClass = (seat: Seat) => {
    if (seat.isOccupied) return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (selectedSeats.includes(seat.id)) return "bg-[#F5B301] border-[#F5B301] text-gray-900 font-extrabold shadow-md scale-105";
    
    switch (seat.type) {
      case "premium":
        return "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300";
      case "exit-row":
        return "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300";
      case "extra-legroom":
        return "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300";
      default:
        return "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getSeatTypeLabel = (type: string) => {
    switch (type) {
      case "premium": return "Royal Cabin";
      case "exit-row": return "Exit Row (Spacious)";
      case "extra-legroom": return "Extra Legroom";
      default: return "Standard";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Left side airplane seating map */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-6">
          <Plane className="w-5 h-5 text-gray-500 -rotate-45" />
          <h2 className="text-lg font-bold text-gray-900">Interactive Seat Layout</h2>
        </div>

        {/* Aircraft Nose representation */}
        <div className="w-full max-w-[340px] border-t-2 border-x-2 border-gray-300 rounded-t-[100px] h-12 bg-gray-50 flex items-center justify-center relative">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cockpit</span>
          <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
        </div>

        {/* Seating Fuselage Body */}
        <div className="w-full max-w-[340px] border-x-2 border-gray-300 bg-gray-50/50 p-4 space-y-3 relative">
          {/* Column identifiers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 font-mono pb-2 border-b border-gray-100">
            <span></span>
            <span>A</span>
            <span>B</span>
            <span>C</span>
            <span></span>
            <span>D</span>
            <span>E</span>
            <span>F</span>
          </div>

          {/* Row mapping */}
          {Array.from({ length: 12 }).map((_, rIdx) => {
            const rowNum = rIdx + 1;
            const isExitRow = rowNum === 6;

            return (
              <div key={rowNum} className="relative">
                {/* Exit Door visual indicators */}
                {isExitRow && (
                  <div className="absolute -left-8 -right-8 top-1/2 -translate-y-1/2 flex justify-between px-1.5 pointer-events-none">
                    <span className="bg-rose-500 text-[8px] text-white font-extrabold py-0.5 px-1.5 rounded-xs uppercase flex items-center space-x-0.5 shadow-sm animate-pulse">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Exit</span>
                    </span>
                    <span className="bg-rose-500 text-[8px] text-white font-extrabold py-0.5 px-1.5 rounded-xs uppercase flex items-center space-x-0.5 shadow-sm animate-pulse">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Exit</span>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-7 gap-2 text-center items-center">
                  {/* Row Number */}
                  <span className="text-[10px] font-bold text-gray-400 font-mono">{rowNum}</span>

                  {/* Seat A */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "A");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}

                  {/* Seat B */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "B");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}

                  {/* Seat C */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "C");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}

                  {/* Aisle Spacer */}
                  <div className="text-[10px] font-mono text-gray-300 select-none">Aisle</div>

                  {/* Seat D */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "D");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}

                  {/* Seat E */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "E");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}

                  {/* Seat F */}
                  {(() => {
                    const seat = seats.find((s) => s.row === rowNum && s.letter === "F");
                    if (!seat) return <div />;
                    return (
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${getSeatColorClass(seat)}`}
                        disabled={seat.isOccupied}
                        title={`${seat.id} - ${getSeatTypeLabel(seat.type)} (+$${seat.priceExtra})`}
                      >
                        {seat.letter}
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aircraft Tail representation */}
        <div className="w-full max-w-[340px] border-b-2 border-x-2 border-gray-300 rounded-b-3xl h-10 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          Galley & Exit
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-t border-gray-100 pt-5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-amber-50 border border-amber-300 inline-block"></span>
            <span className="text-gray-500 font-medium">Royal Cabin (+$150)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-rose-50 border border-rose-300 inline-block"></span>
            <span className="text-gray-500 font-medium">Exit Row (+$75)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-blue-50 border border-blue-300 inline-block"></span>
            <span className="text-gray-500 font-medium">Extra Legroom (+$45)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-white border border-gray-200 inline-block"></span>
            <span className="text-gray-500 font-medium">Standard ($0)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-md bg-gray-200 inline-block"></span>
            <span className="text-gray-500 font-medium">Occupied</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <span className="w-4 h-4 rounded-md bg-[#F5B301] inline-block"></span>
            <span className="text-gray-900 font-bold">Selected Seats</span>
          </div>
        </div>
      </div>

      {/* Right side booking totals and selectors */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Seating Selection</h3>

          {/* Passenger requirement checker */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3 text-blue-800 text-xs">
            <Users className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold block">Selection Requirement</span>
              <p>
                You are booking for <span className="font-extrabold">{requiredCount}</span> traveler{requiredCount > 1 ? "s" : ""}. Please select <span className="font-extrabold">{requiredCount}</span> seat{requiredCount > 1 ? "s" : ""} from the flight layout.
              </p>
            </div>
          </div>

          {/* Selection List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Selections</h4>
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No seats selected yet. Please tap on your preferred seats in the aircraft diagram.</p>
            ) : (
              <div className="space-y-2">
                {selectedSeatsDetails.map((seat, idx) => (
                  <div key={seat.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <span className="font-extrabold text-gray-900 text-sm mr-2">Seat {seat.id}</span>
                      <span className="text-gray-500 font-medium">({getSeatTypeLabel(seat.type)})</span>
                    </div>
                    <span className="font-extrabold text-gray-800 font-mono">
                      {seat.priceExtra > 0 ? `+$${seat.priceExtra}` : "Included"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade prompt */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-2 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Row 1 & 2 represents our <span className="font-bold">Royal Cabin Class</span> equipped with full privacy sliding doors, active seat massagers, and complimentary amenity bags.
            </p>
          </div>

          {/* Selection Checklist & Proceed */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Selected Seats:</span>
              <span className="font-bold text-gray-900">{selectedSeats.length} / {requiredCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Seating Upgrade Fees:</span>
              <span className="font-bold text-gray-900 font-mono">+${extraFeesTotal}</span>
            </div>

            <button
              onClick={() => onProceedToPassengers(selectedSeats)}
              disabled={selectedSeats.length !== requiredCount}
              className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 ${
                selectedSeats.length === requiredCount
                  ? "bg-[#202A36] text-white hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
              id="seats-proceed-btn"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Add Passengers</span>
            </button>

            <button
              onClick={onBackToDetails}
              className="w-full py-2.5 bg-white text-gray-600 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel & Back to Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
