# Lesson Opener Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants](#style-variants)
6. [Learning Objectives List](#learning-objectives-list)
7. [Editor Mode Implementation](#editor-mode-implementation)
8. [Settings Panel Reference](#settings-panel-reference)
9. [Authoring Flow](#authoring-flow)
10. [Preview Mode Behavior](#preview-mode-behavior)
11. [Integration & Dependencies](#integration--dependencies)
12. [CSS Reference](#css-reference)
13. [Known Behaviors & Notes](#known-behaviors--notes)
14. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Lesson Opener Element** (`dataType: "lesson-opener"`) is a full-width introductory component positioned at the top of lesson pages to orient students, establish lesson context, and set learning expectations. It combines a background image, lesson title, subtitle/tagline, and a structured list of learning objectives. Three visual style variants allow flexible presentation from full-bleed image overlays to split layouts to color-only backgrounds.

### Key Capabilities

- Full-width lesson introduction with background image or solid color
- **Lesson title** and **subtitle** (both contenteditable)
- **Learning objectives list** — dynamically add/remove objective items
- **3 visual style variants**: full-bleed overlay, split image/text, color-only
- **Color overlay** on background image (rgba — color + opacity in one field)
- **Text color** customization for all text elements
- Optional **decorative icon** before title
- Show/hide controls for subtitle and objectives
- Background image upload with color fallback

### Component Identifier

```javascript
"dataType": "lesson-opener"
```

### Component Registration (config.js)

```javascript
{
  name: "Lesson Opener",
  dataType: "lesson-opener",
  url: "templates/lesson-opener/lesson-opener.html",
  json: "templates/lesson-opener/default/lesson-opener.json",
  settingsURL: "templates/lesson-opener/lesson-opener-settings.html",
  iconClass: "icon-lesson-opener"
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
│  (dataType:                 (drag-drop)             (inject)         │
│  "lesson-opener")                │                                   │
│                                  ▼                                   │
│        ┌──────────────────────────────────────────────────────┐      │
│        │  lesson-opener.html (Canvas Template)                 │      │
│        │  [lessonOpenerTemplate directive]                     │      │
│        │  Background (img/color/overlay)                       │      │
│        │  ┌────────────────────────────────────────────┐      │      │
│        │  │ [Icon]  Title (contenteditable)             │      │      │
│        │  │         Subtitle (contenteditable)          │      │      │
│        │  │         ─────────────────────────          │      │      │
│        │  │         Learning Objectives:               │      │      │
│        │  │         • Objective 1 (contenteditable)    │      │      │
│        │  │         • Objective 2 (contenteditable)    │      │      │
│        │  └────────────────────────────────────────────┘      │      │
│        └──────────────────────────────────────────────────────┘      │
│                   │                      │                           │
│                   ▼                      ▼                           │
│      ┌────────────────────────┐  ┌──────────────────────────────┐   │
│      │ lesson-opener-         │  │ lesson-opener-settings.html  │   │
│      │ directive.js           │  │ (Settings Panel)             │   │
│      └────────────────────────┘  └──────────────────────────────┘   │
│                   │                                                  │
│                   ▼                                                  │
│          fieldData               Settings Controls:                  │
│          - title                  - Background image upload          │
│          - subtitle               - BG Color + Overlay Color         │
│          - objectives[]           - Text Color picker                │
│          - media.src (bg img)     - Style selector (style1/2/3)      │
│          - settings.*             - Show/Hide subtitle + objectives  │
│                                   - Add/Remove objective items       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── lesson-opener/
        ├── lesson-opener.html             ← Canvas template
        ├── lesson-opener-settings.html    ← Settings panel
        ├── scripts/
        │   └── lesson-opener-directive.js ← Directive
        ├── styles/
        │   └── lesson-opener-template.css ← Styles
        └── default/
            └── lesson-opener.json         ← Default config
```

### `lesson-opener.json` — Default Configuration

```json
{
  "identifier": "lesson-opener",
  "title": "Lesson Title",
  "subtitle": "Lesson tagline or brief description",
  "objectives": [
    "Understand the key concepts of this topic",
    "Apply principles to real-world scenarios",
    "Evaluate outcomes using provided frameworks"
  ],
  "media": {
    "src": ""
  },
  "settings": {
    "styleSelected": "style1",
    "showObjectives": true,
    "showSubtitle": true,
    "showIcon": false,
    "iconClass": "",
    "overlayColor": "rgba(0,0,0,0.4)",
    "textColor": "#ffffff",
    "bgColor": "#1a1a2e",
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
| `identifier` | string | `"lesson-opener"` | Component type identifier |
| `title` | string | `"Lesson Title"` | Main lesson title (contenteditable) |
| `subtitle` | string | `"Lesson tagline..."` | Secondary description (contenteditable) |
| `objectives` | array | `[...]` | Learning objectives — array of plain text strings |
| `media` | object | `{}` | Background image source |
| `settings` | object | `{}` | All display and style settings |

### `media` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `src` | string | `""` | CDN URL of uploaded background image |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `styleSelected` | string | `"style1"` | Layout variant: `"style1"` / `"style2"` / `"style3"` |
| `showObjectives` | boolean | `true` | Show/hide the entire objectives list |
| `showSubtitle` | boolean | `true` | Show/hide subtitle text |
| `showIcon` | boolean | `false` | Show/hide decorative icon before title |
| `iconClass` | string | `""` | CSS class for decorative icon |
| `overlayColor` | string | `"rgba(0,0,0,0.4)"` | Color+opacity overlay on background image |
| `textColor` | string | `"#ffffff"` | Color for all text elements |
| `bgColor` | string | `"#1a1a2e"` | Background color (when no image, or image fallback) |
| `outline` | string | `""` | Outer border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Outer border background |
| `metaTags` | array | `[]` | Content search metadata |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### `objectives` Array

```json
// fieldData.objectives — array of plain text strings
[
  "Understand the key concepts of this topic",
  "Apply principles to real-world scenarios",
  "Evaluate outcomes using provided frameworks"
]
```

Each item is a plain text string (no HTML formatting). Items are rendered as `<li>` elements within a `<ul>`.

### Complete fieldData Example — Full Lesson Opener

```json
{
  "identifier": "lesson-opener",
  "title": "Lesson 4: The Water Cycle",
  "subtitle": "Explore how water moves through Earth's systems and why it matters for life.",
  "objectives": [
    "Describe the stages of the water cycle (evaporation, condensation, precipitation)",
    "Explain how the water cycle distributes freshwater resources globally",
    "Analyze the impact of climate change on the water cycle",
    "Apply water cycle knowledge to real-world environmental problems"
  ],
  "media": {
    "src": "https://cdn.example.com/images/water-cycle-bg.jpg"
  },
  "settings": {
    "styleSelected": "style1",
    "showObjectives": true,
    "showSubtitle": true,
    "showIcon": true,
    "iconClass": "icon-lesson-water",
    "overlayColor": "rgba(0, 40, 80, 0.55)",
    "textColor": "#ffffff",
    "bgColor": "#003366",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "metaTags": ["lesson", "water-cycle", "science", "geography"],
    "dimensionInfo": []
  }
}
```

---

## Style Variants

| Style | Description | Background | Text Layout |
|---|---|---|---|
| `style1` | **Full-bleed overlay** — background image fills entire component; text and objectives centered or left-aligned with color overlay | Image + overlay | Centered or left-aligned on image |
| `style2` | **Split layout** — image fills left half (50%); text, subtitle, objectives in right half | Image left 50% | Text right 50% |
| `style3` | **Color-only** — no background image; solid `bgColor` background; bold typography | `bgColor` solid | Full-width text layout |

### Visual Reference

```
style1 (Full-bleed overlay):
┌──────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← background image
│░░  📌 Lesson 4: The Water Cycle              ░░░░░░│ ← title (overlaid)
│░░  Explore how water moves through...         ░░░░░░│ ← subtitle (overlaid)
│░░  ─────────────────────────────────         ░░░░░░│
│░░  Learning Objectives:                       ░░░░░░│
│░░  • Describe the stages of the water cycle   ░░░░░░│
│░░  • Explain how the water cycle distributes  ░░░░░░│
└──────────────────────────────────────────────────────┘
             ↑ rgba overlay (dark tint for readability)

style2 (Split layout):
┌───────────────────────┬──────────────────────────────┐
│                       │  Lesson 4: The Water Cycle   │
│   [BACKGROUND IMAGE]  │  Explore how water moves...  │
│                       │  ─────────────────────────   │
│                       │  Learning Objectives:         │
│                       │  • Describe the stages...     │
└───────────────────────┴──────────────────────────────┘

style3 (Color-only):
┌──────────────────────────────────────────────────────┐
│  Lesson 4: The Water Cycle               [bgcolor bg] │
│  Explore how water moves through...                   │
│  ─────────────────────────────                        │
│  Learning Objectives:                                 │
│  • Describe the stages of the water cycle             │
└──────────────────────────────────────────────────────┘
```

---

## Learning Objectives List

### Data Structure

```javascript
// fieldData.objectives — array of plain text strings
fieldData.objectives = [
  "Objective text 1",
  "Objective text 2",
  "Objective text 3"
];
```

### Add/Remove Operations

```javascript
// Add a new empty objective
function addObjective() {
  fieldData.objectives.push("");
  // Canvas renders new empty <li> with contenteditable
}

// Remove objective at index
function removeObjective(index) {
  fieldData.objectives.splice(index, 1);
}
```

### Canvas Rendering

```html
<!-- Objectives list rendered via ng-repeat -->
<ul class="objectives-list" ng-if="fieldData.settings.showObjectives">
  <li ng-repeat="objective in fieldData.objectives track by $index"
      class="objective-item">

    <!-- Contenteditable for in-canvas editing -->
    <span contenteditable="true"
          ng-model="fieldData.objectives[$index]">
      {{objective}}
    </span>

    <!-- Remove button (editor mode only) -->
    <button class="remove-objective editor-only"
            ng-click="removeObjective($index)">
      ×
    </button>

  </li>
</ul>

<!-- Add objective button (editor mode only) -->
<button class="add-objective editor-only"
        ng-click="addObjective()">
  + Add Objective
</button>
```

---

## Editor Mode Implementation

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `uploadBackground(file)` | `file: File` | Uploads BG image via ShellService; sets `media.src` |
| `clearBackground()` | none | Resets `media.src` to empty string |
| `changeStyle(style)` | `style: string` | Updates `settings.styleSelected` |
| `toggleSubtitle()` | none | Toggles `settings.showSubtitle` |
| `toggleObjectives()` | none | Toggles `settings.showObjectives` |
| `toggleIcon()` | none | Toggles `settings.showIcon` |
| `setIconClass(cls)` | `cls: string` | Updates `settings.iconClass` |
| `setOverlayColor(rgba)` | `rgba: string` | Updates `settings.overlayColor` |
| `setTextColor(color)` | `color: string` | Updates `settings.textColor` |
| `setBgColor(color)` | `color: string` | Updates `settings.bgColor` |
| `addObjective()` | none | Pushes empty string to `objectives[]` |
| `removeObjective(i)` | `i: number` | Splices `objectives[]` at index `i` |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Background Image** | File upload | `fieldData.media.src` | Image file; via ShellService |
| **Remove Image** | Button | Clears `fieldData.media.src` | Reverts to bgColor |
| **Background Color** | Color picker | `fieldData.settings.bgColor` | Hex; fallback/style3 background |
| **Overlay Color** | Color + opacity picker | `fieldData.settings.overlayColor` | rgba string (style1/2 only) |
| **Text Color** | Color picker | `fieldData.settings.textColor` | All text elements share this color |
| **Style** | Radio (style1/2/3) | `fieldData.settings.styleSelected` | Three variants |
| **Show Subtitle** | Checkbox | `fieldData.settings.showSubtitle` | Removes from DOM |
| **Show Objectives** | Checkbox | `fieldData.settings.showObjectives` | Removes entire list from DOM |
| **Show Icon** | Checkbox | `fieldData.settings.showIcon` | Icon before title |
| **Icon Selector** | Icon picker | `fieldData.settings.iconClass` | Available when showIcon=true |
| **Add Objective** | Button | Appends to `objectives[]` | Creates new contenteditable item |
| **Outline** | Radio | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Lesson Opener element from Elements panel
       ↓
2. Component renders with default style1, dark background color,
   placeholder title, subtitle, and 3 default objectives
       ↓
3. Author uploads background image (optional):
   Click component → editprimarymedia triggers → file picker
   Image uploaded → CDN URL stored in media.src
       ↓
4. Author adjusts overlay color and opacity for readability:
   Dark overlay (rgba(0,0,0,0.4)) recommended for white text on images
       ↓
5. Author sets text color for contrast (usually #ffffff on dark bg)
       ↓
6. Author edits in canvas:
   - Click title → type lesson title
   - Click subtitle → type tagline/brief description
   - Click each objective → type learning objective text
       ↓
7. Author manages objectives list:
   - Add Objective button → new empty item appears → author types
   - Remove (×) button on each item → removes that objective
       ↓
8. Author selects style variant (style1/style2/style3)
       ↓
9. Optionally:
   - Toggle show/hide subtitle
   - Toggle show/hide objectives
   - Enable decorative icon + choose icon
       ↓
10. Save → fieldData persisted
    objectives[] array + title/subtitle strings → savedJson
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Title editing | Contenteditable | Read-only |
| Subtitle editing | Contenteditable | Read-only |
| Objective items editing | Contenteditable | Read-only |
| Add Objective button | Visible | Hidden |
| Remove (×) button | Visible on each item | Hidden |
| Background image | Rendered | Rendered |
| Color overlay | Applied | Applied |
| Settings panel | Accessible | Hidden |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `lesson-opener-directive.js` | Core directive | Objective management, style changes |
| `editprimarymedia` directive | Background image upload via click | Click on component |
| `ShellService` | HTTP API for image upload | Returns CDN URL |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` for title, subtitle | |
| `lesson-opener-template.css` | Component-specific layout styles | style1/2/3 CSS |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.lesson-opener` | Root wrapper |
| `.lesson-opener.style1` | Full-bleed overlay layout |
| `.lesson-opener.style2` | Split 50/50 layout |
| `.lesson-opener.style3` | Color-only layout |
| `.lesson-bg-overlay` | Overlay div for rgba tint on image |
| `.lesson-content` | Text + objectives container |
| `.lesson-title` | Title text element |
| `.lesson-subtitle` | Subtitle text element |
| `.lesson-icon` | Decorative icon before title |
| `.objectives-list` | `<ul>` for objectives |
| `.objective-item` | `<li>` for each objective |
| `.add-objective` | Add objective button (editor-only) |
| `.remove-objective` | Remove item button (editor-only) |

### Overlay CSS Pattern

```css
/* style1 — overlay div positioned over background image */
.lesson-opener.style1 {
  position: relative;
  background-image: var(--bg-image-url);
  background-size: cover;
  background-position: center;
}

.lesson-opener.style1 .lesson-bg-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  /* background-color set via ng-style from overlayColor */
}

.lesson-opener.style1 .lesson-content {
  position: relative;
  z-index: 1; /* Above overlay */
}
```

---

## Known Behaviors & Notes

1. **`overlayColor` is a combined rgba string**: The overlay color and opacity are combined in a single `rgba(r,g,b,a)` string — not separate fields. Authors must understand rgba syntax, or the settings panel must provide a combined color+opacity picker. Changing only opacity requires re-entering the full rgba string.

2. **`style3` ignores `media.src` entirely**: When `style3` is selected, the background is the solid `bgColor` — even if a background image has been uploaded, it is CSS-hidden in style3. The image data remains in `fieldData.media.src` and returns if a different style is selected.

3. **`style2` split is fixed 50/50**: The split between image and text in style2 is CSS-fixed at 50% / 50%. There is no way to adjust the split ratio from the settings panel.

4. **`objectives[]` items are plain strings — no rich text**: Each objective item is a plain text string. The floating text toolbar does NOT activate on objectives. Authors who need formatted objectives should place them in a Text element instead.

5. **`showObjectives=false` uses ng-if**: The entire `<ul>` is removed from DOM. All `objectives[]` array data is preserved — reappears on toggle. Same behavior for `showSubtitle`.

6. **Objectives add from bottom only**: New objectives appended via `addObjective()` are added at the end of the array. Authors cannot insert objectives at a specific position — they must add at end and reorder manually (delete and re-add).

7. **`textColor` applies to title, subtitle, AND objectives**: All three text areas share the same `textColor`. There is no per-element color control. This is intentional for visual consistency.

8. **`showIcon=true` requires valid `iconClass`**: If `iconClass=""` but `showIcon=true`, the icon element renders with no visible content (empty `<span>`). The icon picker must set a valid CSS icon class.

9. **editprimarymedia on the entire component**: Clicking anywhere on the lesson opener component triggers background image upload (via editprimarymedia on the section). This may conflict with text editing interactions — the directive must distinguish between upload and text edit click events.

10. **No TOC integration**: This component does not use `.tocTextContent` and does not appear in the TOC panel. Lesson opener titles are page-level orientation only.

---

## Checklist for Implementation

### For Authors
- [ ] Upload a high-quality, wide landscape background image (min 1920×500px for style1)
- [ ] Set overlay color and opacity to ensure text is readable (test with white text)
- [ ] Write a concise lesson title (max 8 words for impact)
- [ ] Write 3-5 specific, measurable learning objectives (start each with action verb)
- [ ] Verify all objectives are visible with chosen text color + overlay combo
- [ ] Choose style3 (color-only) when no appropriate image is available

### For Developers
- [ ] Verify `editprimarymedia` on section element distinguishes upload click from text click
- [ ] Confirm `overlayColor` rgba string applied to overlay div via `ng-style`
- [ ] Test `style3` CSS hides background image even when `media.src` is set
- [ ] Verify `style2` 50/50 split renders correctly at all viewport widths
- [ ] Test add objective (`push`) and remove objective (`splice`) operations update ng-repeat
- [ ] Confirm `showObjectives` ng-if preserves `objectives[]` array data on toggle
- [ ] Verify `objectives[$index]` ng-model binding updates array correctly in contenteditable
- [ ] Test that background image CDN URL renders in CSS `background-image: url(...)` format
