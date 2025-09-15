import type { Tour, Booking, BookingStatus } from "../../domain/entities/tour"
import type { TourRepository, BookingRepository } from "../../domain/repositories/tour-repository"

export class MockTourRepository implements TourRepository {
  private tours: Tour[] = [
    {
      id: "1",
      title: "Circuit des Hautes Terres",
      description: "Découvrez les paysages spectaculaires des hautes terres malgaches",
      duration: 7,
      price: 1200,
      images: ["/madagascar-highlands-landscape.jpg", "/madagascar-rice-terraces.jpg", "/madagascar-traditional-village.jpg"],
      highlights: ["Parc national d'Andasibe", "Lac Tritriva", "Artisanat local"],
      included: ["Hébergement", "Transport", "Guide francophone", "Repas"],
      excluded: ["Vols internationaux", "Assurance voyage", "Boissons alcoolisées"],
      itinerary: [
        {
          day: 1,
          title: "Arrivée à Antananarivo",
          description: "Accueil à l'aéroport et transfert à l'hôtel",
          activities: ["Transfert aéroport", "Installation à l'hôtel"],
          accommodation: "Hôtel Colbert",
          meals: ["Dîner"],
        },
      ],
      difficulty: "moderate",
      maxGroupSize: 12,
      availableDates: [new Date("2024-06-15"), new Date("2024-07-20")],
      category: "cultural",
    },
    {
      id: "2",
      title: "Aventure dans le Tsingy",
      description: "Explorez les formations rocheuses uniques du Tsingy de Bemaraha",
      duration: 10,
      price: 1800,
      images: ["/madagascar-tsingy-rock-formations.jpg", "/madagascar-limestone-pinnacles.jpg", "/madagascar-adventure-climbing.jpg"],
      highlights: ["Tsingy de Bemaraha", "Baobabs sacrés", "Faune endémique"],
      included: ["Hébergement", "Transport 4x4", "Guide spécialisé", "Équipement"],
      excluded: ["Vols internationaux", "Assurance voyage", "Équipement personnel"],
      itinerary: [],
      difficulty: "challenging",
      maxGroupSize: 8,
      availableDates: [new Date("2024-08-10"), new Date("2024-09-15")],
      category: "adventure",
    },
  ]

  async findAll(): Promise<Tour[]> {
    return this.tours
  }

  async findById(id: string): Promise<Tour | null> {
    return this.tours.find((tour) => tour.id === id) || null
  }

  async findByCategory(category: string): Promise<Tour[]> {
    return this.tours.filter((tour) => tour.category === category)
  }

  async create(tour: Omit<Tour, "id">): Promise<Tour> {
    const newTour = { ...tour, id: Date.now().toString() }
    this.tours.push(newTour)
    return newTour
  }

  async update(id: string, tour: Partial<Tour>): Promise<Tour> {
    const index = this.tours.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Tour not found")
    this.tours[index] = { ...this.tours[index], ...tour }
    return this.tours[index]
  }

  async delete(id: string): Promise<void> {
    this.tours = this.tours.filter((tour) => tour.id !== id)
  }
}

export class MockBookingRepository implements BookingRepository {
  private bookings: Booking[] = []

  async create(booking: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.bookings.push(newBooking)
    return newBooking
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.id === id) || null
  }

  async findByEmail(email: string): Promise<Booking[]> {
    return this.bookings.filter((booking) => booking.customerInfo.email === email)
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = this.bookings.find((b) => b.id === id)
    if (!booking) throw new Error("Booking not found")
    booking.status = status
    return booking
  }
}
