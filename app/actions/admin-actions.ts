"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authenticateAdmin } from "@/lib/admin-auth"
import { createMovie, updateMovie, deleteMovie, createTrailer, deleteTrailer } from "@/lib/movies"

// Admin login
export async function adminLogin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return {
      error: "Username and password are required",
    }
  }

  try {
    const admin = await authenticateAdmin(username, password)

    if (!admin) {
      return {
        error: "Invalid username or password",
      }
    }

    cookies().set("admin_id", admin.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      admin,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      error: "Failed to log in",
    }
  }
}

// Admin logout
export async function adminLogout() {
  cookies().delete("admin_id")
  redirect("/admin/login")
}

// Add movie
export async function addMovie(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const releaseYearRaw = formData.get("release_year") as string
    const releaseYear = Number.parseInt(releaseYearRaw)
    if (!releaseYearRaw || isNaN(releaseYear)) {
      return {
        error: "Release year is required and must be a valid number",
      }
    }
    const genre = formData.get("genre") as string
    const director = formData.get("director") as string
    const posterUrl = formData.get("poster_url") as string

    // Get the uploaded movie file URL if it exists
    const movieFileUrl = formData.get("movie_file_url") as string

    // Get the trailer URL (either uploaded or entered)
    const trailerUrl = formData.get("trailer_url") as string
    const thumbnailUrl = formData.get("thumbnail_url") as string

    if (!title) {
      return {
        error: "Title is required",
      }
    }

    // Create the movie
    const movie = await createMovie({
      title,
      description,
      release_year: releaseYear,
      genre,
      director,
      poster_url: posterUrl,
      movie_file_url: movieFileUrl || null, // Add this to your movie schema if needed
    })

    // If a trailer URL was provided, create a trailer for this movie
    if (trailerUrl) {
      await createTrailer({
        movie_id: movie.id,
        title: `${title} - Trailer`,
        video_url: trailerUrl,
        thumbnail_url: thumbnailUrl || "",
      })
    }

    return {
      success: true,
      movie,
    }
  } catch (error) {
    console.error("Error adding movie:", error)
    return {
      error: error instanceof Error ? error.message : String(error) || "Failed to add movie",
    }
  }
}

// Edit movie
export async function editMovie(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const releaseYearStr = formData.get("release_year") as string
    const genre = formData.get("genre") as string
    const director = formData.get("director") as string
    const posterUrl = formData.get("poster_url") as string

    // Get the uploaded movie file URL if it exists
    const movieFileUrl = formData.get("movie_file_url") as string

    // Get the trailer URL (either uploaded or entered)
    const trailerUrl = formData.get("trailer_url") as string
    const thumbnailUrl = formData.get("thumbnail_url") as string

    const updateData: any = {}

    if (title) updateData.title = title
    if (description) updateData.description = description
    if (releaseYearStr) updateData.release_year = Number.parseInt(releaseYearStr)
    if (genre) updateData.genre = genre
    if (director) updateData.director = director
    if (posterUrl) updateData.poster_url = posterUrl
    if (movieFileUrl) updateData.movie_file_url = movieFileUrl

    if (Object.keys(updateData).length === 0) {
      return {
        error: "No fields to update",
      }
    }

    const movie = await updateMovie(id, updateData)

    // If a trailer URL was provided, create a new trailer for this movie
    if (trailerUrl) {
      await createTrailer({
        movie_id: id,
        title: `${movie.title} - Trailer`,
        video_url: trailerUrl,
        thumbnail_url: thumbnailUrl || "",
      })
    }

    return {
      success: true,
      movie,
    }
  } catch (error) {
    console.error(`Error updating movie ${id}:`, error)
    return {
      error: "Failed to update movie",
    }
  }
}

// Delete movie
export async function removeMovie(id: number) {
  try {
    await deleteMovie(id)

    return {
      success: true,
    }
  } catch (error) {
    console.error(`Error deleting movie ${id}:`, error)
    return {
      error: "Failed to delete movie",
    }
  }
}

// Add trailer
export async function addTrailer(formData: FormData) {
  try {
    const movieId = Number.parseInt(formData.get("movie_id") as string)
    const title = formData.get("title") as string
    const videoUrl = formData.get("video_url") as string
    const thumbnailUrl = formData.get("thumbnail_url") as string

    if (!movieId || !videoUrl) {
      return {
        error: "Movie ID and video URL are required",
      }
    }

    const trailer = await createTrailer({
      movie_id: movieId,
      title,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || "",
    })

    return {
      success: true,
      trailer,
    }
  } catch (error) {
    console.error("Error adding trailer:", error)
    return {
      error: "Failed to add trailer",
    }
  }
}

// Delete trailer
export async function removeTrailer(id: number) {
  try {
    await deleteTrailer(id)

    return {
      success: true,
    }
  } catch (error) {
    console.error(`Error deleting trailer ${id}:`, error)
    return {
      error: "Failed to delete trailer",
    }
  }
}
