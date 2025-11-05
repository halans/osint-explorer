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
