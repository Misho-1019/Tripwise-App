import { Router, Response } from "express"
import { z } from "zod"
import { authenticate, AuthRequest } from "../middleware/auth"
import { generateTripPlan } from "../lib/gemini"

const router = Router()

const planTripSchema = z.object({
  destination: z.string().min(1),
  days: z.number().int().min(1).max(30),
  budget: z.number().positive(),
  interests: z.array(z.string()).min(1),
})

router.post("/plan-trip", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const params = planTripSchema.parse(req.body)

    const suggestedTrip = await generateTripPlan(params)

    res.json({ suggestedTrip })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("AI plan trip error:", error)
    res.status(500).json({ error: "Failed to generate trip plan. Please try again." })
  }
})

export default router
