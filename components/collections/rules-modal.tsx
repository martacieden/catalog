"use client"

import * as React from "react"
import { Collection } from "@/types/collection"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Trash2 } from "lucide-react"

interface RulesModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function RulesModal({ collection, open, onOpenChange }: RulesModalProps) {
  if (!collection) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" style={{ width: 'calc(56rem + 250px)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Collection Rules
          </DialogTitle>
          <DialogDescription>
            Filtering rules for "{collection.name}" collection
          </DialogDescription>
        </DialogHeader>

        {/* Collection Metadata */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Access</p>
            <p className="text-sm text-gray-900">
              {collection.isPublic ? 'Public' : 'Private'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Created by</p>
            <p className="text-sm text-gray-900">
              {collection.createdBy?.name || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Created on</p>
            <p className="text-sm text-gray-900">
              {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <select className="w-32 px-3 py-2 border rounded-md text-sm">
              <option value="">Select field...</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
              <option value="rating">Rating</option>
              <option value="createdBy">Created by</option>
              <option value="createdOn">Created on</option>
              <option value="lastUpdate">Last update</option>
              <option value="pinned">Pinned</option>
              <option value="sharedWith">Shared with</option>
            </select>
            <select className="w-40 px-3 py-2 border rounded-md text-sm">
              <option value="">Select operator...</option>
              <option value="equals">is</option>
              <option value="not_equals">is not</option>
              <option value="contains">contains</option>
              <option value="not_contains">does not contain</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="is_empty">is empty</option>
              <option value="is_not_empty">is not empty</option>
              <option value="greater_than">more than</option>
              <option value="less_than">less than</option>
              <option value="greater_than_or_equal">at least</option>
              <option value="less_than_or_equal">at most</option>
              <option value="in">is any of</option>
              <option value="not_in">is not any of</option>
            </select>
            <input className="flex-1 px-3 py-2 border rounded-md text-sm" placeholder="$1,000,000" type="text" value="1000000" />
            <button type="button" className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
            </div>
                <div className="flex items-center gap-2">
            <select className="w-32 px-3 py-2 border rounded-md text-sm">
              <option value="">Select field...</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
              <option value="rating">Rating</option>
              <option value="createdBy">Created by</option>
              <option value="createdOn">Created on</option>
              <option value="lastUpdate">Last update</option>
              <option value="pinned">Pinned</option>
              <option value="sharedWith">Shared with</option>
            </select>
            <select className="w-40 px-3 py-2 border rounded-md text-sm">
              <option value="">Select operator...</option>
              <option value="equals">is</option>
              <option value="not_equals">is not</option>
              <option value="contains">contains</option>
              <option value="not_contains">does not contain</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="is_empty">is empty</option>
              <option value="is_not_empty">is not empty</option>
              <option value="greater_than">more than</option>
              <option value="less_than">less than</option>
              <option value="greater_than_or_equal">at least</option>
              <option value="less_than_or_equal">at most</option>
              <option value="in">is any of</option>
              <option value="not_in">is not any of</option>
            </select>
            <select className="flex-1 px-3 py-2 border rounded-md text-sm">
              <option value="">Select category...</option>
              <option value="Legal entities">Legal entities</option>
              <option value="Properties">Properties</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Aviation">Aviation</option>
              <option value="Maritime">Maritime</option>
              <option value="Organizations">Organizations</option>
              <option value="Events">Events</option>
              <option value="Pets">Pets</option>
              <option value="Obligations">Obligations</option>
            </select>
            <button type="button" className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
              </div>
                  <div className="flex items-center gap-2">
            <select className="w-32 px-3 py-2 border rounded-md text-sm">
              <option value="">Select field...</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
              <option value="rating">Rating</option>
              <option value="createdBy">Created by</option>
              <option value="createdOn">Created on</option>
              <option value="lastUpdate">Last update</option>
              <option value="pinned">Pinned</option>
              <option value="sharedWith">Shared with</option>
            </select>
            <select className="w-40 px-3 py-2 border rounded-md text-sm">
              <option value="">Select operator...</option>
              <option value="equals">is</option>
              <option value="not_equals">is not</option>
              <option value="contains">contains</option>
              <option value="not_contains">does not contain</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="is_empty">is empty</option>
              <option value="is_not_empty">is not empty</option>
              <option value="greater_than">more than</option>
              <option value="less_than">less than</option>
              <option value="greater_than_or_equal">at least</option>
              <option value="less_than_or_equal">at most</option>
              <option value="in">is any of</option>
              <option value="not_in">is not any of</option>
            </select>
            <select className="flex-1 px-3 py-2 border rounded-md text-sm">
              <option value="">Select status...</option>
              <option value="Available">Available</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
            <button type="button" className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
                  </div>
                  <div className="flex items-center gap-2">
            <select className="w-32 px-3 py-2 border rounded-md text-sm">
                      <option value="">Select field...</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
                      <option value="category">Category</option>
                      <option value="status">Status</option>
                      <option value="rating">Rating</option>
              <option value="createdBy">Created by</option>
              <option value="createdOn">Created on</option>
              <option value="lastUpdate">Last update</option>
              <option value="pinned">Pinned</option>
              <option value="sharedWith">Shared with</option>
                    </select>
            <select className="w-40 px-3 py-2 border rounded-md text-sm">
                      <option value="">Select operator...</option>
              <option value="equals">is</option>
              <option value="not_equals">is not</option>
              <option value="contains">contains</option>
              <option value="not_contains">does not contain</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="is_empty">is empty</option>
              <option value="is_not_empty">is not empty</option>
              <option value="greater_than">more than</option>
              <option value="less_than">less than</option>
              <option value="greater_than_or_equal">at least</option>
              <option value="less_than_or_equal">at most</option>
              <option value="in">is any of</option>
              <option value="not_in">is not any of</option>
                    </select>
            <input className="flex-1 px-3 py-2 border rounded-md text-sm" min="1" max="5" placeholder="4" type="number" value="4" />
            <button type="button" className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
                </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
