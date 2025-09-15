import { GetToursUseCase, GetTourByIdUseCase, GetToursByCategoryUseCase } from "../../domain/use-cases/get-tours"
import { CreateBookingUseCase, type CreateBookingRequest } from "../../domain/use-cases/create-booking"
import { MockTourRepository, MockBookingRepository } from "../../infrastructure/repositories/mock-tour-repository"

// Dependency injection container (simplified)
const tourRepository = new MockTourRepository()
const bookingRepository = new MockBookingRepository()

export class TourService {
  private getToursUseCase = new GetToursUseCase(tourRepository)
  private getTourByIdUseCase = new GetTourByIdUseCase(tourRepository)
  private getToursByCategoryUseCase = new GetToursByCategoryUseCase(tourRepository)
  private createBookingUseCase = new CreateBookingUseCase(bookingRepository, tourRepository)

  async getAllTours() {
    return await this.getToursUseCase.execute()
  }

  async getTourById(id: string) {
    return await this.getTourByIdUseCase.execute(id)
  }

  async getToursByCategory(category: string) {
    return await this.getToursByCategoryUseCase.execute(category)
  }

  async createBooking(request: CreateBookingRequest) {
    return await this.createBookingUseCase.execute(request)
  }
}

// Singleton instance
export const tourService = new TourService()
