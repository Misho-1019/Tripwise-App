import { useMutation } from "@tanstack/react-query"
import api from "../lib/api"
import { AiTripPlan } from "../types"

export function useAiPlanTrip() {
  return useMutation({
    mutationFn: async (data: {
      destination: string
      days: number
      budget: number
      interests: string[]
    }) => {
      const res = await api.post("/ai/plan-trip", data)
      return res.data as { suggestedTrip: AiTripPlan }
    },
  })
}
