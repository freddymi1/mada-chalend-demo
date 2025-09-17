import { Vehicle } from "@/src/domain/entities/car";

export const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Toyota Land Cruiser Prado",
    category: "4x4",
    type: "4x4 Premium",
    passengers: 7,
    pricePerDay: 120,
    rating: 4.9,
    mainImage:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "GPS Safari",
      "Climatisation",
      "Toit ouvrant",
      "Treuil électrique",
      "Pneus tout-terrain",
    ],
    description:
      "Parfait pour les safaris et excursions tout-terrain. Véhicule robuste et confortable pour 7 passagers.",
  },
  {
    id: 2,
    name: "Hyundai Starex",
    category: "minibus",
    type: "Minibus 12 places",
    passengers: 12,
    pricePerDay: 85,
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "12 places",
      "Climatisation",
      "Grand coffre",
      "Sièges inclinables",
      "USB ports",
    ],
    description:
      "Idéal pour les groupes de touristes. Confortable et spacieux avec grand espace bagages.",
  },
  {
    id: 3,
    name: "Toyota Hilux Double Cab",
    category: "pickup",
    type: "Pick-up 4x4",
    passengers: 5,
    pricePerDay: 95,
    rating: 4.7,
    mainImage:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: ["4x4", "Benne découverte", "5 places", "GPS", "Robuste terrain"],
    description:
      "Parfait pour l'aventure et le transport d'équipements. Véhicule robuste pour tous terrains.",
  },
  {
    id: 4,
    name: "Mitsubishi Pajero Sport",
    category: "4x4",
    type: "4x4 Familial",
    passengers: 7,
    pricePerDay: 110,
    rating: 4.8,
    mainImage:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "7 places",
      "Transmission intégrale",
      "Climatisation",
      "Caméra de recul",
      "Sièges cuir",
    ],
    description:
      "SUV confortable pour familles, alliant confort routier et capacités tout-terrain.",
  },
  {
    id: 5,
    name: "Toyota Coaster",
    category: "bus",
    type: "Minibus 25 places",
    passengers: 25,
    pricePerDay: 150,
    rating: 4.5,
    mainImage:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "25 places",
      "Climatisation puissante",
      "Microphone",
      "Soute bagages",
      "Confortable",
    ],
    description:
      "Idéal pour les grands groupes de touristes. Confort optimal pour les longs trajets.",
  },
  {
    id: 6,
    name: "Suzuki Jimny",
    category: "compact4x4",
    type: "4x4 Compact",
    passengers: 4,
    pricePerDay: 65,
    rating: 4.4,
    mainImage:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "4x4 authentique",
      "Compact",
      "Économique",
      "Facile à manœuvrer",
      "Style vintage",
    ],
    description:
      "Petit mais costaud ! Parfait pour les aventures en solo ou en couple sur tous terrains.",
  },
  {
    id: 7,
    name: "Ford Ranger Double Cab",
    category: "pickup",
    type: "Pick-up 4x4 Premium",
    passengers: 5,
    pricePerDay: 105,
    rating: 4.6,
    mainImage:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "4x4 moderne",
      "Écran tactile",
      "Caméra 360°",
      "Benne protégée",
      "Assistance conduite",
    ],
    description:
      "Pick-up moderne avec technologies avancées. Parfait pour travail et loisirs.",
  },
  {
    id: 8,
    name: "Hyundai H1",
    category: "minibus",
    type: "Van 8 places",
    passengers: 8,
    pricePerDay: 75,
    rating: 4.3,
    mainImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
    detailImages: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format",
    ],
    features: [
      "8 places",
      "Modulable",
      "Climatisation",
      "Portes coulissantes",
      "Économique",
    ],
    description:
      "Van polyvalent pour familles ou petits groupes. Confortable et économique.",
  },
];
