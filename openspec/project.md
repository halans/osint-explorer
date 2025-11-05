# Project Context

## Purpose
An interactive web application that provides a curated, searchable directory of OSINT (Open Source Intelligence) tools and resources. The application helps journalists, investigators, and security researchers quickly discover and access relevant tools for their research and investigation workflows.

### Goals
- Transform static bookmark collections into an interactive, searchable interface
- Provide categorized access to OSINT tools across multiple domains (search engines, social media, archives, etc.)
- Enable quick discovery and filtering of tools based on use case
- Serve as a comprehensive reference for OSINT practitioners
- Support personal research workflows with bookmarking and organization features

## Tech Stack
- **Frontend Framework**: JavaScript (React/Vue/Svelte - TBD)
- **Build Tool**: Vite or similar modern bundler
- **Styling**: CSS-in-JS or Tailwind CSS
- **Data Source**: Initially from bookmarks.html, structured as JSON
- **State Management**: Context API or lightweight state library
- **Deployment**: Static hosting (Netlify, Vercel, or GitHub Pages)
- **Package Manager**: npm or pnpm

## Project Conventions

### Code Style
- ES6+ JavaScript with modern syntax
- Component-based architecture
- Functional components preferred over class components
- Descriptive variable and function names
- Comments for complex logic, especially around OSINT tool categorization
- Use async/await for asynchronous operations
- Consistent file naming: kebab-case for files, PascalCase for components

### Architecture Patterns
- **Component Structure**: Atomic design principles (atoms, molecules, organisms)
- **Data Flow**: Unidirectional data flow
- **Separation of Concerns**: UI components separate from business logic
- **Configuration**: Tool metadata stored in structured JSON format
- **Routing**: Client-side routing for different tool categories
- **Search**: Client-side search with category filters (no backend initially)

### Testing Strategy
- Unit tests for utility functions (search, filter, categorization logic)
- Component tests for UI interactions
- Integration tests for search and filter workflows
- Manual testing for UX flows
- Test framework: Jest or Vitest with Testing Library

### Git Workflow
- Main branch for production-ready code
- Feature branches for new functionality
- Descriptive commit messages following conventional commits
- PR reviews before merging to main
- Semantic versioning for releases

## Domain Context

### OSINT (Open Source Intelligence)
- Practice of collecting and analyzing publicly available information
- Used by journalists, security researchers, law enforcement, and investigators
- Tools span multiple categories:
  - **Search Engines**: General and specialized search (Google, Yandex, Baidu)
  - **Advanced Search**: Boolean operators, dorking techniques
  - **Social Media**: Platform-specific investigation tools
  - **Archives**: Historical website snapshots (Wayback Machine, Archive.is)
  - **Academic**: Scholarly research and literature mapping
  - **Media Search**: News and adverse media screening

### User Personas
1. **Journalists**: Investigating stories, verifying sources, finding background information
2. **General Investigators**: Private investigators, due diligence researchers
3. **Personal Users**: Hobbyists, students learning OSINT techniques

## Important Constraints

### Privacy & Security
- No user tracking or analytics without explicit consent
- No storage of user search queries
- Client-side only processing (no data sent to backend)
- Respect for tool providers' terms of service
- Clear disclaimers about legal and ethical use of OSINT tools

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Responsive design for mobile and desktop

### Performance
- Fast initial load time (< 3s on 3G)
- Efficient search and filter operations
- Minimal bundle size

## External Dependencies

### Tool Sources
- Curated from bookmarks.html bookmark export
- Ongoing manual curation of OSINT tool landscape
- Tool metadata includes: name, URL, category, description, use cases

### Third-Party Services (Optional Future Enhancements)
- Link validation service to check tool availability
- Screenshot service for tool previews
- API integrations with specific OSINT tools (if available)

### Data Format
- Bookmarks exported as Netscape HTML format
- Will be transformed to structured JSON for application use
- Schema: `{ name, url, category, subcategory, description, tags, icon }`
