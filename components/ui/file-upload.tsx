"use client"

import * as React from "react"
import { UploadCloud, X, AlertCircle, CheckCircle2, Pause, Play } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatBytes, validateFileSize, validateFileType } from "@/lib/upload"

interface FileUploadProps {
  id: string
  name: string
  accept?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
  label?: string
  description?: string
  onChange?: (file: File | null) => void
  onUploadComplete?: (url: string) => void
  uploadEndpoint: string
}

export function FileUpload({
  id,
  name,
  accept,
  maxSize = 3 * 1024 * 1024 * 1024, // 3GB default
  allowedTypes = [],
  label,
  description,
  onChange,
  onUploadComplete,
  uploadEndpoint,
}: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [uploadComplete, setUploadComplete] = React.useState(false)
  const [uploadUrl, setUploadUrl] = React.useState<string | null>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setError(null)
    setUploadComplete(false)
    setProgress(0)

    if (!selectedFile) {
      setFile(null)
      if (onChange) onChange(null)
      return
    }

    // Validate file size
    if (maxSize && !validateFileSize(selectedFile, maxSize)) {
      setError(`File size exceeds the maximum allowed size (${formatBytes(maxSize)})`)
      setFile(null)
      if (onChange) onChange(null)
      return
    }

    // Validate file type if allowedTypes is provided
    if (allowedTypes.length > 0 && !validateFileType(selectedFile, allowedTypes)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`)
      setFile(null)
      if (onChange) onChange(null)
      return
    }

    setFile(selectedFile)
    if (onChange) onChange(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    setUploading(false)
    setProgress(0)
    setUploadComplete(false)
    setUploadUrl(null)
    setIsPaused(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onChange) onChange(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Use a simpler approach with direct fetch for reliability
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      })

      // Check if the response is OK
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Upload failed with status ${response.status}`

        try {
          // Check if response is JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, it might be HTML or text
            const textResponse = await response.text()
            if (textResponse.includes("<!DOCTYPE")) {
              errorMessage = "Server returned an HTML error page. Please check server logs."
            } else if (textResponse.length < 100) {
              errorMessage = textResponse
            }
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError)
        }

        throw new Error(errorMessage)
      }

      // Parse the JSON response
      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        throw new Error("Invalid response format from server")
      }

      // Check if the response contains a URL
      if (!responseData.url) {
        throw new Error("No URL returned from server")
      }

      // Update state with the URL
      setUploadComplete(true)
      setUploadUrl(responseData.url)
      if (onUploadComplete) onUploadComplete(responseData.url)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  // Simulate upload progress
  React.useEffect(() => {
    if (uploading && !uploadComplete && !error && !isPaused) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Slow down progress as it gets closer to 100%
          const increment = prevProgress < 30 ? 5 : prevProgress < 60 ? 3 : prevProgress < 90 ? 1 : 0.5
          const newProgress = Math.min(prevProgress + increment, 99)
          return newProgress
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [uploading, uploadComplete, error, isPaused])

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}

      <div className="border rounded-md p-4">
        {!file ? (
          // Upload area when no file is selected
          <div
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            <p className="text-xs text-muted-foreground mt-1">Max size: {formatBytes(maxSize)}</p>
            <input
              ref={fileInputRef}
              id={id}
              name={name}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          // File info and upload controls when a file is selected
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded">
                  <UploadCloud className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile} disabled={uploading && !isPaused}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress bar */}
            {(uploading || progress > 0) && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {formatBytes(Math.round((file.size * progress) / 100))} of {formatBytes(file.size)}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Success message */}
            {uploadComplete && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload complete</span>
              </div>
            )}

            {/* Upload controls */}
            <div className="flex space-x-2">
              {uploading ? (
                <Button onClick={() => setIsPaused(!isPaused)} variant="outline" className="flex-1">
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleUpload} disabled={!file || uploadComplete} className="w-full">
                  {uploadComplete ? "Uploaded" : "Upload"}
                </Button>
              )}
              {uploading && (
                <Button onClick={handleRemoveFile} variant="destructive" className="flex-1">
                  Cancel
                </Button>
              )}
            </div>

            {/* Hidden input to store the URL */}
            <input type="hidden" name={`${name}_url`} value={uploadUrl || ""} />
          </div>
        )}
      </div>
    </div>
  )
}
