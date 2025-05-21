"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PhaseTwoModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
}

export function PhaseTwoModal({ isOpen, onClose, featureName }: PhaseTwoModalProps) {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Coming in Phase 2</DialogTitle>
          <DialogDescription>
            The {featureName} feature will be available in Phase 2 of the Scout Inventory application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray-500">
            We're currently working on implementing this feature. Please check back later for updates.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
