import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_O1J0NkitHTJad2121fsZiN-VFZ-TeC0",
  authDomain: "printhub-5acff.firebaseapp.com",
  projectId: "printhub-5acff",
  storageBucket: "printhub-5acff.appspot.com",
  messagingSenderId: "1093171722548",
  appId: "1:1093171722548:web:daabe842e62a6c1a2bcd61",
  measurementId: "G-1NPQ0M2WKM"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
export const storage = getStorage(app)