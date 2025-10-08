"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCollections } from "@/contexts/collections-context"
import { CollectionItem } from "@/types/collection"
import { X, FileStack, Paperclip } from "lucide-react"

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionId: string | null
  onItemCreated: () => void
  edit?: boolean
  item?: CollectionItem
}

export function AddItemModal({ 
  open, 
  onOpenChange, 
  collectionId, 
  onItemCreated,
  edit = false,
  item
}: AddItemModalProps) {
  const { addNewItem, addItemToCollection } = useCollections()
  const { toast } = useToast()
  
  const [formData, setFormData] = React.useState({
    name: "",
    organization: "",
    category: ""
  })
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Pre-fill form data when in edit mode
  React.useEffect(() => {
    if (edit && item) {
      setFormData({
        name: item.name || "",
        organization: "",
        category: item.category || ""
      })
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        organization: "",
        category: ""
      })
    }
  }, [edit, item, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getTypeFromCategory = (category: string) => {
    switch (category) {
      case "Properties": return "property"
      case "Aviation": return "aircraft"
      case "Maritime": return "marine"
      case "Legal entities": return "property"
      default: return "property"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Name and category are required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create new item using context function
      const newItem = addNewItem({
        name: formData.name,
        category: formData.category,
        status: "Available",
        value: undefined,
        notes: undefined,
        tags: [],
        type: getTypeFromCategory(formData.category),
        idCode: undefined,
        guestRating: undefined,
      })

      if (collectionId) {
        // Add to current collection
        addItemToCollection(collectionId, newItem)
        toast({
          title: "Item Added",
          description: `"${newItem.name}" has been added to the collection.`,
        })
      } else {
        // Add to general catalog
        toast({
          title: "Item Created",
          description: `"${newItem.name}" has been created in the catalog.`,
        })
      }

      onItemCreated()
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        organization: "",
        category: ""
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCategoryDisabled = !formData.organization

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border shadow-lg duration-200 sm:max-w-3xl max-w-5xl max-h-[90vh] min-h-[600px] p-0 overflow-hidden rounded-2xl [&_[data-slot=dialog-close]]:hidden"
      >
        <div className="h-full bg-white lg:rounded-2xl grid grid-cols-[1fr_auto] grid-rows-[min-content_1fr_min-content] w-full">
          {/* Header */}
          <div className="col-span-2">
            <div className="flex gap-6 pl-10 pr-6 py-3 border-b border-neutral-200">
              <h2 className="m-0 font-medium text-gray-700 text-xl mr-auto">
                Create new catalog item
              </h2>
              <button 
                type="button" 
                onClick={() => onOpenChange(false)}
                className="grid place-items-center rounded-lg flex-shrink-0 size-6 cursor-pointer active:transform active:translate-y-[1px] focus:outline-none bg-transparent hover:bg-gray-100 text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="overflow-auto px-10 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center flex-wrap text-sm font-medium mb-2">
              <div className="text-gray-600">
                <span>All items</span>
              </div>
              <span className="text-gray-600">&nbsp;/&nbsp;</span>
              <div className="text-gray-900">
                <span>New item</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Item Name */}
              <div>
                <div className="flex gap-2">
                  <button 
                    disabled 
                    type="button" 
                    className="grid place-items-center rounded-lg flex-shrink-0 size-10 cursor-not-allowed hover:bg-gray-100 bg-gray-50 text-gray-600"
                  >
                    <FileStack className="size-4 text-gray-600" />
                  </button>
                  <div className="flex flex-col min-w-0 w-full">
                    <div className="flex gap-2 w-full">
                      <div className="flex relative items-center w-full">
                        <Input
                          autoComplete="off"
                          className="min-w-0 rounded-md text-gray-900 flex-grow hover:bg-gray-50 hover:cursor-pointer cursor-default focus:outline-none border border-transparent px-2 h-10 text-lg font-medium placeholder:text-gray-500"
                          placeholder="Enter item name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          name="title"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div>
                <div className="font-medium mb-2 text-sm">Details</div>
                <div className="grid gap-4">
                  {/* Organization */}
                  <div className="grid grid-cols-[minmax(112px,max-content)_auto_1fr] gap-1 h-min">
                    <div className="flex items-start font-medium py-1.5 text-sm">
                      Organization<span className="text-red-500 ml-1">*</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col w-full self-center">
                        <Select 
                          value={formData.organization} 
                          onValueChange={(value) => handleInputChange("organization", value)}
                        >
                          <SelectTrigger className="min-w-0 rounded-md placeholder:text-gray-600 text-gray-900 flex-grow hover:bg-gray-50 hover:cursor-pointer cursor-default focus:outline-none border border-transparent text-sm relative text-left min-h-8 h-min p-1 w-auto">
                            <SelectValue placeholder="Select Organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oil Nut Bay">Oil Nut Bay</SelectItem>
                            <SelectItem value="Tech Innovations Inc">Tech Innovations Inc</SelectItem>
                            <SelectItem value="Sapphire Holdings LLC">Sapphire Holdings LLC</SelectItem>
                            <SelectItem value="Starlight Philanthropies">Starlight Philanthropies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-[minmax(112px,max-content)_auto_1fr] gap-1 h-min">
                    <div className="flex items-start font-medium py-1.5 text-sm">
                      Category<span className="text-red-500 ml-1">*</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col w-full self-center">
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => handleInputChange("category", value)}
                          disabled={isCategoryDisabled}
                        >
                          <SelectTrigger className={`min-w-0 rounded-md placeholder:text-gray-600 text-gray-900 flex-grow focus:outline-none border border-transparent text-sm relative text-left min-h-8 h-min p-1 ${isCategoryDisabled ? 'cursor-not-allowed' : 'hover:bg-gray-50 hover:cursor-pointer cursor-default'}`}>
                            <SelectValue 
                              placeholder={isCategoryDisabled ? "Select Organization to enable Category" : "Select Category"} 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Properties">Properties</SelectItem>
                            <SelectItem value="Vehicles">Vehicles</SelectItem>
                            <SelectItem value="Aviation">Aviation</SelectItem>
                            <SelectItem value="Maritime">Maritime</SelectItem>
                            <SelectItem value="Legal entities">Legal entities</SelectItem>
                            <SelectItem value="Organizations">Organizations</SelectItem>
                            <SelectItem value="Events">Events</SelectItem>
                            <SelectItem value="Pets">Pets</SelectItem>
                            <SelectItem value="Obligations">Obligations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="row-span-3 border-l border-neutral-200 bg-gray-50 rounded-br-2xl p-8 flex flex-col gap-6 h-full w-80 min-w-[320px]">
            <div>
              <span className="font-semibold mb-4 flex gap-2 items-center text-gray-800">Add to catalog item</span>
              <div className="flex flex-col gap-3 w-full">
                <button 
                  type="button" 
                  disabled
                  className="flex items-center gap-2 rounded-md font-semibold whitespace-nowrap px-4 py-3 h-10 text-gray-500 cursor-not-allowed border border-gray-300 bg-white justify-start hover:bg-gray-50 transition-colors"
                >
                  <Paperclip className="size-4 text-gray-500" />
                  <span className="text-sm leading-5 text-gray-500">Attachment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex gap-2 px-6 py-3 border-t border-neutral-200">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="flex justify-center items-center gap-1 rounded-md font-semibold whitespace-nowrap cursor-pointer active:transform active:translate-y-[1px] focus:outline-none px-3 h-8 bg-transparent text-black hover:bg-gray-100 mr-auto"
            >
              <span className="text-sm leading-5">Cancel</span>
            </button>
            
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.organization || !formData.category}
              className="flex justify-center items-center gap-1 rounded-md font-semibold whitespace-nowrap cursor-pointer active:transform active:translate-y-[1px] focus:outline-none px-3 h-8 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span className="text-sm leading-5">
                {isSubmitting ? "Creating..." : "Create"}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}