# 🧠 Collection UI - Документація Логіки

## 📚 Зміст
1. [Архітектура Системи](#архітектура-системи)
2. [Управління Станом](#управління-станом)
3. [Rule Engine](#rule-engine)
4. [Auto-Sync Engine](#auto-sync-engine)
5. [AI Insights Generator](#ai-insights-generator)
6. [Collection Utils](#collection-utils)
7. [Потоки Даних](#потоки-даних)
8. [Типи Даних](#типи-даних)

---

## 🏗️ Архітектура Системи

### Загальна Структура
```
┌─────────────────────────────────────────┐
│           Next.js App Router            │
│  ┌─────────────────────────────────┐   │
│  │   Layout (CollectionsProvider)  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
  ┌───▼───┐   ┌────▼─────┐   ┌──▼────┐
  │ Home  │   │ Catalog  │   │Detail │
  │ Page  │   │  Page    │   │ Page  │
  └───┬───┘   └────┬─────┘   └──┬────┘
      │            │             │
      └────────────┼─────────────┘
                   │
      ┌────────────▼────────────┐
      │ Collections Context API  │
      │  - State Management     │
      │  - CRUD Operations      │
      │  - Rule Application     │
      └────────────┬────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
  ┌───▼────────┐      ┌────────▼─────┐
  │ Rule Engine│      │ Auto-Sync    │
  │ - Parse    │      │ - Preview    │
  │ - Apply    │      │ - History    │
  │ - Validate │      │ - Execute    │
  └────────────┘      └──────────────┘
```

### Патерни та Підходи

1. **Server + Client Components**
   - Pages використовують `"use client"` для інтерактивності
   - UI компоненти максимально переносні

2. **Context API для стану**
   - Централізоване управління колекціями
   - Оптимістичні оновлення
   - Синхронізація через callbacks

3. **Custom Hooks**
   - `useCollections()` - доступ до стану
   - `useAutoSync()` - автоматична синхронізація
   - `useCollectionHistory()` - історія змін

4. **Utility Libraries**
   - Чисті функції без побічних ефектів
   - Композиція функцій
   - Immutable операції

---

## 🔄 Управління Станом

### Collections Context

**Файл:** `contexts/collections-context.tsx`

#### Структура Стану
```typescript
interface CollectionsContextType {
  // Дані
  collections: Collection[]
  allItems: CollectionItem[]
  
  // CRUD Колекцій
  addCollection: (data) => Collection
  updateCollection: (id, updates) => void
  removeCollection: (id) => void
  getCollectionById: (id) => Collection | undefined
  
  // Управління Елементами
  addItemToCollection: (collectionId, item) => void
  removeItemFromCollection: (collectionId, itemId) => void
  bulkAddItems: (collectionId, items) => void
  bulkRemoveItems: (collectionId, itemIds) => void
  
  // Правила та Синхронізація
  updateRules: (collectionId, rules) => void
  toggleAutoSync: (collectionId) => void
  syncCollection: (collectionId) => Promise<void>
  previewSync: (collectionId) => SyncPreview
  
  // Аналітика
  getCollectionStats: (collectionId) => CollectionStats
  searchCollections: (query) => Collection[]
}
```

#### Ключові Функції

**1. Створення Колекції**
```typescript
const addCollection = (data) => {
  const newCollection = {
    ...data,
    id: `collection-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    itemCount: data.items?.length || 0,
    viewCount: 0,
    createdBy: currentUser,
    version: 1
  }
  
  setCollections(prev => [...prev, newCollection])
  return newCollection
}
```

**2. Bulk Операції з Елементами**
```typescript
const bulkAddItems = (collectionId, items) => {
  setCollections(prev => prev.map(collection => {
    if (collection.id !== collectionId) return collection
    
    // Перевірка дублікатів
    const existingIds = new Set(collection.items.map(i => i.id))
    const uniqueItems = items.filter(item => !existingIds.has(item.id))
    
    // Додавання метаданих
    const processedItems = uniqueItems.map((item, index) => ({
      ...item,
      addedAt: new Date(),
      addedBy: currentUser,
      order: (collection.items?.length || 0) + index
    }))
    
    const allItems = [...(collection.items || []), ...processedItems]
    
    return {
      ...collection,
      items: allItems,
      itemCount: allItems.length,
      updatedAt: new Date()
    }
  }))
}
```

**3. Синхронізація Колекції**
```typescript
const syncCollection = async (collectionId) => {
  const collection = getCollectionById(collectionId)
  if (!collection) return
  
  // 1. Створити preview змін
  const preview = createSyncPreview(collection, allItems)
  
  // 2. Перевірити чи є зміни
  if (preview.changes.added === 0 && preview.changes.removed === 0) {
    return // Немає змін
  }
  
  // 3. Застосувати зміни
  setCollections(prev => prev.map(c => {
    if (c.id !== collectionId) return c
    
    // Додати нові елементи
    const newItems = [...c.items, ...preview.itemsToAdd]
    
    // Видалити елементи що не відповідають правилам
    const itemIdsToRemove = new Set(preview.itemsToRemove.map(i => i.id))
    const finalItems = newItems.filter(item => !itemIdsToRemove.has(item.id))
    
    return {
      ...c,
      items: finalItems,
      itemCount: finalItems.length,
      lastSyncedAt: new Date(),
      updatedAt: new Date()
    }
  }))
  
  // 4. Зберегти історію
  const history = createSyncHistory(preview, collection.filters, 'manual')
  saveSyncHistory(collectionId, history)
}
```

---

## ⚙️ Rule Engine

**Файл:** `lib/rule-engine.ts`

### Призначення
Парсинг та застосування правил фільтрації до елементів колекцій.

### Основні Функції

#### 1. Parse Rules
```typescript
parseRules(rules: FilterRule[]): JSONLogicRule
```
**Що робить:** Перетворює масив FilterRule в JSONLogic структуру

**Приклад:**
```typescript
const rules = [
  { field: 'category', operator: 'equals', value: 'Properties' },
  { field: 'value', operator: 'greater_than', value: 1000000 }
]

const jsonLogic = parseRules(rules)
// {
//   operator: 'and',
//   conditions: [
//     { field: 'category', operator: 'equals', value: 'Properties' },
//     { field: 'value', operator: 'greater_than', value: 1000000 }
//   ]
// }
```

#### 2. Apply Rules
```typescript
applyRulesToItems(
  items: CollectionItem[],
  rules: FilterRule[],
  config?: RuleEngineConfig
): CollectionItem[]
```

**Що робить:** Фільтрує елементи за правилами

**Підтримувані Оператори:**
- **String:** `equals`, `not_equals`, `contains`, `not_contains`, `starts_with`, `ends_with`
- **Number:** `equals`, `not_equals`, `greater_than`, `less_than`, `>=`, `<=`
- **Boolean:** `equals`, `not_equals`
- **Array:** `contains`, `not_contains`, `in`, `not_in`
- **Existence:** `is_empty`, `is_not_empty`

**Приклад:**
```typescript
const allItems = [
  { id: '1', category: 'Properties', value: 2000000 },
  { id: '2', category: 'Properties', value: 500000 },
  { id: '3', category: 'Vehicles', value: 100000 }
]

const rules = [
  { field: 'category', operator: 'equals', value: 'Properties' },
  { field: 'value', operator: 'greater_than', value: 1000000 }
]

const filtered = applyRulesToItems(allItems, rules)
// Результат: [{ id: '1', ... }]
```

#### 3. Validate Rules
```typescript
validateRules(
  rules: FilterRule[],
  config?: RuleEngineConfig
): ValidationResult
```

**Що робить:** Перевіряє правильність правил

**Перевірки:**
- Наявність обов'язкових полів (field, operator)
- Валідність операторів
- Типізація значень
- Ліміти (max conditions)

**Приклад:**
```typescript
const rules = [
  { field: '', operator: 'equals', value: 'test' } // Помилка: поле пусте
]

const result = validateRules(rules)
// {
//   valid: false,
//   errors: [
//     { ruleId: '...', field: 'field', message: 'Field is required' }
//   ]
// }
```

#### 4. Evaluate Condition
```typescript
evaluateCondition(
  item: CollectionItem,
  condition: Condition,
  caseSensitive: boolean
): boolean
```

**Логіка Оцінки:**

1. **Handle undefined/null**
```typescript
if (fieldValue === undefined || fieldValue === null) {
  return operator === "is_empty"
}
```

2. **String Operations**
```typescript
// Case insensitive by default
const itemStr = caseSensitive ? fieldValue : fieldValue.toLowerCase()
const compareStr = caseSensitive ? value : value.toLowerCase()

switch (operator) {
  case 'equals': return itemStr === compareStr
  case 'contains': return itemStr.includes(compareStr)
  // ...
}
```

3. **Number Operations**
```typescript
const compareNum = Number(value)
if (isNaN(compareNum)) return false

switch (operator) {
  case 'greater_than': return fieldValue > compareNum
  // ...
}
```

4. **Array Operations**
```typescript
// Перевірка наявності елемента в масиві
case 'contains':
  return fieldValue.some(item => 
    String(item).toLowerCase() === String(value).toLowerCase()
  )
```

5. **Date Operations**
```typescript
const itemDate = new Date(fieldValue).getTime()
const compareDate = new Date(value).getTime()

if (isNaN(itemDate) || isNaN(compareDate)) return false

return itemDate > compareDate // greater_than
```

### Оптимізація Правил

```typescript
optimizeRules(rules: FilterRule[]): FilterRule[]
```

**Що робить:**
- Видаляє дублікати (за field + operator + value)
- Мерджить схожі правила
- Сортує за пріоритетом

**Приклад:**
```typescript
const rules = [
  { field: 'category', operator: 'equals', value: 'Properties' },
  { field: 'category', operator: 'equals', value: 'Properties' }, // Дублікат
  { field: 'value', operator: 'greater_than', value: 1000000 }
]

const optimized = optimizeRules(rules)
// Результат: 2 правила (дублікат видалено)
```

---

## 🔄 Auto-Sync Engine

**Файл:** `lib/auto-sync-engine.ts`

### Призначення
Автоматична синхронізація колекцій на основі правил.

### Workflow

```
┌─────────────────────────────────────────┐
│  1. User Triggers Sync                  │
│     - Manual button click               │
│     - Auto-sync enabled                 │
│     - Rule change                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Create Sync Preview                 │
│     - Find matching items               │
│     - Compare with current              │
│     - Calculate diff                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Preview Dialog (Optional)           │
│     - Show items to add                 │
│     - Show items to remove              │
│     - Confirm changes                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Apply Changes                       │
│     - Add new items                     │
│     - Remove non-matching items         │
│     - Update item count                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  5. Save History                        │
│     - Timestamp                         │
│     - Items added/removed               │
│     - Rules applied                     │
└─────────────────────────────────────────┘
```

### Ключові Функції

#### 1. Create Sync Preview
```typescript
createSyncPreview(
  collection: Collection,
  allAvailableItems: CollectionItem[]
): SyncPreview
```

**Логіка:**
```typescript
// 1. Отримати поточні елементи
const currentItems = collection.items || []
const currentItemIds = new Set(currentItems.map(item => item.id))

// 2. Знайти всі елементи що відповідають правилам
const matchingItems = applyRulesToItems(
  allAvailableItems, 
  collection.filters || []
)
const matchingItemIds = new Set(matchingItems.map(item => item.id))

// 3. Обчислити різницю
const itemsToAdd = matchingItems.filter(item => 
  !currentItemIds.has(item.id)
)

const itemsToRemove = currentItems.filter(item => 
  !matchingItemIds.has(item.id)
)

const unchanged = currentItems.filter(item => 
  matchingItemIds.has(item.id)
)

// 4. Повернути preview
return {
  itemsToAdd,
  itemsToRemove,
  currentCount: currentItems.length,
  newCount: currentItems.length + itemsToAdd.length - itemsToRemove.length,
  changes: {
    added: itemsToAdd.length,
    removed: itemsToRemove.length,
    unchanged: unchanged.length
  }
}
```

**Приклад Результату:**
```typescript
{
  itemsToAdd: [
    { id: '5', name: 'New Property', ... },
    { id: '6', name: 'Another Property', ... }
  ],
  itemsToRemove: [
    { id: '3', name: 'Old Item', ... }
  ],
  currentCount: 5,
  newCount: 6,
  changes: {
    added: 2,
    removed: 1,
    unchanged: 4
  }
}
```

#### 2. Validate Sync
```typescript
validateSync(collection: Collection): {
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

**Перевірки:**
- Чи налаштовані правила
- Чи увімкнена авто-синхронізація
- Чи є елементи в колекції

#### 3. Get Sync Stats
```typescript
getSyncStats(history: SyncHistory[]): {
  totalSyncs: number
  totalItemsAdded: number
  totalItemsRemoved: number
  lastSync?: Date
  mostActiveTrigger: 'auto' | 'manual' | 'rule-change'
}
```

**Аналітика:**
- Загальна кількість синхронізацій
- Сумарна кількість доданих/видалених елементів
- Найчастіший тригер

---

## 🤖 AI Insights Generator

**Файл:** `lib/ai-insights-generator.ts`

### Призначення
Генерація інсайтів, рекомендацій та контекстних відповідей для колекцій.

### Типи Інсайтів

#### 1. Empty Collection
```typescript
if (collection.itemCount === 0) {
  return {
    type: 'info',
    title: 'Колекція порожня',
    description: 'Додайте елементи вручну або налаштуйте правила',
    actionLabel: 'Додати елементи'
  }
}
```

#### 2. Auto-Sync Suggestions
```typescript
if (!collection.autoSync && collection.filters?.length > 0) {
  return {
    type: 'suggestion',
    title: 'Увімкніть автоматичну синхронізацію',
    description: 'Правила налаштовані, але auto-sync вимкнений',
    actionLabel: 'Увімкнути'
  }
}
```

#### 3. Rule Suggestions
```typescript
if (collection.autoSync && !collection.filters?.length) {
  return {
    type: 'warning',
    title: 'Не налаштовані правила',
    description: 'Auto-sync увімкнений без правил',
    actionLabel: 'Додати правила'
  }
}
```

#### 4. Value Insights
```typescript
if (stats.totalValue > 0) {
  return {
    type: 'success',
    title: 'Загальна вартість',
    description: `${formatCurrency(stats.totalValue)}`,
  }
}
```

### Generate Rule Suggestions

```typescript
generateRuleSuggestions(
  collection: Collection,
  allItems: CollectionItem[]
): FilterRule[]
```

**Аналіз:**

1. **Single Category Rule**
```typescript
// Якщо всі елементи однієї категорії
const categories = [...new Set(collection.items.map(i => i.category))]
if (categories.length === 1) {
  suggestions.push({
    field: 'category',
    operator: 'equals',
    value: categories[0]
  })
}
```

2. **Common Tags Rule**
```typescript
// Якщо > 50% елементів мають спільний тег
uniqueTags.forEach(tag => {
  const itemsWithTag = collection.items.filter(i => 
    i.tags?.includes(tag)
  ).length
  
  if (itemsWithTag > collection.items.length / 2) {
    suggestions.push({
      field: 'tags',
      operator: 'contains',
      value: tag
    })
  }
})
```

3. **Status Rule**
```typescript
// Якщо всі елементи мають однаковий статус
const statuses = [...new Set(collection.items.map(i => i.status))]
if (statuses.length === 1) {
  suggestions.push({
    field: 'status',
    operator: 'equals',
    value: statuses[0]
  })
}
```

### Contextual AI Responses

```typescript
generateContextualResponse(
  userMessage: string,
  collection: Collection,
  stats?: CollectionStats
): string
```

**Підтримувані Запити:**

1. **Про кількість**
```typescript
"Скільки елементів?" → 
"У колекції 'X' знаходиться Y елементів. 
Розподіл: Properties: 3, Vehicles: 2..."
```

2. **Про правила**
```typescript
"Які правила?" →
"Налаштовано 3 правила. Auto-sync: enabled. 
Last sync: 2024-10-09..."
```

3. **Статистика**
```typescript
"Статистика?" →
"- Загальна кількість: 15
- Категорії: 5
- Загальна вартість: $12,500,000
- Середній рейтинг: 4.6/5"
```

---

## 🛠️ Collection Utils

**Файл:** `lib/collection-utils.ts`

### Категорії Функцій

#### 1. Filtering & Search

**filterItems()**
```typescript
// Фільтрація за багатьма критеріями
const filtered = filterItems(items, {
  categories: ['Properties'],
  status: ['Available'],
  value: { min: 1000000, max: 5000000 },
  rating: { min: 4.0 },
  search: 'beach'
})
```

**sortItems()**
```typescript
// Сортування
const sorted = sortItems(items, {
  field: 'value',
  direction: 'desc'
})
```

**searchItems()**
```typescript
// Пошук по всіх полях
const results = searchItems(items, 'luxury villa')
```

#### 2. Statistics

**calculateCollectionStats()**
```typescript
const stats = calculateCollectionStats(collection)
// {
//   totalItems: 15,
//   itemsByCategory: { 'Properties': 8, 'Vehicles': 7 },
//   itemsByStatus: { 'Available': 12, 'Maintenance': 3 },
//   totalValue: 25000000,
//   averageRating: 4.5
// }
```

**getUniqueFieldValues()**
```typescript
// Отримати всі унікальні значення поля
const categories = getUniqueFieldValues(items, 'category')
// ['Properties', 'Vehicles', 'Aviation']
```

#### 3. Validation

**validateCollection()**
```typescript
const result = validateCollection({
  name: '',
  description: 'Too long...'.repeat(100)
})
// {
//   valid: false,
//   errors: [
//     'Collection name is required',
//     'Description must be less than 500 characters'
//   ]
// }
```

**validateItem()**
```typescript
const result = validateItem({
  name: 'Villa',
  value: -1000 // Помилка
})
// {
//   valid: false,
//   errors: ['Item value cannot be negative']
// }
```

#### 4. Transformations

**groupItemsBy()**
```typescript
const grouped = groupItemsBy(items, 'category')
// {
//   'Properties': [item1, item2, ...],
//   'Vehicles': [item3, item4, ...],
//   ...
// }
```

**collectionToCSV()**
```typescript
const csv = collectionToCSV(collection)
// "ID","Name","Type","Category",...
// "1","Villa Sunset","Property","Real Estate",...
```

**collectionToJSON()**
```typescript
const json = collectionToJSON(collection)
// JSON string з форматуванням
```

#### 5. Comparison

**compareCollections()**
```typescript
const comparison = compareCollections(oldCollection, newCollection)
// {
//   hasChanges: true,
//   changes: [
//     'Name changed from "X" to "Y"',
//     '3 item(s) added',
//     'Auto-sync enabled'
//   ]
// }
```

**findDuplicateItems()**
```typescript
const duplicates = findDuplicateItems(items, 'name')
// [
//   [item1, item2], // Same name
//   [item3, item4, item5] // Same name
// ]
```

#### 6. Formatting

**formatValue()**
```typescript
formatValue(1500000) // "$1,500,000"
formatValue(1500000, 'EUR') // "€1,500,000"
```

**formatRating()**
```typescript
formatRating(4.5) // "4.5 ⭐"
```

**formatRelativeTime()**
```typescript
formatRelativeTime(new Date('2024-10-08'))
// "1d ago"
```

#### 7. Colors & Icons

**getCategoryColor()**
```typescript
getCategoryColor('Properties')
// "bg-green-100 text-green-700 border-green-200"
```

**getStatusColor()**
```typescript
getStatusColor('Available')
// "bg-green-100 text-green-800"
```

**getCategoryIcon()**
```typescript
getCategoryIcon('Properties')
// <Home className="h-5 w-5" />
```

---

## 🌊 Потоки Даних

### 1. Створення AI Колекції

```
User Input: "Create collection of luxury properties"
         │
         ▼
┌────────────────────────┐
│ AI Collection Dialog   │
│ - Parse prompt         │
│ - Generate rules       │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Rule Engine            │
│ - Apply rules          │
│ - Find matching items  │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Collections Context    │
│ - addAICollection()    │
│ - Set items            │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ UI Update              │
│ - Show new collection  │
│ - Toast notification   │
└────────────────────────┘
```

### 2. Синхронізація Smart Collection

```
Trigger: User clicks "Sync Now" / Auto-trigger
         │
         ▼
┌────────────────────────┐
│ Auto-Sync Engine       │
│ - createSyncPreview()  │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Sync Preview Dialog    │
│ - Show changes         │
│ - Confirm              │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Collections Context    │
│ - syncCollection()     │
│ - Apply changes        │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ History Storage        │
│ - Save sync record     │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ UI Update              │
│ - Update item count    │
│ - Show notification    │
└────────────────────────┘
```

### 3. Додавання Елементів

```
User: Opens "Add Items" dialog
         │
         ▼
┌────────────────────────┐
│ Get Available Items    │
│ - Exclude existing     │
│ - Apply filters        │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Add Items Dialog       │
│ - Show grid/list       │
│ - Selection            │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Bulk Add               │
│ - Check duplicates     │
│ - Add metadata         │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Collections Context    │
│ - bulkAddItems()       │
│ - Update itemCount     │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ UI Update              │
│ - Refresh grid         │
│ - Toast notification   │
└────────────────────────┘
```

---

## 📊 Типи Даних

### Core Types

#### Collection
```typescript
interface Collection {
  // Identity
  id: string
  name: string
  description?: string
  
  // Visual
  icon: string
  color?: string
  
  // Type
  type: 'ai-generated' | 'manual' | 'smart' | 'shared'
  category?: string
  tags?: string[]
  
  // Data
  items?: CollectionItem[]
  filters?: FilterRule[]
  
  // Automation
  autoSync: boolean
  lastSyncedAt?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: User
  
  // Stats
  itemCount: number
  viewCount: number
}
```

#### CollectionItem
```typescript
interface CollectionItem {
  // Identity
  id: string
  name: string
  type: string
  category: string
  idCode?: string
  
  // Visual
  image?: string
  thumbnail?: string
  
  // Data
  status?: string
  location?: string
  tags?: string[]
  
  // Financial
  value?: number
  currency?: string
  
  // Quality
  guestRating?: number
  
  // Metadata
  lastUpdated?: string
  createdAt?: Date
  
  // Flags
  flagged?: boolean
  pinned?: boolean
  archived?: boolean
}
```

#### FilterRule
```typescript
interface FilterRule {
  id: string
  field: string
  operator: FilterOperator
  value: string | number | boolean | string[]
}

type FilterOperator =
  | 'equals' | 'not_equals'
  | 'contains' | 'not_contains'
  | 'greater_than' | 'less_than'
  | 'is_empty' | 'is_not_empty'
  | 'in' | 'not_in'
```

---

## 🎯 Приклади Використання

### Створення Колекції з Правилами

```typescript
// 1. Create collection
const collection = addCollection({
  name: 'High-Value Properties',
  description: 'Properties worth over $1M',
  icon: 'Building2',
  type: 'smart',
  autoSync: true,
  filters: [
    {
      id: 'rule-1',
      field: 'category',
      operator: 'equals',
      value: 'Properties'
    },
    {
      id: 'rule-2',
      field: 'value',
      operator: 'greater_than',
      value: 1000000
    }
  ],
  items: []
})

// 2. Sync to populate items
await syncCollection(collection.id)

// 3. Get stats
const stats = getCollectionStats(collection.id)
console.log(`Added ${stats.totalItems} items`)
```

### Bulk Operations

```typescript
// Select multiple items
const selectedIds = ['item-1', 'item-2', 'item-3']

// Bulk add to collection
const itemsToAdd = allItems.filter(item => 
  selectedIds.includes(item.id)
)
bulkAddItems(collectionId, itemsToAdd)

// Bulk tag
bulkOperateOnItems(collectionId, {
  type: 'tag',
  itemIds: selectedIds,
  params: { tags: ['urgent', 'review'] }
})

// Bulk remove
bulkRemoveItems(collectionId, selectedIds)
```

### AI Insights

```typescript
// Generate insights
const insights = generateInsights(collection, stats)
insights.forEach(insight => {
  console.log(`[${insight.type}] ${insight.title}`)
  console.log(insight.description)
})

// Get rule suggestions
const suggestedRules = generateRuleSuggestions(
  collection,
  allItems
)
console.log('Suggested rules:', suggestedRules)

// Generate contextual response
const response = generateContextualResponse(
  'Скільки елементів у колекції?',
  collection,
  stats
)
console.log(response)
```

---

## 🚀 Performance Considerations

### 1. Мемоізація
```typescript
// Use React.memo for heavy components
export const CollectionCard = React.memo(({ collection }) => {
  // ...
})

// Use useMemo for expensive calculations
const stats = useMemo(() => 
  calculateCollectionStats(collection),
  [collection]
)
```

### 2. Віртуалізація
```typescript
// For large lists (>100 items)
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
})
```

### 3. Debouncing
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query) => {
    setSearchResults(searchItems(items, query))
  }, 300),
  [items]
)
```

### 4. Pagination
```typescript
// Paginate large collections
const pageSize = 50
const page = 1
const paginatedItems = items.slice(
  (page - 1) * pageSize,
  page * pageSize
)
```

---

**Останнє оновлення:** 2025-10-09  
**Версія:** 1.0.0





