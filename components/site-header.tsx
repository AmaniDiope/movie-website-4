import Link from "next/link"
import { Film } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="font-bold">MovieFlix</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/movies">
            <Button variant="ghost">Movies</Button>
          </Link>
          <Link href="/genres">
            <Button variant="ghost">Genres</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
