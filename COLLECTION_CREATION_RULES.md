# STABLE RULES FOR COLLECTION CREATION

## 🚨 КРИТИЧНО ВАЖЛИВО

### Правило #1: ВСІ операції з колекціями ОБОВ'ЯЗКОВО зберігаються в localStorage

**Це правило НЕ МОЖЕ бути порушено!**

### Функції, які ПОВИННІ дотримуватися цього правила:

1. **`addCollection()`** - створення нової колекції
2. **`addAICollection()`** - створення AI колекції  
3. **`acceptRecommendation()`** - створення колекції з AI рекомендації
4. **`updateCollection()`** - оновлення колекції
5. **`removeCollection()`** - видалення колекції
6. **`duplicateCollection()`** - дублювання колекції

### Як правильно реалізувати:

```typescript
// ❌ НЕПРАВИЛЬНО - забули зберегти в localStorage
setCollections(prev => [...prev, newCollection])

// ✅ ПРАВИЛЬНО - завжди зберігаємо в localStorage
setCollections(prev => {
  const updated = [...prev, newCollection]
  saveCollectionsToStorage(updated) // STABLE RULE: Always save to localStorage
  return updated
})
```

### Функція `saveCollectionsToStorage()`:

```typescript
const saveCollectionsToStorage = (collections: Collection[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
    console.log('💾 Collections saved to localStorage:', collections.length, 'collections')
  }
}
```

### Чому це критично важливо:

1. **Втрата даних** - без localStorage колекції зникають при перезавантаженні
2. **Погіршення UX** - користувач втрачає створені колекції
3. **Порушення функціональності** - AI рекомендації не працюють правильно
4. **Втрата довіри** - користувач не довіряє системі

### Перевірка дотримання правила:

1. Відкрийте DevTools → Application → Local Storage
2. Створіть колекцію
3. Перевірте що `way2bi_collections` оновився
4. Перезавантажте сторінку
5. Переконайтеся що колекція збереглася

### Приклад правильної реалізації:

```typescript
const addNewCollection = useCallback((collectionData: CollectionData) => {
  const newCollection: Collection = {
    id: `collection-${Date.now()}`,
    ...collectionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  setCollections(prev => {
    const updated = [...prev, newCollection]
    saveCollectionsToStorage(updated) // ← ОБОВ'ЯЗКОВО!
    return updated
  })
}, [])
```

## 🎯 РЕЗЮМЕ

**Кожна функція, яка змінює масив `collections`, ПОВИННА викликати `saveCollectionsToStorage(updated)`!**

Це правило гарантує:
- ✅ Збереження даних між сесіями
- ✅ Стабільну роботу AI рекомендацій  
- ✅ Надійність системи
- ✅ Довіру користувачів



