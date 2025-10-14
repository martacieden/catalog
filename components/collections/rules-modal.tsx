"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import { FilterRule } from "@/types/rule"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { FileText, Plus, Edit3, Trash2, TestTube, Save, X } from "lucide-react"

interface RulesModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper function to format rules
const formatRule = (rule: FilterRule) => {
  const fieldLabels: Record<string, string> = {
    category: "Category",
    status: "Status", 
    value: "Value",
    rating: "Rating",
    location: "Location",
    createdAt: "Created Date",
    updatedAt: "Updated Date"
  }
  
  const operatorLabels: Record<string, string> = {
    equals: "is",
    not_equals: "is not",
    contains: "contains",
    greater_than: "is greater than",
    less_than: "is less than",
    greater_than_or_equal: "is greater than or equal to",
    less_than_or_equal: "is less than or equal to",
    in: "is in",
    not_in: "is not in"
  }
  
  const fieldLabel = fieldLabels[rule.field] || rule.field
  const operatorLabel = operatorLabels[rule.operator] || rule.operator
  
  return `${fieldLabel} ${operatorLabel} "${rule.value}"`
}

export function RulesModal({ collection, open, onOpenChange }: RulesModalProps) {
  const { toast } = useToast()
  
  if (!collection) return null

  const hasRules = collection.filters && collection.filters.length > 0
  
  // State for editing rules
  const [editingRule, setEditingRule] = React.useState<FilterRule | null>(null)
  const [isTestingRules, setIsTestingRules] = React.useState(false)
  const [testResults, setTestResults] = React.useState<{ count: number; items: string[] } | null>(null)
  const [editingRuleData, setEditingRuleData] = React.useState({
    field: "",
    operator: "",
    value: "",
  })

  const handleEditRule = (rule: FilterRule) => {
    setEditingRule(rule)
    setEditingRuleData({
      field: rule.field,
      operator: rule.operator,
      value: String(rule.value),
    })
  }

  const handleSaveRule = () => {
    if (!editingRule || !editingRuleData.field || !editingRuleData.operator || !editingRuleData.value) {
      toast({
        title: "Validation Error",
        description: "All rule fields are required.",
        variant: "destructive",
      })
      return
    }

    // Mock save - replace with real API call
    toast({
      title: "Rule Updated",
      description: "Rule has been successfully updated.",
    })

    setEditingRule(null)
    setEditingRuleData({ field: "", operator: "", value: "" })
  }

  const handleTestRules = async () => {
    setIsTestingRules(true)
    
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock results
      const mockResults = {
        count: Math.floor(Math.random() * 50) + 1,
        items: ["Sample Item 1", "Sample Item 2", "Sample Item 3"]
      }
      
      setTestResults(mockResults)
      
      toast({
        title: "Rules Tested",
        description: `Found ${mockResults.count} items that match the current rules.`,
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test rules. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTestingRules(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Collection Rules
          </DialogTitle>
          <DialogDescription>
            Filtering rules for "{collection.name}" collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!hasRules ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Rules Defined</h3>
              <p className="text-muted-foreground mb-4">
                This collection doesn't have any filtering rules. Add rules to automatically organize items.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Rule
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {collection.filters?.length || 0} rule{(collection.filters?.length || 0) > 1 ? 's' : ''} defined
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleTestRules}
                    disabled={isTestingRules}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTestingRules ? "Testing..." : "Test Rules"}
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {collection.filters?.map((rule, index) => (
                  <div key={rule.id || index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{formatRule(rule)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {rule.field}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rule.operator}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {collection.autoSync && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-800">Auto-sync Enabled</p>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Collection automatically updates when items match these rules.
                  </p>
                </div>
              )}

              {/* Test Results */}
              {testResults && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TestTube className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Test Results</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    Found <strong>{testResults.count}</strong> items that match the current rules.
                  </p>
                  {testResults.items.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 font-medium">Sample matches:</p>
                      <ul className="text-xs text-blue-700 mt-1">
                        {testResults.items.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Rule Form */}
              {editingRule && (
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-yellow-800">Edit Rule</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingRule(null)
                        setEditingRuleData({ field: "", operator: "", value: "" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Field Select */}
                    <select 
                      className="w-32 px-3 py-2 border rounded-md text-sm"
                      value={editingRuleData.field}
                      onChange={(e) => setEditingRuleData(prev => ({ ...prev, field: e.target.value }))}
                    >
                      <option value="">Select field...</option>
                      <option value="category">Category</option>
                      <option value="status">Status</option>
                      <option value="value">Value</option>
                      <option value="rating">Rating</option>
                      <option value="location">Location</option>
                    </select>
                    
                    {/* Operator Select */}
                    <select
                      className="w-40 px-3 py-2 border rounded-md text-sm"
                      value={editingRuleData.operator}
                      onChange={(e) => setEditingRuleData(prev => ({ ...prev, operator: e.target.value }))}
                    >
                      <option value="">Select operator...</option>
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="contains">Contains</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                    </select>
                    
                    {/* Value Input */}
                    <input
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      type="text"
                      value={editingRuleData.value}
                      onChange={(e) => setEditingRuleData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Enter value"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleSaveRule}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Rule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRule(null)
                        setEditingRuleData({ field: "", operator: "", value: "" })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
