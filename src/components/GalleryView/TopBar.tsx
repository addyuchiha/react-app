import { FC } from "react";
import { ChevronLeft, Edit2, Upload, Share2 } from "lucide-react";
import TopBarSkeleton from "./TopBarSkeleton";
import SectionBar from "./SectionBar";

interface TopBarProps {
  galleryGuid: string;
  galleryName: string;
  isLoading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onUpload: () => void;
  onPublish: () => void;
  setSection: (sectionGuid: string) => void;
}

const TopBar: FC<TopBarProps> = ({
  galleryGuid,
  galleryName,
  isLoading,
  onBack,
  onEdit,
  onUpload,
  onPublish,
  setSection,
}) => {
  if (isLoading) {
    return <TopBarSkeleton />;
  } else {
    return (
      <div className="w-full bg-white border rounded-xl px-6 py-4 pl-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex justify-center items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {galleryName}
              </h1>
              <SectionBar galleryGuid={galleryGuid} setSection={setSection} />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </button>

            <button
              onClick={onUpload}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>

            <button
              onClick={onPublish}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:brightness-90 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Publish
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default TopBar;
