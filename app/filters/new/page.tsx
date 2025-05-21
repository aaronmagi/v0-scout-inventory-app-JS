import { Sidebar } from "@/components/sidebar"
import { FilterEditor } from "@/components/filter-editor"

export default function NewFilterPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <FilterEditor />
      </div>
    </div>
  )
}
