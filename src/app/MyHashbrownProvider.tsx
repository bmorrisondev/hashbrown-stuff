'use client'

import { HashbrownProvider } from "@hashbrownai/react"

export default function MyHashbrownProvider({ children }: { children: React.ReactNode }) {
  return (
    <HashbrownProvider url="/api/chat">
      {children}
    </HashbrownProvider>
  )
}
