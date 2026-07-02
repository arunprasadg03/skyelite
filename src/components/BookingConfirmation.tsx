import { useState } from "react";
import { Flight, FlightSearchQuery, Passenger, ContactInfo } from "../types";
import { 
  CheckCircle, QrCode, Download, Receipt, Mail, Share2, 
  CalendarPlus, ArrowRight, Plane, Copy, Check 
} from "lucide-react";

interface BookingConfirmationProps {
  bookingId: string;
  flight: Flight;
  searchQuery: FlightSearchQuery;
  passengers: Passenger[];
  contactInfo: ContactInfo;
  selectedSeats: string[];
  paymentMethod: string;
  onFinish: () => void;
}

export default function BookingConfirmation({
  bookingId, flight, searchQuery, passengers, contactInfo, selectedSeats, paymentMethod, onFinish
}: BookingConfirmationProps) {
  
  const [copiedId, setCopiedId] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "done">("idle");

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleEmailTicket = () => {
    setEmailStatus("sending");
    setTimeout(() => {
      setEmailStatus("sent");
    }, 1500);
  };

  const handleDownloadTicket = () => {
    setDownloadStatus("downloading");
    setTimeout(() => {
      setDownloadStatus("done");
      // Trigger a simulated file download of boarding pass
      const content = `SKYELITE LUXURY FLIGHT TICKET\n\nBooking ID: ${bookingId}\nPassenger Name(s): ${passengers.map(p => p.name).join(", ")}\nRoute: ${searchQuery.origin} to ${searchQuery.destination}\nAirline: ${flight.airlineName} (${flight.flightNumber})\nSeats: ${selectedSeats.join(", ")}\nCabin Class: ${searchQuery.cabinClass}\nPayment Method: ${paymentMethod}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SkyElite_Ticket_${bookingId}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Large animated success illustration and notification */}
      <div className="text-center space-y-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md border border-emerald-100 relative">
          <CheckCircle className="w-12 h-12" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin opacity-40"></div>
        </div>
        <h1 className="text-3xl font-extrabold text-[#081C3A] tracking-tight">Booking Confirmed!</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Your flight booking has been successfully authorized and synchronized. A digital copy of your luxury boarding passes and transaction receipt has been sent to <span className="font-semibold text-gray-800">{contactInfo.email}</span>.
        </p>

        {/* Booking ID box with Copy */}
        <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-100 py-2 px-4 rounded-xl mt-4 font-mono text-xs">
          <span className="text-gray-400">BOOKING REF:</span>
          <span className="font-extrabold text-gray-800">{bookingId}</span>
          <button
            onClick={copyBookingId}
            className="text-gray-500 hover:text-gray-800 focus:outline-none ml-2"
            title="Copy reference code"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Boarding Pass layout */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Your Luxury Boarding Passes</h3>
        
        {passengers.map((passenger, idx) => (
          <div 
            key={passenger.id}
            className="bg-white border-2 border-dashed border-gray-200 rounded-[20px] shadow-lg overflow-hidden flex flex-col md:flex-row relative hover:shadow-xl transition-shadow"
            id={`boarding-pass-${idx}`}
          >
            {/* Left Pass Body (Primary ticket) */}
            <div className="flex-1 p-6 space-y-6 md:border-r-2 md:border-dashed md:border-gray-100">
              {/* Airline header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#081C3A] flex items-center justify-center text-white text-xs font-extrabold">
                    <Plane className="w-4 h-4 -rotate-45" />
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">{flight.airlineName}</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-[#F5B301] uppercase bg-amber-50 border border-amber-200 py-1 px-3 rounded-full">
                  {searchQuery.cabinClass} CLASS
                </span>
              </div>

              {/* Journey details */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <span className="block text-2xl font-black text-gray-900">{searchQuery.origin}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Departure Airport</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-gray-400">{flight.duration}</span>
                  <div className="w-full h-0.5 bg-dashed bg-gray-200 relative flex items-center justify-center">
                    <Plane className="w-3.5 h-3.5 text-gray-300 absolute -rotate-45" />
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold mt-1">Confirmed Flight</span>
                </div>

                <div className="text-right">
                  <span className="block text-2xl font-black text-gray-900">{searchQuery.destination}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Destination Airport</span>
                </div>
              </div>

              {/* Passenger & Flight code specifics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Passenger</span>
                  <span className="font-extrabold text-gray-800 truncate block">{passenger.name || "Arun Prasad"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Seat Number</span>
                  <span className="font-extrabold text-amber-500 font-mono text-sm">{selectedSeats[idx] || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Flight Number</span>
                  <span className="font-extrabold text-gray-800 font-mono">{flight.flightNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</span>
                  <span className="font-extrabold text-gray-800">{searchQuery.departureDate}</span>
                </div>
              </div>
            </div>

            {/* Right Pass Body (Stub with QR) */}
            <div className="w-full md:w-56 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs">
                {/* Visual beautiful QR code mock */}
                <QrCode className="w-24 h-24 text-[#202A36]" />
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">Gate Closes 30 mins before</span>
                <span className="text-xs font-bold text-gray-800 font-mono mt-1 block">Gate B12 • Boarding 07:15</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Download */}
        <button
          onClick={handleDownloadTicket}
          disabled={downloadStatus === "downloading"}
          className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 text-center space-y-2 hover:shadow-md transition-all group flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 block">
            {downloadStatus === "downloading" ? "Downloading..." : downloadStatus === "done" ? "Downloaded ✅" : "Download Ticket"}
          </span>
        </button>

        {/* Invoice */}
        <button
          onClick={() => {
            alert(`Receipt generated!\nTransaction Ref: ${bookingId}\nGrand Total: Verified.\nThank you for choosing SkyElite.`);
          }}
          className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 text-center space-y-2 hover:shadow-md transition-all group flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 block">Get Tax Invoice</span>
        </button>

        {/* Email */}
        <button
          onClick={handleEmailTicket}
          disabled={emailStatus === "sending"}
          className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 text-center space-y-2 hover:shadow-md transition-all group flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 block">
            {emailStatus === "sending" ? "Sending..." : emailStatus === "sent" ? "Email Sent ✅" : "Email Tickets"}
          </span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => {
            alert(`Calendar Event Sync Initiated!\nFlight ${flight.flightNumber} from ${searchQuery.origin} to ${searchQuery.destination} added successfully to Google Calendar.`);
          }}
          className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 text-center space-y-2 hover:shadow-md transition-all group flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-800 block">Add to Calendar</span>
        </button>
      </div>

      {/* Done CTA */}
      <div className="text-center">
        <button
          onClick={onFinish}
          className="py-3.5 px-8 bg-[#202A36] text-white font-semibold rounded-xl hover:bg-opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md inline-flex items-center space-x-1.5"
          id="confirmation-finish-btn"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
