import Cookies from "js-cookie";
import useState from "../../scripts/auth/useState";
import { LogOut, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Details() {
  const user = useState();
  const navigate = useNavigate();

  const signOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/sign-in");
  };

  return (
    <div className="bg-primary p-8 rounded-xl flex flex-grow flex-col">
      <div className="flex h-min text-white space-x-4">
        <div className="rounded-full bg-accent flex items-center justify-center p-3">
          <User2 size={24} />
        </div>
        <div>
          <span className=" font-bold text-lg text-nowrap block">
            {user.firstName} {user.lastName}
          </span>
          <span className="font-thin">{user.email}</span>
        </div>
      </div>
      <div className="h-[1px] bg-accent/20 my-8" />
      <button
        onClick={signOut}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex justify-center items-center gap-2 mt-auto"
      >
        <LogOut size={18} />
        SignOut
      </button>
    </div>
  );
}
