import { NextResponse } from "next/server"
import { filterData, saveFilter } from "@/lib/data"

export async function GET() {
  return NextResponse.json(filterData)
}

export async function POST(request: Request) {
  const data = await request.json()

  const newFilter = {
    ...data,
    id: data.id || `filter-${Date.now()}`,
    createdBy: data.createdBy || "User",
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Save the filter to our data store
  saveFilter(newFilter)

  return NextResponse.json(newFilter, { status: 201 })
}
