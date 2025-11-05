# OSINT Directory Web Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive React web application that transforms 546+ curated OSINT bookmarks into a searchable, filterable directory with hierarchical navigation, tool detail panels, and persistent shortlists.

**Architecture:** Single-page React application using Vite for build tooling. Client-side data loading from static JSON file (already generated). Component-based architecture with shared state for search, filters, and shortlist. Local storage for persistence.

**Tech Stack:** React 18, Vite, Lucide React (icons), CSS Modules/vanilla CSS

---

## Task 1: Create Base Component Structure

**Files:**
- Create: `app/src/components/SearchBar.jsx`
- Create: `app/src/components/CategoryStats.jsx`
- Create: `app/src/components/FilterPanel.jsx`
- Create: `app/src/components/DirectoryTree.jsx`
- Create: `app/src/components/ToolList.jsx`
- Create: `app/src/components/ToolDetail.jsx`
- Create: `app/src/components/ShortlistView.jsx`
- Modify: `app/src/App.jsx`

**Step 1: Create SearchBar component**

Create `app/src/components/SearchBar.jsx`:

```jsx
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
```

**Step 2: Create CategoryStats component**

Create `app/src/components/CategoryStats.jsx`:

```jsx
import './CategoryStats.css'

export default function CategoryStats({
  categories,
  selectedCategory,
  onSelectCategory,
  totalTools
}) {
  return (
    <div className="category-stats">
      <div className="stats-summary">
        <strong>{totalTools}</strong> tools available
      </div>
      <ul className="category-list" role="list">
        <li>
          <button
            className={`category-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            <span className="category-name">All Categories</span>
            <span className="category-count">{totalTools}</span>
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.name}>
            <button
              className={`category-item ${
                selectedCategory === cat.name ? 'active' : ''
              }`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Step 3: Create FilterPanel component**

Create `app/src/components/FilterPanel.jsx`:

```jsx
import { X } from 'lucide-react'
import './FilterPanel.css'

export default function FilterPanel({ data, selectedFilters, onFilterChange }) {
  const allTags = [...new Set(data.tools.flatMap((t) => t.tags))].sort()
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
        <h3>Categories</h3>
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
      </div>

      {allSubcategories.length > 0 && (
        <div className="filter-section">
          <h3>Subcategories</h3>
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
        </div>
      )}

      <div className="filter-section">
        <h3>Popular Tags</h3>
        <div className="filter-chips">
          {allTags.slice(0, 20).map((tag) => (
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
      </div>
    </div>
  )
}
```

**Step 4: Create DirectoryTree component (simplified)**

Create `app/src/components/DirectoryTree.jsx`:

```jsx
import { Folder, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import './DirectoryTree.css'

export default function DirectoryTree({
  data,
  filteredTools,
  selectedCategory,
  onSelectCategory
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catName)) {
        next.delete(catName)
      } else {
        next.add(catName)
      }
      return next
    })
  }

  // Build hierarchy from filtered tools
  const hierarchy = {}
  filteredTools.forEach((tool) => {
    if (!hierarchy[tool.category]) {
      hierarchy[tool.category] = { tools: [], subcategories: {} }
    }
    if (tool.subcategory) {
      if (!hierarchy[tool.category].subcategories[tool.subcategory]) {
        hierarchy[tool.category].subcategories[tool.subcategory] = []
      }
      hierarchy[tool.category].subcategories[tool.subcategory].push(tool)
    } else {
      hierarchy[tool.category].tools.push(tool)
    }
  })

  if (Object.keys(hierarchy).length === 0) {
    return null
  }

  return (
    <div className="directory-tree" role="tree">
      {Object.entries(hierarchy).map(([catName, catData]) => {
        const isExpanded = expandedCategories.has(catName)
        const subcatCount = Object.keys(catData.subcategories).length
        const toolCount = catData.tools.length

        return (
          <div key={catName} className="tree-category" role="treeitem">
            <button
              className="tree-header"
              onClick={() => toggleCategory(catName)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <FolderOpen size={16} />
              ) : (
                <Folder size={16} />
              )}
              <span className="tree-label">{catName}</span>
              <span className="tree-count">
                {toolCount + Object.values(catData.subcategories).flat().length}
              </span>
            </button>

            {isExpanded && subcatCount > 0 && (
              <div className="tree-children">
                {Object.entries(catData.subcategories).map(
                  ([subName, subTools]) => (
                    <div key={subName} className="tree-subcategory">
                      <span className="tree-sublabel">
                        {subName} ({subTools.length})
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

**Step 5: Create ToolList component**

Create `app/src/components/ToolList.jsx`:

```jsx
import { ExternalLink, Star } from 'lucide-react'
import './ToolList.css'

export default function ToolList({
  tools,
  searchQuery,
  onSelectTool,
  selectedTool,
  shortlist,
  onToggleShortlist
}) {
  const highlightText = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    )
  }

  if (tools.length === 0) {
    return (
      <div className="tool-list-empty">
        <p>No tools match your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="tool-list" role="list">
      {tools.map((tool) => {
        const isInShortlist = shortlist.some((t) => t.id === tool.id)
        const isSelected = selectedTool?.id === tool.id

        return (
          <article
            key={tool.id}
            className={`tool-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectTool(tool)}
            role="listitem"
          >
            <div className="tool-header">
              <div className="tool-icon">
                {tool.icon ? (
                  <img src={tool.icon} alt="" width="16" height="16" />
                ) : (
                  <ExternalLink size={16} />
                )}
              </div>
              <h3 className="tool-name">
                {highlightText(tool.name, searchQuery)}
              </h3>
              <button
                className={`tool-shortlist-btn ${
                  isInShortlist ? 'active' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleShortlist(tool)
                }}
                aria-label={
                  isInShortlist ? 'Remove from shortlist' : 'Add to shortlist'
                }
              >
                <Star size={16} fill={isInShortlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="tool-path">{tool.path}</p>

            {tool.tags.length > 0 && (
              <div className="tool-tags">
                {tool.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tool-tag">
                    {highlightText(tag, searchQuery)}
                  </span>
                ))}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
```

**Step 6: Create ToolDetail component**

Create `app/src/components/ToolDetail.jsx`:

```jsx
import { X, ExternalLink, Copy, Star } from 'lucide-react'
import { useState } from 'react'
import './ToolDetail.css'

export default function ToolDetail({
  tool,
  onClose,
  isInShortlist,
  onToggleShortlist,
  relatedTools
}) {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(tool.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="tool-detail">
      <div className="detail-header">
        <button onClick={onClose} className="detail-close" aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-title-section">
          {tool.icon && (
            <img
              src={tool.icon}
              alt=""
              className="detail-icon"
              width="32"
              height="32"
            />
          )}
          <h2>{tool.name}</h2>
        </div>

        <div className="detail-path">
          <strong>Category:</strong> {tool.path}
        </div>

        <div className="detail-actions">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={16} />
            Open Tool
          </a>
          <button onClick={copyUrl} className="btn btn-secondary">
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button
            onClick={onToggleShortlist}
            className={`btn btn-secondary ${isInShortlist ? 'active' : ''}`}
          >
            <Star size={16} fill={isInShortlist ? 'currentColor' : 'none'} />
            {isInShortlist ? 'In Shortlist' : 'Add to Shortlist'}
          </button>
        </div>

        <div className="detail-url">
          <strong>URL:</strong>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-url-link"
          >
            {tool.url}
          </a>
        </div>

        {tool.tags.length > 0 && (
          <div className="detail-tags">
            <strong>Tags:</strong>
            <div className="detail-tags-list">
              {tool.tags.map((tag) => (
                <span key={tag} className="detail-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {relatedTools.length > 0 && (
          <div className="detail-related">
            <h3>Related Tools</h3>
            <ul>
              {relatedTools.map((related) => (
                <li key={related.id}>
                  <a href={related.url} target="_blank" rel="noopener noreferrer">
                    {related.name}
                  </a>
                  <span className="related-category">{related.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 7: Create ShortlistView component**

Create `app/src/components/ShortlistView.jsx`:

```jsx
import { Trash2, ExternalLink, Star } from 'lucide-react'
import './ShortlistView.css'

export default function ShortlistView({
  shortlist,
  onSelectTool,
  onToggleShortlist,
  onClearShortlist
}) {
  if (shortlist.length === 0) {
    return (
      <div className="shortlist-empty">
        <Star size={48} />
        <h2>Your shortlist is empty</h2>
        <p>Click the star icon on any tool to add it to your shortlist.</p>
      </div>
    )
  }

  return (
    <div className="shortlist-view">
      <div className="shortlist-header">
        <h2>Your Shortlist ({shortlist.length} tools)</h2>
        <button onClick={onClearShortlist} className="btn-clear-shortlist">
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="shortlist-grid">
        {shortlist.map((tool) => (
          <article key={tool.id} className="shortlist-card">
            <div className="shortlist-card-header">
              {tool.icon && (
                <img src={tool.icon} alt="" width="24" height="24" />
              )}
              <h3>{tool.name}</h3>
              <button
                className="shortlist-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleShortlist(tool)
                }}
                aria-label="Remove from shortlist"
              >
                <Star size={16} fill="currentColor" />
              </button>
            </div>

            <p className="shortlist-path">{tool.path}</p>

            <div className="shortlist-actions">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
              >
                <ExternalLink size={14} />
                Open
              </a>
              <button
                onClick={() => onSelectTool(tool)}
                className="btn btn-sm btn-secondary"
              >
                Details
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

**Step 8: Update App.jsx with complete application logic**

Replace `app/src/App.jsx` with the main application component provided earlier in this conversation.

**Step 9: Commit component structure**

```bash
cd app
git add src/components/
git commit -m "feat: add all core React components for OSINT directory

- SearchBar: keyword search with result count
- CategoryStats: category list with counts
- FilterPanel: multi-facet filtering
- DirectoryTree: hierarchical category navigation
- ToolList: tool cards with highlighting
- ToolDetail: detailed tool panel with actions
- ShortlistView: saved tools view"
```

---

## Task 2: Add CSS Styling

**Files:**
- Create: `app/src/components/SearchBar.css`
- Create: `app/src/components/CategoryStats.css`
- Create: `app/src/components/FilterPanel.css`
- Create: `app/src/components/DirectoryTree.css`
- Create: `app/src/components/ToolList.css`
- Create: `app/src/components/ToolDetail.css`
- Create: `app/src/components/ShortlistView.css`
- Modify: `app/src/App.css`
- Modify: `app/src/index.css`

**Step 1: Create base styles and CSS reset**

Update `app/src/index.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-danger: #ef4444;

  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-hover: #f1f5f9;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light;
  color: var(--color-text);
  background-color: var(--color-bg);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  margin: 0;
}

button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

mark {
  background-color: #fef08a;
  color: inherit;
  padding: 0 0.125rem;
  border-radius: var(--radius-sm);
}

/* Loading spinner */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--spacing-md);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  text-decoration: none;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-bg-hover);
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Create App.css with main layout**

Replace `app/src/App.css`:

```css
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.header-content h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.header-content p {
  color: var(--color-text-secondary);
  font-size: 0.938rem;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.view-toggle:hover {
  background-color: var(--color-bg-hover);
}

.view-toggle.active {
  background-color: var(--color-primary);
  color: white;
}

.main-content {
  display: grid;
  grid-template-columns: 280px 1fr auto;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: var(--spacing-xl);
}

.sidebar-section h2 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.filter-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s;
}

.filter-toggle:hover {
  background-color: var(--color-bg-hover);
}

.filter-count {
  margin-left: auto;
  background-color: var(--color-primary);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.content {
  padding: var(--spacing-lg) var(--spacing-xl);
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}

.search-section {
  margin-bottom: var(--spacing-lg);
}

.detail-panel {
  width: 400px;
  background-color: var(--color-bg);
  border-left: 1px solid var(--color-border);
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .detail-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    z-index: 999;
    transition: left 0.3s;
  }

  .sidebar.open {
    left: 0;
  }
}
```

**Step 3-9: Create individual component CSS files**

Due to length constraints, I'll provide the pattern for SearchBar.css and indicate the others should follow similar design patterns:

Create `app/src/components/SearchBar.css`:

```css
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-clear {
  position: absolute;
  right: 5rem;
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
}

.search-clear:hover {
  background-color: var(--color-bg-hover);
}

.search-results {
  position: absolute;
  right: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}
```

[Similar CSS files would be created for CategoryStats, FilterPanel, DirectoryTree, ToolList, ToolDetail, and ShortlistView following the same design system]

**Step 10: Commit CSS styles**

```bash
git add src/*.css src/components/*.css
git commit -m "style: add complete CSS styling system

- Design tokens and CSS variables
- Responsive layout grid
- Component-specific styles
- Accessibility focus states
- Mobile responsive breakpoints"
```

---

## Task 3: Test and Verify

**Step 1: Run development server**

```bash
cd app
npm run dev
```

Expected: Server starts on http://localhost:5173

**Step 2: Manual testing checklist**

Test the following functionality:

- [ ] Data loads from tools.json
- [ ] Category stats show correct counts
- [ ] Search filters tools by name/tags
- [ ] Search highlights matched text
- [ ] Category selection filters tools
- [ ] Filter panel toggles categories/subcategories/tags
- [ ] Multiple filters combine correctly
- [ ] Tool cards display name, path, tags, icon
- [ ] Clicking tool opens detail panel
- [ ] Detail panel shows full metadata
- [ ] "Open Tool" link works in new tab
- [ ] "Copy URL" copies to clipboard
- [ ] Star button adds/removes from shortlist
- [ ] Shortlist persists on page reload
- [ ] Shortlist view shows saved tools
- [ ] "Clear All" clears shortlist with confirmation
- [ ] Keyboard navigation works
- [ ] Responsive layout works on mobile

**Step 3: Fix any issues found**

[Address bugs discovered during testing]

**Step 4: Commit fixes**

```bash
git add .
git commit -m "fix: address testing issues

- [List specific fixes made]"
```

---

## Task 4: Build and Documentation

**Step 1: Create README**

Create `app/README.md`:

```markdown
# OSINT Tools Explorer

Interactive web application providing searchable access to 546+ curated OSINT tools across 15 categories.

## Features

- **Hierarchical Navigation**: Browse tools by category and subcategory
- **Advanced Search**: Keyword search with text highlighting
- **Multi-Facet Filtering**: Combine category, subcategory, and tag filters
- **Tool Details**: In-depth information with quick actions
- **Personal Shortlist**: Save favorite tools with localStorage persistence
- **Dataset Statistics**: Real-time category counts and breadth overview
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation

## Tech Stack

- React 18
- Vite
- Lucide React (icons)
- Vanilla CSS with CSS Variables

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Data Source

Tools are loaded from `public/tools.json`, generated from `bookmarks.html` using the parser script in `../scripts/parse-bookmarks.js`.

To regenerate data:

\`\`\`bash
node ../scripts/parse-bookmarks.js
cp ../data/tools.json public/
\`\`\`

## License

[Your license]
```

**Step 2: Build for production**

```bash
npm run build
```

Expected: Build completes successfully, output in `dist/` directory

**Step 3: Test production build**

```bash
npm run preview
```

Expected: Production build runs correctly on http://localhost:4173

**Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: add comprehensive README

- Feature overview
- Setup instructions
- Build and deployment guide
- Data regeneration process"
```

---

## Completion Checklist

- [  ] All components created and functional
- [ ] CSS styling complete and responsive
- [ ] Search and filter working correctly
- [ ] Shortlist persistence verified
- [ ] Category statistics accurate
- [ ] Tool detail panel complete
- [ ] Accessibility tested with keyboard
- [ ] Mobile responsive verified
- [ ] Production build successful
- [ ] Documentation complete

---

## Next Steps (Post-MVP)

Consider these enhancements after core implementation:

1. **Link Validation**: Periodic checks for broken tool links
2. **Tool Descriptions**: Manually curate descriptions for popular tools
3. **Export Shortlist**: Download shortlist as JSON/CSV
4. **Dark Mode**: Theme toggle for dark/light modes
5. **Analytics**: Privacy-respecting usage analytics
6. **PWA**: Service worker for offline access
7. **Advanced Filters**: Date added, tool type, language filters
8. **Bookmarklet**: Quick-add tool from browser
9. **API**: RESTful API for programmatic access
10. **Community**: User submissions and ratings

---

