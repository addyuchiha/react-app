import { HardDrive } from "lucide-react";

interface Props {
  isExpanded: boolean,
}

const StorageQuota = ({ isExpanded }: Props) => {
  const storageUsed = 75;
  
  return (
    <div className="w-full mb-4">
      <div className="flex items-center mb-2">
        <div className={isExpanded ? "ml-0": "ml-1"}>
          <HardDrive size={20} />
        </div>
        <span
          className={`ml-3 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden block ${
            isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          }`}
        >
          Storage ({storageUsed}%)
        </span>
      </div>
      <div 
        className={`bg-gray-700 rounded-full h-2 overflow-hidden ${
          isExpanded ? "w-full" : "w-8"
        }`}
      >
        <div 
          className="bg-accent h-full rounded-full" 
          style={{ width: `${storageUsed}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StorageQuota