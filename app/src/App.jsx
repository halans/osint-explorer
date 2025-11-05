import { useState, useEffect, useMemo, useRef } from 'react'
import { List, Star } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CategoryStats from './components/CategoryStats'
import FilterPanel from './components/FilterPanel'
import ToolList from './components/ToolList'
import ToolDetail from './components/ToolDetail'
import ShortlistView from './components/ShortlistView'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    subcategories: [],
    tags: []
  })
  const [selectedTool, setSelectedTool] = useState(null)
  const [shortlist, setShortlist] = useState([])
  const [viewMode, setViewMode] = useState('directory') // 'directory' or 'shortlist'
  const [showFilters, setShowFilters] = useState(false)
  const isInitialMount = useRef(true)

  // Load data from JSON
  useEffect(() => {
    fetch('/tools.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load tools data')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Load shortlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('osint-shortlist')
    if (saved) {
      try {
        setShortlist(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved shortlist:', e)
      }
    }
  }, [])

  // Save shortlist to localStorage
  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with empty array
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem('osint-shortlist', JSON.stringify(shortlist))
  }, [shortlist])

  // Filter tools based on search, category, and filters
  const filteredTools = useMemo(() => {
    if (!data) return []

    let tools = data.tools

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.subcategory?.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory) {
      tools = tools.filter(tool => tool.category === selectedCategory)
    }

    // Advanced filters
    if (selectedFilters.categories.length > 0) {
      tools = tools.filter(tool =>
        selectedFilters.categories.includes(tool.category)
      )
    }

    if (selectedFilters.subcategories.length > 0) {
      tools = tools.filter(tool =>
        tool.subcategory && selectedFilters.subcategories.includes(tool.subcategory)
      )
    }

    if (selectedFilters.tags.length > 0) {
      tools = tools.filter(tool =>
        selectedFilters.tags.some(tag => tool.tags.includes(tag))
      )
    }

    return tools
  }, [data, searchQuery, selectedCategory, selectedFilters])

  // Find related tools for detail panel
  const getRelatedTools = (tool) => {
    if (!data) return []

    return data.tools
      .filter(t =>
        t.id !== tool.id &&
        (t.category === tool.category ||
         t.tags.some(tag => tool.tags.includes(tag)))
      )
      .slice(0, 5)
  }

  // Shortlist management
  const toggleShortlist = (tool) => {
    setShortlist(prev => {
      const exists = prev.find(t => t.id === tool.id)
      if (exists) {
        return prev.filter(t => t.id !== tool.id)
      } else {
        return [...prev, tool]
      }
    })
  }

  const clearShortlist = () => {
    if (confirm('Are you sure you want to clear your entire shortlist?')) {
      setShortlist([])
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading OSINT tools...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading">
        <p>Error: {error}</p>
      </div>
    )
  }

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.subcategories.length +
    selectedFilters.tags.length

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>OSINT Tools Explorer</h1>
          <p>Curated collection of {data.totalTools} open-source intelligence tools</p>
        </div>
        <div className="header-actions">
          <button
            className={`view-toggle ${viewMode === 'directory' ? 'active' : ''}`}
            onClick={() => setViewMode('directory')}
          >
            <List size={20} />
            Directory
          </button>
          <button
            className={`view-toggle ${viewMode === 'shortlist' ? 'active' : ''}`}
            onClick={() => setViewMode('shortlist')}
          >
            <Star size={20} />
            Shortlist ({shortlist.length})
          </button>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2>Categories</h2>
            <CategoryStats
              categories={data.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalTools={data.totalTools}
            />
          </div>

          <div className="sidebar-section">
            <h2>
              Filters
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'}
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
              </button>
            </h2>
            {showFilters && (
              <FilterPanel
                data={data}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            )}
          </div>
        </aside>

        <section className="content">
          {viewMode === 'directory' ? (
            <>
              <div className="search-section">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  resultsCount={filteredTools.length}
                />
              </div>
              <ToolList
                tools={filteredTools}
                searchQuery={searchQuery}
                onSelectTool={setSelectedTool}
                selectedTool={selectedTool}
                shortlist={shortlist}
                onToggleShortlist={toggleShortlist}
              />
            </>
          ) : (
            <ShortlistView
              shortlist={shortlist}
              onSelectTool={setSelectedTool}
              onToggleShortlist={toggleShortlist}
              onClearShortlist={clearShortlist}
            />
          )}
        </section>

        {selectedTool && (
          <aside className="detail-panel">
            <ToolDetail
              tool={selectedTool}
              onClose={() => setSelectedTool(null)}
              isInShortlist={shortlist.some(t => t.id === selectedTool.id)}
              onToggleShortlist={() => toggleShortlist(selectedTool)}
              relatedTools={getRelatedTools(selectedTool)}
            />
          </aside>
        )}
      </main>
    </div>
  )
}

export default App
