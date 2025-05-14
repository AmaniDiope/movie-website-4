// Helper functions for file uploads

// Convert bytes to human-readable format
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Generate a unique filename
export function generateUniqueFilename(originalFilename: string) {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = originalFilename.split(".").pop()

  return `${timestamp}-${randomString}.${extension}`
}

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]) {
  return allowedTypes.includes(file.type)
}

// Validate file size
export function validateFileSize(file: File, maxSizeInBytes: number) {
  return file.size <= maxSizeInBytes
}

// Calculate optimal chunk size based on file size
export function calculateChunkSize(fileSize: number): number {
  // For very large files (>1GB), use larger chunks
  if (fileSize > 1024 * 1024 * 1024) {
    return 5 * 1024 * 1024 // 5MB chunks
  }

  // For medium files (>100MB), use medium chunks
  if (fileSize > 100 * 1024 * 1024) {
    return 2 * 1024 * 1024 // 2MB chunks
  }

  // For smaller files, use smaller chunks
  return 1 * 1024 * 1024 // 1MB chunks
}

// Create a simulated URL for development
export function createSimulatedUrl(type: "movie" | "trailer" | "thumbnail", filename: string): string {
  const path = type === "movie" ? "movies" : type === "trailer" ? "trailers" : "thumbnails"

  return `/uploads/${path}/${filename}`
}
