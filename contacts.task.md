# ПЛАН: Dependencies в навігації (Navigation Dependencies)

## 📋 ОГЛЯД
Додавання відображення залежностей (dependencies) в навігаційній панелі для показу зв'язків між колекціями та items. Це дозволить користувачам розуміти, які елементи залежать один від одного.

## 🎯 МЕТА
Створити систему відображення залежностей в навігації, яка дозволить:
1. Показувати зв'язки між колекціями та items
2. Відображати залежності в sidebar навігації
3. Візуально показувати типи залежностей
4. Надавати швидкий доступ до залежних елементів
5. Підтримувати різні типи зв'язків

## 📐 КОНЦЕПЦІЯ UI/UX

### Варіант A: Розширена навігація з залежностями (РЕКОМЕНДОВАНИЙ)
```
┌─────────────────────────────────────────┐
│ 📁 Aviation (8) 🔗2                     │
│   ├── 📂 Fleet (5)                      │
│   ├── 📂 Maintenance (3)                │
│   └── 🔗 Dependencies (2)               │
│       ├── 📎 Legal Documents (1)        │
│       └── 📎 Insurance Policies (1)     │
│                                          │
│ 📁 Properties (12)                       │
│   ├── 📂 Europe (5)                     │
│   └── 📂 USA (7)                        │
│                                          │
│ 📁 Legal Entities (21)                   │
└─────────────────────────────────────────┘
```

### Варіант B: Окрема секція Dependencies
```
┌─────────────────────────────────────────┐
│ 📁 All Collections                      │
│ 📁 Recently Opened                      │
│ 📁 Pinned                               │
│                                          │
│ 🔗 Dependencies                         │
│   ├── 📎 Legal → Properties (3)         │
│   ├── 📎 Properties → Insurance (5)     │
│   ├── 📎 Aviation → Maintenance (2)     │
│   └── 📎 Maritime → Ports (4)           │
│                                          │
│ 📁 Properties                           │
│ 📁 Legal Entities                       │
└─────────────────────────────────────────┘
```

### Варіант C: Індикатори залежностей на існуючих елементах
```
┌─────────────────────────────────────────┐
│ 📁 Properties (12) 🔗3                  │
│ 📁 Legal Entities (21) 🔗5              │
│ 📁 Aviation (8) 🔗2                     │
│ 📁 Maritime (15) 🔗4                    │
└─────────────────────────────────────────┘
```

## 🏗️ СТРУКТУРА ДАНИХ

### 1. Нові типи залежностей
```typescript
// types/dependency.ts

export interface Dependency {
  id: string
  type: DependencyType
  sourceId: string          // ID джерела залежності
  sourceType: 'collection' | 'item'
  targetId: string          // ID цільового елемента
  targetType: 'collection' | 'item'
  relationship: string      // Тип зв'язку (owns, references, contains, etc.)
  description?: string      // Опис залежності
  createdAt: Date
  createdBy: User
}

export type DependencyType = 
  | 'ownership'        // Власність (Property → Legal Entity)
  | 'reference'        // Посилання (Item → Document)
  | 'containment'      // Включення (Collection → Item)
  | 'financial'        // Фінансова залежність (Property → Insurance)
  | 'legal'           // Юридична залежність (Entity → Contract)
  | 'operational'     // Операційна залежність (Aircraft → Maintenance)
  | 'hierarchical'    // Ієрархічна залежність (Parent → Child)

export interface DependencyGroup {
  id: string
  name: string
  dependencies: Dependency[]
  sourceCollection: Collection
  targetCollections: Collection[]
}
```

### 2. Оновлення типу Collection
```typescript
// types/collection.ts

export interface Collection {
  // ... існуючі поля
  
  // Dependencies
  dependencies?: Dependency[]      // Залежності цієї колекції
  dependencyCount?: number         // Кількість залежностей
  hasDependencies?: boolean        // Прапорець наявності залежностей
}
```

## 🎨 КОМПОНЕНТИ

### 1. DependenciesSection (НОВИЙ)
**Розташування:** `components/navigation/dependencies-section.tsx`

**Призначення:** Секція з залежностями в навігації

**Функції:**
- Відображення групи залежностей
- Навігація до залежних елементів
- Показ кількості залежностей
- Розгортання/згортання списку

**Props:**
```typescript
interface DependenciesSectionProps {
  dependencies: DependencyGroup[]
  onNavigateToDependency: (dependency: Dependency) => void
  onNavigateToCollection: (collectionId: string) => void
  collapsed?: boolean
}
```

### 2. DependencyItem (НОВИЙ)
**Розташування:** `components/navigation/dependency-item.tsx`

**Призначення:** Окремий елемент залежності в навігації

**Вигляд:**
```
🔗 Legal Documents (2)
   ├── 📎 Property Contracts
   └── 📎 Insurance Policies
```

### 3. DependencyIndicator (НОВИЙ)
**Розташування:** `components/navigation/dependency-indicator.tsx`

**Призначення:** Індикатор залежностей на елементах навігації

**Вигляд:**
```
📁 Properties (12) 🔗3
```

### 4. ОНОВЛЕННЯ: CatalogSidebar
**Файл:** `components/catalog-sidebar.tsx`

**Зміни:**
1. Додати секцію Dependencies
2. Показувати індикатори залежностей на колекціях
3. Додати розгортання залежностей
4. Інтегрувати навігацію до залежностей

## 🔄 ПОТІК РОБОТИ

### Сценарій 1: Перегляд залежностей
1. Користувач відкриває sidebar навігації
2. Бачить індикатори залежностей на колекціях (🔗3)
3. Клікає на індикатор або розгортає секцію Dependencies
4. Бачить список залежностей з кількістю
5. Клікає на залежність для навігації

### Сценарій 2: Навігація через залежності
1. Користувач знаходиться в колекції Properties
2. Бачить секцію Dependencies з Legal Documents
3. Клікає на Legal Documents
4. Переходить до відповідної колекції
5. Може повернутися через breadcrumb

### Сценарій 3: Створення залежностей
1. Користувач створює новий item
2. При створенні може вказати залежності
3. Залежності автоматично відображаються в навігації
4. Індикатори оновлюються

## 📝 ТЕХНІЧНІ ДЕТАЛІ

### Context оновлення
**Файл:** `contexts/collections-context.tsx`

**Нові функції:**
```typescript
// Dependencies Management
getDependencies: (collectionId: string) => Dependency[]
getDependencyGroups: () => DependencyGroup[]
addDependency: (dependency: Omit<Dependency, "id" | "createdAt">) => Dependency
removeDependency: (dependencyId: string) => void
getDependenciesForCollection: (collectionId: string) => Dependency[]
```

### Mock Data для залежностей
**Файл:** `lib/mock-data.ts`

Додати приклади залежностей:
```typescript
export const MOCK_DEPENDENCIES: Dependency[] = [
  {
    id: "dep-1",
    type: "legal",
    sourceId: "col-properties",
    sourceType: "collection",
    targetId: "col-legal",
    targetType: "collection",
    relationship: "requires_documents",
    description: "Properties require legal documentation"
  },
  {
    id: "dep-2",
    type: "financial",
    sourceId: "col-properties",
    sourceType: "collection", 
    targetId: "col-insurance",
    targetType: "collection",
    relationship: "requires_coverage",
    description: "Properties require insurance coverage"
  }
]
```

## ✅ ЧЕКЛІСТ ІМПЛЕНТАЦІЇ

### Фаза 1: Типи та структура (1-2 години)
- [ ] Створити типи Dependency, DependencyType, DependencyGroup
- [ ] Оновити тип Collection з полями залежностей
- [ ] Створити утилітарні функції для роботи з залежностями
- [ ] Додати mock data з прикладами залежностей

### Фаза 2: Базові компоненти (2-3 години)
- [ ] Створити DependencyIndicator
- [ ] Створити DependencyItem
- [ ] Створити DependenciesSection
- [ ] Протестувати кожен компонент окремо

### Фаза 3: Інтеграція в навігацію (2-3 години)
- [ ] Оновити CatalogSidebar з секцією залежностей
- [ ] Додати індикатори залежностей на колекції
- [ ] Інтегрувати навігацію до залежностей
- [ ] Додати розгортання/згортання секції

### Фаза 4: Context та логіка (2-3 години)
- [ ] Оновити CollectionsContext з функціями залежностей
- [ ] Реалізувати CRUD операції для залежностей
- [ ] Додати автоматичне оновлення індикаторів
- [ ] Реалізувати навігацію між залежностями

### Фаза 5: UI/UX покращення (1-2 години)
- [ ] Додати анімації для розгортання
- [ ] Оптимізувати відображення великої кількості залежностей
- [ ] Додати фільтрацію залежностей
- [ ] Перевірити responsive дизайн

### Фаза 6: Тестування та поліш (1-2 години)
- [ ] Протестувати навігацію через залежності
- [ ] Протестувати створення/видалення залежностей
- [ ] Перевірити performance з великою кількістю залежностей
- [ ] Оптимізувати та виправити баги

## 🎨 ДИЗАЙН РІШЕННЯ

### Кольори та іконки
- 🔗 Залежності: `text-purple-600` (фіолетовий)
- 📎 Документи: `text-blue-600`
- 💰 Фінанси: `text-green-600`
- ⚖️ Юридичні: `text-orange-600`
- 🔧 Операційні: `text-gray-600`

### Розміри та відступи
- Індикатор залежностей: `text-xs` біля назви колекції
- Секція залежностей: `ml-4` для відступу
- Іконки: `h-3 w-3` для малих елементів

### Анімації
- Розгортання секції: slide down + fade in
- Hover ефекти: subtle background change
- Навігація: smooth transition

## 🚀 ПОКРАЩЕННЯ (Майбутнє)

### V1 (MVP)
- Базові індикатори залежностей на колекціях
- Секція Dependencies в навігації
- Навігація до залежних елементів

### V2 (Enhanced)
- Візуальна діаграма залежностей
- Фільтрація залежностей за типом
- Bulk operations на залежностях

### V3 (Advanced)
- AI аналіз залежностей
- Автоматичне виявлення залежностей
- Dependency health monitoring
- Impact analysis при видаленні

## 📌 ВАЖЛИВІ ПРИМІТКИ

1. **Продуктивність:** Залежності можуть бути великою кількістю - потрібна оптимізація
2. **Навігація:** Залежності не повинні заважати основній навігації
3. **Візуальний шум:** Індикатори повинні бути помітними, але не нав'язливими
4. **Контекст:** Залежності повинні показуватися в релевантному контексті
5. **Оновлення:** Індикатори повинні оновлюватися автоматично

## ✅ УТОЧНЕННЯ ВІД КОРИСТУВАЧА

1. **Типи залежностей:** Користувач може створювати власні типи та називати як завгодно
2. **Рівень деталізації:** Показувати на рівні колекцій + окремих items + nested dependencies
3. **Відображення:** Потрібно визначити найкращий варіант
4. **Навігація:** При кліку переходити до цільової колекції
5. **Редагування:** Так, можливість створювати/видаляти залежності з навігації

## 📌 ОНОВЛЕНІ ВИМОГИ

### Демо структура
- **1 колекція з підколекціями:** Aviation (Fleet, Maintenance) + Dependencies
- **Решта колекцій:** Properties, Legal Entities - без залежностей
- **Термінологія:** Називати все "колекції" (не "підколекції")

### Гнучкість типів залежностей
```typescript
export interface Dependency {
  id: string
  type: string              // Користувач може називати як завгодно
  sourceId: string
  sourceType: 'collection' | 'item'
  targetId: string
  targetType: 'collection' | 'item'
  relationship: string      // Користувач може називати як завгодно
  description?: string
  createdAt: Date
  createdBy: User
}

// Приклади користувацьких типів:
// "Legal Documents", "Insurance Policies", "Maintenance Records"
// "Related Properties", "Financial Reports", "Contracts"
// "Dependencies", "References", "Links"
```

### Рівні відображення залежностей
- **Collection level:** Залежності між колекціями
- **Item level:** Залежності між окремими items
- **Тільки 1 рівень:** НЕ показувати nested dependencies (залежності залежностей)

### Умови відображення
- **Показувати тільки якщо є залежності:** Не показувати пусті секції або блоки
- **Умовне відображення:** Секція Dependencies з'являється тільки при наявності залежностей
- **Індикатори:** Показувати 🔗N тільки якщо N > 0

### Функціонал редагування
- Створення залежностей через context menu
- Видалення залежностей через context menu
- Редагування назв та описів залежностей
- Bulk operations на залежностях

---

**СТАТУС:** Готовий до імплементації з гнучкими користувацькими типами залежностей.