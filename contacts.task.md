# ПЛАН: Підколекції (Subcollections)

## 📋 ОГЛЯД
Додавання можливості створювати ієрархічні структури колекцій - підколекції всередині існуючих колекцій. Це дозволить користувачам краще організовувати контент через вкладені папки.

## 🎯 МЕТА
Створити систему підколекцій, яка дозволить:
1. Створювати підколекції всередині існуючих колекцій
2. Переглядати ієрархію колекцій з breadcrumb навігацією
3. Переміщувати items між колекціями та підколекціями
4. Відображати підколекції окремо від items
5. Підтримувати до 3-х рівнів вкладеності

## 📐 UI/UX КОНЦЕПЦІЯ

### Варіант A: Підколекції як окрема секція (РЕКОМЕНДОВАНИЙ)
```
┌─────────────────────────────────────────┐
│ Collection Name • 9 items               │
│ Settings | Share | Rule | Add Items     │
├─────────────────────────────────────────┤
│ [Details Block - згорнутий/розгорнутий] │
├─────────────────────────────────────────┤
│ 📁 Subcollections (3)                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ 📂 Legal │ │ 📂 Finance│ │ 📂 Assets│ │
│ │ 15 items │ │ 23 items  │ │ 8 items  │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ [+ Create Subcollection]                │
├─────────────────────────────────────────┤
│ 📄 Items in this collection (9)         │
│ [Search] [Filters] [View Toggle]        │
│ [Table with items...]                   │
└─────────────────────────────────────────┘
```

**Переваги:**
- Чітке розділення між підколекціями та items
- Легко знайти і створити підколекції
- Не заважає роботі з items

**Недоліки:**
- Займає додатковий простір

### Варіант B: Підколекції як частина таблиці
```
┌─────────────────────────────────────────┐
│ [Search] [Filters] [View Toggle]        │
├─────────────────────────────────────────┤
│ 📂 Legal Documents (subcollection)      │
│ 📂 Financial Records (subcollection)    │
│ ─────────────────────────────────────── │
│ 📄 Beachfront Villa Alpha               │
│ 📄 Private Jet Gulfstream               │
└─────────────────────────────────────────┘
```

**Переваги:**
- Компактний вигляд
- Все в одному місці

**Недоліки:**
- Може бути плутанина між папками та items
- Складніша сортування

## 🏗️ СТРУКТУРА ДАНИХ

### 1. Оновлення типу Collection
```typescript
// types/collection.ts

export interface Collection {
  // ... існуючі поля
  
  // Нові поля для підколекцій
  parentId?: string | null        // ID батьківської колекції (null для root)
  subcollections?: Collection[]   // Масив підколекцій (для відображення)
  path?: string[]                 // Шлях в ієрархії ['root', 'parent', 'current']
  depth?: number                  // Рівень вкладеності (0 = root, 1 = 1st level, etc)
  isSubcollection?: boolean       // Прапорець для швидкої перевірки
}
```

### 2. Нові утиліти
```typescript
// lib/collection-utils.tsx

export const getCollectionPath = (collection: Collection): Collection[] => {
  // Повертає масив колекцій від root до поточної
}

export const getSubcollections = (collectionId: string, allCollections: Collection[]): Collection[] => {
  // Повертає всі підколекції для даної колекції
}

export const canCreateSubcollection = (collection: Collection): boolean => {
  // Перевіряє чи можна створити підколекцію (depth < 3)
}

export const moveItemToSubcollection = (
  itemId: string, 
  fromCollectionId: string, 
  toCollectionId: string
): void => {
  // Переміщує item між колекціями
}
```

## 🎨 КОМПОНЕНТИ

### 1. SubcollectionsSection (НОВИЙ)
**Розташування:** `components/collections/subcollections-section.tsx`

**Призначення:** Відображення списку підколекцій в Collection Detail Panel

**Функції:**
- Відображення карток підколекцій (grid layout)
- Кнопка створення нової підколекції
- Навігація до підколекції
- Показ кількості items в кожній підколекції
- Drag & drop для переміщення items

**Props:**
```typescript
interface SubcollectionsSectionProps {
  parentCollection: Collection
  subcollections: Collection[]
  onCreateSubcollection: () => void
  onOpenSubcollection: (subcollectionId: string) => void
  onMoveItem?: (itemId: string, toSubcollectionId: string) => void
}
```

### 2. SubcollectionCard (НОВИЙ)
**Розташування:** `components/collections/subcollection-card.tsx`

**Призначення:** Компактна картка підколекції

**Вигляд:**
```
┌──────────────────┐
│ 📂               │
│ Legal Documents  │
│ 15 items         │
│ [Open →]         │
└──────────────────┘
```

### 3. CollectionBreadcrumb (НОВИЙ)
**Розташування:** `components/collections/collection-breadcrumb.tsx`

**Призначення:** Навігація по ієрархії колекцій

**Вигляд:**
```
All Collections > Business Assets > Legal > Contracts
                                              ^^^^^^^^^ (поточна)
```

### 4. CreateSubcollectionDialog (НОВИЙ)
**Розташування:** `components/collections/create-subcollection-dialog.tsx`

**Призначення:** Діалог створення підколекції

**Поля:**
- Назва підколекції
- Опис (опціонально)
- Іконка
- Тип (manual/smart)

### 5. ОНОВЛЕННЯ: CollectionDetailPanel
**Файл:** `components/collection-detail-panel.tsx`

**Зміни:**
1. Додати breadcrumb навігацію вгорі
2. Додати секцію підколекцій після Details Block
3. Розділити items на "items in this collection" vs "items in subcollections"
4. Додати кнопку "Create Subcollection" біля "Add Items"

### 6. ОНОВЛЕННЯ: CollectionCard
**Файл:** `components/collections/collection-card.tsx`

**Зміни:**
1. Показувати індикатор підколекцій (наприклад, "📁 3 subcollections")
2. Додати опцію меню "Create Subcollection"
3. Показувати path при hover (якщо це підколекція)

## 🔄 ПОТІК РОБОТИ

### Сценарій 1: Створення підколекції
1. Користувач відкриває колекцію
2. В секції "Subcollections" натискає "+ Create Subcollection"
3. Відкривається діалог з формою
4. Заповнює назву та параметри
5. Натискає "Create"
6. Підколекція з'являється в списку підколекцій

### Сценарій 2: Навігація по підколекціях
1. Користувач бачить список підколекцій
2. Клікає на картку підколекції
3. Відкривається детальна панель підколекції
4. Breadcrumb показує шлях: "Parent > Subcollection"
5. Може повернутися назад через breadcrumb

### Сценарій 3: Переміщення items
1. Користувач вибирає items в таблиці (checkbox)
2. Натискає "Move to..." в bulk actions
3. Вибирає цільову підколекцію з dropdown
4. Items переміщуються
5. Toast підтверджує переміщення

## 📝 ТЕХНІЧНІ ДЕТАЛІ

### Context оновлення
**Файл:** `contexts/collections-context.tsx`

**Нові функції:**
```typescript
createSubcollection(parentId: string, data: Partial<Collection>): Collection
getSubcollections(parentId: string): Collection[]
getCollectionPath(collectionId: string): Collection[]
moveItemsBetweenCollections(itemIds: string[], fromId: string, toId: string): void
```

### Mock Data оновлення
**Файл:** `lib/mock-data.ts`

Додати приклади колекцій з підколекціями:
```typescript
{
  id: "col-business",
  name: "Business Assets",
  parentId: null,
  subcollections: [
    {
      id: "col-legal",
      name: "Legal Documents",
      parentId: "col-business",
      ...
    },
    {
      id: "col-finance",
      name: "Financial Records", 
      parentId: "col-business",
      ...
    }
  ]
}
```

## ✅ ЧЕКЛІСТ ІМПЛЕМЕНТАЦІЇ

### Фаза 1: Типи та утиліти (1-2 години)
- [ ] Оновити тип Collection з новими полями
- [ ] Створити утилітарні функції в collection-utils.tsx
- [ ] Оновити mock-data з прикладами підколекцій
- [ ] Перевірити типи в усьому проекті

### Фаза 2: Базові компоненти (2-3 години)
- [ ] Створити SubcollectionCard
- [ ] Створити CollectionBreadcrumb
- [ ] Створити SubcollectionsSection
- [ ] Створити CreateSubcollectionDialog
- [ ] Протестувати кожен компонент окремо

### Фаза 3: Інтеграція в Detail Panel (2-3 години)
- [ ] Додати breadcrumb в CollectionDetailPanel
- [ ] Додати секцію підколекцій
- [ ] Додати кнопку "Create Subcollection"
- [ ] Оновити логіку відображення items
- [ ] Додати фільтрацію "Show items from subcollections"

### Фаза 4: Функціонал переміщення (2-3 години)
- [ ] Додати bulk action "Move to subcollection"
- [ ] Реалізувати dropdown вибору цільової колекції
- [ ] Реалізувати логіку переміщення в context
- [ ] Додати підтвердження та toast повідомлення
- [ ] Додати drag & drop (опціонально)

### Фаза 5: Оновлення Dashboard (1-2 години)
- [ ] Показувати індикатор підколекцій на CollectionCard
- [ ] Додати опцію "Create Subcollection" в меню картки
- [ ] Додати фільтр "Show only root collections"
- [ ] Оновити counters (враховувати items в підколекціях)

### Фаза 6: Тестування та поліш (1-2 години)
- [ ] Протестувати створення підколекцій
- [ ] Протестувати навігацію
- [ ] Протестувати переміщення items
- [ ] Перевірити edge cases (максимальна глибина, видалення)
- [ ] Оптимізувати perfomance
- [ ] Перевірити responsive дизайн

## 🎨 ДИЗАЙН РІШЕННЯ

### Кольори та іконки
- 📂 Підколекція: `text-blue-600` (синій відтінок)
- 📁 Root колекція: `text-gray-700`
- Hover стан: `hover:bg-blue-50`

### Розміри карток підколекцій
- Grid: 3 колонки на desktop, 2 на tablet, 1 на mobile
- Висота картки: ~120px
- Padding: p-4
- Border radius: rounded-lg

### Анімації
- Відкриття підколекції: fade in + slide down
- Переміщення items: smooth transition
- Breadcrumb: smooth scroll

## 🚀 ПОКРАЩЕННЯ (Майбутнє)

### V1 (MVP)
- Базове створення та перегляд підколекцій
- Breadcrumb навігація
- Переміщення items через dropdown

### V2 (Enhanced)
- Drag & drop для переміщення items
- Bulk operations на підколекціях
- Пошук по всіх підколекціях
- Статистика по всій ієрархії

### V3 (Advanced)
- Шаблони структур підколекцій
- AI рекомендації для організації
- Експорт/імпорт структури
- Permissions по рівнях ієрархії

## 📌 ВАЖЛИВІ ПРИМІТКИ

1. **Обмеження глибини:** Максимум 3 рівні вкладеності (root → sub1 → sub2)
2. **Видалення:** При видаленні колекції - питати що робити з підколекціями (видалити / перемістити на рівень вище)
3. **Переміщення:** Items можна переміщувати тільки між колекціями одного рівня або в підколекції
4. **Smart Collections:** Підколекції можуть бути як manual так і smart з власними rules
5. **Статистика:** itemCount включає тільки items в цій колекції, не враховує підколекції

## ✅ УТОЧНЕННЯ ВІД КОРИСТУВАЧА

1. **Максимальна глибина:** 1 рівень вкладеності (root → sub1 ONLY)
2. **Відображення items:** Можна включати будь-які items (з поточної + з підколекцій)
3. **Позиція підколекцій:** Міні папки між Details Block та таблицею ✓
4. **Auto-sync:** Так, smart collection може автоматично розподіляти items по підколекціях
5. **Видалення колекції:** Питати користувача що робити з підколекціями

## 📌 ОНОВЛЕНІ ОБМЕЖЕННЯ

### Глибина вкладеності
```typescript
export const MAX_SUBCOLLECTION_DEPTH = 1; // Тільки root → subcollection

export const canCreateSubcollection = (collection: Collection): boolean => {
  // Можна створювати підколекції тільки в root колекціях
  return !collection.parentId && (!collection.depth || collection.depth === 0)
}
```

### Видалення колекції з підколекціями
При видаленні показувати діалог:
```
⚠️ Delete Collection with Subcollections?

This collection contains 3 subcollections with 45 total items.

What would you like to do?
○ Delete everything (collection + subcollections + items)
○ Move subcollections to root level
○ Cancel
```

---

**СТАТУС:** Готовий до імплементації з уточненими вимогами.
