import { useState } from "react";
import Delete from "./Picture/Delete";

interface Picture {
  filename: string;
  mimeType: string;
  guid: string;
  path: string;
  thumbnailPath: string;
  watermarkPath: string;
  url: string;
  thumbnailUrl: string;
  watermarkUrl: string;
}

interface Props {
  picture: Picture;
  galleryGuid: string
}

function PictureContainer({ picture, galleryGuid }: Props) {
  const [deleteState, setDeleteState] = useState(false);
  const handleTransfer = () => {
    // Implement transfer logic
  };
  return (
    <>
    {!deleteState || <Delete setState={setDeleteState} galleryGuid={galleryGuid} pictureGuid={picture.guid} onDeleted={() => {}}  />}
      <div className="overflow-hidden relative group cursor-pointer w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl">
        <img
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          src={picture.thumbnailUrl}
          alt=""
        />

        {/* Overlay with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleTransfer}
            className="bg-white/90 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Transfer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-3 h-3 sm:w-4 sm:h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </button>
          <button
            onClick={() => setDeleteState(true)}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default PictureContainer;