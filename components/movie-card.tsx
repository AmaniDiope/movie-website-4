import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Movie } from "@/lib/movies"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative aspect-[2/3] bg-muted">
          {movie.poster_url ? (
            <Image src={movie.poster_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Poster</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span>{movie.release_year}</span>
            {movie.genre && (
              <>
                <span className="mx-1">•</span>
                <span>{movie.genre}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
