"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminLogout } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Film, Home, LogOut, Plus } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center font-semibold text-lg">
          <Film className="mr-2 h-6 w-6" />
          <span>Movie Admin</span>
        </div>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/admin/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/admin/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </div>
          </Link>
          <Link
            href="/admin/movies/add"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/admin/movies/add") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </div>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <div className="flex items-center">
              <Film className="mr-2 h-4 w-4" />
              View Site
            </div>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <form action={adminLogout}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
