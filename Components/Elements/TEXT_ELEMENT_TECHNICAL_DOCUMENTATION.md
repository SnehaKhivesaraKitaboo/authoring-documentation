# Text (Paragraph) Element — Technical Documentation

## Overview

The Text element is the primary rich-text body content component, supporting body paragraphs, blockquotes, pull-quotes, inline images, label types, paragraph numbers, and math equations via a floating text toolbar.

### Component Identifier
```javascript
"dataType": "paragraph"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── paragraph/
        ├── paragraph.html              ← AngularJS template
        ├── paragraph_settings.html     ← Settings panel
        ├── scripts/
        │   ├── paragraph-directive.js  ← paragraphTemplate directive
        │   └── paragraph-preview1.js   ← Preview/reader mode handler
        └── default/
            └── paragraph.json
```

---

## Data Model

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"paragraph"` | Component type |
| `header` | string (HTML) | `""` | Main body content (rich HTML) |
| `authorName` | string | `""` | Blockquote attribution text |
| `question` | string | `""` | Primary label question text |
| `secondaryQuestion` | string | `""` | Secondary label question text |
| `ignoreApplyAll` | boolean | `false` | Exclude from Apply All |
| `settings` | object | — | Display and layout settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `classparagraphg1` | string | Base paragraph style class |
| `classparagraphg2` | string | Variant: `"blockquote"`, `"pull-quote"` |
| `classparagraphg3` | string | Additional modifier class |
| `paragrahNumberShow` | boolean | Show paragraph number badge |
| `paragrahNumber` | string | Paragraph number text |
| `isLabelTypeParagraph` | boolean | Show question label overlay |
| `labelType` | string | `"primary"` or `"secondary"` |
| `allowAuthorName` | boolean | Show author attribution (blockquote only) |

---

## Style Variants

| Variant | Description |
|---|---|
| Standard | Default body text paragraph |
| `blockquote` | Styled blockquote with optional author attribution |
| `pull-quote` | Large highlighted emphasis text |
| Inline Image | Text wraps around embedded inline image (`splitParagraph`) |

## Label Types

| Type | Description |
|---|---|
| None | Standard paragraph |
| Primary | Question label with number badge (e.g., "Q1.") |
| Secondary | Sub-question or alternative label style |

---

## Floating Text Toolbar

The Text element activates the shared `floatingTextPanel.js` toolbar on text selection, providing:
- Bold, Italic, Underline, Strikethrough
- Font family, font size
- Text color, background color
- Alignment (left, center, right, justify)
- Ordered/unordered lists
- Hyperlinks
- Superscript / Subscript
- Math equations (MathJax)
- Inline image upload

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/floatingTextPanel.js` | Shared floating rich-text toolbar |
| `editor/contenteditable-ng-model-directive.js` | ng-model for contenteditable |
| `paragraph-preview1.js` | Preview/reader rendering |
| `css/authoring/floatingTextPanel.css` | Toolbar styles |

> **Content Storage:** `fieldData.header` stores raw HTML. Save/load must handle HTML encoding carefully.
