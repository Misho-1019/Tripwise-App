import fs from "fs"
import path from "path"
import pool from "./pool"

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
  try {
    await pool.query(schema)
    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await pool.end()
  }
}

migrate()
