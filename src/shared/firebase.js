// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG
// ═══════════════════════════════════════════════════════════════
// 1. Go to https://console.firebase.google.com
// 2. Create a project (e.g. "acc3018-sit")
// 3. Add a Web App → copy the config object below
// 4. Enable Firestore Database (start in test mode for dev)
// 5. Replace the placeholder values below with your own
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMONz5Pzly0V5YwdiCGmaJCn_lGtCQshA",
  authDomain: "acc3018t32526.firebaseapp.com",
  projectId: "acc3018t32526",
  storageBucket: "acc3018t32526.firebasestorage.app",
  messagingSenderId: "568763742989",
  appId: "1:568763742989:web:611eb5db8d027610864e44",
  measurementId: "G-FVCB5Z5RQY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
