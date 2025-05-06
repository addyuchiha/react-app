import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Album,
  Star,
} from "lucide-react";

import Profile from "../Profile";
import StorageQuota from "../StorageQuota";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
      setTimeout(() => setTextVisible(true), 150);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setTextVisible(false);
      setTimeout(() => setIsExpanded(false), 150);
    }
  };

  const togglePin = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);

    if (!newPinnedState) {
      setTextVisible(false);
      setTimeout(() => setIsExpanded(false), 150);
    } else {
      setIsExpanded(true);
      setTimeout(() => setTextVisible(true), 100);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Gallery", icon: <Album size={20} /> },
    { name: "Favourites", icon: <Star size={20} /> },
  ];

  return (
    <header className="flex h-screen w-min">
      <div
        className={`transition-all duration-300 ease-in-out bg-primary text-white flex flex-col flex-grow p-6 m-4 rounded-xl shadow-lg ${
          isExpanded ? "w-64 items-start" : "w-20 items-center"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex justify-between items-center w-full mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
              <img
                src="/vite.svg"
                alt="Logo"
                className={`h-8 w-8 rounded transition-all duration-300 ${
                  !isExpanded ? "scale-110" : ""
                }`}
              />
            </div>
            <h2
              className={`ml-3 font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              Sidebar
            </h2>
          </div>
          <button
            onClick={togglePin}
            className={`p-2 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out ${
              isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {isPinned ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="w-full">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
                  !isExpanded ? "justify-start" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center transition-all duration-300 ${
                    !isExpanded ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                  }`}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto w-full">
          <StorageQuota isExpanded={isExpanded} />
          <div className="border-t border-gray-700 my-4"></div>
          <Profile isExpanded={isExpanded} />
        </div>
      </div>
    </header>
  );
}

export default Sidebar;
