import React, { useState } from "react";
import { Booking } from "../types";
import { 
  Briefcase, History, CreditCard, Heart, Bell, Wallet, 
  Settings, UserCheck, Moon, Sun, ShieldAlert, FileText, Compass, Trash2, Calendar
} from "lucide-react";

interface UserDashboardProps {
  bookings: Booking[];
  onCancelBooking?: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function UserDashboard({ bookings, onCancelBooking, isDarkMode, onToggleDarkMode }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "travelers" | "wallet" | "settings">("upcoming");

  // Mock static traveler profiles
  const [travelers, setTravelers] = useState([
    { name: "Arun Prasad", email: "arunprasad.g03@gmail.com", passport: "Z9876543", frequentFlyer: "SQ-9874521" },
    { name: "Elena Vance", email: "elena@vance.com", passport: "US-2234112", frequentFlyer: "LH-44589" }
  ]);

  const [newTravelerName, setNewTravelerName] = useState("");
  const [newTravelerEmail, setNewTravelerEmail] = useState("");
  const [newTravelerPassport, setNewTravelerPassport] = useState("");

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;
    setTravelers((prev) => [
      ...prev,
      {
        name: newTravelerName,
        email: newTravelerEmail || "info@skyelite.com",
        passport: newTravelerPassport || "PENDING",
        frequentFlyer: "N/A"
      }
    ]);
    setNewTravelerName("");
    setNewTravelerEmail("");
    setNewTravelerPassport("");
  };

  const handleRemoveTraveler = (name: string) => {
    setTravelers((prev) => prev.filter(t => t.name !== name));
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 bg-white border border-gray-100 rounded-3xl p-5 shadow-lg space-y-6 h-fit">
        <div className="border-b border-gray-100 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            AP
          </div>
          <h2 className="font-extrabold text-gray-800 mt-3 text-base">Arun Prasad</h2>
          <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest block mt-0.5">⭐ SkyElite Gold Member</span>
        </div>

        {/* Navigation buttons list */}
        <div className="flex flex-col space-y-1">
          {[
            { id: "upcoming", label: "Upcoming Flights", icon: <Briefcase className="w-4 h-4" /> },
            { id: "past", label: "Past Journeys", icon: <History className="w-4 h-4" /> },
            { id: "travelers", label: "Saved Travelers", icon: <UserCheck className="w-4 h-4" /> },
            { id: "wallet", label: "Travel Wallet", icon: <Wallet className="w-4 h-4" /> },
            { id: "settings", label: "Portal Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === item.id
                  ? "bg-[#202A36] text-white shadow-xs"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Utilities: Dark Mode and balance */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-semibold">Active Experience:</span>
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 focus:outline-none"
              title="Toggle Dark Mode Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-800 text-center">
            <span className="block text-[10px] font-bold uppercase text-amber-500 tracking-wider">Travel Credits</span>
            <span className="text-lg font-black block mt-1">$2,500.00</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg min-h-[500px]">
        
        {/* TAB 1: UPCOMING FLIGHTS */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upcoming Departures</h3>
                <p className="text-xs text-gray-400 mt-0.5">Track active flights, retrieve barcodes, or modify reservations.</p>
              </div>
              <span className="text-xs font-extrabold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                {bookings.length} Flight{bookings.length === 1 ? "" : "s"} booked
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-16 text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">No active bookings found</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    You have no active flights scheduled. Tap "Book Now" at the top to discover premium journeys.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="border border-gray-100 hover:border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all"
                  >
                    {/* Header bar */}
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
                        <span>Ref: <span className="font-mono text-gray-900">{booking.bookingId}</span></span>
                        <span className="text-gray-300">•</span>
                        <span>Date: {booking.dateBooked}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                        Confirmed & Ticketed
                      </span>
                    </div>

                    {/* Flight Detail Grid */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Route</span>
                        <span className="text-lg font-extrabold text-gray-900 mt-1 block">
                          {booking.flight.flightNumber} • {booking.flight.airlineName}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold mt-1 block">
                          {booking.flight.departureTime} ({booking.flight.cabin.toUpperCase()} CLASS)
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Travelers</span>
                        <span className="text-xs text-gray-800 font-semibold mt-1 block truncate">
                          {booking.passengers.map(p => p.name).join(", ")}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          Seat(s): {booking.selectedSeats.join(", ")}
                        </span>
                      </div>

                      <div className="flex sm:justify-end gap-2">
                        {onCancelBooking && (
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to cancel this flight? Free cancellations apply under SkyElite premium policy.")) {
                                onCancelBooking(booking.id);
                              }
                            }}
                            className="p-2 border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center space-x-1"
                            title="Cancel booking"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Cancel Flight</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            alert(`Showing flight timeline details!\nMeal choice: Selected\nLuggage: 40KG Checked Allowed\nGate closes 30 minutes prior to ${booking.flight.departureTime}.`);
                          }}
                          className="px-4 py-2 bg-[#202A36] text-white rounded-xl text-xs font-bold hover:bg-opacity-95"
                        >
                          View Pass
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST JOURNEYS */}
        {activeTab === "past" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Past Flight Histories</h3>
              <p className="text-xs text-gray-400 mt-0.5">Explore trips completed or generate statement invoices.</p>
            </div>

            <div className="space-y-4">
              {[
                { date: "May 10, 2026", route: "DXB ➔ LHR", airline: "Emirates (EK-005)", class: "First Class", cost: "$4,550", id: "PST-98745" },
                { date: "March 22, 2026", route: "HND ➔ SIN", airline: "Singapore Airlines (SQ-012)", class: "Business Class", cost: "$2,850", id: "PST-22345" },
              ].map((trip) => (
                <div key={trip.id} className="border border-gray-100 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-xs font-medium text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#202A36]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-extrabold text-sm">{trip.route}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{trip.airline} • {trip.date}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-right">{trip.class}</span>
                    <span className="text-gray-900 font-bold block text-right font-mono mt-0.5">{trip.cost}</span>
                  </div>
                  <div className="flex justify-end w-full sm:w-auto">
                    <button
                      onClick={() => alert(`Generating statement download for past reference code ${trip.id}`)}
                      className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-[11px] font-bold"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED TRAVELERS */}
        {activeTab === "travelers" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Saved Passenger Profiles</h3>
              <p className="text-xs text-gray-400 mt-0.5">Store traveler details for rapid automated checkouts.</p>
            </div>

            {/* Travelers list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {travelers.map((traveler) => (
                <div key={traveler.name} className="border border-gray-100 rounded-2xl p-4 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveTraveler(traveler.name)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 text-xs font-bold"
                  >
                    Delete
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs">
                      {traveler.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{traveler.name}</h4>
                      <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{traveler.email}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-50 grid grid-cols-2 text-[10px] text-gray-500">
                    <div>
                      <span className="block text-gray-400 font-bold uppercase tracking-wider">Passport</span>
                      <span className="font-extrabold text-gray-800">{traveler.passport}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase tracking-wider">Flyer Loyalty</span>
                      <span className="font-extrabold text-gray-800">{traveler.frequentFlyer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-add Traveler Form */}
            <form onSubmit={handleAddTraveler} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add Saved Traveler</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  value={newTravelerName}
                  onChange={(e) => setNewTravelerName(e.target.value)}
                  placeholder="Full Name as in Passport"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#202A36]"
                />
                <input
                  type="email"
                  value={newTravelerEmail}
                  onChange={(e) => setNewTravelerEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#202A36]"
                />
                <input
                  type="text"
                  value={newTravelerPassport}
                  onChange={(e) => setNewTravelerPassport(e.target.value)}
                  placeholder="Passport Number"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#202A36]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#202A36] hover:bg-opacity-95 text-white rounded-xl text-xs font-bold"
              >
                Add Saved Profile
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TRAVEL WALLET */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Your Wallet Balances</h3>
              <p className="text-xs text-gray-400 mt-0.5">Use credits, add gift cards, or redeem luxury flight vouchers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#081C3A] text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
                <span className="text-[10px] uppercase font-bold tracking-widest block text-gray-300">Active Balance</span>
                <span className="text-2xl font-black block mt-2 font-mono">$2,500.00</span>
                <span className="text-[10px] text-emerald-400 block mt-1">100% Eligible for flight payments</span>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold tracking-widest block text-gray-400">Total Redeemed</span>
                <span className="text-2xl font-black block mt-2 font-mono text-gray-800">$1,200.00</span>
                <span className="text-[10px] text-gray-400 block mt-1">Vouchers used this year</span>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold tracking-widest block text-gray-400">Expiring soon</span>
                <span className="text-2xl font-black block mt-2 font-mono text-gray-800">$0.00</span>
                <span className="text-[10px] text-gray-400 block mt-1">No credits expiring</span>
              </div>
            </div>

            {/* Wallet transactions list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Ledger</h4>
              {[
                { ref: "WLT-8271", type: "Voucher Refund", date: "April 15, 2026", amount: "+$1,500.00", status: "completed" },
                { ref: "WLT-1092", type: "Flight Purchase", date: "March 22, 2026", amount: "-$1,200.00", status: "completed" },
                { ref: "WLT-0034", type: "First Deposit", date: "January 01, 2026", amount: "+$2,200.00", status: "completed" },
              ].map((txn) => (
                <div key={txn.ref} className="bg-gray-50/50 p-4 rounded-xl flex justify-between items-center text-xs border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800 block">{txn.type}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">{txn.ref} • {txn.date}</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${txn.amount.startsWith("+") ? "text-emerald-600" : "text-gray-800"}`}>
                    {txn.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PORTAL SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Portal & Security Settings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Customize notification modes, currency parameters, and security tokens.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">System Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-600">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1">Standard Currency</label>
                    <select className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold text-gray-800">
                      <option value="usd">USD ($) - United States Dollar</option>
                      <option value="eur">EUR (€) - Euro</option>
                      <option value="gbp">GBP (£) - British Pound Sterling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1">Language Selector</label>
                    <select className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold text-gray-800">
                      <option value="en">English (United States)</option>
                      <option value="fr">Français (French)</option>
                      <option value="ja">日本語 (Japanese)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2 text-xs text-rose-800">
                <div className="flex items-center space-x-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Immediate Account Freeze option</span>
                </div>
                <p>
                  Freezing immediately locks your passport numbers, stored payment card tokens, and security profile from active use on SkyElite to guard against identity or credit card hijacking.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Account frozen requested. Check email immediately for 2FA validation codes.")}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl mt-2"
                >
                  Freeze Account Credentials
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
