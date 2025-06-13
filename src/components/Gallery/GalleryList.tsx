import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";
import Card from "./Card";
import GalleryListSkeleton from "./GalleryListSkeleton";
import { useNavigate } from "react-router-dom";
import CreateNewCard from "./CreateNewCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Props {
  searchTerms: string | null;
  setCreatePopupState: Dispatch<SetStateAction<boolean>>;
  handleRefresh: () => void;
}

interface Gallery {
  name: string;
  description: string;
  thumbnailUrl: string;
  sessionDate: number;
  count: number;
  guid: string;
  public: boolean;
}

export default function GalleryList({
  searchTerms,
  setCreatePopupState,
  handleRefresh,
}: Props) {
  const [galleryList, setGalleryList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  console.log(searchTerms);
  useEffect(() => {
    const fetchGalleryList = async () => {
      const accessToken = await getAuthToken(navigate);
      try {
        const response = await fetch(
          `${API_BASE}/api/gallery?page=${page}&limit=100${
            searchTerms ? `&search=${encodeURIComponent(searchTerms)}` : ""
          }`,
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
        setIsLoading(false);
      } catch (err) {
      } finally {
      }
    };
    fetchGalleryList();
  }, []);

  if (isLoading) return <GalleryListSkeleton />;
  if (searchTerms && galleryList.length==0) {
    return (
      <div className="flex h-full justify-center items-center">
        No Results found for "{searchTerms}"
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-auto rounded-xl">
        {galleryList.map((gallery: Gallery) => (
          <Card
            title={gallery.name}
            thumbnailUrl={gallery.thumbnailUrl}
            description={gallery.description}
            createdAt={gallery.sessionDate}
            count={gallery.count}
            galleryId={gallery.guid}
            isPublic={gallery.public}
            handleRefresh={handleRefresh}
          />
        ))}
        {!searchTerms && <CreateNewCard setCreatePopupState={setCreatePopupState} /> }
      </div>
    )
  }
}
