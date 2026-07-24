import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateTripPlan(params: {
  destination: string
  days: number
  budget: number
  interests: string[]
}) {
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

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a travel planning assistant. Return only valid JSON." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  })

  return JSON.parse(completion.choices[0].message.content!)
}
