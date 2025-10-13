import { MOCK_CATALOG_ITEMS, type MockCatalogItem } from "./mock-data";

export interface AIRecommendation {
  id: string;
  name: string;
  description: string;
  objectCount: number;
  criteria: {
    minValue: number;
    categories: string[];
    valueGrowth: 'positive' | 'stable' | 'negative';
  };
  objects: string[]; // Array of object IDs
  aiInsights: {
    patterns: Array<{
      type: string;
      count: number;
      threshold: string;
    }>;
    benefits: string[];
    analysis: string;
  };
}

export const highValueAssetsRecommendation: AIRecommendation = {
  id: 'high-value-assets',
  name: 'High-value Assets',
  description: 'AI identified properties and assets with high market value based on price patterns and recent appraisals',
  objectCount: 39,
  criteria: {
    minValue: 1000000,
    categories: ['Properties', 'Vehicles', 'Aviation', 'Maritime', 'Legal entities'],
    valueGrowth: 'positive'
  },
  objects: [
    'beachfront-villa-alpha',
    'corporate-headquarters',
    'mountain-resort-estate',
    'private-island-villa',
    'penthouse-sky-tower',
    'wine-country-estate',
    'golf-course-estate',
    'historic-castle-estate',
    // Add more high-value object IDs from MOCK_CATALOG_ITEMS
    ...MOCK_CATALOG_ITEMS
      .filter(item => 
        item.name.toLowerCase().includes('luxury') ||
        item.name.toLowerCase().includes('premium') ||
        item.name.toLowerCase().includes('villa') ||
        item.name.toLowerCase().includes('penthouse') ||
        item.name.toLowerCase().includes('tesla') ||
        item.name.toLowerCase().includes('gulfstream') ||
        item.name.toLowerCase().includes('yacht') ||
        item.name.toLowerCase().includes('corporate') ||
        item.name.toLowerCase().includes('enterprise') ||
        item.name.toLowerCase().includes('holdings') ||
        item.name.toLowerCase().includes('group') ||
        item.category === 'Real Estate' ||
        item.category === 'Vehicles' ||
        item.category === 'Legal entities'
      )
      .slice(0, 31) // Total 39 objects (8 specific + 31 from filter)
      .map(item => item.id)
  ],
  aiInsights: {
    patterns: [
      { type: 'properties', count: 15, threshold: '$1M' },
      { type: 'vehicles', count: 12, threshold: '$100k' },
      { type: 'commercial real estate', count: 8, threshold: '$2M' },
      { type: 'aviation assets', count: 4, threshold: '$5M' }
    ],
    benefits: [
      'Track your most valuable assets',
      'Monitor value changes',
      'Plan strategic decisions',
      'Generate investment reports'
    ],
    analysis: `I've analyzed your catalog and noticed you have several high-value properties and assets. Here's what I found:

📊 Pattern Analysis:
• 15 properties valued over $1M
• 12 luxury vehicles (>$100k)
• 8 commercial real estate assets
• 4 premium aviation assets

These items share common characteristics:
• Recent positive appraisals
• Located in premium areas
• High market demand categories

This collection will help you:
✓ Track your most valuable assets
✓ Monitor value changes
✓ Plan strategic decisions
✓ Generate investment reports

Would you like me to add any specific filter rules or adjust the criteria?`
  }
};

export const getRecommendationById = (id: string): AIRecommendation | null => {
  const recommendations = getAllRecommendations();
  return recommendations.find(rec => rec.id === id) || null;
};

export const luxuryVillasRecommendation: AIRecommendation = {
  id: 'luxury-villas',
  name: 'Luxury Villas & Properties',
  description: 'Beachfront estates, hillside villas, and vacation rental properties',
  objectCount: 12,
  criteria: {
    minValue: 500000,
    categories: ['Properties'],
    valueGrowth: 'positive'
  },
  objects: MOCK_CATALOG_ITEMS
    .filter(item => 
      item.category === 'Properties' &&
      (item.name.toLowerCase().includes('villa') ||
       item.name.toLowerCase().includes('beach') ||
       item.name.toLowerCase().includes('estate') ||
       item.name.toLowerCase().includes('resort'))
    )
    .slice(0, 12)
    .map(item => item.id),
  aiInsights: {
    patterns: [
      { type: 'luxury properties', count: 12, threshold: '$500k' }
    ],
    benefits: [
      'Track luxury property portfolio',
      'Monitor rental income potential',
      'Plan property maintenance'
    ],
    analysis: 'AI identified luxury properties with high rental potential and premium locations.'
  }
};

export const marinaAssetsRecommendation: AIRecommendation = {
  id: 'marina-assets',
  name: 'Marina Village Assets',
  description: 'Private marina, boats, water sports equipment, and marine facilities',
  objectCount: 12,
  criteria: {
    minValue: 100000,
    categories: ['Maritime'],
    valueGrowth: 'stable'
  },
  objects: MOCK_CATALOG_ITEMS
    .filter(item => 
      item.category === 'Maritime' ||
      item.name.toLowerCase().includes('boat') ||
      item.name.toLowerCase().includes('yacht') ||
      item.name.toLowerCase().includes('marina')
    )
    .slice(0, 12)
    .map(item => item.id),
  aiInsights: {
    patterns: [
      { type: 'marine assets', count: 12, threshold: '$100k' }
    ],
    benefits: [
      'Track marine asset portfolio',
      'Monitor maintenance schedules',
      'Plan seasonal operations'
    ],
    analysis: 'AI identified marine assets including boats, yachts, and marina facilities.'
  }
};

export const maintenanceUrgentRecommendation: AIRecommendation = {
  id: 'maintenance-urgent',
  name: 'Needs Attention',
  description: 'Assets requiring immediate maintenance or repair',
  objectCount: 0, // Will be calculated dynamically
  criteria: {
    minValue: 0,
    categories: ['Properties', 'Vehicles', 'Aviation', 'Maritime'],
    valueGrowth: 'stable'
  },
  objects: MOCK_CATALOG_ITEMS
    .filter(item => 
      item.status?.toLowerCase().includes('maintenance') || 
      item.status?.toLowerCase().includes('repair') ||
      item.status?.toLowerCase().includes('attention')
    )
    .map(item => item.id),
  aiInsights: {
    patterns: [
      { type: 'maintenance items', count: 0, threshold: 'urgent' }
    ],
    benefits: [
      'Track maintenance needs',
      'Plan repair schedules',
      'Prevent asset deterioration'
    ],
    analysis: 'AI identified assets requiring immediate attention or maintenance.'
  }
};

export const recentUpdatesRecommendation: AIRecommendation = {
  id: 'recent-updates',
  name: 'Recent Updates',
  description: 'Recently updated or modified items',
  objectCount: 0, // Will be calculated dynamically
  criteria: {
    minValue: 0,
    categories: ['Properties', 'Vehicles', 'Aviation', 'Maritime', 'Legal entities'],
    valueGrowth: 'positive'
  },
  objects: MOCK_CATALOG_ITEMS
    .filter(item => {
      const itemDate = new Date(item.date || '')
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return itemDate > thirtyDaysAgo
    })
    .map(item => item.id),
  aiInsights: {
    patterns: [
      { type: 'recent updates', count: 0, threshold: '30 days' }
    ],
    benefits: [
      'Track recent changes',
      'Monitor update frequency',
      'Identify active assets'
    ],
    analysis: 'AI identified items that have been recently updated or modified.'
  }
};

export const resortAmenitiesRecommendation: AIRecommendation = {
  id: 'resort-amenities',
  name: 'Resort Amenities',
  description: 'Spa facilities, dining venues, beach club, and recreational activities',
  objectCount: 12,
  criteria: {
    minValue: 50000,
    categories: ['Events'],
    valueGrowth: 'stable'
  },
  objects: MOCK_CATALOG_ITEMS
    .filter(item => 
      item.category === 'Events' ||
      item.name.toLowerCase().includes('spa') ||
      item.name.toLowerCase().includes('dining') ||
      item.name.toLowerCase().includes('beach') ||
      item.name.toLowerCase().includes('club')
    )
    .slice(0, 12)
    .map(item => item.id),
  aiInsights: {
    patterns: [
      { type: 'resort amenities', count: 12, threshold: '$50k' }
    ],
    benefits: [
      'Track amenity portfolio',
      'Monitor guest satisfaction',
      'Plan facility upgrades'
    ],
    analysis: 'AI identified resort amenities and recreational facilities.'
  }
};

export const getAllRecommendations = (): AIRecommendation[] => {
  return [
    highValueAssetsRecommendation,
    luxuryVillasRecommendation,
    marinaAssetsRecommendation,
    maintenanceUrgentRecommendation,
    recentUpdatesRecommendation,
    resortAmenitiesRecommendation
  ];
};

export const getObjectsForRecommendation = (recommendation: AIRecommendation) => {
  return MOCK_CATALOG_ITEMS.filter(item => 
    recommendation.objects.includes(item.id)
  );
};
