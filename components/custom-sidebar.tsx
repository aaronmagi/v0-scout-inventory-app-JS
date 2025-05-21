"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Database,
  HardDrive,
  Laptop,
  Layers,
  Network,
  Power,
  Server,
  Settings,
  Smartphone,
} from "lucide-react"

export function CustomSidebar() {
  const [allDevicesOpen, setAllDevicesOpen] = useState(true)
  const [systemGroupsOpen, setSystemGroupsOpen] = useState(true)
  const [customGroupsOpen, setCustomGroupsOpen] = useState(false)

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-white">
      <div className="overflow-y-auto h-full">
        <div className="py-2">
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => setAllDevicesOpen(!allDevicesOpen)}
          >
            <span>ALL DEVICES</span>
            {allDevicesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          {allDevicesOpen && (
            <div className="pl-4">
              <ul className="space-y-1 py-1">
                <li>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 text-blue-600 font-medium"
                  >
                    <Server className="h-4 w-4 mr-2 text-blue-500" />
                    <span>All Servers</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="py-2">
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => setSystemGroupsOpen(!systemGroupsOpen)}
          >
            <span>SYSTEM GROUPS</span>
            {systemGroupsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          {systemGroupsOpen && (
            <div className="pl-4">
              <ul className="space-y-1 py-1">
                <li>
                  <Link
                    href="/hci-appliances"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Layers className="h-4 w-4 mr-2 text-gray-500" />
                    <span>HCI Appliances</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hypervisor-systems"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Laptop className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Hypervisor Systems</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/modular-systems"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Modular Systems</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/network-devices"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Network className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Network Devices</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pdu-devices"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Power className="h-4 w-4 mr-2 text-gray-500" />
                    <span>PDU Devices</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 text-blue-600 font-medium bg-blue-50"
                  >
                    <Server className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Servers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/storage-devices"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Database className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Storage Devices</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ups-devices"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
                    <span>UPS Devices</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="py-2">
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => setCustomGroupsOpen(!customGroupsOpen)}
          >
            <span>CUSTOM GROUPS</span>
            {customGroupsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          {customGroupsOpen && (
            <div className="pl-4">
              <ul className="space-y-1 py-1">
                <li>
                  <Link
                    href="/custom-groups"
                    className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Create Custom Group</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
