"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreHorizontal,
  ServerIcon,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InteractiveSearch } from "@/components/interactive-search"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { serverData as servers, filterData } from "@/lib/data"
import { downloadCSV, serversToCSV } from "@/lib/csv-utils"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServers, setFilteredServers] = useState(servers)
  const [serversData, setServers] = useState<ServerType[]>(servers)
  const [filteredServersData, setFilteredServersData] = useState<ServerType[]>(servers)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(Math.ceil(servers.length / 10))
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [filters, setFilters] = useState<FilterType[]>(filterData)
  const [selectedFilter, setSelectedFilter] = useState("all-servers")

  useEffect(() => {
    applyFiltersAndSort()
  }, [searchQuery, activeTab, sortColumn, sortDirection, selectedFilter, itemsPerPage])

  const applyFiltersAndSort = () => {
    let result = [...serversData]

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

    setFilteredServersData(result)
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
      // Create CSV content with ALL server data
      const csvContent = serversToCSV(filteredServersData)
      downloadCSV(csvContent, `server-inventory-${new Date().toISOString().slice(0, 10)}.csv`)

      toast({
        title: "Export Successful",
        description: `${filteredServersData.length} servers exported to CSV with all details.`,
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
      description: "This feature will be available in Phase 2.",
    })
  }

  // Calculate pagination - apply pagination AFTER sorting
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredServersData.slice(indexOfFirstItem, indexOfLastItem)

  // Status counts for summary cards
  const criticalCount = filteredServersData.filter((server) => server.status === "critical").length
  const warningCount = filteredServersData.filter((server) => server.status === "warning").length
  const normalCount = filteredServersData.filter((server) => server.status === "normal").length
  const unknownCount = filteredServersData.filter((server) => server.status === "unknown").length
  const totalCount = filteredServersData.length

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "normal":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "normal":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "unknown":
        return <HelpCircle className="h-6 w-6 text-gray-500" />
      default:
        return <ServerIcon className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Servers</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => applyFiltersAndSort()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards - Made fully clickable with consistent sizing */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleStatusCardClick("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <ServerIcon className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleStatusCardClick("critical")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleStatusCardClick("warning")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleStatusCardClick("normal")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OK</CardTitle>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleStatusCardClick("unknown")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unknown</CardTitle>
            <HelpCircle className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unknownCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Search servers..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
          {showAdvancedSearch ? "Hide Advanced Search" : "Advanced Search"}
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
              Download CSV ({filteredServersData.length} servers)
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

      <Card>
        <CardHeader>
          <CardTitle>Server Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Name {renderSortIndicator("name")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("ipAddress")}>
                  IP Address {renderSortIndicator("ipAddress")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("model")}>
                  Model {renderSortIndicator("model")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("identifier")}>
                  Identifier {renderSortIndicator("identifier")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("managedState")}>
                  Managed State {renderSortIndicator("managedState")}
                </TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`h-3 w-3 rounded-full ${getStatusColor(server.status)} cursor-help`}></div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getStatusLabel(server.status)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Link href={`/servers/${server.id}`} className="text-blue-600 hover:underline">
                        {server.name}
                      </Link>
                    </TableCell>
                    <TableCell>{server.ipAddress}</TableCell>
                    <TableCell>{server.model}</TableCell>
                    <TableCell>{server.identifier}</TableCell>
                    <TableCell>{server.managedState}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => (window.location.href = `/servers/${server.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => showPhase2Message()}>Edit Server</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => showPhase2Message()}>Power Management</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const csvContent = serversToCSV([server])
                              downloadCSV(
                                csvContent,
                                `server-${server.id}-${new Date().toISOString().slice(0, 10)}.csv`,
                              )
                              toast({
                                title: "Export Successful",
                                description: `Server details exported to CSV.`,
                              })
                            }}
                          >
                            Export CSV
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => showPhase2Message()} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No servers found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span>...</span>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
