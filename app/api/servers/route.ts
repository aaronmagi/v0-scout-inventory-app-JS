import { NextResponse } from "next/server"
import { serverData } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  let filteredServers = [...serverData]

  if (query) {
    filteredServers = serverData.filter(
      (server) =>
        server.name.toLowerCase().includes(query.toLowerCase()) ||
        server.ipAddress.toLowerCase().includes(query.toLowerCase()) ||
        server.model.toLowerCase().includes(query.toLowerCase()) ||
        server.identifier.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return NextResponse.json(filteredServers)
}
