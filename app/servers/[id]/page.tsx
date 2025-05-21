"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react"

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

export default function ServerDetailsPage({ params }: { params: { id: string } }) {
  const [server, setServer] = useState<ServerType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    fetchServerDetails(params.id)
  }, [params.id])

  const fetchServerDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/servers/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setServer(data)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching server details:", err)
      setError("Failed to fetch server details. Please try again later.")
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading server details...</p>
        </div>
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error Loading Server</h2>
                <p className="text-gray-500 mb-4">{error || "Server not found"}</p>
                <Button onClick={() => fetchServerDetails(params.id)}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            {getStatusIcon(server.status)}
            <span className="ml-2">{server.name}</span>
          </h1>
          <p className="text-gray-500">Server Details</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="processors">Processors</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="firmware">Firmware</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Server Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Name</span>
                      <span>{server.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">IP Address</span>
                      <span>{server.ipAddress}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Identifier</span>
                      <span>{server.identifier}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Model</span>
                      <span>{server.model}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Type</span>
                      <span>{server.type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Status</span>
                      <span className="flex items-center">
                        {getStatusIcon(server.status)}
                        <span className="ml-1">{getStatusLabel(server.status)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Managed State</span>
                      <span>{server.managedState}</span>
                    </div>
                    {server.generation && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-500">Generation</span>
                        <span>{server.generation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional cards for other summary information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Power State</span>
                      <span>{server.powerState || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Boot Status</span>
                      <span>{server.bootStatus || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Lifecycle Status</span>
                      <span>{server.lifecycleStatus || "Unknown"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Warranty Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Warranty End Date</span>
                      <span>{server.warrantyEndDate || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Manufacture Date</span>
                      <span>{server.manufactureDate || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-500">Purchase Date</span>
                      <span>{server.purchaseDate || "Unknown"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="processors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Processor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Socket</th>
                      <th className="text-left pb-2">Model Name</th>
                      <th className="text-left pb-2">Manufacturer</th>
                      <th className="text-left pb-2">Max Speed (MHz)</th>
                      <th className="text-left pb-2">Core Count</th>
                      <th className="text-left pb-2">Thread Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">CPU1</td>
                      <td className="py-2">Xeon Gold 6248R</td>
                      <td className="py-2">Intel</td>
                      <td className="py-2">3900</td>
                      <td className="py-2">24</td>
                      <td className="py-2">48</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">CPU2</td>
                      <td className="py-2">Xeon Gold 6248R</td>
                      <td className="py-2">Intel</td>
                      <td className="py-2">3900</td>
                      <td className="py-2">24</td>
                      <td className="py-2">48</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">CPU1: Intel Xeon Gold 6248R</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Model Name</span>
                          <span>Xeon Gold 6248R</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Manufacturer</span>
                          <span>Intel</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Max Speed (MHz)</span>
                          <span>3900</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Core Count</span>
                          <span>24</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Thread Count</span>
                          <span>48</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Cache</span>
                          <span>35.75 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">CPU2: Intel Xeon Gold 6248R</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Model Name</span>
                          <span>Xeon Gold 6248R</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Manufacturer</span>
                          <span>Intel</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Max Speed (MHz)</span>
                          <span>3900</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Core Count</span>
                          <span>24</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Thread Count</span>
                          <span>48</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Cache</span>
                          <span>35.75 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Memory Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Total Capacity</span>
                    <span>384 GiB (393216 MiB)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Memory Slots</span>
                    <span>24 (12 per CPU)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Slots Used</span>
                    <span>12</span>
                  </div>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Slot</th>
                      <th className="text-left pb-2">Capacity (MiB)</th>
                      <th className="text-left pb-2">Type</th>
                      <th className="text-left pb-2">Speed (MHz)</th>
                      <th className="text-left pb-2">Manufacturer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">DIMM A1</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM A2</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM A3</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM A4</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM A5</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM A6</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B1</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B2</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B3</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B4</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B5</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">DIMM B6</td>
                      <td className="py-2">32768</td>
                      <td className="py-2">DDR4</td>
                      <td className="py-2">3200</td>
                      <td className="py-2">Samsung</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Primary IP Address</span>
                    <span>{server.ipAddress}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">MAC Address</span>
                    <span>00:1A:2B:3C:4D:5E (Placeholder)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Network Interfaces</span>
                    <span>4 (Placeholder)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Interfaces</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Interface</th>
                      <th className="text-left pb-2">IP Address</th>
                      <th className="text-left pb-2">MAC Address</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">eth0</td>
                      <td className="py-2">{server.ipAddress}</td>
                      <td className="py-2">00:1A:2B:3C:4D:5E</td>
                      <td className="py-2">Up</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">eth1</td>
                      <td className="py-2">192.168.1.101</td>
                      <td className="py-2">00:1A:2B:3C:4D:5F</td>
                      <td className="py-2">Up</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">eth2</td>
                      <td className="py-2">10.0.0.101</td>
                      <td className="py-2">00:1A:2B:3C:4D:60</td>
                      <td className="py-2">Down</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Total Storage</span>
                    <span>2.4 TB (Placeholder)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Storage Controllers</span>
                    <span>2 (Placeholder)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Physical Disks</span>
                    <span>6 (Placeholder)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Physical Disks</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Disk</th>
                      <th className="text-left pb-2">Capacity</th>
                      <th className="text-left pb-2">Type</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Disk 0</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Healthy</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Disk 1</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Healthy</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Disk 2</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Warning</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Disk 3</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Healthy</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Disk 4</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Healthy</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Disk 5</td>
                      <td className="py-2">400 GB</td>
                      <td className="py-2">SSD</td>
                      <td className="py-2">Healthy</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="firmware" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Firmware Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">BIOS Version</span>
                    <span>2.4.0 (Placeholder)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">BMC Firmware</span>
                    <span>{server.firmwareVersion || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-500">Last Updated</span>
                    <span>2023-06-15 (Placeholder)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Firmware Components</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Component</th>
                      <th className="text-left pb-2">Current Version</th>
                      <th className="text-left pb-2">Available Version</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">BIOS</td>
                      <td className="py-2">2.4.0</td>
                      <td className="py-2">2.4.0</td>
                      <td className="py-2">Up to date</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">BMC</td>
                      <td className="py-2">{server.firmwareVersion || "1.5.0"}</td>
                      <td className="py-2">1.6.2</td>
                      <td className="py-2">Update available</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">NIC Firmware</td>
                      <td className="py-2">3.2.1</td>
                      <td className="py-2">3.2.1</td>
                      <td className="py-2">Up to date</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Storage Controller</td>
                      <td className="py-2">8.1.0</td>
                      <td className="py-2">8.2.5</td>
                      <td className="py-2">Update available</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Log Entries</span>
                    <Button variant="outline" size="sm">
                      Refresh Logs
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex justify-between">
                        <span className="font-medium">2023-09-15 08:32:15</span>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Warning</span>
                      </div>
                      <p className="mt-1 text-sm">Disk 2 showing signs of degradation. S.M.A.R.T. warning detected.</p>
                    </div>

                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">2023-09-14 22:15:03</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Info</span>
                      </div>
                      <p className="mt-1 text-sm">System firmware check completed successfully.</p>
                    </div>

                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">2023-09-14 16:45:22</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Info</span>
                      </div>
                      <p className="mt-1 text-sm">Network interface eth2 state changed to down.</p>
                    </div>

                    <div className="p-4 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">2023-09-13 09:12:54</span>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Critical</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Temperature threshold exceeded on CPU 1. Automatic fan speed increase initiated.
                      </p>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between">
                        <span className="font-medium">2023-09-12 14:30:08</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Info</span>
                      </div>
                      <p className="mt-1 text-sm">System reboot completed successfully.</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" size="sm">
                      Load More Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
