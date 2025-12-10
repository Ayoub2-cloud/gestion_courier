"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Bell, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { user } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src="/logo.png" alt="EST SB" className="h-10 w-10" />
        <h1 className="text-xl font-bold text-foreground">Gestion du Courrier Interne</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
