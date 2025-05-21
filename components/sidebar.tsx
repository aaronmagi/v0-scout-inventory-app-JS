"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  Server,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  AlertCircle,
  HardDrive,
  Network,
  Database,
  Monitor,
  Layers,
  Router,
  Power,
  StoreIcon as Storage,
  BatteryCharging,
} from "lucide-react"
import { PhaseTwoModal } from "./phase-two-modal"

export function Sidebar() {
  const [openSections, setOpenSections] = useState({
    servers: true,
    settings: false,
    users: false,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState("")

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handlePhaseTwo = (featureName: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedFeature(featureName)
    setModalOpen(true)
  }

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Scout Inventory</h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Servers Section */}
          <li>
            <button
              onClick={() => toggleSection("servers")}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5" />
                <span>Servers</span>
              </div>
              {openSections.servers ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {openSections.servers && (
              <ul className="mt-1 ml-6 space-y-1">
                <li>
                  <Link
                    href="/servers"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>All Servers</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("HCI Appliances")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Database className="h-4 w-4" />
                    <span>HCI Appliances</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Hypervisor Systems")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Hypervisor Systems</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Modular Systems")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Modular Systems</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Network Devices")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Router className="h-4 w-4" />
                    <span>Network Devices</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("PDU Devices")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Power className="h-4 w-4" />
                    <span>PDU Devices</span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/servers/critical"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Server className="h-4 w-4" />
                    <span>Servers</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Storage Devices")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Storage className="h-4 w-4" />
                    <span>Storage Devices</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("UPS Devices")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <BatteryCharging className="h-4 w-4" />
                    <span>UPS Devices</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Hardware */}
          <li>
            <a
              href="#"
              onClick={handlePhaseTwo("Hardware")}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <HardDrive className="h-5 w-5" />
              <span>Hardware</span>
            </a>
          </li>

          {/* Network */}
          <li>
            <a
              href="#"
              onClick={handlePhaseTwo("Network")}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Network className="h-5 w-5" />
              <span>Network</span>
            </a>
          </li>

          {/* Alerts */}
          <li>
            <a
              href="#"
              onClick={handlePhaseTwo("Alerts")}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Alerts</span>
            </a>
          </li>

          {/* Users Section */}
          <li>
            <button
              onClick={() => toggleSection("users")}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </div>
              {openSections.users ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {openSections.users && (
              <ul className="mt-1 ml-6 space-y-1">
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("All Users")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>All Users</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Roles")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Roles</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Security */}
          <li>
            <a
              href="#"
              onClick={handlePhaseTwo("Security")}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </a>
          </li>

          {/* Settings Section */}
          <li>
            <button
              onClick={() => toggleSection("settings")}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </div>
              {openSections.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {openSections.settings && (
              <ul className="mt-1 ml-6 space-y-1">
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("General Settings")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>General</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("API Settings")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>API</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handlePhaseTwo("Notifications Settings")}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Notifications</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <p>Scout Inventory v1.0.0</p>
        </div>
      </div>

      <PhaseTwoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} featureName={selectedFeature} />
    </div>
  )
}
