import { FilterEditor } from "@/components/filter-editor"

export default function FilterEditorPage({ params }: { params: { id: string } }) {
  return <FilterEditor filterId={params.id} />
}
