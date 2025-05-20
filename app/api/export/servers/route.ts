import { NextResponse } from "next/server"
import { serverData } from "@/lib/data"

export async function GET() {
  try {
    // In a real application, you would fetch this data from a database
    // For now, we'll use the mock data from lib/data.ts

    // Return all server data including detailed information
    return NextResponse.json(serverData)
  } catch (error) {
    console.error("Error in /api/export/servers:", error)
    return NextResponse.json({ error: "Failed to fetch server data" }, { status: 500 })
  }
}
