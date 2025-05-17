import { Sidebar } from "@/components/sidebar"
import { ServerDetail } from "@/components/server-detail"

export default function ServerDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Sidebar />
      <ServerDetail serverId={params.id} />
    </>
  )
}
