import { getMovieById, getTrailersForMovie } from "@/lib/movies"
import { SiteHeader } from "@/components/site-header"
import { TrailerPlayer } from "@/components/trailer-player"
import { notFound } from "next/navigation"
import Image from "next/image"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieById(params.id)

  if (!movie) {
    notFound()
  }

  const trailers = await getTrailersForMovie(movie.id)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Movie Hero */}
        <div className="w-full bg-muted">
          <div className="container py-12">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                {movie.poster_url ? (
                  <Image
                    src={movie.poster_url || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No Poster</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold">{movie.title}</h1>

                {/* Watch Movie Button */}
                {movie.movie_file_url && (
                  <a
                    href={movie.movie_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4"
                  >
                    <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">
                      Watch Movie
                    </button>
                  </a>
                )}

                <div className="flex items-center mt-2 text-muted-foreground">
                  <span>{movie.release_year}</span>
                  {movie.genre && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{movie.genre}</span>
                    </>
                  )}
                  {movie.director && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Director: {movie.director}</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground">{movie.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trailers Section */}
        <div className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Trailers</h2>

          {trailers.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">No trailers available for this movie.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {trailers.map((trailer) => (
                <div key={trailer.id}>
                  <h3 className="font-medium mb-2">{trailer.title || "Trailer"}</h3>
                  <TrailerPlayer trailer={trailer} />
                </div>
              ))}
            </div>
          )}
        </div>
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
