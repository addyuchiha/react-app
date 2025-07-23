import { useEffect, useState } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";
import { useNavigate } from "react-router-dom";
import PictureContainer from "./Picture";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Props {
  isParentLoading: boolean;
  sectionGuid: null | string;
  galleryGuid: string;
}

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

export default function PicturesList({
  isParentLoading,
  sectionGuid,
  galleryGuid,
}: Props) {
  const [picturesList, setPicturesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPicturesList = async () => {
      const accessToken = await getAuthToken(navigate);
      try {
        const response = await fetch(
          `${API_BASE}/api/gallery/${galleryGuid}/images${
            sectionGuid ? `/${sectionGuid}` : ""
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
        console.log(data);
        setPicturesList(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        alert("Something went wrong. Please try again later");
        navigate("/");
      }
    };
    if (!isParentLoading) {
      fetchPicturesList();
    }
  }, [isLoading, isParentLoading, sectionGuid]);
  if (isLoading || isParentLoading) {
    return <>"loading"</>;
  } else {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 rounded-xl">
          {picturesList.map((picture: Picture) => (
            <PictureContainer
              key={picture.guid}
              picture={picture}
              galleryGuid={galleryGuid}
            />
          ))}
        </div>
      </div>
    );
  }
}
