"use client"

import * as React from "react"
import { Send, Bot, User, RotateCcw, Edit3, ThumbsUp, ThumbsDown, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isGenerating?: boolean
  suggestions?: string[]
  canRegenerate?: boolean
}

interface AIChatProps {
  onMessage?: (message: string) => void
  onRegenerate?: (messageId: string) => void
  onEditMessage?: (messageId: string, newContent: string) => void
  initialMessages?: ChatMessage[]
  placeholder?: string
  disabled?: boolean
  className?: string
  contextBadge?: string
  quickActions?: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }>
  onSuggestionClick?: (suggestion: string) => void
}

export function AIChat({
  onMessage,
  onRegenerate,
  onEditMessage,
  initialMessages = [],
  placeholder = "Type a message...",
  disabled = false,
  className = "",
  contextBadge,
  quickActions = [],
  onSuggestionClick,
}: AIChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || disabled || isGenerating) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: generateAIResponse(inputValue.trim()),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue.trim()),
        canRegenerate: true,
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsGenerating(false)
      
      if (onMessage) {
        onMessage(inputValue.trim())
      }
    }, 1500)
  }

  const handleRegenerate = (messageId: string) => {
    if (onRegenerate) {
      onRegenerate(messageId)
    }
    
    // Find the AI message and regenerate
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: generateAIResponse(msg.content), timestamp: new Date() }
        : msg
    ))
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, timestamp: new Date() }
        : msg
    ))
    
    if (onEditMessage) {
      onEditMessage(messageId, newContent)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const responses: Record<string, string> = {
      "Analyze collection": "I've analyzed your collection and found some interesting insights. Your collection contains high-value assets with excellent diversification across categories. Here are the key findings:\n\n• Total value: $135.5M across 9 premium assets\n• Category distribution: Properties (44%), Aviation (33%), Maritime (22%)\n• All assets are currently active with high ratings\n• Maintenance alerts: 4 properties need HVAC filter replacement within 30 days",
      "Suggest rules": "Based on your collection patterns, I suggest these smart filtering rules:\n\n• Value > $1M (captures premium assets)\n• Status = Active (ensures availability)\n• Rating ≥ 4 (maintains quality)\n• Category in [Properties, Aviation, Maritime] (diversification)\n\nThese rules will automatically include similar high-value assets as they become available.",
      "Show stats": "Here are your collection statistics:\n\n📊 **Overview**\n• Total Items: 9\n• Total Value: $135,500,000\n• Average Value: $15,055,556\n\n📈 **Performance**\n• Active Items: 100%\n• High Rating Items: 100%\n• Categories: 3\n\n⚠️ **Alerts**\n• 4 properties need HVAC maintenance\n• 3 properties missing flood insurance",
    }
    
    return responses[userInput] || "I understand your request. Let me help you with that."
  }

  const generateSuggestions = (userInput: string): string[] => {
    const suggestions = [
      "Add only active items",
      "Show alternative options",
      "Group by categories",
      "Add date filters",
      "Show statistics"
    ]
    
    return suggestions.slice(0, 3)
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Context Badge */}
      {contextBadge && (
        <div className="px-4 py-2 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700 font-medium">
              Analyzing: {contextBadge}
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.type === "ai" && message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          if (onSuggestionClick) {
                            onSuggestionClick(suggestion)
                          } else {
                            // Default behavior - add as user message and generate AI response
                            const userMessage: ChatMessage = {
                              id: `user-${Date.now()}`,
                              type: "user",
                              content: suggestion,
                              timestamp: new Date(),
                            }
                            
                            setMessages(prev => [...prev, userMessage])
                            
                            // Generate AI response
                            setIsGenerating(true)
                            setTimeout(() => {
                              const aiMessage: ChatMessage = {
                                id: `ai-${Date.now()}`,
                                type: "ai",
                                content: generateAIResponse(suggestion),
                                timestamp: new Date(),
                                suggestions: generateSuggestions(suggestion),
                                canRegenerate: true,
                              }
                              
                              setMessages(prev => [...prev, aiMessage])
                              setIsGenerating(false)
                            }, 1000)
                          }
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
                
                {message.type === "ai" && message.canRegenerate && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleRegenerate(message.id)}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        const newContent = prompt("Edit message:", message.content)
                        if (newContent) handleEditMessage(message.id, newContent)
                      }}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              
              {message.type === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="flex-shrink-0 h-7 px-3 text-xs"
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="border-t p-4 bg-background sticky bottom-0 z-10">
        {/* Quick Actions */}
        <div className="mb-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setInputValue("Create a collection from all active items")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Active items
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setInputValue("Show items from last month")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Last month
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setInputValue("Group by categories")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            By categories
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isGenerating}
            className="min-h-[60px] resize-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || disabled || isGenerating}
            size="icon"
            className="self-end"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
