import type { Tour } from "../entities/tour"
import type { TourRepository } from "../repositories/tour-repository"

export class GetToursUseCase {
  constructor(private tourRepository: TourRepository) {}

  async execute(): Promise<Tour[]> {
    return await this.tourRepository.findAll()
  }
}

export class GetTourByIdUseCase {
  constructor(private tourRepository: TourRepository) {}

  async execute(id: string): Promise<Tour | null> {
    return await this.tourRepository.findById(id)
  }
}

export class GetToursByCategoryUseCase {
  constructor(private tourRepository: TourRepository) {}

  async execute(category: string): Promise<Tour[]> {
    return await this.tourRepository.findByCategory(category)
  }
}
