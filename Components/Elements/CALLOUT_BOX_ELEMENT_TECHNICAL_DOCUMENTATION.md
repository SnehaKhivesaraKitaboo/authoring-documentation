# Callout Box Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Callout Types & Visual Variants](#callout-types--visual-variants)
6. [Editor Mode Implementation](#editor-mode-implementation)
7. [Settings Panel Reference](#settings-panel-reference)
8. [Authoring Flow](#authoring-flow)
9. [Preview Mode Behavior](#preview-mode-behavior)
10. [Integration & Dependencies](#integration--dependencies)
11. [CSS Reference](#css-reference)
12. [Known Behaviors & Notes](#known-behaviors--notes)
13. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Callout Box Element** (`dataType: "callout-box"`) is a highlighted information box component used to draw attention to important notes, tips, warnings, and cautions within lesson content. Authors select a semantic callout type (Note, Tip, Warning, Caution) which presets the color scheme and icon. All colors can be further customized, and the body supports rich text formatting via the floating toolbar.

### Key Capabilities

- 4 semantic callout types: **Note**, **Tip**, **Warning**, **Caution**
- Each type presets: background color, border accent color, and icon
- **Custom color overrides** — author can override preset colors
- Optional **icon display** (type-specific icon, can be hidden)
- Optional **title text** (contenteditable, can be hidden)
- **Rich text body** — floating text toolbar for formatting
- Outline border with configurable background
- Full-width layout within its container

### Component Identifier

```javascript
"dataType": "callout-box"
```

### Component Registration (config.js)

```javascript
{
  name: "Callout Box",
  dataType: "callout-box",
  url: "templates/callout-box/callout-box.html",
  json: "templates/callout-box/default/callout-box.json",
  settingsURL: "templates/callout-box/callout-box-settings.html",
  iconClass: "icon-callout-box"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      KITABOO Authoring Tool                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ──────────► ngcontroller.js ──────► $compile              │
│  (dataType:            (drag-drop)             (canvas inject)       │
│  "callout-box")              │                                       │
│                              ▼                                       │
│         ┌──────────────────────────────────────────────┐             │
│         │  callout-box.html (Canvas Template)           │             │
│         │  [calloutBoxTemplate directive]               │             │
│         │  Icon | Title | Body (contenteditable)        │             │
│         └──────────────────────────────────────────────┘             │
│                   │                    │                             │
│                   ▼                    ▼                             │
│      ┌──────────────────────┐  ┌────────────────────────────────┐   │
│      │ callout-box-         │  │ callout-box-settings.html      │   │
│      │ directive.js         │  │ (Settings Panel)               │   │
│      └──────────────────────┘  └────────────────────────────────┘   │
│                   │                    │                             │
│                   ▼                    ▼                             │
│          fieldData              Settings Controls:                   │
│          - title                 - Type selector (Note/Tip/Warn/Caut)│
│          - body (HTML)           - Show Icon toggle                  │
│          - settings.calloutType  - Show Title toggle                 │
│          - settings.bgColor      - Background Color picker           │
│          - settings.borderColor  - Border Color picker               │
│          - settings.showIcon     - Outline radio                     │
│                                                                      │
│                   │                                                  │
│                   ▼                                                  │
│       ┌──────────────────────────────────────────┐                   │
│       │  floatingTextPanel.js (Shared Toolbar)    │                   │
│       │  Activates on body text selection         │                   │
│       └──────────────────────────────────────────┘                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── callout-box/
        ├── callout-box.html             ← AngularJS canvas template
        ├── callout-box-settings.html    ← Settings panel
        ├── scripts/
        │   └── callout-box-directive.js ← calloutBoxTemplate directive
        ├── styles/
        │   └── callout-box-template.css ← Component-specific styles
        └── default/
            └── callout-box.json         ← Default configuration
```

### `callout-box.json` — Default Configuration

```json
{
  "identifier": "callout-box",
  "title": "Note",
  "body": "<p>Enter your note content here...</p>",
  "settings": {
    "calloutType": "note",
    "iconClass": "icon-callout-note",
    "showIcon": true,
    "showTitle": true,
    "bgColor": "#e8f4f8",
    "borderColor": "#2196F3",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "metaTags": [],
    "dimensionInfo": []
  }
}
```

---

## Data Model

### Root-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"callout-box"` | Component type identifier |
| `title` | string | `"Note"` | Callout box title (contenteditable plain text) |
| `body` | string (HTML) | `"<p>...</p>"` | Body content — stores raw HTML |
| `settings` | object | `{}` | All display and style settings |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `calloutType` | string | `"note"` | Semantic type: `"note"` / `"tip"` / `"warning"` / `"caution"` |
| `iconClass` | string | `"icon-callout-note"` | CSS class for icon font character |
| `showIcon` | boolean | `true` | Show/hide icon before title |
| `showTitle` | boolean | `true` | Show/hide title text |
| `bgColor` | string | `"#e8f4f8"` | Box background color |
| `borderColor` | string | `"#2196F3"` | Left accent border color |
| `outline` | string | `""` | Outer border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Outer border background |
| `metaTags` | array | `[]` | Content search metadata |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### Complete fieldData Example — Warning Type

```json
{
  "identifier": "callout-box",
  "title": "Important Warning",
  "body": "<p>Do not modify the configuration files directly. Always use the admin panel to make changes.</p><p><strong>Modifying files directly may cause system failures.</strong></p>",
  "settings": {
    "calloutType": "warning",
    "iconClass": "icon-callout-warning",
    "showIcon": true,
    "showTitle": true,
    "bgColor": "#fff3cd",
    "borderColor": "#FF9800",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "metaTags": ["warning", "important", "caution"],
    "dimensionInfo": []
  }
}
```

---

## Callout Types & Visual Variants

### Type Presets

| Type | `calloutType` | Default `bgColor` | Default `borderColor` | Default `iconClass` | Semantic Use |
|---|---|---|---|---|---|
| **Note** | `"note"` | `#e8f4f8` (light blue) | `#2196F3` (blue) | `icon-callout-note` | General information |
| **Tip** | `"tip"` | `#e8f5e9` (light green) | `#4CAF50` (green) | `icon-callout-tip` | Helpful advice |
| **Warning** | `"warning"` | `#fff3cd` (light amber) | `#FF9800` (orange) | `icon-callout-warning` | Caution/alert |
| **Caution** | `"caution"` | `#fde8e8` (light red) | `#F44336` (red) | `icon-callout-caution` | Critical danger |

### Visual Reference

```
NOTE (blue):
┌─────────────────────────────────────────────────────┐
│ ℹ  Note                                              │ ← light blue bg
│ ─────────────────────────────────────────────────── │ ← blue left border
│  This is an informational note for the reader.      │
└─────────────────────────────────────────────────────┘

TIP (green):
┌─────────────────────────────────────────────────────┐
│ 💡 Pro Tip                                           │ ← light green bg
│                                                     │ ← green left border
│  Try the keyboard shortcut Ctrl+Z to undo.          │
└─────────────────────────────────────────────────────┘

WARNING (orange):
┌─────────────────────────────────────────────────────┐
│ ⚠  Warning                                           │ ← light amber bg
│                                                     │ ← orange left border
│  Back up your data before proceeding.               │
└─────────────────────────────────────────────────────┘

CAUTION (red):
┌─────────────────────────────────────────────────────┐
│ 🛑 Caution                                           │ ← light red bg
│                                                     │ ← red left border
│  This action cannot be undone.                      │
└─────────────────────────────────────────────────────┘
```

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<div class="component-holder callout-box-container" callout-box-template>

  <div class="callout-box {{fieldData.settings.calloutType}} {{fieldData.settings.outline}}"
       ng-style="{
         'background-color': fieldData.settings.bgColor,
         'border-left-color': fieldData.settings.borderColor,
         'background-color': fieldData.settings.outlineBgColor
       }">

    <!-- Header: Icon + Title -->
    <div class="callout-header">
      <!-- Icon -->
      <span class="callout-icon {{fieldData.settings.iconClass}}"
            ng-if="fieldData.settings.showIcon">
      </span>

      <!-- Title -->
      <span class="callout-title"
            ng-if="fieldData.settings.showTitle"
            contenteditable="true"
            ng-model="fieldData.title">
      </span>
    </div>

    <!-- Body — rich text -->
    <div class="callout-body"
         contenteditable="true"
         ng-model="fieldData.body">
    </div>

  </div>

</div>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `setCalloutType(type)` | `type: string` | Updates `calloutType`, presets `bgColor`, `borderColor`, `iconClass` |
| `toggleIcon()` | none | Toggles `showIcon` (ng-if on icon span) |
| `toggleTitle()` | none | Toggles `showTitle` (ng-if on title span) |
| `setBgColor(color)` | `color: string` | Custom override for `bgColor` |
| `setBorderColor(color)` | `color: string` | Custom override for `borderColor` |
| `setOutline(val)` | `val: string` | Updates `outline` class |
| `setOutlineColor(color)` | `color: string` | Updates `outlineBgColor` |

### Type Preset Application

```javascript
// Called when author selects a callout type
function setCalloutType(type) {
  var presets = {
    note:    { bgColor: '#e8f4f8', borderColor: '#2196F3', iconClass: 'icon-callout-note' },
    tip:     { bgColor: '#e8f5e9', borderColor: '#4CAF50', iconClass: 'icon-callout-tip' },
    warning: { bgColor: '#fff3cd', borderColor: '#FF9800', iconClass: 'icon-callout-warning' },
    caution: { bgColor: '#fde8e8', borderColor: '#F44336', iconClass: 'icon-callout-caution' }
  };

  fieldData.settings.calloutType = type;
  // Apply presets — these CAN be overridden by author after
  fieldData.settings.bgColor     = presets[type].bgColor;
  fieldData.settings.borderColor = presets[type].borderColor;
  fieldData.settings.iconClass   = presets[type].iconClass;
}
```

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Callout Type** | Button group (4 types) | `fieldData.settings.calloutType` | `"note"` / `"tip"` / `"warning"` / `"caution"` — presets colors |
| **Show Icon** | Toggle | `fieldData.settings.showIcon` | Removes icon from DOM (ng-if) |
| **Show Title** | Toggle | `fieldData.settings.showTitle` | Removes title from DOM (ng-if) |
| **Background Color** | Color picker | `fieldData.settings.bgColor` | Hex; custom override of type preset |
| **Border / Accent Color** | Color picker | `fieldData.settings.borderColor` | Hex; custom override of type preset |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Background Color (outline)** | Color picker | `fieldData.settings.outlineBgColor` | Hex; visible when outline active |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Callout Box element from Elements panel onto canvas
       ↓
2. Component renders with default "Note" type (blue theme)
   Default title: "Note" | Default body: placeholder text
       ↓
3. Author selects callout type in settings panel:
   Note / Tip / Warning / Caution
   → Type preset applied: bgColor, borderColor, iconClass
       ↓
4. Author optionally customizes colors:
   - Background Color picker (override preset)
   - Border/Accent Color picker (override preset)
       ↓
5. Author edits title in canvas (click on title text → contenteditable)
   Types new title text (e.g., "Pro Tip" / "Important Warning")
       ↓
6. Author edits body in canvas:
   Click on body area → contenteditable activates
   Select text → floatingTextPanel toolbar appears
   Apply formatting (bold, italic, list, etc.)
       ↓
7. Author optionally:
   - Toggles Show Icon (hides/shows icon)
   - Toggles Show Title (hides/shows title area)
       ↓
8. Save → fieldData persisted (title string + body HTML)
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Title editing | Contenteditable active | Read-only |
| Body editing | Contenteditable active | Read-only |
| Floating toolbar | Shows on text selection | Hidden |
| Settings panel | Accessible | Hidden |
| Colors/icons | Applied | Applied (same rendering) |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `callout-box-directive.js` | Core directive `calloutBoxTemplate` | Type preset management |
| `editor/floatingTextPanel.js` | Shared floating toolbar for body | Activates on body text selection |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on title and body | |
| `callout-box-template.css` | Callout box visual styles | Component-specific |
| Authoring icon font | Icon rendering (`.icon-callout-*`) | Icon font must be loaded |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.callout-box-container` | Root wrapper |
| `.callout-box` | Main callout box container |
| `.callout-box.note` | Note type class (informational) |
| `.callout-box.tip` | Tip type class |
| `.callout-box.warning` | Warning type class |
| `.callout-box.caution` | Caution type class |
| `.callout-header` | Icon + title row |
| `.callout-icon` | Icon span (font-based icon) |
| `.callout-title` | Title text span |
| `.callout-body` | Rich text body area |

### Base CSS Pattern

```css
.callout-box {
  border-left: 4px solid;     /* accent border — color set via ng-style */
  border-radius: 4px;
  padding: 12px 16px;
  /* background-color set via ng-style */
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.callout-icon {
  font-size: 20px;
  /* icon character rendered via authoring icon font */
}

.callout-title {
  font-weight: bold;
  font-size: 1rem;
}

.callout-body {
  line-height: 1.6;
}
```

---

## Known Behaviors & Notes

1. **Type selection applies presets but does NOT reset overrides**: If author selects "Note" → sets a custom blue shade → then changes to "Tip", the green preset IS applied. But if they had customized "Tip" colors previously and re-select "Tip", the preset values are re-applied, overwriting the customization. This is intentional — type selection always resets to presets.

2. **Body stores raw HTML**: `fieldData.body` stores HTML markup from the floating toolbar. Same risks as the Text element — no sanitization at component level. Platform-level sanitization must be relied upon.

3. **Title is plain text**: `fieldData.title` is a plain text string (no HTML) stored via contenteditable without the floating toolbar. Authors cannot format the title text.

4. **`showIcon=false` uses ng-if**: The icon is removed from the DOM entirely (not just hidden). This means there is no CSS space reserved for the icon when hidden — the title text shifts left.

5. **`showTitle=false` uses ng-if**: The entire title span is removed. Combined with `showIcon=false`, the callout header row becomes empty, which may cause layout issues — verify CSS handles this gracefully.

6. **Full-width layout**: The callout box is block-level and full-width within its container. It cannot be made inline or given a custom width through the settings panel.

7. **Floating toolbar activates on body**: The `floatingTextPanel.js` registers on the body contenteditable. Formatting changes (bold, lists, links) inside the body are stored as HTML inside `fieldData.body`.

8. **`outlineBgColor` is a SECOND background**: There are two background color fields — `bgColor` (inner callout box) and `outlineBgColor` (outer outline wrapper). These are separate, applied via different `ng-style` bindings.

9. **Icon font dependency**: The icons (ℹ, 💡, ⚠, 🛑) are rendered via the platform's custom authoring icon font using CSS classes like `.icon-callout-note`. If the icon font fails to load, icons appear as empty boxes or placeholder characters.

10. **No SCORM**: Content display only — no student interaction tracking.

---

## Checklist for Implementation

### For Authors
- [ ] Select the correct callout type for semantic meaning (Note/Tip/Warning/Caution)
- [ ] Update title text to be specific (not just "Note" — use "Important Note" or similar)
- [ ] Use rich text formatting in body for clarity (bold key terms, use lists for steps)
- [ ] Use Warning for reversible concerns, Caution for irreversible/dangerous actions
- [ ] Verify colors meet accessibility contrast requirements (WCAG AA: 4.5:1 text contrast)

### For Developers
- [ ] Verify authoring icon font loaded before component renders
- [ ] Confirm type preset function applies all 3 preset values (bgColor, borderColor, iconClass)
- [ ] Test custom color overrides persist after type change (presets should override, not merge)
- [ ] Verify `showIcon` and `showTitle` ng-if DOM removal doesn't break header layout
- [ ] Test floating toolbar activates on body area (not title area)
- [ ] Confirm `fieldData.body` stores HTML and renders via `ng-bind-html` in reader
- [ ] Verify outline border and inner bg are separate ng-style applications
