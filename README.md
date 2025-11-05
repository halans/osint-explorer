# Interactive OSINT Directory

An interactive directory that transforms the curated `bookmarks.html` export into a searchable, filterable resource for OSINT practitioners.

## Features
- Hierarchical navigation that mirrors the "OSINT Stack" bookmark structure with expandable tree view and breadcrumbs.
- Keyword search across tool names, category paths, and tags with inline highlighting of results.
- Multi-select filters for top-level categories, subcategories, and tags.
- Inline tool detail panel with quick actions to open the tool or copy the URL and a recommendations section for similar tools.
- Persistent "Research Shortlist" that stores saved tools in `localStorage` and surfaces them in a dedicated sidebar.
- Category overview summary with live counts that respond to active filters.

## Getting Started

### 1. Install prerequisites
Node.js ≥ 18 is required for running tests and the data conversion script. No third-party packages are needed.

### 2. Regenerate the dataset (optional)
If you update `bookmarks.html`, run the converter to rebuild the structured dataset:

```bash
python3 scripts/convert_bookmarks.py
```

This writes `data/osint-tools.json`, containing the normalized tools array and category tree.

### 3. Launch the UI
Serve the `public/` directory using your preferred static server. For example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/public/> in your browser.

### 4. Run tests
Unit tests cover search scoring, filtering helpers, and shortlist state management:

```bash
npm test
```

## Project Structure

```
├── data/osint-tools.json         # Generated dataset consumed by the UI
├── public/                       # Static application shell
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── scripts/convert_bookmarks.py  # Netscape bookmark parser → structured JSON
├── src/lib/directory.js          # Shared filtering & shortlist logic
├── src/types.d.ts                # Dataset type declarations
└── tests/directory.test.js       # Node test suite
```

## Future Enhancements
- Enrich tool metadata with manual descriptions or scraped previews.
- Add quick export of filtered results to CSV/JSON for offline research packages.
- Integrate lightweight analytics (e.g., which categories are most explored) while respecting the privacy constraints outlined in `openspec/project.md`.
