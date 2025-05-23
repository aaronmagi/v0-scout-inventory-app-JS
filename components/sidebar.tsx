"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Server,
  Database,
  Network,
  Bell,
  Users,
  Shield,
  Settings,
  Laptop,
  MonitorSmartphone,
  Boxes,
  Router,
  Power,
  HardDrive,
  BatteryCharging,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function Sidebar() {
  const pathname = usePathname()
  const [isServersOpen, setIsServersOpen] = useState(true)
  const [isUsersOpen, setIsUsersOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [phaseTwoModal, setPhaseTwoModal] = useState({ isOpen: false, feature: "" })

  const toggleServers = () => setIsServersOpen(!isServersOpen)
  const toggleUsers = () => setIsUsersOpen(!isUsersOpen)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)

  const showPhaseTwo = (feature: string) => {
    setPhaseTwoModal({ isOpen: true, feature })
  }

  const closePhaseTwo = () => {
    setPhaseTwoModal({ isOpen: false, feature: "" })
  }

  return (
    <>
      <div className="w-64 bg-[#E20074] text-white h-full flex flex-col">
        <div className="p-4 border-b border-[#B00058]">
          <h1 className="text-xl font-bold">Scout Inventory</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2">
            <li>
              <Link
                href="/"
                className={`flex items-center p-2 rounded-md ${pathname === "/" ? "bg-[#B00058]" : "hover:bg-[#B00058]"}`}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="mt-2">
              <button
                onClick={toggleServers}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <div className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  <span>Servers</span>
                </div>
                {isServersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isServersOpen && (
                <ul className="pl-4 mt-1">
                  <li>
                    <button
                      onClick={() => showPhaseTwo("HCI Appliances")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Boxes className="mr-2 h-4 w-4" />
                      <span>HCI Appliances</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Hypervisor Systems")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>Hypervisor Systems</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Modular Systems")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <MonitorSmartphone className="mr-2 h-4 w-4" />
                      <span>Modular Systems</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Network Devices")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Router className="mr-2 h-4 w-4" />
                      <span>Network Devices</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("PDU Devices")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Power className="mr-2 h-4 w-4" />
                      <span>PDU Devices</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className={`flex items-center p-2 rounded-md ${pathname === "/servers/servers" ? "bg-[#B00058]" : "hover:bg-[#B00058]"}`}
                    >
                      <Server className="mr-2 h-4 w-4" />
                      <span>Servers</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Storage Devices")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <HardDrive className="mr-2 h-4 w-4" />
                      <span>Storage Devices</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("UPS Devices")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <BatteryCharging className="mr-2 h-4 w-4" />
                      <span>UPS Devices</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li className="mt-2">
              <button
                onClick={() => showPhaseTwo("Hardware")}
                className="flex items-center w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <Database className="mr-2 h-5 w-5" />
                <span>Hardware</span>
              </button>
            </li>
            <li className="mt-2">
              <button
                onClick={() => showPhaseTwo("Network")}
                className="flex items-center w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <Network className="mr-2 h-5 w-5" />
                <span>Network</span>
              </button>
            </li>
            <li className="mt-2">
              <button
                onClick={() => showPhaseTwo("Alerts")}
                className="flex items-center w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <Bell className="mr-2 h-5 w-5" />
                <span>Alerts</span>
              </button>
            </li>
            <li className="mt-2">
              <button
                onClick={toggleUsers}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>Users</span>
                </div>
                {isUsersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isUsersOpen && (
                <ul className="pl-4 mt-1">
                  <li>
                    <button
                      onClick={() => showPhaseTwo("All Users")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>All Users</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Roles")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Roles</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li className="mt-2">
              <button
                onClick={() => showPhaseTwo("Security")}
                className="flex items-center w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <Shield className="mr-2 h-5 w-5" />
                <span>Security</span>
              </button>
            </li>
            <li className="mt-2">
              <button
                onClick={toggleSettings}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#B00058]"
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Settings</span>
                </div>
                {isSettingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isSettingsOpen && (
                <ul className="pl-4 mt-1">
                  <li>
                    <button
                      onClick={() => showPhaseTwo("General Settings")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>General</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("API Settings")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Network className="mr-2 h-4 w-4" />
                      <span>API</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => showPhaseTwo("Notification Settings")}
                      className="flex items-center p-2 rounded-md hover:bg-[#B00058] w-full text-left"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-[#B00058] text-xs text-white">Version 1.0.0</div>
      </div>

      <Dialog open={phaseTwoModal.isOpen} onOpenChange={closePhaseTwo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Coming in Phase 2</DialogTitle>
            <DialogDescription>
              The {phaseTwoModal.feature} feature will be available in Phase 2 of the Scout Inventory application.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
