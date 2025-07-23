import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CreateSection from "./Create";
import getAuthToken from "../../scripts/auth/getAuthToken";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface SectionBarProps {
  galleryGuid: string;
  setSection: (sectionGuid: string) => void
}

interface Option {
  guid: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: null | string;
}

function SectionBarSkeleton(): JSX.Element {
  return (
    <div className="relative inline-block text-left w-64">
      <div className="inline-flex w-full justify-between rounded-md bg-gray-700 px-4 py-2 text-sm font-medium shadow-sm animate-pulse">
        <div className="h-5 bg-gray-600 rounded w-16"></div>
        <div className="h-5 w-5 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

function SectionBar({ galleryGuid, setSection }: SectionBarProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Main");
  const [createState, setCreateState] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getGallerySections() {
      const accessToken = await getAuthToken(navigate);
      try {
        const response = await fetch(
          `${API_BASE}/api/gallery/${galleryGuid}/section`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        console.log(data)
        setOptions(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        alert("Something went wrong. Please try again later");
        navigate("/");
      }
    }
    getGallerySections();
  }, [isLoading]);

  const main: Option = {
    name: "Main",
    guid: "",
    position: 0,
    createdAt: "",
    updatedAt: null,
  };
  const allOptions: Option[] = [main, ...options];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading) {
    return <SectionBarSkeleton />;
  }

  return (
    <>
      {createState && (
        <CreateSection
          galleryGuid={galleryGuid}
          setState={setCreateState}
          onCreated={() => setIsLoading(true)}
        />
      )}
      <div className="relative inline-block text-left w-64" ref={dropdownRef}>
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-between rounded-md bg-primary px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selected}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-gray-600 ring-opacity-50">
            <div className="p-2">
              {allOptions.map((option) => (
                <button
                  key={option.name}
                  className="block w-full rounded-sm  px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  onClick={() => {
                    setSelected(option.name);
                    console.log(option.guid)
                    setSection(option.guid)
                    setIsOpen(false);
                  }}
                >
                  {option.name}
                </button>
              ))}
              <div className="border-t border-gray-600 my-1 mx-2"></div>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                onClick={() => {
                  setCreateState(true);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-1">
                  <Plus className="size-5" />
                  <span>Create New Section</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SectionBar;