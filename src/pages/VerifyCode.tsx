import { useState, useRef, KeyboardEvent } from "react";
import { KeyRound } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // Initialize refs array
  inputRefs.current = Array(6).fill(null);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      if (response.ok) {
        const data = await response.json()
        const token = data.token
        navigate(`/reset-password?email=${email}&token=${token}`);
      } else {
        setError("Invalid verification code");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      setError("New code has been sent to your email");
      setCode(["", "", "", "", "", ""]);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to resend code");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bgLight w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="rounded-3xl shadow-lg shadow-accent border-accent border-4 p-8 flex flex-col space-y-6 w-full max-w-md bg-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-400 opacity-20 rounded-full"></div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Verify Code</h2>
          <KeyRound className="text-accent h-8 w-8" />
        </div>

        <p className="text-sm text-gray-600">
          Please enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              <span>Verify Code</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="w-full text-sm text-gray-600 hover:text-accent"
          >
            Didn't receive the code? Click to resend
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;