import { useState, type MouseEvent } from "react"
import getAuthToken from "../../../scripts/auth/getAuthToken"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface Props {
  setState: (state: boolean) => void
  galleryGuid: string
  pictureGuid: string
  onSuccess?: () => void
  onDeleted: () => void
}

interface ApiResponse {
  message?: string
  [key: string]: any
}

function Delete({ setState, galleryGuid, pictureGuid, onSuccess, onDeleted }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const accessToken = await getAuthToken(navigate)
      const response = await fetch(`${API_BASE}/api/gallery/${galleryGuid}/remove/${pictureGuid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error("Failed to delete picture.")
      }

      setSuccessState(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
        handleClose()
        onDeleted()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (): void => {
    setState(false)
  }

  // Handler to close popup when clicking outside
  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose()
    }
  }

  // Prevent popup from closing when interacting with content
  const handleContentClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 w-full min-h-full bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-bgLight rounded-lg max-h-[90%] w-full max-w-md overflow-auto animate-fadeIn"
        onClick={handleContentClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Delete Picture</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {error}
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are you sure you want to delete this picture?
              </h3>
              <p className="text-gray-500 text-sm">
                This action cannot be undone. The picture will be permanently removed from your gallery.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center justify-center min-w-[120px] ${
                successState
                  ? "bg-green-500 text-white"
                  : "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500/50"
              } ${
                isLoading && !successState
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
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
                  Deleting...
                </span>
              ) : successState ? (
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Deleted!
                </span>
              ) : (
                "Delete Picture"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delete