"use client"

import * as React from "react"
import { X } from "lucide-react"
import styles from "./dialog.module.css"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
