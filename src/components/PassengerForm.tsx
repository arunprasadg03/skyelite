import React, { useState } from "react";
import { Passenger, ContactInfo, FlightSearchQuery } from "../types";
import { User, ShieldAlert, Check, Users, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";

interface PassengerFormProps {
  searchQuery: FlightSearchQuery;
  selectedSeats: string[];
  onBackToSeats: () => void;
  onProceedToPayment: (passengers: Passenger[], contactInfo: ContactInfo) => void;
}

export default function PassengerForm({ searchQuery, selectedSeats, onBackToSeats, onProceedToPayment }: PassengerFormProps) {
  const numPassengers = searchQuery.passengers;
  const [activePassengerIdx, setActivePassengerIdx] = useState(0);

  // Initialize passengers array
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    return Array.from({ length: numPassengers }).map((_, idx) => ({
      id: `p-${idx + 1}`,
      name: idx === 0 ? "Arun Prasad" : "", // Prepopulate current user
      gender: idx === 0 ? "male" : "",
      dob: idx === 0 ? "1994-06-15" : "",
      nationality: idx === 0 ? "Indian" : "",
      passport: idx === 0 ? "Z9876543" : "",
      mealPreference: "none",
      specialAssistance: "none",
      frequentFlyer: idx === 0 ? "SQ-9874521" : "",
    }));
  });

  // Contact Info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "arunprasad.g03@gmail.com",
    phone: "+91 9876543210",
    emergencyName: "Ganesh Prasad",
    emergencyPhone: "+91 9988776655"
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePassengerChange = (idx: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const autofillPassenger = (idx: number) => {
    if (idx === 0) {
      handlePassengerChange(0, "name", "Arun Prasad");
      handlePassengerChange(0, "gender", "male");
      handlePassengerChange(0, "dob", "1994-06-15");
      handlePassengerChange(0, "nationality", "India");
      handlePassengerChange(0, "passport", "Z9876543");
      handlePassengerChange(0, "mealPreference", "kosher");
      handlePassengerChange(0, "specialAssistance", "none");
      handlePassengerChange(0, "frequentFlyer", "SQ-9874521");
    } else {
      // General mock companion
      handlePassengerChange(idx, "name", `Elena Vance`);
      handlePassengerChange(idx, "gender", "female");
      handlePassengerChange(idx, "dob", "1996-03-22");
      handlePassengerChange(idx, "nationality", "United States");
      handlePassengerChange(idx, "passport", "US-2234112");
      handlePassengerChange(idx, "mealPreference", "vegan");
      handlePassengerChange(idx, "specialAssistance", "none");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate passenger fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setValidationError(`Please enter the full name for Passenger ${i + 1}.`);
        setActivePassengerIdx(i);
        return;
      }
      if (!p.gender) {
        setValidationError(`Please specify the gender for Passenger ${i + 1}.`);
        setActivePassengerIdx(i);
        return;
      }
      if (!p.dob) {
        setValidationError(`Please specify the date of birth for Passenger ${i + 1}.`);
        setActivePassengerIdx(i);
        return;
      }
      if (!p.nationality.trim()) {
        setValidationError(`Please specify the nationality for Passenger ${i + 1}.`);
        setActivePassengerIdx(i);
        return;
      }
      if (!p.passport.trim()) {
        setValidationError(`Please enter the passport number for Passenger ${i + 1}.`);
        setActivePassengerIdx(i);
        return;
      }
    }

    // Validate contact fields
    if (!contactInfo.email.trim() || !contactInfo.email.includes("@")) {
      setValidationError("Please enter a valid contact email address.");
      return;
    }
    if (!contactInfo.phone.trim()) {
      setValidationError("Please enter a contact mobile number.");
      return;
    }
    if (!contactInfo.emergencyName.trim()) {
      setValidationError("Please enter an emergency contact name.");
      return;
    }
    if (!contactInfo.emergencyPhone.trim()) {
      setValidationError("Please enter an emergency contact mobile number.");
      return;
    }

    onProceedToPayment(passengers, contactInfo);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-gray-100 gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span>Passenger Information</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Please provide official passport details matching your tickets.</p>
        </div>
        <button
          onClick={onBackToSeats}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 py-2 px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Seats</span>
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        
        {/* Error Notification */}
        {validationError && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <p>{validationError}</p>
          </div>
        )}

        {/* Passenger Tabs Selector */}
        {numPassengers > 1 && (
          <div className="flex space-x-2 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-none">
            {passengers.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePassengerIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activePassengerIdx === idx
                    ? "bg-[#202A36] text-white shadow-xs"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>
                  Passenger {idx + 1} {p.name ? `(${p.name.split(" ")[0]})` : ""}
                </span>
                {p.name && p.passport && (
                  <Check className="w-3 h-3 text-emerald-400 ml-1.5" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Passenger Form Section */}
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative">
          <div className="flex justify-between items-center mb-5 border-b border-gray-200/50 pb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Passenger {activePassengerIdx + 1} Details (Seat {selectedSeats[activePassengerIdx] || "N/A"})
            </h3>
            <button
              type="button"
              onClick={() => autofillPassenger(activePassengerIdx)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Autofill Traveler Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name (As in Passport)</label>
              <input
                type="text"
                required
                value={passengers[activePassengerIdx].name}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "name", e.target.value)}
                placeholder="e.g. ARUN PRASAD"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={passengers[activePassengerIdx].gender}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "gender", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input
                type="date"
                required
                value={passengers[activePassengerIdx].dob}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "dob", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nationality</label>
              <input
                type="text"
                required
                value={passengers[activePassengerIdx].nationality}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "nationality", e.target.value)}
                placeholder="e.g. Indian"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Passport */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Passport Number</label>
              <input
                type="text"
                required
                value={passengers[activePassengerIdx].passport}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "passport", e.target.value)}
                placeholder="e.g. Z9876543"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Meal Preference */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Meal Preference</label>
              <select
                value={passengers[activePassengerIdx].mealPreference}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "mealPreference", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              >
                <option value="none">Standard Inflight Menu</option>
                <option value="vegan">Asian Vegetarian / Vegan</option>
                <option value="kosher">Gluten Friendly / Kosher</option>
                <option value="child">Child Meal Option</option>
                <option value="halal">Halal Special Menu</option>
              </select>
            </div>

            {/* Special Assistance */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Special Assistance</label>
              <select
                value={passengers[activePassengerIdx].specialAssistance}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "specialAssistance", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              >
                <option value="none">No Assistance Required</option>
                <option value="wheelchair">Wheelchair Access Assistance</option>
                <option value="visually-impaired">Visually Impaired Assistance</option>
                <option value="hearing-impaired">Hearing Impaired Assistance</option>
              </select>
            </div>

            {/* Frequent Flyer */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Frequent Flyer ID (Optional)</label>
              <input
                type="text"
                value={passengers[activePassengerIdx].frequentFlyer}
                onChange={(e) => handlePassengerChange(activePassengerIdx, "frequentFlyer", e.target.value)}
                placeholder="e.g. SQ-12345"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Global Contact & Emergency Information */}
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200/50 pb-2">
            Primary Contact & Emergency Assistance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Email Address</label>
              <input
                type="email"
                required
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="arunprasad.g03@gmail.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Mobile Number</label>
              <input
                type="tel"
                required
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Emergency Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Emergency Contact Person Name</label>
              <input
                type="text"
                required
                value={contactInfo.emergencyName}
                onChange={(e) => handleContactChange("emergencyName", e.target.value)}
                placeholder="e.g. GANESH PRASAD"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>

            {/* Emergency Phone */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Emergency Mobile Number</label>
              <input
                type="tel"
                required
                value={contactInfo.emergencyPhone}
                onChange={(e) => handleContactChange("emergencyPhone", e.target.value)}
                placeholder="+91 9988776655"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#202A36] transition-colors shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            By clicking proceed, you confirm all details match the official passenger passports exactly.
          </p>
          
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-[#202A36] text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            id="passengers-submit-btn"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
