import Link from "next/link"
import { getAllMovies } from "@/lib/movies"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function GenresPage() {
  const movies = await getAllMovies()

  // Extract unique genres and count movies in each
  const genreCounts: Record<string, number> = {}

  movies.forEach((movie) => {
    if (movie.genre) {
      // Handle multiple genres separated by commas
      const genres = movie.genre.split(/,\s*/)

      genres.forEach((genre) => {
        const trimmedGenre = genre.trim()
        if (trimmedGenre) {
          genreCounts[trimmedGenre] = (genreCounts[trimmedGenre] || 0) + 1
        }
      })
    }
  })

  // Sort genres by count (descending)
  const sortedGenres = Object.entries(genreCounts).sort(([, countA], [, countB]) => countB - countA)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">Movie Genres</h1>

        {sortedGenres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No genres found. Add movies with genres to see them here!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedGenres.map(([genre, count]) => (
              <Link key={genre} href={`/movies?genre=${encodeURIComponent(genre)}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{genre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {count} movie{count !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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
