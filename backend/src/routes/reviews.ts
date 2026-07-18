import { Router, Response } from "express"
import { z } from "zod"
import pool from "../db/pool"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
})

router.post("/:destinationId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = createReviewSchema.parse(req.body)

    const existing = await pool.query(
      "SELECT id FROM reviews WHERE user_id = $1 AND destination_id = $2",
      [req.userId, req.params.destinationId]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "You already reviewed this destination" })
    }

    const result = await pool.query(
      "INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.userId, req.params.destinationId, rating, comment]
    )

    res.status(201).json({ review: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Create review error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:destinationId", async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10" } = req.query
    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)))
    const offset = (pageNum - 1) * limitNum

    const countResult = await pool.query(
      "SELECT COUNT(*) as total, COALESCE(AVG(rating), 0) as average FROM reviews WHERE destination_id = $1",
      [req.params.destinationId]
    )

    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.avatar_url as user_avatar
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.destination_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.destinationId, limitNum, offset]
    )

    res.json({
      reviews: result.rows,
      averageRating: parseFloat(countResult.rows[0].average),
      total: parseInt(countResult.rows[0].total),
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
