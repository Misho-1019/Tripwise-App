import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"
import { Review } from "../types"

export function useReviews(destinationId: string, page = 1) {
  return useQuery({
    queryKey: ["reviews", destinationId, page],
    queryFn: async () => {
      const res = await api.get(`/reviews/${destinationId}`, { params: { page } })
      return res.data as { reviews: Review[]; averageRating: number; total: number }
    },
    enabled: !!destinationId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      destinationId,
      data,
    }: {
      destinationId: string
      data: { rating: number; comment: string }
    }) => {
      const res = await api.post(`/reviews/${destinationId}`, data)
      return res.data as { review: Review }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.destinationId] })
    },
  })
}
