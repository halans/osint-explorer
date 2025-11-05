## ADDED Requirements
### Requirement: Bookmark Data Normalization
The application MUST convert the exported Netscape bookmark file into structured JSON that preserves hierarchy and enriches tool metadata.

#### Scenario: Export is transformed into structured records
- **GIVEN** the file `bookmarks.html` contains the "OSINT Stack" hierarchy with nested folders and links
- **WHEN** the ingestion pipeline runs
- **THEN** it outputs JSON entries for each tool with at least `{ id, name, url, category, subcategory, description?, tags?, path }`
- **AND** each entry retains its full folder path (for example `Search Engines > Academic / Literature`)
- **AND** top-level folders without direct links (for example `Person of Interest Search`) become navigable categories with aggregated children

### Requirement: Hierarchical Directory Navigation
Users MUST be able to navigate the entire OSINT Stack hierarchy with expandable levels and breadcrumb context.

#### Scenario: Tree renders the multi-level bookmark hierarchy
- **GIVEN** the normalized dataset includes categories such as `Search Engines`, `Social Media & Forums`, and `Area & Event Monitoring`
- **WHEN** the directory view loads
- **THEN** it displays a collapsible tree that mirrors the category → subcategory → sub-subcategory nesting from the bookmarks file
- **AND** selecting a node updates the breadcrumb trail and tool list to reflect that branch
- **AND** collapsing or expanding a node does not lose the user's scroll position or current selection

### Requirement: Search and Filter Experience
The directory MUST support fast discovery via keyword search and multi-select filters across categories and tags. Use a modern UI framework pattern for responsiveness. Make sure it is repsonsive and accessible.

#### Scenario: Keyword search spans all tool metadata
- **GIVEN** tools include names like "Google Hacking Database" and tags such as `google dorks`
- **WHEN** a user searches for "dork"
- **THEN** the results include any tool whose name, description, or tags contain the query (case-insensitive)
- **AND** matching text is highlighted in the list

#### Scenario: Filters combine multiple facets
- **GIVEN** filters exist for top-level categories, subcategories, and tags (for example `Social Media`, `Telegram`, `live monitoring`)
- **WHEN** a user selects multiple filters across different facets
- **THEN** only tools matching all selected facets remain in the results
- **AND** the UI reflects active filters with clear chips or pills that can be removed individually

### Requirement: Tool Detail Panels
Selecting a tool MUST surface contextual metadata and quick actions without leaving the directory.

#### Scenario: Inline detail view exposes metadata and actions
- **GIVEN** a tool record includes fields for `name`, `url`, `description`, `category path`, and optional `notes`
- **WHEN** the user selects the tool from the list
- **THEN** an inline panel opens showing the metadata, the full category path (e.g., `Area & Event Monitoring › Live Monitoring › Transport › Maritime`), and the favicon or placeholder icon
- **AND** the panel provides quick actions to open the link in a new tab and copy the URL to the clipboard
- **AND** the panel surfaces related tags or similar tools based on shared categories where available

### Requirement: Research Shortlist Persistence
Users MUST be able to assemble a personal shortlist of tools that persists locally across sessions.

#### Scenario: Shortlist is saved to local storage
- **GIVEN** the UI includes a "Save to shortlist" toggle for each tool
- **WHEN** a user adds tools such as "Have I Been Pwned" and "Telegram Search" to the shortlist
- **THEN** those tools appear in a dedicated shortlist view with their metadata
- **AND** refreshing the browser or closing and reopening the app restores the shortlist from local storage
- **AND** users can remove items individually or clear the entire shortlist in one action

### Requirement: Dataset Coverage Overview
The directory MUST communicate dataset breadth so users can explore underrepresented areas of the stack.

#### Scenario: Category stats surface breadth of resources
- **GIVEN** the dataset includes 15 top-level categories with varying numbers of nested folders and tools
- **WHEN** the directory view loads
- **THEN** a summary header or sidebar shows counts of tools per top-level category (e.g., `Mapping: 17 tools`, `Reporting Tools: 9 tools`)
- **AND** selecting a category in the summary focuses the navigation tree on that branch
- **AND** summary counts update in real time when filters reduce the effective set
