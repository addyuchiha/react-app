import { useState, useEffect } from "react";

function CardSkeleton() {
  const [shimmer, setShimmer] = useState(0);
  
  // Create shimmer animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer(prev => (prev >= 100 ? 0 : prev + 1));
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-white overflow-hidden border shadow-sm h-max">
      {/* Image Skeleton */}
      <div className="h-52 relative overflow-hidden flex bg-gray-200">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent" 
          style={{
            transform: `translateX(${-100 + shimmer}%)`,
            transition: "transform 0.1s ease-out"
          }}
        />
      </div>
      
      {/* Content Section Skeleton */}
      <div className="p-4 space-y-4">
        {/* Title Skeleton */}
        <div className="flex justify-between items-start">
          <div className="h-6 bg-gray-200 rounded-md w-3/4 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent" 
              style={{
                transform: `translateX(${-100 + shimmer}%)`,
                transition: "transform 0.1s ease-out"
              }}
            />
          </div>
        </div>
        
        {/* Date Skeleton */}
        <div className="flex items-center gap-1">
          <div className="h-4 bg-gray-200 rounded-md w-1/2 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent" 
              style={{
                transform: `translateX(${-100 + shimmer}%)`,
                transition: "transform 0.1s ease-out"
              }}
            />
          </div>
        </div>
        
        {/* Description and Count Skeleton */}
        <div className="flex items-center justify-between pt-1 space-x-2">
          <div className="h-4 bg-gray-200 rounded-md w-2/3 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent" 
              style={{
                transform: `translateX(${-100 + shimmer}%)`,
                transition: "transform 0.1s ease-out"
              }}
            />
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent" 
              style={{
                transform: `translateX(${-100 + shimmer}%)`,
                transition: "transform 0.1s ease-out"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;