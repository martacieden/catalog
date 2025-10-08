"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { CatalogSidebar } from "@/components/catalog-sidebar"
import { CatalogView } from "@/components/catalog-view"
import { CollectionsDashboard } from "@/components/collections-dashboard"
import { CollectionDetailPanel } from "@/components/collection-detail-panel"
import { CollectionsProvider } from "@/contexts/collections-context"

export default function CatalogPage() {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedOrganization, setSelectedOrganization] = useState("onb")
  const [pinnedCount, setPinnedCount] = useState(0)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrganization(organizationId)
    console.log("Selected organization:", organizationId)
    
    // Метадані організацій
    const orgMetadata = {
      "onb": {
        name: "Oil Nut Bay",
        theme: "luxury-resort",
        color: "blue",
        stats: { totalObjects: 156, categories: 12, collections: 24, pinnedItems: 18 },
        characteristics: ["Luxury Villas", "Marina Village", "Beach Club", "Real Estate", "Dining", "Water Sports", "Spa Services"]
      },
      "tech-innovations": {
        name: "Tech Innovations Inc", 
        theme: "technology",
        color: "green",
        stats: { totalObjects: 28, categories: 6, collections: 8, pinnedItems: 7 },
        characteristics: ["Software Development", "AI Research", "Cloud Infrastructure", "Innovation Labs"]
      },
      "sapphire-holdings": {
        name: "Sapphire Holdings LLC",
        theme: "investment", 
        color: "blue",
        stats: { totalObjects: 67, categories: 10, collections: 15, pinnedItems: 12 },
        characteristics: ["Portfolio Management", "Real Estate", "Private Equity", "Asset Valuation"]
      },
      "starlight-philanthropies": {
        name: "Starlight Philanthropies",
        theme: "philanthropy",
        color: "gold", 
        stats: { totalObjects: 23, categories: 5, collections: 6, pinnedItems: 2 },
        characteristics: ["Charitable Programs", "Grant Management", "Community Outreach", "Impact Measurement"]
      },
      "all-organizations": {
        name: "All Organizations",
        theme: "general",
        color: "gray",
        stats: { totalObjects: 274, categories: 33, collections: 53, pinnedItems: 39 },
        characteristics: ["Multi-Organization View", "Cross-Platform Data", "Unified Management"]
      }
    }
    
    const selectedOrg = orgMetadata[organizationId as keyof typeof orgMetadata]
    if (selectedOrg) {
      console.log("Organization metadata:", selectedOrg)
      console.log(`Theme: ${selectedOrg.theme}, Color: ${selectedOrg.color}`)
      console.log(`Stats: ${selectedOrg.stats.totalObjects} objects, ${selectedOrg.stats.collections} collections`)
      console.log(`Characteristics: ${selectedOrg.characteristics.join(", ")}`)
    }
  }

  return (
    <CollectionsProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <CatalogSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          onOrganizationChange={handleOrganizationChange}
          pinnedCount={pinnedCount}
          onCollectionSelect={setSelectedCollectionId}
          selectedCollectionId={selectedCollectionId}
        />
        <main className="flex-1 overflow-hidden">
          {selectedCollectionId ? (
            <CollectionDetailPanel 
              collectionId={selectedCollectionId}
              onClose={() => setSelectedCollectionId(null)}
            />
          ) : activeView === "dashboard" ? (
            <div className="h-full overflow-auto bg-background p-6">
              <CollectionsDashboard />
            </div>
          ) : (
            <CatalogView 
              activeView={activeView} 
              onPinnedCountChange={setPinnedCount}
            />
          )}
        </main>
      </div>
    </CollectionsProvider>
  )
}
