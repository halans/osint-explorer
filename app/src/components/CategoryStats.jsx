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
