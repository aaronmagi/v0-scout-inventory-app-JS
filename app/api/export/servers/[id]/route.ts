import { NextResponse } from "next/server"
import { getServerById } from "@/lib/data"
import { serversToCSV } from "@/lib/csv-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const server = getServerById(params.id)

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Convert server to CSV
    const csvContent = serversToCSV([server])

    // Set headers for CSV download
    const headers = new Headers()
    headers.set("Content-Type", "text/csv")
    headers.set(
      "Content-Disposition",
      `attachment; filename="server-${server.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv"`,
    )

    return new NextResponse(csvContent, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error generating server CSV:", error)
    return NextResponse.json({ error: "Failed to generate CSV" }, { status: 500 })
  }
}
