import { type NextRequest, NextResponse } from "next/server"
import { generateUniqueFilename } from "@/lib/upload"
import { cookies } from "next/headers"

// Simple upload handler that doesn't rely on file system operations
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const adminId = cookies().get("admin_id")?.value
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename
    const uniqueFilename = generateUniqueFilename(file.name)

    // In a real application, you would upload to a cloud storage service here
    // For this example, we'll simulate a successful upload and return a URL

    // Simulate processing time for large files (shorter for demo purposes)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return a simulated URL
    // In production, this would be the actual URL from your storage service
    const url = `/uploads/movies/${uniqueFilename}`

    return NextResponse.json({
      success: true,
      url,
      filename: uniqueFilename,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll handle the multipart form data manually
    responseLimit: false, // Remove response size limit
  },
}
