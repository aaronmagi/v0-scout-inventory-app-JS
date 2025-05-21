import { Sidebar } from "@/components/sidebar"
import { FilterEditor } from "@/components/filter-editor"

export default function FilterEditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <FilterEditor filterId={params.id} />
      </div>
    </div>
  )
}
