"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useCollections } from "@/contexts/collections-context"
import { useToast } from "@/hooks/use-toast"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  Send,
  Users,
  Home,
  Car,
  Plane,
  Bed,
  Anchor,
  X,
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
  TrendingUp,
  RotateCcw,
  Loader2,
  Undo2,
  Search,
  Zap,
  Trash2,
  Pen,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FilterRule } from "@/types/rule"
import { applyFilterRules } from "@/lib/rule-engine"
import { getCategoryColor } from "@/lib/collection-utils"
import { ItemsTable } from "@/components/collections/items-table"

interface AICollectionPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionType: string
  userPrompt?: string
  mode?: 'items' | 'rules' // items = традиційний режим з готовими елементами, rules = AI генерує правила
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
        color: "from-blue-500/20 to-cyan-500/20",
      }
    case "ai-custom":
      return {
        name: "AI Generated Collection",
        description: "Collection created based on your AI query",
        icon: Sparkles,
        color: "from-indigo-500/20 to-blue-500/20",
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
        { id: "1", name: "Beachfront Villa Alpha", type: "Villa", location: "Ocean View", status: "Available", idCode: "PROP-001", people: 3, date: "Sep 20", image: "/placeholder.jpg" },
        { id: "2", name: "Hillside Estate Beta", type: "Villa", location: "Mountain View", status: "Available", idCode: "PROP-002", people: 2, date: "Oct 15" },
        { id: "3", name: "Sunset Cove Villa", type: "Villa", location: "Beachfront", status: "Maintenance", idCode: "PROP-003", people: 1, date: "Nov 8", image: "/placeholder.jpg" },
        { id: "4", name: "Royal Palm Villa", type: "Villa", location: "Garden View", status: "Available", idCode: "PROP-004", people: 4, date: "Dec 2" },
        { id: "5", name: "Paradise Heights", type: "Estate", location: "Cliffside", status: "Available", idCode: "PROP-005", people: 2, date: "Dec 12", image: "/placeholder.jpg" },
        { id: "6", name: "Ocean Breeze Villa", type: "Villa", location: "Beachfront", status: "Available", idCode: "PROP-006", people: 3, date: "Dec 18" },
        { id: "7", name: "Tropical Retreat", type: "Villa", location: "Lagoon View", status: "Available", idCode: "PROP-007", people: 1, date: "Dec 25", image: "/placeholder.jpg" },
        { id: "8", name: "Luxury Penthouse", type: "Penthouse", location: "Top Floor", status: "Available", idCode: "PROP-008", people: 2, date: "Jan 3" },
        { id: "9", name: "Seaside Manor", type: "Manor", location: "Private Beach", status: "Available", idCode: "PROP-009", people: 4, date: "Jan 8", image: "/placeholder.jpg" },
        { id: "10", name: "Cliffside Residence", type: "Residence", location: "Ocean Cliff", status: "Available", idCode: "PROP-010", people: 2, date: "Jan 12" },
        { id: "11", name: "Garden Villa Suite", type: "Villa", location: "Botanical Garden", status: "Available", idCode: "PROP-011", people: 3, date: "Jan 15", image: "/placeholder.jpg" },
        { id: "12", name: "Executive Villa", type: "Villa", location: "Business District", status: "Available", idCode: "PROP-012", people: 2, date: "Jan 18" },
      ]
    case "marina-assets":
      return [
        { id: "1", name: "Yacht Serenity", type: "Yacht", location: "Dock A-1", status: "Available", idCode: "MAR-001", people: 2, date: "Sep 15", image: "/placeholder.jpg" },
        { id: "2", name: "Speedboat Explorer", type: "Boat", location: "Dock B-3", status: "Available", idCode: "MAR-002", people: 1, date: "Oct 22" },
        { id: "3", name: "Kayak Set (4x)", type: "Equipment", location: "Storage", status: "Available", idCode: "MAR-003", people: 3, date: "Nov 5", image: "/placeholder.jpg" },
        { id: "4", name: "Marina Office", type: "Building", location: "Main Dock", status: "Active", idCode: "MAR-004", people: 4, date: "Nov 18" },
        { id: "5", name: "Dock Lighting System", type: "Infrastructure", location: "All Docks", status: "Active", idCode: "MAR-005", people: 2, date: "Dec 1" },
        { id: "6", name: "Fuel Station", type: "Service", location: "Main Dock", status: "Active", idCode: "MAR-006", people: 1, date: "Dec 8", image: "/placeholder.jpg" },
        { id: "7", name: "Water Sports Equipment", type: "Equipment", location: "Storage", status: "Available", idCode: "MAR-007", people: 2, date: "Dec 15" },
        { id: "8", name: "Dock Security System", type: "Security", location: "All Docks", status: "Active", idCode: "MAR-008", people: 1, date: "Dec 22" },
        { id: "9", name: "Luxury Catamaran", type: "Yacht", location: "Dock C-2", status: "Available", idCode: "MAR-009", people: 3, date: "Jan 5", image: "/placeholder.jpg" },
        { id: "10", name: "Fishing Charter Boat", type: "Boat", location: "Dock A-5", status: "Available", idCode: "MAR-010", people: 2, date: "Jan 8" },
        { id: "11", name: "Marina Restaurant", type: "Dining", location: "Main Dock", status: "Active", idCode: "MAR-011", people: 4, date: "Jan 10", image: "/placeholder.jpg" },
        { id: "12", name: "Harbor Master Office", type: "Administrative", location: "Main Dock", status: "Active", idCode: "MAR-012", people: 1, date: "Jan 12" },
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
        { id: "9", name: "Tennis Courts", type: "Recreation", location: "Sports Complex", status: "Active", idCode: "AMN-009", people: 2, date: "Jan 5" },
        { id: "10", name: "Kids Club", type: "Facility", location: "Family Area", status: "Active", idCode: "AMN-010", people: 4, date: "Jan 8" },
        { id: "11", name: "Wine Bar", type: "Dining", location: "Main Building", status: "Active", idCode: "AMN-011", people: 1, date: "Jan 10" },
        { id: "12", name: "Library Lounge", type: "Facility", location: "Quiet Zone", status: "Active", idCode: "AMN-012", people: 2, date: "Jan 12" },
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
    case "high-value-assets":
      return [
        { 
          id: "1", 
          name: "Beachfront Villa Alpha", 
          type: "Properties", 
          category: "Properties",
          location: "Malibu", 
          status: "Available", 
          idCode: "PROP-001", 
          people: 4, 
          date: "Dec 1",
          value: 2500000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Property Deed" },
            { type: "Invoice", name: "Insurance Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 1, 2024",
          sharedWith: []
        },
        { 
          id: "2", 
          name: "Private Jet Gulfstream", 
          type: "Aviation", 
          category: "Aviation",
          location: "Miami", 
          status: "Available", 
          idCode: "AVI-001", 
          people: 2, 
          date: "Dec 8",
          value: 15000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Maintenance Agreement" },
            { type: "Invoice", name: "Fuel Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 8, 2024",
          sharedWith: []
        },
        { 
          id: "3", 
          name: "Luxury Yacht Serenity", 
          type: "Maritime", 
          category: "Maritime",
          location: "Monaco", 
          status: "Available", 
          idCode: "MAR-001", 
          people: 3, 
          date: "Dec 15",
          value: 8000000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Marina Agreement" },
            { type: "Invoice", name: "Maintenance Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 15, 2024",
          sharedWith: []
        },
        { 
          id: "4", 
          name: "Corporate Headquarters", 
          type: "Properties", 
          category: "Properties",
          location: "New York", 
          status: "Active", 
          idCode: "PROP-002", 
          people: 5, 
          date: "Dec 22",
          value: 12000000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Lease Agreement" },
            { type: "Tax Form", name: "Property Tax" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 22, 2024",
          sharedWith: []
        },
        { 
          id: "5", 
          name: "Helicopter Bell 429", 
          type: "Aviation", 
          category: "Aviation",
          location: "Los Angeles", 
          status: "Available", 
          idCode: "AVI-002", 
          people: 1, 
          date: "Jan 3",
          value: 5500000,
          guestRating: 4.4,
          lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Service Contract" },
            { type: "Invoice", name: "Insurance Premium" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 3, 2025",
          sharedWith: []
        },
        { 
          id: "6", 
          name: "Superyacht Ocean Dream", 
          type: "Maritime", 
          category: "Maritime",
          location: "Fort Lauderdale", 
          status: "Available", 
          idCode: "MAR-002", 
          people: 2, 
          date: "Jan 8",
          value: 25000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Charter Agreement" },
            { type: "Invoice", name: "Crew Salaries" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 8, 2025",
          sharedWith: []
        },
        { 
          id: "7", 
          name: "Mountain Resort Estate", 
          type: "Properties", 
          category: "Properties",
          location: "Aspen", 
          status: "Available", 
          idCode: "PROP-003", 
          people: 3, 
          date: "Jan 12",
          value: 18000000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Property Management" },
            { type: "Invoice", name: "Utilities Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 12, 2025",
          sharedWith: []
        },
        { 
          id: "8", 
          name: "Private Island Villa", 
          type: "Properties", 
          category: "Properties",
          location: "Caribbean", 
          status: "Available", 
          idCode: "PROP-004", 
          people: 4, 
          date: "Jan 15",
          value: 35000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Island Lease" },
            { type: "Invoice", name: "Maintenance Cost" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 15, 2025",
          sharedWith: []
        },
        { 
          id: "9", 
          name: "Business Jet Citation X", 
          type: "Aviation", 
          category: "Aviation",
          location: "Dallas", 
          status: "Available", 
          idCode: "AVI-003", 
          people: 2, 
          date: "Jan 18",
          value: 22000000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Hangar Lease" },
            { type: "Invoice", name: "Fuel Expenses" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 18, 2025",
          sharedWith: []
        },
        { 
          id: "10", 
          name: "Luxury Catamaran", 
          type: "Maritime", 
          category: "Maritime",
          location: "Saint-Tropez", 
          status: "Available", 
          idCode: "MAR-003", 
          people: 3, 
          date: "Jan 20",
          value: 12000000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Marina Contract" },
            { type: "Invoice", name: "Service Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 20, 2025",
          sharedWith: []
        }
      ]
    case "ai-custom":
      return [
        { 
          id: "1", 
          name: "Legal Entity Alpha", 
          type: "Legal entities", 
          category: "Legal entities",
          location: "New York", 
          status: "Active", 
          idCode: "LEG-001", 
          people: 2, 
          date: "Dec 1",
          value: 500000,
          guestRating: 4.5,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Service Agreement" },
            { type: "Tax Form", name: "Annual Report" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 1, 2024",
          sharedWith: []
        },
        { 
          id: "2", 
          name: "Beachfront Villa Beta", 
          type: "Properties", 
          category: "Properties",
          location: "Malibu", 
          status: "Available", 
          idCode: "PROP-001", 
          people: 1, 
          date: "Dec 8",
          value: 2500000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 8, 2024",
          sharedWith: []
        },
        { 
          id: "3", 
          name: "Corporate Vehicle Gamma", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Los Angeles", 
          status: "Needs Review", 
          idCode: "VEH-001", 
          people: 3, 
          date: "Dec 15",
          value: 150000,
          guestRating: 4.2,
          lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: true,
          hasFinancialDocs: true,
          documents: [
            { type: "Invoice", name: "Insurance Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 15, 2024",
          sharedWith: []
        },
        { 
          id: "4", 
          name: "Private Jet Delta", 
          type: "Aviation", 
          category: "Aviation",
          location: "Miami", 
          status: "Available", 
          idCode: "AVI-001", 
          people: 2, 
          date: "Dec 22",
          value: 15000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Maintenance Agreement" },
            { type: "Invoice", name: "Fuel Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 22, 2024",
          sharedWith: []
        },
        { 
          id: "5", 
          name: "Yacht Epsilon", 
          type: "Maritime", 
          category: "Maritime",
          location: "Monaco", 
          status: "Expired", 
          idCode: "MAR-001", 
          people: 1, 
          date: "Dec 29",
          value: 8000000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: true,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Dec 29, 2024",
          sharedWith: []
        },
        { 
          id: "6", 
          name: "Luxury Penthouse Zeta", 
          type: "Properties", 
          category: "Properties",
          location: "Manhattan", 
          status: "Available", 
          idCode: "PROP-002", 
          people: 2, 
          date: "Jan 5",
          value: 4500000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Lease Agreement" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 5, 2025",
          sharedWith: []
        },
        { 
          id: "7", 
          name: "Mountain Villa Eta", 
          type: "Properties", 
          category: "Properties",
          location: "Aspen", 
          status: "Available", 
          idCode: "PROP-003", 
          people: 4, 
          date: "Jan 12",
          value: 3200000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 12, 2025",
          sharedWith: []
        },
        { 
          id: "8", 
          name: "Beach House Theta", 
          type: "Properties", 
          category: "Properties",
          location: "Malibu", 
          status: "Available", 
          idCode: "PROP-004", 
          people: 3, 
          date: "Jan 18",
          value: 1800000,
          guestRating: 4.4,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Rental Agreement" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 18, 2025",
          sharedWith: []
        },
        { 
          id: "9", 
          name: "City Loft Iota", 
          type: "Properties", 
          category: "Properties",
          location: "San Francisco", 
          status: "Available", 
          idCode: "PROP-005", 
          people: 2, 
          date: "Jan 25",
          value: 2200000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 25, 2025",
          sharedWith: []
        },
        { 
          id: "10", 
          name: "Ranch Estate Kappa", 
          type: "Properties", 
          category: "Properties",
          location: "Texas", 
          status: "Available", 
          idCode: "PROP-006", 
          people: 6, 
          date: "Feb 1",
          value: 5500000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Purchase Agreement" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 1, 2025",
          sharedWith: []
        },
        { 
          id: "11", 
          name: "Lakeside Cabin Lambda", 
          type: "Properties", 
          category: "Properties",
          location: "Lake Tahoe", 
          status: "Available", 
          idCode: "PROP-007", 
          people: 4, 
          date: "Feb 8",
          value: 1200000,
          guestRating: 4.3,
          lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 8, 2025",
          sharedWith: []
        },
        { 
          id: "7", 
          name: "Tech Startup Inc", 
          type: "Organizations", 
          category: "Organizations",
          location: "San Francisco", 
          status: "Active", 
          idCode: "ORG-001", 
          people: 3, 
          date: "Jan 10",
          value: 1200000,
          guestRating: 4.3,
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Investment Agreement" },
            { type: "Invoice", name: "Software License" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 10, 2025",
          sharedWith: []
        },
        { 
          id: "8", 
          name: "Annual Board Meeting", 
          type: "Events", 
          category: "Events",
          location: "Conference Room", 
          status: "Scheduled", 
          idCode: "EVT-001", 
          people: 4, 
          date: "Jan 15",
          value: 15000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Agenda", name: "Meeting Agenda" },
            { type: "Report", name: "Financial Report" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 15, 2025",
          sharedWith: []
        },
        { 
          id: "9", 
          name: "Golden Retriever Max", 
          type: "Pets", 
          category: "Pets",
          location: "Home Office", 
          status: "Active", 
          idCode: "PET-001", 
          people: 1, 
          date: "Jan 20",
          value: 5000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Certificate", name: "Vaccination Record" },
            { type: "Invoice", name: "Vet Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 20, 2025",
          sharedWith: []
        },
        { 
          id: "10", 
          name: "Bank Loan Agreement", 
          type: "Obligations", 
          category: "Obligations",
          location: "Financial", 
          status: "Active", 
          idCode: "OBL-001", 
          people: 2, 
          date: "Jan 25",
          value: 500000,
          guestRating: 4.2,
          lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: true,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Loan Agreement" },
            { type: "Invoice", name: "Interest Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Jan 25, 2025",
          sharedWith: []
        },
        { 
          id: "11", 
          name: "Luxury Apartment Complex", 
          type: "Properties", 
          category: "Properties",
          location: "Manhattan", 
          status: "Available", 
          idCode: "PROP-002", 
          people: 5, 
          date: "Feb 1",
          value: 8500000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Property Deed" },
            { type: "Invoice", name: "Maintenance Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 1, 2025",
          sharedWith: []
        },
        { 
          id: "12", 
          name: "Fleet of Company Cars", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Corporate Garage", 
          status: "Active", 
          idCode: "VEH-002", 
          people: 3, 
          date: "Feb 5",
          value: 450000,
          guestRating: 4.4,
          lastUpdated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Lease Agreement" },
            { type: "Invoice", name: "Insurance Premium" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 5, 2025",
          sharedWith: []
        },
        { 
          id: "13", 
          name: "Private Helicopter", 
          type: "Aviation", 
          category: "Aviation",
          location: "Helipad", 
          status: "Available", 
          idCode: "AVI-002", 
          people: 2, 
          date: "Feb 8",
          value: 4200000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Maintenance Contract" },
            { type: "Invoice", name: "Fuel Expenses" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 8, 2025",
          sharedWith: []
        },
        { 
          id: "14", 
          name: "Luxury Speedboat", 
          type: "Maritime", 
          category: "Maritime",
          location: "Marina", 
          status: "Available", 
          idCode: "MAR-002", 
          people: 1, 
          date: "Feb 12",
          value: 1800000,
          guestRating: 4.5,
          lastUpdated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Marina Lease" },
            { type: "Invoice", name: "Service Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 12, 2025",
          sharedWith: []
        },
        { 
          id: "15", 
          name: "Investment Fund LLC", 
          type: "Legal entities", 
          category: "Legal entities",
          location: "Delaware", 
          status: "Active", 
          idCode: "LEG-002", 
          people: 4, 
          date: "Feb 15",
          value: 2500000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Operating Agreement" },
            { type: "Tax Form", name: "K-1 Form" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 15, 2025",
          sharedWith: []
        },
        { 
          id: "16", 
          name: "Ski Resort Villa", 
          type: "Properties", 
          category: "Properties",
          location: "Aspen", 
          status: "Available", 
          idCode: "PROP-003", 
          people: 3, 
          date: "Feb 18",
          value: 3200000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 18, 2025",
          sharedWith: []
        },
        { 
          id: "17", 
          name: "Sports Car Collection", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Private Garage", 
          status: "Active", 
          idCode: "VEH-003", 
          people: 2, 
          date: "Feb 20",
          value: 1200000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Insurance Policy" },
            { type: "Invoice", name: "Maintenance Cost" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 20, 2025",
          sharedWith: []
        },
        { 
          id: "18", 
          name: "Corporate Jet", 
          type: "Aviation", 
          category: "Aviation",
          location: "Private Hangar", 
          status: "Available", 
          idCode: "AVI-003", 
          people: 3, 
          date: "Feb 22",
          value: 18500000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Hangar Lease" },
            { type: "Invoice", name: "Crew Salaries" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 22, 2025",
          sharedWith: []
        },
        { 
          id: "19", 
          name: "Yacht Charter Business", 
          type: "Maritime", 
          category: "Maritime",
          location: "Monaco", 
          status: "Active", 
          idCode: "MAR-003", 
          people: 4, 
          date: "Feb 25",
          value: 6500000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Charter Agreement" },
            { type: "Invoice", name: "Maintenance Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Feb 25, 2025",
          sharedWith: []
        },
        { 
          id: "20", 
          name: "Tech Conference 2025", 
          type: "Events", 
          category: "Events",
          location: "Convention Center", 
          status: "Planned", 
          idCode: "EVT-002", 
          people: 5, 
          date: "Mar 1",
          value: 75000,
          guestRating: 4.5,
          lastUpdated: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Venue Agreement" },
            { type: "Invoice", name: "Catering Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 1, 2025",
          sharedWith: []
        },
        { 
          id: "21", 
          name: "French Bulldog Bella", 
          type: "Pets", 
          category: "Pets",
          location: "Home Office", 
          status: "Active", 
          idCode: "PET-002", 
          people: 1, 
          date: "Mar 5",
          value: 3500,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Certificate", name: "Breed Certificate" },
            { type: "Invoice", name: "Training Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 5, 2025",
          sharedWith: []
        },
        { 
          id: "22", 
          name: "Credit Line Agreement", 
          type: "Obligations", 
          category: "Obligations",
          location: "Financial", 
          status: "Active", 
          idCode: "OBL-002", 
          people: 2, 
          date: "Mar 8",
          value: 2500000,
          guestRating: 4.1,
          lastUpdated: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Credit Agreement" },
            { type: "Invoice", name: "Interest Payment" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 8, 2025",
          sharedWith: []
        },
        { 
          id: "23", 
          name: "Tech Innovation Lab", 
          type: "Organizations", 
          category: "Organizations",
          location: "Silicon Valley", 
          status: "Active", 
          idCode: "ORG-002", 
          people: 5, 
          date: "Mar 12",
          value: 8500000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Research Agreement" },
            { type: "Invoice", name: "Equipment Purchase" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 12, 2025",
          sharedWith: []
        },
        { 
          id: "24", 
          name: "Mountain Cabin Retreat", 
          type: "Properties", 
          category: "Properties",
          location: "Swiss Alps", 
          status: "Available", 
          idCode: "PROP-004", 
          people: 2, 
          date: "Mar 15",
          value: 1800000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: false,
          documents: [],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 15, 2025",
          sharedWith: []
        },
        { 
          id: "25", 
          name: "Luxury Motorcycle", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Garage", 
          status: "Active", 
          idCode: "VEH-004", 
          people: 1, 
          date: "Mar 18",
          value: 85000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Insurance Policy" },
            { type: "Invoice", name: "Service Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 18, 2025",
          sharedWith: []
        },
        { 
          id: "26", 
          name: "Business Helicopter", 
          type: "Aviation", 
          category: "Aviation",
          location: "Corporate Hangar", 
          status: "Available", 
          idCode: "AVI-004", 
          people: 2, 
          date: "Mar 20",
          value: 6500000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Maintenance Contract" },
            { type: "Invoice", name: "Fuel Expenses" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 20, 2025",
          sharedWith: []
        },
        { 
          id: "27", 
          name: "Sailing Yacht", 
          type: "Maritime", 
          category: "Maritime",
          location: "Mediterranean", 
          status: "Available", 
          idCode: "MAR-004", 
          people: 3, 
          date: "Mar 22",
          value: 3200000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Marina Agreement" },
            { type: "Invoice", name: "Crew Wages" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 22, 2025",
          sharedWith: []
        },
        { 
          id: "28", 
          name: "Hedge Fund LLC", 
          type: "Legal entities", 
          category: "Legal entities",
          location: "Cayman Islands", 
          status: "Active", 
          idCode: "LEG-003", 
          people: 3, 
          date: "Mar 25",
          value: 45000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Fund Agreement" },
            { type: "Tax Form", name: "Annual Return" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 25, 2025",
          sharedWith: []
        },
        { 
          id: "29", 
          name: "Beach House", 
          type: "Properties", 
          category: "Properties",
          location: "Hawaii", 
          status: "Available", 
          idCode: "PROP-005", 
          people: 4, 
          date: "Mar 28",
          value: 4200000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Property Deed" },
            { type: "Invoice", name: "Property Tax" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Mar 28, 2025",
          sharedWith: []
        },
        { 
          id: "30", 
          name: "Vintage Car Collection", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Classic Garage", 
          status: "Active", 
          idCode: "VEH-005", 
          people: 2, 
          date: "Apr 1",
          value: 2800000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Insurance Policy" },
            { type: "Invoice", name: "Restoration Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 1, 2025",
          sharedWith: []
        },
        { 
          id: "31", 
          name: "Private Jet Charter", 
          type: "Aviation", 
          category: "Aviation",
          location: "Global", 
          status: "Active", 
          idCode: "AVI-005", 
          people: 4, 
          date: "Apr 5",
          value: 12500000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Charter Agreement" },
            { type: "Invoice", name: "Maintenance Cost" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 5, 2025",
          sharedWith: []
        },
        { 
          id: "32", 
          name: "Mega Yacht", 
          type: "Maritime", 
          category: "Maritime",
          location: "Monaco", 
          status: "Available", 
          idCode: "MAR-005", 
          people: 5, 
          date: "Apr 8",
          value: 45000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Marina Lease" },
            { type: "Invoice", name: "Crew Salaries" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 8, 2025",
          sharedWith: []
        },
        { 
          id: "33", 
          name: "Investment Summit", 
          type: "Events", 
          category: "Events",
          location: "Dubai", 
          status: "Planned", 
          idCode: "EVT-003", 
          people: 6, 
          date: "Apr 12",
          value: 125000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Venue Contract" },
            { type: "Invoice", name: "Catering Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 12, 2025",
          sharedWith: []
        },
        { 
          id: "34", 
          name: "Siberian Husky Luna", 
          type: "Pets", 
          category: "Pets",
          location: "Country Estate", 
          status: "Active", 
          idCode: "PET-003", 
          people: 1, 
          date: "Apr 15",
          value: 2800,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Certificate", name: "Health Certificate" },
            { type: "Invoice", name: "Grooming Bill" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 15, 2025",
          sharedWith: []
        },
        { 
          id: "35", 
          name: "Real Estate Investment Trust", 
          type: "Legal entities", 
          category: "Legal entities",
          location: "Delaware", 
          status: "Active", 
          idCode: "LEG-004", 
          people: 4, 
          date: "Apr 18",
          value: 85000000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Trust Agreement" },
            { type: "Tax Form", name: "Quarterly Report" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 18, 2025",
          sharedWith: []
        },
        { 
          id: "36", 
          name: "Penthouse Suite", 
          type: "Properties", 
          category: "Properties",
          location: "London", 
          status: "Available", 
          idCode: "PROP-006", 
          people: 3, 
          date: "Apr 22",
          value: 12000000,
          guestRating: 4.9,
          lastUpdated: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Lease Agreement" },
            { type: "Invoice", name: "Service Charges" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 22, 2025",
          sharedWith: []
        },
        { 
          id: "37", 
          name: "Electric Vehicle Fleet", 
          type: "Vehicles", 
          category: "Vehicles",
          location: "Corporate Fleet", 
          status: "Active", 
          idCode: "VEH-006", 
          people: 4, 
          date: "Apr 25",
          value: 1800000,
          guestRating: 4.5,
          lastUpdated: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Fleet Agreement" },
            { type: "Invoice", name: "Charging Station" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 25, 2025",
          sharedWith: []
        },
        { 
          id: "38", 
          name: "Fighter Jet Replica", 
          type: "Aviation", 
          category: "Aviation",
          location: "Museum", 
          status: "Display", 
          idCode: "AVI-006", 
          people: 1, 
          date: "Apr 28",
          value: 8500000,
          guestRating: 4.7,
          lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Museum Agreement" },
            { type: "Invoice", name: "Maintenance Cost" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "Apr 28, 2025",
          sharedWith: []
        },
        { 
          id: "39", 
          name: "Research Vessel", 
          type: "Maritime", 
          category: "Maritime",
          location: "Arctic", 
          status: "Active", 
          idCode: "MAR-006", 
          people: 6, 
          date: "May 1",
          value: 28000000,
          guestRating: 4.6,
          lastUpdated: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Research Agreement" },
            { type: "Invoice", name: "Fuel Expenses" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "May 1, 2025",
          sharedWith: []
        },
        { 
          id: "40", 
          name: "Global Tech Conference", 
          type: "Events", 
          category: "Events",
          location: "Singapore", 
          status: "Scheduled", 
          idCode: "EVT-004", 
          people: 8, 
          date: "May 5",
          value: 250000,
          guestRating: 4.8,
          lastUpdated: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
          flagged: false,
          hasFinancialDocs: true,
          documents: [
            { type: "Contract", name: "Venue Agreement" },
            { type: "Invoice", name: "Production Cost" }
          ],
          createdBy: { name: "AI Assistant", avatar: "AI" },
          createdOn: "May 5, 2025",
          sharedWith: []
        }
      ]
    default:
      return []
  }
}

const getItemIcon = (type: string) => {
  switch (type) {
    // Legal entities
    case "Legal entities":
    case "Legal Entity":
    case "Company":
    case "Corporation":
      return Building2
    // Properties
    case "Properties":
    case "Property":
    case "Villa":
    case "Estate":
    case "Penthouse":
    case "Building":
    case "Facility":
    case "Infrastructure":
      return Building2
    // Vehicles
    case "Vehicles":
    case "Vehicle":
    case "Car":
    case "Transport":
      return Car
    // Aviation
    case "Aviation":
    case "Plane":
    case "Helicopter":
      return Plane
    // Maritime
    case "Maritime":
    case "Yacht":
    case "Boat":
      return Ship
    // Organizations
    case "Organizations":
    case "Organization":
    case "Service":
    case "Department":
      return Users
    // Events
    case "Events":
    case "Event":
    case "Meeting":
    case "Excursion":
      return Calendar
    // Pets
    case "Pets":
    case "Pet":
    case "Animal":
      return PawPrint
    default:
      return Building2
  }
}

// Компонент для відображення сірого фону з іконкою
const ItemThumbnail = ({ item }: { item: any }) => {
  const ItemIcon = getItemIcon(item.type)
  
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
      <ItemIcon className="h-4 w-4" />
    </div>
  )
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
  userPrompt = "",
  mode = 'items', // default до традиційного режиму
}: AICollectionPreviewDialogProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [itemStatuses, setItemStatuses] = React.useState<Record<string, string>>({})
  const [aiQuery, setAiQuery] = React.useState<string>("")
  const [isProcessingQuery, setIsProcessingQuery] = React.useState<boolean>(false)
  const [queryResult, setQueryResult] = React.useState<string>("")
  const [suggestedItems, setSuggestedItems] = React.useState<any[]>([])
  
  // ===== NEW: Rules-based mode states =====
  const [workingMode, setWorkingMode] = React.useState<'items' | 'rules'>(mode)
  const [proposedRules, setProposedRules] = React.useState<FilterRule[]>([])
  const [collectionName, setCollectionName] = React.useState("")
  const [collectionDescription, setCollectionDescription] = React.useState("")
  const [showRulesConfirmation, setShowRulesConfirmation] = React.useState(false)
  const [rulePreviewCount, setRulePreviewCount] = React.useState(0)
  // Mock data pool - в реальному застосунку це буде з API/context
  const [allAvailableItems, setAllAvailableItems] = React.useState<any[]>(getSuggestedItems('ai-custom'))
  // Additional items added by AI in Rules mode
  const [additionalItems, setAdditionalItems] = React.useState<any[]>([])
  const [undoHistory, setUndoHistory] = React.useState<Array<{
    items: any[]
    selected: Set<string>
    queryResult: string
  }>>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")
  const [chatMessages, setChatMessages] = React.useState<Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }>>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isScrolledToBottom, setIsScrolledToBottom] = React.useState(true)
  const [newMessagesCount, setNewMessagesCount] = React.useState(0)
  const [lastMessageId, setLastMessageId] = React.useState<string | null>(null)
  const [showNewMessagesIndicator, setShowNewMessagesIndicator] = React.useState(false)
  const [firstAIResponseId, setFirstAIResponseId] = React.useState<string | null>(null)
  const [showFollowUpActions, setShowFollowUpActions] = React.useState(true)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const collectionInfo = React.useMemo(() => getCollectionInfo(collectionType), [collectionType])
  
  // Collections context, toast, and router
  const { addAICollection } = useCollections()
  const { toast } = useToast()
  const router = useRouter()
  
  // ===== NEW: Rules Generation Functions =====
  const generateRulesFromPrompt = React.useCallback((prompt: string): FilterRule[] => {
    const lowerPrompt = prompt.toLowerCase()
    const rules: FilterRule[] = []
    
    if (lowerPrompt.includes('active legal entities from 2024')) {
      rules.push({
        id: `rule-${Date.now()}-1`,
        field: 'type',
        operator: 'equals',
        value: 'Legal entities'
      })
      rules.push({
        id: `rule-${Date.now()}-2`,
        field: 'status',
        operator: 'equals',
        value: 'Active'
      })
    } else if (lowerPrompt.includes('high-value assets above 1m')) {
      rules.push({
        id: `rule-${Date.now()}-1`,
        field: 'value',
        operator: 'greater_than',
        value: 1000000
      })
    } else if (lowerPrompt.includes('available properties for rent')) {
      rules.push({
        id: `rule-${Date.now()}-1`,
        field: 'type',
        operator: 'equals',
        value: 'Properties'
      })
      rules.push({
        id: `rule-${Date.now()}-2`,
        field: 'status',
        operator: 'equals',
        value: 'Available'
      })
    } else {
      rules.push({
        id: `rule-${Date.now()}-1`,
        field: 'name',
        operator: 'contains',
        value: prompt.slice(0, 20)
      })
    }
    
    return rules
  }, [])
  
  const generateCollectionName = React.useCallback((prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('legal')) return 'Active Legal Entities 2024'
    if (lowerPrompt.includes('high-value')) return 'High-Value Assets'
    if (lowerPrompt.includes('properties')) return 'Properties Collection'
    if (lowerPrompt.includes('vehicle')) return 'Vehicles Collection'
    
    return prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '')
  }, [])
  
  // ===== NEW: Initialize Rules Mode =====
  React.useEffect(() => {
    if (open && workingMode === 'rules' && userPrompt) {
      const generatedRules = generateRulesFromPrompt(userPrompt)
      const generatedName = generateCollectionName(userPrompt)
      
      setProposedRules(generatedRules)
      setCollectionName(generatedName)
      setCollectionDescription(`Collection created based on AI analysis: "${userPrompt}". This collection will automatically include objects that match the defined filtering criteria.`)
      setShowRulesConfirmation(true)
    }
  }, [open, workingMode, userPrompt, generateRulesFromPrompt, generateCollectionName])
  
  // ===== NEW: Update rule preview count =====
  React.useEffect(() => {
    if (workingMode === 'rules' && proposedRules.length > 0) {
      // Combine original items with additional items added by AI
      const combinedItems = [...allAvailableItems, ...additionalItems]
      const matched = applyFilterRules(combinedItems, proposedRules)
      // Ensure minimum 4 items are shown
      setRulePreviewCount(Math.max(matched.length, 4))
    } else if (workingMode === 'rules') {
      // Show minimum 4 items even when no rules
      setRulePreviewCount(4)
    }
  }, [proposedRules, workingMode, allAvailableItems, additionalItems])

  // ===== NEW: Auto-chat messages for rule changes =====
  const addAutoChatMessage = React.useCallback((message: string, type: 'user' | 'ai' = 'user') => {
    const newMessage = {
      id: `${type}-${Date.now()}`,
      type,
      content: message,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, newMessage])
  }, [])

  // Track previous rules to detect significant changes only
  const prevRulesRef = React.useRef<FilterRule[]>([])
  const rulesChangeTimeoutRef = React.useRef<NodeJS.Timeout>()
  
  React.useEffect(() => {
    if (workingMode === 'rules' && proposedRules.length > 0) {
      // Clear previous timeout
      if (rulesChangeTimeoutRef.current) {
        clearTimeout(rulesChangeTimeoutRef.current)
      }
      
      // Debounce rule changes to avoid logging every keystroke
      rulesChangeTimeoutRef.current = setTimeout(() => {
        const prevRules = prevRulesRef.current
        
        // Only log significant structural changes (adding/removing rules, not editing values)
        if (prevRules.length > 0) {
          // Check if rules were added (significant change)
          if (proposedRules.length > prevRules.length) {
            const newRules = proposedRules.filter(rule => !prevRules.some(prevRule => prevRule.id === rule.id))
            if (newRules.length > 0) {
              addAutoChatMessage(`🔧 Added ${newRules.length} new filter rule${newRules.length > 1 ? 's' : ''} to refine collection criteria.`)
            }
          }
          
          // Check if rules were removed (significant change)
          if (proposedRules.length < prevRules.length) {
            const removedRules = prevRules.filter(prevRule => !proposedRules.some(rule => rule.id === prevRule.id))
            if (removedRules.length > 0) {
              addAutoChatMessage(`🗑️ Removed ${removedRules.length} filter rule${removedRules.length > 1 ? 's' : ''} from collection criteria.`)
            }
          }
        }
        
        prevRulesRef.current = [...proposedRules]
      }, 1000) // Wait 1 second after last change
    }
  }, [proposedRules, workingMode, addAutoChatMessage])

  // Track previous selected items to detect significant changes only
  const prevSelectedItemsRef = React.useRef<Set<string>>(new Set())
  const selectionChangeTimeoutRef = React.useRef<NodeJS.Timeout>()
  
  React.useEffect(() => {
    if (workingMode === 'rules') {
      // Clear previous timeout
      if (selectionChangeTimeoutRef.current) {
        clearTimeout(selectionChangeTimeoutRef.current)
      }
      
      // Debounce selection changes to avoid logging every click
      selectionChangeTimeoutRef.current = setTimeout(() => {
        const prevSelected = prevSelectedItemsRef.current
        const currentSelected = selectedItems
        
        // Only log if there was a previous selection to compare
        if (prevSelected.size > 0 || currentSelected.size > 0) {
          // Check if items were removed (significant change)
          const removedItems = Array.from(prevSelected).filter(id => !currentSelected.has(id))
          if (removedItems.length > 0) {
            addAutoChatMessage(`❌ Removed ${removedItems.length} item${removedItems.length > 1 ? 's' : ''} from collection preview.`)
          }
          
          // Check if items were added (significant change)
          const addedItems = Array.from(currentSelected).filter(id => !prevSelected.has(id))
          if (addedItems.length > 0) {
            addAutoChatMessage(`✅ Added ${addedItems.length} item${addedItems.length > 1 ? 's' : ''} to collection preview.`)
          }
        }
        
        prevSelectedItemsRef.current = new Set(currentSelected)
      }, 500) // Wait 0.5 seconds after last change
    }
  }, [selectedItems, workingMode, addAutoChatMessage])

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (rulesChangeTimeoutRef.current) {
        clearTimeout(rulesChangeTimeoutRef.current)
      }
      if (selectionChangeTimeoutRef.current) {
        clearTimeout(selectionChangeTimeoutRef.current)
      }
    }
  }, [])
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = React.useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      setIsScrolledToBottom(true)
      setUnreadCount(0)
      setNewMessagesCount(0)
      setShowNewMessagesIndicator(false)
    }
  }, [])
  
  // Check if user is scrolled to bottom
  const handleScroll = React.useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      setIsScrolledToBottom(isAtBottom)
      
      if (isAtBottom) {
        setUnreadCount(0)
        setNewMessagesCount(0)
        setShowNewMessagesIndicator(false)
      }
    }
  }, [])
  
  // Handle new messages logic
  React.useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1]
      
      // If this is a new message (different from last tracked)
      if (lastMessage.id !== lastMessageId) {
        setLastMessageId(lastMessage.id)
        
        // Track first AI response for follow-up buttons
        if (lastMessage.type === 'ai' && !firstAIResponseId) {
          setFirstAIResponseId(lastMessage.id)
        }
        
        // Hide follow-up actions after first user message after AI response
        if (lastMessage.type === 'user' && firstAIResponseId && showFollowUpActions) {
          setShowFollowUpActions(false)
        }
        
        if (isScrolledToBottom) {
          // User is at bottom, auto-scroll
          setTimeout(() => scrollToBottom(), 100)
        } else {
          // User is not at bottom, show indicator
          setNewMessagesCount(prev => prev + 1)
          setShowNewMessagesIndicator(true)
        }
      }
    }
  }, [chatMessages, isScrolledToBottom, lastMessageId, firstAIResponseId, scrollToBottom])
  
  // Handle new messages indicator click
  const handleNewMessagesClick = React.useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])
  
  // Handle collection creation
  const handleCreateCollection = React.useCallback(() => {
    const selectedItemsList = suggestedItems.filter(item => selectedItems.has(item.id))
    
    // If no items selected, create mock items for demonstration
    let itemsToInclude = selectedItemsList
    if (itemsToInclude.length === 0) {
      // Create mock high-value assets for demonstration
      itemsToInclude = [
        {
          id: `mock-${Date.now()}-1`,
          name: "Luxury Villa Alpha",
          category: "Real Estate",
          type: "document" as const,
          createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
          createdAt: new Date(),
          lastUpdated: new Date().toISOString(),
          pinned: false,
          sharedWith: [],
          value: 2500000,
          rating: 4.8,
          status: "Active"
        },
        {
          id: `mock-${Date.now()}-2`,
          name: "Premium Marina Slip",
          category: "Marine Assets",
          type: "document" as const,
          createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
          createdAt: new Date(),
          lastUpdated: new Date().toISOString(),
          pinned: false,
          sharedWith: [],
          value: 1800000,
          rating: 4.9,
          status: "Active"
        },
        {
          id: `mock-${Date.now()}-3`,
          name: "Executive Penthouse",
          category: "Real Estate",
          type: "document" as const,
          createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
          createdAt: new Date(),
          lastUpdated: new Date().toISOString(),
          pinned: false,
          sharedWith: [],
          value: 3200000,
          rating: 4.7,
          status: "Active"
        },
        {
          id: `mock-${Date.now()}-4`,
          name: "Private Jet Hangar",
          category: "Aviation",
          type: "document" as const,
          createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
          createdAt: new Date(),
          lastUpdated: new Date().toISOString(),
          pinned: false,
          sharedWith: [],
          value: 4500000,
          rating: 4.9,
          status: "Active"
        }
      ]
    }
    
    // Create collection name based on user prompt or collection type
    const collectionName = userPrompt 
      ? `AI Collection: ${userPrompt.slice(0, 50)}${userPrompt.length > 50 ? '...' : ''}`
      : `AI Generated Collection - ${collectionInfo.name}`
    
    const collectionDescription = userPrompt 
      ? `Collection created based on your AI query: "${userPrompt}"`
      : `Collection created based on your AI query. The items have been intelligently grouped to meet your needs.`
    
    // Add collection to context and get the created collection
    const newCollection = addAICollection(collectionName, collectionDescription, itemsToInclude)
    
    // Show success toast
    const itemsMessage = itemsToInclude.length > 0 
      ? `with ${itemsToInclude.length} items`
      : `(empty - you can add items later)`
    toast({
      title: "Collection created successfully! 🎉",
      description: `"${collectionName}" has been added to your collections ${itemsMessage}.`,
    })
    
    // Close dialog
    onOpenChange(false)
  }, [selectedItems, suggestedItems, userPrompt, collectionInfo.name, addAICollection, toast, onOpenChange, router])
  
  // Handle follow-up actions
  const handleFollowUpAction = React.useCallback((action: string) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: action,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setShowFollowUpActions(false) // Hide follow-up buttons after use
    
    // Show loading state
    setIsProcessingQuery(true)
    
    // Simulate AI processing for follow-up action
    setTimeout(() => {
      let aiResponse = ""
      let modifiedItems = suggestedItems
      
      switch (action) {
        case "Add more items":
          // Add 2 new mock items
          const newItems = [
            {
              id: `new-${Date.now()}-1`,
              name: "Additional Property Alpha",
              type: "Properties",
              category: "Properties",
              location: "New Location",
              status: "Available",
              idCode: `PROP-${Date.now()}`,
              people: 2,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: 1200000,
              guestRating: 4.3,
              lastUpdated: new Date().toISOString(),
              flagged: false,
              hasFinancialDocs: false,
              documents: [],
              createdBy: { name: "AI Assistant", avatar: "AI" },
              createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              sharedWith: []
            },
            {
              id: `new-${Date.now()}-2`,
              name: "Additional Vehicle Beta",
              type: "Vehicles",
              category: "Vehicles",
              location: "Garage",
              status: "Available",
              idCode: `VEH-${Date.now()}`,
              people: 1,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: 75000,
              guestRating: 4.1,
              lastUpdated: new Date().toISOString(),
              flagged: false,
              hasFinancialDocs: true,
              documents: [{ type: "Invoice", name: "Purchase Receipt" }],
              createdBy: { name: "AI Assistant", avatar: "AI" },
              createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              sharedWith: []
            }
          ]
          modifiedItems = [...suggestedItems, ...newItems]
          setSuggestedItems(modifiedItems)
          setSelectedItems(new Set(modifiedItems.map(item => item.id)))
          aiResponse = `✅ I've added 2 new items to your collection: "Additional Property Alpha" and "Additional Vehicle Beta". The collection now has ${modifiedItems.length} items total.`
          break
          
        case "Rename collection":
          aiResponse = `✅ I've renamed your collection to "Enhanced ${collectionInfo.name}". The new name better reflects the updated content and scope of your collection.`
          break
          
        case "Export list":
          aiResponse = `✅ I've prepared an export of your collection with ${suggestedItems.length} items. The export includes all item details, categories, and metadata. You can download the CSV file or copy the data to your clipboard.`
          break
          
        default:
          aiResponse = `I've processed your request: "${action}". The collection has been updated accordingly.`
      }
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, aiMessage])
      setIsProcessingQuery(false)
    }, 2000)
  }, [suggestedItems, collectionInfo.name])
  
  // Filtered items based on search and category
  const filteredItems = React.useMemo(() => {
    return suggestedItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.idCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filterCategory === "all" || item.type === filterCategory
      
      return matchesSearch && matchesCategory
    })
  }, [suggestedItems, searchQuery, filterCategory])
  
  // Get unique categories for filter
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(suggestedItems.map(item => item.type))]
    return [{ value: "all", label: "All Categories" }, ...uniqueCategories.map(cat => ({ value: cat, label: cat }))]
  }, [suggestedItems])
  
  // Initialize suggested items
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AI Collection Preview - collectionType:', collectionType)
      console.log('AI Collection Preview - getSuggestedItems result:', getSuggestedItems(collectionType))
    }
    setSuggestedItems(getSuggestedItems(collectionType))
  }, [collectionType])

  // Initialize chat with user prompt
  React.useEffect(() => {
    if (userPrompt && open) {
          setChatMessages([
            {
              id: 'user-1',
              type: 'user',
              content: userPrompt,
              timestamp: new Date()
            },
            {
              id: 'ai-1',
              type: 'ai',
              content: `I've analyzed your request "${userPrompt}" and created this custom collection based on your specific criteria. The items have been intelligently grouped to meet your needs.`,
              timestamp: new Date()
            }
          ])
      setFirstAIResponseId('ai-1') // Set first AI response ID
      setShowFollowUpActions(true) // Reset follow-up actions for new conversation
    }
  }, [userPrompt, open])

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


  const handleAiQuery = () => {
    if (aiQuery.trim()) {
      // Add user message to chat
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: aiQuery,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, userMessage])
      
      // Show loading state
      setIsProcessingQuery(true)
      
      // Different logic for Rules mode vs Items mode
      if (workingMode === 'rules') {
        // Rules mode: AI adds items to the available pool
        setTimeout(() => {
          const thinkingMessage = {
            id: `ai-thinking-${Date.now()}`,
            type: 'ai' as const,
            content: `🤔 Analyzing your request: "${aiQuery}"... Let me add items to your collection.`,
            timestamp: new Date()
          }
          setChatMessages(prev => [...prev, thinkingMessage])
          
          setTimeout(() => {
            // Generate new items based on the query
            const newItems = generateItemsForRulesMode(aiQuery)
            setAdditionalItems(prev => [...prev, ...newItems])
            
            const actionMessage = {
              id: `ai-action-${Date.now()}`,
              type: 'ai' as const,
              content: `✅ I've added ${newItems.length} new items to your collection: "${newItems.map(item => item.name).join('", "')}". The collection now has ${allAvailableItems.length + additionalItems.length + newItems.length} items total.`,
              timestamp: new Date()
            }
            setChatMessages(prev => [...prev, actionMessage])
            
            setAiQuery("")
            setIsProcessingQuery(false)
          }, 1000)
        }, 1000)
      } else {
        // Original Items mode logic
        setUndoHistory(prev => [...prev, {
          items: [...suggestedItems],
          selected: new Set(selectedItems),
          queryResult: queryResult
        }])
        
        setTimeout(() => {
          const thinkingMessage = {
            id: `ai-thinking-${Date.now()}`,
            type: 'ai' as const,
            content: `🤔 Analyzing your request: "${aiQuery}"... Let me process this step by step.`,
            timestamp: new Date()
          }
          setChatMessages(prev => [...prev, thinkingMessage])
          
          setTimeout(() => {
            const processingMessage = {
              id: `ai-processing-${Date.now()}`,
              type: 'ai' as const,
              content: `🔍 Understanding the context... I need to remove 1 item from the collection.`,
              timestamp: new Date()
            }
            setChatMessages(prev => [...prev, processingMessage])
            
            setTimeout(() => {
              const modifiedItems = processAIQuery(aiQuery, suggestedItems)
              setSuggestedItems(modifiedItems)
              setSelectedItems(new Set(modifiedItems.map(item => item.id)))
              
              const actionMessage = {
                id: `ai-action-${Date.now()}`,
                type: 'ai' as const,
                content: `✅ Done! ${getAIExplanation(aiQuery, modifiedItems.length)}`,
                timestamp: new Date()
              }
              setChatMessages(prev => [...prev, actionMessage])
              
              setAiQuery("")
              setIsProcessingQuery(false)
            }, 1000)
          }, 1000)
        }, 1000)
      }
    }
  }

  // Generate items for Rules mode based on AI query
  const generateItemsForRulesMode = (query: string) => {
    const timestamp = Date.now()
    const baseItems = [
      {
        id: `ai-added-${timestamp}-1`,
        name: "Additional Property Alpha",
        type: "Properties",
        status: "Available",
        location: "Coastal Area",
        value: 850000,
        people: [{ name: "John Smith", avatar: "JS" }],
        createdAt: new Date().toISOString(),
        flagged: false,
        hasFinancialDocs: true,
        documents: [
          { type: "Contract", name: "Rental Agreement" }
        ],
        createdBy: { name: "AI Assistant", avatar: "AI" },
        createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        sharedWith: []
      },
      {
        id: `ai-added-${timestamp}-2`,
        name: "Additional Vehicle Beta",
        type: "Vehicles",
        status: "Available",
        location: "Garage A",
        value: 45000,
        people: [{ name: "Sarah Johnson", avatar: "SJ" }],
        createdAt: new Date().toISOString(),
        flagged: false,
        hasFinancialDocs: true,
        documents: [
          { type: "Invoice", name: "Purchase Receipt" }
        ],
        createdBy: { name: "AI Assistant", avatar: "AI" },
        createdOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        sharedWith: []
      }
    ]
    
    return baseItems
  }

  const getAIExplanation = (query: string, itemCount: number) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('high-value') || lowerQuery.includes('high value')) {
      return `I've reviewed all registered assets and selected those with a current valuation above $1M or marked as high-insurance items. These represent your most valuable holdings across categories.`
    }
    
    if (lowerQuery.includes('guest preferences') || lowerQuery.includes('guest')) {
      return `Based on guest activity and shared preferences, I've grouped properties, vehicles, and experiences that have been most frequently used or rated positively by guests.`
    }
    
    if (lowerQuery.includes('legal entities') || lowerQuery.includes('legal') || lowerQuery.includes('2024')) {
      return `I've analyzed your request for "active legal entities from 2024" and created this custom collection based on registration and renewal data. These entities were established or re-verified during 2024.`
    }
    
    if (lowerQuery.includes('recent') || lowerQuery.includes('recently updated') || lowerQuery.includes('updated')) {
      return `I've gathered all catalog items that have been updated or modified in the last 30 days — including changes in ownership, documents, or metadata.`
    }
    
    if (lowerQuery.includes('attention') || lowerQuery.includes('needs attention') || lowerQuery.includes('flagged')) {
      return `These objects require your attention due to missing documents, expired dates, or flagged review statuses. I recommend reviewing and updating them soon.`
    }
    
    if (lowerQuery.includes('financial') || lowerQuery.includes('financial docs') || lowerQuery.includes('documents')) {
      return `I've identified all objects linked with active financial or accounting documentation, including invoices and tax reports. This view helps consolidate all financial-related records.`
    }
    
    return `I've processed your request "${query}" and updated the collection with ${itemCount} items. The collection has been modified based on your criteria.`
  }

  const processAIQuery = (query: string, items: any[]) => {
    const lowerQuery = query.toLowerCase()
    
    // Smart Collection Prompts Logic
    
    // 1. High-value assets
    if (lowerQuery.includes('high-value') || lowerQuery.includes('high value')) {
      return items.filter(item => 
        item.type === 'Properties' || 
        item.type === 'Aviation' || 
        item.type === 'Maritime' ||
        (item.value && item.value > 1000000) // Mock high value threshold
      )
    }
    
    // 2. Guest preferences
    if (lowerQuery.includes('guest preferences') || lowerQuery.includes('guest')) {
      return items.filter(item => 
        item.type === 'Properties' || 
        item.type === 'Aviation' || 
        item.type === 'Maritime' ||
        item.guestRating > 4 // Mock guest rating
      )
    }
    
    // 3. Legal entities 2024
    if (lowerQuery.includes('legal entities') || lowerQuery.includes('legal') || lowerQuery.includes('2024')) {
      return items.filter(item => 
        item.type === 'Legal entities' && 
        item.date.includes('Dec') // Mock 2024 data
      )
    }
    
    // 4. Recent updates
    if (lowerQuery.includes('recent') || lowerQuery.includes('recently updated') || lowerQuery.includes('updated')) {
      // Mock: items updated in last 30 days
      const recentItems = items.filter(item => 
        item.lastUpdated && 
        new Date(item.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      return recentItems.length > 0 ? recentItems : items.slice(0, 3) // Fallback to first 3 items
    }
    
    // 5. Needs attention
    if (lowerQuery.includes('attention') || lowerQuery.includes('needs attention') || lowerQuery.includes('flagged')) {
      return items.filter(item => 
        item.status === 'Needs Review' || 
        item.status === 'Expired' ||
        item.flagged === true ||
        !item.documents // Missing documents
      )
    }
    
    // 6. Financial docs
    if (lowerQuery.includes('financial') || lowerQuery.includes('financial docs') || lowerQuery.includes('documents')) {
      return items.filter(item => 
        item.type === 'Legal entities' || 
        item.hasFinancialDocs === true ||
        item.documents?.some((doc: any) => 
          doc.type === 'Invoice' || 
          doc.type === 'Tax Form' || 
          doc.type === 'Contract'
        )
      )
    }
    
    // Legacy support for other queries
    if (lowerQuery.includes('remove') || lowerQuery.includes('delete') || lowerQuery.includes('видали')) {
      if (items.length > 0) {
        return items.slice(0, -1)
      }
      return items
    }
    
    if (lowerQuery.includes('active') || lowerQuery.includes('only active')) {
      return items.filter(item => item.status.toLowerCase() === 'active')
    }
    
    // Default: return original items
    return items
  }

  const handleRegenerateCollection = () => {
    // TODO: Implement AI collection regeneration
    setTimeout(() => {
      // Regeneration complete
    }, 1500)
  }

  const handleRefineCollection = (refinement: string) => {
    // TODO: Implement AI collection refinement
    setTimeout(() => {
      // Refinement complete
    }, 1000)
  }

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const lastState = undoHistory[undoHistory.length - 1]
      
      // Restore previous state
      setSuggestedItems(lastState.items)
      setSelectedItems(lastState.selected)
      setQueryResult(lastState.queryResult)
      
      // Remove last state from history
      setUndoHistory(prev => prev.slice(0, -1))
    }
  }

  const allSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length
  const someSelected = selectedItems.size > 0 && !allSelected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] sm:max-w-[1172px] max-h-[95vh] w-[98vw] p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 px-8 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 shadow-sm">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {workingMode === 'rules' ? 'Collection' : 'AI Generated Collection'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground -mt-1">
                  {workingMode === 'rules' 
                    ? 'AI generates filtering rules, you review and customize them' 
                    : 'Collection created based on your AI query'
                  }
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => onOpenChange?.(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 border-t border-gray-200 -mt-2">
          {/* Left Section - Data Table or Rules Builder */}
          <div className="flex-[0_0_800px] flex flex-col min-h-0 border-r border-gray-200">
            
            {/* ===== NEW: Compact Rules Mode UI ===== */}
            {workingMode === 'rules' && showRulesConfirmation ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* All Content with Scroll */}
                <div className="flex-1 min-h-0 overflow-auto p-4">
                  <div className="space-y-4">
                    {/* Collection Name and Description */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="Enter collection name..."
                          className="mt-1"
                    />
                  </div>
                  
                      <div>
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                          value={collectionDescription || userPrompt || collectionInfo.description}
                          onChange={(e) => setCollectionDescription(e.target.value)}
                          placeholder="Enter collection description..."
                          className="mt-1 resize-none"
                          rows={2}
                        />
                </div>
                          </div>
                    
                    {/* Filter Criteria - Compact View */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Filter criteria</span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Pen className="w-3 h-3" />
                          Customize filters
                        </button>
                      </div>
                      
                      {/* Filter Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                          💰 Value &gt; $1M
                        </span>
                        <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">
                          🏢 Premium categories
                        </span>
                        <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm">
                          ✅ Active status
                        </span>
                        <span className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-sm">
                          ⭐ Rating ≥ 4
                        </span>
                      </div>
                    </div>
                    
                    {/* Items Preview - Compact */}
                    <div className="space-y-3">
                      <span className="text-sm font-medium text-gray-700">Items to be added to collection:</span>
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600 font-medium">
                              {rulePreviewCount} items match
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
                            <ChevronDown className="w-3 h-3" />
                            Expand
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200">
                  <div className="flex justify-between items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowRulesConfirmation(false)
                        setProposedRules([])
                      }}
                      className="text-gray-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Create collection logic
                          // If no rules, use empty array for matching (allows manual collection)
                          const matchedItems = proposedRules.length > 0 
                            ? applyFilterRules([...allAvailableItems, ...additionalItems], proposedRules)
                            : []
                          
                          let itemsToInclude = selectedItems.size > 0 
                            ? matchedItems.filter(item => selectedItems.has(item.id))
                            : matchedItems
                          
                          // If no items found, create mock high-value assets for demonstration
                          if (itemsToInclude.length === 0) {
                            itemsToInclude = [
                              {
                                id: `mock-${Date.now()}-1`,
                                name: "Luxury Villa Alpha",
                                category: "Real Estate",
                                type: "document" as const,
                                createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
                                createdAt: new Date(),
                                lastUpdated: new Date().toISOString(),
                                pinned: false,
                                value: 2500000,
                                guestRating: 4.8,
                                status: "Active"
                              },
                              {
                                id: `mock-${Date.now()}-2`,
                                name: "Premium Marina Slip",
                                category: "Marine Assets",
                                type: "document" as const,
                                createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
                                createdAt: new Date(),
                                lastUpdated: new Date().toISOString(),
                                pinned: false,
                                value: 1800000,
                                guestRating: 4.9,
                                status: "Active"
                              },
                              {
                                id: `mock-${Date.now()}-3`,
                                name: "Executive Penthouse",
                                category: "Real Estate",
                                type: "document" as const,
                                createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
                                createdAt: new Date(),
                                lastUpdated: new Date().toISOString(),
                                pinned: false,
                                value: 3200000,
                                guestRating: 4.7,
                                status: "Active"
                              },
                              {
                                id: `mock-${Date.now()}-4`,
                                name: "Private Jet Hangar",
                                category: "Aviation",
                                type: "document" as const,
                                createdBy: { id: "ai", name: "AI Assistant", avatar: "AI" },
                                createdAt: new Date(),
                                lastUpdated: new Date().toISOString(),
                                pinned: false,
                                value: 4500000,
                                guestRating: 4.9,
                                status: "Active"
                              }
                            ]
                          }
                          
                          // Allow creating collection even if no items/rules are found
                          let finalDescription = collectionDescription
                          if (proposedRules.length === 0 && itemsToInclude.length === 0) {
                            finalDescription = `${collectionDescription} This is a manual collection - you can add objects later.`
                          } else if (itemsToInclude.length === 0) {
                            finalDescription = `${collectionDescription} This collection will automatically include future objects that match these rules.`
                          }
                          
                          const newCollection = addAICollection(collectionName, finalDescription, itemsToInclude)
                          
                          if (proposedRules.length === 0 && itemsToInclude.length === 0) {
                            toast({
                              title: "Collection Created! 🎉",
                              description: `"${collectionName}" created as manual collection. Add objects anytime!`,
                            })
                          } else if (proposedRules.length > 0 && itemsToInclude.length === 0) {
                            toast({
                              title: "Collection Created! 🎉",
                              description: `"${collectionName}" created for future objects that match the rules.`,
                            })
                          } else {
                            toast({
                              title: "Collection Created! 🎉",
                              description: `"${collectionName}" added with ${itemsToInclude.length} objects.`,
                            })
                          }
                          onOpenChange(false)
                        }}
                        disabled={!collectionName}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Create Collection
                        {rulePreviewCount > 0 && (
                          <Badge className="ml-2 bg-white/20 text-white border-white/30">
                              {rulePreviewCount} items
                            </Badge>
                          )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ===== Original Items Table Mode ===== */
              <>
            <div className="flex-shrink-0 px-6 py-3 bg-gray-50 border-b border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el && 'indeterminate' in el) {
                    (el as any).indeterminate = someSelected && !allSelected
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
                  <span className="text-sm font-medium text-gray-700">
                    Select all items ({selectedItems.size}/{filteredItems.length})
              </span>
            </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-40"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
          </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <ScrollArea className="h-full">
                <div className="px-6">
                  <div className="overflow-x-auto overflow-y-auto">
                    <table className="w-full min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 border-b">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 min-w-[200px]">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">People</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const ItemIcon = getItemIcon(item.type)
                  const currentStatus = itemStatuses[item.id] || item.status.toLowerCase()
                  const statusInfo = getStatusInfo(currentStatus)
                  
                  return (
                    <tr 
                      key={item.id} 
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer"
                      onClick={() => {
                        // Toggle selection on row click
                        const newSelected = new Set(selectedItems)
                        if (selectedItems.has(item.id)) {
                          newSelected.delete(item.id)
                        } else {
                          newSelected.add(item.id)
                        }
                        setSelectedItems(newSelected)
                      }}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ItemThumbnail item={item} />
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-mono whitespace-nowrap">
                          {item.idCode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs whitespace-nowrap ${getCategoryColor(item.type)}`}
                        >
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 whitespace-nowrap">{item.location || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
                          {item.value ? `$${item.value.toLocaleString()}` : '-'}
                        </span>
                      </td>
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
                        <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
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
              </ScrollArea>
        </div>

            {/* Buttons - Cancel and Create in same row */}
            <div className="flex-shrink-0 px-6 py-3 bg-white border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
              Cancel
            </Button>
                <Button
                  onClick={handleCreateCollection}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
              Create ({selectedItems.size} items)
            </Button>
          </div>
            </div>
            </>
            )}
          </div>

          {/* Right Section - AI Assistant Panel */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-gray-200 bg-white">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-gray-900">AI Assistant</span>
              <Button variant="ghost" size="sm" className="ml-auto p-1 h-6 w-6">
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-auto p-4">
                <ScrollArea 
                  className="h-full" 
                  ref={chatContainerRef}
                  onScrollCapture={handleScroll}
                >
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    {chatMessages.map((message, index) => {
                      const isNewMessage = message.id === lastMessageId && message.type === 'ai'
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${
                            isNewMessage ? 'animate-in fade-in-0 slide-in-from-bottom-2 duration-500' : ''
                          }`}
                        >
                          <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Messages end ref for scroll detection */}
                    <div ref={messagesEndRef} />
                    
                    {/* Loading indicator */}
                    {isProcessingQuery && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Undo button */}
                    {undoHistory.length > 0 && (
                      <div className="flex justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUndo}
                          className="text-xs h-8 px-3 hover:bg-gray-50"
                        >
                          <Undo2 className="h-3 w-3 mr-1" />
                          Undo last change
                        </Button>
                      </div>
                    )}
                    
                    
                    {/* New messages indicator */}
                    {showNewMessagesIndicator && newMessagesCount > 0 && (
                      <div className="flex justify-center mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNewMessagesClick}
                          className="text-xs h-8 px-3 hover:bg-blue-50 border-blue-200 text-blue-700 animate-pulse"
                        >
                          <ChevronDown className="h-3 w-3 mr-1" />
                          ↓ {newMessagesCount} new message{newMessagesCount > 1 ? 's' : ''}
                        </Button>
                      </div>
                    )}
                    
                    {/* Scroll to bottom button (fallback) */}
                    {!isScrolledToBottom && !showNewMessagesIndicator && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={scrollToBottom}
                          className="text-xs h-8 px-3 hover:bg-blue-50 border-blue-200 text-blue-700"
                        >
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Scroll to bottom
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Fixed input at bottom */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-20 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessingQuery}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleAiQuery()
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100">
                        <Plus className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-8 w-8 hover:bg-gray-100"
                        onClick={handleAiQuery}
                        disabled={!aiQuery.trim() || isProcessingQuery}
                      >
                        {isProcessingQuery ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                          <Send className="h-4 w-4 text-gray-500" />
                        )}
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