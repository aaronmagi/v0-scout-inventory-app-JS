"use client"

import { useState, useEffect } from "react"
import type { AppRootProps } from "@grafana/data"
import { getBackendSrv } from "@grafana/runtime"
import { Button, LoadingPlaceholder, useStyles2 } from "@grafana/ui"
import { css } from "@emotion/css"
import { ServerList } from "./ServerList"
import { FilterBar } from "./FilterBar"
import type { Server } from "../types"
import { API_BASE_URL } from "../constants"

export function App({ meta, path, query, onNavChanged }: AppRootProps) {
  const styles = useStyles2(getStyles)
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
      // In a real implementation, this would use the backend API
      // For now, we'll simulate the API call
      const response = await getBackendSrv().get(
        `${API_BASE_URL}/servers?page=${currentPage}&filter=${selectedFilter}&search=${searchQuery}`,
      )

      setServers(response.data)
      setFilteredServers(response.data)
      setTotalPages(response.totalPages || 1)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching servers:", err)
      setError("Failed to fetch servers. Please try again later.")
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
        server.name.toLowerCase().includes(query.toLowerCase()) ||
        server.ipAddress.toLowerCase().includes(query.toLowerCase()) ||
        server.model.toLowerCase().includes(query.toLowerCase()) ||
        server.identifier.toLowerCase().includes(query.toLowerCase()),
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

  const handleExportCSV = () => {
    // Implementation for CSV export
    console.log("Exporting CSV...")
  }

  if (isLoading) {
    return <LoadingPlaceholder text="Loading servers..." />
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error</h3>
        <p>{error}</p>
        <Button onClick={fetchServers}>Retry</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Server Inventory</h1>
        <Button variant="primary" onClick={handleExportCSV}>
          Export CSV
        </Button>
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

const getStyles = () => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      padding: 16px;
      height: 100%;
    `,
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    `,
    errorContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;
    `,
  }
}
