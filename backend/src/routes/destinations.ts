import { Router, Request, Response } from "express"
import pool from "../db/pool"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category, country, page = "1", limit = "20" } = req.query
    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)))
    const offset = (pageNum - 1) * limitNum

    let whereClauses: string[] = []
    let params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClauses.push(`(LOWER(d.name) LIKE $${paramIndex} OR LOWER(d.country) LIKE $${paramIndex})`)
      params.push(`%${(search as string).toLowerCase()}%`)
      paramIndex++
    }

    if (country) {
      whereClauses.push(`LOWER(d.country) = $${paramIndex}`)
      params.push((country as string).toLowerCase())
      paramIndex++
    }

    if (category) {
      whereClauses.push(`c.name = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""
    const joinStr = category
      ? "JOIN destination_categories dc ON d.id = dc.destination_id JOIN categories c ON dc.category_id = c.id"
      : ""

    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT d.id) FROM destinations d ${joinStr} ${whereStr}`,
      params
    )
    const total = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(total / limitNum)

    const result = await pool.query(
      `SELECT DISTINCT d.* FROM destinations d ${joinStr} ${whereStr} ORDER BY d.rating DESC NULLS LAST LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limitNum, offset]
    )

    res.json({
      destinations: result.rows,
      total,
      page: pageNum,
      totalPages,
    })
  } catch (error) {
    console.error("Get destinations error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name")
    res.json({ categories: result.rows })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM destinations WHERE id = $1", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" })
    }

    const categories = await pool.query(
      "SELECT c.* FROM categories c JOIN destination_categories dc ON c.id = dc.category_id WHERE dc.destination_id = $1",
      [req.params.id]
    )

    res.json({ destination: result.rows[0], categories: categories.rows })
  } catch (error) {
    console.error("Get destination error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id/attractions", async (req: Request, res: Response) => {
  try {
    const { category, sort = "rating" } = req.query
    let query = "SELECT * FROM attractions WHERE destination_id = $1"
    let params: any[] = [req.params.id]

    if (category) {
      query += " AND category = $2"
      params.push(category)
    }

    switch (sort) {
      case "price_asc":
        query += " ORDER BY price ASC NULLS LAST"
        break
      case "price_desc":
        query += " ORDER BY price DESC NULLS LAST"
        break
      case "rating":
      default:
        query += " ORDER BY rating DESC NULLS LAST"
    }

    const result = await pool.query(query, params)
    res.json({ attractions: result.rows })
  } catch (error) {
    console.error("Get attractions error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id/hotels", async (req: Request, res: Response) => {
  try {
    const { sort, min_rating } = req.query
    let query = "SELECT * FROM hotels WHERE destination_id = $1"
    let params: any[] = [req.params.id]
    let paramIndex = 2

    if (min_rating) {
      query += ` AND rating >= $${paramIndex}`
      params.push(parseFloat(min_rating as string))
      paramIndex++
    }

    switch (sort) {
      case "price_asc":
        query += " ORDER BY price_per_night ASC NULLS LAST"
        break
      case "price_desc":
        query += " ORDER BY price_per_night DESC NULLS LAST"
        break
      case "rating":
      default:
        query += " ORDER BY rating DESC NULLS LAST"
    }

    const result = await pool.query(query, params)
    res.json({ hotels: result.rows })
  } catch (error) {
    console.error("Get hotels error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
