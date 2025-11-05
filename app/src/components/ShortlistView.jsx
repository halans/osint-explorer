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
