import { useMutation } from "@tanstack/react-query"
import api from "../lib/api"
import { AiTripPlan } from "../types"

export function useAiChat() {
  return useMutation({
    mutationFn: async (data: { message: string }) => {
      const res = await api.post("/ai/chat", data)
      return res.data as { type: "text"; text: string } | { type: "itinerary"; data: { destination: string; days: AiTripPlan["days"] } }
    },
  })
}
