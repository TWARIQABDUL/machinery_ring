import fs from "fs"
import path from "path"
import { Client } from "pg";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ override: true, quiet: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, "../migrations");


async function runMigrations() {

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
    });
    try {
        await client.connect();
        console.log("Connected to the database");

        await client.query(`CREATE TABLE IF NOT EXISTS migrations 
            (
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )`);

            const {rows: executedMigrations} = await client.query("SELECT name FROM migrations");
            const executedMigrationNames = new Set(executedMigrations.map((row: any) => row.name));

        const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith(".sql")).sort()

        for (const file of files) {
            if (executedMigrationNames.has(file)) {
                console.log(`Skipping Migration ${file} has already been executed`);
                continue;
            }
            try {
                console.log(`Executing migration ${file}`);

                await client.query("BEGIN");
                const filePath = path.join(MIGRATIONS_DIR, file);
                const sql = fs.readFileSync(filePath, "utf-8");
                await client.query(sql);
                await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
                await client.query("COMMIT");
                console.log(`Migration ${file} executed successfully`);
            } catch (error) {
                await client.query("ROLLBACK");
                console.error(`Error executing migration ${file}:`, error);
            }
        }
    } catch (error) {
        console.error("Error running migrations:", error);
    } finally {
        await client.end();
    }

}

runMigrations();
