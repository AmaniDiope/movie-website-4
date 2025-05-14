import { getAllMovies } from "@/lib/movies"
import { MovieCard } from "@/components/movie-card"
import { SiteHeader } from "@/components/site-header"

export default async function MoviesPage() {
  const movies = await getAllMovies()

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">All Movies</h1>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
