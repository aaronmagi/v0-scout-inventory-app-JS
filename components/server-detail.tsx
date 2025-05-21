"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Maximize } from "lucide-react"
import { getServerById } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

interface ServerDetailProps {
  serverId: string
}

export function ServerDetail({ serverId }: ServerDetailProps) {
  const { toast } = useToast()
  const server = getServerById(serverId)

  if (!server) {
    return (
      <div className="flex-1 p-4">
        <div className="flex items-center mb-4">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Servers
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Server Not Found</h2>
          <p>The server with ID {serverId} could not be found.</p>
        </div>
      </div>
    )
  }

  const handleExportServerCSV = async () => {
    try {
      toast({
        title: "Preparing export",
        description: "Generating CSV file...",
      })

      // Fetch the complete server data
      const response = await fetch(`/api/export/servers/${serverId}`)

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }

      const data = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url

      // Generate filename with server name and current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `server-${server.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${date}.csv`
      link.setAttribute("download", filename)

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Clean up
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `Server details exported to ${filename}`,
      })
    } catch (error) {
      console.error("Error exporting server CSV:", error)

      toast({
        title: "Export failed",
        description: "There was an error exporting the server data.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Servers
        </Link>
        <span className="mx-2">&gt;</span>
        <span>{server.name}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">System Information - {server.name}</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportServerCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Maximize className="h-4 w-4 mr-2" />
            Zoom
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full justify-start bg-gray-100 p-0 h-auto">
          <TabsTrigger
            value="summary"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="processors"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Processors
          </TabsTrigger>
          <TabsTrigger
            value="memory"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Memory
          </TabsTrigger>
          <TabsTrigger
            value="storage"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Storage
          </TabsTrigger>
          <TabsTrigger
            value="network"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Network
          </TabsTrigger>
          <TabsTrigger
            value="power"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            Power
          </TabsTrigger>
          <TabsTrigger
            value="system-info"
            className="rounded-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:border-x data-[state=active]:border-b-0 data-[state=active]:bg-white px-4 py-2"
          >
            System Info
          </TabsTrigger>
        </TabsList>

        <div className="bg-white p-6 rounded-lg shadow mt-[-1px]">
          <TabsContent value="summary">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">System Overview</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">System Name</div>
                  <div>{server.name}</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Model</div>
                  <div>{server.model}</div>
                </div>

                {server.generation && (
                  <div className="flex border-b pb-3">
                    <div className="w-48 text-gray-700">Generation</div>
                    <div>{server.generation}</div>
                  </div>
                )}

                {server.managementController && (
                  <div className="flex border-b pb-3">
                    <div className="w-48 text-gray-700">Management Controller</div>
                    <div>{server.managementController}</div>
                  </div>
                )}

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Service Tag</div>
                  <div>{server.identifier}</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">System Status</div>
                  <div className="flex items-center">
                    {server.status === "normal" && (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    )}
                    {server.status === "warning" && (
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    )}
                    {server.status === "critical" && (
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    )}
                    {server.status === "normal" ? "OK" : server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Managed State</div>
                  <div>{server.managedState}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processors">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Processor 1</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Processor Name</div>
                  <div>Intel(R) Xeon(R) Gold 6454S</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Processor Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Processor Speed</div>
                  <div>2200 MHz</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Core Count</div>
                  <div>32</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Thread Count</div>
                  <div>64</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Execution Technology</div>
                  <div>32/32 cores; 64 threads</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Memory Technology</div>
                  <div>64-bit Capable</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Internal L1 cache</div>
                  <div>2560 KB</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Internal L2 cache</div>
                  <div>65536 KB</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Internal L3 cache</div>
                  <div>61440 KB</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Manufacturer</div>
                  <div>Intel Corporation</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="memory">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Memory Module 1</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Capacity</div>
                  <div>32768 MiB</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Type</div>
                  <div>DDR5</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Speed</div>
                  <div>4800 MHz</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Manufacturer</div>
                  <div>Samsung</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Memory Module 2</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Capacity</div>
                  <div>32768 MiB</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Type</div>
                  <div>DDR5</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Speed</div>
                  <div>4800 MHz</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Manufacturer</div>
                  <div>Samsung</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="storage">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Storage Device 1</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Device Name</div>
                  <div>Disk0</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Model</div>
                  <div>SAMSUNG PM9A3 1.92TB NVMe</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Type</div>
                  <div>SSD</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Capacity</div>
                  <div>1920000000000 Bytes (1.92 TB)</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Firmware Version</div>
                  <div>GDC5602Q</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Storage Device 2</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Device Name</div>
                  <div>Disk1</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Model</div>
                  <div>SAMSUNG PM9A3 1.92TB NVMe</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Type</div>
                  <div>SSD</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Capacity</div>
                  <div>1920000000000 Bytes (1.92 TB)</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Firmware Version</div>
                  <div>GDC5602Q</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Network Interface 1</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Interface Name</div>
                  <div>eth0</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">MAC Address</div>
                  <div>AA:BB:CC:DD:EE:FF</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Speed</div>
                  <div>10000 Mbps</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Network Interface 2</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Interface Name</div>
                  <div>eth1</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">MAC Address</div>
                  <div>AA:BB:CC:DD:EE:00</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Speed</div>
                  <div>10000 Mbps</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="power">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Power Supply 1</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">PSU Name</div>
                  <div>PSU1</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Serial Number</div>
                  <div>CN7792A63100075</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Firmware Version</div>
                  <div>1.00.40</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">Power Supply 2</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">PSU Name</div>
                  <div>PSU2</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Serial Number</div>
                  <div>CN7792A63100076</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Firmware Version</div>
                  <div>1.00.40</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Status</div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    OK
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system-info">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b">System Information</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Serial Number (Service Tag)</div>
                  <div>{server.identifier}</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Hostname (Name)</div>
                  <div>{server.name}</div>
                </div>

                {server.generation && (
                  <div className="flex border-b pb-3">
                    <div className="w-48 text-gray-700">Generation</div>
                    <div>{server.generation}</div>
                  </div>
                )}

                {server.managementController && (
                  <div className="flex border-b pb-3">
                    <div className="w-48 text-gray-700">Management Controller</div>
                    <div>{server.managementController}</div>
                  </div>
                )}

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Location</div>
                  <div>Data Center 1, Rack A12, Position 14</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Purchase Date</div>
                  <div>2023-01-15</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Shipped Date</div>
                  <div>2023-01-25</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Warranty Info</div>
                  <div>ProSupport Plus, expires 2026-01-15</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Model ID</div>
                  <div>{server.model}</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Lifecycle Stage Status</div>
                  <div>Production</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Managed by (Server)</div>
                  <div>OME-Central</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Mapped Application Service</div>
                  <div>Web Application Cluster</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Managed By Group</div>
                  <div>Infrastructure Operations</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Most Recent Discovery (Redfish)</div>
                  <div>2025-05-15 14:32:17</div>
                </div>

                <div className="flex border-b pb-3">
                  <div className="w-48 text-gray-700">Most Recent Discovery (ServiceNow)</div>
                  <div>2025-05-15 12:00:05</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
