"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { downloadCSV, serversToCSV } from "@/lib/csv-utils"
import type { Server } from "@/lib/data"

interface ServerDetailProps {
  server: Server
}

export function ServerDetail({ server }: ServerDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!server) {
    return <div>Server not found</div>
  }

  const handleExportCSV = () => {
    try {
      const csvContent = serversToCSV([server])
      downloadCSV(csvContent, `server-${server.id}-${new Date().toISOString().slice(0, 10)}.csv`)
      toast({
        title: "Export Successful",
        description: `Server details exported to CSV.`,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "normal":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
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
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center mb-4">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{server.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(server.status)}>{getStatusLabel(server.status)}</Badge>
            <span className="text-sm text-gray-500">{server.ipAddress}</span>
            <span className="text-sm text-gray-500">ID: {server.identifier}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 md:w-[840px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processors">Processors</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="power">Power</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server Overview</CardTitle>
              <CardDescription>Basic information about this server</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">General Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>{server.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">IP Address</TableCell>
                        <TableCell>{server.ipAddress}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Identifier</TableCell>
                        <TableCell>{server.identifier}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Model</TableCell>
                        <TableCell>{server.model}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Type</TableCell>
                        <TableCell>{server.type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(server.status)}>{getStatusLabel(server.status)}</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Management Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Managed State</TableCell>
                        <TableCell>{server.managedState}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Management Controller</TableCell>
                        <TableCell>{server.managementController || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lifecycle Status</TableCell>
                        <TableCell>{server.lifecycleStatus || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Warranty End Date</TableCell>
                        <TableCell>{server.warrantyEndDate || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Manufacture Date</TableCell>
                        <TableCell>{server.manufactureDate || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Purchase Date</TableCell>
                        <TableCell>{server.purchaseDate || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {server.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary Information</CardTitle>
                <CardDescription>Additional server details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Serial Number</TableCell>
                      <TableCell>{server.summary.serialNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Manufacturer</TableCell>
                      <TableCell>{server.summary.manufacturer}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Location</TableCell>
                      <TableCell>{server.summary.location}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Rack Position</TableCell>
                      <TableCell>{server.summary.rackPosition}</TableCell>
                    </TableRow>
                    {server.summary.assetTag && (
                      <TableRow>
                        <TableCell className="font-medium">Asset Tag</TableCell>
                        <TableCell>{server.summary.assetTag}</TableCell>
                      </TableRow>
                    )}
                    {server.summary.biosVersion && (
                      <TableRow>
                        <TableCell className="font-medium">BIOS Version</TableCell>
                        <TableCell>{server.summary.biosVersion}</TableCell>
                      </TableRow>
                    )}
                    {server.summary.lastUpdated && (
                      <TableRow>
                        <TableCell className="font-medium">Last Updated</TableCell>
                        <TableCell>{server.summary.lastUpdated}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Processors Tab */}
        <TabsContent value="processors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processor Information</CardTitle>
              <CardDescription>CPU details and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              {server.processors && server.processors.length > 0 ? (
                server.processors.map((processor, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="font-medium mb-2">Processor {index + 1}</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Model</TableCell>
                          <TableCell>{processor.model}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Manufacturer</TableCell>
                          <TableCell>{processor.manufacturer}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cores</TableCell>
                          <TableCell>{processor.cores}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Threads</TableCell>
                          <TableCell>{processor.threads}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Speed</TableCell>
                          <TableCell>{processor.speed}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>{processor.status}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No processor information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Information</CardTitle>
              <CardDescription>RAM modules and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {server.memory && server.memory.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.memory.map((mem, index) => (
                        <TableRow key={index}>
                          <TableCell>{mem.location}</TableCell>
                          <TableCell>{mem.capacity}</TableCell>
                          <TableCell>{mem.type}</TableCell>
                          <TableCell>{mem.speed}</TableCell>
                          <TableCell>{mem.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Memory Summary</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total Modules</TableCell>
                          <TableCell>{server.memory.length}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Capacity</TableCell>
                          <TableCell>
                            {server.memory
                              .reduce((total, mem) => {
                                const capacityMatch = mem.capacity.match(/(\d+)(\w+)/)
                                if (capacityMatch) {
                                  const [, size, unit] = capacityMatch
                                  const sizeNum = Number.parseInt(size)
                                  return total + (unit.toLowerCase() === "gb" ? sizeNum : sizeNum / 1024)
                                }
                                return total
                              }, 0)
                              .toFixed(0)}{" "}
                            GB
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No memory information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Information</CardTitle>
              <CardDescription>Disk drives and storage devices</CardDescription>
            </CardHeader>
            <CardContent>
              {server.storage && server.storage.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Interface</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.storage.map((storage, index) => (
                        <TableRow key={index}>
                          <TableCell>{storage.id}</TableCell>
                          <TableCell>{storage.type}</TableCell>
                          <TableCell>{storage.model}</TableCell>
                          <TableCell>{storage.capacity}</TableCell>
                          <TableCell>{storage.interface}</TableCell>
                          <TableCell>{storage.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Storage Summary</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total Devices</TableCell>
                          <TableCell>{server.storage.length}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">SSD Devices</TableCell>
                          <TableCell>{server.storage.filter((s) => s.type === "SSD").length}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">HDD Devices</TableCell>
                          <TableCell>{server.storage.filter((s) => s.type === "HDD").length}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">NVMe Devices</TableCell>
                          <TableCell>{server.storage.filter((s) => s.type === "NVMe").length}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No storage information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
              <CardDescription>Network interfaces and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {server.network && server.network.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>MAC Address</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.network.map((nic, index) => (
                        <TableRow key={index}>
                          <TableCell>{nic.id}</TableCell>
                          <TableCell>{nic.macAddress}</TableCell>
                          <TableCell>{nic.type}</TableCell>
                          <TableCell>{nic.speed}</TableCell>
                          <TableCell>{nic.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {server.network.some((nic) => nic.ipAddresses && nic.ipAddresses.length > 0) && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">IP Addresses</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Interface</TableHead>
                            <TableHead>IP Addresses</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {server.network
                            .filter((nic) => nic.ipAddresses && nic.ipAddresses.length > 0)
                            .map((nic, index) => (
                              <TableRow key={index}>
                                <TableCell>{nic.id}</TableCell>
                                <TableCell>{nic.ipAddresses?.join(", ")}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">No network information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Power Tab */}
        <TabsContent value="power" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Power Information</CardTitle>
              <CardDescription>Power supply units and status</CardDescription>
            </CardHeader>
            <CardContent>
              {server.power && server.power.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.power.map((psu, index) => (
                        <TableRow key={index}>
                          <TableCell>{psu.id}</TableCell>
                          <TableCell>{psu.type}</TableCell>
                          <TableCell>{psu.capacity}</TableCell>
                          <TableCell>{psu.efficiency || "N/A"}</TableCell>
                          <TableCell>{psu.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Power Status</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Power State</TableCell>
                          <TableCell>{server.powerState || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Boot Status</TableCell>
                          <TableCell>{server.bootStatus || "Unknown"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No power information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Operating system and firmware details</CardDescription>
            </CardHeader>
            <CardContent>
              {server.system ? (
                <div>
                  <h3 className="font-medium mb-2">Operating System</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">OS</TableCell>
                        <TableCell>{server.system.operatingSystem || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">OS Version</TableCell>
                        <TableCell>{server.system.osVersion || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Kernel Version</TableCell>
                        <TableCell>{server.system.kernelVersion || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Last Boot Time</TableCell>
                        <TableCell>{server.system.lastBootTime || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Uptime</TableCell>
                        <TableCell>{server.system.uptime || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Load Average</TableCell>
                        <TableCell>{server.system.loadAverage || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Users</TableCell>
                        <TableCell>{server.system.users !== undefined ? server.system.users : "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Firmware</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Firmware Version</TableCell>
                          <TableCell>{server.firmwareVersion || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Firmware Verification</TableCell>
                          <TableCell>{server.firmwareVerificationEnabled ? "Enabled" : "Disabled"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No system information available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
