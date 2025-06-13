"use client"

import { useState, useRef, type ChangeEvent, type MouseEvent, type DragEvent } from "react"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"
import getAuthToken from "../../scripts/auth/getAuthToken"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface Props {
  setState: (state: boolean) => void
  galleryId: string
  onSuccess?: () => void
  onUploaded: () => void
}

interface UploadFile {
  file: File
  id: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
  previewUrl?: string
}

interface ApiResponse {
  message?: string
  [key: string]: any
}

function UploadDialog({ setState, galleryId, onSuccess, onUploaded }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [allUploadsSuccessful, setAllUploadsSuccessful] = useState<boolean>(false)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = (file: File): string | null => {
    // Check file size (max 10MB)
    if (file.size > 25 * 1024 * 1024) {
      return "Image size must be less than 25MB"
    }

    // Check file type (images only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      return "Only images are supported (JPEG, PNG, GIF, WebP)"
    }

    return null
  }

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: UploadFile[] = []

    fileArray.forEach((file) => {
      const validationError = validateFile(file)
      if (!validationError) {
        // Check for duplicates
        const isDuplicate = files.some(
          (existingFile) => existingFile.file.name === file.name && existingFile.file.size === file.size,
        )

        if (!isDuplicate) {
          validFiles.push({
            file,
            id: generateId(),
            status: "pending",
            progress: 0,
            previewUrl: createPreviewUrl(file),
          })
        }
      } else {
        // Show error for invalid files
        setError(validationError)
      }
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id)
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl)
      }
      return prev.filter((file) => file.id !== id)
    })
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files)
    }
  }

  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    try {
      const accessToken = await getAuthToken(navigate)
      const formData = new FormData()
      formData.append("file", uploadFile.file)

      // Update file status to uploading
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f)))

      const response = await fetch(`${API_BASE}/api/gallery/${galleryId}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image")
      }

      // Update file status to success
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"

      // Update file status to error
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", progress: 0, error: errorMessage } : f)),
      )

      // Re-throw the error so the calling function knows this upload failed
      throw err
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const pendingFiles = files.filter((f) => f.status === "pending")
      const results: Array<{ id: string; success: boolean }> = []

      // Upload files sequentially and track results
      for (const file of pendingFiles) {
        try {
          await uploadFile(file)
          results.push({ id: file.id, success: true })
        } catch (err) {
          results.push({ id: file.id, success: false })
        }
      }

      // Check if all uploads were successful
      const allSuccessful = results.every((result) => result.success)

      // Update state with final results to ensure UI reflects the correct status
      setFiles((currentFiles) => {
        return currentFiles.map((file) => {
          const result = results.find((r) => r.id === file.id)
          if (result && !result.success && file.status !== "success") {
            return { ...file, status: "error" as const, error: "Upload failed" }
          }
          return file
        })
      })

      if (allSuccessful) {
        setAllUploadsSuccessful(true)
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          }
          handleClose()
          onUploaded()
        }, 1500)
      } else {
        setError("Some images failed to upload. Please try again.")
      }
    } catch (err) {
      setError("Upload process encountered an error. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = (): void => {
    // Clean up preview URLs
    files.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
    })
    setState(false)
  }

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isUploading) {
      handleClose()
    }
  }

  const handleFormClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const pendingFiles = files.filter((f) => f.status === "pending")
  const hasFiles = files.length > 0
  const canUpload = pendingFiles.length > 0 && !isUploading

  return (
    <div
      className="fixed inset-0 w-full min-h-full bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg max-h-[90%] w-full max-w-2xl overflow-auto animate-fadeIn"
        onClick={handleFormClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upload Images</h2>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Image Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop images here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supports JPEG, PNG, GIF, and WebP up to 10MB each</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:brightness-90 transition-colors"
              disabled={isUploading}
            >
              Choose Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            />
          </div>

          {/* Image Preview Grid */}
          {hasFiles && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
                {files.map((uploadFile) => (
                  <div key={uploadFile.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <div className="aspect-square relative bg-gray-100">
                      {uploadFile.previewUrl ? (
                        <img
                          src={uploadFile.previewUrl || "/placeholder.svg"}
                          alt={uploadFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Status Overlay */}
                      {uploadFile.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      )}

                      {uploadFile.status === "success" && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      )}

                      {uploadFile.status === "error" && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                      )}

                      {/* Remove Button */}
                      {uploadFile.status === "pending" && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-2 text-xs truncate">
                      <p className="font-medium text-gray-700 truncate">{uploadFile.file.name}</p>
                      <p className="text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-8 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="px-5 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 mr-3 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center justify-center min-w-[120px] ${
                allUploadsSuccessful
                  ? "bg-green-500 text-white"
                  : canUpload
                    ? "bg-accent text-white hover:brightness-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : allUploadsSuccessful ? (
                <span className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  Uploaded!
                </span>
              ) : (
                `Upload ${pendingFiles.length} ${pendingFiles.length === 1 ? "Image" : "Images"}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadDialog
