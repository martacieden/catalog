"use client"

import * as React from "react"
import { InsightData } from "@/components/ui/insight-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  X,
  ExternalLink,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  FileText,
  MessageSquare,
  Users,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InsightDetailModalProps {
  insight: InsightData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for assets and assignees
const mockAssets = [
  {
    id: "asset-1",
    name: "Beachfront Villa Alpha",
    type: "Property",
    location: "Virgin Gorda, BVI",
    value: 8500000,
    status: "Active",
    lastMaintenance: "2023-03-15",
    nextMaintenance: "2024-07-20",
  },
  {
    id: "asset-2", 
    name: "Corporate Headquarters",
    type: "Property",
    location: "New York, NY",
    value: 25000000,
    status: "Active",
    lastMaintenance: "2023-04-01",
    nextMaintenance: "2024-08-05",
  },
  {
    id: "asset-3",
    name: "Mountain Resort Estate",
    type: "Property", 
    location: "Aspen, Colorado",
    value: 12000000,
    status: "Active",
    lastMaintenance: "2023-04-10",
    nextMaintenance: "2024-08-15",
  },
  {
    id: "asset-4",
    name: "Tech Campus Building",
    type: "Property",
    location: "San Francisco, CA", 
    value: 35000000,
    status: "Active",
    lastMaintenance: "2023-04-25",
    nextMaintenance: "2024-08-30",
  }
]

const mockAssignees = [
  {
    id: "user-1",
    name: "Sarah Johnson",
    role: "Property Manager",
    avatar: null,
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "user-2", 
    name: "Mike Chen",
    role: "Maintenance Coordinator",
    avatar: null,
    email: "mike.chen@company.com",
    phone: "+1 (555) 234-5678"
  },
  {
    id: "user-3",
    name: "Emily Rodriguez",
    role: "HVAC Specialist",
    avatar: null,
    email: "emily.rodriguez@company.com", 
    phone: "+1 (555) 345-6789"
  }
]

export function InsightDetailModal({ insight, open, onOpenChange }: InsightDetailModalProps) {
  const { toast } = useToast()

  if (!insight || !insight.aiDetails) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'info': return <Info className="h-5 w-5 text-blue-600" />
      default: return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-task':
        toast({
          title: "Task Created",
          description: "Maintenance task has been created and assigned to the team.",
        })
        break
      case 'view-docs':
        toast({
          title: "Opening Documents",
          description: "Opening related maintenance documentation...",
        })
        break
      case 'contact-team':
        toast({
          title: "Contacting Team",
          description: "Sending notification to assigned team members.",
        })
        break
      default:
        toast({
          title: "Action Executed",
          description: `${action} has been completed.`,
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(insight.type)}
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {insight.aiDetails.title}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Detailed analysis and recommendations for this insight
                </DialogDescription>
              </div>
            </div>
            <Badge className={`${getTypeColor(insight.type)}`}>
              {insight.type.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {insight.aiDetails.description}
            </p>
          </div>

          {/* Affected Assets */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Affected Assets ({mockAssets.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockAssets.map((asset) => (
                <div key={asset.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{asset.name}</h4>
                      <p className="text-xs text-gray-600">{asset.type} • {asset.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {asset.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>Value: ${asset.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Last maintenance: {asset.lastMaintenance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-600">
                      <Clock className="h-3 w-3" />
                      <span>Next due: {asset.nextMaintenance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Assigned Team ({mockAssignees.length})</h3>
            <div className="space-y-2">
              {mockAssignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{assignee.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {assignee.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-600">{assignee.email}</span>
                      <span className="text-xs text-gray-600">{assignee.phone}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {insight.aiDetails.recommendations && insight.aiDetails.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Recommendations</h3>
              <ul className="space-y-2">
                {insight.aiDetails.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('create-task')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('view-docs')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Related Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('contact-team')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Contact Team
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('schedule-maintenance')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
