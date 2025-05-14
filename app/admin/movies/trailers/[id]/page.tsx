import Link from "next/link"
import { getMovieById, getTrailersForMovie } from "@/lib/movies"
import { Button } from "@/components/ui/button"
import { TrailerForm } from "@/components/admin/trailer-form"
import { TrailerList } from "@/components/admin/trailer-list"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface TrailersPageProps {
  params: {
    id: string
  }
}

export default async function TrailersPage({ params }: TrailersPageProps) {
  const movie = await getMovieById(params.id)

  if (!movie) {
    notFound()
  }

  const trailers = await getTrailersForMovie(movie.id)

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Trailers for "{movie.title}"</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Trailer</h2>
          <TrailerForm movieId={movie.id} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Trailers</h2>
          <TrailerList trailers={trailers} />
        </div>
      </div>
    </div>
  )
}
