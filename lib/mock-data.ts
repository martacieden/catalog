/**
 * Mock Data - Catalog Items for Luxury Management System
 * Based on Oil Nut Bay resort style - premium properties and assets
 * Single source of truth for all catalog data
 */

/**
 * Catalog Items Data Interface
 */
export interface CatalogItem {
  id: string
  name: string
  type: string
  category: string
  idCode: string
  status: string
  location: string
  value: number
  currency: string
  tags: string[]
  guestRating?: number
  lastUpdated: string
  createdAt: Date
  people?: Array<{
    id: string
    role: string
    name: string
  }>
  // Compatibility fields for UI components
  createdOn?: string
  lastUpdate?: string
  date?: string
  createdBy?: {
    name: string
    avatar: string
  }
  sharedWith?: Array<{
    name: string
    avatar: string
  }>
  pinned?: boolean
}

/**
 * Main Catalog Items Array
 */
export const catalogItems: CatalogItem[] = [
  // Properties (Real Estate)
  {
    id: "PROP-001",
    name: "Beachfront Villa Alpha",
    type: "property",
    category: "Properties",
    idCode: "PROP-001",
    status: "Available",
    location: "Malibu, CA",
    value: 2500000,
    currency: "USD",
    tags: ["luxury", "beachfront", "villa", "california"],
    guestRating: 4.9,
    lastUpdated: "2024-12-01",
    createdAt: new Date("2024-12-01"),
    createdOn: "2024-12-01",
    lastUpdate: "2024-12-01T14:30:00Z",
    createdBy: {
      name: "James Mitchell",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-1", role: "Owner", name: "James Mitchell" },
      { id: "manager-1", role: "Property Manager", name: "Sarah Chen" }
    ]
  },
  {
    id: "PROP-002",
    name: "Corporate Headquarters",
    type: "property",
    category: "Properties",
    idCode: "PROP-002",
    status: "Available",
    location: "New York, NY",
    value: 12000000,
    currency: "USD",
    tags: ["commercial", "office", "corporate", "manhattan"],
    lastUpdated: "2024-12-22",
    createdAt: new Date("2024-12-22"),
    createdOn: "2024-12-22",
    lastUpdate: "2024-12-22T09:15:00Z",
    createdBy: {
      name: "Global Corp Inc.",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-2", role: "Owner", name: "Global Corp Inc." },
      { id: "manager-2", role: "Facility Manager", name: "Michael Brown" },
      { id: "tenant-1", role: "Tenant", name: "Tech Solutions Ltd." }
    ]
  },
  {
    id: "PROP-003",
    name: "Mountain Resort Estate",
    type: "property",
    category: "Properties",
    idCode: "PROP-003",
    status: "Available",
    location: "Aspen, CO",
    value: 18000000,
    currency: "USD",
    tags: ["luxury", "resort", "mountain", "ski"],
    guestRating: 4.8,
    lastUpdated: "2025-01-12",
    createdAt: new Date("2025-01-12"),
    people: [
      { id: "owner-3", role: "Owner", name: "Alpine Holdings LLC" },
      { id: "manager-3", role: "Resort Manager", name: "Hans Weber" }
    ]
  },
  {
    id: "PROP-004",
    name: "Private Island Villa",
    type: "property",
    category: "Properties",
    idCode: "PROP-004",
    status: "Available",
    location: "Caribbean",
    value: 35000000,
    currency: "USD",
    tags: ["ultra-luxury", "private-island", "exclusive", "caribbean"],
    guestRating: 5.0,
    lastUpdated: "2025-01-15",
    createdAt: new Date("2025-01-15"),
    createdOn: "2025-01-15",
    lastUpdate: "2025-01-15T16:45:00Z",
    createdBy: {
      name: "Elite Estates Trust",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-4", role: "Owner", name: "Elite Estates Trust" },
      { id: "manager-4", role: "Island Manager", name: "Roberto Silva" }
    ]
  },
  {
    id: "PROP-005",
    name: "Penthouse Sky Tower",
    type: "property",
    category: "Properties",
    idCode: "PROP-005",
    status: "Maintenance",
    location: "Dubai, UAE",
    value: 8500000,
    currency: "USD",
    tags: ["penthouse", "luxury", "downtown", "high-rise"],
    lastUpdated: "2025-01-20",
    createdAt: new Date("2025-01-20"),
    createdOn: "2025-01-20",
    lastUpdate: "2025-01-20T10:20:00Z",
    createdBy: {
      name: "Ahmed Al-Rashid",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-5", role: "Owner", name: "Ahmed Al-Rashid" }
    ]
  },
  {
    id: "PROP-006",
    name: "Wine Country Estate",
    type: "property",
    category: "Properties",
    idCode: "PROP-006",
    status: "Available",
    location: "Napa Valley, CA",
    value: 6700000,
    currency: "USD",
    tags: ["vineyard", "estate", "wine-country", "luxury"],
    guestRating: 4.7,
    lastUpdated: "2025-01-22",
    createdAt: new Date("2025-01-22"),
    createdOn: "2025-01-22",
    lastUpdate: "2025-01-22T12:30:00Z",
    createdBy: {
      name: "Vintage Vineyards LLC",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-6", role: "Owner", name: "Vintage Vineyards LLC" }
    ]
  },
  {
    id: "PROP-007",
    name: "Beach Club Resort",
    type: "property",
    category: "Properties",
    idCode: "PROP-007",
    status: "Available",
    location: "Turks and Caicos",
    value: 28000000,
    currency: "USD",
    tags: ["resort", "beach-club", "caribbean", "luxury"],
    guestRating: 4.8,
    lastUpdated: "2025-01-24",
    createdAt: new Date("2025-01-24"),
    createdOn: "2025-01-24",
    lastUpdate: "2025-01-24T14:15:00Z",
    createdBy: {
      name: "Caribbean Resorts Group",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-18", role: "Owner", name: "Caribbean Resorts Group" }
    ]
  },
  {
    id: "PROP-008",
    name: "Golf Course Estate",
    type: "property",
    category: "Properties",
    idCode: "PROP-008",
    status: "Available",
    location: "Palm Beach, FL",
    value: 15000000,
    currency: "USD",
    tags: ["golf", "estate", "luxury", "florida"],
    lastUpdated: "2025-01-26",
    createdAt: new Date("2025-01-26"),
    createdOn: "2025-01-26",
    lastUpdate: "2025-01-26T16:45:00Z",
    createdBy: {
      name: "Golf Properties LLC",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-19", role: "Owner", name: "Golf Properties LLC" }
    ]
  },
  {
    id: "PROP-009",
    name: "Ski Chalet Luxury",
    type: "property",
    category: "Properties",
    idCode: "PROP-009",
    status: "Seasonal",
    location: "St. Moritz, Switzerland",
    value: 22000000,
    currency: "CHF",
    tags: ["chalet", "ski", "luxury", "swiss-alps"],
    guestRating: 5.0,
    lastUpdated: "2025-01-27",
    createdAt: new Date("2025-01-27"),
    people: [
      { id: "owner-20", role: "Owner", name: "Alpine Luxury Chalets" }
    ]
  },
  {
    id: "PROP-010",
    name: "Rooftop Terrace Paris",
    type: "property",
    category: "Properties",
    idCode: "PROP-010",
    status: "Available",
    location: "Paris, France",
    value: 9500000,
    currency: "EUR",
    tags: ["penthouse", "paris", "luxury", "city-view"],
    guestRating: 4.9,
    lastUpdated: "2025-02-04",
    createdAt: new Date("2025-02-04"),
    people: [
      { id: "owner-25", role: "Owner", name: "Parisian Properties SARL" }
    ]
  },
  {
    id: "PROP-011",
    name: "Safari Lodge Estate",
    type: "property",
    category: "Properties",
    idCode: "PROP-011",
    status: "Available",
    location: "Kenya, Africa",
    value: 4500000,
    currency: "USD",
    tags: ["safari", "lodge", "wildlife", "luxury"],
    guestRating: 5.0,
    lastUpdated: "2025-02-05",
    createdAt: new Date("2025-02-05"),
    createdOn: "2025-02-05",
    lastUpdate: "2025-02-05T09:00:00Z",
    createdBy: {
      name: "African Safari Holdings",
      avatar: "/placeholder-user.jpg"
    },
    people: [
      { id: "owner-26", role: "Owner", name: "African Safari Holdings" },
      { id: "manager-6", role: "Lodge Manager", name: "Joseph Kimani" }
    ]
  },
  {
    id: "PROP-012",
    name: "Historic Castle Estate",
    type: "property",
    category: "Properties",
    idCode: "PROP-012",
    status: "Restoration",
    location: "Scotland, UK",
    value: 18000000,
    currency: "GBP",
    tags: ["castle", "historic", "estate", "scotland"],
    lastUpdated: "2025-02-06",
    createdAt: new Date("2025-02-06"),
    people: [
      { id: "owner-27", role: "Owner", name: "Heritage Estates UK" }
    ]
  },

  // Aviation Assets
  {
    id: "AVI-001",
    name: "Private Jet Gulfstream",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-001",
    status: "Available",
    location: "Miami International",
    value: 15000000,
    currency: "USD",
    tags: ["private-jet", "gulfstream", "luxury-travel"],
    lastUpdated: "2024-12-08",
    createdAt: new Date("2024-12-08"),
    people: [
      { id: "owner-7", role: "Owner", name: "Sky Elite Charter" },
      { id: "pilot-1", role: "Captain", name: "John Stevens" }
    ]
  },
  {
    id: "AVI-002",
    name: "Helicopter Bell 429",
    type: "helicopter",
    category: "Aviation",
    idCode: "AVI-002",
    status: "Available",
    location: "Los Angeles",
    value: 5500000,
    currency: "USD",
    tags: ["helicopter", "bell", "corporate", "vip"],
    lastUpdated: "2025-01-03",
    createdAt: new Date("2025-01-03"),
    people: [
      { id: "owner-8", role: "Owner", name: "Heli Tours Inc." }
    ]
  },
  {
    id: "AVI-003",
    name: "Business Jet Citation X",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-003",
    status: "Available",
    location: "Dallas, TX",
    value: 22000000,
    currency: "USD",
    tags: ["business-jet", "citation", "fast", "long-range"],
    lastUpdated: "2025-01-18",
    createdAt: new Date("2025-01-18"),
    people: [
      { id: "owner-9", role: "Owner", name: "Corporate Jets LLC" },
      { id: "pilot-2", role: "Captain", name: "Maria Rodriguez" }
    ]
  },
  {
    id: "AVI-004",
    name: "Airbus ACJ320neo",
    type: "aircraft",
    category: "Aviation",
    idCode: "AVI-004",
    status: "Available",
    location: "Geneva Airport",
    value: 110000000,
    currency: "USD",
    tags: ["airbus", "vip", "long-range", "corporate-jet"],
    lastUpdated: "2025-01-28",
    createdAt: new Date("2025-01-28"),
    people: [
      { id: "owner-21", role: "Owner", name: "Global Air Charter" }
    ]
  },

  // Maritime Vessels
  {
    id: "MAR-001",
    name: "Luxury Yacht Serenity",
    type: "yacht",
    category: "Maritime",
    idCode: "MAR-001",
    status: "Available",
    location: "Monaco",
    value: 8000000,
    currency: "USD",
    tags: ["yacht", "luxury", "mediterranean", "charter"],
    guestRating: 4.9,
    lastUpdated: "2024-12-15",
    createdAt: new Date("2024-12-15"),
    people: [
      { id: "owner-10", role: "Owner", name: "Mediterranean Yachts" }
    ]
  },
  {
    id: "MAR-002",
    name: "Superyacht Ocean Dream",
    type: "superyacht",
    category: "Maritime",
    idCode: "MAR-002",
    status: "Available",
    location: "Fort Lauderdale",
    value: 25000000,
    currency: "USD",
    tags: ["superyacht", "ocean", "luxury", "charter"],
    lastUpdated: "2025-01-08",
    createdAt: new Date("2025-01-08"),
    people: [
      { id: "owner-11", role: "Owner", name: "Dream Yachts International" },
      { id: "captain-1", role: "Captain", name: "Captain Anderson" }
    ]
  },
  {
    id: "MAR-003",
    name: "Luxury Catamaran",
    type: "catamaran",
    category: "Maritime",
    idCode: "MAR-003",
    status: "Available",
    location: "Saint-Tropez",
    value: 12000000,
    currency: "USD",
    tags: ["catamaran", "sailing", "luxury", "french-riviera"],
    lastUpdated: "2025-01-20",
    createdAt: new Date("2025-01-20"),
    people: [
      { id: "owner-12", role: "Owner", name: "Riviera Sailing Co." }
    ]
  },
  {
    id: "MAR-004",
    name: "Explorer Yacht Discovery",
    type: "explorer-yacht",
    category: "Maritime",
    idCode: "MAR-004",
    status: "Available",
    location: "Auckland, NZ",
    value: 45000000,
    currency: "USD",
    tags: ["explorer", "yacht", "adventure", "luxury"],
    lastUpdated: "2025-01-29",
    createdAt: new Date("2025-01-29"),
    people: [
      { id: "owner-22", role: "Owner", name: "Adventure Yachts Ltd" }
    ]
  },

  // Vehicles
  {
    id: "VEH-001",
    name: "Rolls-Royce Phantom",
    type: "car",
    category: "Vehicles",
    idCode: "VEH-001",
    status: "Available",
    location: "Beverly Hills",
    value: 550000,
    currency: "USD",
    tags: ["luxury-car", "rolls-royce", "premium", "chauffeur"],
    lastUpdated: "2024-12-10",
    createdAt: new Date("2024-12-10"),
    people: [
      { id: "owner-13", role: "Owner", name: "Elite Motors" }
    ]
  },
  {
    id: "VEH-002",
    name: "Ferrari SF90 Stradale",
    type: "car",
    category: "Vehicles",
    idCode: "VEH-002",
    status: "Available",
    location: "Miami",
    value: 750000,
    currency: "USD",
    tags: ["supercar", "ferrari", "sports", "italian"],
    lastUpdated: "2025-01-05",
    createdAt: new Date("2025-01-05"),
    people: [
      { id: "owner-14", role: "Owner", name: "Exotic Cars Miami" }
    ]
  },
  {
    id: "VEH-003",
    name: "Lamborghini Urus",
    type: "suv",
    category: "Vehicles",
    idCode: "VEH-003",
    status: "Maintenance",
    location: "Las Vegas",
    value: 400000,
    currency: "USD",
    tags: ["luxury-suv", "lamborghini", "sport", "italian"],
    lastUpdated: "2025-01-14",
    createdAt: new Date("2025-01-14"),
    people: [
      { id: "owner-15", role: "Owner", name: "Vegas Luxury Rentals" }
    ]
  },
  {
    id: "VEH-004",
    name: "Bentley Continental GT",
    type: "car",
    category: "Vehicles",
    idCode: "VEH-004",
    status: "Available",
    location: "London, UK",
    value: 350000,
    currency: "GBP",
    tags: ["luxury-car", "bentley", "british", "grand-tourer"],
    lastUpdated: "2025-01-30",
    createdAt: new Date("2025-01-30"),
    people: [
      { id: "owner-23", role: "Owner", name: "British Luxury Motors" }
    ]
  },
  {
    id: "VEH-005",
    name: "Mercedes G-Class AMG",
    type: "suv",
    category: "Vehicles",
    idCode: "VEH-005",
    status: "Available",
    location: "Munich, Germany",
    value: 250000,
    currency: "EUR",
    tags: ["luxury-suv", "mercedes", "amg", "off-road"],
    lastUpdated: "2025-01-31",
    createdAt: new Date("2025-01-31"),
    people: [
      { id: "owner-24", role: "Owner", name: "German Auto Excellence" }
    ]
  },

  // Legal Entities
  {
    id: "LEG-001",
    name: "Oil Nut Bay Holdings",
    type: "holding-company",
    category: "Legal entities",
    idCode: "LEG-001",
    status: "Active",
    location: "British Virgin Islands",
    value: 250000000,
    currency: "USD",
    tags: ["holding", "resort", "bvi", "hospitality"],
    lastUpdated: "2024-11-15",
    createdAt: new Date("2024-11-15"),
    people: [
      { id: "director-1", role: "Director", name: "David V. Johnson" },
      { id: "cfo-1", role: "CFO", name: "Linda Martinez" }
    ]
  },
  {
    id: "LEG-002",
    name: "Luxury Resorts International",
    type: "corporation",
    category: "Legal entities",
    idCode: "LEG-002",
    status: "Active",
    location: "Cayman Islands",
    value: 180000000,
    currency: "USD",
    tags: ["corporation", "resorts", "international", "hospitality"],
    lastUpdated: "2025-01-10",
    createdAt: new Date("2025-01-10"),
    people: [
      { id: "ceo-1", role: "CEO", name: "Richard Thompson" }
    ]
  },
  {
    id: "LEG-003",
    name: "Estate Management Trust",
    type: "trust",
    category: "Legal entities",
    idCode: "LEG-003",
    status: "Active",
    location: "Switzerland",
    value: 95000000,
    currency: "USD",
    tags: ["trust", "estate", "wealth-management", "swiss"],
    lastUpdated: "2025-01-19",
    createdAt: new Date("2025-01-19"),
    people: [
      { id: "trustee-1", role: "Trustee", name: "Swiss Trust Bank" }
    ]
  },
  {
    id: "LEG-004",
    name: "Aviation Holdings Trust",
    type: "trust",
    category: "Legal entities",
    idCode: "LEG-004",
    status: "Active",
    location: "Delaware, USA",
    value: 85000000,
    currency: "USD",
    tags: ["trust", "aviation", "holdings", "delaware"],
    lastUpdated: "2025-02-01",
    createdAt: new Date("2025-02-01"),
    people: [
      { id: "trustee-2", role: "Trustee", name: "Delaware Trust Company" }
    ]
  },

  // Organizations
  {
    id: "ORG-001",
    name: "Elite Golf Club",
    type: "private-club",
    category: "Organizations",
    idCode: "ORG-001",
    status: "Active",
    location: "Scottsdale, AZ",
    value: 45000000,
    currency: "USD",
    tags: ["golf", "private-club", "exclusive", "members-only"],
    lastUpdated: "2024-12-20",
    createdAt: new Date("2024-12-20"),
    people: [
      { id: "president-1", role: "President", name: "Thomas Palmer" }
    ]
  },
  {
    id: "ORG-002",
    name: "Yacht Club Marina Bay",
    type: "yacht-club",
    category: "Organizations",
    idCode: "ORG-002",
    status: "Active",
    location: "San Francisco",
    value: 32000000,
    currency: "USD",
    tags: ["yacht-club", "marina", "exclusive", "waterfront"],
    lastUpdated: "2025-01-16",
    createdAt: new Date("2025-01-16"),
    people: [
      { id: "commodore-1", role: "Commodore", name: "Admiral Blake" }
    ]
  },
  {
    id: "ORG-003",
    name: "Private Art Gallery",
    type: "gallery",
    category: "Organizations",
    idCode: "ORG-003",
    status: "Active",
    location: "Geneva, Switzerland",
    value: 12000000,
    currency: "CHF",
    tags: ["art", "gallery", "private", "exclusive"],
    lastUpdated: "2025-02-02",
    createdAt: new Date("2025-02-02"),
    people: [
      { id: "curator-1", role: "Curator", name: "Sophia Laurent" }
    ]
  },

  // Events
  {
    id: "EVT-001",
    name: "Annual Gala Dinner 2025",
    type: "gala",
    category: "Events",
    idCode: "EVT-001",
    status: "Scheduled",
    location: "Oil Nut Bay Resort",
    value: 250000,
    currency: "USD",
    tags: ["gala", "annual", "charity", "black-tie"],
    lastUpdated: "2025-01-25",
    createdAt: new Date("2025-01-25"),
    people: [
      { id: "organizer-1", role: "Event Organizer", name: "Events by Elena" }
    ]
  },
  {
    id: "EVT-002",
    name: "Wine Tasting Experience",
    type: "private-event",
    category: "Events",
    idCode: "EVT-002",
    status: "Scheduled",
    location: "Napa Valley Estate",
    value: 50000,
    currency: "USD",
    tags: ["wine", "tasting", "exclusive", "vip"],
    lastUpdated: "2025-01-28",
    createdAt: new Date("2025-01-28"),
    people: [
      { id: "sommelier-1", role: "Sommelier", name: "Pierre Dubois" }
    ]
  },
  {
    id: "EVT-003",
    name: "Polo Championship 2025",
    type: "sports-event",
    category: "Events",
    idCode: "EVT-003",
    status: "Scheduled",
    location: "Wellington, FL",
    value: 500000,
    currency: "USD",
    tags: ["polo", "championship", "sport", "exclusive"],
    lastUpdated: "2025-02-03",
    createdAt: new Date("2025-02-03"),
    people: [
      { id: "organizer-2", role: "Tournament Director", name: "International Polo Club" }
    ]
  },

  // Pets
  {
    id: "PET-001",
    name: "Champion Golden Retriever",
    type: "dog",
    category: "Pets",
    idCode: "PET-001",
    status: "Active",
    location: "Estate Kennels",
    value: 25000,
    currency: "USD",
    tags: ["dog", "champion", "golden-retriever", "pedigree"],
    lastUpdated: "2025-01-05",
    createdAt: new Date("2025-01-05"),
    people: [
      { id: "owner-16", role: "Owner", name: "Estate Family" },
      { id: "trainer-1", role: "Trainer", name: "K9 Elite Training" }
    ]
  },
  {
    id: "PET-002",
    name: "Arabian Horse Stallion",
    type: "horse",
    category: "Pets",
    idCode: "PET-002",
    status: "Active",
    location: "Private Stables",
    value: 150000,
    currency: "USD",
    tags: ["horse", "arabian", "stallion", "breeding"],
    lastUpdated: "2025-01-15",
    createdAt: new Date("2025-01-15"),
    people: [
      { id: "owner-17", role: "Owner", name: "Equestrian Holdings" }
    ]
  },

  // Obligations
  {
    id: "OBL-001",
    name: "Property Tax Miami Villa",
    type: "tax",
    category: "Obligations",
    idCode: "OBL-001",
    status: "Due Soon",
    location: "Miami, FL",
    value: 45000,
    currency: "USD",
    tags: ["tax", "property", "annual", "government"],
    lastUpdated: "2025-01-20",
    createdAt: new Date("2025-01-20"),
    people: [
      { id: "accountant-1", role: "Accountant", name: "Tax Advisory Group" }
    ]
  },
  {
    id: "OBL-002",
    name: "Yacht Marina Fees",
    type: "fee",
    category: "Obligations",
    idCode: "OBL-002",
    status: "Current",
    location: "Monaco Harbor",
    value: 120000,
    currency: "EUR",
    tags: ["marina", "fee", "annual", "yacht"],
    lastUpdated: "2025-01-22",
    createdAt: new Date("2025-01-22"),
    people: [
      { id: "manager-5", role: "Marina Manager", name: "Port de Monaco" }
    ]
  },

  // High-Value Assets for AI Collection
  {
    id: "beachfront-villa-alpha",
    name: "Beachfront Villa Alpha",
    type: "property",
    category: "Properties",
    idCode: "VIL-ALPHA",
    status: "Active",
    location: "Virgin Gorda, BVI",
    value: 8500000,
    currency: "USD",
    tags: ["luxury", "beachfront", "villa", "premium"],
    lastUpdated: "2024-01-20T14:30:00Z",
    createdAt: new Date("2023-03-15"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Mar 15, 2023",
    lastUpdate: "Jan 20, 2024",
    date: "Mar 15, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "corporate-headquarters",
    name: "Corporate Headquarters",
    type: "property",
    category: "Properties",
    idCode: "HQ-001",
    status: "Active",
    location: "New York, NY",
    value: 25000000,
    currency: "USD",
    tags: ["corporate", "headquarters", "commercial", "premium"],
    lastUpdated: "2024-01-18T09:15:00Z",
    createdAt: new Date("2022-11-01"),
    people: [
      { id: "P001", role: "CEO", name: "John Smith" },
      { id: "P002", role: "CFO", name: "Sarah Johnson" }
    ],
    createdOn: "Nov 1, 2022",
    lastUpdate: "Jan 18, 2024",
    date: "Nov 1, 2022",
    createdBy: { name: "Corporate Team", avatar: "CT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "mountain-resort-estate",
    name: "Mountain Resort Estate",
    type: "property",
    category: "Properties",
    idCode: "MRE-001",
    status: "Active",
    location: "Aspen, CO",
    value: 15000000,
    currency: "USD",
    tags: ["luxury", "mountain", "resort", "estate"],
    lastUpdated: "2024-01-22T16:45:00Z",
    createdAt: new Date("2023-08-10"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Aug 10, 2023",
    lastUpdate: "Jan 22, 2024",
    date: "Aug 10, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "private-island-villa",
    name: "Private Island Villa",
    type: "property",
    category: "Properties",
    idCode: "PIV-001",
    status: "Active",
    location: "Private Island, BVI",
    value: 35000000,
    currency: "USD",
    tags: ["luxury", "private island", "villa", "exclusive"],
    lastUpdated: "2024-01-25T11:20:00Z",
    createdAt: new Date("2023-01-20"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Jan 20, 2023",
    lastUpdate: "Jan 25, 2024",
    date: "Jan 20, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "penthouse-sky-tower",
    name: "Penthouse Sky Tower",
    type: "property",
    category: "Properties",
    idCode: "PST-001",
    status: "Active",
    location: "Miami, FL",
    value: 12000000,
    currency: "USD",
    tags: ["luxury", "penthouse", "sky tower", "premium"],
    lastUpdated: "2024-01-19T13:10:00Z",
    createdAt: new Date("2023-05-05"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "May 5, 2023",
    lastUpdate: "Jan 19, 2024",
    date: "May 5, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "wine-country-estate",
    name: "Wine Country Estate",
    type: "property",
    category: "Properties",
    idCode: "WCE-001",
    status: "Active",
    location: "Napa Valley, CA",
    value: 18000000,
    currency: "USD",
    tags: ["luxury", "wine country", "estate", "vineyard"],
    lastUpdated: "2024-01-21T15:30:00Z",
    createdAt: new Date("2023-07-12"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Jul 12, 2023",
    lastUpdate: "Jan 21, 2024",
    date: "Jul 12, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "golf-course-estate",
    name: "Golf Course Estate",
    type: "property",
    category: "Properties",
    idCode: "GCE-001",
    status: "Active",
    location: "Pebble Beach, CA",
    value: 22000000,
    currency: "USD",
    tags: ["luxury", "golf course", "estate", "premium"],
    lastUpdated: "2024-01-23T10:45:00Z",
    createdAt: new Date("2023-09-08"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Sep 8, 2023",
    lastUpdate: "Jan 23, 2024",
    date: "Sep 8, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
  {
    id: "historic-castle-estate",
    name: "Historic Castle Estate",
    type: "property",
    category: "Properties",
    idCode: "HCE-001",
    status: "Active",
    location: "Scotland, UK",
    value: 45000000,
    currency: "USD",
    tags: ["luxury", "historic", "castle", "estate", "heritage"],
    lastUpdated: "2024-01-24T12:00:00Z",
    createdAt: new Date("2023-02-14"),
    people: [
      { id: "P001", role: "Owner", name: "John Smith" }
    ],
    createdOn: "Feb 14, 2023",
    lastUpdate: "Jan 24, 2024",
    date: "Feb 14, 2023",
    createdBy: { name: "Property Team", avatar: "PT" },
    sharedWith: [],
    pinned: false
  },
]

/**
 * Helper function to add compatibility fields to catalog items
 */
const addCompatibilityFields = (item: CatalogItem): CatalogItem => {
  // Extract owner as createdBy
  const owner = item.people?.find(p => p.role.toLowerCase().includes('owner'))
  const createdBy = owner ? {
    name: owner.name,
    avatar: owner.name.split(' ').map(n => n[0]).join('')
  } : { name: 'Unknown', avatar: 'U' }

  // Convert date to formatted string
  const createdOn = new Date(item.lastUpdated).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })

  return {
    ...item,
    createdOn,
    lastUpdate: item.lastUpdated,
    date: item.lastUpdated,
    createdBy,
    sharedWith: [],
    pinned: false
  }
}

/**
 * Helper functions for data manipulation
 */
export const getCatalogItemsByCategory = (category: string): CatalogItem[] => {
  return catalogItems.filter(item => item.category === category)
}

export const getCatalogItemsByStatus = (status: string): CatalogItem[] => {
  return catalogItems.filter(item => item.status === status)
}

export const searchCatalogItems = (searchTerm: string): CatalogItem[] => {
  const term = searchTerm.toLowerCase()
  return catalogItems.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.location.toLowerCase().includes(term) ||
    item.tags.some(tag => tag.toLowerCase().includes(term)) ||
    item.category.toLowerCase().includes(term)
  )
}

export const getCatalogItemById = (id: string): CatalogItem | undefined => {
  return catalogItems.find(item => item.id === id)
}

/**
 * Statistics
 */
export const catalogStats = {
  totalItems: catalogItems.length,
  totalValue: catalogItems.reduce((sum, item) => sum + item.value, 0),
  byCategory: {
    Properties: catalogItems.filter(item => item.category === "Properties").length,
    Aviation: catalogItems.filter(item => item.category === "Aviation").length,
    Maritime: catalogItems.filter(item => item.category === "Maritime").length,
    Vehicles: catalogItems.filter(item => item.category === "Vehicles").length,
    "Legal entities": catalogItems.filter(item => item.category === "Legal entities").length,
    Organizations: catalogItems.filter(item => item.category === "Organizations").length,
    Events: catalogItems.filter(item => item.category === "Events").length,
    Pets: catalogItems.filter(item => item.category === "Pets").length,
    Obligations: catalogItems.filter(item => item.category === "Obligations").length,
  },
  byStatus: {
    Available: catalogItems.filter(item => item.status === "Available").length,
    Active: catalogItems.filter(item => item.status === "Active").length,
    Maintenance: catalogItems.filter(item => item.status === "Maintenance").length,
    Scheduled: catalogItems.filter(item => item.status === "Scheduled").length,
    "Due Soon": catalogItems.filter(item => item.status === "Due Soon").length,
    Seasonal: catalogItems.filter(item => item.status === "Seasonal").length,
    Restoration: catalogItems.filter(item => item.status === "Restoration").length,
    Current: catalogItems.filter(item => item.status === "Current").length,
  }
}

/**
 * Legacy exports for backward compatibility
 * Automatically adds compatibility fields for UI components
 */
export const MOCK_CATALOG_ITEMS = catalogItems.map(addCompatibilityFields)
export type MockCatalogItem = CatalogItem

