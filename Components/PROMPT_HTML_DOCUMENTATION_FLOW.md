# Prompt: Generate HTML Documentation Flow from Authoring Components

Use this prompt with an AI assistant or documentation generator to create a single, navigable HTML documentation flow from all Markdown files under `Authoring_documents/authoring-documentation/Components/`.

---

## The Prompt (copy below)

```
Create a single-page or multi-page HTML documentation flow from ALL Markdown (.md) files in the Authoring Components documentation folder:

**Source:** Authoring_documents/authoring-documentation/Components/

**Scope:** Include every technical documentation and README file under:
- Components/AuthorTopBar/
- Components/Elements/ (all element docs: Audio, Callout Box, Header, HTML Interactivity, Image, Lesson Opener, Situation Header, Table, Text, Thumbs Card Header, Title, Video)
- Components/Layout/ (README, Technical Documentation, Quick Reference, Architecture Diagram)
- Components/TOC/
- Components/Widgets/ (every widget folder: Annotation, Categorize, Click to Reveal, CLIC, Correction, Extended Response about Media, Fill in the Blank, FIB with Image, Flashcard, Graphic Organizer, Group Activity, Highlighter, Match The Pairs, MTP Multiple, Question Answer, Sidebar, Sorting, Table GO, True and False, Word Search)
- Components/checklist/ (if applicable)

**Output requirements:**

1. **HTML structure**
   - Semantic HTML5: `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
   - Each major component (Layout, Elements, Widgets, TOC, AuthorTopBar) as a top-level section or linked page
   - Within each: sub-sections for each doc (e.g., Word Search, Click to Reveal) with full content converted from Markdown

2. **Content conversion**
   - Convert Markdown to HTML: headings (h1–h6), paragraphs, lists (ul/ol), code blocks (`<pre><code>` with language class), blockquotes, tables (`<table>`, `<thead>`, `<tbody>`)
   - Preserve ASCII/Mermaid-style diagrams as `<pre>` or render Mermaid if you support it; otherwise keep as preformatted text
   - Internal anchor links: convert `#section-id` to same-page or cross-page anchors so the Table of Contents in each doc still works

3. **Navigation**
   - A global sidebar or top nav listing:
     - Layout (with sub-links to README, Technical Doc, Quick Reference, Architecture)
     - Elements (with sub-links to each element doc)
     - Widgets (with sub-links to each widget doc)
     - TOC, AuthorTopBar
   - Breadcrumbs: e.g. "Components > Widgets > Word Search"
   - "Back to top" or "Back to index" where useful

4. **Flow and hierarchy**
   - Order: Layout first (foundation), then Elements, then Widgets, then TOC/AuthorTopBar (or as per README recommended reading order)
   - Each component doc should appear in logical order; within a doc preserve the original Table of Contents order (Overview, File Structure, Architecture, Data Model, etc.)

5. **Styling (optional but recommended)**
   - Clean, readable typography and spacing
   - Sticky or fixed sidebar for nav
   - Print-friendly (e.g. hide nav in print or show simplified TOC)
   - Optional: light/dark theme or match existing KITABOO docs style

6. **Deliverable**
   - Either: one HTML file with in-page anchors and a nav that jumps to each component section
   - Or: an index HTML that links to separate HTML files per component/category (e.g. layout.html, elements.html, widgets-wordsearch.html)
   - Preserve all technical detail: file paths, code snippets, data models, known issues, recommendations

Do not summarize or shorten the docs; convert the full content so the HTML flow is a complete, navigable replacement for reading the raw MD files.
```

---

## Shorter variant (quick copy)

```
Using all .md files under Authoring_documents/authoring-documentation/Components/ (Layout, Elements, Widgets, TOC, AuthorTopBar, checklist), generate a single navigable HTML documentation flow. Convert every Markdown file to HTML with correct headings, code blocks, and tables. Add a global sidebar/top nav for Layout, Elements (each element), and Widgets (each widget). Preserve full content and internal links; order by Layout → Elements → Widgets → TOC/AuthorTopBar. Output one index HTML with in-page sections or multiple HTML files linked from the index.
```

---

## File list reference (for verification)

Ensure the generator includes at least these docs:

| Category   | Files |
|-----------|--------|
| **Layout** | README.md, LAYOUT_COMPONENT_TECHNICAL_DOCUMENTATION.md, LAYOUT_QUICK_REFERENCE.md, LAYOUT_ARCHITECTURE_DIAGRAM.md |
| **AuthorTopBar** | AUTHOR_TOP_BAR_TECHNICAL_DOCUMENTATION.md |
| **TOC** | TOC_COMPONENT_TECHNICAL_DOCUMENTATION.md |
| **Elements** | VIDEO_ELEMENT, IMAGE_ELEMENT, HTML_INTERACTIVITY_ELEMENT, AUDIO_ELEMENT, TABLE_ELEMENT, SITUATION_HEADER_ELEMENT, CALLOUT_BOX_ELEMENT, THUMBS_CARD_HEADER_ELEMENT, TEXT_ELEMENT, HEADER_ELEMENT, LESSON_OPENER_ELEMENT, TITLE_ELEMENT (all *_TECHNICAL_DOCUMENTATION.md) |
| **Widgets** | FIB, True and False, Group Activity, CLIC, Categorize, Click to Reveal, Extended Response (ITC), Table GO, MTP Multiple, Annotation, Graphic Organizer, Flashcard, Question Answer (Short/Long), Word Search, Sidebar, Match The Pairs, Sorting, Correction, Highlighter, FIB with Image (each folder’s TECHNICAL_DOCUMENTATION or equivalent .md) |
| **Checklist** | POST_MERGE_STAGING_VALIDATION.md |

Use this prompt with your AI or tool to produce the HTML flow. Adjust the path if your workspace root differs.
