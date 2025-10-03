# Collection UI Redesign

Сучасний UI для управління колекціями з використанням Next.js та TypeScript.

## Технології

- **Next.js 14** - React фреймворк
- **TypeScript** - типобезпечність
- **Tailwind CSS** - стилізація
- **shadcn/ui** - компоненти UI
- **Lucide React** - іконки

## Встановлення

1. Клонуйте репозиторій:
```bash
git clone https://github.com/YOUR_USERNAME/collection-ui-redesign.git
cd collection-ui-redesign
```

2. Встановіть залежності:
```bash
pnpm install
```

3. Запустіть проект у режимі розробки:
```bash
pnpm dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## Структура проекту

```
├── app/                 # Next.js App Router
├── components/          # React компоненти
│   ├── ui/             # UI компоненти (shadcn/ui)
│   └── ...             # Бізнес компоненти
├── hooks/              # Кастомні React хуки
├── lib/                # Утилітарні функції
└── public/             # Статичні файли
```

## Основні функції

- 🎨 Сучасний дизайн інтерфейсу
- 📱 Адаптивна верстка
- 🌙 Темна/світла тема
- 🔍 Пошук та фільтрація
- 📊 Дашборд колекцій
- 🤖 AI-асистент для колекцій

## Розробка

### Доступні команди

- `pnpm dev` - запуск у режимі розробки
- `pnpm build` - збірка для продакшена
- `pnpm start` - запуск продакшен збірки
- `pnpm lint` - перевірка коду

### Code Style

Проект використовує ESLint та Prettier для підтримки якості коду.

## Ліцензія

MIT License
