import { User } from "lucide-react";

interface Props {
  isExpanded: boolean
}

const Profile = ({ isExpanded }: Props) => {
  return (
    <div className={`flex items-center rounded hover:bg-gray-700 transition-all cursor-pointer w-full ${isExpanded ? "p-2": "p-0"}`}>
      <div className="min-w-8 h-8 rounded-full bg-accent flex items-center justify-center">
        <User size={16} />
      </div>
      <div
        className={`ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden ${
          isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
        }`}
      >
        <div className="font-medium">John Doe</div>
        <div className="text-xs text-gray-300">john@example.com</div>
      </div>
    </div>
  );
};

export default Profile