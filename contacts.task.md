# План доопрацювання сторінки колекцій

## 1. Видалити search з хедеру ✅
**Файл:** `components/collection-detail-panel.tsx`
**Рядки:** 382-390
- Видалити div з Search іконкою та Input
- Залишити тільки: заголовок, бейдж з кількістю items, та кнопки справа
- Кнопки: Add Items, Manage Items, AI Assistant

## 2. Додати аватар стек (опціонально для демо) ✅
**Файл:** `components/collection-detail-panel.tsx`
**Розташування:** Поруч з кнопкою AI Assistant
- Створити компонент з аватарами користувачів
- Показувати 2-3 аватари з "+N" для решти
- При ховері показувати тултіп "Shared with: [імена]"
- Використати `<div class="flex -space-x-2">` з круглими аватарами

## 3. Зробити фільтри більш реалістичними ✅
**Файл:** `components/collections/collection-details-block.tsx`
**Рядки:** 267-270
- Замінити емодзі-бейджі на текстові фільтри:
  - "💰 Value > $1M" → "Amount - more than - $1,000,000"
  - "🏢 Premium categories" → "Category - is any of - Properties, Aviation, Maritime"
  - "✅ Active status" → "Status - is - Active"
  - "⭐ Rating ≥ 4" → "Rating - is at least - 4"
- Стилізувати як стандартні фільтр-чіпси без емодзі

## 4. Додати можливість приховати/показати опис і фільтри ✅
**Файл:** `components/collections/collection-details-block.tsx`
- Додати кнопку "Collapse/Expand" або іконку chevron біля секції з описом
- При натисканні ховати весь блок з описом, фільтрами та AI Summary
- Зберігати стан у React state
- Анімувати згортання/розгортання

## 5. Інтеграція з іконкою Settings ✅
**Файл:** `components/collection-detail-panel.tsx`
- Додати нову кнопку Settings з іконкою gear
- Створити dropdown меню з пунктом "Edit collection details"
- Цей пункт має відкривати модальне вікно/сайдбар з:
  - Полем для редагування Description
  - Інтерфейсом для налаштування фільтрів
  - Перемикачем Auto-sync
- Якщо секція прихована, Settings має бути основним способом редагування

## 6. Покращити AI Summary → AI Insights ✅
**Файл:** `components/collections/collection-details-block.tsx`
**Рядки:** 288-344
- Змінити заголовок з "AI Summary" на "AI Insights"
- Замінити 3 поточні картки на більш корисні інсайти:
  - ⚠️ Maintenance Alert: "5 properties require HVAC filter replacement within 30 days"
  - 🏠 Insurance Gap: "3 properties missing flood insurance coverage"
  - 📊 Portfolio Health: "2 assets showing declining appraisal values (-5% YoY)"
  - 💰 Cost Optimization: "Pool maintenance contracts up for renewal - potential $50K savings"
  - 📅 Upcoming Deadlines: "Property tax filings due for 4 properties by Oct 31"
  - 🔧 Pending Tasks: "12 open maintenance requests across Properties category"

## 7. Додати можливість "розгорнути" інсайт ✅
**Файл:** `components/collections/collection-details-block.tsx`
- Додати кнопку "View details" або іконку expand на кожній AI Insight картці
- При кліку відкривати модальне вікно або розгортати картку з:
  - Списком конкретних assets, яких це стосується
  - Деталями проблеми/інсайту
  - Відповідальними особами (assignees)
  - Швидкими діями (Quick actions): "Create task", "View related docs", "Contact team"
- Можна додати прямі лінки на конкретні assets або tasks

## Технічні деталі для імплементації:

### Компоненти для створення:
- `InsightCard` - картка інсайту з можливістю розгортання
- `FilterChip` - компонент фільтр-чіпса без емодзі
- `CollapsibleSection` - компонент для згортання/розгортання
- `AvatarStack` - компонент стеку аватарів
- `SettingsDropdown` - dropdown меню для налаштувань

### Використати:
- React state для управління collapse/expand станом
- shadcn/ui компонент Dialog для модальних вікон
- shadcn/ui компонент Tooltip для аватарів
- shadcn/ui компонент DropdownMenu для Settings
- Забезпечити адаптивність на різних екранах

### Порядок виконання:
1. Видалити search з хедеру
2. Додати Settings кнопку та dropdown
3. Замінити фільтри на реалістичні
4. Додати collapsible функціонал
5. Покращити AI Insights
6. Додати expandable інсайти
7. Додати аватар стек (опціонально)