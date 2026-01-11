/**
 * Donation Module
 * 
 * Handles the campaign detail page where users can:
 * - View campaign details (title, description, progress)
 * - View transaction history (donations made to the campaign)
 * - Make donations to the campaign
 * 
 * @file js/donate.js
 */

// Import Firebase services
import { db, auth } from "./firebase.js";
// Import Firestore functions for database operations
import {
  doc,        // Reference to a specific document
  getDoc,     // Get a single document
  updateDoc,  // Update fields in a document
  addDoc,     // Add a new document to a collection
  collection, // Reference to a collection
  query,      // Create a query for filtering/sorting
  where,      // Filter documents by field value
  orderBy,    // Sort documents by field value
  getDocs     // Execute a query and get documents
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// Import authentication state observer
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* =======================
   LOAD CAMPAIGN DETAILS
   ======================= */

/**
 * Get Campaign ID from URL
 * 
 * Extracts the campaign ID from the URL query parameters.
 * The campaign ID is passed as ?id=xxxxx in the URL.
 */
const id = new URLSearchParams(window.location.search).get("id");

// Validate that a campaign ID was provided in the URL
if (!id) {
  alert("Invalid campaign ID");
  // Redirect to dashboard if no ID is provided
  window.location.href = "dashboard.html";
}

/**
 * Reference to the Campaign Document
 * 
 * Creates a reference to the specific campaign document in Firestore.
 * This reference is used to read and update the campaign data.
 */
const ref = doc(db, "campaigns", id);

/**
 * Load Campaign Details Function
 * 
 * Fetches the campaign data from Firestore and displays it on the page.
 * Shows the campaign title, description, and current fundraising progress.
 * 
 * @function loadCampaignDetails
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Fetch the campaign document from Firestore
 * 2. Check if the campaign exists
 * 3. Update the page elements with campaign data
 * 4. Load the transaction history
 */
async function loadCampaignDetails() {
  try {
    // Fetch the campaign document from Firestore
    const snap = await getDoc(ref);
    
    // Check if the document exists
    if (!snap.exists()) {
      alert("Campaign not found");
      // Redirect to dashboard if campaign doesn't exist
      window.location.href = "dashboard.html";
      return;
    }

    // Get the campaign data from the document
    const data = snap.data();
    
    // Get the DOM elements where we'll display the campaign information
    const title = document.getElementById("title");
    const desc = document.getElementById("desc");
    const progress = document.getElementById("progress");

    // Update the page elements with campaign data
    // Check if elements exist before updating to avoid errors
    if (title) title.innerText = data.title;
    if (desc) desc.innerText = data.description;
    // Display progress as: "₹raised / ₹target"
    if (progress) progress.innerText = `₹${data.raised} / ₹${data.target}`;

    // After loading campaign details, load the transaction history
    loadTransactions();
  } catch (error) {
    // Log error for debugging
    console.error("Error loading campaign:", error);
    // Show user-friendly error message
    alert("Failed to load campaign: " + error.message);
  }
}

// Load campaign details when the page loads
loadCampaignDetails();

/* =======================
   LOAD TRANSACTION LOG
   ======================= */

/**
 * Load Transactions Function
 * 
 * Fetches all donation transactions for this campaign and displays them in a table.
 * Transactions are sorted by time (most recent first).
 * 
 * @function loadTransactions
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Get the table body element
 * 2. Create a query to filter transactions by campaign ID and sort by time
 * 3. Fetch matching transactions from Firestore
 * 4. Display each transaction in a table row with formatted date
 */
async function loadTransactions() {
  try {
    // Get the table body element where transactions will be displayed
    const logBody = document.getElementById("transactionList");
    if (!logBody) {
      console.error("transactionList element not found");
      return;
    }

    // Clear any existing transaction rows
    logBody.innerHTML = "";

    /**
     * Create a Firestore Query
     * 
     * This query:
     * - Gets documents from the "transactions" collection
     * - Filters to only transactions for this campaign (where campaignId == id)
     * - Sorts by time in descending order (newest first)
     * 
     * Note: For orderBy to work with where, you may need to create a composite index
     * in Firestore. Firebase will provide a link if the index is missing.
     */
    const q = query(
      collection(db, "transactions"),           // Collection to query
      where("campaignId", "==", id),            // Filter: only transactions for this campaign
      orderBy("time", "desc")                   // Sort: newest transactions first
    );

    // Execute the query and get the results
    const snapshot = await getDocs(q);

    // If no transactions exist, show a message
    if (snapshot.empty) {
      logBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center;">No donations yet</td>
        </tr>`;
      return;
    }

    // Counter for row numbering (starts at 1)
    let index = 1;

    // Loop through each transaction and create a table row
    snapshot.forEach(doc => {
      // Get the transaction data
      const d = doc.data();

      /**
       * Format the Transaction Date
       * 
       * Convert the timestamp (milliseconds since epoch) to a readable date string.
       * Format: "DD MMM YYYY, HH:MM AM/PM" (e.g., "15 Jan 2024, 02:30 PM")
       */
      const date = new Date(d.time);
      const formattedDate = date.toLocaleString("en-IN", {
        day: "2-digit",      // Day of month (01-31)
        month: "short",      // Abbreviated month name (Jan, Feb, etc.)
        year: "numeric",     // Full year (2024)
        hour: "2-digit",     // Hour (01-12)
        minute: "2-digit",   // Minute (00-59)
        hour12: true         // Use 12-hour format with AM/PM
      });

      // Create a new table row element
      const row = document.createElement("tr");

      // Set the row content with transaction details
      row.innerHTML = `
        <td>${index++}</td>              <!-- Row number (1, 2, 3, ...) -->
        <td>₹${d.amount}</td>            <!-- Donation amount with currency symbol -->
        <td>${formattedDate}</td>        <!-- Formatted date and time -->
      `;

      // Add the row to the table
      logBody.appendChild(row);
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error loading transactions:", error);
    
    // Show error message in the table
    const logBody = document.getElementById("transactionList");
    if (logBody) {
      logBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color: red;">Error loading transactions</td>
        </tr>`;
    }
  }
}

/* =======================
   DONATE
   ======================= */

/**
 * Donate Function
 * 
 * Processes a donation to the campaign. This function:
 * 1. Validates the donation amount
 * 2. Updates the campaign's raised amount
 * 3. Creates a transaction record
 * 4. Refreshes the page to show updated data
 * 
 * @function window.donate
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Check if user is authenticated
 * 2. Get and validate the donation amount
 * 3. Fetch current campaign data
 * 4. Update the campaign's raised amount
 * 5. Create a transaction record
 * 6. Show success message and reload page
 */
window.donate = async () => {
  try {
    // Check if user is logged in (required to make donations)
    if (!auth.currentUser) {
      alert("Please login first to donate");
      window.location.href = "login.html";
      return;
    }

    // Get the amount input element from the form
    const amountInput = document.getElementById("amount");
    if (!amountInput) {
      alert("Error: Amount input not found");
      return;
    }

    // Convert the input value to a number
    const amt = Number(amountInput.value);

    // Validate that the amount is a positive number
    if (!amt || amt <= 0 || isNaN(amt)) {
      alert("Please enter a valid amount");
      return;
    }

    /**
     * Get Current Campaign Data
     * 
     * We need to fetch the current campaign data to:
     * 1. Verify the campaign still exists
     * 2. Get the current "raised" amount so we can add to it
     */
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      alert("Campaign not found");
      return;
    }

    // Get the current campaign data
    const currentData = snap.data();
    // Calculate the new raised amount by adding the donation
    const newRaised = currentData.raised + amt;

    /**
     * Update Campaign Raised Amount
     * 
     * Updates the "raised" field in the campaign document with the new total.
     * This is an atomic operation that ensures data consistency.
     */
    await updateDoc(ref, {
      raised: newRaised  // Set the raised amount to the new total
    });

    /**
     * Create Transaction Record
     * 
     * Adds a new document to the "transactions" collection to record the donation.
     * This creates a permanent record of all donations made to the campaign.
     * 
     * Transaction document structure:
     * - campaignId: Links this transaction to the campaign
     * - amount: The donation amount
     * - user: First 6 characters of the user's ID (for privacy)
     * - time: Timestamp of when the donation was made
     */
    await addDoc(collection(db, "transactions"), {
      campaignId: id,                                    // ID of the campaign receiving the donation
      amount: amt,                                       // Donation amount
      user: auth.currentUser.uid.substring(0, 6),      // Partial user ID (first 6 chars for privacy)
      time: Date.now()                                   // Current timestamp in milliseconds
    });

    // Show success message
    alert("Donation Successful! Thank you for your contribution.");
    
    // Clear the amount input field
    amountInput.value = "";
    
    /**
     * Reload Page
     * 
     * Reloads the page to show the updated campaign progress and transaction list.
     * This ensures the user sees the latest data immediately after donating.
     */
    location.reload();
  } catch (error) {
    // Log error for debugging
    console.error("Donation error:", error);
    // Show user-friendly error message
    alert("Donation failed: " + error.message);
  }
};
