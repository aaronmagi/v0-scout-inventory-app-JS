"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { serversToCSV, downloadCSV } from "@/lib/csv-utils"
import { getServerById } from "@/lib/data"

interface ServerDetailProps {
  serverId: string
}

export function ServerDetail({ serverId }: ServerDetailProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    // Fetch server details
    const serverData = getServerById(serverId)
    if (serverData) {
      setServer(serverData)
    }
    setLoading(false)
  }, [serverId])

  const handleDownloadServerCSV = () => {
    try {
      if (!server) return

      toast({
        title: "Preparing CSV export",
        description: "Generating server details export...",
      })

      // Generate CSV content for this single server
      const csvContent = serversToCSV([server])

      // Generate filename with server name and current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `server-${server.name.replace(/\s+/g, "-").toLowerCase()}-${date}.csv`

      // Trigger download
      downloadCSV(csvContent, filename)

      toast({
        title: "CSV Export Complete",
        description: "Server details exported successfully.",
      })
    } catch (error) {
      console.error("CSV export error:", error)
      toast({
        title: "Export Failed",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading server details...</div>
  }

  if (!server) {
    return <div>Server not found</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{server.name}</h1>
        </div>
        <Button onClick={handleDownloadServerCSV} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Custom tabs implementation */}
        <div className="flex border-b border-gray-200 mb-4">
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "summary" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "processors" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("processors")}
          >
            Processors
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "memory" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("memory")}
          >
            Memory
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "storage" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("storage")}
          >
            Storage
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "network" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("network")}
          >
            Network
          </div>
        </div>

        {activeTab === "summary" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Server Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">IP Address</h3>
                <p>{server.ipAddress}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Identifier</h3>
                <p>{server.identifier}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Model</h3>
                <p>{server.model}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Type</h3>
                <p>{server.type}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Status</h3>
                <p className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      server.status === "critical"
                        ? "bg-red-500"
                        : server.status === "warning"
                          ? "bg-yellow-500"
                          : server.status === "normal"
                            ? "bg-green-500"
                            : "bg-gray-500"
                    }`}
                  ></span>
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Managed State</h3>
                <p>{server.managedState}</p>
              </div>
              {server.generation && (
                <div>
                  <h3 className="font-medium text-gray-500">Generation</h3>
                  <p>{server.generation}</p>
                </div>
              )}
              {server.managementController && (
                <div>
                  <h3 className="font-medium text-gray-500">Management Controller</h3>
                  <p>{server.managementController}</p>
                </div>
              )}
              {server.lifecycleStatus && (
                <div>
                  <h3 className="font-medium text-gray-500">Lifecycle Status</h3>
                  <p>{server.lifecycleStatus}</p>
                </div>
              )}
              {server.warrantyEndDate && (
                <div>
                  <h3 className="font-medium text-gray-500">Warranty End Date</h3>
                  <p>{server.warrantyEndDate}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "processors" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Processors</h2>
            {server.processors && server.processors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cores
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {server.processors.map((processor: any) => (
                      <tr key={processor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.manufacturer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.cores}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.threads}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.speed}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{processor.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No processor information available</p>
            )}
          </div>
        )}

        {activeTab === "memory" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Memory</h2>
            {server.memory && server.memory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {server.memory.map((memory: any) => (
                      <tr key={memory.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.capacity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.speed}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{memory.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No memory information available</p>
            )}
          </div>
        )}

        {activeTab === "storage" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Storage</h2>
            {server.storage && server.storage.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interface
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {server.storage.map((storage: any) => (
                      <tr key={storage.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.capacity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.interface}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{storage.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No storage information available</p>
            )}
          </div>
        )}

        {activeTab === "network" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Network</h2>
            {server.network && server.network.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MAC Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Addresses
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {server.network.map((network: any) => (
                      <tr key={network.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{network.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{network.macAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{network.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{network.speed}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{network.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{network.ipAddresses?.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No network information available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
