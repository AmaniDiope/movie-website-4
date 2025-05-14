import { getMovieById } from "@/lib/movies"
import { MovieForm } from "@/components/admin/movie-form"
import { notFound } from "next/navigation"

interface EditMoviePageProps {
  params: {
    id: string
  }
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const movie = await getMovieById(params.id)

  if (!movie) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Movie</h1>
      <MovieForm movie={movie} isEditing />
    </div>
  )
}
