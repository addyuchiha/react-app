import { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: ""});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: ""};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email
        })
      }).then(response => {
        if (response.ok) {
            navigate(`/verify-code?email=${email}`)
            return
        } else if (response.status == 403) {
            const newErrors = {email: "Account associated with email not found."}
            setErrors(newErrors)
            setIsLoading(false)
            return
        }
      })
    }
  };

  return (
    <div className="bg-bgLight w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="rounded-3xl shadow-lg shadow-accent border-accent border-4 p-8 flex flex-col space-y-6 w-full max-w-md bg-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-400 opacity-20 rounded-full"></div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <KeyRound className="text-accent h-8 w-8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
