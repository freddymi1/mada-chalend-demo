import type { Tour, Booking, BookingStatus } from "../entities/tour"

export interface TourRepository {
  findAll(): Promise<Tour[]>
  findById(id: string): Promise<Tour | null>
  findByCategory(category: string): Promise<Tour[]>
  create(tour: Omit<Tour, "id">): Promise<Tour>
  update(id: string, tour: Partial<Tour>): Promise<Tour>
  delete(id: string): Promise<void>
}

export interface BookingRepository {
  create(booking: Omit<Booking, "id" | "createdAt">): Promise<Booking>
  findById(id: string): Promise<Booking | null>
  findByEmail(email: string): Promise<Booking[]>
  updateStatus(id: string, status: BookingStatus): Promise<Booking>
}
