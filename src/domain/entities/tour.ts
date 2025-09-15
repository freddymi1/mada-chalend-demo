export interface Tour {
  id: string
  title: string
  description: string
  duration: number
  price: number
  images: string[]
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: ItineraryDay[]
  difficulty: "easy" | "moderate" | "challenging"
  maxGroupSize: number
  availableDates: Date[]
  category: TourCategory
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation?: string
  meals: string[]
}

export type TourCategory = "adventure" | "cultural" | "wildlife" | "beach" | "trekking" | "luxury"

export interface Booking {
  id: string
  tourId: string
  customerInfo: CustomerInfo
  selectedDate: Date
  numberOfPeople: number
  totalPrice: number
  status: BookingStatus
  createdAt: Date
  specialRequests?: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  dateOfBirth: Date
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"
