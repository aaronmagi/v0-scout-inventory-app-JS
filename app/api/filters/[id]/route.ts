import { NextResponse } from "next/server"
import { getFilterById, saveFilter } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const filter = getFilterById(params.id)

  if (!filter) {
    return NextResponse.json({ error: "Filter not found" }, { status: 404 })
  }

  return NextResponse.json(filter)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const filter = getFilterById(params.id)

  if (!filter) {
    return NextResponse.json({ error: "Filter not found" }, { status: 404 })
  }

  const data = await request.json()

  const updatedFilter = {
    ...filter,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  // Save the updated filter
  saveFilter(updatedFilter)

  return NextResponse.json(updatedFilter)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const filter = getFilterById(params.id)

  if (!filter) {
    return NextResponse.json({ error: "Filter not found" }, { status: 404 })
  }

  // In a real application, you would delete this from a database
  // For now, we'll just return a success message

  return NextResponse.json({ success: true })
}
