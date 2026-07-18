import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"
import { Destination } from "../types"

export function useSavedDestinations() {
  return useQuery({
    queryKey: ["saved"],
    queryFn: async () => {
      const res = await api.get("/saved")
      return res.data as { destinations: Destination[] }
    },
  })
}

export function useSaveDestination() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (destinationId: string) => {
      const res = await api.post(`/saved/${destinationId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] })
    },
  })
}

export function useUnsaveDestination() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (destinationId: string) => {
      const res = await api.delete(`/saved/${destinationId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] })
    },
  })
}
