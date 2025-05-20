"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getBackendSrv } from "@grafana/runtime"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"
import { API_BASE_URL } from "../constants"
import type { Server } from "../types"

// Custom components instead of Grafana UI
const LoadingPlaceholder = ({ text }: { text: string }) => (
  <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>{text || "Loading..."}</div>
)

const Button = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: string
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      backgroundColor: variant === "primary" ? "#3b82f6" : "transparent",
      color: variant === "primary" ? "white" : "#3b82f6",
      border: variant === "primary" ? "none" : "1px solid #3b82f6",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
)

const Icon = ({ name }: { name: string }) => (
  <span style={{ marginRight: "4px" }}>{name === "arrow-left" ? "←" : name === "expand-alt" ? "⤢" : "⚙️"}</span>
)

// Custom useStyles2 hook
const useStyles2 = (fn: any) =>
  fn({
    colors: {
      primary: { text: "#3b82f6" },
      text: { secondary: "#6b7280" },
      background: { primary: "#ffffff" },
      border: { weak: "#e5e7eb" },
    },
    shadows: { z1: "0 1px 3px rgba(0, 0, 0, 0.1)" },
  })

export function ServerDetailsPage() {
  const styles = useStyles2(getStyles)
  const [server, setServer] = useState<Server | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")

  // Get server ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const serverId = urlParams.get("id")

  useEffect(() => {
    if (serverId) {
      fetchServerDetails(serverId)
    } else {
      setError("Server ID is missing from the URL")
      setIsLoading(false)
    }
  }, [serverId])

  const fetchServerDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would use the backend API
      // For now, we'll simulate the API call
      const response = await getBackendSrv().get(`${API_BASE_URL}/servers/${id}`)

      setServer(response)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching server details:", err)
      setError("Failed to fetch server details. Please try again later.")
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingPlaceholder text="Loading server details..." />
  }

  if (error || !server) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error</h3>
        <p>{error || "Server not found"}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <a href="/a/tmobile-scout-inventory" className={styles.breadcrumbLink}>
            <Icon name="arrow-left" /> Back to All Servers
          </a>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <span>{server.name}</span>
        </div>

        <h1 className={styles.title}>System Information - {server.name}</h1>

        <Button variant="secondary">
          <Icon name="expand-alt" /> Zoom
        </Button>
      </div>

      {/* Custom tabs implementation */}
      <div className="flex border-b border-gray-200 mb-4">
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "summary" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "processors" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("processors")}
        >
          Processors
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "memory" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("memory")}
        >
          Memory
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "storage" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("storage")}
        >
          Storage
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "network" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("network")}
        >
          Network
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "system-info" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("system-info")}
        >
          System Info
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "summary" && (
          <div className={styles.tabContent}>
            <h3 className={styles.sectionTitle}>System Overview</h3>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>System Name</div>
              <div>{server.name}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Model</div>
              <div>{server.model}</div>
            </div>

            {server.generation && (
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Generation</div>
                <div>{server.generation}</div>
              </div>
            )}

            {server.managementController && (
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Management Controller</div>
                <div>{server.managementController}</div>
              </div>
            )}

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Service Tag</div>
              <div>{server.identifier}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>System Status</div>
              <div className={styles.statusContainer}>
                <span
                  className={styles.statusDot}
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
                {server.status === "normal" ? "OK" : server.status.charAt(0).toUpperCase() + server.status.slice(1)}
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Managed State</div>
              <div>{server.managedState}</div>
            </div>
          </div>
        )}

        {/* Other tab contents would be implemented similarly */}
        {activeTab !== "summary" && (
          <div className={styles.tabContent}>
            <p>
              This tab is not implemented in this demo. In a real implementation, it would show {activeTab} details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      padding: 16px;
      height: 100%;
    `,
    header: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    `,
    breadcrumbs: css`
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    `,
    breadcrumbLink: css`
      display: flex;
      align-items: center;
      gap: 4px;
      color: ${theme.colors.primary.text};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    `,
    breadcrumbSeparator: css`
      color: ${theme.colors.text.secondary};
    `,
    title: css`
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    `,
    content: css`
      background-color: ${theme.colors.background.primary};
      border-radius: 4px;
      box-shadow: ${theme.shadows.z1};
      flex: 1;
    `,
    tabContent: css`
      padding: 16px;
    `,
    sectionTitle: css`
      margin-top: 0;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    detailRow: css`
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    detailLabel: css`
      width: 200px;
      color: ${theme.colors.text.secondary};
      font-weight: 500;
    `,
    statusContainer: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    statusDot: css`
      width: 10px;
      height: 10px;
      border-radius: 50%;
    `,
    errorContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;
    `,
  }
}
