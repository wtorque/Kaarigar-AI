import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "./config";
import { User, UserRole } from "@/types";

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  appUser: User | null;
  idToken: string | null;
  loading: boolean;
  role: UserRole | null;
}

// Default demonstration user profile matching screenshot ("Hello, Harshh")
export const MOCK_USERS: Record<UserRole, User> = {
  customer: {
    id: "usr_harshh",
    firebaseUid: "fb_harshh_9182",
    email: "harshh@kaarigar.in",
    name: "Harshh",
    role: "customer",
    avatar: "/images/artisans/harshh.webp",
    phone: "+91 98765 43210",
    address: {
      street: "Plot 42, Gulmohar Enclave, Arera Colony",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016",
    },
  },
  artisan: {
    id: "usr_suresh",
    firebaseUid: "fb_suresh_bastar",
    email: "suresh.bastar@kaarigar.in",
    name: "Suresh Kumar",
    role: "artisan",
    avatar: "/images/artisans/suresh.webp",
    phone: "+91 94251 09876",
    artisanProfile: {
      id: "art_1",
      craft: "Bastar Wood Carving",
      region: "Bastar, Chhattisgarh",
      bio: "Master artisan with 22 years of teakwood carving heritage.",
      isVerified: true,
      yearsOfExperience: 22,
      rating: 4.8,
    },
  },
  admin: {
    id: "usr_admin",
    firebaseUid: "fb_curator_delhi",
    email: "curator@kaarigar.in",
    name: "Kaarigar Curator",
    role: "admin",
    avatar: "/images/artisans/ravi.webp",
  },
};

export async function loginWithGoogle(): Promise<{ user: User; token: string }> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const appUser: User = {
        id: `usr_${result.user.uid.slice(0, 8)}`,
        firebaseUid: result.user.uid,
        email: result.user.email || "artisan@kaarigar.in",
        name: result.user.displayName || "Kaarigar Member",
        role: "customer",
        avatar: result.user.photoURL || undefined,
      };

      return { user: appUser, token };
    } catch (error) {
      console.warn("Firebase popup failed or closed, switching to mock mode session:", error);
    }
  }

  // Resilient fallback for offline / mock testing
  return {
    user: MOCK_USERS.customer,
    token: "mock-firebase-jwt-token-harshh",
  };
}

export async function loginAsRole(role: UserRole): Promise<{ user: User; token: string }> {
  return {
    user: MOCK_USERS[role],
    token: `mock-firebase-jwt-${role}`,
  };
}

export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    }
  }
}
