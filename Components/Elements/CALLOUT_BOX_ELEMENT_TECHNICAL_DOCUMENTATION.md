# Callout Box Element — Technical Documentation

## Overview

A highlighted content callout component (internally: **Sidebar Component**) presenting supplementary information with a header, body text, optional image, and 4 visual styles including icon variants.

### Component Identifier
```javascript
"dataType": "sidebarComponent"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── sidebar/
        ├── sidebar.html                  ← AngularJS template
        ├── sidebar-settings-pannel.html  ← Settings panel
        ├── scripts/
        │   └── sidebar-directive.js      ← sidebarTemplate directive
        ├── styles/
        │   └── sidebar-template.css
        └── default/
            └── sidebar.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"sidebarComponent"` |
| `introductionText` | string | Header text (styles 1 & 2) |
| `paragraph` | string (HTML) | Body text (all styles) |
| `caption` | string | Image caption |
| `media` | object | Image source (`src`, `align`, `outline`) |
| `settings` | object | Display and style settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `layoutColorActive` | string | Active style: `"style1"`, `"style2"`, `"style3"`, `"style4"` |
| `placement` | string | Placement: `"left"`, `"right"`, `"full"` |
| `isHeaderVisible` | boolean | Show/hide header (styles 1 & 2) |
| `imagedisplay` | boolean | Show/hide embedded image |
| `captiondisplay` | boolean | Show/hide image caption |
| `headerBgColor` | string | Header background color |
| `sidebarBgColor` | string | Body background color |
| `sidebarStrokeColor` | string | Border/stroke color |
| `allowAutoColor` | boolean | Auto-color scheme (overrides manual) |
| `outline` | string | Outer border: `"outlineBg"` or `""` |
| `altText` | string | Image alt text |
| `style4Icons` | array | Available icons for style4 |
| `style4ActiveIcon` | number | Index of active icon (style4) |

---

## Style Variants

| Style | Description |
|---|---|
| **style1** | Header bar + body + optional image; border = `1px solid headerBgColor` |
| **style2** | Body + optional image only (no header bar) |
| **style3** | Pill/note icon + body text; icon: `Sidebar-Style-3-icon.png` |
| **style4** | Selectable icon + label text + body text |

> **Auto Color Mode:** When `allowAutoColor` is enabled, background becomes `rgb(244, 248, 233)` (green tint), overriding manual color settings.

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `sidebar-directive.js` | Core sidebarTemplate directive |
| `editprimarymedia` directive | Image upload |
| `floating-text` directive | Floating toolbar for caption |
| `editor/ngcontroller.js` | Compile and inject |
| `sidebar-template.css` | Component styles |
