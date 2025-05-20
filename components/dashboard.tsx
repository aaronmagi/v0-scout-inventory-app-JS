"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, RefreshCw, Search, X, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { serverData, filterData } from "@/lib/data"
import { InteractiveSearch } from "@/components/interactive-search"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { serversToCSV, downloadCSV } from "@/lib/csv-utils"

const ITEMS_PER_PAGE = 10

// Define the Server type
type Server = {
  id: string
  hostname: string
  ip_address: string
  operating_system: string
  cpu_cores: number
  memory_gb: number
  disk_space_gb: number
  location: string
  owner: string
  environment: string
  application: string
  last_updated: string
  status: string
  name?: string
  ipAddress?: string
  model?: string
  identifier?: string
  generation?: string
  managementController?: string
  lifecycleStatus?: string
  warrantyEndDate?: string
  manufactureDate?: string
  powerState?: string
  bootStatus?: string
  firmwareVersion?: string
  firmwareVerificationEnabled?: boolean
  passwordPolicyMinLength?: number
  passwordPolicyRequiresLowercase?: boolean
  passwordPolicyRequiresUppercase?: boolean
  passwordPolicyRequiresNumbers?: boolean
  passwordPolicyRequiresSymbols?: boolean
  lockdownMode?: boolean
  type?: string
  managedState?: string
}

export function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all-servers")
  const [selectedServers, setSelectedServers] = useState<string[]>([])
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredServers, setFilteredServers] = useState(serverData)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [statusCounts, setStatusCounts] = useState({
    security: 59,
    config: 127,
    policy: 1213,
    updates: 23,
  })
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null)

  const applySearchFilter = (query: string) => {
    let results = serverData

    // Apply status filter if active
    if (activeStatusFilter) {
      results = results.filter((server) => server.status === activeStatusFilter)
    }

    // Then apply search query if present
    if (query) {
      results = results.filter((server) => {
        const searchLower = query.toLowerCase()
        const name = server.name?.toLowerCase() || ""
        const ipAddress = server.ipAddress?.toLowerCase() || ""
        const model = server.model?.toLowerCase() || ""
        const identifier = server.identifier?.toLowerCase() || ""
        const generation = server.generation?.toLowerCase() || ""
        const managementController = server.managementController?.toLowerCase() || ""

        return (
          name.includes(searchLower) ||
          ipAddress.includes(searchLower) ||
          model.includes(searchLower) ||
          identifier.includes(searchLower) ||
          generation.includes(searchLower) ||
          managementController.includes(searchLower)
        )
      })
    }

    setFilteredServers(results)
  }

  // Apply filters when selectedFilter changes
  useEffect(() => {
    if (selectedFilter === "all-servers") {
      // Reset to all servers
      applySearchFilter(searchQuery)
      setActiveFilter(null)
      return
    }

    const filter = filterData.find((f) => f.id === selectedFilter)
    if (filter) {
      setActiveFilter(filter.name)

      // Apply the selected filter
      let results = [...serverData]

      switch (selectedFilter) {
        case "end-of-life":
          results = serverData.filter((server) => server.lifecycleStatus === "EOL")
          break
        case "end-of-warranty":
          results = serverData.filter(
            (server) => server.warrantyEndDate && new Date(server.warrantyEndDate) < new Date(),
          )
          break
        case "manufactured-2022":
          results = serverData.filter(
            (server) => server.manufactureDate && new Date(server.manufactureDate) >= new Date("2022-01-01"),
          )
          break
        case "power-on":
          results = serverData.filter((server) => server.powerState === "On")
          break
        case "boot-failure":
          results = serverData.filter((server) => server.bootStatus === "Failed")
          break
        case "firmware-version-check":
          results = serverData.filter(
            (server) => server.firmwareVersion && ["2.40", "2.41", "2.42"].includes(server.firmwareVersion),
          )
          break
        case "firmware-verification-status":
          results = serverData.filter((server) => server.firmwareVerificationEnabled === true)
          break
        case "password-complexity":
          results = serverData.filter(
            (server) =>
              server.passwordPolicyMinLength >= 12 &&
              server.passwordPolicyRequiresLowercase === true &&
              server.passwordPolicyRequiresUppercase === true &&
              server.passwordPolicyRequiresNumbers === true &&
              server.passwordPolicyRequiresSymbols === true,
          )
          break
        case "management-network-isolation":
          results = serverData.filter(
            (server) =>
              server.ipAddress.startsWith("10.") ||
              server.ipAddress.startsWith("172.16.") ||
              server.ipAddress.startsWith("192.168."),
          )
          break
        case "system-lockdown-mode":
          results = serverData.filter((server) => server.lockdownMode === true)
          break
        default:
          // If no specific filter logic, just return all servers
          break
      }

      // Apply status filter if active
      if (activeStatusFilter) {
        results = results.filter((server) => server.status === activeStatusFilter)
      }

      // Apply search filter on top of the selected filter
      if (searchQuery) {
        results = results.filter((server) => {
          const query = searchQuery.toLowerCase()
          const name = server.name?.toLowerCase() || ""
          const ipAddress = server.ipAddress?.toLowerCase() || ""
          const model = server.model?.toLowerCase() || ""
          const identifier = server.identifier?.toLowerCase() || ""
          const generation = server.generation?.toLowerCase() || ""
          const managementController = server.managementController?.toLowerCase() || ""

          return (
            name.includes(query) ||
            ipAddress.includes(query) ||
            model.includes(query) ||
            identifier.includes(query) ||
            generation.includes(query) ||
            managementController.includes(query)
          )
        })
      }

      setFilteredServers(results)
      setCurrentPage(1) // Reset to first page when filter changes

      toast({
        title: `Filter applied: ${filter.name}`,
        description: `${results.length} servers match this filter`,
      })
    }
  }, [selectedFilter, searchQuery, toast, activeStatusFilter])

  const handleSelectAllServers = (checked: boolean) => {
    if (checked) {
      setSelectedServers(currentServers.map((server) => server.id))
    } else {
      setSelectedServers([])
    }
  }

  const handleSelectServer = (serverId: string, checked: boolean) => {
    if (checked) {
      setSelectedServers((prev) => [...prev, serverId])
    } else {
      setSelectedServers((prev) => prev.filter((id) => id !== serverId))
    }
  }

  const handleAdvancedSearch = (query: string) => {
    setSearchQuery(query)
    setAdvancedSearchOpen(false)
    setCurrentPage(1) // Reset to first page on new search

    if (selectedFilter === "all-servers") {
      applySearchFilter(query)
    }

    toast({
      title: "Advanced search applied",
      description: `Search query: ${query}`,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on search

    if (selectedFilter === "all-servers") {
      applySearchFilter(query)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setActiveStatusFilter(null)
    setCurrentPage(1) // Reset to first page when clearing search

    if (selectedFilter === "all-servers") {
      setFilteredServers(serverData)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      setIsExporting(true)

      // Show loading toast
      toast({
        title: "Preparing download",
        description: "Gathering server data for export...",
      })

      // Fetch all server details from the API
      const response = await fetch("/api/export/servers")

      if (!response.ok) {
        throw new Error("Failed to fetch server data")
      }

      const allServerData = await response.json()

      // Convert server data to CSV
      const csvContent = serversToCSV(allServerData)

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `server-inventory-${date}.csv`

      // Trigger download
      downloadCSV(csvContent, filename)

      // Show success toast
      toast({
        title: "Download complete",
        description: `${allServerData.length} servers exported to ${filename}`,
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)

      // Show error toast
      toast({
        title: "Download failed",
        description: "There was an error exporting the server data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredServers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentServers = filteredServers.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">All Servers</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {/* Actions button removed */}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{statusCounts.security}</div>
              <div className="text-sm text-gray-500">Security</div>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{statusCounts.config}</div>
              <div className="text-sm text-gray-500">Config</div>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{statusCounts.policy}</div>
              <div className="text-sm text-gray-500">Policy</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{statusCounts.updates}</div>
              <div className="text-sm text-gray-500">Updates</div>
            </div>
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl">
              <HelpCircle size={24} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search for servers by name, IP, model..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button variant="outline" onClick={() => setAdvancedSearchOpen(true)}>
            Advanced Search
          </Button>
          <Dialog open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Advanced Search</DialogTitle>
                <DialogDescription>
                  Build complex search queries with multiple conditions and operators.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <InteractiveSearch onSearch={handleAdvancedSearch} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="All Servers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-servers">All Servers</SelectItem>
                <SelectGroup>
                  <SelectLabel>Basic Filters</SelectLabel>
                  <SelectItem value="end-of-life">End of Life</SelectItem>
                  <SelectItem value="end-of-warranty">End of Warranty</SelectItem>
                  <SelectItem value="manufactured-2022">Manufactured 2022+</SelectItem>
                  <SelectItem value="power-on">Power On</SelectItem>
                  <SelectItem value="boot-failure">Boot Failure</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Firmware Management Filters</SelectLabel>
                  <SelectItem value="firmware-version-check">Firmware Version Check</SelectItem>
                  <SelectItem value="firmware-verification-status">Firmware Verification Status</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/filters/${selectedFilter}`)}
            disabled={selectedFilter === "all-servers"}
          >
            Edit Filter
          </Button>
          <Button onClick={() => router.push("/filters/new")} className="bg-blue-600 hover:bg-blue-700">
            New Filter
          </Button>
        </div>

        <div className="mb-4">
          <Button variant="outline" onClick={handleDownloadCSV} disabled={isExporting} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Download CSV"}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          <div className="overflow-x-auto max-h-[calc(100vh-20rem)] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedServers.length === currentServers.length && currentServers.length > 0}
                      onCheckedChange={(checked) => handleSelectAllServers(!!checked)}
                    />
                  </th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">IP Address</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Identifier</th>
                  <th className="p-3 text-left font-medium">Model</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Managed State</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServers.length > 0 ? (
                  currentServers.map((server) => (
                    <tr key={server.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedServers.includes(server.id)}
                          onCheckedChange={(checked) => handleSelectServer(server.id, !!checked)}
                        />
                      </td>
                      <td className="p-3">
                        {server.status === "critical" && (
                          <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                        {server.status === "warning" && (
                          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                        )}
                        {server.status === "normal" && (
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        )}
                        {server.status === "unknown" && (
                          <span className="inline-block w-3 h-3 bg-gray-500 rounded-full"></span>
                        )}
                      </td>
                      <td className="p-3">{server.ipAddress}</td>
                      <td className="p-3">
                        <Link href={`/servers/${server.id}`} className="text-blue-600 hover:underline">
                          {server.name || server.ipAddress}
                        </Link>
                      </td>
                      <td className="p-3">{server.identifier}</td>
                      <td className="p-3">{server.model}</td>
                      <td className="p-3">{server.type || "Compute"}</td>
                      <td className="p-3">{server.managedState || "Managed with Alerts"}</td>
                      <td className="p-3 text-center">...</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">
                      No servers found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4 bg-white sticky bottom-0 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredServers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredServers.length)} of{" "}
              {filteredServers.length} servers
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </Button>

              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end" ? (
                  <span key={`ellipsis-${index}`} className="flex items-center justify-center h-8 w-8">
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${pageNumber}`}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 ${currentPage === pageNumber ? "bg-blue-600 text-white" : ""}`}
                    onClick={() => goToPage(Number(pageNumber))}
                  >
                    {pageNumber}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                »
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
