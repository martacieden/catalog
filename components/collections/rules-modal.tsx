"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, X } from "lucide-react"
import { RuleBuilder } from "./rule-builder"
import { validateRules } from "@/lib/rule-engine"

interface RulesModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (rules: FilterRule[]) => void
}

export function RulesModal({ collection, open, onOpenChange, onSave }: RulesModalProps) {
  const [rules, setRules] = React.useState<FilterRule[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)

  // Ініціалізація правил при відкритті модального вікна
  React.useEffect(() => {
    if (collection && open) {
      setRules(collection.filters || [])
      setHasChanges(false)
    }
  }, [collection, open])

  // Валідація правил
  const validation = React.useMemo(() => validateRules(rules), [rules])

  const handleRulesChange = (newRules: FilterRule[]) => {
    setRules(newRules)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!validation.valid) return
    
    setIsLoading(true)
    try {
      if (onSave) {
        await onSave(rules)
      }
      setHasChanges(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving rules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      // Тут можна додати підтвердження
      const confirmed = window.confirm('У вас є незбережені зміни. Ви впевнені, що хочете закрити?')
      if (!confirmed) return
    }
    setRules(collection?.filters || [])
    setHasChanges(false)
    onOpenChange(false)
  }

  if (!collection) return null

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Collection Rules
          </DialogTitle>
          <DialogDescription>
            Filtering rules for "{collection.name}" collection
          </DialogDescription>
        </DialogHeader>


        {/* Rules Builder */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <RuleBuilder
            rules={rules}
            onChange={handleRulesChange}
            items={collection.items || []}
            showPreview={true}
            maxRules={20}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Unsaved changes
              </Badge>
            )}
            {!validation.valid && (
              <Badge variant="destructive">
                {validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || !validation.valid || !hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
