# Lesson Opener Components Element — Technical Documentation

## Overview

A multi-style lesson introduction component with 4 predefined prompt types — Learning Prompt, Make a Connection, My Learning Goals, and Key Terms — each with a unique icon, fixed label, color scheme, and editable body text.

### Component Identifier
```javascript
"dataType": "lessonOpenerComponent"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── lessonOpener/
        ├── lessonOpener.html                ← AngularJS template
        ├── lessonOpener-setting-panel.html  ← Settings panel
        ├── scripts/
        │   └── lessonOpener-directive.js    ← lessonOpenerTemplate directive
        ├── styles/
        │   └── lessonOpener-template.css
        └── default/
            └── lessonOpener.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"lessonOpenerComponent"` |
| `paragraph` | string (HTML) | Body text (shared across all styles) |
| `settings` | object | Display and style settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `layoutColorActive` | string | Style: `"style1"`, `"style2"`, `"style3"`, `"style4"` |
| `placement` | string | `"left"`, `"right"`, `"full"` |
| `sidebarBgColor` | string | Body background color |
| `sidebarStrokeColor` | string | Border color |
| `headerBgColor` | string | Overlay background (when auto-color) |
| `allowAutoColor` | boolean | Use auto-color scheme |
| `outline` | string | Outer border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Outline background color |

---

## Component Types

| Style | Label | Icon | Default Stroke |
|---|---|---|---|
| `style1` | "Learning Prompt" | `lessonOpener-Icon_1.svg` | `#00B673` (green) |
| `style2` | "Make a Connection" | `lessonOpener-Icon_2.svg` | `#EC9511` (orange) |
| `style3` | "My Learning Goals" | `starIcon.svg` | `#2E1984` (purple) |
| `style4` | "Key Terms" | `keyTerm.svg` | `#2E1984` (purple) |

> **Fixed Labels:** The text labels are hard-coded in the HTML template — not editable by the author. Only `fieldData.paragraph` (body text) is editable.

---

## Template Pattern

The template uses `ng-if` to render the correct style section:

```html
<!-- style1: Learning Prompt -->
<section ng-if="fieldData.settings.layoutColorActive == 'style1'"
  ng-style="{'background-color': sidebarBgColor, 'border-color': sidebarStrokeColor || '#00B673'}">
  <img src="images/lessonOpener-Icon_1.svg" alt="Learning Prompt Icon">
  <span class="sidebarHeaderText">Learning Prompt</span>
  <div contenteditable="true" ng-model="fieldData.paragraph" ...></div>
</section>

<!-- style2: Make a Connection -->
<section ng-if="fieldData.settings.layoutColorActive == 'style2'" ...>
  <img src="images/lessonOpener-Icon_2.svg" ...>
  <span>Make a Connection</span>
  <div contenteditable="true" ng-model="fieldData.paragraph" ...></div>
</section>
<!-- ...style3, style4 -->
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `lessonOpener-directive.js` | Core directive |
| `editor/floatingTextPanel.js` | Rich-text toolbar for body text |
| `editor/ngcontroller.js` | Compile and inject |
| `lessonOpener-template.css` | Component styles |
| `lessonOpener-Icon_1.svg`, `lessonOpener-Icon_2.svg` | Style 1 & 2 icons |
| `starIcon.svg` | Style 3 (My Learning Goals) icon |
| `keyTerm.svg` | Style 4 (Key Terms) icon |
