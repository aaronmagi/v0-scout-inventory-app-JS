import { Sidebar } from "@/components/sidebar"
import { ServerDetail } from "@/components/server-detail"

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-4 overflow-auto">
        <ServerDetail serverId={params.id} />
      </main>
    </>
  )
}
