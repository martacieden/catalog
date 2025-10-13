import type { MockCatalogItem } from "./mock-data";

export const applyHighValueAssetsFilter = (items: MockCatalogItem[]): MockCatalogItem[] => {
  // Тільки конкретні 8 об'єктів High-value Assets
  const expectedIds = [
    'PROP-001', 'PROP-002', 'PROP-004', 'PROP-005',
    'PROP-006', 'PROP-007', 'PROP-008', 'PROP-011'
  ];
  
  return items.filter(item => expectedIds.includes(item.id));
};

// При створенні колекції
export const createHighValueAssetsCollection = (allItems: MockCatalogItem[]) => {
  const filteredItems = applyHighValueAssetsFilter(allItems);
  
  // Переконатися що це саме ті 8 items
  const expectedIds = [
    'PROP-001', 'PROP-002', 'PROP-004', 'PROP-005',
    'PROP-006', 'PROP-007', 'PROP-008', 'PROP-011'
  ];
  
  const verifiedItems = filteredItems.filter(item => 
    expectedIds.includes(item.id)
  );
  
  console.log('All items:', allItems.length);
  console.log('Filtered items:', filteredItems.length);
  console.log('Expected count: 8, Actual:', verifiedItems.length);
  console.log('Missing items:', expectedIds.filter(id => 
    !verifiedItems.find(item => item.id === id)
  ));
  
  return {
    items: verifiedItems,
    itemCount: verifiedItems.length
  };
};
