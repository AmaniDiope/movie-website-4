"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addMovie, editMovie } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Movie } from "@/lib/movies"

interface MovieFormProps {
  movie?: Movie
  isEditing?: boolean
}

export function MovieForm({ movie, isEditing = false }: MovieFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [movieUrl, setMovieUrl] = useState<string | null>(null)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [trailerThumbnailUrl, setTrailerThumbnailUrl] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Add the uploaded URLs to the form data if they exist
    if (movieUrl) {
      formData.set("movie_file_url", movieUrl)
    }

    if (trailerUrl) {
      formData.set("trailer_url", trailerUrl)
    }

    if (trailerThumbnailUrl) {
      formData.set("thumbnail_url", trailerThumbnailUrl)
    }

    let result

    try {
      if (isEditing && movie) {
        result = await editMovie(movie.id, formData)
      } else {
        result = await addMovie(formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(isEditing ? "Movie updated successfully" : "Movie added successfully")

        if (!isEditing) {
          // Redirect to the movie edit page if we just created a new movie
          setTimeout(() => {
            router.push(`/admin/movies/edit/${result.movie.id}`)
          }, 1500)
        } else {
          // Refresh the page data
          router.refresh()
        }
      }
    } catch (err) {
      console.error("Form submission error:", err)
      setError("An error occurred while saving the movie. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMovieUploadComplete = (url: string) => {
    setMovieUrl(url)
    setSuccess("Movie file uploaded successfully. You can now save the movie.")
  }

  const handleTrailerUploadComplete = (url: string) => {
    setTrailerUrl(url)
    // In a real implementation, you would extract the thumbnail URL from the response
    // For this example, we'll just modify the URL
    setTrailerThumbnailUrl(url.replace("trailers", "thumbnails").replace(/\.[^/.]+$/, ".jpg"))
    setSuccess("Trailer uploaded successfully. You can now save the movie.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Movie" : "Add New Movie"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Movie Details</TabsTrigger>
            <TabsTrigger value="movie">Upload Movie</TabsTrigger>
            <TabsTrigger value="trailer">Upload Trailer</TabsTrigger>
          </TabsList>

          <form action={handleSubmit} className="space-y-4 mt-6">
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={movie?.title || ""} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={4} defaultValue={movie?.description || ""} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="release_year">Release Year</Label>
                    <Input
                      id="release_year"
                      name="release_year"
                      type="number"
                      defaultValue={movie?.release_year || new Date().getFullYear()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" name="genre" defaultValue={movie?.genre || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="director">Director</Label>
                  <Input id="director" name="director" defaultValue={movie?.director || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poster_url">Poster URL</Label>
                  <Input
                    id="poster_url"
                    name="poster_url"
                    defaultValue={movie?.poster_url || ""}
                    placeholder="https://example.com/poster.jpg"
                  />
                  <p className="text-sm text-muted-foreground">Enter a URL for the movie poster image</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="movie">
              <div className="space-y-4">
                <Alert className="mb-4">
                  <AlertDescription>
                    For this demo, uploads are simulated and no actual files are stored. In a production environment,
                    you would use a storage service like Vercel Blob, AWS S3, or similar.
                  </AlertDescription>
                </Alert>

                <FileUpload
                  id="movie_file"
                  name="movie_file"
                  label="Upload Movie File"
                  description="Upload the full movie file (MP4, MOV, AVI, etc.)"
                  accept="video/*"
                  maxSize={3 * 1024 * 1024 * 1024} // 3GB
                  allowedTypes={["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]}
                  uploadEndpoint="/api/upload/movie"
                  onUploadComplete={handleMovieUploadComplete}
                />

                {movieUrl && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm font-medium">Movie file uploaded successfully</p>
                    <p className="text-xs text-muted-foreground break-all">{movieUrl}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trailer">
              <div className="space-y-4">
                <Alert className="mb-4">
                  <AlertDescription>
                    For this demo, uploads are simulated and no actual files are stored. In a production environment,
                    you would use a storage service like Vercel Blob, AWS S3, or similar.
                  </AlertDescription>
                </Alert>

                <FileUpload
                  id="trailer_file"
                  name="trailer_file"
                  label="Upload Trailer"
                  description="Upload a trailer for the movie (MP4, MOV, etc.)"
                  accept="video/*"
                  maxSize={500 * 1024 * 1024} // 500MB
                  allowedTypes={["video/mp4", "video/quicktime", "video/webm"]}
                  uploadEndpoint="/api/upload/trailer"
                  onUploadComplete={handleTrailerUploadComplete}
                />

                {trailerUrl && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm font-medium">Trailer uploaded successfully</p>
                    <p className="text-xs text-muted-foreground break-all">{trailerUrl}</p>
                    {trailerThumbnailUrl && (
                      <p className="text-xs text-muted-foreground mt-2">Thumbnail generated: {trailerThumbnailUrl}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="trailer_url">Or Enter Trailer URL</Label>
                  <Input id="trailer_url" name="trailer_url" placeholder="https://www.youtube.com/watch?v=..." />
                  <p className="text-sm text-muted-foreground">
                    You can either upload a trailer file or enter a YouTube/Vimeo URL
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Hidden inputs to store the uploaded file URLs */}
            <input type="hidden" name="movie_file_url" value={movieUrl || ""} />
            <input type="hidden" name="trailer_url" value={trailerUrl || ""} />
            <input type="hidden" name="thumbnail_url" value={trailerThumbnailUrl || ""} />

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Movie" : "Add Movie"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
