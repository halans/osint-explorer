## 1. Data Modeling & Ingestion
- [ ] Convert `bookmarks.html` into structured JSON that preserves category hierarchy, tool metadata, and tags
- [ ] Define TypeScript interfaces (or equivalent) for categories, subcategories, and tools, including optional metadata fields

## 2. Directory Experience
- [ ] Build hierarchical navigation that mirrors the bookmark folders and supports collapsing/expanding nested groups
- [ ] Implement global search with fuzzy matching across tool names, descriptions, and tags
- [ ] Add multi-select filters for top-level categories, subcategories, and tool attributes
- [ ] Provide tool detail panels with description, direct link, metadata, and quick actions (copy URL, open in new tab)
- [ ] Allow users to save tools to a local "Research Shortlist" persisted in browser storage

## 3. Quality & Validation
- [ ] Seed the JSON dataset with the transformed bookmark content and document the pipeline
- [ ] Add unit tests for search, filtering, and favorite list state management
- [ ] Document usage instructions and future extension ideas in project README or dedicated docs section
