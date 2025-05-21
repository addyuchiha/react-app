import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";
import Card from "./Card";
import GalleryListSkeleton from "./GalleryListSkeleton";
import { useNavigate } from "react-router-dom";
import CreateNewCard from "./CreateNewCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Props {
  setCreatePopupState: Dispatch<SetStateAction<boolean>>
}

interface Gallery {
  name: string;
  description: string;
  thumbnailUrl: string;
  sessionDate: number;
  count: number;
}

export default function GalleryList({ setCreatePopupState }: Props) {
  const [galleryList, setGalleryList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGalleryList = async () => {
      const accessToken = await getAuthToken(navigate);
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
        setIsLoading(false);
      } catch (err) {
      } finally {
      }
    };
    fetchGalleryList();
  }, []);

  if (isLoading) return <GalleryListSkeleton />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-auto rounded-xl">
      {galleryList.map((gallery: Gallery) => (
        <Card
          title={gallery.name}
          thumbnailUrl={gallery.thumbnailUrl}
          description={gallery.description}
          createdAt={gallery.sessionDate}
          count={gallery.count}
        />
      ))}
      <CreateNewCard setCreatePopupState={setCreatePopupState} />
    </div>
  );
}
