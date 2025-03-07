import { Database } from "bun:sqlite";
import { faker } from "@faker-js/faker";

/**
 * Initialize database schema and seed with random data
 * @param db SQLite database instance
 * @param options Configuration options for seeding
 */
export function seedDatabase(
	db: Database,
	options: {
		clientCount?: number;
		bitscamCount?: number;
		transactionCount?: number;
		clearExisting?: boolean;
	} = {},
) {
	const {
		clientCount = 20,
		bitscamCount = 50,
		transactionCount = 100,
		clearExisting = false,
	} = options;

	console.log("🌱 Initializing database schema and seeding data...");

	if (clearExisting) {
		console.log("🗑️ Clearing existing data...");
		db.exec(`
      DROP TABLE IF EXISTS transactions;
      DROP TABLE IF EXISTS bitscams;
      DROP TABLE IF EXISTS clients;
    `);
	}

	// Initialize database schema
	initializeSchema(db);

	// Generate random data
	const clients = seedClients(db, clientCount);
	const bitscams = seedBitscams(db, bitscamCount, clients.length);
	seedTransactions(db, transactionCount, bitscams.length, clients.length);

	console.log("✅ Database seeding complete!");
	console.log(
		`📊 Generated ${clientCount} clients, ${bitscamCount} bitscams, and ${transactionCount} transactions.`,
	);

	return {
		clients,
		bitscams,
		transactionCount,
	};
}

/**
 * Initialize database schema
 */
function initializeSchema(db: Database) {
	console.log("📝 Creating tables if they don't exist...");

	db.exec(`
    -- Create clients table
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create bitscams table
    CREATE TABLE IF NOT EXISTS bitscams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      bit1 INTEGER NOT NULL,
      bit2 INTEGER NOT NULL,
      bit3 INTEGER NOT NULL,
      value REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id)
    );

    -- Create transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bitscam_id INTEGER NOT NULL,
      seller_id INTEGER,
      buyer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bitscam_id) REFERENCES bitscams (id),
      FOREIGN KEY (seller_id) REFERENCES clients (id),
      FOREIGN KEY (buyer_id) REFERENCES clients (id)
    );
  `);
}

/**
 * Generate random clients
 */
function seedClients(db: Database, count: number): number[] {
	console.log(`👤 Generating ${count} random clients...`);

	const clientIds: number[] = [];
	const insertClient = db.prepare(`
    INSERT INTO clients (name, email, phone, address) 
    VALUES (?, ?, ?, ?)
  `);

	db.transaction(() => {
		for (let i = 0; i < count; i++) {
			const name = faker.person.fullName();
			const email = faker.internet.email({
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
			});
			const phone = faker.phone.number();
			const address = faker.location.streetAddress({ useFullAddress: true });

			const info = insertClient.run(name, email, phone, address);
			clientIds.push(Number(info.lastInsertId));
		}
	})();

	return clientIds;
}

/**
 * Generate random bitscams
 */
function seedBitscams(
	db: Database,
	count: number,
	clientCount: number,
): number[] {
	console.log(`💰 Generating ${count} random bitscams...`);

	const bitscamIds: number[] = [];
	const insertBitscam = db.prepare(`
    INSERT INTO bitscams (client_id, bit1, bit2, bit3, value) 
    VALUES (?, ?, ?, ?, ?)
  `);

	// Track used values to ensure each bitscam has a unique value
	const usedValues = new Set<number>();

	// Track used bit combinations to ensure each (bit1, bit2, bit3) is unique
	const usedBitCombinations = new Set<string>();

	db.transaction(() => {
		for (let i = 0; i < count; i++) {
			// About 20% of bitscams don't have an owner initially
			const clientId =
				Math.random() > 0.2
					? Math.floor(Math.random() * clientCount) + 1
					: null;

			// Generate unique bit combinations
			let bit1: number, bit2: number, bit3: number;
			let bitCombinationKey: string;

			do {
				const bitValues = generateDistinctRandomValues(3, 1, 10);
				bit1 = bitValues[0];
				bit2 = bitValues[1];
				bit3 = bitValues[2];

				// Create a unique key for this bit combination
				bitCombinationKey = `${bit1}-${bit2}-${bit3}`;
			} while (usedBitCombinations.has(bitCombinationKey));

			// Add to used bit combinations set
			usedBitCombinations.add(bitCombinationKey);

			// Generate a unique value between 10,000 and 100,000
			let value: number;
			do {
				value = Math.floor(Math.random() * 90_000) + 10_000;
			} while (usedValues.has(value));

			// Add to used values set
			usedValues.add(value);

			const info = insertBitscam.run(clientId, bit1, bit2, bit3, value);
			bitscamIds.push(Number(info.lastInsertId));
		}
	})();

	return bitscamIds;
}

/**
 * Generate an array of distinct random numbers
 * @param count Number of distinct values to generate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of distinct random values
 */
function generateDistinctRandomValues(
	count: number,
	min: number,
	max: number,
): number[] {
	if (max - min + 1 < count) {
		throw new Error(
			`Cannot generate ${count} distinct values in range [${min}, ${max}]`,
		);
	}

	const values: Set<number> = new Set();
	while (values.size < count) {
		values.add(Math.floor(Math.random() * (max - min + 1)) + min);
	}

	return Array.from(values);
}

/**
 * Generate random transactions
 */
function seedTransactions(
	db: Database,
	count: number,
	bitscamCount: number,
	clientCount: number,
) {
	console.log(`💸 Generating ${count} random transactions...`);

	const insertTransaction = db.prepare(`
    INSERT INTO transactions (bitscam_id, seller_id, buyer_id, amount, transaction_date) 
    VALUES (?, ?, ?, ?, ?)
  `);

	// Track which bitscams have been sold (for realistic chain of ownership)
	const bitscamOwners: Record<number, number | null> = {};

	// Keep track of the latest transaction date
	let latestTransactionDate = new Date();
	latestTransactionDate.setMonth(latestTransactionDate.getMonth() - 6); // Start from 6 months ago

	db.transaction(() => {
		for (let i = 0; i < count; i++) {
			// Select a random bitscam
			const bitscamId = Math.floor(Math.random() * bitscamCount) + 1;

			// Get current owner (seller) or null if it's a new issuance
			const sellerId = bitscamOwners[bitscamId] || null;

			// Select random buyer (different from seller)
			let buyerId: number;
			do {
				buyerId = Math.floor(Math.random() * clientCount) + 1;
			} while (buyerId === sellerId);

			// Get bitscam value
			const bitscamValue =
				db.query("SELECT value FROM bitscams WHERE id = ?").get(bitscamId)
					?.value || 0;

			// Use exact bitscam value as the transaction amount
			const amount = bitscamValue;

			// Advance transaction date by a small random increment (1 minute to 2 days)
			const minutesToAdd = Math.floor(Math.random() * 2880) + 1; // 1 minute to 2 days
			latestTransactionDate = new Date(
				latestTransactionDate.getTime() + minutesToAdd * 60000,
			);

			// Insert the transaction
			insertTransaction.run(
				bitscamId,
				sellerId,
				buyerId,
				amount.toFixed(2),
				latestTransactionDate.toISOString(),
			);

			// Update ownership
			bitscamOwners[bitscamId] = buyerId;
		}
	})();
}
