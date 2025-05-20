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
    </div>
  )
}
