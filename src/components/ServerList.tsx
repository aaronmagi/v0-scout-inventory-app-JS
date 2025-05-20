"use client"

import Link from "next/link"
import type { Server } from "../types"

interface ServerListProps {
  servers: Server[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ServerList({ servers, currentPage, totalPages, onPageChange }: ServerListProps) {
  const columns = [
    { id: "status", header: "Status" },
    { id: "ipAddress", header: "IP Address" },
    { id: "name", header: "Name" },
    { id: "identifier", header: "Identifier" },
    { id: "model", header: "Model" },
    { id: "type", header: "Type" },
    { id: "managedState", header: "Managed State" },
    { id: "actions", header: "Actions" },
  ]

  const renderCell = (server: Server, column: { id: string; header: string }) => {
    switch (column.id) {
      case "status":
        return (
          <div className="flex items-center justify-center">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  server.status === "critical"
                    ? "red"
                    : server.status === "warning"
                      ? "orange"
                      : server.status === "normal"
                        ? "green"
                        : "gray",
              }}
            />
          </div>
        )
      case "name":
        return (
          <Link href={`/servers/${server.id}`} className="text-blue-600 hover:underline">
            {server.name}
          </Link>
        )
      case "actions":
        return (
          <div className="flex justify-center">
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
        )
      default:
        return server[column.id as keyof Server]
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="p-3 text-left font-medium text-gray-700">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servers.length > 0 ? (
              servers.map((server) => (
                <tr key={server.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${server.id}-${column.id}`} className="p-3">
                      {renderCell(server, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  No servers found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 mt-4 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Showing {servers.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, servers.length)} of{" "}
          {servers.length} servers
        </div>

        <div className="flex gap-1">
          <button
            className={`h-8 w-8 flex items-center justify-center rounded ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={`page-${page}`}
              className={`h-8 w-8 flex items-center justify-center rounded ${
                currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`h-8 w-8 flex items-center justify-center rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            »
          </button>
        </div>
      </div>
    </div>
  )
}
