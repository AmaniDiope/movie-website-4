import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    // Get the token from the cookies
    const adminId = request.cookies.get("admin_id")?.value

    // Redirect to login if no admin ID is found
    if (!adminId) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Check if trying to access login page while already logged in
  if (path === "/admin/login") {
    const adminId = request.cookies.get("admin_id")?.value

    if (adminId) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  // Add CORS headers for API routes
  if (path.startsWith("/api/")) {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
