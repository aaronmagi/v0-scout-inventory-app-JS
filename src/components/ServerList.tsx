import { useStyles2, Table, Pagination } from "@grafana/ui"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"
import type { Server } from "../types"

interface ServerListProps {
  servers: Server[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ServerList({ servers, currentPage, totalPages, onPageChange }: ServerListProps) {
  const styles = useStyles2(getStyles)

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
          <div className={styles.statusIndicator}>
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
          </div>
        )
      case "name":
        return (
          <a href={`/a/tmobile-scout-inventory/server-details?id=${server.id}`} className={styles.serverLink}>
            {server.name}
          </a>
        )
      case "actions":
        return (
          <div className={styles.actions}>
            <button className={styles.actionButton}>...</button>
          </div>
        )
      default:
        return server[column.id as keyof Server]
    }
  }

  return (
    <div className={styles.container}>
      <Table data={servers} columns={columns} renderCell={renderCell} className={styles.table} />

      <div className={styles.pagination}>
        <Pagination currentPage={currentPage} numberOfPages={totalPages} onNavigate={onPageChange} />
        <div className={styles.pageInfo}>
          Showing {servers.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, servers.length)} of{" "}
          {servers.length} servers
        </div>
      </div>
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      flex: 1;
    `,
    table: css`
      margin-bottom: 16px;
    `,
    statusIndicator: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    statusDot: css`
      width: 10px;
      height: 10px;
      border-radius: 50%;
    `,
    serverLink: css`
      color: ${theme.colors.primary.text};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    `,
    actions: css`
      display: flex;
      justify-content: center;
    `,
    actionButton: css`
      background: none;
      border: none;
      cursor: pointer;
      color: ${theme.colors.text.secondary};
      &:hover {
        color: ${theme.colors.text.primary};
      }
    `,
    pagination: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    `,
    pageInfo: css`
      color: ${theme.colors.text.secondary};
      font-size: ${theme.typography.size.sm};
    `,
  }
}
