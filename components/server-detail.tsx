"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServerDetailProps {
  server: any
}

export function ServerDetail({ server }: ServerDetailProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const handleExportServer = async () => {
    try {
      const response = await fetch(`/api/export/servers/${server.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `server-${server.name}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting server:", error)
    }
  }

  // Calculate totals for memory
  const calculateMemoryTotal = () => {
    if (!server.memory || server.memory.length === 0) return "0 GB"
    const totalGB = server.memory.reduce((total: number, mem: any) => {
      const capacity = Number.parseInt(mem.capacity.replace(/[^\d]/g, "")) || 0
      return total + capacity
    }, 0)
    return `${totalGB} GB`
  }

  // Calculate totals for storage
  const calculateStorageTotal = () => {
    if (!server.storage || server.storage.length === 0) return "0 GB"
    const totalGB = server.storage.reduce((total: number, storage: any) => {
      const capacity = Number.parseInt(storage.capacity.replace(/[^\d]/g, "")) || 0
      return total + capacity
    }, 0)
    return totalGB >= 1000 ? `${(totalGB / 1000).toFixed(1)} TB` : `${totalGB} GB`
  }

  // Calculate processor totals
  const calculateProcessorTotals = () => {
    if (!server.processors || server.processors.length === 0) return { totalCores: 0, totalThreads: 0 }
    const totalCores = server.processors.reduce((total: number, proc: any) => total + (proc.cores || 0), 0)
    const totalThreads = server.processors.reduce((total: number, proc: any) => total + (proc.threads || 0), 0)
    return { totalCores, totalThreads }
  }

  const processorTotals = calculateProcessorTotals()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Servers
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">System Information - {server.name}</h1>
        </div>
        <Button variant="outline" onClick={handleExportServer}>
          <Download className="h-4 w-4 mr-2" />
          Export Server Details
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="processors">Processors</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="power">Power</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="space-y-6">
            {/* Server Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Server Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Basic information about this server</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* General Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">General Information</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">System Name</TableCell>
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
                          <TableCell>{server.type || "Compute"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Service Tag</TableCell>
                          <TableCell>{server.identifier}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">System Status</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  server.status === "critical"
                                    ? "bg-red-500"
                                    : server.status === "warning"
                                      ? "bg-yellow-500"
                                      : server.status === "normal"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                }`}
                              ></div>
                              {server.status === "normal"
                                ? "OK"
                                : server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Management Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Management Information</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">Managed State</TableCell>
                          <TableCell>{server.managedState}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Management Controller</TableCell>
                          <TableCell>{server.managementController || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Lifecycle Status</TableCell>
                          <TableCell>
                            <Badge variant={server.lifecycleStatus === "EOL" ? "destructive" : "default"}>
                              {server.lifecycleStatus || "N/A"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Warranty End Date</TableCell>
                          <TableCell>{server.warrantyEndDate ? formatDate(server.warrantyEndDate) : "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Manufacture Date</TableCell>
                          <TableCell>{server.manufactureDate ? formatDate(server.manufactureDate) : "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Purchase Date</TableCell>
                          <TableCell>{server.purchaseDate ? formatDate(server.purchaseDate) : "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Managed by Server</TableCell>
                          <TableCell>{server.managedByServer || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Mapped Application</TableCell>
                          <TableCell>{server.mappedApplicationService || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Managed by Group</TableCell>
                          <TableCell>{server.managedByGroup || "N/A"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Summary Information</CardTitle>
                <p className="text-sm text-muted-foreground">Additional server details</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Serial Number</TableCell>
                      <TableCell>{server.summary?.serialNumber || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Manufacturer</TableCell>
                      <TableCell>{server.summary?.manufacturer || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Location</TableCell>
                      <TableCell>{server.summary?.location || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Rack Position</TableCell>
                      <TableCell>{server.summary?.rackPosition || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Asset Tag</TableCell>
                      <TableCell>{server.summary?.assetTag || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BIOS Version</TableCell>
                      <TableCell>{server.summary?.biosVersion || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Last Updated</TableCell>
                      <TableCell>
                        {server.summary?.lastUpdated ? formatDate(server.summary.lastUpdated) : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Most Recent Discovery (Redfish)</TableCell>
                      <TableCell>
                        {server.summary?.mostRecentDiscoveryRedfish
                          ? formatDate(server.summary.mostRecentDiscoveryRedfish)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Most Recent Discovery (ServiceNow)</TableCell>
                      <TableCell>
                        {server.summary?.mostRecentDiscoveryServiceNow
                          ? formatDate(server.summary.mostRecentDiscoveryServiceNow)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processors">
          <div className="space-y-6">
            {/* Processor Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Processor Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Total Processors</TableCell>
                      <TableCell>{server.processors?.length || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Cores</TableCell>
                      <TableCell>{processorTotals.totalCores}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Threads</TableCell>
                      <TableCell>{processorTotals.totalThreads}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Processor Details */}
            <Card>
              <CardHeader>
                <CardTitle>Processor Details</CardTitle>
              </CardHeader>
              <CardContent>
                {server.processors && server.processors.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Processor</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Cores</TableHead>
                        <TableHead>Threads</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.processors.map((processor: any, index: number) => (
                        <TableRow key={processor.id}>
                          <TableCell>CPU {index + 1}</TableCell>
                          <TableCell>{processor.model}</TableCell>
                          <TableCell>{processor.manufacturer}</TableCell>
                          <TableCell>{processor.cores}</TableCell>
                          <TableCell>{processor.threads}</TableCell>
                          <TableCell>{processor.speed}</TableCell>
                          <TableCell>
                            <Badge variant={processor.status === "OK" ? "default" : "destructive"}>
                              {processor.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 italic">No processor information available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <div className="space-y-6">
            {/* Memory Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Total Memory Slots</TableCell>
                      <TableCell>{server.memory?.length || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Memory Capacity</TableCell>
                      <TableCell>{calculateMemoryTotal()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Memory Details */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Details</CardTitle>
              </CardHeader>
              <CardContent>
                {server.memory && server.memory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.memory.map((mem: any) => (
                        <TableRow key={mem.id}>
                          <TableCell>{mem.location}</TableCell>
                          <TableCell>{mem.capacity}</TableCell>
                          <TableCell>{mem.type}</TableCell>
                          <TableCell>{mem.speed}</TableCell>
                          <TableCell>{mem.manufacturer}</TableCell>
                          <TableCell>
                            <Badge variant={mem.status === "OK" ? "default" : "destructive"}>{mem.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 italic">No memory information available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            {/* Storage Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Total Storage Devices</TableCell>
                      <TableCell>{server.storage?.length || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Storage Capacity</TableCell>
                      <TableCell>{calculateStorageTotal()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Storage Details */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Details</CardTitle>
              </CardHeader>
              <CardContent>
                {server.storage && server.storage.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Drive</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Firmware</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {server.storage.map((storage: any, index: number) => (
                        <TableRow key={storage.id}>
                          <TableCell>Drive {index + 1}</TableCell>
                          <TableCell>{storage.type}</TableCell>
                          <TableCell>{storage.model}</TableCell>
                          <TableCell>{storage.capacity}</TableCell>
                          <TableCell>{storage.protocol}</TableCell>
                          <TableCell>{storage.firmwareVersion || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={storage.status === "OK" ? "default" : "destructive"}>
                              {storage.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 italic">No storage information available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network</CardTitle>
            </CardHeader>
            <CardContent>
              {server.network && server.network.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Interface</TableHead>
                      <TableHead>MAC Address</TableHead>
                      <TableHead>IP Addresses</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Speed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {server.network.map((nic: any, index: number) => (
                      <TableRow key={nic.id}>
                        <TableCell>NIC {index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{nic.macAddress}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {nic.ipAddresses && nic.ipAddresses.length > 0 ? nic.ipAddresses.join(", ") : "N/A"}
                        </TableCell>
                        <TableCell>{nic.type}</TableCell>
                        <TableCell>{nic.speed}</TableCell>
                        <TableCell>
                          <Badge variant={nic.status === "OK" ? "default" : "destructive"}>{nic.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 italic">No network information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power">
          <Card>
            <CardHeader>
              <CardTitle>Power</CardTitle>
            </CardHeader>
            <CardContent>
              {server.power && server.power.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Power Supply</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Firmware Version</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {server.power.map((psu: any) => (
                      <TableRow key={psu.id}>
                        <TableCell>{psu.name}</TableCell>
                        <TableCell className="font-mono text-sm">{psu.serialNumber}</TableCell>
                        <TableCell>{psu.firmwareVersion}</TableCell>
                        <TableCell>{psu.capacity}</TableCell>
                        <TableCell>{psu.efficiency || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={psu.status === "OK" ? "default" : "destructive"}>{psu.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 italic">No power information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <p className="text-sm text-muted-foreground">Operating system and firmware details</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Operating System */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Operating System</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">OS</TableCell>
                        <TableCell>{server.system?.operatingSystem || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">OS Version</TableCell>
                        <TableCell>{server.system?.osVersion || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Kernel Version</TableCell>
                        <TableCell>{server.system?.kernelVersion || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Last Boot Time</TableCell>
                        <TableCell>
                          {server.system?.lastBootTime ? formatDate(server.system.lastBootTime) : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Uptime</TableCell>
                        <TableCell>{server.system?.uptime || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Load Average</TableCell>
                        <TableCell>{server.system?.loadAverage || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Users</TableCell>
                        <TableCell>{server.system?.users !== undefined ? server.system.users : "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Firmware */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Firmware</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">Firmware Version</TableCell>
                        <TableCell>{server.firmwareVersion || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Firmware Verification</TableCell>
                        <TableCell>
                          <Badge variant={server.firmwareVerificationEnabled ? "default" : "destructive"}>
                            {server.firmwareVerificationEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
