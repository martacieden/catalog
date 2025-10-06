"use client"

import * as React from "react"
import { Sparkles, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SearchToCollectionProps {
  searchQuery: string
  filterCount: number
  resultCount: number
}

export function SearchToCollection({ searchQuery, filterCount, resultCount }: SearchToCollectionProps) {
  const [showSuggestion, setShowSuggestion] = React.useState(false)
  const [showDialog, setShowDialog] = React.useState(false)
  const [collectionName, setCollectionName] = React.useState("")

  React.useEffect(() => {
    // Show AI suggestion after user has searched (with or without filters)
    if (searchQuery.trim()) {
      const timer = setTimeout(() => setShowSuggestion(true), 1500)
      return () => clearTimeout(timer)
    } else {
      setShowSuggestion(false)
    }
  }, [searchQuery])

  const handleCreateFromSearch = () => {
    setCollectionName(`${searchQuery} Collection`)
    setShowDialog(true)
    setShowSuggestion(false)
  }

  const handleSave = () => {
    console.log("[v0] Creating collection from search:", { collectionName, searchQuery, filterCount })
    setShowDialog(false)
    setCollectionName("")
  }

  if (!showSuggestion) return null

  return (
    <>
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">AI Suggestion</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSuggestion(false)}>
              ×
            </Button>
          </div>
          <CardDescription>
            {filterCount > 0 
              ? `You've been searching for "${searchQuery}" with ${filterCount} filters. Would you like to save this as a collection?`
              : `You've been searching for "${searchQuery}". Would you like to save this as a collection?`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateFromSearch} className="gap-2">
              <Save className="h-4 w-4" />
              Create ({resultCount} items)
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowSuggestion(false)}>
              Not now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>
              Group selected items into a new collection. Rules are optional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection name"
              />
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="mb-2 text-sm font-medium">This collection will include:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Search query: "{searchQuery}"</li>
                <li>• {filterCount} active filters</li>
                <li>• Currently {resultCount} items</li>
                <li>• Auto-updates when new items match</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!collectionName}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
