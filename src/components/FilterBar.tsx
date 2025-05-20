"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { InteractiveSearch } from "./InteractiveSearch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filterId: string) => void
  selectedFilter: string
}

export function FilterBar({ onSearch, onFilterChange, selectedFilter }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)

  const filterOptions = [
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

  const handleFilterChange = (value: string) => {
    if (value) {
      onFilterChange(value)
    }
  }

  const handleAdvancedSearch = (query: string) => {
    onSearch(query)
    setIsAdvancedSearchOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search for servers by name, IP, model..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearchQuery("")
                onSearch("")
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={() => setIsAdvancedSearchOpen(true)}>
          Advanced Search
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All Servers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-servers">All Servers</SelectItem>
              <SelectGroup>
                <SelectLabel>Basic Filters</SelectLabel>
                <SelectItem value="end-of-life">End of Life</SelectItem>
                <SelectItem value="end-of-warranty">End of Warranty</SelectItem>
                <SelectItem value="manufactured-2022">Manufactured 2022+</SelectItem>
                <SelectItem value="power-on">Power On</SelectItem>
                <SelectItem value="boot-failure">Boot Failure</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Firmware Management Filters</SelectLabel>
                <SelectItem value="firmware-version-check">Firmware Version Check</SelectItem>
                <SelectItem value="firmware-verification-status">Firmware Verification Status</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = `/filters/${selectedFilter}`)}
          disabled={selectedFilter === "all-servers"}
        >
          Edit Filter
        </Button>
        <Button onClick={() => (window.location.href = "/filters/new")}>New Filter</Button>
      </div>

      <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogDescription>Build complex search queries with multiple conditions and operators.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <InteractiveSearch onSearch={handleAdvancedSearch} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
