import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import { Destination, Category, Attraction, Hotel, PaginatedResponse } from "../types"

export function useDestinations(params?: {
  search?: string
  category?: string
  country?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ["destinations", params],
    queryFn: async () => {
      const res = await api.get("/destinations", { params })
      return res.data as { destinations: Destination[] } & PaginatedResponse<Destination>
    },
  })
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      const res = await api.get(`/destinations/${id}`)
      return res.data as { destination: Destination; categories: Category[] }
    },
    enabled: !!id,
  })
}

export function useAttractions(destinationId: string, params?: { category?: string; sort?: string }) {
  return useQuery({
    queryKey: ["attractions", destinationId, params],
    queryFn: async () => {
      const res = await api.get(`/destinations/${destinationId}/attractions`, { params })
      return res.data as { attractions: Attraction[] }
    },
    enabled: !!destinationId,
  })
}

export function useHotels(destinationId: string, params?: { sort?: string; min_rating?: number }) {
  return useQuery({
    queryKey: ["hotels", destinationId, params],
    queryFn: async () => {
      const res = await api.get(`/destinations/${destinationId}/hotels`, { params })
      return res.data as { hotels: Hotel[] }
    },
    enabled: !!destinationId,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories")
      return res.data as { categories: Category[] }
    },
  })
}
