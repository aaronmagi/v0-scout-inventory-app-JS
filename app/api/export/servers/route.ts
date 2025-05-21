import { NextResponse } from "next/server"
import { serverData } from "@/lib/data"

export async function GET() {
  // In a real application, you would fetch complete server details from a database
  // For now, we'll use the mock data we have with all detailed information

  // Return all server data including detailed information
  return NextResponse.json(serverData)
}
