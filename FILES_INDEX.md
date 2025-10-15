# 📑 Індекс Файлів Проекту

## Швидкий доступ до всіх файлів з кодом

---

## 📊 Статистика

- **Загальна кількість файлів:** ~120
- **TypeScript/TSX файлів:** ~85
- **Компонентів:** 79
- **Типів:** 6
- **Утиліт:** 8
- **Хуків:** 4
- **Контекстів:** 1

---

## 🗂️ Структура за Категоріями

### ⚙️ Конфігурація (5 файлів)

| Файл | Опис | Розмір |
|------|------|--------|
| `package.json` | Залежності проекту | ~3KB |
| `tsconfig.json` | TypeScript конфігурація | ~1KB |
| `next.config.mjs` | Next.js конфігурація | ~1KB |
| `components.json` | shadcn/ui конфігурація | ~1KB |
| `postcss.config.mjs` | PostCSS конфігурація | ~0.5KB |

**Всі файли знаходяться в:** `PROJECT_EXPORT.md` (розділ Конфігурація)

---

### 🎨 Стилі (2 файли)

| Файл | Опис | Розмір |
|------|------|--------|
| `app/globals.css` | Глобальні стилі, Tailwind, теми | ~5KB |
| `styles/globals.css` | Дублікат (legacy) | ~5KB |

**Повний код знаходиться в:** 
- `LOGIC_DOCUMENTATION.md` (кінець файлу)
- `COMPONENTS_FOR_V0.md` (розділ Стилі)

---

### 📄 Pages / App Router (4 файли)

| Файл | Опис | Розмір | Де знайти |
|------|------|--------|-----------|
| `app/layout.tsx` | Головний layout | ~2KB | PROJECT_EXPORT.md |
| `app/page.tsx` | Головна сторінка | ~5KB | PROJECT_EXPORT.md |
| `app/catalog/page.tsx` | Сторінка каталогу | ~6KB | PROJECT_EXPORT.md |
| `app/collections/[id]/page.tsx` | Деталі колекції | ~3KB | PROJECT_EXPORT.md |

---

### 🧩 Типи (6 файлів)

| Файл | Опис | Рядків | Де знайти |
|------|------|--------|-----------|
| `types/collection.ts` | Типи колекцій та елементів | ~270 | LOGIC_DOCUMENTATION.md |
| `types/rule.ts` | Типи правил фільтрації | ~75 | LOGIC_DOCUMENTATION.md |
| `types/user.ts` | Типи користувачів | ~28 | LOGIC_DOCUMENTATION.md |
| `types/document.ts` | Типи документів | ~24 | LOGIC_DOCUMENTATION.md |
| `types/ai.ts` | AI типи | ~126 | LOGIC_DOCUMENTATION.md |
| `types/index.ts` | Експорт всіх типів | ~22 | LOGIC_DOCUMENTATION.md |

**Загальний код:** ~545 рядків

---

### 🛠️ Утиліти / Lib (8 файлів)

| Файл | Опис | Рядків | Функцій | Де знайти |
|------|------|--------|---------|-----------|
| `lib/rule-engine.ts` | Парсинг та застосування правил | ~515 | 13 | LOGIC_DOCUMENTATION.md |
| `lib/auto-sync-engine.ts` | Автоматична синхронізація | ~195 | 9 | LOGIC_DOCUMENTATION.md |
| `lib/ai-insights-generator.ts` | Генерація AI інсайтів | ~349 | 6 | LOGIC_DOCUMENTATION.md |
| `lib/rule-templates.ts` | Шаблони правил | ~364 | 5 | LOGIC_DOCUMENTATION.md |
| `lib/collection-utils.ts` | Утиліти для колекцій | ~616 | 25+ | LOGIC_DOCUMENTATION.md |
| `lib/mock-data.ts` | Тестові дані | ~543 | 1 | Проект (прочитаний) |
| `lib/unsplash.ts` | Інтеграція з Unsplash | ~50 | 2 | Потрібно прочитати |
| `lib/utils.ts` | Загальні утиліти | ~6 | 1 | COMPONENTS_FOR_V0.md |

**Загальний код:** ~2,638 рядків  
**Загальна функціональність:** ~62 функції

---

### 🪝 Custom Hooks (4 файли)

| Файл | Опис | Рядків | Де знайти |
|------|------|--------|-----------|
| `hooks/use-auto-sync.ts` | Хук авто-синхронізації | ~80 | Потрібно прочитати |
| `hooks/use-collection-history.ts` | Історія колекцій | ~60 | Потрібно прочитати |
| `hooks/use-toast.ts` | Toast notifications | ~40 | shadcn/ui |
| `hooks/use-mobile.ts` | Mobile detection | ~30 | shadcn/ui |

**Загальний код:** ~210 рядків

---

### 🌍 Contexts (1 файл)

| Файл | Опис | Рядків | Де знайти |
|------|------|--------|-----------|
| `contexts/collections-context.tsx` | Глобальний стан колекцій | ~803 | LOGIC_DOCUMENTATION.md (повний код) |

**Ключові функції:**
- addCollection
- updateCollection
- removeCollection
- addItemToCollection
- bulkAddItems / bulkRemoveItems
- syncCollection
- getCollectionStats
- і ще 15+ функцій

---

### 🎨 Components - Collections (14 файлів)

| Файл | Опис | Рядків | Де знайти |
|------|------|--------|-----------|
| `components/collections/collection-card.tsx` | Картка колекції | ~482 | COMPONENTS_FOR_V0.md ✅ |
| `components/collections/collection-detail-view.tsx` | Детальний вигляд | ~500+ | Потрібно прочитати |
| `components/collections/collection-items-manager.tsx` | Менеджер елементів | ~400+ | Потрібно прочитати |
| `components/collections/items-grid.tsx` | Сітка елементів | ~300+ | Потрібно прочитати |
| `components/collections/items-table.tsx` | Таблиця елементів | ~350+ | Потрібно прочитати |
| `components/collections/add-items-dialog.tsx` | Діалог додавання | ~300+ | Потрібно прочитати |
| `components/collections/add-item-modal.tsx` | Модалка додавання | ~200+ | Потрібно прочитати |
| `components/collections/add-selected-to-collection-dialog.tsx` | Вибір колекції | ~150+ | Потрібно прочитати |
| `components/collections/ai-collection-dialog.tsx` | AI діалог | ~400+ | Потрібно прочитати |
| `components/collections/collection-ai-assistant.tsx` | AI асистент | ~350+ | Потрібно прочитати |
| `components/collections/collection-edit-dialog.tsx` | Редагування | ~250+ | Потрібно прочитати |
| `components/collections/collection-details-block.tsx` | Блок деталей | ~200+ | Потрібно прочитати |
| `components/collections/rule-builder.tsx` | Конструктор правил | ~400+ | Потрібно прочитати |
| `components/collections/rules-modal.tsx` | Модалка правил | ~300+ | Потрібно прочитати |
| `components/collections/share-modal.tsx` | Шеринг | ~250+ | Потрібно прочитати |
| `components/collections/sync-preview-dialog.tsx` | Превью синхронізації | ~300+ | Потрібно прочитати |

**Загальний код:** ~4,500+ рядків  
**Експортовано в документацію:** 1 з 16

---

### 🎯 Components - Main (10 файлів)

| Файл | Опис | Рядків | Де знайти |
|------|------|--------|-----------|
| `components/app-sidebar.tsx` | Головна навігація | ~140 | COMPONENTS_FOR_V0.md ✅ |
| `components/catalog-sidebar.tsx` | Бокова панель каталогу | ~465 | Прочитаний |
| `components/catalog-view.tsx` | Вигляд каталогу | ~500+ | Потрібно прочитати |
| `components/collections-dashboard.tsx` | Дашборд колекцій | ~694 | Прочитаний |
| `components/collection-detail-panel.tsx` | Панель деталей | ~400+ | Потрібно прочитати |
| `components/collection-settings-dialog.tsx` | Налаштування | ~300+ | Потрібно прочитати |
| `components/manual-collection-dialog.tsx` | Ручне створення | ~250+ | Потрібно прочитати |
| `components/remove-collection-dialog.tsx` | Видалення | ~100+ | Потрібно прочитати |
| `components/search-to-collection.tsx` | Пошук → Колекція | ~200+ | Потрібно прочитати |
| `components/ai-chat.tsx` | AI чат | ~300+ | Потрібно прочитати |
| `components/ai-collection-preview-dialog.tsx` | AI превью | ~400+ | Потрібно прочитати |
| `components/ai-fojo-search.tsx` | FOJO пошук | ~200+ | Потрібно прочитати |
| `components/theme-provider.tsx` | Теми | ~80 | shadcn/ui |

**Загальний код:** ~3,500+ рядків  
**Експортовано в документацію:** 2 з 13

---

### 🧩 Components - UI (shadcn/ui) (43 файли)

**Категорія: Layout & Navigation**
- `components/ui/sidebar.tsx` (~500 рядків)
- `components/ui/navigation-menu.tsx` (~300 рядків)
- `components/ui/menubar.tsx` (~200 рядків)
- `components/ui/breadcrumb.tsx` (~150 рядків)
- `components/ui/scroll-area.tsx` (~80 рядків)
- `components/ui/separator.tsx` (~30 рядків)
- `components/ui/resizable.tsx` (~150 рядків)

**Категорія: Forms & Input**
- `components/ui/input.tsx` (~50 рядків)
- `components/ui/textarea.tsx` (~50 рядків)
- `components/ui/checkbox.tsx` (~60 рядків)
- `components/ui/switch.tsx` (~50 рядків)
- `components/ui/slider.tsx` (~80 рядків)
- `components/ui/select.tsx` (~200 рядків)
- `components/ui/radio-group.tsx` (~80 рядків)
- `components/ui/form.tsx` (~250 рядків)
- `components/ui/label.tsx` (~40 рядків)
- `components/ui/input-otp.tsx` (~120 рядків)
- `components/ui/calendar.tsx` (~150 рядків)

**Категорія: Buttons & Actions**
- `components/ui/button.tsx` (~80 рядків)
- `components/ui/toggle.tsx` (~50 рядків)
- `components/ui/toggle-group.tsx` (~100 рядків)

**Категорія: Dialogs & Overlays**
- `components/ui/dialog.tsx` (~200 рядків)
- `components/ui/sheet.tsx` (~200 рядків)
- `components/ui/drawer.tsx` (~250 рядків)
- `components/ui/alert-dialog.tsx` (~200 рядків)
- `components/ui/popover.tsx` (~80 рядків)
- `components/ui/tooltip.tsx` (~100 рядків)
- `components/ui/hover-card.tsx` (~100 рядків)
- `components/ui/context-menu.tsx` (~200 рядків)
- `components/ui/dropdown-menu.tsx` (~250 рядків)
- `components/ui/command.tsx` (~300 рядків)

**Категорія: Feedback**
- `components/ui/alert.tsx` (~80 рядків)
- `components/ui/toast.tsx` (~150 рядків)
- `components/ui/toaster.tsx` (~60 рядків)
- `components/ui/sonner.tsx` (~50 рядків)
- `components/ui/progress.tsx` (~50 рядків)
- `components/ui/skeleton.tsx` (~40 рядків)

**Категорія: Content Display**
- `components/ui/card.tsx` (~120 рядків)
- `components/ui/badge.tsx` (~60 рядків)
- `components/ui/avatar.tsx` (~80 рядків)
- `components/ui/tabs.tsx` (~150 рядків)
- `components/ui/accordion.tsx` (~150 рядків)
- `components/ui/collapsible.tsx` (~80 рядків)
- `components/ui/table.tsx` (~200 рядків)
- `components/ui/pagination.tsx` (~150 рядків)
- `components/ui/carousel.tsx` (~300 рядків)
- `components/ui/chart.tsx` (~200 рядків)
- `components/ui/aspect-ratio.tsx` (~30 рядків)

**Категорія: Custom**
- `components/ui/empty-state.tsx` (~60 рядків) - COMPONENTS_FOR_V0.md ✅

**Загальний код:** ~7,500+ рядків  
**Джерело:** shadcn/ui + custom  
**Експортовано в документацію:** 1 з 43

---

## 📊 Підсумкова Статистика Коду

| Категорія | Файлів | Рядків коду | Експортовано |
|-----------|--------|-------------|--------------|
| Конфігурація | 5 | ~500 | 5 (100%) ✅ |
| Стилі | 2 | ~250 | 2 (100%) ✅ |
| Pages | 4 | ~800 | 4 (100%) ✅ |
| Типи | 6 | ~545 | 6 (100%) ✅ |
| Утиліти | 8 | ~2,638 | 7 (87%) 🟡 |
| Hooks | 4 | ~210 | 2 (50%) 🟡 |
| Contexts | 1 | ~803 | 1 (100%) ✅ |
| Collections Components | 16 | ~4,500 | 1 (6%) 🔴 |
| Main Components | 13 | ~3,500 | 2 (15%) 🔴 |
| UI Components | 43 | ~7,500 | 1 (2%) 🔴 |
| **ЗАГАЛОМ** | **102** | **~21,246** | **31 (30%)** |

---

## 🎯 Рекомендації для Експорту

### Пріоритет 1: Основні Компоненти (не експортовані)
1. `collection-detail-view.tsx` - детальний вигляд
2. `collection-items-manager.tsx` - управління елементами
3. `items-grid.tsx` - сітка елементів
4. `items-table.tsx` - таблиця елементів
5. `catalog-view.tsx` - вигляд каталогу
6. `collection-detail-panel.tsx` - панель деталей

**Ці компоненти критичні для функціональності**

### Пріоритет 2: Діалоги (не експортовані)
7. `add-items-dialog.tsx` - додавання елементів
8. `ai-collection-dialog.tsx` - AI створення
9. `collection-edit-dialog.tsx` - редагування
10. `rule-builder.tsx` - конструктор правил
11. `sync-preview-dialog.tsx` - превью синхронізації

**Потрібні для взаємодії з користувачем**

### Пріоритет 3: AI Features (не експортовані)
12. `collection-ai-assistant.tsx` - AI асистент
13. `ai-chat.tsx` - AI чат
14. `ai-collection-preview-dialog.tsx` - AI превью

**Унікальні AI можливості**

---

## 🚀 Швидкі Команди

### Прочитати всі непрочитані компоненти
```bash
# Collections
cat components/collections/collection-detail-view.tsx
cat components/collections/collection-items-manager.tsx
cat components/collections/items-grid.tsx
cat components/collections/items-table.tsx
# ... і так далі

# Main
cat components/catalog-view.tsx
cat components/collection-detail-panel.tsx
# ... і так далі
```

### Знайти всі компоненти з певною функцією
```bash
# Знайти всі компоненти що використовують Context
grep -r "useCollections" components/

# Знайти всі діалоги
grep -r "Dialog" components/ | grep "function"

# Знайти AI features
grep -r "AI" components/ | grep "function"
```

### Підрахувати рядки коду
```bash
# Загальна кількість рядків
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# По директоріях
wc -l components/**/*.tsx
wc -l lib/*.ts
wc -l types/*.ts
```

---

## 📝 Примітки

### Що вже зроблено:
✅ Експортовано базову конфігурацію  
✅ Експортовано всі типи  
✅ Експортовано більшість утиліт  
✅ Експортовано контекст (повний код)  
✅ Експортовано 3 основні компоненти  
✅ Створено детальну логіку документацію  
✅ Створено інструкції для V0  

### Що потрібно зробити:
🔴 Експортувати решту ~70 компонентів  
🔴 Створити standalone версії без Context  
🔴 Додати приклади використання для кожного  
🔴 Протестувати в V0  

### Альтернативний підхід:
Замість експорту всіх компонентів, можна:
1. Створити архів проекту (ZIP)
2. Завантажити в Cloud Project напряму
3. Налаштувати бекенд
4. Поступово рефакторити

---

## 🔗 Швидкі Посилання

- [PROJECT_EXPORT.md](./PROJECT_EXPORT.md) - конфігурація + огляд
- [LOGIC_DOCUMENTATION.md](./LOGIC_DOCUMENTATION.md) - вся логіка + утиліти
- [COMPONENTS_FOR_V0.md](./COMPONENTS_FOR_V0.md) - експортовані компоненти
- [EXPORT_INSTRUCTIONS.md](./EXPORT_INSTRUCTIONS.md) - інструкції

---

**Версія:** 1.0.0  
**Оновлено:** 2025-10-09  
**Статус:** В процесі (30% експортовано)










