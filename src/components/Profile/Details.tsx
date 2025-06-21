import Cookies from "js-cookie";
import useUserState from "../../scripts/auth/useState";
import { LogOut, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubscriptionDetails from "./SubscriptionDetails";
import ChangePassword from "./ChangePassword";
import { useState } from "react";

export default function Details() {
  const user = useUserState();
  const navigate = useNavigate();

  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  const signOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/sign-in");
  };

  const forgetPassword = () => {
    setShowChangePasswordDialog(true);
  };

  return (
    <div className="bg-primary p-4 rounded-xl flex flex-grow flex-col relative">
      <div className="flex items-center h-min text-white space-x-4">
        <div className="rounded-full bg-accent flex items-center justify-center p-3 w-12 h-12">
          <User2 size={24} />
        </div>
        <div>
          <span className="font-bold text-lg text-nowrap block">
            {user.firstName} {user.lastName}
          </span>
          <span className="font-thin">{user.email}</span>
        </div>
      </div>

      <SubscriptionDetails />

      <button
        onClick={forgetPassword}
        className="text-white hover:text-accent px-4 py-1 rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2"
      >
        Reset Password
      </button>

      <button
        onClick={signOut}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-2 rounded-lg transition-colors font-medium flex justify-center items-center gap-2"
      >
        <LogOut size={18} />
        SignOut
      </button>

      {showChangePasswordDialog && (
        <ChangePassword setState={setShowChangePasswordDialog} />
      )}
    </div>
  );
}
