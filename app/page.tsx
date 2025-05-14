import Link from "next/link"
import { getAllMovies } from "@/lib/movies"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import { SiteHeader } from "@/components/site-header"
import { Film } from "lucide-react"

export default async function HomePage() {
  const movies = await getAllMovies()

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to MovieFlix
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover the latest movies and watch trailers for upcoming releases.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/movies">
                    <Film className="mr-2 h-4 w-4" />
                    Browse Movies
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Movies */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Movies</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Check out our latest additions to the collection.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {movies.slice(0, 8).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {movies.length > 8 && (
              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/movies">View All Movies</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MovieFlix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
