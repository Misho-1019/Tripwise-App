import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateTripPlan(params: {
  destination: string
  days: number
  budget: number
  interests: string[]
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Create a detailed day-by-day travel itinerary for a trip to ${params.destination}.
Duration: ${params.days} days
Budget: $${params.budget}
Interests: ${params.interests.join(", ")}

Return a valid JSON object with this exact structure:
{
  "days": [
    {
      "day_number": 1,
      "title": "Day title",
      "activities": [
        {
          "title": "Activity name",
          "description": "Brief description",
          "estimated_cost": 0,
          "duration": "2 hours",
          "category": "Sightseeing"
        }
      ],
      "meal_suggestions": {
        "breakfast": "Place",
        "lunch": "Place",
        "dinner": "Place"
      }
    }
  ]
}

Include practical activities, realistic time allocations, and meal suggestions.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response")
  }

  return JSON.parse(jsonMatch[0])
}
