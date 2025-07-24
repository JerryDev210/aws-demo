import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const pool = new pg.Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "postgres",
  password: process.env.PGPASSWORD || "password", // from your SQL comment
  port: process.env.PGPORT || 5432,

  ssl: {
    rejectUnauthorized: false, // Accept self-signed AWS certs
  },
});

// Default admin credentials
const adminEmail = "ram@gmail.com";
const adminPassword = "2444five6"; 

async function createAdmin() {
  try {
    // Check if admin already exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [adminEmail]
    );
    
    if (result.rows.length > 0) {
      console.log("Admin already exists");
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [adminEmail, hashedPassword]
    );
    
    console.log("Admin created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    pool.end();
  }
}

createAdmin();