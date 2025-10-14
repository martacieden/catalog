"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
}

interface AvatarStackProps {
  users: User[]
  maxVisible?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarStack({ 
  users, 
  maxVisible = 3, 
  size = "md",
  className = ""
}: AvatarStackProps) {
  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = users.length - maxVisible

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6 text-xs"
      case "lg":
        return "h-10 w-10 text-sm"
      default:
        return "h-8 w-8 text-xs"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "editor":
        return "bg-green-100 text-green-600 border-green-200"
      case "viewer":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const allUserNames = users.map(user => user.name).join(", ")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex -space-x-2 ${className}`}>
            {visibleUsers.map((user, index) => (
              <Avatar 
                key={user.id} 
                className={`${getSizeClasses()} border-2 border-white hover:z-10 transition-all duration-200`}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`${getSizeClasses()} ${getRoleColor(user.role)}`}>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            
            {remainingCount > 0 && (
              <Avatar className={`${getSizeClasses()} border-2 border-white bg-gray-100 text-gray-600`}>
                <AvatarFallback className={`${getSizeClasses()} bg-gray-100 text-gray-600`}>
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-medium text-sm">Shared with:</div>
            <div className="text-xs space-y-1">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <span className="capitalize">{user.name}</span>
                  <span className="text-muted-foreground">({user.role})</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}