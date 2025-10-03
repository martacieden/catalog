"use client"

import * as React from "react"
import { Sparkles, Loader2, Wand2 } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AISuggestion {
  name: string
  description: string
  suggestedFilters: string[]
  estimatedItems: number
  confidence: "high" | "medium" | "low"
  reasoning: string
}

export function AICollectionDialog({
  trigger,
  selectedItems,
}: { trigger?: React.ReactNode; selectedItems?: string[] }) {
  const [open, setOpen] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<AISuggestion | null>(null)

  React.useEffect(() => {
    if (open && selectedItems && selectedItems.length > 0) {
      setPrompt(`Create a collection from ${selectedItems.length} selected items`)
      handleGenerate()
    }
  }, [open, selectedItems])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockSuggestions: AISuggestion[] = [
      {
        name: "Active Legal Entities 2024",
        description: "All legal entities with active status created or updated in 2024",
        suggestedFilters: ["Status: Active", "Year: 2024", "Category: Legal entities"],
        estimatedItems: selectedItems?.length || 47,
        confidence: "high",
        reasoning: "Based on your prompt, this collection focuses on recent active entities",
      },
      {
        name: "Recent Legal Entities",
        description: "Legal entities created in the last 6 months",
        suggestedFilters: ["Date: Last 6 months", "Category: Legal entities"],
        estimatedItems: selectedItems?.length || 23,
        confidence: "high",
        reasoning: "Captures the most recently added legal entities for quick access",
      },
      {
        name: "High Priority Legal Entities",
        description: "Legal entities marked as high priority or frequently accessed",
        suggestedFilters: ["Priority: High", "Category: Legal entities"],
        estimatedItems: selectedItems?.length || 15,
        confidence: "medium",
        reasoning: "Useful for tracking important entities that need regular attention",
      },
    ]

    setSuggestions(mockSuggestions)
    setIsGenerating(false)
  }

  const handleCreate = () => {
    // Handle collection creation
    console.log("[v0] Creating collection:", selectedSuggestion, "with items:", selectedItems)
    setOpen(false)
    // Reset state
    setPrompt("")
    setSuggestions([])
    setSelectedSuggestion(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Create Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Collection Creation
          </DialogTitle>
          <DialogDescription>
            {selectedItems && selectedItems.length > 0
              ? `Create a collection from ${selectedItems.length} selected item${selectedItems.length > 1 ? "s" : ""}`
              : "Describe what you want to collect, and AI will suggest the best way to organize it."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {/* AI Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">What would you like to collect?</Label>
              <div className="relative">
                <Textarea
                  id="ai-prompt"
                  placeholder="Example: I want to create a collection of all legal entities that were active in 2024..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 resize-none pr-12"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2"
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* AI Suggestions */}
            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">AI is analyzing your request...</p>
                </div>
              </div>
            )}

            {suggestions.length > 0 && !isGenerating && (
              <div className="space-y-3">
                <Label>AI Suggestions</Label>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                        selectedSuggestion === suggestion ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{suggestion.name}</h4>
                          <Badge
                            variant={suggestion.confidence === "high" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {suggestion.confidence} confidence
                          </Badge>
                        </div>
                        <Badge variant="secondary">{suggestion.estimatedItems} items</Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{suggestion.description}</p>
                      <p className="mb-3 text-xs italic text-muted-foreground">💡 {suggestion.reasoning}</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.suggestedFilters.map((filter, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual refinement */}
            {selectedSuggestion && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
                <Label>Refine Your Collection</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="collection-name" className="text-xs">
                      Collection Name
                    </Label>
                    <Input id="collection-name" defaultValue={selectedSuggestion.name} />
                  </div>
                  <div>
                    <Label htmlFor="collection-description" className="text-xs">
                      Description
                    </Label>
                    <Textarea
                      id="collection-description"
                      defaultValue={selectedSuggestion.description}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!selectedSuggestion}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
