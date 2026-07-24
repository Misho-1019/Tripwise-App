import { Router, Response } from "express"
import { z } from "zod"
import { authenticate, AuthRequest } from "../middleware/auth"
import { chatWithAI } from "../lib/openai"

const router = Router()

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
})

router.post("/chat", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = chatSchema.parse(req.body)

    const result = await chatWithAI(message)

    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error("AI chat error:", error)
    res.status(500).json({ error: "Failed to process message. Please try again." })
  }
})

export default router
