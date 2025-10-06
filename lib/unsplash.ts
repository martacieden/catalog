// Функція для генерації Unsplash URL на основі категорії та назви об'єкта

export function getUnsplashImageUrl(category: string, name: string): string {
  // Мапінг категорій на ключові слова для пошуку
  const categoryKeywords: Record<string, string[]> = {
    "Legal entities": ["office", "business", "corporate", "building"],
    "Properties": ["house", "villa", "estate", "property", "architecture"],
    "Vehicles": ["car", "luxury car", "automobile", "vehicle"],
    "Aviation": ["airplane", "aircraft", "aviation", "plane"],
    "Maritime": ["yacht", "boat", "ship", "maritime", "ocean"],
    "Organizations": ["organization", "team", "company", "office"],
    "Events": ["event", "meeting", "conference", "gathering"],
    "Pets": ["pet", "animal", "dog", "cat"],
    "Obligations": ["document", "contract", "legal", "paperwork"]
  }

  // Отримуємо ключові слова для категорії
  const keywords = categoryKeywords[category] || ["business", "professional"]
  
  // Вибираємо випадковий ключовий термін для різноманітності
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
  
  // Розміри для різних використань
  const dimensions = {
    card: "400x300", // Для карткового вигляду
    table: "200x200" // Для табличного вигляду
  }

  // Генеруємо URL для Unsplash Source API (безкоштовний)
  // Використовуємо Unsplash Source для простого доступу без API ключа
  return `https://source.unsplash.com/${dimensions.card}/?${randomKeyword}&auto=format&fit=crop`
}

// Функція для отримання фото з конкретними параметрами
export function getUnsplashImageUrlCustom(
  keyword: string, 
  width: number = 400, 
  height: number = 300
): string {
  return `https://source.unsplash.com/${width}x${height}/?${keyword}&auto=format&fit=crop`
}

// Функція для отримання випадкового фото з категорії
export function getRandomUnsplashImage(category: string): string {
  const categoryKeywords: Record<string, string[]> = {
    "Legal entities": ["modern office", "corporate building", "business center"],
    "Properties": ["luxury villa", "modern house", "architectural design"],
    "Vehicles": ["luxury car", "sports car", "classic automobile"],
    "Aviation": ["private jet", "aircraft", "aviation"],
    "Maritime": ["luxury yacht", "sailing boat", "maritime"],
    "Organizations": ["office space", "business meeting", "corporate"],
    "Events": ["conference room", "event venue", "meeting space"],
    "Pets": ["cute pet", "animal", "domestic animal"],
    "Obligations": ["legal documents", "contract", "business paperwork"]
  }

  const keywords = categoryKeywords[category] || ["professional", "business"]
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
  
  return `https://source.unsplash.com/400x300/?${randomKeyword}&auto=format&fit=crop`
}
