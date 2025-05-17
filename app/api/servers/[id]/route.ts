import { NextResponse } from "next/server"
import { getServerById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const server = getServerById(params.id)

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 })
  }

  return NextResponse.json(server)
}
