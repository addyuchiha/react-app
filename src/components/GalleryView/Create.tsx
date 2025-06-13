import { useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface ValidationErrors {
  [key: string]: string;
}

interface Props {
  galleryGuid: string;
  setState: (state: boolean) => void;
  onSuccess?: () => void;
  onCreated: () => void;
}

interface ApiResponse {
  message?: string;
  [key: string]: any;
}

type SectionFormData = {
  name: string;
};

function CreateSection({ galleryGuid, setState, onSuccess, onCreated }: Props) {
  const [formData, setFormData] = useState<SectionFormData>({
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [successState, setSuccessState] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Section name is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAuthToken(navigate);
      const response = await fetch(
        `${API_BASE}/api/gallery/${galleryGuid}/section`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create section");
      }

      setSuccessState(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
        onCreated?.();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    setState(false);
  };

  // Handler to close popup when clicking outside
  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  // Prevent popup from closing when interacting with form
  const handleFormClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 w-full min-h-full bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-bgLight rounded-lg max-h-[90%] w-full max-w-md overflow-auto animate-fadeIn"
        onClick={handleFormClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Section
            </h2>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="name"
              >
                Section Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  validationErrors.name
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors`}
                placeholder="Enter section name"
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end mt-8 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 mr-3 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || Object.keys(validationErrors).length > 0}
                className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center justify-center min-w-[120px] ${
                  successState
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50"
                } ${
                  (isLoading || Object.keys(validationErrors).length > 0) &&
                  !successState
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
                    Creating...
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Created!
                  </span>
                ) : (
                  "Create Section"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateSection;
