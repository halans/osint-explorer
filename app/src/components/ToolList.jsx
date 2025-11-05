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
