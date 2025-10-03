"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { CatalogSidebar } from "@/components/catalog-sidebar"
import { CatalogView } from "@/components/catalog-view"
import { CollectionsDashboard } from "@/components/collections-dashboard"

export default function CatalogPage() {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <CatalogSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {activeView === "dashboard" ? (
          <div className="h-full overflow-auto bg-background p-6">
            <CollectionsDashboard />
          </div>
        ) : (
          <CatalogView activeView={activeView} />
        )}
      </main>
    </div>
  )
}
