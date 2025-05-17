import { NextResponse } from "next/server"
import { getFilterById } from "@/lib/data"

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

  // In a real application, you would update this in a database
  // For now, we'll just return the merged data
  const updatedFilter = {
    ...filter,
    ...data,
    updatedAt: new Date().toISOString(),
  }

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
