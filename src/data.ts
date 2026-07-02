import { Destination, Deal, Flight, Review } from "./types";

export const AIRLINES = [
  { name: "Emirates", logo: "✈️", code: "EK" },
  { name: "Qatar Airways", logo: "👑", code: "QR" },
  { name: "Singapore Airlines", logo: "🌟", code: "SQ" },
  { name: "Lufthansa", logo: "🦅", code: "LH" },
  { name: "British Airways", logo: "🇬🇧", code: "BA" },
  { name: "Air France", logo: "🇫🇷", code: "AF" },
  { name: "Turkish Airlines", logo: "🇹🇷", code: "TK" },
  { name: "Etihad", logo: "💎", code: "EY" },
  { name: "Cathay Pacific", logo: "🐉", code: "CX" },
  { name: "ANA", logo: "🇯🇵", code: "NH" }
];

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    city: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    price: 850,
    duration: "11h 25m",
    weather: "22°C Sunny",
    bestSeason: "May - Sep",
    airlinePartners: ["Air France", "Emirates", "Lufthansa"],
    rating: 4.8
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    price: 1100,
    duration: "12h 40m",
    weather: "19°C Spring Breezes",
    bestSeason: "Mar - May (Cherry Blossoms)",
    airlinePartners: ["ANA", "Singapore Airlines", "Cathay Pacific"],
    rating: 4.9
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    price: 920,
    duration: "7h 15m",
    weather: "34°C Warm",
    bestSeason: "Nov - Mar",
    airlinePartners: ["Emirates", "Etihad", "Qatar Airways"],
    rating: 4.7
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    price: 950,
    duration: "13h 10m",
    weather: "28°C Tropical Humid",
    bestSeason: "Feb - Apr",
    airlinePartners: ["Singapore Airlines", "Emirates", "Cathay Pacific"],
    rating: 4.9
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7424954?auto=format&fit=crop&w=800&q=80",
    price: 780,
    duration: "10h 50m",
    weather: "16°C Light Rain",
    bestSeason: "Jun - Aug",
    airlinePartners: ["British Airways", "Lufthansa", "Virgin Atlantic"],
    rating: 4.6
  },
  {
    id: "new-york",
    city: "New York",
    country: "United States",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    price: 690,
    duration: "8h 15m",
    weather: "24°C Sunny",
    bestSeason: "Sep - Nov",
    airlinePartners: ["Delta", "United Airlines", "British Airways"],
    rating: 4.8
  },
  {
    id: "rome",
    city: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    price: 890,
    duration: "11h 05m",
    weather: "26°C Clear Skies",
    bestSeason: "Apr - Jun",
    airlinePartners: ["ITA Airways", "Air France", "Lufthansa"],
    rating: 4.8
  },
  {
    id: "maldives",
    city: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    price: 1450,
    duration: "9h 30m",
    weather: "30°C Sea Breeze",
    bestSeason: "Nov - Apr",
    airlinePartners: ["Qatar Airways", "Emirates", "Singapore Airlines"],
    rating: 5.0
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    price: 1050,
    duration: "14h 20m",
    weather: "29°C Tropical Sunshine",
    bestSeason: "Apr - Oct",
    airlinePartners: ["Singapore Airlines", "Cathay Pacific", "Emirates"],
    rating: 4.9
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    price: 1650,
    duration: "18h 30m",
    weather: "18°C Mild Autumn",
    bestSeason: "Sep - Nov & Mar - May",
    airlinePartners: ["Qantas", "Singapore Airlines", "Emirates"],
    rating: 4.8
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "South Korea",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80",
    price: 980,
    duration: "13h 15m",
    weather: "21°C Clear Skies",
    bestSeason: "Sep - Nov",
    airlinePartners: ["Korean Air", "Asiana Airlines", "ANA"],
    rating: 4.7
  },
  {
    id: "zurich",
    city: "Zurich",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
    price: 1150,
    duration: "10h 10m",
    weather: "15°C Overcast",
    bestSeason: "Jun - Aug (Hiking) / Dec - Feb (Skiing)",
    airlinePartners: ["SWISS", "Lufthansa", "British Airways"],
    rating: 4.9
  }
];

export const DEALS: Deal[] = [
  {
    id: "deal-1",
    city: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1499856871958-5b9647a640d0?auto=format&fit=crop&w=600&q=80",
    discountBadge: "Save 35%",
    originalPrice: 1200,
    offerPrice: 780,
    travelDates: "Sep 15 - Oct 20",
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString() // Ends in 18 hours
  },
  {
    id: "deal-2",
    city: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80",
    discountBadge: "Luxury Upgrade Free",
    originalPrice: 1950,
    offerPrice: 1450,
    travelDates: "Oct 01 - Nov 15",
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 27).toISOString() // Ends in 27 hours
  },
  {
    id: "deal-3",
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    discountBadge: "Companion Pays 50%",
    originalPrice: 1500,
    offerPrice: 1125,
    travelDates: "Nov 10 - Dec 18",
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString() // Ends in 8 hours
  }
];

export const MOCK_FLIGHTS: Flight[] = [
  {
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
  {
    id: "fl-102",
    airlineName: "Qatar Airways",
    airlineLogo: "https://img.icons8.com/color/96/qatar-airways.png",
    flightNumber: "QR-162",
    departureTime: "11:30",
    arrivalTime: "18:10",
    duration: "6h 40m",
    stops: 0,
    cabin: "business",
    meals: true,
    wifi: true,
    seatType: "Qsuite Private Suite",
    baggage: "40kg (2 Pieces)",
    refundable: true,
    price: 2680,
    aircraftType: "Boeing 777-300ER",
    rating: 5.0
  },
  {
    id: "fl-103",
    airlineName: "Singapore Airlines",
    airlineLogo: "https://img.icons8.com/color/96/singapore-airlines.png",
    flightNumber: "SQ-318",
    departureTime: "06:00",
    arrivalTime: "15:20",
    duration: "9h 20m",
    stops: 1,
    layover: "SIN (1h 15m)",
    cabin: "business",
    meals: true,
    wifi: true,
    seatType: "Extra-wide Leather Bed",
    baggage: "40kg",
    refundable: true,
    price: 2850,
    aircraftType: "Airbus A350-900",
    rating: 4.9
  },
  {
    id: "fl-104",
    airlineName: "Lufthansa",
    airlineLogo: "https://img.icons8.com/color/96/lufthansa.png",
    flightNumber: "LH-430",
    departureTime: "13:45",
    arrivalTime: "20:55",
    duration: "7h 10m",
    stops: 0,
    cabin: "business",
    meals: true,
    wifi: true,
    seatType: "Fully Flat Bed",
    baggage: "32kg",
    refundable: false,
    price: 1850,
    aircraftType: "Boeing 747-8i",
    rating: 4.6
  },
  {
    id: "fl-105",
    airlineName: "British Airways",
    airlineLogo: "https://img.icons8.com/color/96/british-airways.png",
    flightNumber: "BA-227",
    departureTime: "15:20",
    arrivalTime: "23:55",
    duration: "8h 35m",
    stops: 1,
    layover: "LHR (2h 00m)",
    cabin: "business",
    meals: true,
    wifi: true,
    seatType: "Club Suite Door Space",
    baggage: "32kg",
    refundable: true,
    price: 1980,
    aircraftType: "Boeing 787-10",
    rating: 4.5
  },
  // First Class option
  {
    id: "fl-106",
    airlineName: "Emirates",
    airlineLogo: "https://img.icons8.com/color/96/emirates.png",
    flightNumber: "EK-001",
    departureTime: "10:30",
    arrivalTime: "17:00",
    duration: "6h 30m",
    stops: 0,
    cabin: "first",
    meals: true,
    wifi: true,
    seatType: "Private Suite with Sliding Door",
    baggage: "50kg (3 Pieces)",
    refundable: true,
    price: 4950,
    aircraftType: "Airbus A380-800 (Shower Spa Equipped)",
    rating: 5.0
  },
  // Economy Class Option
  {
    id: "fl-107",
    airlineName: "Etihad",
    airlineLogo: "https://img.icons8.com/color/96/etihad-airways.png",
    flightNumber: "EY-281",
    departureTime: "09:00",
    arrivalTime: "15:50",
    duration: "6h 50m",
    stops: 0,
    cabin: "economy",
    meals: true,
    wifi: false,
    seatType: "Standard Ergonomic",
    baggage: "23kg",
    refundable: true,
    price: 520,
    aircraftType: "Boeing 787-9",
    rating: 4.2
  },
  // Premium Economy Class Option
  {
    id: "fl-108",
    airlineName: "Cathay Pacific",
    airlineLogo: "https://img.icons8.com/color/96/cathay-pacific.png",
    flightNumber: "CX-880",
    departureTime: "23:45",
    arrivalTime: "06:15",
    duration: "6h 30m",
    stops: 0,
    cabin: "premium-economy",
    meals: true,
    wifi: true,
    seatType: "Spacious Recliner with Legrest",
    baggage: "35kg",
    refundable: true,
    price: 980,
    aircraftType: "Airbus A350-1000",
    rating: 4.7
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Alexander Mercer",
    country: "United Kingdom",
    rating: 5,
    flightBooked: "Emirates First Class to Dubai",
    experience: "Absolute pinnacle of aviation luxury. The Private Suite was phenomenal, the crew anticipated every desire, and booking through SkyElite was effortlessly seamless.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "rev-2",
    name: "Sophia Vance",
    country: "United States",
    rating: 5,
    flightBooked: "Qatar QSuite to Paris",
    experience: "SkyElite is the first booking platform that matches the quality of the actual travel experience. The seat selector and detailed layout maps were extremely helpful.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "rev-3",
    name: "Hiroshi Tanaka",
    country: "Japan",
    rating: 5,
    flightBooked: "ANA Suite Tokyo to Zurich",
    experience: "Fast checkout, clear fare breakdown, and high-fidelity layouts of the aircraft make SkyElite my permanent choice for both business and leisure booking.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  }
];

export const FAQS = [
  {
    question: "What is the SkyElite VIP Concierge service?",
    answer: "Every First Class and Private Jet client receives complimentary 24/7 VIP Concierge assistance, helping with baggage management, luxury hotel check-ins, expedited security, and exclusive lounge access."
  },
  {
    question: "Can I customize meals and request special assistance beforehand?",
    answer: "Yes, our interactive seat and details portal lets you specify detailed dietary needs, gourmet catering choices, child support, or wheelchair assistance directly inside your profile or during booking checkout."
  },
  {
    question: "What is the cancellation and refund policy?",
    answer: "Most premium tickets (Business, First, Private Charter) are fully refundable or offer zero-fee date changes up to 24 hours prior to departure. A detailed breakdown is shown for every flight card."
  },
  {
    question: "Can I book private jet charters directly on SkyElite?",
    answer: "Yes, our 'Private Jet' service offers on-demand charter access with custom routes, customized onboard catering, and private terminal departures worldwide."
  }
];
