"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  recommendation: {
    id: string;
    name: string;
    aiInsights: {
      patterns: Array<{
        type: string;
        count: number;
        threshold: string;
      }>;
      benefits: string[];
      analysis: string;
    };
  };
  onSendMessage?: (message: string) => void;
}

export function AIChatPanel({ recommendation, onSendMessage }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: recommendation.aiInsights.analysis,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand your request. Let me analyze this further and provide you with more specific insights about your high-value assets.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    onSendMessage?.(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Assistant (Fojo)</h3>
          <p className="text-xs text-gray-500">Analyzing your catalog</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'ai' 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100'
              }`}>
                {message.type === 'ai' ? (
                  <Bot className="w-4 h-4 text-blue-600" />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className={`flex-1 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.type === 'ai'
                    ? 'bg-white border border-gray-200 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'ai' ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about this collection..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}



