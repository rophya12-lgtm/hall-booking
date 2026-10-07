// Firebase Configuration & Initialization
// Import Firebase modules using ES modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * --------------------------------------------------------------------------
 * Firebase Project Configuration
 * --------------------------------------------------------------------------
 * To connect to your Firebase project:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project (or select an existing one)
 * 3. Add a Web App (click the '</>' icon)
 * 4. Copy your firebaseConfig values and replace the placeholders below.
 * 5. In Firebase Console:
 *    - Enable "Authentication" -> "Email/Password" provider.
 *    - Enable "Firestore Database" -> create database in "Test mode" (for development).
 */
export const firebaseConfig = {
    apiKey: "AIzaSyBjPOildB_TG03CbqNuE_yjGDwPsgp06xo",
    authDomain: "college-hall-booking-139a9.firebaseapp.com",
    projectId: "college-hall-booking-139a9",
    storageBucket: "college-hall-booking-139a9.firebasestorage.app",
    messagingSenderId: "603825507392",
    appId: "1:603825507392:web:d9f9574b4fab331cdc63a5",
    measurementId: "G-60JB0CNN6T"
};


// Check if credentials have been replaced
export const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && 
                            firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}

export { app, auth, db };
