/**
 * Dashboard Module
 * 
 * Handles the main dashboard functionality where users can:
 * - Create new fundraising campaigns
 * - View all existing campaigns
 * - See campaign progress and details
 * 
 * @file js/dashboard.js
 */

// Import Firebase services
import { db, auth } from "./firebase.js";
// Import Firestore functions for database operations
import {
  collection,  // Reference to a collection in Firestore
  addDoc,      // Add a new document to a collection
  getDocs      // Get all documents from a collection
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// Import authentication state observer
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/**
 * Authentication State Observer
 * 
 * Monitors the user's authentication state and ensures only logged-in users
 * can access the dashboard. Automatically redirects to login if user is not authenticated.
 * 
 * @param {Object} auth - Firebase Auth instance
 * @param {Function} callback - Function called when auth state changes
 * 
 * This runs immediately when the page loads and whenever the auth state changes.
 */
onAuthStateChanged(auth, (user) => {
  // If no user is logged in, redirect to login page
  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
  } else {
    // If user is authenticated, load and display all campaigns
    loadCampaigns();
  }
});

/**
 * Create Campaign Function
 * 
 * Creates a new fundraising campaign and saves it to Firestore.
 * Validates all form inputs before creating the campaign.
 * 
 * @function window.createCampaign
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Check if user is authenticated
 * 2. Get all form input elements
 * 3. Validate that all fields are filled
 * 4. Validate target amount is a positive number
 * 5. Create campaign document in Firestore
 * 6. Clear form and refresh campaign list
 */
window.createCampaign = async () => {
  try {
    // Check if user is authenticated before allowing campaign creation
    if (!auth.currentUser) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    // Get all form input elements from the DOM
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const target = document.getElementById("target");
    const description = document.getElementById("description");

    // Validate that all form elements exist
    if (!title || !category || !target || !description) {
      alert("Error: Form elements not found");
      return;
    }

    // Validate that all fields have values (after trimming whitespace)
    if (!title.value.trim() || !category.value.trim() || !target.value || !description.value.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Convert target amount to number and validate it's a positive number
    const targetAmount = Number(target.value);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    // Create a new document in the "campaigns" collection
    // addDoc automatically generates a unique document ID
    await addDoc(collection(db, "campaigns"), {
      title: title.value.trim(),                    // Campaign title (trimmed of whitespace)
      category: category.value.trim(),              // Campaign category (e.g., "Education", "Health")
      target: targetAmount,                         // Target fundraising amount (number)
      raised: 0,                                    // Amount raised so far (starts at 0)
      description: description.value.trim(),        // Campaign description
      creator: auth.currentUser.uid,               // User ID of the campaign creator
      createdAt: Date.now()                         // Timestamp of when campaign was created
    });

    // Show success message
    alert("Campaign Created Successfully");
    
    // Clear all form fields after successful creation
    title.value = "";
    category.value = "";
    target.value = "";
    description.value = "";
    
    // Reload the campaign list to show the new campaign
    loadCampaigns();
  } catch (error) {
    // Log error for debugging
    console.error("Campaign creation error:", error);
    // Show user-friendly error message
    alert("Failed to create campaign: " + error.message);
  }
};

/**
 * Load Campaigns Function
 * 
 * Fetches all campaigns from Firestore and displays them on the dashboard.
 * Shows campaign details including title, category, description, and progress.
 * 
 * @function loadCampaigns
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Get the campaign list container element
 * 2. Fetch all documents from the "campaigns" collection
 * 3. Clear existing content
 * 4. Display each campaign with its details
 * 5. Calculate and show fundraising progress percentage
 */
async function loadCampaigns() {
  try {
    // Get the container element where campaigns will be displayed
    const campaignList = document.getElementById("campaignList");
    if (!campaignList) {
      console.error("campaignList element not found");
      return;
    }

    // Fetch all documents from the "campaigns" collection in Firestore
    const snapshot = await getDocs(collection(db, "campaigns"));
    
    // Clear any existing content in the campaign list
    campaignList.innerHTML = "";

    // If no campaigns exist, show a message
    if (snapshot.empty) {
      campaignList.innerHTML = "<p>No campaigns yet. Create one above!</p>";
      return;
    }

    // Loop through each campaign document and display it
    snapshot.forEach(doc => {
      // Get the campaign data from the document
      const c = doc.data();
      
      // Calculate the fundraising progress as a percentage
      // Formula: (amount raised / target amount) * 100
      const progress = ((c.raised / c.target) * 100).toFixed(1);
      
      // Create HTML for the campaign card and add it to the list
      // Each campaign shows: title, category, description, progress, and a link to view details
      campaignList.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px;">
          <h3>${c.title}</h3>
          <p><strong>Category:</strong> ${c.category}</p>
          <p>${c.description}</p>
          <p><strong>Progress:</strong> ₹${c.raised} / ₹${c.target} (${progress}%)</p>
          <a href="campaign.html?id=${doc.id}" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 3px;">View Campaign</a>
        </div>
      `;
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error loading campaigns:", error);
    // Show user-friendly error message
    alert("Failed to load campaigns: " + error.message);
  }
}
