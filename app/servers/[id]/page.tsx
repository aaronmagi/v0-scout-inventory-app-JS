import { Sidebar } from "@/components/sidebar"
import { ServerDetail } from "@/components/server-detail"

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ServerDetail serverId={params.id} />
      </div>
    </div>
  )
}
