import React, { useState } from "react";
import { Flight, FlightSearchQuery, Passenger, ContactInfo } from "../types";
import { 
  CreditCard, ShieldCheck, Wallet, Sparkles, Percent, 
  HelpCircle, CheckCircle2, ChevronRight, Gift, Lock 
} from "lucide-react";

interface PaymentFormProps {
  flight: Flight;
  searchQuery: FlightSearchQuery;
  passengers: Passenger[];
  contactInfo: ContactInfo;
  selectedSeats: string[];
  hasInsurance: boolean;
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void;
}

export default function PaymentForm({ 
  flight, searchQuery, passengers, contactInfo, selectedSeats, hasInsurance, onPaymentSuccess 
}: PaymentFormProps) {
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "gpay" | "paypal" | "wallet">("card");
  
  // Card details states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("Arun Prasad");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFocused, setIsFocused] = useState(false); // flips card on CVV focus

  // UPI State
  const [upiId, setUpiId] = useState("");

  // Coupon Discount state
  const [coupon, setCoupon] = useState(searchQuery.promoCode || "");
  const [isCouponApplied, setIsCouponApplied] = useState(searchQuery.promoCode?.toUpperCase() === "SKY20");
  const [couponError, setCouponError] = useState<string | null>(null);

  // Loading animation state during checkout
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic pricing
  const numPassengers = searchQuery.passengers;
  const basePrice = flight.price * numPassengers;
  const seatExtras = selectedSeats.reduce((sum, s) => {
    // Row math
    const row = parseInt(s);
    if (row <= 2) return sum + 150;
    if (row === 6) return sum + 75;
    if (row === 3 || row === 4) return sum + 45;
    return sum;
  }, 0);

  const taxesAndFees = Math.round((basePrice + seatExtras) * 0.12);
  const insuranceFee = hasInsurance ? 49 * numPassengers : 0;
  
  const couponDiscount = isCouponApplied ? Math.round((basePrice + seatExtras) * 0.20) : 0;
  const grandTotal = basePrice + seatExtras + taxesAndFees + insuranceFee - couponDiscount;

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (coupon.toUpperCase() === "SKY20") {
      setIsCouponApplied(true);
    } else {
      setCouponError("Invalid promotion code. Try using 'SKY20' for 20% Off.");
      setIsCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setCoupon("");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate luxury API payment charge (2 seconds delay)
    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
      onPaymentSuccess(paymentMethod.toUpperCase(), generatedTxId);
    }, 2500);
  };

  // Card Number formatting (adds spaces every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 16);
    const formatted = numeric.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Card Expiry formatting (adds slash)
  const handleExpiryChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 4);
    if (numeric.length >= 3) {
      setExpiry(`${numeric.slice(0, 2)}/${numeric.slice(2)}`);
    } else {
      setExpiry(numeric);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* Left 7 columns: Payment details and interactive visualizer */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <span>Secure Checkout Portal</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Payment processed through certified PCI-DSS grade gateways.</p>
        </div>

        {/* Method Switcher Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 border-b border-gray-100 pb-5">
          {[
            { id: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
            { id: "gpay", label: "GPay / Apple", icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: "upi", label: "UPI", icon: <Wallet className="w-4 h-4" /> },
            { id: "paypal", label: "PayPal", icon: <HelpCircle className="w-4 h-4" /> },
            { id: "wallet", label: "Wallet", icon: <Sparkles className="w-4 h-4 text-[#F5B301]" /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPaymentMethod(item.id as any)}
              className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-2 border transition-all ${
                paymentMethod === item.id
                  ? "bg-[#202A36] border-[#202A36] text-white shadow-sm"
                  : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Payment Forms */}
        {isProcessing ? (
          <div className="py-16 text-center space-y-4 flex flex-col items-center justify-center animate-pulse">
            <div className="w-14 h-14 rounded-full border-4 border-[#202A36] border-t-transparent animate-spin"></div>
            <h3 className="text-lg font-bold text-gray-900 mt-4">Charging Flight Security Vault...</h3>
            <p className="text-xs text-gray-400 max-w-sm">Please do not refresh or close this session. Authorizing transactions with your premium card issuer...</p>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            
            {/* TAB 1: CREDIT CARD & INTERACTIVE PREVIEW */}
            {paymentMethod === "card" && (
              <div className="space-y-6">
                
                {/* 3D Glassmorphic Card Visual Mockup */}
                <div className="relative w-full max-w-[380px] mx-auto aspect-[1.586/1] bg-gradient-to-tr from-[#081C3A] via-[#103061] to-[#155EEF] rounded-2xl p-6 text-white shadow-2xl overflow-hidden select-none transition-all duration-500 hover:scale-[1.03]">
                  {/* Subtle vector circles inside card background */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#F5B301]/5 rounded-full blur-2xl"></div>

                  <div className="relative h-full flex flex-col justify-between">
                    {/* Top block */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-gray-300 font-mono block">SkyElite Signature</span>
                        <span className="text-xs font-bold text-yellow-400 font-display">Infinite Charter Pass</span>
                      </div>
                      <span className="text-lg font-extrabold italic font-display">VISA</span>
                    </div>

                    {/* Card chip and contact-less */}
                    <div className="my-1.5 flex items-center justify-between">
                      {/* Gold card chip simulation */}
                      <div className="w-10 h-7 rounded-sm bg-gradient-to-r from-amber-400 to-yellow-300 opacity-80 border border-amber-500"></div>
                      <div className="w-6 h-6 flex flex-col justify-between opacity-50">
                        <span className="h-0.5 bg-white w-full rounded-full"></span>
                        <span className="h-0.5 bg-white w-full rounded-full"></span>
                        <span className="h-0.5 bg-white w-full rounded-full"></span>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="text-lg font-mono font-bold tracking-widest text-center py-1">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>

                    {/* Bottom labels (Cardholder Name & Expiry) */}
                    <div className="flex justify-between text-xs font-mono">
                      <div>
                        <span className="block text-[8px] text-gray-300 uppercase tracking-wider">Cardholder</span>
                        <span className="font-bold uppercase truncate max-w-[180px] block">{cardName || "YOUR NAME"}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-300 uppercase tracking-wider">Expires</span>
                        <span className="font-bold block">{expiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. ARUN PRASAD"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#202A36] transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#202A36] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#202A36] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CVV Code</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="•••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#202A36] transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPI */}
            {paymentMethod === "upi" && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Enter UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. arunprasad@oksbi"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#202A36] transition-colors font-mono"
                />
                <p className="text-[10px] text-gray-400">A payment notification request will be sent to your Google Pay, PhonePe, or BHIM UPI application.</p>
              </div>
            )}

            {/* TAB 3: GPAY / APPLE PAY */}
            {paymentMethod === "gpay" && (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs mx-auto text-black font-extrabold text-sm">
                  GPay
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Quick Authenticated Express Payment</h4>
                  <p className="text-xs text-gray-400 mt-1">One-click express auth via Apple Pay or Google Wallet. Payment completes instantly using securely saved cards.</p>
                </div>
              </div>
            )}

            {/* TAB 4: PAYPAL */}
            {paymentMethod === "paypal" && (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-[#003087] rounded-full flex items-center justify-center font-black italic text-lg mx-auto">
                  PP
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Redirect to PayPal Account</h4>
                  <p className="text-xs text-gray-400 mt-1">Confirm your booking after linking your secure PayPal wallet on the next modal window.</p>
                </div>
              </div>
            )}

            {/* TAB 5: TRAVEL WALLET */}
            {paymentMethod === "wallet" && (
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                    <Wallet className="w-4 h-4" />
                    <span>SkyElite Travel Credits</span>
                  </div>
                  <span className="text-xs bg-amber-200/60 text-amber-800 font-bold px-3 py-1 rounded-full">Available Balance: $2,500</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Apply credit balance directly to pay for this flight. Vouchers from cancelled previous journeys are eligible.
                </p>
                <div className="bg-white/80 p-3 rounded-xl flex justify-between items-center text-xs text-gray-600 font-medium">
                  <span>Sufficient balance:</span>
                  <span className="text-emerald-600 font-bold">Yes • Covered up to 100%</span>
                </div>
              </div>
            )}

            {/* Checkbox agreements and payment submit */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-start space-x-2 text-xs text-gray-500">
                <input type="checkbox" required defaultChecked className="rounded border-gray-300 mt-0.5 text-[#202A36] focus:ring-[#202A36]" />
                <label className="leading-relaxed">
                  I accept the flight carriage conditions, cancellation rules, and SkyElite privacy terms.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#202A36] hover:bg-opacity-95 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-base cursor-pointer"
                id="submit-payment-btn"
              >
                <span>Authorize & Pay ${grandTotal}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right 5 columns: Fare detail, coupon codes, traveler list */}
      <div className="lg:col-span-5 space-y-6">
        {/* Coupon Promo Apply Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
            <Percent className="w-3.5 h-3.5 text-gray-600" />
            <span>Promotion Coupons</span>
          </h3>

          {isCouponApplied ? (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-bold">SKY20 Applied (20% Off)</span>
                  <span className="block text-[10px] text-emerald-600 mt-0.5">Saves you -${couponDiscount}!</span>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponError(null);
                  }}
                  placeholder="Promo Code (SKY20)"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 placeholder-gray-400 uppercase focus:outline-none focus:border-[#202A36]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-[#202A36] text-white rounded-xl text-xs font-bold hover:bg-opacity-90"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{couponError}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Real-time Detailed Fare Breakdown */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Ticket Fare Breakdown</h3>

          <div className="space-y-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Base Fare ({numPassengers} Traveler{numPassengers > 1 ? "s" : ""})</span>
              <span className="text-gray-900 font-semibold font-mono">${basePrice}</span>
            </div>
            
            {seatExtras > 0 && (
              <div className="flex justify-between">
                <span>Selected Seat Upgrades</span>
                <span className="text-gray-900 font-semibold font-mono">${seatExtras}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Govt Taxes & Fuel Levies (12%)</span>
              <span className="text-gray-900 font-semibold font-mono">${taxesAndFees}</span>
            </div>

            {hasInsurance && (
              <div className="flex justify-between text-emerald-600">
                <span>Travel Safeguard Cover</span>
                <span className="font-semibold font-mono">${insuranceFee}</span>
              </div>
            )}

            {isCouponApplied && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promotion Discount (-20%)</span>
                <span className="font-mono">-${couponDiscount}</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
              <span>Grand Total:</span>
              <span className="font-mono text-lg">${grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Brief Travelers / Flight summary */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journey Details</h4>
          <div className="text-xs space-y-2">
            <div className="flex justify-between text-gray-700">
              <span className="font-bold">Route:</span>
              <span>{searchQuery.origin} ➔ {searchQuery.destination}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-bold">Airline:</span>
              <span>{flight.airlineName} ({flight.flightNumber})</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-bold">Travelers ({numPassengers}):</span>
              <span className="truncate max-w-[200px]">{passengers.map(p => p.name).filter(Boolean).join(", ")}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
