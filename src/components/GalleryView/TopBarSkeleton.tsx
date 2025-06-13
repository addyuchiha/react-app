import { FC } from 'react';

const TopBarSkeleton: FC = () => {
  return (
    <div className="w-full bg-white border rounded-xl px-6 py-4 pl-2">
      <div className="flex items-center justify-between">
        {/* Left section skeleton */}
        <div className="flex items-center">
          <div className="mr-4 p-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div>
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Right section skeleton */}
        <div className="flex items-center space-x-3">
          <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-28 h-9 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-28 h-9 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default TopBarSkeleton;