# AI Rules-Based Collection Creation

## Огляд

Новий сценарій створення колекцій, де AI генерує набір правил (rules) замість готового списку об'єктів. Користувач може переглянути, відредагувати правила та підтвердити створення колекції з автоматичним заповненням.

## Мотивація

**Проблема традиційного підходу:**
- AI генерує статичний список об'єктів
- Колекція не оновлюється при додаванні нових об'єктів
- Користувач не бачить логіки відбору

**Переваги нового підходу:**
- ✅ Прозорість: користувач бачить правила фільтрації
- ✅ Гнучкість: можливість редагування правил
- ✅ Динамічність: колекція може автоматично оновлюватися
- ✅ Контроль: користувач підтверджує перед створенням

## Робочий процес

### 1. Ініціація (User Input)

```typescript
// Користувач вводить промпт
const prompt = "active legal entities from 2024"

// Відкривається діалог в режимі 'rules'
<AICollectionPreviewDialog
  mode="rules"
  userPrompt={prompt}
  open={true}
/>
```

### 2. AI генерація правил

AI аналізує промпт та створює набір фільтрів:

```typescript
// Приклад згенерованих правил
const rules: FilterRule[] = [
  {
    id: "rule-1",
    field: "type",
    operator: "equals",
    value: "Legal entities"
  },
  {
    id: "rule-2",
    field: "status",
    operator: "equals",
    value: "Active"
  },
  {
    id: "rule-3",
    field: "date",
    operator: "contains",
    value: "2024"
  }
]
```

### 3. Відображення UI підтвердження

Користувач бачить:

#### Верхня панель (Header)
- 🔥 Іконка та заголовок "AI Suggested Rules"
- Кнопка "Edit Rules" / "Preview"
- **Collection Name** - редагована назва колекції
- **Auto-populate toggle** - ввімкнути/вимкнути автозаповнення
- Badge з кількістю знайдених об'єктів

#### Основна область
**Preview Mode (за замовчуванням):**
- Список згенерованих правил у читабельному форматі
- Кожне правило показує: Field, Operator, Value
- Секція "Preview of Matched Items" з першими 5 об'єктами

**Edit Mode:**
- Повний Rule Builder компонент
- Можливість додавати/видаляти/редагувати правила
- Live preview кількості об'єктів

#### Нижня панель (Actions)
- "Cancel" - скасувати та закрити
- "Close" - закрити без створення
- "Create Collection (N items)" - підтвердити та створити

### 4. Підтвердження та створення

При натисканні "Create Collection":

```typescript
// 1. Валідація
if (proposedRules.length === 0) {
  toast({ title: "Немає правил", variant: "destructive" })
  return
}

// 2. Застосування правил до всіх доступних об'єктів
const matchedItems = applyFilterRules(allAvailableItems, proposedRules)

// 3. Створення колекції
addAICollection(
  collectionName, 
  `Колекція створена на основі правил: ${proposedRules.length} умов`,
  matchedItems
)

// 4. Показ success toast
toast({
  title: "Колекцію створено! 🎉",
  description: `"${collectionName}" додано з ${matchedItems.length} об'єктами`
})

// 5. Закриття діалогу
onOpenChange(false)
```

## Технічна реалізація

### Нові компоненти стану

```typescript
// Режим роботи (items = традиційний, rules = новий)
const [workingMode, setWorkingMode] = useState<'items' | 'rules'>(mode)

// Згенеровані AI правила
const [proposedRules, setProposedRules] = useState<FilterRule[]>([])

// Чи редагує користувач правила
const [isEditingRules, setIsEditingRules] = useState(false)

// Назва колекції
const [collectionName, setCollectionName] = useState("")

// Автоматичне заповнення
const [autoPopulate, setAutoPopulate] = useState(true)

// Кількість об'єктів що відповідають правилам
const [rulePreviewCount, setRulePreviewCount] = useState(0)

// Чи показувати UI підтвердження
const [showRulesConfirmation, setShowRulesConfirmation] = useState(false)
```

### Ключові функції

#### generateRulesFromPrompt()

Аналізує текстовий промпт та генерує набір правил:

```typescript
const generateRulesFromPrompt = (prompt: string): FilterRule[] => {
  const lowerPrompt = prompt.toLowerCase()
  const rules: FilterRule[] = []
  
  // Контракти в Європі
  if (lowerPrompt.includes('contract') && lowerPrompt.includes('europe')) {
    rules.push({
      id: `rule-${Date.now()}-1`,
      field: 'location',
      operator: 'contains',
      value: 'Europe'
    })
    // ... більше правил
  }
  
  return rules
}
```

Підтримувані сценарії:
- 📄 Контракти (за регіоном, датою)
- 🏢 Legal entities (статус, рік)
- 💎 High-value assets (вартість)
- 🏠 Properties (статус, тип)
- 🚗 Vehicles
- 🚩 Flagged items
- 💰 Items з фінансовими документами

#### handleGenerateRulesFromPrompt()

Запускає генерацію правил з симуляцією AI "thinking time":

```typescript
const handleGenerateRulesFromPrompt = () => {
  setIsGeneratingRules(true)
  
  setTimeout(() => {
    const generatedRules = generateRulesFromPrompt(userPrompt)
    const generatedName = generateCollectionName(userPrompt)
    
    setProposedRules(generatedRules)
    setCollectionName(generatedName)
    setShowRulesConfirmation(true)
    setIsGeneratingRules(false)
    
    // Додати AI повідомлення в чат
    setChatMessages(prev => [...prev, aiMessage])
  }, 1500)
}
```

#### handleConfirmRules()

Обробляє підтвердження та створення колекції:

```typescript
const handleConfirmRules = () => {
  // Валідація
  if (proposedRules.length === 0) return
  
  // Застосування правил
  const matchedItems = applyFilterRules(allAvailableItems, proposedRules)
  
  if (matchedItems.length === 0) {
    toast({ title: "Жодного об'єкта не знайдено" })
    return
  }
  
  // Створення колекції
  addAICollection(collectionName, description, matchedItems)
  
  // Success feedback
  toast({ title: "Колекцію створено! 🎉" })
  
  // Закриття через 1 секунду
  setTimeout(() => onOpenChange(false), 1000)
}
```

### Інтеграція з Rule Builder

Використовується існуючий компонент `RuleBuilder`:

```tsx
<RuleBuilder
  rules={proposedRules}
  onChange={setProposedRules}
  items={allAvailableItems}
  showPreview={true}
/>
```

Переваги:
- ✅ Візуальний редактор правил
- ✅ Валідація правил
- ✅ Live preview кількості об'єктів
- ✅ Підтримка JSON режиму
- ✅ Rule templates

### UI States

```
┌─────────────────────────────────────┐
│  Initial State (mode='rules')       │
│  - Показує AI чат                   │
│  - Запускає генерацію правил        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Generating Rules                   │
│  - isGeneratingRules = true         │
│  - Показує "AI is thinking..."     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Rules Confirmation                 │
│  - showRulesConfirmation = true     │
│  - Показує згенеровані правила      │
│  - Preview Mode активний            │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌────────┐    ┌──────────────┐
│ Edit   │    │ Confirm &    │
│ Rules  │    │ Create       │
└────┬───┘    └──────┬───────┘
     │               │
     │               ▼
     │         Collection Created
     │         Dialog Closed
     │
     └──► Toggle isEditingRules
          Shows RuleBuilder
```

## AI Assistant Integration

AI асистент підтримує новий режим:

### Початкове повідомлення (Rules Mode)

```typescript
if (workingMode === 'rules') {
  setChatMessages([{
    type: 'ai',
    content: `Аналізую ваш запит "${userPrompt}"... 
              Зараз створю набір правил для автоматичної колекції.`
  }])
}
```

### Після генерації правил

```typescript
const aiMessage = {
  type: 'ai',
  content: `Я проаналізував ваш запит "${userPrompt}" та створив 
            набір правил для автоматичної колекції. Знайдено 
            ${rulePreviewCount} об'єктів, які відповідають цим 
            критеріям. Ви можете переглянути та відредагувати 
            правила перед створенням колекції.`
}
```

### Після створення колекції

```typescript
const successMessage = {
  type: 'ai',
  content: `✅ Колекція "${collectionName}" успішно створена! 
            Автоматично додано ${matchedItems.length} об'єктів на 
            основі ${proposedRules.length} правил. Колекція буде 
            автоматично оновлюватися при додаванні нових об'єктів, 
            які відповідають критеріям.`
}
```

## Приклади використання

### Приклад 1: Active Legal Entities 2024

```typescript
// User prompt
"active legal entities from 2024"

// AI generates
{
  collectionName: "Active Legal Entities 2024",
  rules: [
    { field: "type", operator: "equals", value: "Legal entities" },
    { field: "status", operator: "equals", value: "Active" },
    { field: "date", operator: "contains", value: "2024" }
  ],
  matchedItems: 1  // Legal Entity Alpha
}
```

### Приклад 2: European Contracts

```typescript
// User prompt
"контракти в Європі за останні 6 місяців"

// AI generates
{
  collectionName: "European Contracts (Last 6 Months)",
  rules: [
    { field: "location", operator: "contains", value: "Europe" },
    { field: "lastUpdated", operator: "greater_than_or_equal", 
      value: "2024-10-07" },  // 6 місяців тому
    { field: "category", operator: "equals", value: "Contracts" }
  ]
}
```

### Приклад 3: High-Value Assets

```typescript
// User prompt
"high-value assets above 1M"

// AI generates
{
  collectionName: "High-Value Assets",
  rules: [
    { field: "value", operator: "greater_than", value: 1000000 }
  ],
  matchedItems: 3  // Villa Beta, Private Jet, Yacht
}
```

## Тестування

### Demo Page

Створено сторінку `/demo-rules` з 4 тестовими сценаріями:

1. **Active Legal Entities 2024** (Rules Mode)
2. **High-Value Assets** (Rules Mode)
3. **Properties Available** (Rules Mode)
4. **Traditional Items Mode** (порівняння)

### Як тестувати

```bash
# Запустити dev server
npm run dev

# Відкрити в браузері
http://localhost:3000/demo-rules
```

### Чек-лист тестування

- [ ] AI генерує правила з промпту
- [ ] Відображається UI підтвердження
- [ ] Показується правильна кількість matched items
- [ ] Можна редагувати назву колекції
- [ ] Toggle auto-populate працює
- [ ] Preview mode показує правила
- [ ] Edit mode відкриває Rule Builder
- [ ] Preview показує перші 5 об'єктів
- [ ] Create button disabled без правил
- [ ] Створення колекції працює
- [ ] Success toast показується
- [ ] Діалог закривається після створення
- [ ] AI чат показує правильні повідомлення

## API для інтеграції

### Props

```typescript
interface AICollectionPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionType: string
  userPrompt?: string
  mode?: 'items' | 'rules'  // NEW!
}
```

### Використання

```typescript
// Traditional mode (default)
<AICollectionPreviewDialog
  open={open}
  onOpenChange={setOpen}
  collectionType="ai-custom"
  userPrompt="my query"
/>

// NEW: Rules mode
<AICollectionPreviewDialog
  open={open}
  onOpenChange={setOpen}
  collectionType="ai-custom"
  userPrompt="active legal entities from 2024"
  mode="rules"  // Новий параметр!
/>
```

## Майбутні покращення

### Phase 2: Advanced Features

1. **Збереження правил у колекції**
   - Зберігати rules в metadata колекції
   - Можливість оновити правила пізніше
   - Auto-sync при додаванні нових об'єктів

2. **AI рекомендації для покращення правил**
   ```
   "Хочеш, щоб я додав умову тільки для клієнтів з revenue > 100k?"
   [Yes, update rules] [No, keep current]
   ```

3. **Rule templates з AI**
   - AI пропонує готові шаблони на основі контексту
   - Швидке створення популярних фільтрів

4. **Rule refinement через чат**
   ```
   User: "Додай тільки з фінансовими документами"
   AI: "Додаю правило: hasFinancialDocs = true"
   ```

5. **Scheduled auto-update**
   - Колекція автоматично оновлюється раз на день/тиждень
   - Нотифікації про нові об'єкти

6. **Rule analytics**
   - Скільки об'єктів додано/видалено
   - Історія змін правил
   - Статистика використання

### Phase 3: Advanced AI

1. **Natural Language Rule Editor**
   ```
   "Змінити статус на Available" → updates rule operator
   "Додати умову для Європи" → adds location rule
   ```

2. **Smart Rule Suggestions**
   - AI аналізує існуючі колекції
   - Пропонує схожі правила
   - Попереджає про конфлікти

3. **Multi-collection Rules**
   - Правила для кількох колекцій одночасно
   - Синхронізація між колекціями
   - Hierarchical rules

## Технічні деталі

### Dependencies

```json
{
  "components": [
    "RuleBuilder",
    "AICollectionPreviewDialog",
    "Label",
    "Input",
    "Badge",
    "Checkbox",
    "Button"
  ],
  "libs": [
    "rule-engine.ts",
    "rule-templates.ts",
    "applyFilterRules"
  ],
  "types": [
    "FilterRule",
    "FilterOperator"
  ]
}
```

### File Structure

```
components/
  ├── ai-collection-preview-dialog.tsx  // Modified with rules mode
  ├── collections/
  │   └── rule-builder.tsx              // Used for editing

lib/
  ├── rule-engine.ts                    // Rule processing
  └── rule-templates.ts                 // Rule templates

types/
  └── rule.ts                           // FilterRule interface

app/
  └── demo-rules/
      └── page.tsx                      // Demo page
```

## Висновок

Новий сценарій AI Rules-Based Collection Creation надає:

✅ **Прозорість** - користувач бачить логіку відбору  
✅ **Контроль** - можливість редагування правил  
✅ **Гнучкість** - використання Rule Builder  
✅ **Автоматизація** - auto-populate колекції  
✅ **Динамічність** - потенціал для auto-sync в майбутньому  

Це покращує UX та дає користувачам більше контролю над створенням колекцій, зберігаючи переваги AI-асистування.

