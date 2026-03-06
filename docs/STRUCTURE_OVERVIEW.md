# Documentation Portal Structure

## Directory Organization

```
docs/
├── index.html                          # Main dashboard/landing page
├── assets/
│   ├── css/
│   │   ├── main.css                   # Core styling system
│   │   ├── sidebar.css                # Navigation sidebar styles
│   │   ├── markdown.css               # Markdown content styling
│   │   └── components.css             # Reusable component styles
│   ├── js/
│   │   ├── markdown-renderer.js       # Markdown parsing & rendering
│   │   ├── navigation.js              # Sidebar navigation logic
│   │   ├── router.js                  # Page routing & state
│   │   └── utils.js                   # Helper utilities
│   ├── images/
│   │   └── icons/                     # UI icons
│   └── libs/
│       └── marked.min.js              # Markdown parser library
├── templates/
│   ├── component-template.html        # Reusable component page
│   └── module-template.html           # Reusable module page
├── components/
│   ├── widgets/
│   │   ├── annotation.html
│   │   ├── carousel.html
│   │   ├── categorize.html
│   │   ├── clic.html
│   │   ├── click-to-reveal.html
│   │   ├── correction.html
│   │   ├── extended-response.html
│   │   ├── fib.html
│   │   ├── fib-with-image.html
│   │   ├── flashcard.html
│   │   ├── graphic-organizer.html
│   │   ├── group-activity.html
│   │   ├── highlighter.html
│   │   ├── image-labeling.html
│   │   ├── match-the-pairs.html
│   │   ├── mtp-multiple.html
│   │   ├── mcq.html
│   │   ├── question-answer.html
│   │   ├── sidebar.html
│   │   ├── sorting.html
│   │   ├── table-go.html
│   │   ├── true-false.html
│   │   └── word-search.html
│   ├── layout/
│   │   └── layout.html
│   └── elements/
│       └── elements.html
└── modules/
    └── overview.html

```

## Design Decisions

### 1. **Separation of Concerns**
- `/assets` - All static resources (CSS, JS, images)
- `/templates` - Reusable HTML templates
- `/components` - Individual component documentation pages
- `/modules` - Module-level documentation

### 2. **Naming Conventions**
- **Folders**: kebab-case (e.g., `click-to-reveal`)
- **Files**: kebab-case with descriptive names (e.g., `component-template.html`)
- **CSS Classes**: BEM methodology (e.g., `.sidebar__item--active`)
- **JavaScript**: camelCase for functions (e.g., `renderMarkdown()`)

### 3. **Scalability**
- Each component has its own HTML page
- Modular CSS files for easy maintenance
- Reusable JavaScript utilities
- No modification to original .md files

### 4. **User Experience**
- Dashboard serves as entry point
- Left sidebar for navigation
- Right panel for content
- Breadcrumb navigation
- Active state highlighting
- Responsive design

