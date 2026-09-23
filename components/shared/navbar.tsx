"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  // Mock user state - replace with actual auth
  const getCurrentUser = (): { name: string } | null => null
  const user = getCurrentUser()
  const userRole: "tenant" | "landlord" | "admin" | null = null

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Properties" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const tenantLinks = [
    { href: "/tenant/dashboard", label: "Dashboard" },
    { href: "/tenant/requests", label: "Rental Requests" },
    { href: "/tenant/payments", label: "Payments" },
  ]

  const landlordLinks = [
    { href: "/landlord/dashboard", label: "Dashboard" },
    { href: "/landlord/properties", label: "Properties" },
    { href: "/landlord/requests", label: "Requests" },
  ]

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/moderation", label: "Moderation" },
  ]

  const getNavLinks = () => {
    if (!user) return publicLinks
    if (userRole === "tenant") return tenantLinks
    if (userRole === "landlord") return landlordLinks
    if (userRole === "admin") return adminLinks
    return publicLinks
  }

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              R
            </div>
            <span className="hidden font-bold text-foreground sm:inline">
              rentNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* User menu - desktop */}
                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      // Handle logout
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Auth buttons - desktop */}
                <div className="hidden gap-2 md:flex">
                  <Link
                    href="/login"
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setIsOpen(false)
                        // Handle logout
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
