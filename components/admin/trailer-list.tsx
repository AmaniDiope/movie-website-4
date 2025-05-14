"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { removeTrailer } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Video } from "lucide-react"
import type { Trailer } from "@/lib/movies"

interface TrailerListProps {
  trailers: Trailer[]
}

export function TrailerList({ trailers }: TrailerListProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const router = useRouter()

  if (!trailers.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">No trailers added yet. Add your first trailer above.</div>
    )
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this trailer?")) {
      return
    }

    setLoading(id)

    const result = await removeTrailer(id)

    setLoading(null)

    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to delete trailer")
    }
  }

  // Helper function to get YouTube thumbnail from URL
  function getYouTubeThumbnail(url: string) {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    )?.[1]

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    }

    return "/placeholder.svg?height=120&width=200"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trailers.map((trailer) => (
        <Card key={trailer.id}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={trailer.thumbnail_url || getYouTubeThumbnail(trailer.video_url)}
              alt={trailer.title || "Trailer thumbnail"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Video className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-base">{trailer.title || "Trailer"}</CardTitle>
            <CardDescription className="truncate text-xs">{trailer.video_url}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(trailer.id)}
              disabled={loading === trailer.id}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {loading === trailer.id ? "Deleting..." : "Delete"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
