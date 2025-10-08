"use client"

import * as React from "react"
import { CollectionItem } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Building2,
  Car,
  Plane,
  Ship,
  X,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCategoryColor } from "@/lib/collection-utils"

interface AddItemsDialogProps {
  collectionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Діалог для додавання елементів до колекції
 */
export function AddItemsDialog({
  collectionId,
  open,
  onOpenChange,
}: AddItemsDialogProps) {
  const { getAvailableItems, bulkAddItems, getCollectionById } = useCollections()
  const { toast } = useToast()

  const collection = getCollectionById(collectionId)
  const availableItems = getAvailableItems(collectionId)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Скинути стан при відкритті
  React.useEffect(() => {
    if (open) {
      setSearchQuery("")
      setSelectedCategory("all")
      setSelectedIds(new Set())
    }
  }, [open])

  // Фільтрація елементів
  const filteredItems = React.useMemo(() => {
    let items = availableItems

    // Фільтр по категорії
    if (selectedCategory !== "all") {
      items = items.filter(item => item.category === selectedCategory)
    }

    // Фільтр по пошуку
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.idCode?.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return items
  }, [availableItems, selectedCategory, searchQuery])

  // Отримати унікальні категорії
  const categories = React.useMemo(() => {
    const cats = new Set(availableItems.map(item => item.category))
    return Array.from(cats).sort()
  }, [availableItems])

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelection = new Set(selectedIds)
    if (checked) {
      newSelection.add(itemId)
    } else {
      newSelection.delete(itemId)
    }
    setSelectedIds(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)))
    }
  }

  const handleAdd = () => {
    if (selectedIds.size === 0) return

    const itemsToAdd = availableItems.filter(item => selectedIds.has(item.id))
    bulkAddItems(collectionId, itemsToAdd)

    toast({
      title: "Елементи додано",
      description: `Додано ${selectedIds.size} елементів до колекції "${collection?.name}".`,
    })

    onOpenChange(false)
  }

  const getItemIcon = (type: string) => {
    const icons = {
      Properties: Building2,
      Vehicles: Car,
      Aviation: Plane,
      Maritime: Ship,
    }
    const IconComponent = icons[type as keyof typeof icons] || Building2
    return <IconComponent className="h-4 w-4" />
  }

  const allSelected = filteredItems.length > 0 && selectedIds.size === filteredItems.length
  const someSelected = selectedIds.size > 0 && !allSelected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Додати елементи</DialogTitle>
          <DialogDescription>
            Оберіть елементи для додавання до колекції "{collection?.name}"
          </DialogDescription>
        </DialogHeader>

        {/* Фільтри та пошук */}
        <div className="px-6 py-3 border-b space-y-3">
          <div className="flex items-center gap-2">
            {/* Пошук */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Пошук по назві, коду, тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Категорії */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Всі категорії" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі категорії</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select All */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredItems.length === 0}
            >
              {allSelected ? "Скасувати всі" : "Обрати всі"}
            </Button>
          </div>

          {/* Статистика */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Доступно: {filteredItems.length} з {availableItems.length}
            </span>
            {selectedIds.size > 0 && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Обрано: {selectedIds.size}
              </Badge>
            )}
          </div>
        </div>

        {/* Список елементів */}
        <ScrollArea className="flex-1 px-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {availableItems.length === 0
                  ? "Всі доступні елементи вже в колекції"
                  : "Не знайдено елементів за вашим запитом"}
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer ${
                    selectedIds.has(item.id) ? "bg-muted/40 border-border" : "bg-card"
                  }`}
                  onClick={() => handleSelectItem(item.id, !selectedIds.has(item.id))}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    {getItemIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{item.name}</span>
                      {item.idCode && (
                        <Badge variant="outline" className="text-xs font-mono shrink-0">
                          {item.idCode}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>
                      {item.status && (
                        <span className="text-xs text-muted-foreground">{item.status}</span>
                      )}
                      {item.location && (
                        <span className="text-xs text-muted-foreground">• {item.location}</span>
                      )}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  {item.value && (
                    <div className="text-right shrink-0">
                      <span className="text-sm font-medium">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {selectedIds.size > 0
                ? `${selectedIds.size} елементів буде додано`
                : "Оберіть елементи для додавання"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Скасувати
              </Button>
              <Button onClick={handleAdd} disabled={selectedIds.size === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Додати ({selectedIds.size})
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

