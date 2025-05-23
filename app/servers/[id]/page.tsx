import { getServerById } from "@/lib/data"
import { ServerDetail } from "@/components/server-detail"
import { notFound } from "next/navigation"

export default function ServerPage({ params }: { params: { id: string } }) {
  const server = getServerById(params.id)

  if (!server) {
    notFound()
  }

  return <ServerDetail server={server} />
}
