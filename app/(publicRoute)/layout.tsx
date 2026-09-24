import { Navbar } from "@/components/shared/navbar"
import React from "react"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar></Navbar>
      {children}
    </div>
  )
}
