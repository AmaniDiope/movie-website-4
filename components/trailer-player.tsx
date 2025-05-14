"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import type { Trailer } from "@/lib/movies"

interface TrailerPlayerProps {
  trailer: Trailer
}

export function TrailerPlayer({ trailer }: TrailerPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("")

  useEffect(() => {
    // Convert various video URLs to embed URLs
    if (trailer.video_url.includes("youtube.com") || trailer.video_url.includes("youtu.be")) {
      // Extract YouTube video ID
      const videoId = trailer.video_url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
      )?.[1]

      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`)
      }
    } else if (trailer.video_url.includes("vimeo.com")) {
      // Extract Vimeo video ID
      const videoId = trailer.video_url.match(
        /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)/,
      )?.[1]

      if (videoId) {
        setEmbedUrl(`https://player.vimeo.com/video/${videoId}`)
      }
    } else {
      // Assume it's a direct video URL
      setEmbedUrl(trailer.video_url)
    }
  }, [trailer.video_url])

  if (!embedUrl) {
    return <div>Loading trailer...</div>
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        {embedUrl.endsWith(".mp4") ? (
          <video src={embedUrl} controls className="absolute inset-0 w-full h-full" />
        ) : (
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </Card>
  )
}
