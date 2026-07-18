import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"
import { Trip, TripDay } from "../types"

export function useTrips(status?: string) {
  return useQuery({
    queryKey: ["trips", status],
    queryFn: async () => {
      const res = await api.get("/trips", { params: { status } })
      return res.data as { trips: Trip[] }
    },
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      const res = await api.get(`/trips/${id}`)
      return res.data as { trip: Trip; days: TripDay[] }
    },
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      destination_id: string
      start_date: string
      end_date: string
      budget?: number
    }) => {
      const res = await api.post("/trips", data)
      return res.data as { trip: Trip }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] })
    },
  })
}

export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      tripId,
      dayId,
      data,
    }: {
      tripId: string
      dayId: string
      data: {
        title: string
        attraction_id?: string
        start_time?: string
        end_time?: string
        notes?: string
        order_index: number
      }
    }) => {
      const res = await api.post(`/trips/${tripId}/days/${dayId}/activities`, data)
      return res.data as { activity: any }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trip", vars.tripId] })
    },
  })
}

export function useReorderActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      tripId,
      dayId,
      activityIds,
    }: {
      tripId: string
      dayId: string
      activityIds: string[]
    }) => {
      const res = await api.put(`/trips/${tripId}/days/${dayId}/activities/reorder`, { activityIds })
      return res.data as { activities: any[] }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trip", vars.tripId] })
    },
  })
}
