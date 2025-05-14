"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { removeMovie } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Video } from "lucide-react"
import type { Movie } from "@/lib/movies"

interface MovieListProps {
  movies: Movie[]
}

export function MovieList({ movies }: MovieListProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const router = useRouter()

  if (!movies.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No movies found</h3>
        <p className="text-muted-foreground mt-2">Add your first movie to get started</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/movies/add">Add Movie</Link>
        </Button>
      </div>
    )
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this movie? This will also delete all associated trailers.")) {
      return
    }

    setLoading(id)

    const result = await removeMovie(id)

    setLoading(null)

    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to delete movie")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <Card key={movie.id} className="overflow-hidden">
          <div className="relative aspect-[2/3] bg-muted">
            {movie.poster_url ? (
              <Image src={movie.poster_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Poster</span>
              </div>
            )}
          </div>
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{movie.release_year}</span>
              {movie.genre && (
                <>
                  <span className="mx-1">•</span>
                  <span>{movie.genre}</span>
                </>
              )}
            </div>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/movies/edit/${movie.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/movies/trailers/${movie.id}`}>
                <Video className="h-4 w-4 mr-1" />
                Trailers
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(movie.id)}
              disabled={loading === movie.id}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {loading === movie.id ? "..." : "Delete"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
