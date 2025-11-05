import { Search, X } from 'lucide-react'
import './SearchBar.css'

export default function SearchBar({ value, onChange, resultsCount }) {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Search tools by name, category, or tags..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        aria-label="Search tools"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="search-clear"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
      {value && (
        <span className="search-results" aria-live="polite">
          {resultsCount} results
        </span>
      )}
    </div>
  )
}
