import type { Booking, CustomerInfo } from "../entities/tour"
import type { BookingRepository, TourRepository } from "../repositories/tour-repository"

export interface CreateBookingRequest {
  tourId: string
  customerInfo: CustomerInfo
  selectedDate: Date
  numberOfPeople: number
  specialRequests?: string
}

export class CreateBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private tourRepository: TourRepository,
  ) {}

  async execute(request: CreateBookingRequest): Promise<Booking> {
    const tour = await this.tourRepository.findById(request.tourId)
    if (!tour) {
      throw new Error("Tour not found")
    }

    const totalPrice = tour.price * request.numberOfPeople

    const booking = await this.bookingRepository.create({
      tourId: request.tourId,
      customerInfo: request.customerInfo,
      selectedDate: request.selectedDate,
      numberOfPeople: request.numberOfPeople,
      totalPrice,
      status: "pending",
      specialRequests: request.specialRequests,
    })

    return booking
  }
}
