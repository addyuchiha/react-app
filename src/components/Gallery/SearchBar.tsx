import { type Dispatch, type SetStateAction, useState, type KeyboardEvent, type ChangeEvent } from "react"
import { Search } from "lucide-react"

interface Props {
  handleRefresh: () => void
  setSearchTerms: Dispatch<SetStateAction<string | null>>
}

const SearchBar = ({ setSearchTerms, handleRefresh }: Props) => {
  const [query, setQuery] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerms(query.trim() || null)
      handleRefresh()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    if (newValue.trim() === "") {
      setSearchTerms(null)
      handleRefresh()
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search galleries..."
        className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  )
}

export default SearchBar
