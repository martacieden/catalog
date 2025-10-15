# Changelog - Січень 2025

## 📋 Всі внесені зміни

---

## 🗓️ 15 Січня 2025

### ✨ Нові функції та покращення

#### 1. **Розділення логіки Delete та Remove**
**Коміт**: `feat: separate delete vs remove logic for collections`

**Проблема**: 
- Раніше на всіх сторінках була одна кнопка "Delete", яка видаляла об'єкти назавжди
- Не було можливості просто видалити об'єкт з колекції, не видаляючи його повністю

**Рішення**:
- ✅ Додано новий prop `onBulkRemove` для видалення з колекції
- ✅ Залишено `onBulkDelete` для повного видалення
- ✅ Розділено функціонал для різних сторінок

**Змінені файли**:
- `components/collections/items-table.tsx`
  - Додано `onBulkRemove?: () => void` prop
  - Додано кнопку "Remove from collection" з іконкою `X`
  - Залишено кнопку "Delete items" з іконкою `Trash2`
  
- `components/collections/items-grid.tsx`
  - Додано `onBulkRemove?: () => void` prop
  - Додано кнопку "Remove from collection" з іконкою `X`
  - Залишено кнопку "Delete items" з іконкою `Trash2`
  
- `components/collection-detail-panel.tsx`
  - Змінено `onBulkDelete` на `onBulkRemove`
  - Тепер використовує логіку видалення з колекції

**Результат**:
| Сторінка | Кнопка | Дія | Стиль |
|----------|--------|-----|-------|
| Колекція | Remove | Видаляє з колекції | `outline` |
| All objects | Delete items | Видаляє назавжди | `destructive` |

---

#### 2. **Видалення секції Dependencies**
**Коміт**: `feat: separate delete vs remove logic for collections`

**Зміни**:
- ✅ Видалено `DependenciesSection` з бокової панелі
- ✅ Видалено `DependencyIndicator` компонент з sidebar
- ✅ Спрощено навігацію в `catalog-sidebar.tsx`

**Змінені файли**:
- `components/catalog-sidebar.tsx`
  - Видалено імпорти: `DependenciesSection`, `DependencyIndicator`
  - Видалено `getDependencies`, `getDependencyGroups` з useCollections
  - Видалено рендеринг секції Dependencies

---

#### 3. **Додано відступ для секції Collections**
**Коміт**: `feat: separate delete vs remove logic for collections`

**Зміни**:
- ✅ Додано `mt-6` (24px) до секції Collections
- ✅ Покращено візуальне розділення секцій

**Змінені файли**:
- `components/collection-detail-panel.tsx`
  ```tsx
  {subcollections.length > 0 && (
    <div className="mt-6"> {/* Додано mt-6 */}
      <CollectionsGrid ... />
    </div>
  )}
  ```

---

#### 4. **Спрощення тексту кнопки Remove**
**Коміт**: `refactor: simplify Remove button text`

**Було**:
```tsx
<span className="hidden sm:inline">Remove from collection</span>
<span className="sm:hidden">Remove</span>
```

**Стало**:
```tsx
Remove
```

**Зміни**:
- ✅ Видалено адаптивні варіанти тексту
- ✅ Залишено тільки "Remove" для всіх екранів
- ✅ Покращено читабельність та простоту UI

**Змінені файли**:
- `components/collections/items-table.tsx`
- `components/collections/items-grid.tsx`

---

### 🧹 Технічні покращення

#### Очищення кешу
- ✅ Видалено `.next` директорію
- ✅ Очищено `node_modules/.cache`
- ✅ Перебудовано проект з чистого стану

---

### 📊 Статистика змін

**Перший коміт** (`a9e001a`):
- 📁 24 файли змінено
- ➕ 55 додавань
- ➖ 184 видалення

**Другий коміт** (`f27dcb8`):
- 📁 2 файли змінено
- ➕ 2 додавання
- ➖ 4 видалення

**Всього**:
- 📁 26 файлів змінено
- ➕ 57 додавань
- ➖ 188 видалень

---

### 🎯 Покращення UX/UI

1. **Чітка логіка видалення**
   - Користувачі тепер розуміють різницю між "Remove" та "Delete"
   - Зменшено ризик випадкового видалення об'єктів

2. **Спрощена навігація**
   - Видалено зайву секцію Dependencies з sidebar
   - Покращено фокус на основному функціоналі

3. **Кращі відступи**
   - Додано візуальне розділення між секціями
   - Покращено загальну читабельність інтерфейсу

4. **Лаконічний текст**
   - Спрощено тексти кнопок
   - Зроблено UI більш мінімалістичним

---

### 🔄 GitHub

**Repository**: `martacieden/catalog`
**Branch**: `main`
**Commits**: 
- `a9e001a` - feat: separate delete vs remove logic for collections
- `f27dcb8` - refactor: simplify Remove button text

---

## 🚀 Як використовувати

### На сторінці колекції:
1. Виберіть об'єкти
2. Натисніть **"Remove"** - об'єкти видаляться тільки з цієї колекції
3. Об'єкти залишаться в системі та інших колекціях

### На сторінці All objects:
1. Виберіть об'єкти
2. Натисніть **"Delete items"** - об'єкти видаляться назавжди
3. Об'єкти зникнуть з усіх колекцій

---

## 📝 Примітки для розробників

### Нові props в компонентах:

**ItemsTable** і **ItemsGrid**:
```typescript
interface Props {
  onBulkDelete?: () => void  // Delete items permanently (All objects page)
  onBulkRemove?: () => void  // Remove from collection (Collection detail page)
  // ... інші props
}
```

### Використання:

**Collection Detail Page**:
```tsx
<ItemsTable
  onBulkRemove={handleBulkDelete}  // Використовує Remove
  // НЕ передає onBulkDelete
/>
```

**All Objects Page**:
```tsx
<ItemsTable
  onBulkDelete={handleDeleteClick}  // Використовує Delete
  // НЕ передає onBulkRemove
/>
```

---

*Документ оновлено: 15 Січня 2025*

