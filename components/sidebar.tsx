"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChevronDown, ChevronRight, FolderClosed, Server } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState({
    allDevices: false,
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

  const customGroups = [
    { name: "Query Groups", path: "/groups/query-groups" },
    { name: "Static Groups", path: "/groups/static-groups" },
  ]

  return (
    <ShadcnSidebar className="border-r border-gray-200 pt-0 mt-0">
      <SidebarContent>
        <SidebarGroup>
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => toggleGroup("allDevices")}
          >
            <span>ALL DEVICES</span>
            <span>{expandedGroups.allDevices ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          </div>
          {expandedGroups.allDevices && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={pathname === "/"}>
                    <Server size={16} className="text-gray-500" />
                    <span>All Servers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => toggleGroup("systemGroups")}
          >
            <span>SYSTEM GROUPS</span>
            <span>{expandedGroups.systemGroups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          </div>
          {expandedGroups.systemGroups && (
            <SidebarGroupContent>
              <SidebarMenu>
                {systemGroups.map((group) => (
                  <SidebarMenuItem key={group.name}>
                    <SidebarMenuButton isActive={pathname === group.path}>
                      <FolderClosed size={16} className="text-gray-500" />
                      <span>{group.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <div
            className="font-bold py-2.5 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => toggleGroup("customGroups")}
          >
            <span>CUSTOM GROUPS</span>
            <span>{expandedGroups.customGroups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          </div>
          {expandedGroups.customGroups && (
            <SidebarGroupContent>
              <SidebarMenu>
                {customGroups.map((group) => (
                  <SidebarMenuItem key={group.name}>
                    <SidebarMenuButton isActive={pathname === group.path}>
                      <FolderClosed size={16} className="text-gray-500" />
                      <span>{group.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  )
}
