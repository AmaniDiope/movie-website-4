import { executeQuery } from "./db"

export type Movie = {
  id: number
  title: string
  description: string
  release_year: number
  genre: string
  director: string
  poster_url: string
  created_at: string
  updated_at: string
  movie_file_url?: string | null
}

export type Trailer = {
  id: number
  movie_id: number
  title: string
  video_url: string
  thumbnail_url: string
  created_at: string
}

// Get all movies with error handling
export async function getAllMovies() {
  try {
    return await executeQuery("SELECT * FROM movies ORDER BY created_at DESC")
  } catch (error) {
    console.error("Error fetching movies:", error)
    // Return empty array instead of throwing to prevent page crashes
    return []
  }
}

// Get movie by ID with error handling
export async function getMovieById(id: string | number) {
  try {
    const movies = await executeQuery("SELECT * FROM movies WHERE id = $1", [id])
    return movies[0] || null
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error)
    return null
  }
}

// Create a new movie
export async function createMovie(movieData: Omit<Movie, "id" | "created_at" | "updated_at">) {
  try {
    const { title, description, release_year, genre, director, poster_url, movie_file_url } = movieData

    const result = await executeQuery(
      `INSERT INTO movies 
       (title, description, release_year, genre, director, poster_url, movie_file_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, release_year, genre, director, poster_url, movie_file_url],
    )

    return result[0]
  } catch (error) {
    console.error("Error creating movie:", error)
    throw error
  }
}

// Update a movie
export async function updateMovie(id: number, movieData: Partial<Omit<Movie, "id" | "created_at" | "updated_at">>) {
  try {
    const fields = Object.keys(movieData)

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
    const values = Object.values(movieData)

    const query = `
      UPDATE movies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${values.length + 1} 
      RETURNING *
    `

    const result = await executeQuery(query, [...values, id])

    return result[0]
  } catch (error) {
    console.error(`Error updating movie ${id}:`, error)
    throw error
  }
}

// Delete a movie
export async function deleteMovie(id: number) {
  try {
    const result = await executeQuery("DELETE FROM movies WHERE id = $1 RETURNING id", [id])
    return result[0] || null
  } catch (error) {
    console.error(`Error deleting movie ${id}:`, error)
    throw error
  }
}

// Get trailers for a movie
export async function getTrailersForMovie(movieId: number) {
  try {
    return await executeQuery("SELECT * FROM trailers WHERE movie_id = $1 ORDER BY created_at DESC", [movieId])
  } catch (error) {
    console.error(`Error fetching trailers for movie ${movieId}:`, error)
    return []
  }
}

// Create a new trailer
export async function createTrailer(trailerData: Omit<Trailer, "id" | "created_at">) {
  try {
    const { movie_id, title, video_url, thumbnail_url } = trailerData

    const result = await executeQuery(
      `INSERT INTO trailers 
       (movie_id, title, video_url, thumbnail_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [movie_id, title, video_url, thumbnail_url],
    )

    return result[0]
  } catch (error) {
    console.error("Error creating trailer:", error)
    throw error
  }
}

// Delete a trailer
export async function deleteTrailer(id: number) {
  try {
    const result = await executeQuery("DELETE FROM trailers WHERE id = $1 RETURNING id", [id])
    return result[0] || null
  } catch (error) {
    console.error(`Error deleting trailer ${id}:`, error)
    throw error
  }
}
