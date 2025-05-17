import { Sidebar } from "@/components/sidebar"
import { FilterEditor } from "@/components/filter-editor"

export default function FilterEditorPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Sidebar />
      <FilterEditor filterId={params.id} />
    </>
  )
}
