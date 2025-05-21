import { Sidebar } from "@/components/sidebar"
import { FilterEditor } from "@/components/filter-editor"

export default function FilterEditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <FilterEditor filterId={params.id} />
      </main>
    </div>
  )
}
