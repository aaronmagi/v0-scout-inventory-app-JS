"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Download,
  Search,
  AlertTriangle,
  XCircle,
  Plus,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react"
import { InteractiveSearch } from "@/components/interactive-search"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ServerType {
  id: string
  ipAddress: string
  name: string
  identifier: string
  model: string
  type: string
  managedState: string
  status: "critical" | "warning" | "normal" | "unknown"
  generation?: string
  managementController?: string
  lifecycleStatus?: string
  warrantyEndDate?: string
  manufactureDate?: string
  purchaseDate?: string
  powerState?: string
  bootStatus?: string
  firmwareVersion?: string
  [key: string]: any
}

interface FilterType {
  id: string
  name: string
  description: string
  isPublic: boolean
}

export function Dashboard() {
  const [servers, setServers] = useState<ServerType[]>([])
  const [filteredServers, setFilteredServers] = useState<ServerType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [filters, setFilters] = useState<FilterType[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all-servers")

  useEffect(() => {
    fetchServers()
    fetchFilters()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [servers, searchQuery, activeTab, sortColumn, sortDirection, selectedFilter, itemsPerPage])

  const fetchServers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/servers")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setServers(data)
      setFilteredServers(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching servers:", err)
      setError("Failed to fetch servers. Please try again.")
      setIsLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await fetch("/api/filters")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setFilters(data)
    } catch (err) {
      console.error("Error fetching filters:", err)
      toast({
        title: "Error",
        description: "Failed to load filters. Please try again.",
        variant: "destructive",
      })
    }
  }

  const applyFiltersAndSort = () => {
    let result = [...servers]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (server) =>
          (server.name?.toLowerCase() || "").includes(query) ||
          (server.ipAddress?.toLowerCase() || "").includes(query) ||
          (server.model?.toLowerCase() || "").includes(query) ||
          (server.identifier?.toLowerCase() || "").includes(query),
      )
    }

    // Apply category filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "critical":
          result = result.filter((server) => server.status === "critical")
          break
        case "warning":
          result = result.filter((server) => server.status === "warning")
          break
        case "normal":
          result = result.filter((server) => server.status === "normal")
          break
        case "unknown":
          result = result.filter((server) => server.status === "unknown")
          break
        case "eol":
          result = result.filter((server) => server.lifecycleStatus === "EOL")
          break
        case "warranty":
          // Filter servers with warranty ending in less than 6 months
          const sixMonthsFromNow = new Date()
          sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
          result = result.filter((server) => {
            if (!server.warrantyEndDate) return false
            const warrantyDate = new Date(server.warrantyEndDate)
            return warrantyDate < sixMonthsFromNow
          })
          break
      }
    }

    // Apply saved filter if selected
    if (selectedFilter !== "all-servers") {
      // This would typically call a more complex filtering logic based on the saved filter
      // For now, we'll just simulate it with some basic filters
      switch (selectedFilter) {
        case "end-of-life":
          result = result.filter((server) => server.lifecycleStatus === "EOL")
          break
        case "end-of-warranty":
          const sixMonthsFromNow = new Date()
          sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
          result = result.filter((server) => {
            if (!server.warrantyEndDate) return false
            const warrantyDate = new Date(server.warrantyEndDate)
            return warrantyDate < sixMonthsFromNow
          })
          break
        case "manufactured-2022":
          result = result.filter((server) => {
            if (!server.manufactureDate) return false
            return server.manufactureDate.startsWith("2022") || server.manufactureDate.startsWith("2023")
          })
          break
        case "power-on":
          result = result.filter((server) => server.powerState === "On")
          break
        case "boot-failure":
          result = result.filter((server) => server.bootStatus === "Failed")
          break
      }
    }

    // Apply sorting to all filtered results
    if (sortColumn) {
      result.sort((a, b) => {
        // Special handling for status column to sort by severity
        if (sortColumn === "status") {
          const statusOrder = { critical: 0, warning: 1, normal: 2, unknown: 3 }
          const valueA = statusOrder[a.status] ?? 999
          const valueB = statusOrder[b.status] ?? 999
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA
        }

        const valueA = a[sortColumn] || ""
        const valueB = b[sortColumn] || ""

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        } else {
          return sortDirection === "asc" ? (valueA > valueB ? 1 : -1) : valueB > valueA ? 1 : -1
        }
      })
    }

    setFilteredServers(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  const handleStatusCardClick = (status: string) => {
    setActiveTab(status)
    setCurrentPage(1)
  }

  const handleSavedFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleExportCSV = () => {
    try {
      // Create CSV content - using ALL filtered servers, not just the current page
      let csvContent = "ID,Name,IP Address,Model,Identifier,Type,Status,Managed State\n"

      filteredServers.forEach((server) => {
        csvContent += `${server.id},"${server.name}","${server.ipAddress}","${server.model}","${server.identifier}","${server.type}","${server.status}","${server.managedState}"\n`
      })

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `server-inventory-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: `${filteredServers.length} servers exported to CSV.`,
      })
    } catch (err) {
      console.error("Error exporting CSV:", err)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      })
    }
  }

  const showPhase2Message = () => {
    toast({
      title: "Coming Soon",
      description: "TBD: Phase 2",
    })
  }

  // Calculate pagination - apply pagination AFTER sorting
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredServers.slice(indexOfFirstItem, indexOfLastItem)

  // Status counts for summary cards
  const criticalCount = filteredServers.filter((server) => server.status === "critical").length
  const warningCount = filteredServers.filter((server) => server.status === "warning").length
  const normalCount = filteredServers.filter((server) => server.status === "normal").length
  const unknownCount = filteredServers.filter((server) => server.status === "unknown").length
  const totalCount = filteredServers.length

  // Helper function to render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline text-blue-600" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline text-blue-600" />
    )
  }

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "critical":
        return "Critical"
      case "warning":
        return "Warning"
      case "normal":
        return "OK"
      case "unknown":
        return "Unknown"
      default:
        return status
    }
  }

  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Servers</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchServers()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards - Made fully clickable with consistent sizing */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card
          className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleStatusCardClick("all")}
        >
          <div className="flex items-center p-4 h-full">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <h3 className="text-2xl font-bold text-blue-500">{totalCount}</h3>
            </div>
          </div>
        </Card>

        <Card
          className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleStatusCardClick("critical")}
        >
          <div className="flex items-center p-4 h-full">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <h3 className="text-2xl font-bold text-red-500">{criticalCount}</h3>
            </div>
          </div>
        </Card>

        <Card
          className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleStatusCardClick("warning")}
        >
          <div className="flex items-center p-4 h-full">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Warning</p>
              <h3 className="text-2xl font-bold text-yellow-500">{warningCount}</h3>
            </div>
          </div>
        </Card>

        <Card
          className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleStatusCardClick("normal")}
        >
          <div className="flex items-center p-4 h-full">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">OK</p>
              <h3 className="text-2xl font-bold text-green-500">{normalCount}</h3>
            </div>
          </div>
        </Card>

        <Card
          className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleStatusCardClick("unknown")}
        >
          <div className="flex items-center p-4 h-full">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <HelpCircle className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unknown</p>
              <h3 className="text-2xl font-bold text-gray-500">{unknownCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          placeholder="Search for servers by name, IP, model..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 py-6 text-base"
        />
        <Button
          variant="outline"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          Advanced Search
        </Button>
      </div>

      {showAdvancedSearch && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <InteractiveSearch onSearch={handleSearch} />
        </div>
      )}

      {/* Saved Filters Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Select value={selectedFilter} onValueChange={handleSavedFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Servers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-servers">All Servers</SelectItem>
                {filters.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFilter !== "all-servers" && (
              <Link href={`/filters/${selectedFilter}`} className="ml-2">
                <Button variant="outline" size="sm">
                  Edit Filter
                </Button>
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV ({filteredServers.length} servers)
            </Button>
            <Link href="/filters/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Filter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsContent value={activeTab} className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 cursor-pointer hover:bg-gray-50" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {renderSortIndicator("status")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("ipAddress")}>
                      <div className="flex items-center">
                        IP Address
                        {renderSortIndicator("ipAddress")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Name
                        {renderSortIndicator("name")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("identifier")}>
                      <div className="flex items-center">
                        Identifier
                        {renderSortIndicator("identifier")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("model")}>
                      <div className="flex items-center">
                        Model
                        {renderSortIndicator("model")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("type")}>
                      <div className="flex items-center">
                        Type
                        {renderSortIndicator("type")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("managedState")}>
                      <div className="flex items-center">
                        Managed State
                        {renderSortIndicator("managedState")}
                      </div>
                    </TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading servers...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No servers found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  {server.status === "critical" && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                  {server.status === "warning" && (
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                  )}
                                  {server.status === "normal" && <div className="w-3 h-3 rounded-full bg-green-500" />}
                                  {server.status === "unknown" && <div className="w-3 h-3 rounded-full bg-gray-500" />}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getStatusLabel(server.status)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{server.ipAddress || "-"}</TableCell>
                        <TableCell>
                          <Link href={`/servers/${server.id}`} className="text-blue-600 hover:underline">
                            {server.name || "-"}
                          </Link>
                        </TableCell>
                        <TableCell>{server.identifier || "-"}</TableCell>
                        <TableCell>{server.model || "-"}</TableCell>
                        <TableCell>{server.type || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              server.managedState?.includes("Alerts")
                                ? "default"
                                : server.managedState === "Managed"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {server.managedState || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={showPhase2Message}>TBD: Phase 2</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredServers.length)} of{" "}
                {filteredServers.length} servers
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 3 + i
                      }
                      if (pageNum > totalPages - 4) {
                        pageNum = totalPages - 4 + i
                      }
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink isActive={currentPage === pageNum} onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
