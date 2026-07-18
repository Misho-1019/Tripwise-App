export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
}

export interface Destination {
  id: string
  name: string
  country: string
  description?: string
  image_url?: string
  best_time_to_visit?: string
  currency?: string
  language?: string
  lat?: number
  lng?: number
  rating?: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon?: string
}

export interface Attraction {
  id: string
  destination_id: string
  name: string
  description?: string
  image_url?: string
  lat?: number
  lng?: number
  price?: number
  duration?: string
  rating?: number
  category?: string
}

export interface Hotel {
  id: string
  destination_id: string
  name: string
  description?: string
  image_url?: string
  price_per_night?: number
  rating?: number
  lat?: number
  lng?: number
  amenities?: string[]
}

export interface Trip {
  id: string
  user_id: string
  destination_id: string
  name: string
  start_date: string
  end_date: string
  budget?: number
  status: "planning" | "ongoing" | "completed"
  is_public: boolean
  created_at: string
  destination_name?: string
  destination_image?: string
}

export interface TripDay {
  id: string
  trip_id: string
  date: string
  day_number: number
  notes?: string
  activities: TripActivity[]
}

export interface TripActivity {
  id: string
  trip_day_id: string
  attraction_id?: string
  title: string
  start_time?: string
  end_time?: string
  notes?: string
  order_index: number
  cost?: number
  attraction_name?: string
  attraction_image?: string
  lat?: number
  lng?: number
  attraction_duration?: string
}

export interface Review {
  id: string
  user_id: string
  destination_id: string
  rating: number
  comment?: string
  created_at: string
  user_name?: string
  user_avatar?: string
}

export interface AiTripPlan {
  days: {
    day_number: number
    title: string
    activities: {
      title: string
      description: string
      estimated_cost: number
      duration: string
      category: string
    }[]
    meal_suggestions: {
      breakfast: string
      lunch: string
      dinner: string
    }
  }[]
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  totalPages: number
}
