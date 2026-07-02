export type TripType = "one-way" | "round-trip" | "multi-city";

export type CabinClass = "economy" | "premium-economy" | "business" | "first";

export interface FlightSearchQuery {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: CabinClass;
  promoCode?: string;
}

export interface Flight {
  id: string;
  airlineName: string;
  airlineLogo: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  layover?: string;
  cabin: CabinClass;
  meals: boolean;
  wifi: boolean;
  seatType: string;
  baggage: string;
  refundable: boolean;
  price: number;
  aircraftType: string;
  rating: number;
}

export interface Seat {
  id: string;
  row: number;
  letter: string;
  type: "standard" | "extra-legroom" | "premium" | "exit-row";
  isOccupied: boolean;
  priceExtra: number;
}

export interface Passenger {
  id: string;
  name: string;
  gender: "male" | "female" | "other" | "";
  dob: string;
  nationality: string;
  passport: string;
  mealPreference: string;
  specialAssistance: string;
  frequentFlyer: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  flight: Flight;
  selectedSeats: string[];
  passengers: Passenger[];
  contactInfo: ContactInfo;
  paymentMethod: string;
  paymentStatus: "pending" | "completed";
  totalAmount: number;
  dateBooked: string;
  qrCodeUrl: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  price: number;
  duration: string;
  weather: string;
  bestSeason: string;
  airlinePartners: string[];
  rating: number;
}

export interface Deal {
  id: string;
  city: string;
  country: string;
  image: string;
  discountBadge: string;
  originalPrice: number;
  offerPrice: number;
  travelDates: string;
  endsAt: string; // ISO string
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  flightBooked: string;
  experience: string;
  avatar: string;
}
