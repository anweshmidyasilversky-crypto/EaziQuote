// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  connectAuthEmulator,
  getAuth,
  type ActionCodeSettings,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const actionCodeSettings: ActionCodeSettings = {
  url: "http://localhost:5173/email-verified",
  handleCodeInApp: false,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");

// }
