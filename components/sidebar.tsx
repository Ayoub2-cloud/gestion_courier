"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Mail,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  Package,
  Layers,
} from "lucide-react"
import { useState } from "react"
import { Role } from "@/lib/types"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CHEF, Role.AGENT, Role.AUDITOR],
    },
    {
      label: "Courriers",
      icon: Mail,
      href: "/courriers",
      roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CHEF, Role.AGENT, Role.AUDITOR],
    },
    {
      label: "Créer Courrier",
      icon: Mail,
      href: "/courriers/create",
      roles: [Role.AGENT, Role.CHEF, Role.ADMIN, Role.SUPER_ADMIN],
    },
    {
      label: "Entités",
      icon: Building2,
      href: "/entities",
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    {
      label: "Types",
      icon: Package,
      href: "/referentials/types",
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    {
      label: "Catégories",
      icon: Layers,
      href: "/referentials/categories",
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    {
      label: "États",
      icon: BarChart3,
      href: "/referentials/states",
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    {
      label: "Utilisateurs",
      icon: Users,
      href: "/users",
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
    },
    {
      label: "Paramètres",
      icon: Settings,
      href: "/settings",
      roles: [Role.SUPER_ADMIN],
    },
  ]

  const canViewItem = (roles: Role[]) => {
    return user && roles.includes(user.role as Role)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-primary text-primary-foreground rounded-lg">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="EST SB" className="w-12 h-12 flex-shrink-0" />
              <div>
                <h1 className="font-bold text-sm text-sidebar-foreground">EST SB</h1>
                <p className="text-xs text-sidebar-foreground/70">Courrier</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              if (!canViewItem(item.roles)) return null
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-sidebar-border p-4 space-y-3">
            <div className="px-4 py-3 bg-sidebar-accent rounded-lg">
              <p className="text-xs text-sidebar-accent-foreground/70">Connecté en tant que</p>
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-accent-foreground/70">{user?.role}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
            <p className="text-xs text-sidebar-foreground/50 text-center pt-2 border-t border-sidebar-border">
              © Ayoub Achmaoui
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
