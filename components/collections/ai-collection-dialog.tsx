"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { CollectionItem } from "@/types/collection"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ItemsTable } from "@/components/collections/items-table"
import {
  Sparkles,
  Bot,
  Send,
  Plus,
  RotateCcw,
} from "lucide-react"

interface AICollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: CollectionItem[]
  onCollectionCreated?: () => void
}

interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  isSystemMessage?: boolean
}

export function AICollectionDialog({
  open,
  onOpenChange,
  selectedItems,
  onCollectionCreated
}: AICollectionDialogProps) {
  const { addCollection } = useCollections()
  const { toast } = useToast()
  
  // Form state
  const [collectionName, setCollectionName] = useState("")
  const [collectionDescription, setCollectionDescription] = useState("")
  
  // Selection state
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Initialize AI explanation when dialog opens
  useEffect(() => {
    if (open && selectedItems.length > 0) {
      // Select all items by default
      setSelectedItemIds(new Set(selectedItems.map(item => item.id)))
      generateAIExplanation()
    }
  }, [open, selectedItems])
  
  const generateAIExplanation = () => {
    const categories = [...new Set(selectedItems.map(item => item.category))]
    const totalValue = selectedItems.reduce((sum, item) => sum + (item.value || 0), 0)
    const avgValue = totalValue / selectedItems.length
    
    const explanation = `I've analyzed your ${selectedItems.length} selected items and found some interesting patterns:

🏠 **Property Mix**: Your selection includes ${categories.length} different property types: ${categories.join(', ')}
💰 **Value Range**: Average value of $${avgValue.toLocaleString()} per property
📊 **Diversification**: ${categories.length > 1 ? 'Good diversification across property types' : 'Focused on one property type'}

These items work well together because they represent a balanced portfolio of premium properties. Would you like me to suggest a name and description for this collection?`
    
    const systemMessage: ChatMessage = {
      id: 'system-1',
      type: 'ai',
      content: explanation,
      timestamp: new Date(),
      isSystemMessage: true
    }
    
    setMessages([systemMessage])
    
    // Auto-generate collection name and description
    const suggestedName = categories.length > 1 
      ? `Premium ${categories[0]} Collection`
      : `Luxury ${categories[0]} Portfolio`
    
    const suggestedDescription = `Carefully curated collection of ${selectedItems.length} premium properties, featuring ${categories.join(', ')}. This collection represents high-value real estate investments with strong potential for appreciation.`
    
    setCollectionName(suggestedName)
    setCollectionDescription(suggestedDescription)
  }
  
  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setUserInput("")
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput)
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }
  
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('name') || input.includes('назва')) {
      return `Based on your ${selectedItems.length} properties, I suggest:
      
**"Premium Property Portfolio"** - emphasizes the high-value nature
**"Luxury Real Estate Collection"** - highlights the premium quality
**"Investment Property Mix"** - focuses on the investment angle

Which style appeals to you most?`
    }
    
    if (input.includes('description') || input.includes('опис')) {
      return `Here's a compelling description for your collection:

"*A carefully curated selection of premium properties representing diverse real estate opportunities. This collection combines luxury villas, estates, and penthouses, offering investors a balanced portfolio with strong appreciation potential and rental income opportunities.*"

Would you like me to adjust the tone or focus on any specific aspect?`
    }
    
    if (input.includes('rules') || input.includes('фільтри')) {
      return `I can suggest some smart filtering rules for this collection:

🔍 **Value-based**: Properties above $1M
📅 **Date-based**: Added in the last 6 months  
📍 **Location-based**: Premium locations only
⭐ **Rating-based**: Properties with 4+ star ratings

These rules would help automatically include similar high-value properties in the future. Would you like me to set up any of these filters?`
    }
    
    return `I understand you're asking about "${userInput}". Let me help you refine this collection. You can ask me about:
- Collection naming suggestions
- Description ideas
- Filtering rules for auto-updates
- Property analysis and insights
- Portfolio optimization tips`
  }
  
  const handleCreateCollection = () => {
    if (!collectionName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a collection name.",
        variant: "destructive"
      })
      return
    }
    
    try {
      // Get only selected items
      const itemsToInclude = selectedItems.filter(item => selectedItemIds.has(item.id))
      
      const newCollection = addCollection({
        name: collectionName,
        description: collectionDescription,
        items: itemsToInclude,
        type: "ai-generated",
        autoSync: false,
        filters: [],
        createdBy: { id: "ai-assistant", name: "AI Assistant", email: "ai@assistant.com" },
        icon: "sparkles",
        updatedAt: new Date(),
        viewCount: 0
      })
      
      toast({
        title: "Collection created",
        description: `"${collectionName}" created with ${itemsToInclude.length} items.`,
      })
      
      onCollectionCreated?.()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection.",
        variant: "destructive"
      })
    }
  }
  
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] sm:max-w-[1172px] max-h-[95vh] w-[98vw] p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 px-8 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 shadow-sm">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle>AI Collection Assistant</DialogTitle>
              <DialogDescription>
                AI generates filtering rules, you review and customize them
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex min-h-0 border-t border-gray-200 -mt-2">
          {/* Left Panel - Collection Details */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
            
            {/* Collection Form */}
            <div className="flex-1 min-h-0 overflow-auto">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Collection Name */}
                  <div className="space-y-2">
                    <Label htmlFor="collection-name">Collection Name</Label>
                    <Input
                      id="collection-name"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="Enter collection name..."
                      className="w-full"
                    />
                  </div>
                  
                  {/* Collection Description */}
                  <div className="space-y-2">
                    <Label htmlFor="collection-description">Description</Label>
                    <Textarea
                      id="collection-description"
                      value={collectionDescription}
                      onChange={(e) => setCollectionDescription(e.target.value)}
                      placeholder="Describe this collection..."
                      rows={3}
                      className="w-full resize-none"
                    />
                  </div>
                  
                  {/* Items Table */}
                  <div className="space-y-3">
                    <Label>Selected Items ({selectedItemIds.size} of {selectedItems.length})</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <ItemsTable
                        items={selectedItems}
                        selectedIds={selectedItemIds}
                        onSelectionChange={setSelectedItemIds}
                        showSelection={true}
                        showActions={false}
                        emptyMessage="No items selected"
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-3 bg-white border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCollection}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create ({selectedItemIds.size} items)
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Panel - AI Assistant */}
          <div className="w-80 bg-gray-50 flex flex-col">
            {/* AI Assistant Header */}
            <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-gray-200 bg-white">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-gray-900">AI Assistant</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAIExplanation}
                className="ml-auto p-1 h-6 w-6"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.isSystemMessage
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 bg-white text-gray-900 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Chat Input */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder="Ask me anything..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-3 pr-20 text-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100">
                        <Plus className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || isLoading}
                        className="p-1 h-8 w-8 hover:bg-gray-100"
                      >
                        <Send className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
