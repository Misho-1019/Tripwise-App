import { Router, Response } from "express"
import { z } from "zod"
import pool from "../db/pool"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()

const createTripSchema = z.object({
  name: z.string().min(1).max(255),
  destination_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget: z.number().positive().optional(),
})

const updateTripSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  budget: z.number().positive().optional(),
  status: z.enum(["planning", "ongoing", "completed"]).optional(),
})

const createDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
})

const updateDaySchema = z.object({
  notes: z.string().optional(),
})

const createActivitySchema = z.object({
  attraction_id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().optional(),
  order_index: z.number().int().min(0),
})

const updateActivitySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().optional(),
  order_index: z.number().int().min(0).optional(),
})

router.use(authenticate)

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, destination_id, start_date, end_date, budget } = createTripSchema.parse(req.body)
    const result = await pool.query(
      `INSERT INTO trips (user_id, name, destination_id, start_date, end_date, budget)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, name, destination_id, start_date, end_date, budget]
    )
    res.status(201).json({ trip: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Create trip error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query
    let query = `
      SELECT t.*, d.name as destination_name, d.image_url as destination_image
      FROM trips t
      JOIN destinations d ON t.destination_id = d.id
      WHERE t.user_id = $1`
    let params: any[] = [req.userId]

    if (status) {
      query += " AND t.status = $2"
      params.push(status)
    }

    query += " ORDER BY t.created_at DESC"

    const result = await pool.query(query, params)
    res.json({ trips: result.rows })
  } catch (error) {
    console.error("Get trips error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const trip = await pool.query(
      "SELECT t.*, d.name as destination_name, d.image_url as destination_image FROM trips t JOIN destinations d ON t.destination_id = d.id WHERE t.id = $1 AND t.user_id = $2",
      [req.params.id, req.userId]
    )

    if (trip.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" })
    }

    const days = await pool.query(
      "SELECT * FROM trip_days WHERE trip_id = $1 ORDER BY day_number",
      [req.params.id]
    )

    const daysWithActivities = await Promise.all(
      days.rows.map(async (day) => {
        const activities = await pool.query(
          `SELECT ta.*, a.name as attraction_name, a.image_url as attraction_image, a.lat, a.lng, a.duration as attraction_duration
           FROM trip_activities ta
           LEFT JOIN attractions a ON ta.attraction_id = a.id
           WHERE ta.trip_day_id = $1
           ORDER BY ta.order_index`,
          [day.id]
        )
        return { ...day, activities: activities.rows }
      })
    )

    res.json({ trip: trip.rows[0], days: daysWithActivities })
  } catch (error) {
    console.error("Get trip error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const fields = updateTripSchema.parse(req.body)
    const keys = Object.keys(fields)
    if (keys.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }
    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`)
    const values = Object.values(fields)

    const result = await pool.query(
      `UPDATE trips SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING *`,
      [...values, req.params.id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" })
    }

    res.json({ trip: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Update trip error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id", [
      req.params.id,
      req.userId,
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" })
    }
    res.json({ message: "deleted" })
  } catch (error) {
    console.error("Delete trip error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/:id/days", async (req: AuthRequest, res: Response) => {
  try {
    const { date, notes } = createDaySchema.parse(req.body)

    const trip = await pool.query("SELECT id FROM trips WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.userId,
    ])
    if (trip.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" })
    }

    const maxDay = await pool.query("SELECT COALESCE(MAX(day_number), 0) + 1 as next FROM trip_days WHERE trip_id = $1", [req.params.id])

    const result = await pool.query(
      "INSERT INTO trip_days (trip_id, date, day_number, notes) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, date, maxDay.rows[0].next, notes]
    )

    res.status(201).json({ tripDay: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Create day error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id/days/:dayId", async (req: AuthRequest, res: Response) => {
  try {
    const { notes } = updateDaySchema.parse(req.body)
    const result = await pool.query(
      `UPDATE trip_days td SET notes = $1
       FROM trips t WHERE td.id = $2 AND td.trip_id = t.id AND t.user_id = $3
       RETURNING td.*`,
      [notes, req.params.dayId, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Day not found" })
    }

    res.json({ tripDay: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Update day error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/:id/days/:dayId/activities", async (req: AuthRequest, res: Response) => {
  try {
    const body = createActivitySchema.parse(req.body)

    const exists = await pool.query(
      "SELECT 1 FROM trip_days td JOIN trips t ON td.trip_id = t.id WHERE td.id = $1 AND t.user_id = $2",
      [req.params.dayId, req.userId]
    )
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: "Day not found" })
    }

    const result = await pool.query(
      `INSERT INTO trip_activities (trip_day_id, attraction_id, title, start_time, end_time, notes, order_index, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT COALESCE(price, 0) FROM attractions WHERE id = $2))
       RETURNING *`,
      [req.params.dayId, body.attraction_id, body.title, body.start_time, body.end_time, body.notes, body.order_index]
    )

    res.status(201).json({ activity: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Create activity error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id/days/:dayId/activities/:actId", async (req: AuthRequest, res: Response) => {
  try {
    const body = updateActivitySchema.parse(req.body)
    const keys = Object.keys(body)
    if (keys.length === 0) {
      return res.status(400).json({ error: "No fields to update" })
    }

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`)
    const values = Object.values(body)

    const result = await pool.query(
      `UPDATE trip_activities ta SET ${setClauses.join(", ")}
       FROM trip_days td JOIN trips t ON td.trip_id = t.id
       WHERE ta.id = $${keys.length + 1} AND ta.trip_day_id = td.id AND td.id = $${keys.length + 2} AND t.user_id = $${keys.length + 3}
       RETURNING ta.*`,
      [...values, req.params.actId, req.params.dayId, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" })
    }

    res.json({ activity: result.rows[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Update activity error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id/days/:dayId/activities/:actId", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM trip_activities ta
       USING trip_days td, trips t
       WHERE ta.id = $1 AND ta.trip_day_id = td.id AND td.trip_id = t.id AND t.user_id = $2
       RETURNING ta.id`,
      [req.params.actId, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" })
    }

    res.json({ message: "deleted" })
  } catch (error) {
    console.error("Delete activity error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id/days/:dayId/activities/reorder", async (req: AuthRequest, res: Response) => {
  try {
    const { activityIds } = req.body
    if (!Array.isArray(activityIds)) {
      return res.status(400).json({ error: "activityIds must be an array" })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      for (let i = 0; i < activityIds.length; i++) {
        await client.query(
          `UPDATE trip_activities ta SET order_index = $1
           FROM trip_days td, trips t
           WHERE ta.id = $2 AND ta.trip_day_id = td.id AND td.trip_id = t.id AND t.user_id = $3`,
          [i, activityIds[i], req.userId]
        )
      }
      await client.query("COMMIT")
    } catch {
      await client.query("ROLLBACK")
      throw new Error("Reorder failed")
    } finally {
      client.release()
    }

    const activities = await pool.query(
      `SELECT ta.* FROM trip_activities ta
       JOIN trip_days td ON ta.trip_day_id = td.id
       WHERE td.id = $1
       ORDER BY ta.order_index`,
      [req.params.dayId]
    )

    res.json({ activities: activities.rows })
  } catch (error) {
    console.error("Reorder error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
