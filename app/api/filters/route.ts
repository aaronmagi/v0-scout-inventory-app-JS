import { NextResponse } from "next/server"
import { filterData } from "@/lib/data"

export async function GET() {
  return NextResponse.json(filterData)
}

export async function POST(request: Request) {
  const data = await request.json()

  // In a real application, you would save this to a database
  // For now, we'll just return the data with a generated ID
  const newFilter = {
    ...data,
    id: Date.now().toString(),
    createdBy: "User",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(newFilter, { status: 201 })
}
