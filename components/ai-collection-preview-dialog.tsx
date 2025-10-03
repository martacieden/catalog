"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Ship,
  Sparkles,
  Users,
  Home,
  Car,
  Plane,
  Bed,
  Anchor,
  TreePine,
  Coffee,
  Utensils,
  Camera,
  MapPin,
  Briefcase,
  FileText,
  Globe,
  Calendar,
  PawPrint,
  ChevronDown,
  Circle,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  User,
  Share2,
  Tag,
} from "lucide-react"

interface AICollectionPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionType: string
}

const getCollectionInfo = (type: string) => {
  switch (type) {
    case "luxury-villas":
      return {
        name: "Luxury Villas & Properties",
        description: "Beachfront estates, hillside villas, and vacation rental properties",
        icon: Building2,
        color: "from-blue-500/20 to-cyan-500/20",
      }
    case "marina-assets":
      return {
        name: "Marina Village Assets",
        description: "Private marina, boats, water sports equipment, and marine facilities",
        icon: Ship,
        color: "from-teal-500/20 to-blue-500/20",
      }
    case "resort-amenities":
      return {
        name: "Resort Amenities",
        description: "Spa facilities, dining venues, beach club, and recreational activities",
        icon: Sparkles,
        color: "from-green-500/20 to-emerald-500/20",
      }
    case "guest-experiences":
      return {
        name: "Guest Experiences",
        description: "Activities, events, excursions, and personalized service records",
        icon: Users,
        color: "from-purple-500/20 to-pink-500/20",
      }
    case "ai-custom":
      return {
        name: "AI Generated Collection",
        description: "Collection created based on your AI query",
        icon: Sparkles,
        color: "from-indigo-500/20 to-purple-500/20",
      }
    default:
      return {
        name: "AI Suggested Collection",
        description: "AI-powered collection of related items",
        icon: Building2,
        color: "from-blue-500/20 to-cyan-500/20",
      }
  }
}

const getSuggestedItems = (type: string) => {
  switch (type) {
    case "luxury-villas":
      return [
        { id: "1", name: "Beachfront Villa Alpha", type: "Villa", location: "Ocean View", status: "Available", idCode: "PROP-001", people: 3, date: "Sep 20" },
        { id: "2", name: "Hillside Estate Beta", type: "Villa", location: "Mountain View", status: "Available", idCode: "PROP-002", people: 2, date: "Oct 15" },
        { id: "3", name: "Sunset Cove Villa", type: "Villa", location: "Beachfront", status: "Maintenance", idCode: "PROP-003", people: 1, date: "Nov 8" },
        { id: "4", name: "Royal Palm Villa", type: "Villa", location: "Garden View", status: "Available", idCode: "PROP-004", people: 4, date: "Dec 2" },
        { id: "5", name: "Paradise Heights", type: "Estate", location: "Cliffside", status: "Available", idCode: "PROP-005", people: 2, date: "Dec 12" },
        { id: "6", name: "Ocean Breeze Villa", type: "Villa", location: "Beachfront", status: "Available", idCode: "PROP-006", people: 3, date: "Dec 18" },
        { id: "7", name: "Tropical Retreat", type: "Villa", location: "Lagoon View", status: "Available", idCode: "PROP-007", people: 1, date: "Dec 25" },
        { id: "8", name: "Luxury Penthouse", type: "Penthouse", location: "Top Floor", status: "Available", idCode: "PROP-008", people: 2, date: "Jan 3" },
      ]
    case "marina-assets":
      return [
        { id: "1", name: "Yacht Serenity", type: "Yacht", location: "Dock A-1", status: "Available", idCode: "MAR-001", people: 2, date: "Sep 15" },
        { id: "2", name: "Speedboat Explorer", type: "Boat", location: "Dock B-3", status: "Available", idCode: "MAR-002", people: 1, date: "Oct 22" },
        { id: "3", name: "Kayak Set (4x)", type: "Equipment", location: "Storage", status: "Available", idCode: "MAR-003", people: 3, date: "Nov 5" },
        { id: "4", name: "Marina Office", type: "Building", location: "Main Dock", status: "Active", idCode: "MAR-004", people: 4, date: "Nov 18" },
        { id: "5", name: "Dock Lighting System", type: "Infrastructure", location: "All Docks", status: "Active", idCode: "MAR-005", people: 2, date: "Dec 1" },
        { id: "6", name: "Fuel Station", type: "Service", location: "Main Dock", status: "Active", idCode: "MAR-006", people: 1, date: "Dec 8" },
        { id: "7", name: "Water Sports Equipment", type: "Equipment", location: "Storage", status: "Available", idCode: "MAR-007", people: 2, date: "Dec 15" },
        { id: "8", name: "Dock Security System", type: "Security", location: "All Docks", status: "Active", idCode: "MAR-008", people: 1, date: "Dec 22" },
      ]
    case "resort-amenities":
      return [
        { id: "1", name: "Spa & Wellness Center", type: "Facility", location: "Main Building", status: "Active", idCode: "AMN-001", people: 3, date: "Sep 10" },
        { id: "2", name: "Fine Dining Restaurant", type: "Dining", location: "Ocean View", status: "Active", idCode: "AMN-002", people: 2, date: "Oct 5" },
        { id: "3", name: "Beach Club", type: "Recreation", location: "Beachfront", status: "Active", idCode: "AMN-003", people: 4, date: "Oct 18" },
        { id: "4", name: "Fitness Center", type: "Facility", location: "Main Building", status: "Active", idCode: "AMN-004", people: 1, date: "Nov 2" },
        { id: "5", name: "Pool Complex", type: "Recreation", location: "Garden Area", status: "Active", idCode: "AMN-005", people: 2, date: "Nov 15" },
        { id: "6", name: "Concierge Service", type: "Service", location: "Main Lobby", status: "Active", idCode: "AMN-006", people: 3, date: "Dec 1" },
        { id: "7", name: "Business Center", type: "Facility", location: "Main Building", status: "Active", idCode: "AMN-007", people: 1, date: "Dec 10" },
        { id: "8", name: "Golf Course", type: "Recreation", location: "Resort Grounds", status: "Active", idCode: "AMN-008", people: 2, date: "Dec 20" },
      ]
    case "guest-experiences":
      return [
        { id: "1", name: "Sunset Sailing Tour", type: "Excursion", location: "Marina", status: "Available", idCode: "EXP-001", people: 2, date: "Sep 25" },
        { id: "2", name: "Spa Treatment Package", type: "Wellness", location: "Spa Center", status: "Available", idCode: "EXP-002", people: 1, date: "Oct 8" },
        { id: "3", name: "Private Chef Service", type: "Dining", location: "Villa", status: "Available", idCode: "EXP-003", people: 3, date: "Oct 22" },
        { id: "4", name: "Water Sports Package", type: "Activity", location: "Beach", status: "Available", idCode: "EXP-004", people: 2, date: "Nov 5" },
        { id: "5", name: "Island Hopping Tour", type: "Excursion", location: "Marina", status: "Available", idCode: "EXP-005", people: 4, date: "Nov 18" },
        { id: "6", name: "Couples Massage", type: "Wellness", location: "Spa Center", status: "Available", idCode: "EXP-006", people: 1, date: "Dec 3" },
        { id: "7", name: "Beach Picnic Setup", type: "Activity", location: "Private Beach", status: "Available", idCode: "EXP-007", people: 2, date: "Dec 12" },
        { id: "8", name: "VIP Airport Transfer", type: "Transport", location: "Airport", status: "Available", idCode: "EXP-008", people: 1, date: "Dec 25" },
      ]
    case "ai-custom":
      return [
        { id: "1", name: "Custom AI Asset 1", type: "Custom", location: "AI Generated", status: "Active", idCode: "AI-001", people: 2, date: "Dec 1" },
        { id: "2", name: "Custom AI Asset 2", type: "Custom", location: "AI Generated", status: "Available", idCode: "AI-002", people: 1, date: "Dec 8" },
        { id: "3", name: "Custom AI Asset 3", type: "Custom", location: "AI Generated", status: "Active", idCode: "AI-003", people: 3, date: "Dec 15" },
        { id: "4", name: "Custom AI Asset 4", type: "Custom", location: "AI Generated", status: "Available", idCode: "AI-004", people: 2, date: "Dec 22" },
        { id: "5", name: "Custom AI Asset 5", type: "Custom", location: "AI Generated", status: "Active", idCode: "AI-005", people: 1, date: "Dec 29" },
      ]
    default:
      return []
  }
}

const getItemIcon = (type: string) => {
  switch (type) {
    // Legal entities
    case "Legal Entity":
    case "Company":
    case "Corporation":
      return Briefcase
    case "Document":
    case "Contract":
    case "Agreement":
      return FileText
    // Properties
    case "Villa":
    case "Estate":
    case "Penthouse":
    case "Property":
      return Home
    case "Building":
    case "Facility":
    case "Infrastructure":
      return Building2
    // Vehicles
    case "Yacht":
    case "Boat":
    case "Maritime":
      return Ship
    case "Aviation":
    case "Plane":
    case "Helicopter":
      return Plane
    case "Vehicle":
    case "Car":
    case "Transport":
      return Car
    // Organizations
    case "Organization":
    case "Service":
    case "Department":
      return Users
    case "Country":
    case "Region":
      return Globe
    // Events
    case "Event":
    case "Meeting":
    case "Excursion":
      return Calendar
    // Pets
    case "Pet":
    case "Animal":
      return PawPrint
    // Resort specific
    case "Equipment":
    case "Tool":
      return Utensils
    case "Security":
    case "Camera":
      return Camera
    case "Dining":
    case "Restaurant":
      return Coffee
    case "Recreation":
    case "Activity":
    case "Wellness":
      return TreePine
    case "Location":
    case "Address":
      return MapPin
    default:
      return Building2
  }
}

const getStatusOptions = () => [
  { value: "available", label: "Available", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "maintenance", label: "Maintenance", icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
  { value: "occupied", label: "Occupied", icon: XCircle, color: "bg-red-100 text-red-800" },
  { value: "inactive", label: "Inactive", icon: Clock, color: "bg-gray-100 text-gray-800" },
]

const getStatusInfo = (status: string) => {
  const options = getStatusOptions()
  return options.find(option => option.value === status.toLowerCase()) || options[0]
}

export function AICollectionPreviewDialog({
  open,
  onOpenChange,
  collectionType,
}: AICollectionPreviewDialogProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [itemStatuses, setItemStatuses] = React.useState<Record<string, string>>({})
  const [aiQuery, setAiQuery] = React.useState<string>("")
  const collectionInfo = React.useMemo(() => getCollectionInfo(collectionType), [collectionType])
  const suggestedItems = React.useMemo(() => getSuggestedItems(collectionType), [collectionType])

  // Initialize statuses for all items
  React.useEffect(() => {
    const initialStatuses: Record<string, string> = {}
    suggestedItems.forEach((item) => {
      initialStatuses[item.id] = item.status.toLowerCase()
    })
    setItemStatuses(initialStatuses)
  }, [suggestedItems])

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(suggestedItems.map((item) => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleStatusChange = (itemId: string, newStatus: string) => {
    setItemStatuses((prev) => ({
      ...prev,
      [itemId]: newStatus,
    }))
  }

  const handleCreateCollection = () => {
    // Handle collection creation with selected items
    console.log("Creating collection with items:", Array.from(selectedItems))
    console.log("Item statuses:", itemStatuses)
    onOpenChange(false)
  }

  const handleAiQuery = () => {
    if (aiQuery.trim()) {
      console.log("AI Query:", aiQuery)
      // Here you could integrate with AI service to modify the collection
      setAiQuery("")
    }
  }

  const allSelected = selectedItems.size === suggestedItems.length
  const someSelected = selectedItems.size > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] w-[98vw] bg-white flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-8 py-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${collectionInfo.color}`}>
              <collectionInfo.icon className="h-6 w-6 text-foreground/70" />
            </div>
            <div>
              <DialogTitle className="text-xl">{collectionInfo.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {collectionInfo.description}
              </DialogDescription>
            </div>
          </div>
          
          {/* AI Explanation */}
          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">AI Reasoning</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {collectionType === "luxury-villas" && "AI identified these properties as high-value real estate assets requiring coordinated maintenance and guest services management."}
                  {collectionType === "marina-assets" && "AI grouped these maritime assets based on operational dependencies and maintenance schedules for efficient fleet management."}
                  {collectionType === "resort-amenities" && "AI organized these facilities by guest experience flow and service integration for optimal resort operations."}
                  {collectionType === "guest-experiences" && "AI categorized these services by guest journey touchpoints and personalization opportunities for enhanced satisfaction."}
                </p>
              </div>
            </div>
          </div>

          {/* AI Query Input - Always Visible */}
          <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Want to modify this collection? (e.g., 'add only ocean view villas', 'remove maintenance items')"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAiQuery()
                  }
                }}
              />
              <Button onClick={handleAiQuery} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between flex-shrink-0 px-8 py-3 bg-white border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm font-medium">
                Select all items ({selectedItems.size}/{suggestedItems.length})
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              AI Suggested
            </Badge>
          </div>

          <div className="flex-1 min-h-0 overflow-auto px-8">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 border-b">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">People</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {suggestedItems.map((item) => {
                  const ItemIcon = getItemIcon(item.type)
                  const currentStatus = itemStatuses[item.id] || item.status.toLowerCase()
                  const statusInfo = getStatusInfo(currentStatus)
                  
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                            <ItemIcon className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {item.idCode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${statusInfo.color}`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(item.people, 2) }).map((_, index) => (
                            <div key={index} className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-blue-600" />
                            </div>
                          ))}
                          {item.people > 2 && (
                            <span className="text-xs text-gray-500 ml-1">+{item.people - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 bg-white border-t px-8 py-4">
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} className="gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              <Plus className="h-4 w-4" />
              Create Collection ({selectedItems.size} items)
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}