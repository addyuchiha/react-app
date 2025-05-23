"use client";

import { useState } from "react";
import { Edit, Upload, Lock, Globe } from "lucide-react";
import formatUnixTimestamp from "../../scripts/utils/formatUnixTimestamp";
import UpdateGalleryPopup from "./UpdateGalleryPopup";
import UploadDialog from "./UploadDialog";

interface Props {
  title: string;
  description: string;
  createdAt: number;
  count: number;
  thumbnailUrl: string;
  galleryId: string;
  isPublic: boolean;
  handleRefresh: () => void;
}

function Card({
  title,
  description,
  createdAt,
  thumbnailUrl,
  count,
  galleryId,
  isPublic,
  handleRefresh,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      {showEdit && (
        <UpdateGalleryPopup
          setState={setShowEdit}
          galleryId={galleryId}
          initialData={{
            name: title,
            description: description,
            public: isPublic,
            sessionDate: createdAt,
          }}
          onUpdated={handleRefresh}
        />
      )}
      {showUpload && (
        <UploadDialog
          setState={setShowUpload}
          galleryId={galleryId}
          onUploaded={handleRefresh}
        />
      )}
      <div
        className="rounded-xl bg-white overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 h-max cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Hover Effects */}
        <div className="h-52 relative overflow-hidden flex bg-black/10">
          <img
            className={`${
              thumbnailUrl ? "h-full w-full" : "h-20 m-auto"
            } object-cover transition-transform duration-700 ease-in-out hover:scale-105`}
            src={thumbnailUrl ?? "/placeholder.png"}
            alt={title}
          />

          {/* Privacy indicator - always visible in top-right corner */}
          <div className="absolute top-2 right-2">
            <div
              className={`p-1.5 rounded-full backdrop-blur-sm ${
                isPublic
                  ? "bg-green-500/80 text-white"
                  : "bg-gray-800/80 text-white"
              }`}
              title={isPublic ? "Public Gallery" : "Private Gallery"}
            >
              {isPublic ? <Globe size={14} /> : <Lock size={14} />}
            </div>
          </div>

          {/* Overlay that appears on hover */}
          <div
            className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(true)}
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Upload size={18} className="text-gray-800" />
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Edit size={18} className="text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">{title}</h3>
            {/* Privacy indicator in content area as well */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {isPublic ? (
                <>
                  <Globe size={12} />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock size={12} />
                  <span>Private</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 gap-1">
            <span>Created at: {formatUnixTimestamp(createdAt)}</span>
          </div>

          <div className="flex items-center justify-between pt-1 space-x-2">
            <span className="text-sm font-medium text-gray-700 w-full overflow-hidden text-ellipsis text-nowrap">
              {description}
            </span>
            <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-full text-nowrap">
              {count} photos
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
