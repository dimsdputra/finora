// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey: string = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain: string = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId: string = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket: string = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId: string = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId: string = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId: string = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup, signOut, app, db };