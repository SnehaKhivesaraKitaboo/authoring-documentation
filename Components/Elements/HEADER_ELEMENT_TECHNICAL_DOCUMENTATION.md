# Header Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants](#style-variants)
6. [Heading Levels](#heading-levels)
7. [Editor Mode Implementation](#editor-mode-implementation)
8. [Settings Panel Reference](#settings-panel-reference)
9. [TOC Integration](#toc-integration)
10. [Apply All System](#apply-all-system)
11. [Authoring Flow](#authoring-flow)
12. [Preview Mode Behavior](#preview-mode-behavior)
13. [Integration & Dependencies](#integration--dependencies)
14. [CSS Reference](#css-reference)
15. [Known Behaviors & Notes](#known-behaviors--notes)
16. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Header Element** (`dataType: "header"`) provides semantic section headings within page content. Authors select from H2–H6 heading levels and a subtitle `<p>` variant, choosing from 4 visual styles: plain text, border-bottom line, left accent bar, and icon-decorated heading. The heading text is displayed in the TOC panel via the `.tocTextContent` class and participates in the Apply All styling system.

### Key Capabilities

- Semantic heading levels: H2, H3, H4, H5, H6, and Subtitle (`<p>` tag)
- 4 visual style cards (`card-style-1` through `card-style-4`)
- 7 optional decorative icon shapes (card-style-4 only)
- Custom accent / border / icon color via color picker
- Inline contenteditable text editing
- **Apply All** / **Ignore Apply All** toggle for bulk style management
- **TOC integration** — heading text appears in the TOC chapter list
- Full heading text preserved when switching levels or styles

### Component Identifier

```javascript
"dataType": "header"
```

### Component Registration (config.js)

```javascript
{
  name: "Header",
  dataType: "header",
  url: "templates/header-component/header.html",
  json: "templates/header-component/default/headerComponent.json",
  settingsURL: "templates/header-component/header-settings-panel.html",
  iconClass: "icon-heading"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        KITABOO Authoring Tool                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ──────────► ngcontroller.js ──────► $compile              │
│  (dataType:"header")     (drag-drop)           (canvas inject)       │
│                               │                                      │
│                               ▼                                      │
│              ┌────────────────────────────────┐                      │
│              │  header.html (Canvas Template)  │                      │
│              │  [headerComponent directive]    │                      │
│              │  ng-if per heading level        │                      │
│              └────────────────────────────────┘                      │
│                      │                │                              │
│                      ▼                ▼                              │
│        ┌─────────────────┐  ┌──────────────────────┐                │
│        │ header-component│  │ header-settings-     │                │
│        │    .js          │  │  panel.html           │                │
│        │ (directive)     │  │ (Settings Panel)      │                │
│        └─────────────────┘  └──────────────────────┘                │
│               │                       │                              │
│               ▼                       ▼                              │
│        fieldData (savedJson)   Settings Controls:                    │
│        - headerDataText         - Style picker (4 cards)             │
│        - headerClassData        - Level dropdown (H2–H6)             │
│        - styleClass             - Color picker                       │
│        - componentColor         - Icon grid (style-4 only)           │
│        - iconClass              - ignoreApplyAll checkbox            │
│        - ignoreApplyAll         - Meta Tags                          │
│                                                                      │
│               │                                                      │
│               ▼                                                      │
│  ┌────────────────────────────────────────────────┐                 │
│  │   TOC Sync (saveTOCtoBackend)                  │                 │
│  │   Scans .tocTextContent → updates TOC panel    │                 │
│  └────────────────────────────────────────────────┘                 │
│               │                                                      │
└───────────────┼──────────────────────────────────────────────────────┘
                ▼
   ┌─────────────────────────────────────────┐
   │         KITABOO Reader                  │
   │  - Renders semantic heading (h2–h6)     │
   │  - Applies style + icon CSS classes     │
   │  - Navigation anchor for TOC            │
   └─────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── header-component/
        ├── header.html                       ← Canvas AngularJS template
        ├── header-settings-panel.html        ← Right-side settings panel
        ├── scripts/
        │   └── header-component.js           ← headerComponent directive
        ├── styles/
        │   └── header-component-template.css ← Component-specific styles
        └── default/
            └── headerComponent.json          ← Default configuration
```

### File Descriptions

#### `header.html` — Canvas Template
- **Purpose**: Rendered HTML on the authoring canvas
- **Key pattern**: One `ng-if` block per heading level (h2 through h6 + p)
- **All share**: `ng-model="fieldData.headerDataText"` — text preserved across level switches
- **Classes**: `header-data tocTextContent {{styleClass}} {{iconClass}}`
- **Color**: `ng-style="{'color': fieldData.settings.componentColor}"`

#### `header-settings-panel.html` — Settings Panel
- **Purpose**: Right-side panel shown when heading is selected on canvas
- **Sections**: Style thumbnails, Level selector, Color picker, Icon grid, Apply All checkbox, Meta Tags

#### `header-component.js` — Directive
- **Purpose**: AngularJS directive `headerComponent` — handles style changes, color updates, icon selection
- **Key functions**: `changeStyle()`, `changeLevel()`, `changeColor()`, `changeIcon()`, `toggleApplyAll()`

#### `headerComponent.json` — Default Configuration
```json
{
  "identifier": "header-component",
  "headerDataText": "Section Heading",
  "ignoreApplyAll": false,
  "settings": {
    "headerClassData": "h2-style",
    "styleClass": "card-style-3",
    "componentColor": "#000000",
    "iconClass": "icon-Title-Style_Shape-1",
    "iconClassGroup": [
      "icon-Title-Style_Shape-1",
      "icon-Title-Style_Shape-2",
      "icon-Title-Style_Shape-3",
      "icon-Title-Style_Shape-4",
      "icon-Title-Style_Shape-5",
      "icon-Title-Style_Shape-6",
      "icon-Title-Style_Shape-7"
    ],
    "style_tab": [
      { "id": "card-style-1", "active": false },
      { "id": "card-style-2", "active": false },
      { "id": "card-style-3", "active": true },
      { "id": "card-style-4", "active": false }
    ],
    "dimensionInfo": [],
    "metaTags": []
  }
}
```

---

## Data Model

### Root-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"header-component"` | Component type identifier |
| `headerDataText` | string | `"Section Heading"` | Heading text content (shared across all levels) |
| `ignoreApplyAll` | boolean | `false` | `true` = exclude this instance from Apply All |
| `settings` | object | `{}` | All style and display settings |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `headerClassData` | string | `"h2-style"` | Heading level: `h2-style` `h3-style` `h4-style` `h5-style` `h6-style` `sub-2-style` |
| `styleClass` | string | `"card-style-3"` | Visual style: `card-style-1` `card-style-2` `card-style-3` `card-style-4` |
| `componentColor` | string | `"#000000"` | Accent color for border, icon, or text decoration |
| `iconClass` | string | `"icon-Title-Style_Shape-1"` | Active icon shape (used when `styleClass = card-style-4`) |
| `iconClassGroup` | array | 7 strings | All available icon shape class names |
| `style_tab` | array | 4 objects | Style picker state (which thumbnail is active) |
| `dimensionInfo` | array | `[]` | Inline image dimension tracking |
| `metaTags` | array | `[]` | Metadata keywords for content search |

### Complete fieldData Example

```json
{
  "identifier": "header-component",
  "headerDataText": "Chapter 2: Understanding Climate Systems",
  "ignoreApplyAll": false,
  "settings": {
    "headerClassData": "h2-style",
    "styleClass": "card-style-2",
    "componentColor": "#2563EB",
    "iconClass": "icon-Title-Style_Shape-3",
    "iconClassGroup": [
      "icon-Title-Style_Shape-1",
      "icon-Title-Style_Shape-2",
      "icon-Title-Style_Shape-3",
      "icon-Title-Style_Shape-4",
      "icon-Title-Style_Shape-5",
      "icon-Title-Style_Shape-6",
      "icon-Title-Style_Shape-7"
    ],
    "style_tab": [
      { "id": "card-style-1", "active": false },
      { "id": "card-style-2", "active": true },
      { "id": "card-style-3", "active": false },
      { "id": "card-style-4", "active": false }
    ],
    "dimensionInfo": [],
    "metaTags": ["chapter", "climate", "heading"]
  }
}
```

---

## Style Variants

| Style Class | Visual Description | Color Usage |
|---|---|---|
| `card-style-1` | Border-bottom accent line beneath heading text | Line color = `componentColor` |
| `card-style-2` | Thick left border accent bar | Bar color = `componentColor` |
| `card-style-3` | Clean text only — no decoration (default) | Text color = `componentColor` |
| `card-style-4` | Decorative icon shape before heading text | Icon + text color = `componentColor` |

### Style Visual Reference

```
card-style-1:  Section Heading
               ───────────────  ← colored underline

card-style-2:  ▌ Section Heading  ← left accent bar

card-style-3:  Section Heading   ← plain text

card-style-4:  ◆ Section Heading  ← icon before text
```

---

## Heading Levels

| `headerClassData` Value | Rendered HTML Tag | Semantic Role |
|---|---|---|
| `h2-style` | `<h2>` | Section heading (most common) |
| `h3-style` | `<h3>` | Sub-section heading |
| `h4-style` | `<h4>` | Minor sub-section |
| `h5-style` | `<h5>` | Detail heading |
| `h6-style` | `<h6>` | Smallest heading level |
| `sub-2-style` | `<p>` | Subtitle / intro text (not a semantic heading) |

> **Accessibility note**: `sub-2-style` renders as `<p>` not a heading — screen readers will not treat it as a navigable heading landmark. Use only for decorative subtitles.

### Template ng-if Pattern

```html
<!-- H2 variant -->
<h2 ng-if="fieldData.settings.headerClassData == 'h2-style'"
    ng-model="fieldData.headerDataText"
    contenteditable="true"
    class="header-data tocTextContent {{fieldData.settings.styleClass}} {{fieldData.settings.iconClass}}"
    ng-style="{'color': fieldData.settings.componentColor}">
</h2>

<!-- H3 variant -->
<h3 ng-if="fieldData.settings.headerClassData == 'h3-style'"
    ng-model="fieldData.headerDataText"
    contenteditable="true"
    class="header-data tocTextContent {{fieldData.settings.styleClass}} {{fieldData.settings.iconClass}}"
    ng-style="{'color': fieldData.settings.componentColor}">
</h3>

<!-- ... H4, H5, H6 follow same pattern ... -->

<!-- Subtitle variant -->
<p ng-if="fieldData.settings.headerClassData == 'sub-2-style'"
   ng-model="fieldData.headerDataText"
   contenteditable="true"
   class="header-data tocTextContent {{fieldData.settings.styleClass}} {{fieldData.settings.iconClass}}"
   ng-style="{'color': fieldData.settings.componentColor}">
</p>
```

---

## Editor Mode Implementation

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `changeStyle(style)` | `style: string` | Updates `settings.styleClass`; updates `style_tab` active state |
| `changeLevel(level)` | `level: string` | Updates `settings.headerClassData`; preserves `headerDataText` |
| `changeColor(color)` | `color: string` | Updates `settings.componentColor` (hex) |
| `changeIcon(iconClass)` | `iconClass: string` | Updates `settings.iconClass` (card-style-4 only) |
| `toggleApplyAll()` | none | Toggles `ignoreApplyAll` boolean |
| `setIgnoreApplyAll(val)` | `val: boolean` | Programmatically sets `ignoreApplyAll` |
| `applyAllUpdate(styleObj)` | `styleObj: object` | Receives Apply All broadcast; updates styleClass + componentColor |

### Contenteditable Binding

```javascript
// Heading text is bound via ng-model on contenteditable
// The contenteditable-ng-model-directive.js handles the special binding
// All 7 heading variants share the same model: fieldData.headerDataText
// This means switching from h2 to h4 preserves the heading text
```

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Style** | Thumbnail grid (4) | `fieldData.settings.styleClass` | `card-style-1` / `card-style-2` / `card-style-3` / `card-style-4` |
| **Heading Level** | Dropdown | `fieldData.settings.headerClassData` | `h2-style` … `h6-style` / `sub-2-style` |
| **Color** | Color picker | `fieldData.settings.componentColor` | Hex color string |
| **Icon Shape** | Icon grid (7) | `fieldData.settings.iconClass` | `icon-Title-Style_Shape-1` … `Shape-7`; visible only when `card-style-4` active |
| **Ignore Apply All** | Checkbox | `fieldData.ignoreApplyAll` | `true` = excluded from Apply All |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of keyword strings |

---

## TOC Integration

### How Headings Appear in TOC

Every heading element has the class `tocTextContent`:

```html
<h2 class="header-data tocTextContent card-style-2 ...">Section Heading</h2>
```

When `ngcontroller.js` calls `saveTOCtoBackend()`:

```javascript
// Scans canvas for heading elements
var headings = canvas.querySelectorAll('.tocTextContent');
headings.forEach(function(el) {
  // POST heading text + pageId to TOC API
  saveTOC({ text: el.innerText, pageId: currentPageId });
});
```

This keeps the TOC chapter list in sync with headings on the canvas.

### TOC Sync Flow

```
Author types in heading contenteditable
        ↓
fieldData.headerDataText updated (ng-model)
        ↓
Author navigates away / saves page
        ↓
saveTOCtoBackend() called
        ↓
Queries canvas .tocTextContent elements
        ↓
POST each heading text to /saveAndEditTOC endpoint
        ↓
TOC panel updates with new heading text
```

> **Note**: `sub-2-style` also has `tocTextContent` class and will appear in TOC even though it renders as `<p>` — this may cause unexpected TOC entries for subtitles.

---

## Apply All System

### How Apply All Works

Apply All allows bulk styling across all Header elements on a page:

```
Author selects a Header element
        ↓
Changes styleClass or componentColor
        ↓
Clicks "Apply All" button in settings panel
        ↓
ngcontroller broadcasts applyAllUpdate event
        ↓
All Header elements with ignoreApplyAll=false receive update
        ↓
styleClass + componentColor updated across all instances
```

### ignoreApplyAll Flag

| `ignoreApplyAll` | Behavior |
|---|---|
| `false` (default) | This header receives Apply All style updates |
| `true` | This header is protected — Apply All updates are ignored |

**Use case**: An author uses red borders for all section headings (Apply All), but wants one specific callout heading to remain blue — set `ignoreApplyAll=true` on that heading.

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Header element from Elements panel onto canvas
       ↓
2. ngcontroller.js $compile(header.html) → injects component
   fieldData initialized from headerComponent.json defaults
   Default: H2, card-style-3, black text
       ↓
3. Header renders with placeholder "Section Heading" text
       ↓
4. Author clicks on heading text → contenteditable activated
   Types the heading text
       ↓
5. Author opens settings panel:
   a. Selects style thumbnail (e.g., card-style-2 → left bar)
   b. Changes heading level (e.g., H3 for sub-section)
   c. Picks accent color via color picker
   d. If card-style-4: selects icon shape from grid
   e. Checks "Ignore Apply All" if needed
       ↓
6. Author clicks "Apply All" to propagate style to all headers
   (headers with ignoreApplyAll=true are skipped)
       ↓
7. Save → fieldData persisted
   TOC sync: heading text posted to backend
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Text editing | Contenteditable active | Read-only |
| Style thumbnails | Clickable | Hidden |
| Color picker | Active | Hidden |
| Icon grid | Visible (style-4) | Hidden |
| Apply All button | Visible | Hidden |
| TOC class | `.tocTextContent` present | Present (used by reader for TOC) |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `editor/ngcontroller.js` | `$compile` + inject; Apply All broadcast | Core canvas manager |
| `editor/ngdragdrop.js` | Drag source from Elements panel | |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on contenteditable elements | Required for all heading variants |
| `editor/sd.js` | JSON serialization of `fieldData` | Save/load |
| `header-component-template.css` | Visual styles for all 4 style variants | Component-specific |
| `css/authoring/authoring-style.css` | Base element wrapper styles | Shared |
| TOC backend API | `saveTOCtoBackend()` → `POST /saveAndEditTOC` | Heading text sync |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.header-data` | Base heading element style (all variants) |
| `.tocTextContent` | Marks element for TOC scanning |
| `.card-style-1` | Border-bottom line style |
| `.card-style-2` | Left border bar style |
| `.card-style-3` | Plain text style (no decoration) |
| `.card-style-4` | Icon-decorated style |
| `.icon-Title-Style_Shape-1` … `Shape-7` | Icon font classes for decorative shapes |

### Style CSS Pattern

```css
/* card-style-1: border bottom */
.header-data.card-style-1 {
  border-bottom: 3px solid currentColor;
  padding-bottom: 8px;
}

/* card-style-2: left border */
.header-data.card-style-2 {
  border-left: 5px solid currentColor;
  padding-left: 16px;
}

/* card-style-3: plain */
.header-data.card-style-3 {
  /* no decoration */
}

/* card-style-4: icon before text via ::before */
.header-data.card-style-4::before {
  /* icon font character rendered via iconClass */
  font-family: 'authoring-icons';
  margin-right: 8px;
  color: currentColor;
}
```

---

## Known Behaviors & Notes

1. **Shared `headerDataText` across levels**: All 7 heading variants (h2…h6, p) share `ng-model="fieldData.headerDataText"`. Switching from H2 to H4 preserves the text. There is no level-specific text storage.

2. **`iconClass` persists across styles**: When author switches from `card-style-4` to `card-style-1`, the `iconClass` value remains in `fieldData`. The icon is CSS-hidden in non-style-4 modes, but the class is still on the element. This doesn't cause visual issues but can create unexpected classes in exported HTML.

3. **`tocTextContent` on `sub-2-style`**: Even though `sub-2-style` renders as `<p>`, it still has the `tocTextContent` class and will be picked up by `saveTOCtoBackend()`. Subtitle paragraphs will appear as TOC entries, which may not be desired.

4. **H1 is not available**: The Header element only offers H2–H6. H1 is reserved for the **Title Element** (`chapter-headingNew-h1`). Using H2 as the first heading level is correct semantic structure.

5. **Apply All matches on any styleClass**: The Apply All broadcast is received by ALL Header elements on the page (except those with `ignoreApplyAll=true`), regardless of their current style. An H2 and an H4 with different styles will both receive the update.

6. **Color applies to different targets per style**:
   - `card-style-1`: Color → border-bottom color
   - `card-style-2`: Color → left border color
   - `card-style-3`: Color → text color (via `ng-style`)
   - `card-style-4`: Color → icon and text color

7. **Icon grid only shown for card-style-4**: The 7-icon grid in the settings panel is hidden (CSS or ng-if) when any other style is selected. Authors may not discover icon functionality if they don't select card-style-4.

8. **`dimensionInfo[]` for floating toolbar images**: If an author uses the floating text toolbar to insert an inline image inside the heading text, the image dimensions are tracked in `dimensionInfo[]`. This is rare but possible.

9. **`sub-2-style` = `<p>` not a heading**: Despite being in the heading element, `sub-2-style` is a paragraph. Screen readers and assistive technologies will not navigate to it as a section heading. Accessibility audits may flag this.

10. **Meta tags not visible to students**: `metaTags[]` array is for content management search indexing only — not rendered in any student-facing UI.

---

## Checklist for Implementation

### For Authors
- [ ] Select appropriate heading level (H2 for sections, H3 for sub-sections, etc.)
- [ ] Avoid using H1 — use Title Element for chapter titles
- [ ] Set meaningful heading text for TOC readability
- [ ] Choose accent color that meets contrast ratios (WCAG AA: 4.5:1)
- [ ] Use "Ignore Apply All" if this heading should not receive bulk styling
- [ ] Do not use `sub-2-style` for structural content that needs TOC/screen reader navigation

### For Developers
- [ ] Verify `contenteditable-ng-model-directive.js` is loaded before `headerComponent`
- [ ] Test Apply All broadcast receives update across all instances correctly
- [ ] Test `ignoreApplyAll=true` prevents update during Apply All
- [ ] Verify `tocTextContent` class triggers correct TOC sync via `saveTOCtoBackend()`
- [ ] Confirm icon font (`authoring-icons`) is loaded for `card-style-4` rendering
- [ ] Test all 6 heading levels render correct semantic HTML in package output
- [ ] Verify color picker updates `ng-style` in real-time without full re-render
- [ ] Test that switching level preserves `headerDataText` (shared ng-model)

---

## API Reference

### Apply All Broadcast

```javascript
// Sent by ngcontroller.js when "Apply All" clicked
$rootScope.$broadcast('applyAllUpdate', {
  styleClass: 'card-style-2',
  componentColor: '#2563EB'
});

// Received by each headerComponent directive instance
$scope.$on('applyAllUpdate', function(event, styleObj) {
  if (!fieldData.ignoreApplyAll) {
    fieldData.settings.styleClass = styleObj.styleClass;
    fieldData.settings.componentColor = styleObj.componentColor;
    // Update style_tab active state
    updateStyleTab(styleObj.styleClass);
  }
});
```

### TOC Sync Call

```javascript
// ngcontroller.js saveTOCtoBackend()
var headings = canvasElement.querySelectorAll('.tocTextContent');
headings.forEach(function(el, index) {
  $http.post(saveTOCUrl, {
    pageId: currentPageId,
    sequence: index,
    text: el.innerText || el.textContent
  });
});
```

### Save Flow

```javascript
// On page save — fieldData stored in savedJson
savedJson[pageNo][componentId] = {
  identifier: "header-component",
  headerDataText: "Chapter 2: Climate Systems",
  ignoreApplyAll: false,
  settings: {
    headerClassData: "h2-style",
    styleClass: "card-style-2",
    componentColor: "#2563EB",
    iconClass: "icon-Title-Style_Shape-1",
    // ...
  }
};
```
