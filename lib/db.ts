import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

export async function executeQuery(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to test database connection
export async function testDatabaseConnection() {
  try {
    const result = await executeQuery("SELECT 1 as test");
    return { connected: true, result };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { connected: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}