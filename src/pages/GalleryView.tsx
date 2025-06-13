import { useNavigate, useParams } from "react-router-dom";
import Template from "../components/Template";
import TopBar from "../components/GalleryView/TopBar";
import { useEffect, useState } from "react";
import getAuthToken from "../scripts/auth/getAuthToken";
import UpdateGallery from "../components/Gallery/UpdateGalleryPopup";
import UploadDialog from "../components/Gallery/UploadDialog";
import PicturesList from "../components/GalleryView/PicturesList";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Details {
  guid: string;
  name: string;
  count: number;
  description: string;
  public: boolean;
  sessionDate: number;
  thumbnailUrl: string | null;
  deletedAt: number | null;
}

function GalleryView() {
  const [isLoading, setIsLoading] = useState(true);
  const [galleryDetails, setgalleryDetails] = useState<Details>({
    guid: "",
    name: "",
    count: 0,
    description: "",
    public: false,
    sessionDate: 0,
    thumbnailUrl: null,
    deletedAt: null,
  });
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [section, setSection] = useState<null | string>(null);

  const navigate = useNavigate();
  const id = useParams().id;

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  function handleSetSection(sectionGuid: string) {
    setSection(sectionGuid);
  }

  useEffect(() => {
    const fetchGalleryDetails = async () => {
      const accessToken = await getAuthToken(navigate);
      try {
        const response = await fetch(
          `${API_BASE}/api/gallery/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setgalleryDetails(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/gallery");
      } finally {
      }
    };
    fetchGalleryDetails();
  }, [refreshKey]);

  return (
    <>
      {showEdit && (
        <UpdateGallery
          setState={setShowEdit}
          galleryId={galleryDetails.guid}
          initialData={galleryDetails}
          onUpdated={() => handleRefresh()}
        />
      )}
      {showUpload && (
        <UploadDialog
          setState={setShowUpload}
          galleryId={galleryDetails.guid}
          onUploaded={handleRefresh}
        />
      )}
      <Template active="gallery" heading={undefined}>
        <TopBar
          setSection={handleSetSection}
          galleryGuid={galleryDetails.guid}
          isLoading={isLoading}
          galleryName={galleryDetails.name}
          onBack={() => navigate("/gallery")}
          onEdit={() => setShowEdit(true)}
          onUpload={() => setShowUpload(true)}
          onPublish={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <PicturesList
          sectionGuid={section}
          isParentLoading={isLoading}
          galleryGuid={galleryDetails.guid}
        />
      </Template>
    </>
  );
}

export default GalleryView;
