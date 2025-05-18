import { Plus } from "lucide-react";
import Card from "../components/Gallery/Card";
import Template from "../components/Template";
import SearchBar from "../components/Gallery/SearchBar";
import { useEffect, useState } from "react";
import getAuthToken from "../scripts/auth/getAuthToken";
import DashboardSkeleton from "../components/Skeleton";
import CreateGallery from "../components/Gallery/CreatePopup";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Gallery {
  name: string;
  description: string;
  thumbnailUrl: string;
  sessionDate: number;
}

function Gallery() {
  const [galleryList, setGalleryList] = useState([]);
  const [page, setPage] = useState(1);
  const [createPopupState, setCreatePopupState] = useState(false);

  useEffect(() => {
    const fetchGalleryList = async () => {
      const accessToken = await getAuthToken();
      try {
        const response = await fetch(
          `${API_BASE}/api/gallery?page=${page}&limit=100`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setGalleryList(data.data);
      } catch (err) {
      } finally {
      }
    };
    fetchGalleryList();
  }, []);

  if (!galleryList) return <DashboardSkeleton />;

  return (
    <>
      {!createPopupState || <CreateGallery setState={setCreatePopupState} />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-auto rounded-xl">
          {galleryList.map((gallery: Gallery) => (
            <Card
              title={gallery.name}
              thumbnailUrl={gallery.thumbnailUrl}
              description={gallery.description}
              createdAt={gallery.sessionDate}
            />
          ))}
        </div>
      </Template>
    </>
  );
}

export default Gallery;
