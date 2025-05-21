import { ServerDetail } from "@/components/server-detail"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: ServerPageProps) {
  return <ServerDetail serverId={params.id} />
}
