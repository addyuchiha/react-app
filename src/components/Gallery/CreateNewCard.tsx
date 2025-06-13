import { Plus } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

interface Props {
  setCreatePopupState: Dispatch<SetStateAction<boolean>>;
}

export default function CreateNewCard({ setCreatePopupState }: Props) {
  return (
    <div
      className="rounded-xl bg-white overflow-hidden border shadow-sm hover:shadow-md hover:bg-gray-200 transition-all duration-300 h-full cursor-pointer flex flex-col items-center justify-center p-6 gap-4"
      onClick={() => setCreatePopupState(true)}
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Plus className="h-6 w-6 text-gray-500" />
      </div>
      <div className="text-center">
        <h3 className="font-medium text-gray-800">Create New Gallery</h3>
        <p className="text-sm text-gray-500 mt-1">Add a new gallery to your collection</p>
      </div>
    </div>
  )
}
