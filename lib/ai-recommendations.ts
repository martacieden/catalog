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
  objects: MockCatalogItem[]; // Array of actual objects
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
  const recommendations = [highValueAssetsRecommendation];
  return recommendations.find(rec => rec.id === id) || null;
};

export const getAllRecommendations = (): AIRecommendation[] => {
  return [highValueAssetsRecommendation];
};

export const getObjectsForRecommendation = (recommendation: AIRecommendation) => {
  return MOCK_CATALOG_ITEMS.filter(item => 
    recommendation.objects.includes(item.id)
  );
};
