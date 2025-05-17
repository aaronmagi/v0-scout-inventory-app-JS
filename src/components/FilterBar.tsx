"use client"

import type React from "react"
import { useState } from "react"
import { useStyles2, Input, Select, Button, Modal } from "@grafana/ui"
import { css } from "@emotion/css"
import type { GrafanaTheme2, SelectableValue } from "@grafana/data"
import { InteractiveSearch } from "./InteractiveSearch"

interface FilterBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filterId: string) => void
  selectedFilter: string
}

export function FilterBar({ onSearch, onFilterChange, selectedFilter }: FilterBarProps) {
  const styles = useStyles2(getStyles)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)

  const filterOptions: Array<SelectableValue<string>> = [
    { label: "All Servers", value: "all-servers" },
    { label: "End of Life", value: "end-of-life" },
    { label: "End of Warranty", value: "end-of-warranty" },
    { label: "Manufactured 2022+", value: "manufactured-2022" },
    { label: "Power On", value: "power-on" },
    { label: "Boot Failure", value: "boot-failure" },
    { label: "Firmware Version Check", value: "firmware-version-check" },
    { label: "Password Complexity", value: "password-complexity" },
    { label: "System Lockdown Mode", value: "system-lockdown-mode" },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  const handleFilterChange = (value: SelectableValue<string>) => {
    if (value.value) {
      onFilterChange(value.value)
    }
  }

  const handleAdvancedSearch = (query: string) => {
    onSearch(query)
    setIsAdvancedSearchOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input
          prefix={<i className="fa fa-search" />}
          placeholder="Search for servers by name, IP, model..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <Button variant="secondary" onClick={() => setIsAdvancedSearchOpen(true)} className={styles.advancedButton}>
          Advanced Search
        </Button>
      </div>

      <div className={styles.filterContainer}>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          placeholder="Select a filter"
          className={styles.filterSelect}
        />

        <Button
          variant="secondary"
          href={`/a/tmobile-scout-inventory/filters?id=${selectedFilter}`}
          disabled={selectedFilter === "all-servers"}
        >
          Edit Filter
        </Button>

        <Button variant="primary" href="/a/tmobile-scout-inventory/filters/new">
          New Filter
        </Button>
      </div>

      {isAdvancedSearchOpen && (
        <Modal
          title="Advanced Search"
          isOpen={isAdvancedSearchOpen}
          onDismiss={() => setIsAdvancedSearchOpen(false)}
          className={styles.modal}
        >
          <InteractiveSearch onSearch={handleAdvancedSearch} />
        </Modal>
      )}
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    `,
    searchContainer: css`
      display: flex;
      gap: 8px;
    `,
    searchInput: css`
      flex: 1;
    `,
    advancedButton: css`
      flex-shrink: 0;
    `,
    filterContainer: css`
      display: flex;
      gap: 8px;
      align-items: center;
    `,
    filterSelect: css`
      flex: 1;
    `,
    modal: css`
      width: 800px;
    `,
  }
}
