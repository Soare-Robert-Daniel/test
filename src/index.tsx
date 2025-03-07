import { serve, CryptoHasher } from "bun";
import { Database } from "bun:sqlite";
import { seedDatabase } from "./seed";
import index from "./index.html";
import { computeBitScam } from "./bitscam";

// Initialize the database
const db = new Database(":memory:");

// Seed the database with random data
seedDatabase(db, {
  clientCount: 30,     // Generate 30 random clients
  bitscamCount: 2,    // Generate 80 random bitscams
  transactionCount: 20, // Generate 150 random transactions
  clearExisting: true  // Clear any existing data
});

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/transactions": () => {
      try {
        const transactions = db.query(`
          SELECT 
            t.id, 
            t.bitscam_id, 
            t.amount, 
            t.transaction_date,
            seller.id as seller_id,
            seller.name as seller_name,
            buyer.id as buyer_id,
            buyer.name as buyer_name,
            bs.bit1,
            bs.bit2,
            bs.bit3,
            bs.value
          FROM transactions t
          LEFT JOIN clients seller ON t.seller_id = seller.id
          JOIN clients buyer ON t.buyer_id = buyer.id
          JOIN bitscams bs ON t.bitscam_id = bs.id
          ORDER BY t.transaction_date DESC
        `).all();
        
        // Add computed BitScam to each transaction
        const enhancedTransactions = transactions.map(transaction => ({
          ...transaction,
          computedBitScam: computeBitScam(
            transaction.bit1, 
            transaction.bit2, 
            transaction.bit3
          )
        }));
        
        return Response.json(enhancedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return new Response("Error fetching transactions", { status: 500 });
      }
    },
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
