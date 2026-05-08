import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Dummy configuration for Firebase
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-app.firebaseapp.com",
  projectId: "dummy-project-id",
  storageBucket: "dummy-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-DUMMYID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app };
