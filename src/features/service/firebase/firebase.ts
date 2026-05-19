// Import Firebase module to initialize the app
import { env } from "@/config/env";
import { getApps, initializeApp } from "firebase/app";

// Import Firebase Authentication module to handle user authentication

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// Firebase configuration object containing keys and identifiers for the project
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is enabled in the environment
const isEnabled = env.FIREBASE_ENABLE;

// Initialize the Firebase app with the provided configuration
const app = isEnabled && getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = isEnabled ? getAuth(app) : null;
export const db = isEnabled ? getFirestore(app) : null;
export const messaging = isEnabled && typeof window !== "undefined" ? getMessaging(app) : null;
export { isEnabled };
