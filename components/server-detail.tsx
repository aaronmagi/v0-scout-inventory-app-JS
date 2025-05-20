"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ServerData {
  id: string
  name: string
  ipAddress: string
  status: string
  model: string
  identifier: string
  type: string
  managedState: string
  generation?: string
  managementController?: string
  powerState?: string
  bootStatus?: string
  firmwareVersion?: string
  lastUpdated?: string
  location?: string
  cpuUsage?: number
  memoryUsage?: number
  diskUsage?: number
}

interface ServerDetailProps {
  serverId?: string
}

export function ServerDetail({ serverId }: ServerDetailProps) {
  const router = useRouter()
  const [server, setServer] = useState<ServerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServerData() {
      if (!serverId) {
        setError("Server ID is missing")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/servers/${serverId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch server data: ${response.statusText}`)
        }

        const data = await response.json()

        // Add mock usage data since it's not in the API
        const serverWithUsage = {
          ...data,
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        }

        setServer(serverWithUsage)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching server:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch server data")
        setIsLoading(false)
      }
    }

    fetchServerData()
  }, [serverId])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Servers
        </Button>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Server not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{server.name}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Server Overview</CardTitle>
          <CardDescription>
            {server.ipAddress} - {server.location || "Unknown location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.cpuUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.memoryUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.diskUsage}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium">{server.model}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Identifier:</span>
              <span className="font-medium">{server.identifier}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{server.type}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Managed State:</span>
              <span className="font-medium">{server.managedState}</span>
            </div>
            {server.generation && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Generation:</span>
                <span className="font-medium">{server.generation}</span>
              </div>
            )}
            {server.managementController && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Management Controller:</span>
                <span className="font-medium">{server.managementController}</span>
              </div>
            )}
            {server.powerState && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Power State:</span>
                <span className="font-medium">{server.powerState}</span>
              </div>
            )}
            {server.bootStatus && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Boot Status:</span>
                <span className="font-medium">{server.bootStatus}</span>
              </div>
            )}
            {server.firmwareVersion && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Firmware Version:</span>
                <span className="font-medium">{server.firmwareVersion}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <small className="text-muted-foreground">
            Last updated: {server.lastUpdated ? formatDate(server.lastUpdated) : "Unknown"}
          </small>
        </CardFooter>
      </Card>
    </div>
  )
}
