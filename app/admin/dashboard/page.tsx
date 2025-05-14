import Link from "next/link"
import { getAllMovies } from "@/lib/movies"
import { Button } from "@/components/ui/button"
import { MovieList } from "@/components/admin/movie-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { testDatabaseConnection } from "@/lib/db"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminDashboardPage() {
  // Test database connection first
  const connectionTest = await testDatabaseConnection();
  const movies = connectionTest.connected ? await getAllMovies() : [];

  return (
    <div className="min-h-screen w-full">
      <AdminNav />
      <div className="px-6 py-8">
        <p className="text-muted-foreground text-lg mb-8">Manage your movies, trailers, and more.</p>

        {!connectionTest.connected && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>
              There was a problem connecting to the database. Please check your database configuration.<br />
              Error: {connectionTest.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
            <div className="text-3xl font-bold">{movies.length}</div>
            <div className="mt-2 text-lg">Total Movies</div>
          </div>
          <div className="bg-gradient-to-tr from-green-400 to-green-600 rounded-xl p-6 shadow-lg text-white">
            <div className="text-3xl font-bold">{movies.filter(m => m.release_year === new Date().getFullYear()).length}</div>
            <div className="mt-2 text-lg">Movies This Year</div>
          </div>
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
            <div className="text-3xl font-bold">{[...new Set(movies.map(m => m.genre))].filter(Boolean).length}</div>
            <div className="mt-2 text-lg">Genres</div>
          </div>
        </div>

        {/* Movie List Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Movies</h2>
          <MovieList movies={movies} />
        </div>
      </div>
    </div>
  );
}
