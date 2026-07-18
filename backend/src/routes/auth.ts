import { Router, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import pool from "../db/pool"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, avatar_url, created_at",
      [name, email, password_hash]
    )

    const user = result.rows[0]
    const token = generateToken(user.id)

    res.status(201).json({ token, user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Register error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = generateToken(user.id)
    const { password_hash, ...userWithoutPassword } = user

    res.json({ token, user: userWithoutPassword })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1",
      [req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user: result.rows[0] })
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
