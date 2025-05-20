"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown, ChevronRight, Server, FolderClosed } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sidebar as SidebarComponent, SidebarContent } from "@/components/ui/sidebar"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [expandedGroups, setExpandedGroups] = useState({
    allDevices: true,
    systemGroups: true,
    customGroups: false,
  })

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const systemGroups = [
    { name: "HCI Appliances", path: "/groups/hci-appliances" },
    { name: "Hypervisor Systems", path: "/groups/hypervisor-systems" },
    { name: "Modular Systems", path: "/groups/modular-systems" },
    { name: "Network Devices", path: "/groups/network-devices" },
    { name: "PDU Devices", path: "/groups/pdu-devices" },
    { name: "Servers", path: "/" },
    { name: "Storage Devices", path: "/groups/storage-devices" },
    { name: "UPS Devices", path: "/groups/ups-devices" },
  ]

  return (
    <SidebarComponent className="border-r border-gray-200 bg-gray-50 w-64 flex-shrink-0 mt-0 z-10">
      <SidebarContent className="p-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleGroup("allDevices")}
          >
            <div className="font-semibold text-gray-700">ALL DEVICES</div>
            <div>{expandedGroups.allDevices ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
          </div>

          {expandedGroups.allDevices && (
            <div className="pl-4">
              <Link
                href="/"
                className={`flex items-center px-4 py-2 text-sm ${pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Server size={16} className="mr-2" />
                <span>All Servers</span>
              </Link>
            </div>
          )}

          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 mt-1"
            onClick={() => toggleGroup("systemGroups")}
          >
            <div className="font-semibold text-gray-700">SYSTEM GROUPS</div>
            <div>{expandedGroups.systemGroups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
          </div>

          {expandedGroups.systemGroups && (
            <div className="pl-4">
              {systemGroups.map((group) => (
                <Link
                  key={group.name}
                  href={group.path}
                  className={`flex items-center px-4 py-2 text-sm ${pathname === group.path ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <FolderClosed size={16} className="mr-2" />
                  <span>{group.name}</span>
                </Link>
              ))}
            </div>
          )}

          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 mt-1"
            onClick={() => toggleGroup("customGroups")}
          >
            <div className="font-semibold text-gray-700">CUSTOM GROUPS</div>
            <div>{expandedGroups.customGroups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
          </div>

          {expandedGroups.customGroups && (
            <div className="pl-4">
              <Link
                href="/groups/query-groups"
                className={`flex items-center px-4 py-2 text-sm ${pathname === "/groups/query-groups" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <FolderClosed size={16} className="mr-2" />
                <span>Query Groups</span>
              </Link>
              <Link
                href="/groups/static-groups"
                className={`flex items-center px-4 py-2 text-sm ${pathname === "/groups/static-groups" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <FolderClosed size={16} className="mr-2" />
                <span>Static Groups</span>
              </Link>
            </div>
          )}
        </div>
      </SidebarContent>
    </SidebarComponent>
  )
}
