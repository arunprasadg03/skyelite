import React, { useState } from "react";
import { Booking } from "../types";
import { 
  Briefcase, History, CreditCard, Heart, Bell, Wallet, 
  Settings, UserCheck, Moon, Sun, ShieldAlert, FileText, Compass, Trash2, Calendar,
  LogIn, LogOut, Loader2, CloudLightning, ShieldCheck, UserPlus
} from "lucide-react";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, UserProfile, saveUserProfile, signInWithGoogle } from "../lib/firebase";

interface UserDashboardProps {
  bookings: Booking[];
  onCancelBooking?: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  loadingBookings: boolean;
}

export default function UserDashboard({ 
  bookings, 
  onCancelBooking, 
  isDarkMode, 
  onToggleDarkMode,
  currentUser,
  userProfile,
  loadingBookings
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "travelers" | "wallet" | "settings">("upcoming");

  // Auth local states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const user = userCredential.user;
        const newProfile: UserProfile = {
          name: authName || authEmail.split("@")[0],
          email: authEmail,
          frequentFlyer: "SQ-" + Math.floor(1000000 + Math.random() * 9000000),
          tier: "Platinum",
          balance: 2500
        };
        await saveUserProfile(user.uid, newProfile);
      }
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed. Please verify credentials.";
      if (err.code === "auth/email-already-in-use") {
        msg = "Email is already registered. Please login instead.";
      } else if (err.code === "auth/invalid-credential") {
        msg = "Incorrect password or email.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password must be at least 6 characters long.";
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
    } catch (err: any) {
      console.error(err);
      setAuthError("Google Sign-In failed or was cancelled. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of SkyElite cloud services? Your active bookings will remain saved on this device.")) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getUserInitials = () => {
    if (currentUser && userProfile?.name) {
      return userProfile.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
    }
    return "GT";
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 bg-white border border-gray-100 rounded-3xl p-5 shadow-lg space-y-6 h-fit">
        <div className="border-b border-gray-100 pb-4 text-center relative">
          <div className="w-16 h-16 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            {getUserInitials()}
          </div>
          <h2 className="font-extrabold text-gray-800 mt-3 text-base truncate px-2">
            {currentUser ? (userProfile?.name || currentUser.email?.split("@")[0]) : "Guest Traveler"}
          </h2>
          <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest block mt-0.5">
            {currentUser ? `⭐ SkyElite ${userProfile?.tier || "Gold"} Member` : "☁️ Local Offline Session"}
          </span>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="mt-3 inline-flex items-center space-x-1 px-3 py-1 bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg text-[10px] font-bold transition-all border border-gray-100"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthError("");
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="mt-3 inline-flex items-center space-x-1 px-3 py-1 bg-[#081C3A] hover:bg-opacity-90 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In / Sync</span>
            </button>
          )}
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
            <span className="text-lg font-black block mt-1 font-mono">
              ${currentUser && userProfile ? userProfile.balance.toLocaleString() : "2,500.00"}
            </span>
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

            {!currentUser && (
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start space-x-3 text-xs">
                  <CloudLightning className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-800">Durable Cloud Backups Offline</h4>
                    <p className="text-gray-500 mt-0.5">Your bookings are currently saved on this local browser session. Sign in to enable Firebase database synchronization across all your devices.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAuthError("");
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 bg-[#202A36] text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shrink-0"
                >
                  Sync to Cloud
                </button>
              </div>
            )}
            {currentUser && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-3 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900">Active Firebase Sync Online</h4>
                  <p className="text-emerald-700 mt-0.5">Your bookings are safely backed up to Google Firebase Firestore under your profile ({currentUser.email}).</p>
                </div>
              </div>
            )}

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

      {/* Premium Firebase Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-gray-800">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg p-2"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#081C3A] text-white flex items-center justify-center rounded-2xl font-bold text-lg mx-auto mb-3 shadow-md">
                SE
              </div>
              <h3 className="text-xl font-black text-gray-900">SkyElite Premium Club</h3>
              <p className="text-xs text-gray-400 mt-1">
                {authMode === "login" 
                  ? "Access your luxury travel account and sync bookings to Firebase." 
                  : "Create your elite loyalty account to unlock durable cloud backups."}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs space-y-2">
                <p className="font-bold text-center text-rose-900">
                  {authError.includes("auth/operation-not-allowed") || authError.includes("operation-not-allowed")
                    ? "Email/Password sign-in is not enabled yet!"
                    : authError}
                </p>
                {(authError.includes("auth/operation-not-allowed") || authError.includes("operation-not-allowed")) && (
                  <div className="bg-white rounded-lg p-2.5 text-[11px] text-gray-700 leading-relaxed border border-rose-200">
                    <span className="font-bold text-gray-900 block mb-1">To enable Email/Password login:</span>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Firebase Console</a></li>
                      <li>Navigate to <strong>Build &gt; Authentication &gt; Sign-in method</strong></li>
                      <li>Click <strong>Add new provider</strong>, select <strong>Email/Password</strong>, and enable it</li>
                    </ol>
                    <span className="block mt-2 font-bold text-emerald-700">💡 Tip: You can Sign In with Google instantly below without any setup!</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#081C3A]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#081C3A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#081C3A]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#081C3A] hover:bg-opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{authMode === "login" ? "Sign In to Account" : "Register Credentials"}</span>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-bold tracking-wider text-[10px]">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2.5 shadow-xs disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </>
              )}
            </button>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs">
              <span className="text-gray-400">
                {authMode === "login" ? "New to SkyElite?" : "Already registered?"}{" "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="text-[#081C3A] font-extrabold hover:underline focus:outline-none"
              >
                {authMode === "login" ? "Create an account" : "Sign in here"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
