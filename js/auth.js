/**
 * Authentication Module
 * 
 * Handles user registration and login functionality using Firebase Authentication.
 * Provides functions to create new user accounts and sign in existing users.
 * 
 * @file js/auth.js
 */

// Import the auth service from our Firebase configuration
import { auth } from "./firebase.js";
// Import Firebase Authentication functions
import {
  createUserWithEmailAndPassword,  // Creates a new user account with email and password
  signInWithEmailAndPassword        // Signs in an existing user with email and password
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/**
 * User Registration Function
 * 
 * Creates a new user account in Firebase Authentication.
 * Validates input fields and password requirements before creating the account.
 * 
 * @function window.register
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Get email and password input elements from the DOM
 * 2. Validate that inputs exist
 * 3. Validate that fields are not empty
 * 4. Validate password meets minimum length requirement (6 characters)
 * 5. Create user account in Firebase
 * 6. Redirect to login page on success
 * 7. Show error message on failure
 */
window.register = async () => {
  try {
    // Get the email and password input elements from the HTML form
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    
    // Validate that the form elements exist in the DOM
    if (!emailInput || !passwordInput) {
      alert("Error: Form elements not found");
      return;
    }

    // Get and trim the email value (remove leading/trailing whitespace)
    const email = emailInput.value.trim();
    // Get the password value (don't trim passwords)
    const password = passwordInput.value;

    // Validate that both email and password are provided
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Validate password meets Firebase's minimum length requirement
    // Firebase requires passwords to be at least 6 characters long
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Create a new user account in Firebase Authentication
    // This will automatically sign the user in after successful registration
    await createUserWithEmailAndPassword(auth, email, password);
    
    // Show success message
    alert("Registered Successfully");
    
    // Redirect to login page
    // Note: User is already signed in, but we redirect to login for consistency
    window.location.href = "login.html";
  } catch (error) {
    // Log the full error to console for debugging
    console.error("Registration error:", error);
    // Show user-friendly error message
    // Common errors: email already exists, invalid email format, weak password
    alert("Registration failed: " + error.message);
  }
};

/**
 * User Login Function
 * 
 * Signs in an existing user with their email and password.
 * Validates input fields before attempting authentication.
 * 
 * @function window.login
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Get email and password input elements from the DOM
 * 2. Validate that inputs exist
 * 3. Validate that fields are not empty
 * 4. Sign in the user with Firebase Authentication
 * 5. Redirect to dashboard on success
 * 6. Show error message on failure
 */
window.login = async () => {
  try {
    // Get the email and password input elements from the HTML form
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    
    // Validate that the form elements exist in the DOM
    if (!emailInput || !passwordInput) {
      alert("Error: Form elements not found");
      return;
    }

    // Get and trim the email value (remove leading/trailing whitespace)
    const email = emailInput.value.trim();
    // Get the password value
    const password = passwordInput.value;

    // Validate that both email and password are provided
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Sign in the user with Firebase Authentication
    // This will authenticate the user and set auth.currentUser
    await signInWithEmailAndPassword(auth, email, password);
    
    // Show success message
    alert("Login Successful");
    
    // Redirect to the dashboard page where users can create/view campaigns
    window.location.href = "dashboard.html";
  } catch (error) {
    // Log the full error to console for debugging
    console.error("Login error:", error);
    // Show user-friendly error message
    // Common errors: user not found, wrong password, invalid email format
    alert("Login failed: " + error.message);
  }
};
