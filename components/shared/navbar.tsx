"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMe } from "@/services/getMe"
import { logout } from "@/services/logout"
import { toast } from "sonner"

export type IUserData = {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  phone?: string
  role: "TENANT" | "LANDLORD" | "ADMIN" | "tenant" | "landlord" | "admin"
  activeStatus?: "ACTIVE" | "INACTIVE"
  createdAt?: string
  updatedAt?: string
}

export type IMeResponse = {
  success: boolean
  message: string
  data?: IUserData
}

type NavbarProps = {
  user?: IUserData | IMeResponse | null
}

export function Navbar({ user: initialUser }: NavbarProps = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const extractUserData = (
    val: IUserData | IMeResponse | null | undefined
  ): IUserData | null => {
    if (!val) return null
    if ("data" in val && val.data) return val.data
    if ("name" in val && "role" in val) return val as IUserData
    return null
  }

  const [user, setUser] = useState<IUserData | null>(() =>
    extractUserData(initialUser)
  )

  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(extractUserData(initialUser))
      return
    }

    let isMounted = true
    const fetchUser = async () => {
      try {
        const res = await getMe()
        if (isMounted) {
          if (res?.success && res?.data) {
            setUser(res.data)
          } else {
            setUser(null)
          }
        }
      } catch {
        if (isMounted) setUser(null)
      }
    }

    fetchUser()
    return () => {
      isMounted = false
    }
  }, [initialUser])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      toast.success("user logged out successfully!")
      router.push("/auth/login")
    } catch {
      router.push("/auth/login")
    }
  }

  const getDashboardHref = () => {
    const role = user?.role?.toUpperCase()
    if (role === "TENANT") return "/dashboard/tenant"
    if (role === "LANDLORD") return "/dashboard/landlord"
    if (role === "ADMIN") return "/dashboard/admin"
    return "/dashboard/tenant"
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Browse Properties" },
    { href: getDashboardHref(), label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const getRoleBadgeStyle = (role?: string) => {
    const r = role?.toUpperCase()
    if (r === "LANDLORD") {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    }
    if (r === "ADMIN") {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    }
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  }

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/85 shadow-xs backdrop-blur-md transition-all duration-200 supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 select-none"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-base font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              rent<span className="font-extrabold text-primary">Nest</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-accent/80 font-semibold text-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 py-1 pr-3 pl-1.5 shadow-2xs transition-all duration-200 hover:border-border hover:bg-accent/60 hover:shadow-xs focus:outline-none">
                    <Avatar className="size-8 ring-2 ring-primary/20 transition-transform duration-200 group-hover:scale-105">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {user.name?.slice(0, 2).toUpperCase() || "RN"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col pr-1 text-left">
                      <span className="max-w-[130px] truncate text-xs leading-tight font-semibold text-foreground">
                        {user.name}
                      </span>
                      <span
                        className={`mt-0.5 inline-block w-fit rounded-full border px-1.5 py-[1px] text-[10px] leading-none font-semibold capitalize ${getRoleBadgeStyle(user.role)}`}
                      >
                        {user.role?.toLowerCase()}
                      </span>
                    </div>

                    <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-56 rounded-xl border border-border/80 bg-popover/95 p-1.5 shadow-lg backdrop-blur-md"
                  >
                    <div className="px-2.5 py-2">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <User className="size-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/auth/login"
                  className="inline-flex h-8.5 items-center justify-center rounded-lg border border-border/80 bg-background/80 px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:border-border hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-8.5 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-xl p-2 text-foreground transition-colors hover:bg-accent focus:outline-none md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="animate-in border-t border-border/80 bg-background/95 px-2 pt-3 pb-4 backdrop-blur-md duration-150 fade-in slide-in-from-top-2 md:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div className="mt-3 border-t border-border/80 pt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/60 p-2.5 shadow-2xs">
                      <Avatar className="size-10 ring-2 ring-primary/20">
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                          {user.name?.slice(0, 2).toUpperCase() || "RN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-foreground">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                        <span
                          className={`mt-1 inline-block w-fit rounded-full border px-1.5 py-[1px] text-[10px] leading-none font-semibold capitalize ${getRoleBadgeStyle(user.role)}`}
                        >
                          {user.role?.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <User className="size-4 text-muted-foreground" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          handleLogout()
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-border/80 bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs shadow-primary/20 transition-colors hover:bg-primary/90"
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
