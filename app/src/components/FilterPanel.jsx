import { useState } from 'react'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import './FilterPanel.css'

export default function FilterPanel({ data, selectedFilters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    subcategories: false,
    tags: false
  })

  // Calculate tag frequency and get most popular tags
  const popularTags = (() => {
    const tagCounts = {}
    data.tools.forEach(tool => {
      tool.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 20) // Top 20 most popular
      .map(([tag]) => tag)
  })()

  const allSubcategories = [
    ...new Set(data.tools.map((t) => t.subcategory).filter(Boolean))
  ].sort()

  const toggleFilter = (type, value) => {
    onFilterChange((prev) => {
      const current = prev[type]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [type]: updated }
    })
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearAll = () => {
    onFilterChange({ categories: [], subcategories: [], tags: [] })
  }

  const activeCount =
    selectedFilters.categories.length +
    selectedFilters.subcategories.length +
    selectedFilters.tags.length

  return (
    <div className="filter-panel">
      {activeCount > 0 && (
        <button onClick={clearAll} className="clear-filters">
          <X size={14} />
          Clear all ({activeCount})
        </button>
      )}

      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection('categories')}
        >
          {expandedSections.categories ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <h3>Categories</h3>
          {selectedFilters.categories.length > 0 && (
            <span className="active-badge">{selectedFilters.categories.length}</span>
          )}
        </button>
        {expandedSections.categories && (
          <div className="filter-chips">
            {data.categories.map((cat) => (
              <button
                key={cat.name}
                className={`filter-chip ${
                  selectedFilters.categories.includes(cat.name) ? 'active' : ''
                }`}
                onClick={() => toggleFilter('categories', cat.name)}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {allSubcategories.length > 0 && (
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('subcategories')}
          >
            {expandedSections.subcategories ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <h3>Subcategories</h3>
            {selectedFilters.subcategories.length > 0 && (
              <span className="active-badge">{selectedFilters.subcategories.length}</span>
            )}
          </button>
          {expandedSections.subcategories && (
            <div className="filter-chips">
              {allSubcategories.slice(0, 15).map((sub) => (
                <button
                  key={sub}
                  className={`filter-chip ${
                    selectedFilters.subcategories.includes(sub) ? 'active' : ''
                  }`}
                  onClick={() => toggleFilter('subcategories', sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection('tags')}
        >
          {expandedSections.tags ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <h3>Popular Tags</h3>
          {selectedFilters.tags.length > 0 && (
            <span className="active-badge">{selectedFilters.tags.length}</span>
          )}
        </button>
        {expandedSections.tags && (
          <div className="filter-chips">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className={`filter-chip ${
                  selectedFilters.tags.includes(tag) ? 'active' : ''
                }`}
                onClick={() => toggleFilter('tags', tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
