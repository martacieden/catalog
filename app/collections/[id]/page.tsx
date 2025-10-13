"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { CatalogSidebar } from "@/components/catalog-sidebar"
import { CollectionDetailPanel } from "@/components/collection-detail-panel"
import { useCollections } from "@/contexts/collections-context"

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getCollectionById } = useCollections()
  const [selectedOrganization, setSelectedOrganization] = useState("onb")
  const [pinnedCount] = useState(0)
  
  const collectionId = params.id as string
  console.log('🔍 Collection page - ID:', collectionId)
  const collection = getCollectionById(collectionId)
  console.log('🔍 Collection page - Found collection:', !!collection)

  const handleClose = () => {
    router.push("/catalog")
  }

  const handleViewChange = (view: string) => {
    // Navigate to catalog with the selected view
    router.push(`/catalog?view=${view}`)
  }

  const handleCollectionSelect = (selectedCollectionId: string | null) => {
    if (selectedCollectionId && selectedCollectionId !== collectionId) {
      // Navigate to the selected collection
      router.push(`/collections/${selectedCollectionId}`)
    }
  }

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrganization(organizationId)
  }

  if (!collection) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <CatalogSidebar 
          activeView="dashboard" 
          onViewChange={handleViewChange}
          onOrganizationChange={handleOrganizationChange}
          pinnedCount={pinnedCount}
          onCollectionSelect={handleCollectionSelect}
          selectedCollectionId={null}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Collection not found</h1>
            <p className="text-muted-foreground mb-4">
              The collection you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <CatalogSidebar 
        activeView="dashboard" 
        onViewChange={handleViewChange}
        onOrganizationChange={handleOrganizationChange}
        pinnedCount={pinnedCount}
        onCollectionSelect={handleCollectionSelect}
        selectedCollectionId={collectionId}
      />
      <main className="flex-1 overflow-hidden">
        <CollectionDetailPanel 
          collectionId={collectionId} 
          onClose={handleClose}
        />
      </main>
    </div>
  )
}
