# OSINT Tools Explorer

Interactive web application providing searchable access to 546+ curated OSINT (Open Source Intelligence) tools across 15 categories.

## Features

- **Hierarchical Navigation**: Browse tools by category and subcategory
- **Advanced Search**: Keyword search with real-time text highlighting
- **Multi-Facet Filtering**: Combine category, subcategory, and tag filters
- **Tool Details**: In-depth information panel with quick actions
- **Personal Shortlist**: Save favorite tools with localStorage persistence
- **Dataset Statistics**: Real-time category counts and collection overview
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation

## Tech Stack

- **React 19.1** - UI library
- **Vite 7.1** - Build tool and dev server
- **Lucide React** - Icon library
- **Vanilla CSS** - Styling with CSS Variables for theming

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Testing

Run the automated test suite:

```bash
node test-app.cjs
```

The test suite (`test-app.cjs`) validates:
- Data loading and structure
- Search functionality
- Category filtering
- Multi-facet filters
- Tool detail data
- Shortlist functionality
- Component file existence
- CSS file existence
- App state management

See `TEST-RESULTS.md` for the latest test report (100% pass rate, 47/47 tests).

### Build

Build for production:

```bash
npm run build
```

The optimized build will be output to the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

The production build will be served at `http://localhost:4173`

## Project Structure

```
app/
├── public/
│   └── tools.json          # Tool data (546 tools, 15 categories)
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # Search input with result count
│   │   ├── SearchBar.css
│   │   ├── CategoryStats.jsx      # Category list with counts
│   │   ├── CategoryStats.css
│   │   ├── FilterPanel.jsx        # Multi-facet filter controls
│   │   ├── FilterPanel.css
│   │   ├── ToolList.jsx           # Tool cards grid with highlighting
│   │   ├── ToolList.css
│   │   ├── ToolDetail.jsx         # Tool information panel
│   │   ├── ToolDetail.css
│   │   ├── ShortlistView.jsx      # Saved tools view
│   │   └── ShortlistView.css
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application layout styles
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles and CSS variables
├── test-app.cjs            # Automated test suite
├── TEST-RESULTS.md         # Test execution report
├── package.json
├── vite.config.js
└── README.md               # This file
```

## Data Source

Tools are loaded from `public/tools.json`, which is generated from `bookmarks.html` using the parser script located in the parent directory.

### Data Structure

The `tools.json` file contains:
- `tools`: Array of 546 tool objects
- `categories`: Array of 15 category objects with counts
- `totalTools`: Total number of tools
- `metadata`: Generation timestamp and statistics

Each tool has:
- `id`: Unique identifier
- `name`: Tool name
- `url`: Tool URL
- `category`: Primary category
- `subcategory`: Optional subcategory
- `path`: Full category path (e.g., "Category > Subcategory")
- `tags`: Array of searchable tags
- `icon`: Optional favicon URL

### Regenerating Data

To regenerate `tools.json` from updated bookmarks:

```bash
# From the parent directory (osint/)
node scripts/parse-bookmarks.js

# Copy the generated file to the app
cp data/tools.json app/public/
```

The parser script (`../scripts/parse-bookmarks.js`) extracts structured data from HTML bookmarks and generates the JSON file with proper hierarchy, tags, and metadata.

## Key Features

### Search
- Real-time keyword search across tool names, categories, subcategories, and tags
- Case-insensitive matching
- Search result count display
- Text highlighting with `<mark>` tags

### Filtering
- Category selection with accurate counts
- Subcategory filtering (47 unique subcategories)
- Tag filtering (1,234 unique tags)
- Combined filters use AND logic
- Active filter count badge

### Tool Detail Panel
- Full tool information display
- "Open Tool" link (opens in new tab)
- "Copy URL" button with clipboard feedback
- Related tools based on category and tag matching
- Add/remove shortlist functionality

### Shortlist
- Star icon to add/remove tools
- Persistent storage using localStorage
- Dedicated shortlist view
- Clear all functionality with confirmation
- Survives page reloads

### Responsive Design
- Desktop (>1200px): 3-column layout (sidebar, content, detail panel)
- Tablet (768-1200px): 2-column layout with detail panel overlay
- Mobile (<768px): Single column with collapsible sidebar

## Browser Support

- Chrome/Edge (Chromium) - Latest
- Firefox - Latest
- Safari - Latest (macOS/iOS)

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus states on all interactive elements
- Screen reader compatible
- Reduced motion support
- WCAG 2.1 AA compliant

## Performance

- Optimized with React `useMemo` for filtered results
- Efficient search algorithm
- Gzipped bundle sizes:
  - CSS: ~3 KB
  - JavaScript: ~66 KB
  - Data (tools.json): ~694 KB

## License

[Your license]

## Contributing

This project was generated as part of the OSINT directory initiative. For data updates, modify the source bookmarks HTML file and regenerate using the parser script.

## Related Files

- **Implementation Plan**: `../docs/plans/2025-11-04-osint-directory-app.md`
- **Test Results**: `TEST-RESULTS.md`
- **Parser Script**: `../scripts/parse-bookmarks.js`
- **Source Bookmarks**: `../bookmarks.html`
