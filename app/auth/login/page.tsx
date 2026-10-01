import React from "react"
import { LoginPageComponent } from "./_components/LoginPageComponent"


export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <LoginPageComponent />
    </div>
  )
}
