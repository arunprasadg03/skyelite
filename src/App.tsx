import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookingCard from "./components/BookingCard";
import HomeExplore from "./components/HomeExplore";
import PremiumServices from "./components/PremiumServices";
import ReviewCarousel from "./components/ReviewCarousel";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";

// Booking Wizard Steps
import FlightResults from "./components/FlightResults";
import FlightDetails from "./components/FlightDetails";
import SeatSelector from "./components/SeatSelector";
import PassengerForm from "./components/PassengerForm";
import PaymentForm from "./components/PaymentForm";
import BookingConfirmation from "./components/BookingConfirmation";
import UserDashboard from "./components/UserDashboard";

import { Flight, FlightSearchQuery, Passenger, ContactInfo, Booking } from "./types";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  auth, 
  saveBookingToCloud, 
  fetchBookingsFromCloud, 
  deleteBookingFromCloud, 
  getUserProfile, 
  saveUserProfile, 
  UserProfile 
} from "./lib/firebase";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "booking" | "dashboard" | "confirmation">("home");
  const [bookingStage, setBookingStage] = useState<"search" | "results" | "details" | "seats" | "passengers" | "payment">("search");
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic Time of Day State
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "noon" | "night">("noon");

  // Active Wizard States
  const [searchQuery, setSearchQuery] = useState<FlightSearchQuery | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengersList, setPassengersList] = useState<Passenger[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  
  // Transaction Output
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [lastBookingId, setLastBookingId] = useState("");

  // Persistent Bookings State (Local Storage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("skyelite_bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default initial seeded upcoming booking for rich empty states in dashboard
    return [
      {
        id: "seed-b1",
        bookingId: "SKY-837492",
        flight: {
          id: "fl-101",
          airlineName: "Emirates",
          airlineLogo: "https://img.icons8.com/color/96/emirates.png",
          flightNumber: "EK-073",
          departureTime: "08:15",
          arrivalTime: "14:45",
          duration: "6h 30m",
          stops: 0,
          cabin: "business",
          meals: true,
          wifi: true,
          seatType: "Lie-flat Bed",
          baggage: "40kg (2 Pieces)",
          refundable: true,
          price: 2450,
          aircraftType: "Airbus A380-800",
          rating: 4.9
        },
        selectedSeats: ["2A"],
        passengers: [
          {
            id: "p-seed-1",
            name: "Arun Prasad",
            gender: "male",
            dob: "1994-06-15",
            nationality: "Indian",
            passport: "Z9876543",
            mealPreference: "standard",
            specialAssistance: "none",
            frequentFlyer: "SQ-9874521"
          }
        ],
        contactInfo: {
          email: "arunprasad.g03@gmail.com",
          phone: "+91 9876543210",
          emergencyName: "Ganesh Prasad",
          emergencyPhone: "+91 9988776655"
        },
        paymentMethod: "CARD",
        paymentStatus: "completed",
        totalAmount: 2894,
        dateBooked: "2026-06-25",
        qrCodeUrl: ""
      }
    ];
  });

  // Auth and Profile sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Monitor Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setLoadingBookings(true);
        try {
          // Load bookings from Cloud
          const cloudBookings = await fetchBookingsFromCloud(user.uid);
          
          // Load User Profile from Cloud
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create a default profile
            const defaultProfile: UserProfile = {
              name: user.displayName || user.email?.split("@")[0] || "SkyElite Member",
              email: user.email || "",
              frequentFlyer: "SQ-" + Math.floor(1000000 + Math.random() * 9000000),
              tier: "Gold",
              balance: 2500
            };
            await saveUserProfile(user.uid, defaultProfile);
            setUserProfile(defaultProfile);
          }

          // Merge local storage bookings with cloud if any, or sync
          if (cloudBookings.length > 0) {
            setBookings(cloudBookings);
          } else {
            // If cloud has zero bookings, push any local bookings to cloud
            const localSaved = localStorage.getItem("skyelite_bookings");
            if (localSaved) {
              try {
                const parsed: Booking[] = JSON.parse(localSaved);
                for (const b of parsed) {
                  await saveBookingToCloud(user.uid, b);
                }
                if (parsed.length > 0) {
                  setBookings(parsed);
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
        } catch (err) {
          console.error("Failed to sync with Firebase: ", err);
        }
        setLoadingBookings(false);
      } else {
        setUserProfile(null);
        // Load from local storage
        const saved = localStorage.getItem("skyelite_bookings");
        if (saved) {
          try {
            setBookings(JSON.parse(saved));
          } catch (e) {
            setBookings([]);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save bookings to local storage on changes (also cloud if logged in)
  useEffect(() => {
    localStorage.setItem("skyelite_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Simulated dark mode body toggle
    const body = document.body;
    if (!isDarkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  };

  // Nav actions
  const handleViewChange = (view: "home" | "booking" | "dashboard") => {
    setCurrentView(view);
    if (view === "booking" && bookingStage === "search") {
      setBookingStage("search");
    }
  };

  // Step 1: Booking Search triggers
  const handleSearchSubmit = (query: FlightSearchQuery) => {
    setSearchQuery(query);
    setCurrentView("booking");
    setBookingStage("results");
    
    // Auto scroll to top of viewport to see results clearly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Selecting Flight Card
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setBookingStage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3: Flight Details Confirmation
  const handleProceedToSeats = (insuranceChosen: boolean) => {
    setHasInsurance(insuranceChosen);
    setBookingStage("seats");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 4: Seat Mapping chosen
  const handleProceedToPassengers = (seats: string[]) => {
    setSelectedSeats(seats);
    setBookingStage("passengers");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 5: Passenger details completed
  const handleProceedToPayment = (passengers: Passenger[], contact: ContactInfo) => {
    setPassengersList(passengers);
    setContactInfo(contact);
    setBookingStage("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 6: Authorization successful
  const handlePaymentSuccess = (method: string, txId: string) => {
    setPaymentMethod(method);
    setTransactionId(txId);
    
    const genId = "SKY-" + Math.floor(100000 + Math.random() * 900000);
    setLastBookingId(genId);

    // Compute grand total
    const numPassengers = searchQuery?.passengers || 1;
    const basePrice = (selectedFlight?.price || 0) * numPassengers;
    const seatExtras = selectedSeats.reduce((sum, s) => {
      const row = parseInt(s);
      if (row <= 2) return sum + 150;
      if (row === 6) return sum + 75;
      if (row === 3 || row === 4) return sum + 45;
      return sum;
    }, 0);
    const taxesAndFees = Math.round((basePrice + seatExtras) * 0.12);
    const insuranceFee = hasInsurance ? 49 * numPassengers : 0;
    const couponDiscount = searchQuery?.promoCode?.toUpperCase() === "SKY20" ? Math.round((basePrice + seatExtras) * 0.20) : 0;
    const finalAmount = basePrice + seatExtras + taxesAndFees + insuranceFee - couponDiscount;

    const newBooking: Booking = {
      id: "b-" + Date.now(),
      bookingId: genId,
      flight: selectedFlight!,
      selectedSeats,
      passengers: passengersList,
      contactInfo: contactInfo!,
      paymentMethod: method,
      paymentStatus: "completed",
      totalAmount: finalAmount,
      dateBooked: new Date().toISOString().split("T")[0],
      qrCodeUrl: ""
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Save to Firebase Firestore if logged in
    if (currentUser) {
      saveBookingToCloud(currentUser.uid, newBooking).catch((err) => {
        console.error("Failed to save booking to Firestore: ", err);
      });
    }

    setCurrentView("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel reservation
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    
    // Delete from Firebase Firestore if logged in
    if (currentUser) {
      deleteBookingFromCloud(currentUser.uid, bookingId).catch((err) => {
        console.error("Failed to delete booking from Firestore: ", err);
      });
    }
  };

  // Main Return to Dashboard
  const handleFinishConfirmation = () => {
    // Reset states
    setSearchQuery(null);
    setSelectedFlight(null);
    setSelectedSeats([]);
    setPassengersList([]);
    setContactInfo(null);
    setBookingStage("search");
    setCurrentView("dashboard");
  };

  // Quick book triggered from destinations cards
  const handleQuickBook = (city: string) => {
    const formattedQuery: FlightSearchQuery = {
      tripType: "round-trip",
      origin: "JFK",
      destination: city.toUpperCase().slice(0, 3),
      departureDate: "2026-07-15",
      returnDate: "2026-07-25",
      passengers: 1,
      cabinClass: "business"
    };
    handleSearchSubmit(formattedQuery);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between cinematic-time-transition time-${timeOfDay} ${isDarkMode ? "bg-[#0B1220] text-white" : "bg-gray-50 text-gray-800"}`}>
      
      {/* Navigation Bar Header */}
      <Navbar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        timeOfDay={timeOfDay}
        onTimeOfDayChange={setTimeOfDay}
      />

      {/* Main viewport Router */}
      <main className="flex-grow w-full">
        
        {/* VIEW 1: HOME LANDING PAGE */}
        {currentView === "home" && (
          <div className="space-y-0">
            {/* Cinematic Airplane video Hero */}
            <Hero 
              timeOfDay={timeOfDay}
              onDiscoverClick={() => {
                const element = document.getElementById("explore-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onBookNowClick={() => {
                setCurrentView("booking");
                setBookingStage("search");
              }}
            />

            {/* Overlapping Glassmorphism booking search card */}
            <div className="relative max-w-5xl mx-auto px-8 mt-12 md:mt-20 z-20" id="search-card-container">
              <BookingCard onSearch={handleSearchSubmit} />
            </div>

            {/* Explore layout wrapper */}
            <div id="explore-section" className="max-w-7xl mx-auto px-8 py-20">
              <HomeExplore onQuickBook={handleQuickBook} />
            </div>

            {/* Auxiliary and Trust Services */}
            <PremiumServices />

            {/* Elite reviews testimonials */}
            <ReviewCarousel />

            {/* FAQ */}
            <FaqSection />
          </div>
        )}

        {/* VIEW 2: BOOKING FLOW WIZARD */}
        {currentView === "booking" && (
          <div className="max-w-7xl mx-auto px-8 pt-28 pb-20">
            
            {/* Step 1: Search Form */}
            {bookingStage === "search" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Luxury Flight Search</h1>
                  <p className="text-sm text-gray-500">Configure your signature journey details below.</p>
                </div>
                <BookingCard onSearch={handleSearchSubmit} />
              </div>
            )}

            {/* Step 2: Search results display and sort */}
            {bookingStage === "results" && searchQuery && (
              <FlightResults 
                searchQuery={searchQuery}
                onSelectFlight={handleSelectFlight}
                onBackToSearch={() => setBookingStage("search")}
              />
            )}

            {/* Step 3: Flight details overview */}
            {bookingStage === "details" && selectedFlight && searchQuery && (
              <FlightDetails 
                flight={selectedFlight}
                searchQuery={searchQuery}
                onBackToResults={() => setBookingStage("results")}
                onProceedToSeats={handleProceedToSeats}
              />
            )}

            {/* Step 4: Seating arrangement */}
            {bookingStage === "seats" && selectedFlight && searchQuery && (
              <SeatSelector 
                flight={selectedFlight}
                searchQuery={searchQuery}
                onBackToDetails={() => setBookingStage("details")}
                onProceedToPassengers={handleProceedToPassengers}
              />
            )}

            {/* Step 5: Passenger credentials form */}
            {bookingStage === "passengers" && selectedFlight && searchQuery && (
              <PassengerForm 
                searchQuery={searchQuery}
                selectedSeats={selectedSeats}
                onBackToSeats={() => setBookingStage("seats")}
                onProceedToPayment={handleProceedToPayment}
              />
            )}

            {/* Step 6: Authorization & payment */}
            {bookingStage === "payment" && selectedFlight && searchQuery && contactInfo && (
              <PaymentForm 
                flight={selectedFlight}
                searchQuery={searchQuery}
                passengers={passengersList}
                contactInfo={contactInfo}
                selectedSeats={selectedSeats}
                hasInsurance={hasInsurance}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}

          </div>
        )}

        {/* VIEW 3: CONFIRMATION STATE */}
        {currentView === "confirmation" && selectedFlight && searchQuery && contactInfo && (
          <div className="max-w-7xl mx-auto px-8 pt-28 pb-20">
            <BookingConfirmation 
              bookingId={lastBookingId}
              flight={selectedFlight}
              searchQuery={searchQuery}
              passengers={passengersList}
              contactInfo={contactInfo}
              selectedSeats={selectedSeats}
              paymentMethod={paymentMethod}
              onFinish={handleFinishConfirmation}
            />
          </div>
        )}

        {/* VIEW 4: TRAVELER DASHBOARD */}
        {currentView === "dashboard" && (
          <div className="max-w-7xl mx-auto px-8 pt-28 pb-20">
            <UserDashboard 
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              currentUser={currentUser}
              userProfile={userProfile}
              loadingBookings={loadingBookings}
            />
          </div>
        )}

      </main>

      {/* Global Luxury Footer */}
      <Footer />
      
    </div>
  );
}
