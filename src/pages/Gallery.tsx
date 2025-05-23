import { Plus } from "lucide-react";
import { useState } from "react";

import Template from "../components/Template";
import SearchBar from "../components/Gallery/SearchBar";
import CreateGallery from "../components/Gallery/CreatePopup";
import GalleryList from "../components/Gallery/GalleryList";

export default function Gallery() {
  const [createPopupState, setCreatePopupState] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // trigger for refresh

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // increment to re-render GalleryList
  };

  return (
    <>
      {!createPopupState || <CreateGallery setState={setCreatePopupState} onCreated={handleRefresh} />}
      <Template active="gallery" heading={undefined}>
        <div className="flex justify-between">
          <span className="text-3xl font-bold block">My Galleries</span>
          <div className="flex space-x-4">
            <SearchBar />
            <button
              onClick={() => setCreatePopupState(true)}
              className="flex space-x-2 p-2 rounded-xl bg-accent text-white hover:brightness-90 transition-all text-nowrap pr-3"
            >
              <Plus />
              <span>New Gallery</span>
            </button>
          </div>
        </div>

        <GalleryList key={refreshKey} setCreatePopupState={setCreatePopupState} handleRefresh={handleRefresh} />
      </Template>
    </>
  );
}