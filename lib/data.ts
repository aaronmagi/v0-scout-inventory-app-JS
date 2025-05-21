export interface Server {
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

  // Detailed information categories
  summary?: ServerSummary
  processors?: ProcessorInfo[]
  memory?: MemoryInfo[]
  storage?: StorageInfo[]
  network?: NetworkInfo[]
  power?: PowerInfo[]
  system?: SystemInfo
  [key: string]: any
}

export interface ServerSummary {
  serialNumber: string
  manufacturer: string
  location: string
  rackPosition: string
  assetTag?: string
  biosVersion?: string
  lastUpdated?: string
}

export interface ProcessorInfo {
  id: string
  model: string
  manufacturer: string
  cores: number
  threads: number
  speed: string
  status: string
}

export interface MemoryInfo {
  id: string
  location: string
  capacity: string
  type: string
  speed: string
  status: string
}

export interface StorageInfo {
  id: string
  type: string
  model: string
  capacity: string
  interface: string
  status: string
}

export interface NetworkInfo {
  id: string
  macAddress: string
  type: string
  speed: string
  status: string
  ipAddresses?: string[]
}

export interface PowerInfo {
  id: string
  type: string
  capacity: string
  status: string
  efficiency?: string
}

export interface SystemInfo {
  operatingSystem?: string
  osVersion?: string
  kernelVersion?: string
  lastBootTime?: string
  uptime?: string
  loadAverage?: string
  users?: number
}

// Update the generateAdditionalServers function to include filter-related properties
const generateAdditionalServers = (count: number): Server[] => {
  const servers: Server[] = []
  const models = [
    { model: "PowerEdge R6515", controller: "iDRAC9" },
    { model: "PowerEdge R740xd", controller: "iDRAC9" },
    { model: "PowerEdge R750", controller: "iDRAC9" },
    { model: "HPE ProLiant DL380 Gen9", generation: "Gen9", controller: "iLO4" },
    { model: "HPE ProLiant DL360 Gen9", generation: "Gen9", controller: "iLO4" },
    { model: "HPE ProLiant DL380 Gen10", generation: "Gen10", controller: "iLO5" },
    { model: "HPE ProLiant DL360 Gen10", generation: "Gen10", controller: "iLO5" },
    { model: "HPE ProLiant DL380 Gen10 Plus", generation: "Gen10 Plus", controller: "iLO5" },
    { model: "HPE ProLiant DL380 Gen11", generation: "Gen11", controller: "iLO6" },
  ]

  const statuses: ("critical" | "warning" | "normal" | "unknown")[] = ["critical", "warning", "normal", "unknown"]
  const managedStates = ["Managed with Alerts", "Managed", "Monitored", "Unmanaged"]
  const lifecycleStatuses = ["Production", "Testing", "EOL", "Decommissioned"]
  const powerStates = ["On", "Off", "PoweringOn", "PoweringOff"]
  const bootStatuses = ["OK", "Failed", "Degraded", "Unknown"]
  const firmwareVersions = ["2.40", "2.41", "2.42", "2.30", "2.20", "3.00"]

  // Generate random date within a range
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
  }

  // Current date for calculations
  const now = new Date()

  // Start date for manufacture dates (5 years ago)
  const startDate = new Date(now)
  startDate.setFullYear(now.getFullYear() - 5)

  for (let i = 100; i < 100 + count; i++) {
    const modelIndex = Math.floor(Math.random() * models.length)
    const selectedModel = models[modelIndex]
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const managedStateIndex = Math.floor(Math.random() * managedStates.length)
    const lifecycleStatusIndex = Math.floor(Math.random() * lifecycleStatuses.length)
    const powerStateIndex = Math.floor(Math.random() * powerStates.length)
    const bootStatusIndex = Math.floor(Math.random() * bootStatuses.length)
    const firmwareVersionIndex = Math.floor(Math.random() * firmwareVersions.length)

    const ipOctet3 = Math.floor(Math.random() * 255)
    const ipOctet4 = Math.floor(Math.random() * 255)

    const isDell = selectedModel.model.includes("PowerEdge")
    const identifier = isDell
      ? `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000)}`
      : `SGH${Math.floor(Math.random() * 1000000)}`

    // Generate random dates
    const manufactureDate = randomDate(startDate, now)

    // Purchase date is typically a bit after manufacture date
    const purchaseDate = new Date(manufactureDate)
    purchaseDate.setMonth(purchaseDate.getMonth() + Math.floor(Math.random() * 3))

    // Warranty end date is typically 3-5 years after purchase
    const warrantyEndDate = new Date(purchaseDate)
    warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 3 + Math.floor(Math.random() * 3))

    // Randomly determine if this server should have EOL status (10% chance)
    const isEOL = Math.random() < 0.1

    // Randomly determine if this server should have expired warranty (20% chance)
    const hasExpiredWarranty = Math.random() < 0.2

    // If warranty should be expired, set it to a past date
    if (hasExpiredWarranty) {
      warrantyEndDate.setFullYear(now.getFullYear() - 1)
    }

    servers.push({
      id: i.toString(),
      ipAddress: `10.10.${ipOctet3}.${ipOctet4}`,
      name: isDell
        ? `srv-${selectedModel.model.toLowerCase().replace(/\s+/g, "-")}-${i}`
        : `${selectedModel.generation?.toLowerCase() || "server"}-${i}`,
      identifier,
      model: selectedModel.model,
      type: "Compute",
      managedState: managedStates[managedStateIndex],
      status: statuses[statusIndex],
      generation: selectedModel.generation,
      managementController: selectedModel.controller,
      // Additional properties for filters
      lifecycleStatus: isEOL ? "EOL" : lifecycleStatuses[lifecycleStatusIndex],
      warrantyEndDate: warrantyEndDate.toISOString().split("T")[0],
      manufactureDate: manufactureDate,
      purchaseDate: purchaseDate.toISOString().split("T")[0],
      powerState: powerStates[powerStateIndex],
      bootStatus: bootStatuses[bootStatusIndex],
      firmwareVersion: firmwareVersions[firmwareVersionIndex],
      firmwareVerificationEnabled: Math.random() > 0.3, // 70% chance of being enabled
      requireRecoverySetPrivilege: Math.random() > 0.2, // 80% chance of being enabled
      passwordPolicyMinLength: Math.floor(Math.random() * 8) + 8, // 8-16 characters
      passwordPolicyRequiresLowercase: Math.random() > 0.1, // 90% chance of being enabled
      passwordPolicyRequiresUppercase: Math.random() > 0.1, // 90% chance of being enabled
      passwordPolicyRequiresNumbers: Math.random() > 0.1, // 90% chance of being enabled
      passwordPolicyRequiresSymbols: Math.random() > 0.2, // 80% chance of being enabled
      certificateIsSelfSigned: Math.random() < 0.3, // 30% chance of being self-signed
      certificateIssuer: Math.random() < 0.7 ? "Approved CA" : "Self-Signed",
      lockdownMode: Math.random() > 0.4, // 60% chance of being in lockdown mode
      accountName: Math.random() < 0.05 ? "root" : `user${i}`,
      accountEnabled: Math.random() > 0.2, // 80% chance of being enabled
    })
  }

  return servers
}

// Update the existing server data to include filter-related properties
export const serverData: Server[] = [
  {
    id: "1",
    ipAddress: "100.67.96.153",
    name: "100.67.96.153",
    identifier: "1PVrRT3",
    model: "PowerEdge XR4510c",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "critical",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-05-15",
    manufactureDate: "2023-01-10",
    purchaseDate: "2023-02-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.40",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "2",
    ipAddress: "100.67.96.181",
    name: "100.67.96.181",
    identifier: "3PVrRT3",
    model: "PowerEdge XR4510c",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-07-20",
    manufactureDate: "2023-02-15",
    purchaseDate: "2023-03-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "3",
    ipAddress: "100.67.96.214",
    name: "100.67.96.214",
    identifier: "JRWKZB3",
    model: "PowerEdge XR12",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "warning",
    lifecycleStatus: "EOL",
    warrantyEndDate: "2024-12-31",
    manufactureDate: "2020-06-10",
    purchaseDate: "2020-07-01",
    powerState: "On",
    bootStatus: "Degraded",
    firmwareVersion: "2.30",
    firmwareVerificationEnabled: false,
    requireRecoverySetPrivilege: false,
    passwordPolicyMinLength: 8,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: false,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: false,
    certificateIsSelfSigned: true,
    certificateIssuer: "Self-Signed",
    lockdownMode: false,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "4",
    ipAddress: "100.67.96.52",
    name: "100.67.96.52",
    identifier: "901YYG",
    model: "PowerEdge XR7620",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    lifecycleStatus: "Production",
    warrantyEndDate: "2027-01-15",
    manufactureDate: "2023-12-10",
    purchaseDate: "2024-01-05",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 16,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "5",
    ipAddress: "100.67.96.255",
    name: "100.67.96.255",
    identifier: "JKP9Z3",
    model: "PowerEdge XR4520c",
    type: "Compute",
    managedState: "Managed",
    status: "warning",
    lifecycleStatus: "Production",
    warrantyEndDate: "2025-08-30",
    manufactureDate: "2022-07-15",
    purchaseDate: "2022-08-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.30",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: false,
    passwordPolicyMinLength: 10,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: false,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: false,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "6",
    ipAddress: "WIN-8C37DQ55QU",
    name: "WIN-8C37DQ55QU",
    identifier: "PS75L3",
    model: "PowerEdge R650",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-03-15",
    manufactureDate: "2022-02-20",
    purchaseDate: "2022-03-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: undefined,
    accountEnabled: undefined,
  },
  {
    id: "7",
    ipAddress: "100.67.97.215",
    name: "100.67.97.215",
    identifier: "QZ15VH8",
    model: "PowerEdge R750",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-05-20",
    manufactureDate: "2023-04-10",
    purchaseDate: "2023-05-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: undefined,
    accountEnabled: undefined,
  },
  // HPE Servers
  {
    id: "8",
    ipAddress: "10.10.20.101",
    name: "hpe-gen9-01",
    identifier: "SGH123XYZ1",
    model: "HPE ProLiant DL380 Gen9",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen9",
    managementController: "iLO4",
    lifecycleStatus: "EOL",
    warrantyEndDate: "2023-05-15",
    manufactureDate: "2019-04-10",
    purchaseDate: "2019-05-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.30",
    firmwareVerificationEnabled: false,
    requireRecoverySetPrivilege: false,
    passwordPolicyMinLength: 8,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: false,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: false,
    certificateIsSelfSigned: true,
    certificateIssuer: "Self-Signed",
    lockdownMode: false,
    accountName: "root",
    accountEnabled: true,
  },
  {
    id: "9",
    ipAddress: "10.10.20.102",
    name: "hpe-gen9-02",
    identifier: "SGH123XYZ2",
    model: "HPE ProLiant DL360 Gen9",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "warning",
    generation: "Gen9",
    managementController: "iLO4",
    lifecycleStatus: "EOL",
    warrantyEndDate: "2023-06-20",
    manufactureDate: "2019-05-15",
    purchaseDate: "2019-06-01",
    powerState: "On",
    bootStatus: "Degraded",
    firmwareVersion: "2.30",
    firmwareVerificationEnabled: false,
    requireRecoverySetPrivilege: false,
    passwordPolicyMinLength: 8,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: false,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: false,
    certificateIsSelfSigned: true,
    certificateIssuer: "Self-Signed",
    lockdownMode: false,
    accountName: "root",
    accountEnabled: true,
  },
  {
    id: "10",
    ipAddress: "10.10.20.103",
    name: "hpe-gen10-01",
    identifier: "SGH456ABC1",
    model: "HPE ProLiant DL380 Gen10",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen10",
    managementController: "iLO5",
    lifecycleStatus: "Production",
    warrantyEndDate: "2025-07-15",
    manufactureDate: "2021-06-10",
    purchaseDate: "2021-07-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.40",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "11",
    ipAddress: "10.10.20.104",
    name: "hpe-gen10-02",
    identifier: "SGH456ABC2",
    model: "HPE ProLiant DL360 Gen10",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "critical",
    generation: "Gen10",
    managementController: "iLO5",
    lifecycleStatus: "Production",
    warrantyEndDate: "2025-08-20",
    manufactureDate: "2021-07-15",
    purchaseDate: "2021-08-01",
    powerState: "Off",
    bootStatus: "Failed",
    firmwareVersion: "2.40",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "12",
    ipAddress: "10.10.20.105",
    name: "hpe-gen10-03",
    identifier: "SGH456ABC3",
    model: "HPE ProLiant DL325 Gen10",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen10",
    managementController: "iLO5",
    lifecycleStatus: "Production",
    warrantyEndDate: "2025-09-15",
    manufactureDate: "2021-08-10",
    purchaseDate: "2021-09-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.40",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "13",
    ipAddress: "10.10.20.106",
    name: "hpe-gen10plus-01",
    identifier: "SGH789DEF1",
    model: "HPE ProLiant DL380 Gen10 Plus",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen10 Plus",
    managementController: "iLO5",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-10-15",
    manufactureDate: "2022-09-10",
    purchaseDate: "2022-10-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "14",
    ipAddress: "10.10.20.107",
    name: "hpe-gen10plus-02",
    identifier: "SGH789DEF2",
    model: "HPE ProLiant DL360 Gen10 Plus",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "warning",
    generation: "Gen10 Plus",
    managementController: "iLO5",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-11-20",
    manufactureDate: "2022-10-15",
    purchaseDate: "2022-11-01",
    powerState: "On",
    bootStatus: "Degraded",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "15",
    ipAddress: "10.10.20.108",
    name: "hpe-gen11-01",
    identifier: "SGH101GHI1",
    model: "HPE ProLiant DL380 Gen11",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen11",
    managementController: "iLO6",
    lifecycleStatus: "Production",
    warrantyEndDate: "2027-12-15",
    manufactureDate: "2023-11-10",
    purchaseDate: "2023-12-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 16,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "16",
    ipAddress: "10.10.20.109",
    name: "hpe-gen11-02",
    identifier: "SGH101GHI2",
    model: "HPE ProLiant DL360 Gen11",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    generation: "Gen11",
    managementController: "iLO6",
    lifecycleStatus: "Production",
    warrantyEndDate: "2028-01-20",
    manufactureDate: "2023-12-15",
    purchaseDate: "2024-01-05",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 16,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  // Dell Servers
  {
    id: "17",
    ipAddress: "10.10.30.101",
    name: "dell-r6515-01",
    identifier: "7ABCDE1",
    model: "PowerEdge R6515",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    managementController: "iDRAC9",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-02-15",
    manufactureDate: "2022-01-10",
    purchaseDate: "2022-02-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "18",
    ipAddress: "10.10.30.102",
    name: "dell-r6515-02",
    identifier: "7ABCDE2",
    model: "PowerEdge R6515",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "warning",
    managementController: "iDRAC9",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-03-20",
    manufactureDate: "2022-02-15",
    purchaseDate: "2022-03-01",
    powerState: "On",
    bootStatus: "Degraded",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "19",
    ipAddress: "10.10.30.103",
    name: "dell-r6515-03",
    identifier: "7ABCDE3",
    model: "PowerEdge R6515",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    managementController: "iDRAC9",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-04-15",
    manufactureDate: "2022-03-10",
    purchaseDate: "2022-04-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.41",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 12,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "20",
    ipAddress: "10.10.30.104",
    name: "dell-r740xd-01",
    identifier: "8FGHIJ1",
    model: "PowerEdge R740xd",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    managementController: "iDRAC9",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-05-15",
    manufactureDate: "2022-04-10",
    purchaseDate: "2022-05-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "21",
    ipAddress: "10.10.30.105",
    name: "dell-r740xd-02",
    identifier: "8FGHIJ2",
    model: "PowerEdge R740xd",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "critical",
    managementController: "iDRAC9",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-06-20",
    manufactureDate: "2022-05-15",
    purchaseDate: "2022-06-01",
    powerState: "Off",
    bootStatus: "Failed",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  {
    id: "22",
    ipAddress: "10.10.30.106",
    name: "dell-r740xd-03",
    identifier: "8FGHIJ3",
    model: "PowerEdge R740xd",
    type: "Compute",
    managedState: "Managed with Alerts",
    status: "normal",
    managementController: "iDRAC9 Enterprise",
    lifecycleStatus: "Production",
    warrantyEndDate: "2026-07-15",
    manufactureDate: "2022-06-10",
    purchaseDate: "2022-07-01",
    powerState: "On",
    bootStatus: "OK",
    firmwareVersion: "2.42",
    firmwareVerificationEnabled: true,
    requireRecoverySetPrivilege: true,
    passwordPolicyMinLength: 14,
    passwordPolicyRequiresLowercase: true,
    passwordPolicyRequiresUppercase: true,
    passwordPolicyRequiresNumbers: true,
    passwordPolicyRequiresSymbols: true,
    certificateIsSelfSigned: false,
    certificateIssuer: "Approved CA",
    lockdownMode: true,
    accountName: "admin",
    accountEnabled: true,
  },
  // Add additional servers to fill 5 pages (10 servers per page = 50 servers total)
  ...generateAdditionalServers(30), // Generate 30 more servers to reach 52 total (more than 5 pages)
]

// Add detailed information to the mock data
serverData.forEach((server) => {
  // Add mock detailed information for each server
  server.summary = {
    serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    manufacturer: ["Dell", "HP", "Lenovo", "Cisco", "SuperMicro"][Math.floor(Math.random() * 5)],
    location: `Datacenter ${Math.floor(Math.random() * 5) + 1}`,
    rackPosition: `Rack ${Math.floor(Math.random() * 20) + 1}, U${Math.floor(Math.random() * 40) + 1}`,
    assetTag: `ASSET-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    biosVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }

  // Add 1-4 processors
  const processorCount = Math.floor(Math.random() * 4) + 1
  server.processors = Array.from({ length: processorCount }, (_, i) => ({
    id: `CPU-${i}`,
    model: ["Intel Xeon Gold", "AMD EPYC", "Intel Xeon Silver", "Intel Xeon Platinum"][Math.floor(Math.random() * 4)],
    manufacturer: ["Intel", "AMD"][Math.floor(Math.random() * 2)],
    cores: [8, 16, 24, 32, 64][Math.floor(Math.random() * 5)],
    threads: [16, 32, 48, 64, 128][Math.floor(Math.random() * 5)],
    speed: `${Math.floor(Math.random() * 10) + 2}.${Math.floor(Math.random() * 10)}GHz`,
    status: ["OK", "Warning", "Critical", "Unknown"][Math.floor(Math.random() * 4)],
  }))

  // Add 2-16 memory modules
  const memoryCount = Math.floor(Math.random() * 14) + 2
  server.memory = Array.from({ length: memoryCount }, (_, i) => ({
    id: `DIMM-${i}`,
    location: `DIMM ${String.fromCharCode(65 + i)}`,
    capacity: `${[8, 16, 32, 64, 128][Math.floor(Math.random() * 5)]}GB`,
    type: ["DDR4", "DDR5"][Math.floor(Math.random() * 2)],
    speed: `${[2400, 2666, 3200, 4800, 5600][Math.floor(Math.random() * 5)]}MHz`,
    status: ["OK", "Warning", "Critical", "Unknown"][Math.floor(Math.random() * 4)],
  }))

  // Add 1-8 storage devices
  const storageCount = Math.floor(Math.random() * 8) + 1
  server.storage = Array.from({ length: storageCount }, (_, i) => ({
    id: `DISK-${i}`,
    type: ["SSD", "HDD", "NVMe"][Math.floor(Math.random() * 3)],
    model: ["Samsung", "Intel", "Seagate", "WD", "Micron"][Math.floor(Math.random() * 5)],
    capacity: `${[240, 480, 960, 1920, 3840, 7680][Math.floor(Math.random() * 6)]}GB`,
    interface: ["SATA", "SAS", "PCIe"][Math.floor(Math.random() * 3)],
    status: ["OK", "Warning", "Critical", "Unknown"][Math.floor(Math.random() * 4)],
  }))

  // Add 1-4 network interfaces
  const networkCount = Math.floor(Math.random() * 4) + 1
  server.network = Array.from({ length: networkCount }, (_, i) => ({
    id: `NIC-${i}`,
    macAddress: Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    ).join(":"),
    type: ["1GbE", "10GbE", "25GbE", "40GbE", "100GbE"][Math.floor(Math.random() * 5)],
    speed: ["1 Gbps", "10 Gbps", "25 Gbps", "40 Gbps", "100 Gbps"][Math.floor(Math.random() * 5)],
    status: ["OK", "Warning", "Critical", "Unknown"][Math.floor(Math.random() * 4)],
    ipAddresses: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () =>
        `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    ),
  }))

  // Add 1-2 power supplies
  const powerCount = Math.floor(Math.random() * 2) + 1
  server.power = Array.from({ length: powerCount }, (_, i) => ({
    id: `PSU-${i}`,
    type: ["AC", "DC"][Math.floor(Math.random() * 2)],
    capacity: `${[750, 1000, 1200, 1500, 2000][Math.floor(Math.random() * 5)]}W`,
    status: ["OK", "Warning", "Critical", "Unknown"][Math.floor(Math.random() * 4)],
    efficiency: ["80 PLUS", "80 PLUS Bronze", "80 PLUS Silver", "80 PLUS Gold", "80 PLUS Platinum", "80 PLUS Titanium"][
      Math.floor(Math.random() * 6)
    ],
  }))

  // Add system information
  server.system = {
    operatingSystem: [
      "Windows Server 2019",
      "Windows Server 2022",
      "Ubuntu 20.04 LTS",
      "Ubuntu 22.04 LTS",
      "RHEL 8",
      "RHEL 9",
    ][Math.floor(Math.random() * 6)],
    osVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
    kernelVersion: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}`,
    lastBootTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    uptime: `${Math.floor(Math.random() * 30)} days, ${Math.floor(Math.random() * 24)} hours`,
    loadAverage: `${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 2).toFixed(2)}`,
    users: Math.floor(Math.random() * 10),
  }
})

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

export const filterData: Filter[] = [
  {
    id: "end-of-life",
    name: "End of Life",
    description: "Servers that have reached end of life",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "lifecycle_status = 'EOL'",
    category: "Basic Filters",
    rules: [
      {
        id: "1",
        field: "Lifecycle Stage Status",
        operator: "equals",
        value: "EOL",
        logic: "AND",
      },
    ],
  },
  {
    id: "end-of-warranty",
    name: "End of Warranty",
    description: "Servers with expired warranty",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "warranty_end_date < CURRENT_DATE",
    category: "Basic Filters",
    rules: [
      {
        id: "1",
        field: "Warranty Info",
        operator: "contains",
        value: "expired",
        logic: "OR",
      },
      {
        id: "2",
        field: "Warranty Info",
        operator: "less than",
        value: "2025-05-16",
        logic: "AND",
      },
    ],
  },
  {
    id: "manufactured-2022",
    name: "Manufactured 2022+",
    description: "Servers manufactured in 2022 or later",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "manufacture_date >= '2022-01-01'",
    category: "Basic Filters",
    rules: [
      {
        id: "1",
        field: "Purchase Date",
        operator: "greater than",
        value: "2022-01-01",
        logic: "AND",
      },
    ],
  },
  {
    id: "power-on",
    name: "Power On",
    description: "Servers that are powered on",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "power_state = 'On'",
    category: "Basic Filters",
    rules: [
      {
        id: "1",
        field: "Power State",
        operator: "equals",
        value: "On",
        logic: "AND",
      },
    ],
  },
  {
    id: "boot-failure",
    name: "Boot Failure",
    description: "Servers with boot failures",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "boot_status = 'Failed'",
    category: "Basic Filters",
    rules: [
      {
        id: "1",
        field: "Boot Status",
        operator: "equals",
        value: "Failed",
        logic: "AND",
      },
    ],
  },
  {
    id: "firmware-version-check",
    name: "Firmware Version Check",
    description: "Verifies all iLO systems are on the same approved firmware version",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "firmware_version = '2.40'",
    redfishResource: "/redfish/v1/UpdateService/FirmwareInventory",
    category: "Firmware Management Filters",
    rules: [
      {
        id: "1",
        field: "Firmware Version",
        operator: "equals",
        value: "2.40",
        logic: "OR",
      },
      {
        id: "2",
        field: "Firmware Version",
        operator: "equals",
        value: "2.41",
        logic: "OR",
      },
      {
        id: "3",
        field: "Firmware Version",
        operator: "equals",
        value: "2.42",
        logic: "AND",
      },
    ],
  },
  {
    id: "firmware-verification-status",
    name: "Firmware Verification Status",
    description: "Ensures firmware verification scans are enabled",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "firmware_verification_enabled = true",
    redfishResource: "/redfish/v1/Managers/1/SecurityService/FirmwareValidation",
    category: "Firmware Management Filters",
    rules: [
      {
        id: "1",
        field: "FirmwareVerificationEnabled",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
    ],
  },
  {
    id: "firmware-downgrade-policy",
    name: "Firmware Downgrade Policy",
    description: "Confirms downgrade restriction is properly configured",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "require_recovery_set_privilege = true",
    redfishResource: "/redfish/v1/Managers/1/SecurityService",
    category: "Firmware Management Filters",
    rules: [
      {
        id: "1",
        field: "RequireRecoverySetPrivilege",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
    ],
  },
  {
    id: "local-role-configuration",
    name: "Local Role Configuration",
    description: "Checks that proper role-based access control is implemented",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "roles CONTAINS ('iLO_Administrator', 'iLO_User', 'iLO_Read')",
    redfishResource: "/redfish/v1/AccountService/Roles",
    category: "Authentication & Authorization Filters",
    rules: [
      {
        id: "1",
        field: "Roles",
        operator: "contains",
        value: "iLO_Administrator",
        logic: "AND",
      },
      {
        id: "2",
        field: "Roles",
        operator: "contains",
        value: "iLO_User",
        logic: "AND",
      },
      {
        id: "3",
        field: "Roles",
        operator: "contains",
        value: "iLO_Read",
        logic: "AND",
      },
    ],
  },
  {
    id: "password-complexity",
    name: "Password Complexity",
    description: "Ensures password complexity requirements are enforced",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query:
      "password_policy_min_length >= 12 AND password_policy_requires_lowercase = true AND password_policy_requires_uppercase = true AND password_policy_requires_numbers = true AND password_policy_requires_symbols = true",
    redfishResource: "/redfish/v1/AccountService",
    category: "Authentication & Authorization Filters",
    rules: [
      {
        id: "1",
        field: "PasswordPolicyMinLength",
        operator: "greater than or equal",
        value: "12",
        logic: "AND",
      },
      {
        id: "2",
        field: "PasswordPolicyRequiresLowercase",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
      {
        id: "3",
        field: "PasswordPolicyRequiresUppercase",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
      {
        id: "4",
        field: "PasswordPolicyRequiresNumbers",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
      {
        id: "5",
        field: "PasswordPolicyRequiresSymbols",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
    ],
  },
  {
    id: "ssl-certificate-validity",
    name: "SSL Certificate Validity",
    description: "Ensures proper SSL certificates are installed",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "certificate_is_self_signed = false AND certificate_issuer LIKE '%Approved CA%'",
    redfishResource: "/redfish/v1/Managers/1/SecurityService/HttpsCert",
    category: "Certificate Management Filters",
    rules: [
      {
        id: "1",
        field: "CertificateIsSelfSigned",
        operator: "equals",
        value: "false",
        logic: "AND",
      },
      {
        id: "2",
        field: "CertificateIssuer",
        operator: "contains",
        value: "Approved CA",
        logic: "AND",
      },
    ],
  },
  {
    id: "management-network-isolation",
    name: "Management Network Isolation",
    description: "Ensures iLO interfaces are on isolated management networks",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "ip_address LIKE '10.%' OR ip_address LIKE '172.16.%' OR ip_address LIKE '192.168.%'",
    redfishResource: "/redfish/v1/Managers/1/EthernetInterfaces",
    category: "Network Security Filters",
    rules: [
      {
        id: "1",
        field: "IPAddress",
        operator: "starts with",
        value: "10.",
        logic: "OR",
      },
      {
        id: "2",
        field: "IPAddress",
        operator: "starts with",
        value: "172.16.",
        logic: "OR",
      },
      {
        id: "3",
        field: "IPAddress",
        operator: "starts with",
        value: "192.168.",
        logic: "AND",
      },
    ],
  },
  {
    id: "disabled-services-check",
    name: "Disabled Services Check",
    description: "Confirms unused management features are disabled",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "insight_remote_support_enabled = false AND ilo_federation_enabled = false AND ipmi_enabled = false",
    redfishResource: "/redfish/v1/Managers/1/NetworkProtocol",
    category: "Service Disablement Filters",
    rules: [
      {
        id: "1",
        field: "InsightRemoteSupportEnabled",
        operator: "equals",
        value: "false",
        logic: "AND",
      },
      {
        id: "2",
        field: "IloFederationEnabled",
        operator: "equals",
        value: "false",
        logic: "AND",
      },
      {
        id: "3",
        field: "IPMIEnabled",
        operator: "equals",
        value: "false",
        logic: "AND",
      },
    ],
  },
  {
    id: "system-lockdown-mode",
    name: "System Lockdown Mode",
    description: "Ensures system configuration changes are blocked when in lockdown mode",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "system_server_settings_lockdown_mode = true",
    redfishResource: "/redfish/v1/Managers/1/Attributes",
    category: "iDRAC Security Standards",
    rules: [
      {
        id: "1",
        field: "System.ServerSettings.LockdownMode",
        operator: "equals",
        value: "true",
        logic: "AND",
      },
    ],
  },
  {
    id: "default-root-account-status",
    name: "Default Root Account Status",
    description: "Confirms the default root account shipped with the system is disabled",
    createdBy: "System",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isPublic: true,
    query: "account_name = 'root' AND account_enabled = false",
    redfishResource: "/redfish/v1/AccountService/Accounts",
    category: "iDRAC Security Standards",
    rules: [
      {
        id: "1",
        field: "AccountName",
        operator: "equals",
        value: "root",
        logic: "AND",
      },
      {
        id: "2",
        field: "AccountEnabled",
        operator: "equals",
        value: "false",
        logic: "AND",
      },
    ],
  },
]

export function getFilterById(id: string): Filter | undefined {
  return filterData.find((filter) => filter.id === id)
}
