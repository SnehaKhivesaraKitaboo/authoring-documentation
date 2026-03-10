# Situation Header Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants](#style-variants)
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

The **Situation Header Element** (`dataType: "situation-header"`) is a specialized page header component for scenario-based learning environments. It presents situational context at the top of activity pages, combining a background image or color, a numbered situation badge, a main title, and an optional subtitle. It signals to students that they are entering a new situation or scenario within a case-study or scenario-based lesson.

### Key Capabilities

- Situation number badge (editable inline — "Situation 1", "2", etc.)
- Main title text (contenteditable)
- Optional subtitle text (contenteditable)
- Background image upload (optional; color used as fallback)
- Background color picker (shown when no image, or as image fallback)
- Text color customization for all text elements
- 2 style variants: full-width banner and compact sidebar layout
- Outline border styling

### Component Identifier

```javascript
"dataType": "situation-header"
```

### Component Registration (config.js)

```javascript
{
  name: "Situation Header",
  dataType: "situation-header",
  url: "templates/situation-header/situation-header.html",
  json: "templates/situation-header/default/situation-header.json",
  settingsURL: "templates/situation-header/situation-header-settings.html",
  iconClass: "icon-situation-header"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      KITABOO Authoring Tool                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ─────────────► ngcontroller.js ──────► $compile           │
│  (dataType:                (drag-drop)             (canvas inject)   │
│  "situation-header")             │                                   │
│                                  ▼                                   │
│         ┌────────────────────────────────────────────────────┐       │
│         │  situation-header.html (Canvas Template)            │       │
│         │  [situationHeaderTemplate directive]                │       │
│         │  Background img/color + badge + title + subtitle    │       │
│         └────────────────────────────────────────────────────┘       │
│                   │                      │                           │
│                   ▼                      ▼                           │
│      ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│      │ situation-header-       │  │ situation-header-settings.html│  │
│      │ directive.js            │  │ (Settings Panel)             │  │
│      └─────────────────────────┘  └──────────────────────────────┘  │
│                   │                      │                           │
│                   ▼                      ▼                           │
│          fieldData               Settings Controls:                  │
│          - title                  - Background Image upload          │
│          - subtitle               - Background Color picker          │
│          - situationNumber        - Text Color picker                │
│          - media.src (bg img)     - Style selector (style1/style2)   │
│          - settings.*             - Show Situation Number            │
│                                   - Show Subtitle                    │
│                                                                      │
│                   │                                                  │
│                   ▼                                                  │
│       ┌──────────────────────────────────────────┐                   │
│       │  ShellService                             │                   │
│       │  POST image → CDN URL → media.src         │                   │
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
    └── situation-header/
        ├── situation-header.html          ← Canvas template
        ├── situation-header-settings.html ← Settings panel
        ├── scripts/
        │   └── situation-header-directive.js ← Directive
        ├── styles/
        │   └── situation-header-template.css ← Styles
        └── default/
            └── situation-header.json      ← Default config
```

### `situation-header.json` — Default Configuration

```json
{
  "identifier": "situation-header",
  "title": "Situation Title",
  "subtitle": "Enter situation description here",
  "situationNumber": "1",
  "media": {
    "src": "",
    "align": "center"
  },
  "settings": {
    "showSituationNumber": true,
    "showSubtitle": true,
    "bgColor": "#2563EB",
    "textColor": "#ffffff",
    "styleSelected": "style1",
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
| `identifier` | string | `"situation-header"` | Component type identifier |
| `title` | string | `"Situation Title"` | Main situation title (contenteditable) |
| `subtitle` | string | `"Enter situation description..."` | Supporting description (contenteditable) |
| `situationNumber` | string | `"1"` | Situation badge number/label (contenteditable) |
| `media` | object | `{}` | Background image source |
| `settings` | object | `{}` | Display settings |

### `media` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `src` | string | `""` | CDN URL of uploaded background image (empty = no image) |
| `align` | string | `"center"` | Image alignment (informational) |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `showSituationNumber` | boolean | `true` | Show/hide situation number badge |
| `showSubtitle` | boolean | `true` | Show/hide subtitle text |
| `bgColor` | string | `"#2563EB"` | Background color (used when no image, or as fallback) |
| `textColor` | string | `"#ffffff"` | Color for title, subtitle, and badge text |
| `styleSelected` | string | `"style1"` | Layout style: `"style1"` / `"style2"` |
| `outline` | string | `""` | Outer border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Outer border background color |
| `metaTags` | array | `[]` | Content search metadata |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### Complete fieldData Example — Situation 3 with Background Image

```json
{
  "identifier": "situation-header",
  "title": "The Supply Chain Crisis",
  "subtitle": "A global manufacturer faces critical delays affecting 50,000+ customers.",
  "situationNumber": "3",
  "media": {
    "src": "https://cdn.example.com/images/factory-bg.jpg",
    "align": "center"
  },
  "settings": {
    "showSituationNumber": true,
    "showSubtitle": true,
    "bgColor": "#1a1a2e",
    "textColor": "#ffffff",
    "styleSelected": "style1",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "metaTags": ["situation", "supply-chain", "case-study"],
    "dimensionInfo": []
  }
}
```

---

## Style Variants

| Style | Layout Description | Situation Number |
|---|---|---|
| `style1` | Full-width banner — background image/color fills component; text overlaid center-aligned | Small badge in top-left corner |
| `style2` | Compact sidebar — situation number is a large prominent badge on the left; title and subtitle in right panel | Large badge, left-aligned |

### Visual Reference

```
style1 (Full-width banner):
┌──────────────────────────────────────────────────────┐
│  [Situation 3]                                       │ ← small badge, bg image/color
│                                                      │
│          The Supply Chain Crisis                     │ ← centered title
│  A global manufacturer faces critical delays...      │ ← centered subtitle
│                                                      │
└──────────────────────────────────────────────────────┘

style2 (Compact with large badge):
┌──────────────────────────┬───────────────────────────┐
│                          │                           │
│   SITUATION              │  The Supply Chain         │
│       3                  │  Crisis                   │
│   (large badge)          │  A global manufacturer... │
│                          │                           │
└──────────────────────────┴───────────────────────────┘
```

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<section class="component-holder situation-header {{fieldData.settings.styleSelected}}"
         situation-header-template
         ng-style="{
           'background-image': fieldData.media.src ? 'url(' + fieldData.media.src + ')' : 'none',
           'background-color': fieldData.settings.bgColor
         }"
         editprimarymedia>

  <!-- Situation Number Badge -->
  <div class="situation-badge"
       ng-if="fieldData.settings.showSituationNumber"
       ng-style="{'color': fieldData.settings.textColor}"
       contenteditable="true"
       ng-model="fieldData.situationNumber">
  </div>

  <!-- Text Content Area -->
  <div class="situation-text-area">

    <!-- Title -->
    <h2 class="situation-title"
        ng-style="{'color': fieldData.settings.textColor}"
        contenteditable="true"
        ng-model="fieldData.title">
    </h2>

    <!-- Subtitle -->
    <p class="situation-subtitle"
       ng-if="fieldData.settings.showSubtitle"
       ng-style="{'color': fieldData.settings.textColor}"
       contenteditable="true"
       ng-model="fieldData.subtitle">
    </p>

  </div>

</section>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `uploadBackground(file)` | `file: File` | Uploads background image via ShellService; sets `media.src` |
| `clearBackground()` | none | Clears `media.src` — reverts to `bgColor` |
| `changeStyle(style)` | `style: string` | Updates `settings.styleSelected` |
| `toggleSituationNumber()` | none | Toggles `settings.showSituationNumber` |
| `toggleSubtitle()` | none | Toggles `settings.showSubtitle` |
| `setBgColor(color)` | `color: string` | Updates `settings.bgColor` |
| `setTextColor(color)` | `color: string` | Updates `settings.textColor` |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Background Image** | File upload button | `fieldData.media.src` | Image file; sets via ShellService |
| **Remove Image** | Button | Clears `fieldData.media.src` | Shows bgColor when cleared |
| **Background Color** | Color picker | `fieldData.settings.bgColor` | Hex; fallback when no image |
| **Text Color** | Color picker | `fieldData.settings.textColor` | Applied to all text elements |
| **Style** | Radio (style1/style2) | `fieldData.settings.styleSelected` | Two layout variants |
| **Show Situation Number** | Checkbox | `fieldData.settings.showSituationNumber` | Removes badge from DOM |
| **Show Subtitle** | Checkbox | `fieldData.settings.showSubtitle` | Removes subtitle from DOM |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Situation Header element from Elements panel
       ↓
2. Component renders with default blue background, "Situation 1" badge
   Placeholder title and subtitle text
       ↓
3. Author uploads background image (optional):
   Click element (editprimarymedia triggers) → file picker
   OR sets background color only
       ↓
4. Author sets text color to ensure contrast over background
       ↓
5. Author edits in canvas:
   - Click situation badge → type number (e.g., "3")
   - Click title → type situation title
   - Click subtitle → type situation description
       ↓
6. Author selects style variant in settings panel:
   - style1: Full-width banner (default)
   - style2: Compact with large left badge
       ↓
7. Author toggles optional elements:
   - Situation number (on/off)
   - Subtitle (on/off)
       ↓
8. Save → fieldData persisted to savedJson
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Background image upload | Active (editprimarymedia) | Disabled |
| Title editing | Contenteditable | Read-only |
| Subtitle editing | Contenteditable | Read-only |
| Badge editing | Contenteditable | Read-only |
| Settings panel | Accessible | Hidden |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `situation-header-directive.js` | Core directive | Background + text management |
| `editprimarymedia` directive | Background image upload via click | Click on component triggers upload |
| `ShellService` | HTTP API for image upload | Returns CDN URL |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on all text fields | |
| `situation-header-template.css` | Layout styles for style1/style2 | Component-specific |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.situation-header` | Root section element |
| `.situation-header.style1` | Full-width banner layout |
| `.situation-header.style2` | Compact sidebar layout |
| `.situation-badge` | Situation number badge |
| `.situation-text-area` | Title + subtitle container |
| `.situation-title` | Main title `<h2>` |
| `.situation-subtitle` | Subtitle `<p>` |

---

## Known Behaviors & Notes

1. **Background image upload via `editprimarymedia` on the section**: Unlike the Image element where the `<img>` is clicked, clicking anywhere on the Situation Header component triggers `editprimarymedia`. This means background image replacement is initiated by clicking the component, not a separate button. Authors may find this unintuitive.

2. **bgColor as fallback**: When `media.src` is empty, the component shows only the `bgColor`. When an image is set, the CSS uses `background-image: url(...)` with `bgColor` as CSS `background-color` fallback (visible while image loads or if it fails).

3. **`textColor` applies to ALL text**: Title, subtitle, and situation number badge all use the same `textColor`. There is no separate color per text element. Ensure the single `textColor` provides sufficient contrast over the background for all three text areas.

4. **`showSubtitle=false` uses ng-if**: Subtitle is removed from DOM entirely. Any text typed in the subtitle contenteditable is preserved in `fieldData.subtitle` — it will reappear when the toggle is turned back on.

5. **`showSituationNumber=false` uses ng-if**: Badge is removed from DOM. `fieldData.situationNumber` text is preserved.

6. **style2 repositions the badge significantly**: In style2, the situation number badge becomes a large left-panel element while title/subtitle shift to the right panel. CSS handles this via the `.situation-header.style2` class modifier — no JS re-rendering needed.

7. **No TOC integration**: Unlike the Header element, the Situation Header does not have the `.tocTextContent` class. Situation titles do NOT appear in the TOC panel — this is intentional as situations are not chapter headings.

8. **Situation number is a string, not integer**: `fieldData.situationNumber` is stored as a string. Authors can enter any text in the badge (not just numbers), e.g., "Situation A", "Case 1", or "Step 3".

9. **No floating toolbar on any text**: Unlike the Text element, the Situation Header's title, subtitle, and badge are all plain contenteditable fields without the floating toolbar. No rich text formatting is available in these fields.

10. **No SCORM**: Content/context display only — no student interaction tracking.

---

## Checklist for Implementation

### For Authors
- [ ] Set situation number sequentially for multi-situation lessons
- [ ] Upload a relevant background image for visual engagement
- [ ] Ensure text color contrasts sufficiently with background (light text on dark bg or vice versa)
- [ ] Write a clear, concise title that identifies the scenario
- [ ] Write a subtitle that provides key context in one to two sentences
- [ ] Choose style2 when a prominent situation number is needed as a visual anchor

### For Developers
- [ ] Verify `editprimarymedia` triggers on section element (not img) for background upload
- [ ] Confirm `ng-style` background-image URL syntax works correctly with CDN URLs
- [ ] Test bgColor shows correctly when image is cleared
- [ ] Verify style1 and style2 CSS classes produce correct layouts
- [ ] Test all three text fields (title, subtitle, badge) use same `textColor` correctly
- [ ] Confirm ng-if for `showSubtitle` preserves `fieldData.subtitle` text on toggle
