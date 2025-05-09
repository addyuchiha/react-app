import { User } from "lucide-react";
import { useState } from "react";
import useUserState from "../../scripts/auth/useState";
import ProfileMenu from "./ProfileMenu";

interface Props {
  isExpanded: boolean;
  togglePin: () => void;
}

const Profile = ({ isExpanded, togglePin }: Props) => {
  const user = useUserState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (state: boolean) => {
    setIsMenuOpen(state)
    togglePin()
  }

  return (
    <>
      <button
        onClick={() => toggleMenu(true)}
        className={`flex items-center rounded hover:bg-gray-700 transition-all cursor-pointer w-full ${
          isExpanded ? "p-2" : "p-0"
        }`}
      >
        <div className="min-w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User size={16} />
        </div>
        <div
          className={`ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden ${
            isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          }`}
        >
          <div className="font-medium text-ellipsis overflow-hidden whitespace-nowrap text-start">
            {`${user.firstName} ${user.lastName}`}
          </div>
          <div className="text-xs text-gray-300 text-ellipsis overflow-hidden whitespace-nowrap text-start">
            {user.email}
          </div>
        </div>
      </button>
      {isMenuOpen && <ProfileMenu onClose={() => toggleMenu(false)} />}
    </>
  );
};

export default Profile;
