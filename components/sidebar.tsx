"use client"

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
} from "lucide-react"

export function Sidebar() {
  const [openSections, setOpenSections] = useState({
    servers: true,
    settings: false,
    users: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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
                  <Link
                    href="/servers/critical"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Critical Status</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servers/warranty"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Warranty Expiring</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servers/groups"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Server Groups</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Hardware */}
          <li>
            <Link
              href="/hardware"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <HardDrive className="h-5 w-5" />
              <span>Hardware</span>
            </Link>
          </li>

          {/* Network */}
          <li>
            <Link
              href="/network"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Network className="h-5 w-5" />
              <span>Network</span>
            </Link>
          </li>

          {/* Alerts */}
          <li>
            <Link
              href="/alerts"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Alerts</span>
            </Link>
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
                  <Link
                    href="/users"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>All Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/users/roles"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Roles</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Security */}
          <li>
            <Link
              href="/security"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </Link>
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
                  <Link
                    href="/settings/general"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>General</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings/api"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>API</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings/notifications"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span>Notifications</span>
                  </Link>
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
    </div>
  )
}
