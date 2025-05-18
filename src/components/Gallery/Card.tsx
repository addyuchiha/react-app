import { useState } from "react";
import { Edit, Upload } from "lucide-react";
import formatUnixTimestamp from "../../scripts/utils/formatUnixTimestamp";

interface Props {
    title: string,
    description: string
    createdAt: number,
    count: number
    thumbnailUrl: string
}

function Card({title, description, createdAt, thumbnailUrl, count}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="rounded-xl bg-white overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 h-max cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Effects */}
      <div className="h-52 relative overflow-hidden flex bg-black/10">
        <img 
          className={`${thumbnailUrl ? "h-full w-full" : "h-20 m-auto"} object-cover transition-transform duration-700 ease-in-out hover:scale-105`} 
          src={thumbnailUrl ?? "/placeholder.png"}
          alt={title}
        />
        
        {/* Overlay that appears on hover */}
        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-3">
            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
              <Upload size={18} className="text-gray-800" />
            </button>
            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
              <Edit size={18} className="text-gray-800" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 gap-1">
          <span>Created at: {formatUnixTimestamp(createdAt)}</span>
        </div>
        
        <div className="flex items-center justify-between pt-1 space-x-2">
          <span className="text-sm font-medium text-gray-700 w-full overflow-hidden text-ellipsis text-nowrap">{description}</span>
          <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-full text-nowrap">{count} photos</span>
        </div>
      </div>
    </div>
  );
}

export default Card;