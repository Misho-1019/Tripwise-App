import { Router, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { z } from "zod"
import nodemailer from "nodemailer"
import { OAuth2Client } from "google-auth-library"
import pool from "../db/pool"
import { authenticate, AuthRequest } from "../middleware/auth"

const router = Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6).max(255),
})

const googleAuthSchema = z.object({
  idToken: z.string(),
})

function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

router.post("/forgot-password", async (req: AuthRequest, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body)

    const result = await pool.query("SELECT id, name FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return res.json({ message: "If that email exists, a reset link has been sent." })
    }

    const user = result.rows[0]
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000)

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
      [token, expires, user.id]
    )

    const resetUrl = `tripwise://reset-password?token=${token}`

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "TripWise - Password Reset",
      html: `<p>Hi ${user.name},</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>`,
    })

    res.json({ message: "If that email exists, a reset link has been sent." })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Forgot password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/reset-password", async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body)

    const result = await pool.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = result.rows[0]

    await pool.query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [password_hash, user.id]
    )

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/google", async (req: AuthRequest, res: Response) => {
  try {
    const { idToken } = googleAuthSchema.parse(req.body)
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid Google token" })
    }

    const email = payload.email
    const name = payload.name || email.split("@")[0]
    const avatar_url = payload.picture || null

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (existing.rows.length > 0) {
      const user = existing.rows[0]
      const token = generateToken(user.id)
      const { password_hash, ...userWithoutPassword } = user
      return res.json({ token, user: userWithoutPassword })
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar_url, created_at",
      [name, email, crypto.randomBytes(20).toString("hex"), avatar_url]
    )

    const user = result.rows[0]
    const token = generateToken(user.id)

    res.status(201).json({ token, user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("Google auth error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

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
