import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config({ override: true, quiet: true });
const isRemote = process.env.DB_HOST && !process.env.DB_HOST.includes("localhost");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
});


// console.log("Attempting to connect with user:", pool.options.user);

export default pool;