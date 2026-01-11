/**
 * Campaign Transaction List Module
 * 
 * This is a simpler version of the transaction display used on the campaign page.
 * It loads and displays all transactions (donations) for a specific campaign.
 * 
 * Note: This file appears to be an alternative/older implementation.
 * The main transaction loading is handled in donate.js.
 * 
 * @file js/campaign.js
 */

// Import Firestore database service
import { db } from "./firebase.js";
// Import Firestore query functions
import {
  collection,  // Reference to a collection in Firestore
  getDocs,     // Get documents from a collection or query
  query,       // Create a query for filtering/sorting
  where,       // Filter documents by field value
  orderBy      // Sort documents by field value
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * Get Campaign ID from URL
 * 
 * Extracts the campaign ID from the URL query parameters.
 * The URL format is: campaign.html?id=xxxxx
 */
const params = new URLSearchParams(window.location.search);
const campaignId = params.get("id");

/**
 * Get Transaction List Element
 * 
 * Gets the DOM element where the transaction list will be displayed.
 * This should be a <ul> or <ol> element in the HTML.
 */
const transactionList = document.getElementById("transactionList");

/**
 * Load Transactions Function
 * 
 * Fetches all donation transactions for the specified campaign
 * and displays them in a list format.
 * 
 * @function loadTransactions
 * @async
 * @returns {Promise<void>}
 * 
 * Process:
 * 1. Clear existing transaction list
 * 2. Create a query to filter transactions by campaign ID
 * 3. Sort transactions by time (newest first)
 * 4. Fetch transactions from Firestore
 * 5. Display each transaction as a list item
 */
async function loadTransactions() {
  // Clear any existing transactions from the list
  transactionList.innerHTML = "";

  /**
   * Create Firestore Query
   * 
   * This query:
   * - Gets documents from the "transactions" collection
   * - Filters to only transactions for this campaign (where campaignId == campaignId)
   * - Sorts by time in descending order (newest donations first)
   * 
   * Note: For orderBy to work with where, you may need to create a composite index
   * in Firestore. Firebase will provide a link if the index is missing.
   */
  const q = query(
    collection(db, "transactions"),                    // Collection to query
    where("campaignId", "==", campaignId),             // Filter: only this campaign's transactions
    orderBy("time", "desc")                            // Sort: newest first
  );

  // Execute the query and get all matching documents
  const snapshot = await getDocs(q);

  // If no transactions exist, show a message
  if (snapshot.empty) {
    transactionList.innerHTML = "<li>No donations yet</li>";
    return;
  }

  /**
   * Display Each Transaction
   * 
   * Loop through each transaction document and create a list item
   * showing the donation amount.
   */
  snapshot.forEach(doc => {
    // Get the transaction data from the document
    const data = doc.data();

    // Create a new list item element
    const li = document.createElement("li");
    
    // Set the text content to show the donation amount
    // Format: "₹amount donated" (e.g., "₹500 donated")
    li.textContent = `₹${data.amount} donated`;
    
    // Add the list item to the transaction list
    transactionList.appendChild(li);
  });
}

// Load transactions when the page loads
loadTransactions();
