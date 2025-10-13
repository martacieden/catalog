# Аналіз системи AI рекомендацій та колекцій

## Огляд

Система працює наступним чином:
1. **AI Suggested Collections** - відображаються на головній сторінці як картки з рекомендаціями
2. **Користувач клікає** на картку → відкривається модальне вікно з деталями
3. **Користувач створює колекцію** → колекція додається в список, рекомендація зникає

## Файли

### Основні компоненти:
- `components/collections-dashboard.tsx` - головна сторінка з AI рекомендаціями
- `components/ai-collection-preview-modal.tsx` - модальне вікно для створення колекції
- `contexts/collections-context.tsx` - контекст з логікою колекцій та AI рекомендацій

### Допоміжні файли:
- `lib/ai-recommendations.ts` - структура AI рекомендацій
- `lib/mock-data.ts` - тестові дані
- `types/collection.ts` - типи для колекцій

## Потік даних

### 1. Відображення AI рекомендацій
```typescript
// components/collections-dashboard.tsx
const getAISuggestionCards = () => {
  // Аналізує дані та створює картки рекомендацій
  // Повертає масив з id, name, description, itemCount, icon
}

const aiSuggestionCards = getAISuggestionCards()
```

### 2. Клік на рекомендацію
```typescript
const handleAISuggestionClick = (suggestionId: string) => {
  setSelectedCollectionType(suggestionId)
  setAiPreviewModalOpen(true)
}
```

### 3. Створення колекції
```typescript
const handleCreateAICollection = (collectionData) => {
  const newCollectionId = acceptRecommendation(selectedCollectionType)
  setAiPreviewModalOpen(false)
}
```

### 4. Логіка acceptRecommendation
```typescript
// contexts/collections-context.tsx
const acceptRecommendation = useCallback((id: string): string | null => {
  // 1. Знаходить рекомендацію за ID
  // 2. Фільтрує об'єкти за критеріями
  // 3. Створює нову колекцію
  // 4. Додає в список колекцій
  // 5. Видаляє рекомендацію (dismissRecommendation)
  // 6. Зберігає в localStorage
})
```

## Бекенд

Система використовує localStorage для збереження:
- `way2bi_collections` - список колекцій
- `way2bi_ai_recommendations` - список AI рекомендацій
- `way2bi_show_ai_banner` - стан баннера

## Проблема

**Поточна ситуація:** Коли користувач створює колекцію з AI рекомендації, рекомендація зникає зі списку, але **не оновлюється відображення на головній сторінці**.

**Що потрібно виправити:**
1. Після створення колекції оновити список `aiSuggestionCards`
2. Переконатися що рекомендація зникає з відображення
3. Додати колекцію в sidebar з колекціями

## Посилання

- `handleAISuggestionClick` - обробник кліку на рекомендацію
- `handleCreateAICollection` - обробник створення колекції
- `acceptRecommendation` - основна логіка створення колекції
- `dismissRecommendation` - видалення рекомендації
- `getAISuggestionCards` - генерація карток рекомендацій