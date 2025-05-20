export interface Server {
  id: string
  ipAddress: string
  name: string
  identifier: string
  model: string
  modelId?: string
  type: string
  managedState: string
  status: "critical" | "warning" | "normal" | "unknown"
  generation?: string
  managementController?: string
  lifecycleStatus?: string
  warrantyEndDate?: string
  warrantyInfo?: string
  manufactureDate?: string
  purchaseDate?: string
  shippedDate?: string
  powerState?: string
  bootStatus?: string
  firmwareVersion?: string
  firmwareVerificationEnabled?: boolean
  requireRecoverySetPrivilege?: boolean
  passwordPolicyMinLength?: number
  passwordPolicyRequiresLowercase?: boolean
  passwordPolicyRequiresUppercase?: boolean
  passwordPolicyRequiresNumbers?: boolean
  passwordPolicyRequiresSymbols?: boolean
  certificateIsSelfSigned?: boolean
  certificateIssuer?: string
  lockdownMode?: boolean
  accountName?: boolean
  accountEnabled?: boolean
  serialNumber?: string
  location?: string
  assetTag?: string
  managementIP?: string
  biosVersion?: string
  biosDate?: string
  lastUpdated?: string
  managedByServer?: string
  mappedApplicationService?: string
  managedByGroup?: string
  mostRecentDiscoveryRedfish?: string
  mostRecentDiscoveryServiceNow?: string

  // Detailed information categories
  processors?: ProcessorInfo[]
  memory?: MemoryInfo[]
  storage?: StorageInfo[]
  network?: NetworkInfo[]
  power?: PowerInfo[]
  [key: string]: any
}

export interface ProcessorInfo {
  modelName: string
  manufacturer: string
  maxSpeedMHz: number
  coreCount: number
  threadCount: number
}

export interface MemoryInfo {
  capacityMiB: string
  type: string
  speedMHz: string
  manufacturer: string
}

export interface StorageInfo {
  deviceName: string
  model: string
  type: string
  capacity: string
  firmwareVersion: string
}

export interface NetworkInfo {
  interfaceName: string
  macAddress: string
  speedMbps: string
}

export interface PowerInfo {
  psuName: string
  serialNumber: string
  firmwareVersion: string
}

// Generate mock data for servers
const generateMockServers = (): Server[] => {
  const servers: Server[] = []

  // Define some common values for generating mock data
  const models = [
    { model: "PowerEdge R740", modelId: "R740", generation: "14G" },
    { model: "PowerEdge R750", modelId: "R750", generation: "15G" },
    { model: "PowerEdge R640", modelId: "R640", generation: "14G" },
    { model: "PowerEdge R650", modelId: "R650", generation: "15G" },
    { model: "HPE ProLiant DL380 Gen10", modelId: "DL380G10", generation: "Gen10" },
    { model: "HPE ProLiant DL360 Gen10", modelId: "DL360G10", generation: "Gen10" },
  ]

  const statuses = ["normal", "warning", "critical", "unknown"] as const
  const managedStates = ["Managed with Alerts", "Managed", "Monitored", "Unmanaged"]
  const lifecycleStatuses = ["Production", "Testing", "Development", "EOL", "Decommissioned"]
  const powerStates = ["On", "Off"]
  const locations = ["Datacenter East", "Datacenter West", "Datacenter North", "Datacenter South", "Cloud"]
  const managedByGroups = ["IT Operations", "Cloud Team", "DevOps", "Infrastructure"]
  const mappedApplicationServices = ["Web Services", "Database Services", "Authentication", "API Gateway", "Monitoring"]

  // Define processor configurations
  const processorConfigs = [
    {
      isIntel: true,
      models: [
        "Intel Xeon Gold 6126",
        "Intel Xeon Gold 6130",
        "Intel Xeon Gold 6136",
        "Intel Xeon Gold 6142",
        "Intel Xeon Gold 6148",
        "Intel Xeon Platinum 8160",
        "Intel Xeon Platinum 8180",
      ],
      manufacturer: "Intel Corporation",
      speedRange: [2600, 3700],
      coreRange: [12, 28],
    },
    {
      isIntel: false,
      models: [
        "AMD EPYC 7351",
        "AMD EPYC 7401",
        "AMD EPYC 7451",
        "AMD EPYC 7551",
        "AMD EPYC 7601",
        "AMD EPYC 7702",
        "AMD EPYC 7742",
      ],
      manufacturer: "Advanced Micro Devices, Inc.",
      speedRange: [2000, 3400],
      coreRange: [16, 64],
    },
  ]

  // Generate 20 servers
  for (let i = 1; i <= 20; i++) {
    const modelIndex = Math.floor(Math.random() * models.length)
    const selectedModel = models[modelIndex]
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const managedStateIndex = Math.floor(Math.random() * managedStates.length)
    const lifecycleStatusIndex = Math.floor(Math.random() * lifecycleStatuses.length)
    const powerStateIndex = Math.floor(Math.random() * powerStates.length)
    const locationIndex = Math.floor(Math.random() * locations.length)
    const managedByGroupIndex = Math.floor(Math.random() * managedByGroups.length)
    const mappedApplicationServiceIndex = Math.floor(Math.random() * mappedApplicationServices.length)

    // Generate dates
    const now = new Date()
    const manufactureDate = new Date(now)
    manufactureDate.setMonth(now.getMonth() - Math.floor(Math.random() * 36)) // Random date in the past 3 years

    const shippedDate = new Date(manufactureDate)
    shippedDate.setDate(manufactureDate.getDate() + Math.floor(Math.random() * 14)) // 0-14 days after manufacture

    const purchaseDate = new Date(shippedDate)
    purchaseDate.setDate(shippedDate.getDate() + Math.floor(Math.random() * 30)) // 0-30 days after shipping

    const warrantyEndDate = new Date(purchaseDate)
    warrantyEndDate.setFullYear(purchaseDate.getFullYear() + 3) // 3 years warranty

    const lastUpdated = new Date(now)
    lastUpdated.setHours(now.getHours() - Math.floor(Math.random() * 72)) // Last updated in the past 3 days

    const mostRecentDiscoveryRedfish = new Date(lastUpdated)
    mostRecentDiscoveryRedfish.setHours(lastUpdated.getHours() - Math.floor(Math.random() * 24)) // Within 24 hours of last update

    const mostRecentDiscoveryServiceNow = new Date(mostRecentDiscoveryRedfish)
    mostRecentDiscoveryServiceNow.setHours(mostRecentDiscoveryRedfish.getHours() - Math.floor(Math.random() * 48)) // Within 48 hours of Redfish discovery

    // Generate server name based on model and index
    const serverName = `srv-${selectedModel.model.toLowerCase().replace(/\s+/g, "-")}-${i.toString().padStart(2, "0")}`

    // Generate IP address
    const ipOctet3 = Math.floor(Math.random() * 255)
    const ipOctet4 = Math.floor(Math.random() * 255)
    const ipAddress = `10.10.${ipOctet3}.${ipOctet4}`

    // Generate service tag / serial number
    const serialNumber = `SRV${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Select processor type (Intel or AMD) for this server
    const processorTypeIndex = Math.floor(Math.random() * processorConfigs.length)
    const selectedProcessorType = processorConfigs[processorTypeIndex]

    // Determine number of processors (1, 2, or 4)
    const processorCount = [1, 2, 2, 4][Math.floor(Math.random() * 4)]

    // Select a specific processor model for this server
    const processorModelIndex = Math.floor(Math.random() * selectedProcessorType.models.length)
    const selectedProcessorModel = selectedProcessorType.models[processorModelIndex]

    // Generate random speed and core count within the range for this processor type
    const processorSpeed =
      selectedProcessorType.speedRange[0] +
      Math.floor(Math.random() * (selectedProcessorType.speedRange[1] - selectedProcessorType.speedRange[0]))

    const processorCores =
      selectedProcessorType.coreRange[0] +
      Math.floor(Math.random() * (selectedProcessorType.coreRange[1] - selectedProcessorType.coreRange[0]))

    // Create the server object
    const server: Server = {
      id: i.toString(),
      name: serverName,
      ipAddress: ipAddress,
      identifier: serialNumber,
      serialNumber: serialNumber,
      model: selectedModel.model,
      modelId: selectedModel.modelId,
      type: "Compute",
      managedState: managedStates[managedStateIndex],
      status: statuses[statusIndex],
      generation: selectedModel.generation,
      managementController: selectedModel.model.includes("PowerEdge") ? "iDRAC 9" : "iLO 5",
      lifecycleStatus: lifecycleStatuses[lifecycleStatusIndex],
      warrantyEndDate: warrantyEndDate.toISOString().split("T")[0],
      warrantyInfo: `Expires: ${warrantyEndDate.toISOString().split("T")[0]}`,
      manufactureDate: manufactureDate.toISOString().split("T")[0],
      purchaseDate: purchaseDate.toISOString().split("T")[0],
      shippedDate: shippedDate.toISOString().split("T")[0],
      powerState: powerStates[powerStateIndex],
      bootStatus: powerStates[powerStateIndex] === "On" ? "Normal" : "Off",
      firmwareVersion: "2.40",
      location: locations[locationIndex],
      assetTag: `ASSET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      managementIP: `10.20.${ipOctet3}.${ipOctet4}`,
      biosVersion: `2.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      biosDate: manufactureDate.toISOString().split("T")[0],
      lastUpdated: lastUpdated.toISOString(),
      managedByServer: "central-mgmt-01",
      mappedApplicationService: mappedApplicationServices[mappedApplicationServiceIndex],
      managedByGroup: managedByGroups[managedByGroupIndex],
      mostRecentDiscoveryRedfish: mostRecentDiscoveryRedfish.toISOString(),
      mostRecentDiscoveryServiceNow: mostRecentDiscoveryServiceNow.toISOString(),

      // Generate processor information - all processors in a server are the same model
      processors: Array.from({ length: processorCount }, (_, index) => {
        return {
          modelName: selectedProcessorModel,
          manufacturer: selectedProcessorType.manufacturer,
          maxSpeedMHz: processorSpeed,
          coreCount: processorCores,
          threadCount: processorCores * 2, // Assuming 2 threads per core
        }
      }),

      // Generate memory information
      memory: Array.from({ length: Math.floor(Math.random() * 12) + 4 }, () => {
        const capacityOptions = [8192, 16384, 32768, 65536]
        const capacityIndex = Math.floor(Math.random() * capacityOptions.length)
        return {
          capacityMiB: capacityOptions[capacityIndex].toString(),
          type: Math.random() > 0.3 ? "DDR4" : "DDR5",
          speedMHz: (2400 + Math.floor(Math.random() * 10) * 200).toString(),
          manufacturer: ["Samsung", "Micron", "Hynix", "Kingston", "Crucial"][Math.floor(Math.random() * 5)],
        }
      }),

      // Generate storage information
      storage: Array.from({ length: Math.floor(Math.random() * 6) + 2 }, (_, index) => {
        const isSSD = Math.random() > 0.3
        const capacityOptions = isSSD ? [240, 480, 960, 1920, 3840] : [1000, 2000, 4000, 8000, 12000]
        const capacityIndex = Math.floor(Math.random() * capacityOptions.length)
        return {
          deviceName: `Disk ${index}`,
          model: isSSD
            ? ["Samsung PM883", "Intel D3-S4510", "Micron 5300", "WD Blue SA510", "Seagate Nytro"][
                Math.floor(Math.random() * 5)
              ]
            : ["Seagate Exos", "WD Gold", "Toshiba MG", "HGST Ultrastar", "Samsung PM"][Math.floor(Math.random() * 5)],
          type: isSSD ? "SSD" : "HDD",
          capacity: `${capacityOptions[capacityIndex]} GB`,
          firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        }
      }),

      // Generate network information
      network: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, index) => {
        const speedOptions = [1000, 10000, 25000, 40000, 100000]
        const speedIndex = Math.floor(Math.random() * speedOptions.length)
        return {
          interfaceName: `eth${index}`,
          macAddress: Array.from({ length: 6 }, () =>
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0"),
          ).join(":"),
          speedMbps: speedOptions[speedIndex].toString(),
        }
      }),

      // Generate power supply information
      power: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, index) => {
        return {
          psuName: `PSU ${index + 1}`,
          serialNumber: `PSU${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          firmwareVersion: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
        }
      }),
    }

    servers.push(server)
  }

  return servers
}

// Generate the server data
export const serverData = generateMockServers()

export function getServerById(id: string): Server | undefined {
  return serverData.find((server) => server.id === id)
}

export interface FilterRule {
  id: string
  field: string
  operator: string
  value: string
  logic: string
}

export interface Filter {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  query: string
  redfishResource?: string
  rules?: FilterRule[]
  category?: string
}

// Mock filter data
export const filterData = [
  {
    id: "end-of-life",
    name: "End of Life",
    description: "Servers that have reached end of life",
    query: "lifecycleStatus = 'EOL'",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "end-of-warranty",
    name: "End of Warranty",
    description: "Servers that are out of warranty",
    query: "warrantyEndDate < now()",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "manufactured-2022",
    name: "Manufactured 2022+",
    description: "Servers manufactured in 2022 or later",
    query: "manufactureDate >= '2022-01-01'",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "power-on",
    name: "Power On",
    description: "Servers that are powered on",
    query: "powerState = 'On'",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "boot-failure",
    name: "Boot Failure",
    description: "Servers with boot failures",
    query: "bootStatus = 'Failed'",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "firmware-version-check",
    name: "Firmware Version Check",
    description: "Servers with specific firmware versions",
    query: "firmwareVersion IN ('2.40', '2.41', '2.42')",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "firmware-verification-status",
    name: "Firmware Verification Status",
    description: "Servers with firmware verification enabled",
    query: "firmwareVerificationEnabled = true",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "password-complexity",
    name: "Password Complexity",
    description: "Servers with strong password policies",
    query:
      "passwordPolicyMinLength >= 12 AND passwordPolicyRequiresLowercase = true AND passwordPolicyRequiresUppercase = true AND passwordPolicyRequiresNumbers = true AND passwordPolicyRequiresSymbols = true",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "management-network-isolation",
    name: "Management Network Isolation",
    description: "Servers with management interfaces on private networks",
    query: "ipAddress LIKE '10.%' OR ipAddress LIKE '172.16.%' OR ipAddress LIKE '192.168.%'",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
  {
    id: "system-lockdown-mode",
    name: "System Lockdown Mode",
    description: "Servers with lockdown mode enabled",
    query: "lockdownMode = true",
    createdBy: "admin",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    isPublic: true,
  },
]

export function getFilterById(id: string): Filter | undefined {
  return filterData.find((filter) => filter.id === id)
}
