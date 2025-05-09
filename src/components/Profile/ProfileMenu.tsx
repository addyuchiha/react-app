import { X, User } from "lucide-react";
import useUserState from "../../scripts/auth/useState";
import PaymentHistory from "./PaymentDetails";
import Details from "./Details";
import SubscriptionDetails from "./SubscriptionDetails";

const ProfileMenu = ({ onClose }: { onClose: () => void }) => {
  const user = useUserState();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur flex justify-center items-center">
      <div className="bg-bgLight p-6 text-black rounded-xl">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">Profile Menu</span>
          <X className="cursor-pointer hover:text-gray-600" onClick={onClose} />
        </div>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex mt-4 space-x-4">
            <div className="space-y-4">
                <PaymentHistory />
            </div>
            <Details />
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
