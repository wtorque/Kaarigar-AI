import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForDevelopmentMode123456",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kaarigar-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kaarigar-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kaarigar-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef12345",
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    return app;
  } catch (error) {
    console.warn("Firebase initialization skipped or failed, fallback enabled:", error);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  const currentApp = getFirebaseApp();
  if (!currentApp) return null;
  if (!auth) {
    try {
      auth = getAuth(currentApp);
    } catch (e) {
      console.warn("Firebase Auth fallback active:", e);
      return null;
    }
  }
  return auth;
}

export const googleProvider = new GoogleAuthProvider();
