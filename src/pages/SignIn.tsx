import { useState } from "react";
import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function SignIn() {
  const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            const newErrors = { email: "", password: "" };
            newErrors.email = "Invalid email or password";
            newErrors.password = "Invalid email or password";
            setErrors(newErrors);
            throw new Error('Invalid credentials');
          }
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          return response.json();
        })
        .then((data) => {
          if (!data.token || !data.refresh_token) {
            throw new Error('Invalid response format');
          }

          // Set cookies
          if (rememberMe) {
            console.log(rememberMe)
            setCookie("accessToken", data.token, {
              path: "/",
              secure: true,
              sameSite: "strict",
              expires: new Date(Date.now() + 3600 * 1000), // 1 hour from now
            });
            setCookie('refreshToken', data.refresh_token, {
              path: '/',
              secure: true,
              sameSite: 'strict',
              expires: new Date(Date.now() + 30 * 24 * 3600 * 1000) // 30 days from now
            });
          } else {
            setCookie("accessToken", data.token, {
              path: "/",
              secure: true,
              sameSite: "strict",
            });
            setCookie('refreshToken', data.refresh_token, {
              path: '/',
              secure: true,
              sameSite: 'strict',
            });
          }
          
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error('Error:', error);
          if (error.message === 'Invalid credentials') {
            // Already handled above
          } else if (error.message === 'Invalid response format') {
            alert("Server response format error. Please try again later.");
          } else {
            setErrors({
              email: "An error occurred. Please try again.",
              password: "An error occurred. Please try again."
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="bg-bgLight w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="rounded-3xl shadow-lg shadow-accent border-accent border-4 p-8 flex flex-col space-y-6 w-full max-w-md bg-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-400 opacity-20 rounded-full"></div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <LogIn className="text-accent h-8 w-8" />
        </div>

        <p className="text-gray-600 text-sm">
          Welcome back! Please enter your credentials to access your account.
        </p>

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
              >
              Remember me
              </label>
            </div>
            <Link
              to={"/forgot-password"}
              className="text-sm font-medium text-accent hover:text-accent"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={"/sign-up"}
              className="font-medium text-accent hover:text-indigo-600 transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
