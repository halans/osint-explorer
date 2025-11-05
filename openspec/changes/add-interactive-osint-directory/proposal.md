## Why
- Transform the static `bookmarks.html` export into a usable research companion for journalists and investigators
- Provide a curated, filterable interface that mirrors the hierarchy of the existing bookmark stack
- Establish a foundation for future OSINT workflows (bookmarking, alerts, analytics) by aligning on data and interaction patterns

## What Changes
- Introduce a new `osint-directory` capability that defines requirements for surfacing the curated tool inventory with search, filters, and detailed context
- Specify ingestion and normalization of the Netscape bookmark export into structured JSON with categories, subcategories, and tool metadata
- Define UI behaviors for navigating hierarchical collections, filtering by multiple facets, and previewing tool details inline
- Capture interaction requirements for personal research workflows such as saving favorites and generating shareable shortlists

## Impact
- Adds a net-new capability and baseline UI requirements for the OSINT application
- Enables consistent tooling taxonomy that future features (reporting, automation, alerts) can reuse
- Requires initial implementation of data processing, client-side search, and state management patterns described in `project.md`
