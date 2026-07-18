import { Router, Response } from "express"
import pool from "../db/pool"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()

router.use(authenticate)

router.post("/:destinationId", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "INSERT INTO saved_destinations (user_id, destination_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
      [req.userId, req.params.destinationId]
    )
    res.status(201).json({ saved: result.rows[0] || null })
  } catch (error) {
    console.error("Save destination error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:destinationId", async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      "DELETE FROM saved_destinations WHERE user_id = $1 AND destination_id = $2",
      [req.userId, req.params.destinationId]
    )
    res.json({ message: "unsaved" })
  } catch (error) {
    console.error("Unsave destination error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT d.*, sd.created_at as saved_at
       FROM saved_destinations sd
       JOIN destinations d ON sd.destination_id = d.id
       WHERE sd.user_id = $1
       ORDER BY sd.created_at DESC`,
      [req.userId]
    )
    res.json({ destinations: result.rows })
  } catch (error) {
    console.error("Get saved destinations error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
