# Interactive OSINT Directory

Interactive web application providing searchable access to 546+ curated OSINT (Open Source Intelligence) tools for OSINT practitioners.

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

### 4. Deploy to Cloudflare Pages

#### Option A: Git Integration (Recommended)
1. Push your repository to GitHub/GitLab
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to **Pages** → **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build` (or leave empty if using static files)
   - **Build output directory**: `app/dist` (or `public` for static deployment)
   - **Root directory**: `/` (or `/app` if deploying the React app)

#### Option B: Direct Upload
1. Build your project locally:
   ```bash
   # For the React app
   cd app
   npm run build
   
   # Or for static files, just use the public directory
   ```
2. Go to **Cloudflare Pages** → **Upload assets**
3. Drag and drop your `dist` folder (or `public` folder for static)
4. Set a project name and deploy

#### Environment Configuration
For production deployments, you may want to:
- Set up custom domains in the Pages settings
- Configure redirects in `_redirects` file if needed
- Enable analytics and security features

Your OSINT Directory will be available at `https://your-project.pages.dev`

### 5. Run tests
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
