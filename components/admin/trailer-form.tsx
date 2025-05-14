"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addTrailer } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrailerFormProps {
  movieId: number
}

export function TrailerForm({ movieId }: TrailerFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Add the movie ID to the form data
    formData.set("movie_id", movieId.toString())

    const result = await addTrailer(formData)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess("Trailer added successfully")

      // Reset the form
      const form = document.getElementById("trailer-form") as HTMLFormElement
      form.reset()

      // Refresh the page data
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Trailer</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="trailer-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" name="title" placeholder="Official Trailer, Teaser, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL</Label>
            <Input id="video_url" name="video_url" placeholder="https://www.youtube.com/watch?v=..." required />
            <p className="text-sm text-muted-foreground">YouTube, Vimeo, or direct MP4 URL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
            <Input id="thumbnail_url" name="thumbnail_url" placeholder="https://example.com/thumbnail.jpg" />
            <p className="text-sm text-muted-foreground">If left empty, a thumbnail will be generated from the video</p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {success && <div className="text-green-500 text-sm">{success}</div>}

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Trailer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
