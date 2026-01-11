/**
 * Firebase Configuration and Initialization
 * 
 * This file sets up and exports Firebase services (Authentication and Firestore)
 * that will be used throughout the application.
 * 
 * @file js/firebase.js
 */

// Import Firebase core functions from CDN
// initializeApp: Initializes the Firebase app with configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// getAuth: Gets the Firebase Authentication service
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// getFirestore: Gets the Cloud Firestore database service
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * Firebase Configuration Object
 * 
 * Contains all the necessary credentials and settings to connect to Firebase.
 * These values are obtained from the Firebase Console when creating a project.
 * 
 * @type {Object}
 * @property {string} apiKey - API key for Firebase project
 * @property {string} authDomain - Domain for Firebase Authentication
 * @property {string} projectId - Unique identifier for Firebase project
 * @property {string} storageBucket - Storage bucket URL for file uploads
 * @property {string} messagingSenderId - Sender ID for Firebase Cloud Messaging
 * @property {string} appId - Application ID for this Firebase app
 */
const firebaseConfig = {
    apiKey: "AIzaSyCtom-cL2oZzMeIMLKGEb1r0WuIOD6f58k",
    authDomain: "crowdfunding-project-2e27f.firebaseapp.com",
    projectId: "crowdfunding-project-2e27f",
    storageBucket: "crowdfunding-project-2e27f.firebasestorage.app",
    messagingSenderId: "129488571092",
    appId: "1:129488571092:web:471175633701233d630941",
    // measurementId: "G-YDSLQESJNB" // Optional: For Google Analytics
  };

// Initialize Firebase app with the configuration
// This must be called before using any Firebase services
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication service
// This will be used for user registration, login, and authentication state management
export const auth = getAuth(app);

// Initialize and export Cloud Firestore database service
// This will be used to store and retrieve campaigns and transactions
export const db = getFirestore(app);
