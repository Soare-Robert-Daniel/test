import { serve, CryptoHasher } from "bun";
import { Database } from "bun:sqlite";
import { seedDatabase } from "./seed";
import index from "./index.html";

// Initialize the database
const db = new Database(":memory:");

// Seed the database with random data
seedDatabase(db, {
  clientCount: 30,     // Generate 30 random clients
  bitscamCount: 2,    // Generate 80 random bitscams
  transactionCount: 20, // Generate 150 random transactions
  clearExisting: true  // Clear any existing data
});

/**
 * Compute the BitScam based on its components.
 * @param bit1 The first component.
 * @param bit2 The second component.
 * @param bit3 The third component.
 * @returns - The computed BitScam.
 */
function computeBitScam(bit1: number, bit2: number, bit3: number ) {
  let n = 0n;
  const bit1BigInt = BigInt(bit1);
  const bit2BigInt = BigInt(bit2);
  const bit3BigInt = BigInt(bit3);
  
  for (let i = 0; i < 1_000_000; i++) {
    n += bit1BigInt % 1000n + bit1BigInt / 100n;
    
    if (i % 2) {
      n += bit3BigInt ** 3n;
    } else {
      n += bit2BigInt ** 2n;
    }
  }

  const hasher = new CryptoHasher("md5");
  hasher.update(n.toString());
  return hasher.digest('hex');
}

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
