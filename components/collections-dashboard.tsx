"use client"

import * as React from "react"
import { useCollections } from "@/contexts/collections-context"
import { CollectionCard } from "@/components/collections/collection-card"
import { CollectionEditDialog } from "@/components/collections/collection-edit-dialog"
import {
  Sparkles,
  Clock,
  Users,
  Folder,
  ArrowRight,
  Plus,
  Building2,
  Home,
  Car,
  Plane,
  Ship,
  Building,
  Calendar,
  Dog,
  AlertTriangle,
  Star,
  FileText,
  Anchor,
  Waves,
  TreePine,
  Coffee,
  Utensils,
  Bed,
  Camera,
  MapPin,
  Building2 as ResortIcon,
  Ship as MarinaIcon,
  Sparkles as AmenitiesIcon,
  Users as ExperienceIcon,
  Database,
  Search,
  TrendingDown,
  CheckCircle,
  User,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  FilePlus,
  Upload,
  FileSpreadsheet,
  Zap,
  TrendingUp,
  BarChart3,
  Heart,
  Filter,
  ChevronDown,
  ChevronLeft,
  Edit,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AICollectionPreviewDialog } from "@/components/ai-collection-preview-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { MOCK_CATALOG_ITEMS } from "@/lib/mock-data"



export function CollectionsDashboard() {
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false)
  const [selectedCollectionType, setSelectedCollectionType] = React.useState<string>("")
  const { collections } = useCollections()
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [editingCollection, setEditingCollection] = React.useState<any>(null)
  const [viewLayout, setViewLayout] = React.useState<"grid" | "list">("grid")
  const [timePeriod, setTimePeriod] = React.useState<string>("7days")
  // Стан для фільтрації категорій
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  // Стан для таблиці Recent Activity
  const [sortColumn, setSortColumn] = React.useState<string>("")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  // Фільтри
  const [objectFilter, setObjectFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [userFilter, setUserFilter] = React.useState<string>("all")
  const [dateFilter, setDateFilter] = React.useState<string>("all")


  // AI-powered collection suggestions based on data analysis
  const getAISuggestionCards = () => {
    // Analyze current data to generate intelligent suggestions
    const properties = MOCK_CATALOG_ITEMS.filter(item => item.category === "Properties")
    const maritime = MOCK_CATALOG_ITEMS.filter(item => item.category === "Maritime")
    const events = MOCK_CATALOG_ITEMS.filter(item => item.category === "Events")
    const pets = MOCK_CATALOG_ITEMS.filter(item => item.category === "Pets")
    const vehicles = MOCK_CATALOG_ITEMS.filter(item => item.category === "Vehicles")
    const aviation = MOCK_CATALOG_ITEMS.filter(item => item.category === "Aviation")
    const legal = MOCK_CATALOG_ITEMS.filter(item => item.category === "Legal entities")
    
    // Calculate maintenance needs
    const maintenanceItems = MOCK_CATALOG_ITEMS.filter((item: any) => 
      item.status?.toLowerCase().includes('maintenance') || 
      item.status?.toLowerCase().includes('repair') ||
      item.status?.toLowerCase().includes('attention')
    )
    
    // Calculate high-value assets
    const highValueItems = MOCK_CATALOG_ITEMS.filter(item => 
      item.category === "Properties" || 
      item.category === "Aviation" || 
      item.category === "Maritime"
    )
    
    // Calculate recent updates (last 30 days)
    const recentItems = MOCK_CATALOG_ITEMS.filter((item: any) => {
      const itemDate = new Date(item.date || '')
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return itemDate > thirtyDaysAgo
    })

    const suggestions = []

    // Only suggest collections that have meaningful data
    if (properties.length > 0) {
      suggestions.push({
        id: "luxury-villas",
        name: "Luxury Villas & Properties",
        description: "Beachfront estates, hillside villas, and vacation rental properties",
        itemCount: 12, // Fixed count for luxury villas
        icon: ResortIcon,
        color: "from-slate-50 to-gray-50",
        priority: "high"
      })
    }

    if (maritime.length > 0) {
      suggestions.push({
        id: "marina-assets",
        name: "Marina Village Assets",
        description: "Private marina, boats, water sports equipment, and marine facilities",
        itemCount: 12, // Fixed count for marina assets
        icon: MarinaIcon,
        color: "from-slate-50 to-gray-50",
        priority: "medium"
      })
    }

    if (maintenanceItems.length > 2) {
      suggestions.push({
        id: "maintenance-urgent",
        name: "Needs Attention",
        description: "Assets requiring immediate maintenance or repair",
        itemCount: maintenanceItems.length,
        icon: AlertTriangle,
        color: "from-slate-50 to-gray-50",
        priority: "urgent"
      })
    }

    if (highValueItems.length > 3) {
      suggestions.push({
        id: "high-value-assets",
        name: "High-Value Assets",
        description: "Premium properties, aircraft, and marine vessels",
        itemCount: 10, // Fixed count for high-value assets
        icon: Star,
        color: "from-slate-50 to-gray-50",
        priority: "high"
      })
    }

    if (recentItems.length > 2) {
      suggestions.push({
        id: "recent-updates",
        name: "Recent Updates",
        description: "Recently updated or modified items",
        itemCount: recentItems.length,
        icon: Clock,
        color: "from-slate-50 to-gray-50",
        priority: "medium"
      })
    }

    if (events.length > 0) {
      suggestions.push({
        id: "resort-amenities",
        name: "Resort Amenities",
        description: "Spa facilities, dining venues, beach club, and recreational activities",
        itemCount: 12, // Fixed count for resort amenities
        icon: AmenitiesIcon,
        color: "from-slate-50 to-gray-50",
        priority: "low"
      })
    }

    // Sort by priority: urgent > high > medium > low
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  const aiSuggestionCards = getAISuggestionCards()

  // Metrics data
  const totalItems = MOCK_CATALOG_ITEMS.length
  const totalCollections = collections.length
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    fillShadowGradient: '#4084F4',
    decimalPlaces: 0,
    barPercentage: 0.5,
    fillShadowGradientOpacity: 1,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#ffffff',
    spacingInner: 0.7,
    backgroundGradientToOpacity: 1,
    color: () => `#4084F4`,
    labelColor: () => `black`,
    withShadow: false,
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
  }

  // Calculate category distribution - using mock data to match the image
  const topCategories = [
    { category: "Properties", count: 91 },
    { category: "People", count: 58 },
    { category: "Legal Entities", count: 42 },
    { category: "Projects", count: 39 },
    { category: "Vehicles", count: 27 }
  ]

  // Mock data for changes (would come from API in real app)
  const itemsChange = 6
  const collectionsChange = -2

  // Recent Activity data
  const recentActivities = [
    {
      id: 1,
      type: 'Property',
      name: 'Main Residence',
      code: 'PROP-001',
      user: 'John Doe',
      userInitials: 'JD',
      time: '2m ago',
      action: 'Updated property details and added new photos',
      icon: Home,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      isToday: true
    },
    {
      id: 2,
      type: 'Vehicle',
      name: 'Toyota Land Cruiser Documents',
      code: 'VEH-042',
      user: 'Michael Smith',
      userInitials: 'MS',
      time: '1d ago',
      action: 'Created a new "Vehicle Docs" collection and added 3 related files',
      icon: Car,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      isToday: false
    },
    {
      id: 3,
      type: 'Legal Entity',
      name: 'Acme Inc. Legal Files',
      code: 'ENT-123',
      user: 'John Doe',
      userInitials: 'JD',
      time: '1d ago',
      action: 'Deleted outdated contract and uploaded a new version',
      icon: Building,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      isToday: false
    },
    {
      id: 4,
      type: 'Project',
      name: 'Philanthropy Project Records',
      code: 'PRJ-089',
      user: 'Michael Smith',
      userInitials: 'MS',
      time: '2d ago',
      action: 'Shared collection with 2 team members and updated access permissions',
      icon: Heart,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      isToday: false
    },
    {
      id: 5,
      type: 'Collection',
      name: 'AI Business Ideas',
      code: 'COL-456',
      user: 'Sarah Wilson',
      userInitials: 'SW',
      time: '3d ago',
      action: 'Created an AI-generated collection with 15 smart rules',
      icon: Sparkles,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      isToday: false
    },
    {
      id: 6,
      type: 'Document',
      name: 'Financial Reports Q3',
      code: 'DOC-789',
      user: 'Alex Chen',
      userInitials: 'AC',
      time: '4d ago',
      action: 'Added document to "Legal Docs" collection and marked it as confidential',
      icon: FileText,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      isToday: false
    }
  ]

  // Функції для таблиці
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Фільтрація активностей
  const filteredActivities = recentActivities.filter(activity => {
    const objectMatch = objectFilter === "all" || activity.name.toLowerCase().includes(objectFilter.toLowerCase())
    const typeMatch = typeFilter === "all" || activity.type.toLowerCase() === typeFilter.toLowerCase()
    const userMatch = userFilter === "all" || activity.user.toLowerCase().includes(userFilter.toLowerCase())
    const dateMatch = dateFilter === "all" || activity.time.includes(dateFilter)
    
    return objectMatch && typeMatch && userMatch && dateMatch
  })

  // Експорт CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Object', 'User', 'Action', 'Time', 'Type', 'Code'],
      ...filteredActivities.map(activity => [
        activity.name,
        activity.user,
        activity.action,
        activity.time,
        activity.type,
        activity.code
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Отримання унікальних значень для фільтрів
  const uniqueTypes = [...new Set(recentActivities.map(a => a.type))]
  const uniqueUsers = [...new Set(recentActivities.map(a => a.user))]
  const uniqueDates = [...new Set(recentActivities.map(a => a.time.split(' ')[1] || 'ago'))]

  // Генерація аватара на основі імені користувача
  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
      'from-pink-400 to-pink-600',
    ]
    const index = name.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  const handleAISuggestionClick = (suggestionId: string) => {
    // Open preview dialog with AI suggested rules
    setSelectedCollectionType(suggestionId)
    setPreviewDialogOpen(true)
  }

  const handleAICreate = () => {
    if (searchQuery.trim()) {
      // Open AI Rules-Based dialog for custom prompts
      setSelectedCollectionType("ai-custom")
      setPreviewDialogOpen(true)
    }
  }

  const handleCardEdit = (collection: any) => {
    setEditingCollection(collection)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-item':
        // TODO: Implement create new item functionality
        console.log('Create new item')
        break
      case 'create-collection':
        // TODO: Implement create new collection functionality
        console.log('Create new collection')
        break
      case 'import-csv':
        // TODO: Implement CSV import functionality
        console.log('Import from CSV')
        break
      case 'smart-upload':
        // TODO: Implement smart upload functionality
        console.log('Smart Upload')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-8">
      {/* AI-Powered Collections & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI-Powered Collections */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Ask Fojo to create collections</h2>
            <p className="text-sm text-slate-600">Let's create a collection with Fojo - AI generates filtering rules, you review and customize them</p>
          </div>
          
          {/* Quick Prompts - Moved above search */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("💎 High-value assets")}
                className="h-7 px-3 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                💎 High-value assets
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("🏢 Legal entities 2024")}
                className="h-7 px-3 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                🏢 Legal entities 2024
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("🏠 Available properties")}
                className="h-7 px-3 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                🏠 Available properties
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("📅 Recent updates")}
                className="h-7 px-3 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                📅 Recent updates
              </Button>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
              <Search className="absolute left-4 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Fojo..."
                className="w-full rounded-xl bg-transparent px-12 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleAICreate()
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={handleAICreate}
                disabled={!searchQuery.trim()}
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 h-9 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Ask Fojo
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600">Common tasks and shortcuts</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
              onClick={() => handleQuickAction('create-item')}
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                <FilePlus className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Create new item</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
              onClick={() => handleQuickAction('create-collection')}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                <Folder className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Create new collection</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
              onClick={() => handleQuickAction('import-csv')}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors">
                <FileSpreadsheet className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Import from CSV</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
              onClick={() => handleQuickAction('smart-upload')}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">Smart Upload</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Metrics Section - Hidden */}
      <div className="grid gap-6 md:grid-cols-2 hidden">
        {/* Total Numbers Block */}
        <Card className="py-4 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4">
            <CardTitle className="text-sm font-semibold text-slate-700">Total number:</CardTitle>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger 
                className="w-auto h-8 px-2.5 py-1.5 text-xs hover:bg-accent hover:border-slate-300 transition-colors"
                aria-label="Select time period"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {/* Items Metric */}
            <div className="bg-slate-50/50 rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {totalItems} Items
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  itemsChange > 0 ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  {itemsChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-700" />
                  )}
                  <span className={`text-sm font-semibold ${
                    itemsChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {itemsChange > 0 ? "+" : ""}{itemsChange}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">vs previous period</div>
            </div>

            {/* Collections Metric */}
            <div className="bg-slate-50/50 rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {totalCollections} Collection{totalCollections !== 1 ? 's' : ''}
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  collectionsChange > 0 ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  {collectionsChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-700" />
                  )}
                  <span className={`text-sm font-semibold ${
                    collectionsChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {collectionsChange > 0 ? "+" : ""}{collectionsChange}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">vs previous period</div>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories Block - Vertical Bars */}
        <Card className="py-4 rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          {/* Header with summary */}
          <CardHeader className="px-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-700">
                Items under top categories
              </CardTitle>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View all
            </button>
          </CardHeader>


          <CardContent className="px-4">
            {/* Chart with grid lines and Y-axis */}
            <div className="relative flex">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-32 pr-2 text-xs text-slate-500">
                <div className="text-right">{Math.max(...topCategories.map(cat => cat.count))}</div>
                <div className="text-right">{Math.round(Math.max(...topCategories.map(cat => cat.count)) * 0.75)}</div>
                <div className="text-right">{Math.round(Math.max(...topCategories.map(cat => cat.count)) * 0.5)}</div>
                <div className="text-right">{Math.round(Math.max(...topCategories.map(cat => cat.count)) * 0.25)}</div>
                <div className="text-right">0</div>
              </div>

              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-slate-100"></div>
                  <div className="border-t border-slate-100"></div>
                  <div className="border-t border-slate-100"></div>
                  <div className="border-t border-slate-100"></div>
                </div>

                {/* Bars */}
                <div className="flex items-end justify-between h-32 gap-3 relative">
                {topCategories.map((category, index) => {
                  const totalItems = topCategories.reduce((sum, cat) => sum + cat.count, 0)
                  const percentage = Math.round((category.count / totalItems) * 100)
                  const maxCount = Math.max(...topCategories.map(cat => cat.count))
                  // Максимальний бар повинен займати всю висоту (100%)
                  const barHeight = (category.count / maxCount) * 100
                  
                  const colors = [
                    { bg: '#4084F4', gradient: 'linear-gradient(to top, #4084F4, rgba(64, 132, 244, 0.9))' },
                    { bg: '#10B981', gradient: 'linear-gradient(to top, #10B981, rgba(16, 185, 129, 0.9))' },
                    { bg: '#F59E0B', gradient: 'linear-gradient(to top, #F59E0B, rgba(245, 158, 11, 0.9))' },
                    { bg: '#8B5CF6', gradient: 'linear-gradient(to top, #8B5CF6, rgba(139, 92, 246, 0.9))' },
                    { bg: '#EF4444', gradient: 'linear-gradient(to top, #EF4444, rgba(239, 68, 68, 0.9))' }
                  ]
                  
                  return (
                    <div 
                      key={category.category}
                      className="flex flex-col items-center gap-1 flex-1 group cursor-pointer"
                    >
                      {/* Number with percentage */}
                      <div className="text-center">
                        <div className="text-base font-bold tracking-tight text-slate-900 transition-transform group-hover:scale-110">
                          {category.count}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{percentage}%</div>
                      </div>
                      
                      {/* Bar with animation */}
                      <div 
                        className="w-full rounded-t-md transition-all duration-300 hover:brightness-110 border-t-2 border-white/30 animate-grow"
                        style={{
                          height: `${barHeight}%`,
                          background: colors[index % colors.length].gradient,
                          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 6px'
                        }}
                        title={`${category.category}: ${category.count} items (${percentage}%)`}
                      />
                      
                      {/* Category label below */}
                      <div className="text-[10px] text-slate-600 font-medium mt-1 text-center pb-2">
                        {category.category === 'Properties' ? 'Props' :
                         category.category === 'People' ? 'People' :
                         category.category === 'Legal Entities' ? 'Legal' :
                         category.category === 'Projects' ? 'Proj' :
                         category.category === 'Vehicles' ? 'Vehicles' :
                         category.category.split(' ').map(word => word[0]).join('')}
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            </div>

            {/* Summary footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Average per category: {' '}
                <strong className="text-slate-700">
                  {Math.round(topCategories.reduce((sum, cat) => sum + cat.count, 0) / topCategories.length)}
                </strong>
                {' '}items
              </span>
              <button 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => console.log('Export data')}
              >
                Export data
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">AI Suggested Collections</h2>
            <p className="text-xs text-muted-foreground">AI-generated rule sets for smart collections</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {aiSuggestionCards.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-105 border border-gray-200 shadow-none bg-white p-0"
              onClick={() => handleAISuggestionClick(suggestion.id)}
            >
              <div className={`h-20 bg-gradient-to-br ${suggestion.color} p-4 border-b border-gray-100 group-hover:opacity-90 transition-opacity`}>
                <div className="flex h-full items-center justify-center">
                  <suggestion.icon className="h-8 w-8 text-gray-500 stroke-[1] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-1 text-sm">{suggestion.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-balance">{suggestion.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{suggestion.itemCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                {/* Button removed - card is now clickable */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Created Collections Section */}
      {collections.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent Collections</h2>
              <p className="text-xs text-muted-foreground">Collections you've created with AI assistance</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewLayout === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewLayout("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewLayout === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewLayout("list")}
              >
                List
              </Button>
            </div>
          </div>
          <div className={viewLayout === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                layout={viewLayout}
                onEdit={handleCardEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity - Table Layout */}
      <div className="bg-white text-card-foreground flex flex-col rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-row items-center justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">
              Recent Activity
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Last 7 days • {filteredActivities.length} of {recentActivities.length} activities
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filters
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <button 
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export CSV
            </button>
            
            <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              View full log
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        </div>

        {/* Table */}
        <div className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors group"
                    >
                      Collection / Object
                      {sortColumn === 'name' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                    <button 
                      onClick={() => handleSort('user')}
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors group"
                    >
                      User
                      {sortColumn === 'user' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('action')}
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors group"
                    >
                      Action / Description
                      {sortColumn === 'action' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('time')}
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors group"
                    >
                      Updated
                      {sortColumn === 'time' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredActivities.map((activity) => (
                  <tr 
                    key={activity.id}
                    className={`group hover:bg-slate-50 transition-colors cursor-pointer ${activity.isToday ? 'animate-pulse-subtle' : ''}`}
                  >
                    {/* Collection / Object column */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}>
                          <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-slate-700">
                            {activity.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* User column - hidden on mobile */}
                    <td className="px-4 py-2 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${getAvatarGradient(activity.user)} flex items-center justify-center text-[9px] font-semibold text-white`}>
                          {activity.userInitials}
                        </div>
                        <span className="text-xs text-slate-700">{activity.user}</span>
                      </div>
                    </td>

                    {/* Action column */}
                    <td className="px-4 py-2">
                      <div className="text-xs text-slate-700">
                        {activity.action}
                      </div>
                    </td>

                    {/* Time column */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{activity.time}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">{filteredActivities.length}</span> of <span className="font-medium text-slate-700">24</span> activities
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-medium text-xs transition-colors ${
                  currentPage === 1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button 
                className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-medium text-xs transition-colors ${
                  currentPage === 2 ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                }`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button 
                className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-medium text-xs transition-colors ${
                  currentPage === 3 ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                }`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
              <button 
                className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                onClick={() => setCurrentPage(prev => prev + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
          </div>
          </div>
        </div>
      </div>

      {/* AI Collection Preview Dialog */}
      <AICollectionPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        collectionType={selectedCollectionType}
        userPrompt={searchQuery}
        mode="rules"  // 🔥 Use Rules Mode for all AI prompts
      />

      {/* Collection Edit Dialog */}
      {editingCollection && (
        <CollectionEditDialog
          collection={editingCollection}
          open={!!editingCollection}
          onOpenChange={(open) => !open && setEditingCollection(null)}
        />
      )}
    </div>
  )
}

