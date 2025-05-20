import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Server {
  id: string
  name: string
  ipAddress: string
  status: string
  powerState: string
  uptime: string
  lastUpdated: string
  location: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

interface StatusCardProps {
  title: string
  value: string | number
  color?: string
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, color }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "online":
      return "green"
    case "offline":
      return "red"
    default:
      return "gray"
  }
}

const getPowerStateColor = (powerState: string): string => {
  switch (powerState.toLowerCase()) {
    case "running":
      return "green"
    case "stopped":
      return "red"
    default:
      return "gray"
  }
}

interface ServerDetailProps {
  server: Server
}

const ServerDetail: React.FC<ServerDetailProps> = ({ server }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{server.name}</CardTitle>
          {/* Actions Button - REMOVED */}
        </div>
        <CardDescription>
          {server.ipAddress} - {server.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Status cards - REMOVED */}

        <div className="p-6 pt-0">
          {" "}
          {/* Adjusted padding-top */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.cpuUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.memoryUsage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Disk Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.diskUsage}%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <small className="text-muted-foreground">Last updated: {formatDate(server.lastUpdated)}</small>
      </CardFooter>
    </Card>
  )
}

export default ServerDetail
