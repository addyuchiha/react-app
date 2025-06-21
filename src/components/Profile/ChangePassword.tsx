import { useState, FormEvent, MouseEvent } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  setState: (state: boolean) => void;
}

interface Errors {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ChangePassword({ setState }: Props) {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for toggling visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => setState(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!oldPassword.trim()) newErrors.oldPassword = "Old password is required";
    if (!newPassword.trim()) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 6) newErrors.newPassword = "New password must be at least 6 characters";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken(navigate);

      const res = await fetch(`${API_BASE}/api/user/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessState(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else if (data.errors) {
        const newErrors: Errors = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
        data.errors.forEach((err: { field: string; message: string }) => {
          if (err.field in newErrors) newErrors[err.field as keyof Errors] = err.message;
        });
        setErrors(newErrors);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error or unexpected issue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) handleClose();
  };

  const handleFormClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const renderPasswordField = (
    label: string,
    name: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errorMsg: string,
    show: boolean,
    toggleShow: () => void
  ) => (
<div className="relative">
  <label className="block text-gray-700 font-medium mb-2">{label}</label>
  
  <div className="relative flex items-center">
    <input
      type={show ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 pr-10 border ${
        errorMsg ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
      } rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors`}
      placeholder={`Enter ${label.toLowerCase()}`}
      disabled={isLoading}
    />
    <button
      type="button"
      className="absolute right-3 text-gray-400 hover:text-gray-700"
      onClick={toggleShow}
      tabIndex={-1}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {errorMsg && <p className="mt-1 text-sm text-red-600">{errorMsg}</p>}
</div>


  );

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
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {renderPasswordField(
              "Old Password",
              "oldPassword",
              oldPassword,
              (e) => setOldPassword(e.target.value),
              errors.oldPassword,
              showOld,
              () => setShowOld((prev) => !prev)
            )}

            {renderPasswordField(
              "New Password",
              "newPassword",
              newPassword,
              (e) => setNewPassword(e.target.value),
              errors.newPassword,
              showNew,
              () => setShowNew((prev) => !prev)
            )}

            {renderPasswordField(
              "Confirm Password",
              "confirmPassword",
              confirmPassword,
              (e) => setConfirmPassword(e.target.value),
              errors.confirmPassword,
              showConfirm,
              () => setShowConfirm((prev) => !prev)
            )}

            <div className="flex justify-end border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 mr-3 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center justify-center min-w-[120px] ${
                  successState
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50"
                } ${isLoading && !successState ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : successState ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Updated!
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
  