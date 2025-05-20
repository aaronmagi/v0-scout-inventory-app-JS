"use client"

import { useState, useEffect } from "react"
import { ServerList } from "./ServerList"
import { FilterBar } from "./FilterBar"
import type { Server } from "../types"

// Custom components instead of Grafana UI
const LoadingPlaceholder = ({ text }: { text: string }) => (
  <div className="flex justify-center items-center p-5">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span>{text || "Loading..."}</span>
  </div>
)

export function App() {
  const [servers, setServers] = useState<Server[]>([])
  const [filteredServers, setFilteredServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState("all-servers")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchServers()
  }, [currentPage, selectedFilter])

  const fetchServers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch from API
      const response = await fetch(`/api/servers?page=${currentPage}&filter=${selectedFilter}&search=${searchQuery}`)

      if (!response.ok) {
        throw new Error(`Error fetching servers: ${response.statusText}`)
      }

      const data = await response.json()

      setServers(data)
      setFilteredServers(data)
      setTotalPages(Math.ceil(data.length / 10) || 1)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching servers:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch servers")
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)

    if (!query) {
      setFilteredServers(servers)
      return
    }

    const filtered = servers.filter(
      (server) =>
        server.name?.toLowerCase().includes(query.toLowerCase()) ||
        server.ipAddress?.toLowerCase().includes(query.toLowerCase()) ||
        server.model?.toLowerCase().includes(query.toLowerCase()) ||
        server.identifier?.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredServers(filtered)
  }

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return <LoadingPlaceholder text="Loading servers..." />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <h3 className="text-xl font-bold text-red-600">Error</h3>
        <p className="text-gray-700">{error}</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchServers}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Server Inventory</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => console.log("Export CSV")}
        >
          Export CSV
        </button>
      </div>

      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} selectedFilter={selectedFilter} />

      <ServerList
        servers={filteredServers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
