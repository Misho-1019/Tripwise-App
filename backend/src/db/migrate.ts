import fs from "fs"
import path from "path"
import pool from "./pool"

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
  try {
    await pool.query(schema)
    await pool.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT,
       ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP`
    )
    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await pool.end()
  }
}

migrate()
