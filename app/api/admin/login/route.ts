import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // For debugging purposes only
    console.log("Login attempt:", { username, password })

    // Check if this is our specific admin user
    if (username === "admin" && password === "password123") {
      // Get the admin user from the database
      try {
        const users = await executeQuery("SELECT id, username, is_super_admin FROM admin_users WHERE username = $1", [
          username,
        ])

        if (users.length > 0) {
          const user = users[0]

          // Set the admin cookie
          cookies().set("admin_id", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
          })

          return NextResponse.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              is_super_admin: user.is_super_admin,
            },
          })
        }
      } catch (error) {
        console.error("Database error during login:", error)

        // Even if the database query fails, we'll still log the user in
        // This is a fallback to ensure admins can still access the system
        cookies().set("admin_id", "2", {
          // Use the known ID from our database
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })

        return NextResponse.json({
          success: true,
          user: {
            id: 2,
            username: "admin",
            is_super_admin: true,
          },
          warning: "Logged in with fallback method due to database connection issues",
        })
      }
    }

    // If we get here, authentication failed
    return NextResponse.json(
      {
        success: false,
        error: "Invalid username or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}
