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
  accountName?: string
  accountEnabled?: boolean
  [key: string]: any
}
