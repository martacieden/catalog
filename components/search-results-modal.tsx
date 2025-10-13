'use client'

import React, { useState } from 'react'
import { 
  Plus,
  Download,
  Info,
  Search
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { ItemsTable } from './collections/items-table'
import { CollectionItem, CollectionSortOption } from '@/types/collection'

interface SearchResult {
  id: string
  name: string
  type: string
  icon: string
  itemCount: number
  collectionName?: string
  collectionId?: string
  value?: number
  status: string
  lastUpdated: string
  tags: string[]
  description?: string
}

// Convert SearchResult to CollectionItem for ItemsTable
const convertToCollectionItem = (result: SearchResult): CollectionItem => ({
  id: result.id,
  name: result.name,
  type: result.type,
  category: result.type,
  icon: result.icon,
  status: result.status,
  value: result.value,
  tags: result.tags,
  idCode: `${result.type}-${result.id.slice(0, 6)}`,
  location: result.collectionName || 'Unknown',
  createdAt: new Date(result.lastUpdated),
  createdBy: { id: 'system', name: 'System', email: 'system@example.com' },
  pinned: false,
  notes: result.description
})

interface SearchResultsModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  results: SearchResult[]
  totalResults: number
  collectionCount: number
}

export function SearchResultsModal({ 
  isOpen, 
  onClose, 
  searchQuery, 
  results, 
  totalResults, 
  collectionCount 
}: SearchResultsModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortOption, setSortOption] = useState<CollectionSortOption>({ field: 'name', direction: 'asc' })

  // Convert results to CollectionItems
  const collectionItems = results.map(convertToCollectionItem)

  const handleSelectionChange = (ids: Set<string>) => {
    setSelectedItems(ids)
  }

  const handleSortChange = (option: CollectionSortOption) => {
    setSortOption(option)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Search Results</span>
            <Badge variant="secondary" className="ml-auto">
              {totalResults} items in {collectionCount} collections
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search Query Display */}
        <div className="flex-shrink-0 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-blue-900">Query:</span>
            <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
              {searchQuery}
            </code>
          </div>
          
          {/* Smart Query Syntax Helper */}
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Smart Query Syntax</p>
              <p className="text-blue-700 mt-1">
                Use operators like: 
                <code className="mx-1 px-1.5 py-0.5 bg-blue-100 rounded text-xs">
                  value &gt; 1000
                </code>
                <code className="mx-1 px-1.5 py-0.5 bg-blue-100 rounded text-xs">
                  type = "property"
                </code>
                <code className="mx-1 px-1.5 py-0.5 bg-blue-100 rounded text-xs">
                  created &gt;= 30d
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex-shrink-0 flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedItems.size} selected
                </Badge>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Collection
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto">
          <ItemsTable
            items={collectionItems}
            selectedIds={selectedItems}
            onSelectionChange={handleSelectionChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            showSelection={true}
            showActions={false}
            emptyMessage="No search results found"
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {collectionItems.length} of {totalResults} results
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {selectedItems.size > 0 && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedItems.size} to Collection
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
