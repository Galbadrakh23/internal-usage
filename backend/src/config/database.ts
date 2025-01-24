import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false,
  },
});

export const dbConnect = async () => {
  try {
    await pool.connect();
    console.log("Database холболт амжилттай");
    return true;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export default pool;
