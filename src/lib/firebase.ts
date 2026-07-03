import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { Booking } from "../types";

// Firebase configuration from JSON
const firebaseConfig = {
  apiKey: "AIzaSyBM4-44JGhAh-IPptItBXxuhSogXRMvEwY",
  authDomain: "gen-lang-client-0656077838.firebaseapp.com",
  projectId: "gen-lang-client-0656077838",
  storageBucket: "gen-lang-client-0656077838.firebasestorage.app",
  messagingSenderId: "993922599093",
  appId: "1:993922599093:web:347aa68f414b21620216fc"
};

// Initialize Firebase app safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-skyelite-83eb7e2e-bb6a-498e-a503-4b7c510afa99");

// Firestore persistence logic for Bookings
export async function saveBookingToCloud(userId: string, booking: Booking): Promise<void> {
  try {
    const bookingRef = doc(db, "users", userId, "bookings", booking.id);
    await setDoc(bookingRef, {
      ...booking,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving booking to Firestore: ", error);
    throw error;
  }
}

export async function fetchBookingsFromCloud(userId: string): Promise<Booking[]> {
  try {
    const bookingsCollection = collection(db, "users", userId, "bookings");
    const q = query(bookingsCollection, orderBy("dateBooked", "desc"));
    const snapshot = await getDocs(q);
    const list: Booking[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Booking);
    });
    return list;
  } catch (error) {
    console.error("Error fetching bookings from Firestore: ", error);
    // If table/index fails or collection doesn't exist, fallback to empty
    return [];
  }
}

export async function deleteBookingFromCloud(userId: string, bookingId: string): Promise<void> {
  try {
    const bookingDocRef = doc(db, "users", userId, "bookings", bookingId);
    await deleteDoc(bookingDocRef);
  } catch (error) {
    console.error("Error deleting booking from Firestore: ", error);
    throw error;
  }
}

// User Profile logic
export interface UserProfile {
  name: string;
  email: string;
  frequentFlyer: string;
  tier: "Silver" | "Gold" | "Platinum";
  balance: number;
}

export async function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (error) {
    console.error("Error saving user profile: ", error);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error reading user profile: ", error);
    return null;
  }
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
