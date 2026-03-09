# Header Element — Technical Documentation

## Overview

The Header element provides semantic section headings (H2–H6) within page content, with 4 visual styles and optional decorative icons.

### Component Identifier
```javascript
"dataType": "header"
```

### Key Capabilities
- Semantic heading levels: H2, H3, H4, H5, H6, and Subtitle (p)
- 4 visual style cards (card-style-1 to card-style-4)
- 7 optional decorative icon shapes (card-style-4 only)
- Custom accent/border color
- Inline contenteditable text
- Apply All / Ignore Apply All
- TOC integration (`tocTextContent` class)

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── header-component/
        ├── header.html                      ← AngularJS template
        ├── header-settings-panel.html       ← Settings panel
        ├── scripts/
        │   └── header-component.js          ← headerComponent directive
        ├── styles/
        │   └── header-component-template.css
        └── default/
            └── headerComponent.json
```

---

## Data Model

### Root-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"header-component"` | Component type identifier |
| `headerDataText` | string | `""` | Heading text content |
| `ignoreApplyAll` | boolean | `false` | Exclude from Apply All |
| `settings` | object | — | Style and display settings |

### settings Object

| Field | Type | Default | Description |
|---|---|---|---|
| `headerClassData` | string | `"h2-style"` | Semantic level: `h2-style`, `h3-style`, `h4-style`, `h5-style`, `h6-style`, `sub-2-style` |
| `styleClass` | string | `"card-style-3"` | Visual style (card-style-1..4) |
| `componentColor` | string | `"#000000"` | Accent/border color |
| `iconClass` | string | `"icon-Title-Style_Shape-1"` | Active icon shape |
| `iconClassGroup` | array | 7 shapes | Available icon shapes |
| `style_tab` | array | 4 styles | Style picker thumbnails |

---

## Style Variants

| Style | Description |
|---|---|
| `card-style-1` | Border-bottom accent line |
| `card-style-2` | Left border accent bar |
| `card-style-3` | Clean text (default, no decoration) |
| `card-style-4` | Icon + text layout |

### Heading Levels

| `headerClassData` | HTML Element |
|---|---|
| `h2-style` | `<h2>` |
| `h3-style` | `<h3>` |
| `h4-style` | `<h4>` |
| `h5-style` | `<h5>` |
| `h6-style` | `<h6>` |
| `sub-2-style` | `<p>` (subtitle) |

> **Note:** The decorative icon is only rendered when `styleClass == 'card-style-4'`.

---

## Template Pattern

The template uses `ng-if` to render the correct semantic element:

```html
<h2 ng-if="fieldData.settings.headerClassData == 'h2-style'"
    ng-model="fieldData.headerDataText" contenteditable="true"
    class="header-data tocTextContent ...">
</h2>
<!-- ...h3, h4, h5, h6, p for each level -->
```

All heading variants share `ng-model="fieldData.headerDataText"`, so switching level preserves the text.

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/ngcontroller.js` | Compile and inject template |
| `editor/ngdragdrop.js` | Drag-drop from Elements panel |
| `editor/sd.js` | JSON serialization |
| `editor/contenteditable-ng-model-directive.js` | Contenteditable ng-model binding |
| `header-component-template.css` | Component-specific styles |
