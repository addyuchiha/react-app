import HomePage from "./pages/HomePage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PaymentHistory from "./components/Profile/PaymentDetails";
import SubscriptionDetails from "./components/Profile/SubscriptionDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment/success",
    element: (
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment/cancel",
    element: (
      <ProtectedRoute>
        <Cancel />
      </ProtectedRoute>
    ),
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
