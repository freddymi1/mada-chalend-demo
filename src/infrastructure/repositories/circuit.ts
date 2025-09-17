export const circuitsData = {
  "tana-andasibe-palmarium": {
    title: "Circuit Tana – Andasibe – Palmarium",
    duration: "5 jours / 4 nuits",
    price: "€850",
    maxPeople: 8,
    difficulty: "Facile",
    description:
      "Découverte des parcs naturels, observation des lémuriens, et nuitée au Palmarium. Un voyage inoubliable au cœur de la biodiversité malgache.",
    highlights: ["Parcs naturels", "Observation des lémuriens", "Palmarium", "Forêt primaire", "Biodiversité unique"],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Antananarivo",
        description: "Accueil à l'aéroport et transfert à l'hôtel. Visite de la ville haute.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=Antananarivo city high town Madagascar",
        imageDescription: "Vue panoramique sur la ville haute d'Antananarivo avec ses maisons traditionnelles colorées"
      },
      {
        day: 2,
        title: "Route vers Andasibe",
        description: "Départ matinal vers Andasibe. Installation et première visite du parc.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=misty morning forest Andasibe Madagascar",
        imageDescription: "Forêt matinale brumeuse d'Andasibe, habitat naturel des lémuriens Indri-Indri"
      },
      {
        day: 3,
        title: "Parc National d'Andasibe",
        description: "Journée complète d'observation des lémuriens Indri-Indri.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Indri lemur close up Madagascar wildlife",
        imageDescription: "Lémurien Indri-Indri dans son habitat naturel, le plus grand lémurien de Madagascar"
      },
      {
        day: 4,
        title: "Palmarium",
        description: "Transfert vers Palmarium. Nuitée dans un cadre exceptionnel.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=Palmarium lodge lakeside Madagascar",
        imageDescription: "Lodge du Palmarium au bord du lac, refuge paisible au cœur de la nature"
      },
      {
        day: 5,
        title: "Retour Antananarivo",
        description: "Matinée libre au Palmarium puis retour vers la capitale.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=exotic orchid flowers Andasibe Madagascar",
        imageDescription: "Orchidées exotiques endémiques de Madagascar dans la région d'Andasibe"
      }
    ],
    included: [
      "Transport en véhicule 4x4",
      "Hébergement en pension complète",
      "Guide francophone",
      "Entrées des parcs",
      "Activités mentionnées",
    ],
    notIncluded: ["Vols internationaux", "Boissons alcoolisées", "Pourboires", "Assurance voyage"],
  },
  "descente-tsiribihina": {
    title: "Descente de la Tsiribihina",
    duration: "3-4 jours",
    price: "€650",
    maxPeople: 12,
    difficulty: "Modéré",
    description:
      "Une aventure en bateau au cœur de paysages spectaculaires et de villages authentiques. Découvrez Madagascar au fil de l'eau.",
    highlights: [
      "Aventure en bateau",
      "Paysages spectaculaires",
      "Villages authentiques",
      "Camping sous les étoiles",
      "Faune aquatique",
    ],
    itinerary: [
      {
        day: 1,
        title: "Départ Miandrivazo",
        description: "Embarquement et début de la descente. Premier campement.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=boat adventure Tsiribihina river Madagascar",
        imageDescription: "Embarquement sur la rivière Tsiribihina avec l'équipage local pour l'aventure fluviale"
      },
      {
        day: 2,
        title: "Navigation et villages",
        description: "Visite de villages traditionnels. Nuit en camping.",
        image: "/madagascar-baobab-tree-legend-ancient.jpg?height=600&width=800&query=authentic village along Tsiribihina river Madagascar",
        imageDescription: "Village traditionnel sakalava au bord de la Tsiribihina, mode de vie authentique"
      },
      {
        day: 3,
        title: "Paysages sauvages",
        description: "Observation de la faune. Dernière nuit au bord de l'eau.",
        image: "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=camping by riverside Tsiribihina Madagascar",
        imageDescription: "Campement nocturne au bord de la Tsiribihina sous un ciel étoilé exceptionnel"
      },
      {
        day: 4,
        title: "Arrivée Belo-sur-Tsiribihina",
        description: "Fin de la descente et transfert vers Morondava.",
        image: "/madagascar-limestone-pinnacles.jpg?height=600&width=800&query=sunset over Tsiribihina river Madagascar",
        imageDescription: "Coucher de soleil spectaculaire sur la rivière Tsiribihina en fin de parcours"
      }
    ],
    included: ["Bateau et équipage", "Matériel de camping", "Repas pendant la descente", "Guide local", "Transferts"],
    notIncluded: ["Transport vers Miandrivazo", "Hébergement avant/après", "Boissons", "Équipement personnel"],
  },
  "sud-madagascar": {
    title: "Sud de Madagascar : Ifaty – Tulear – Ambatomilo",
    duration: "7 jours",
    price: "€1200",
    maxPeople: 10,
    difficulty: "Facile",
    description:
      "Plages paradisiaques, immersion dans la culture locale et découverte des marchés traditionnels. Le sud authentique de Madagascar.",
    highlights: [
      "Plages paradisiaques",
      "Culture locale",
      "Marchés traditionnels",
      "Forêt épineuse",
      "Villages de pêcheurs",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée Tulear",
        description: "Accueil et installation. Visite du marché local.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=Tulear market Madagascar local culture",
        imageDescription: "Marché coloré de Tuléar avec ses épices, artisanat et produits locaux typiques du sud"
      },
      {
        day: 2,
        title: "Route vers Ifaty",
        description: "Installation en bord de mer. Détente sur la plage.",
        image: "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=Ifaty beach paradise Madagascar",
        imageDescription: "Plage paradisiaque d'Ifaty avec ses eaux turquoise et cocotiers, parfaite pour la détente"
      },
      {
        day: 3,
        title: "Forêt épineuse",
        description: "Découverte de la forêt épineuse unique au monde.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=spiny forest Madagascar endemic plants",
        imageDescription: "Forêt épineuse endémique du sud avec ses plantes succulentes et baobabs bottle"
      },
      {
        day: 4,
        title: "Village d'Ambatomilo",
        description: "Immersion dans un village de pêcheurs traditionnel.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=fishing village Ambatomilo Madagascar",
        imageDescription: "Village de pêcheurs vezo d'Ambatomilo avec ses pirogues traditionnelles sur la plage"
      },
      {
        day: 5,
        title: "Plages et détente",
        description: "Journée libre sur les plus belles plages.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=family relaxing beach Madagascar",
        imageDescription: "Famille profitant des magnifiques plages de sable blanc du sud de Madagascar"
      },
      {
        day: 6,
        title: "Artisanat local",
        description: "Rencontre avec les artisans locaux. Shopping.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=local crafts artisans Madagascar south",
        imageDescription: "Artisans locaux travaillant le bois, les fibres et créant l'artisanat traditionnel du sud"
      },
      {
        day: 7,
        title: "Retour Tulear",
        description: "Derniers achats et transfert aéroport.",
        image: "/madagascar-baobab-tree-legend-ancient.jpg?height=600&width=800&query=departure airport Tulear Madagascar",
        imageDescription: "Derniers moments à Tuléar avant le départ, souvenirs d'un voyage inoubliable dans le sud"
      }
    ],
    included: [
      "Hébergement bord de mer",
      "Tous les repas",
      "Transport 4x4",
      "Guide francophone",
      "Activités culturelles",
    ],
    notIncluded: ["Vols", "Boissons alcoolisées", "Activités nautiques optionnelles", "Souvenirs"],
  },
  "morondava-baobabs": {
    title: "Morondava et Allée des Baobabs",
    duration: "4-5 jours",
    price: "€750",
    maxPeople: 8,
    difficulty: "Facile",
    description:
      "Exploration des baobabs, mangroves et villages côtiers. Découvrez les géants de Madagascar dans leur environnement naturel.",
    highlights: ["Allée des Baobabs", "Mangroves", "Villages côtiers", "Couchers de soleil", "Écosystème unique"],
    itinerary: [
      {
        day: 1,
        title: "Arrivée Morondava",
        description: "Installation et première découverte de la ville côtière.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=Morondava coastal town Madagascar arrival",
        imageDescription: "Arrivée à Morondava, ville côtière animée, porte d'entrée vers l'allée des baobabs"
      },
      {
        day: 2,
        title: "Allée des Baobabs",
        description: "Journée complète avec les géants. Coucher de soleil magique.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Avenue of Baobabs sunset Madagascar iconic",
        imageDescription: "Coucher de soleil légendaire sur l'Allée des Baobabs, moment magique et emblématique"
      },
      {
        day: 3,
        title: "Baobabs amoureux",
        description: "Visite des baobabs enlacés et exploration des mangroves.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=baobabs in love intertwined Madagascar",
        imageDescription: "Les baobabs amoureux, arbres millénaires enlacés symbole d'amour éternel"
      },
      {
        day: 4,
        title: "Villages côtiers",
        description: "Rencontre avec les communautés locales de pêcheurs.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=coastal fishing village Madagascar Morondava",
        imageDescription: "Village de pêcheurs sakalava près de Morondava, mode de vie traditionnel préservé"
      },
      {
        day: 5,
        title: "Dernière matinée",
        description: "Temps libre et transfert vers l'aéroport.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=mangroves ecosystem Madagascar Morondava",
        imageDescription: "Écosystème unique des mangroves près de Morondava, biodiversité exceptionnelle"
      }
    ],
    included: ["Hébergement confortable", "Repas locaux", "Transport local", "Guide spécialisé", "Entrées sites"],
    notIncluded: ["Vol vers Morondava", "Boissons", "Pourboires guide", "Activités optionnelles"],
  },
}