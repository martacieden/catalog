"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ManualCollectionDialog } from "@/components/manual-collection-dialog"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface AddSelectedToCollectionDialogProps {
  trigger: React.ReactNode
  selectedItemIds: string[]
}

export function AddSelectedToCollectionDialog({ trigger, selectedItemIds }: AddSelectedToCollectionDialogProps) {
  const { collections, allItems, bulkAddItems, getCollectionById } = useCollections()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [collectionId, setCollectionId] = React.useState<string>("")
  const [query, setQuery] = React.useState("")
  const selectedItems = React.useMemo(() => allItems.filter(i => selectedItemIds.includes(i.id)), [allItems, selectedItemIds])

  const filteredCollections = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return collections
    return collections.filter(c => c.name.toLowerCase().includes(q))
  }, [collections, query])

  const handleAdd = () => {
    if (!collectionId || selectedItemIds.length === 0) return
    
    const collection = getCollectionById(collectionId)
    
    // Перевірка на дублікати перед додаванням
    const existingIds = new Set((collection?.items || []).map(i => i.id))
    const newItems = selectedItems.filter(item => !existingIds.has(item.id))
    const duplicateCount = selectedItems.length - newItems.length
    
    bulkAddItems(collectionId, selectedItems)
    
    // Показуємо повідомлення залежно від результату
    if (duplicateCount === 0) {
      toast({
        title: "Елементи додано",
        description: `Додано ${newItems.length} елементів до колекції "${collection?.name}".`,
      })
    } else if (newItems.length === 0) {
      toast({
        title: "Елементи вже в колекції",
        description: `Усі ${selectedItems.length} елементів вже є в колекції "${collection?.name}".`,
        variant: "default",
      })
    } else {
      toast({
        title: "Елементи додано",
        description: `Додано ${newItems.length} нових елементів. ${duplicateCount} елементів вже були в колекції "${collection?.name}".`,
      })
    }
    
    setOpen(false)
    setCollectionId("")
  }

  // If немає колекцій — не рендеримо нічого (місце виклику має показати створення)
  if (collections.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Add to collection</DialogTitle>
          <DialogDescription>
            Choose a collection to add {selectedItems.length} selected item{selectedItems.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Search collections"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ScrollArea className="max-h-80 rounded-md border">
            <div className="divide-y">
              {filteredCollections.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCollectionId(c.id)}
                  className={`w-full text-left px-4 py-4 hover:border-primary transition-colors border-2 rounded-lg ${collectionId === c.id ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.itemCount ?? 0} items</span>
                  </div>
                  {c.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                  )}
                </button>
              ))}
              {filteredCollections.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No collections found</div>
              )}
            </div>
          </ScrollArea>

          {/* Create new collection button under the list */}
          <div className="pt-3 border-t">
            <ManualCollectionDialog
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create new collection
                </Button>
              }
              selectedItems={selectedItemIds}
              onCollectionCreated={() => {
                // Закрити цей діалог після створення колекції
                setOpen(false)
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!collectionId || selectedItemIds.length === 0} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


