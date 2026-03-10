# Thumbs Card Header Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants & Image Position](#style-variants--image-position)
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

The **Thumbs Card Header Element** (`dataType: "thumbs-card-header"`) is a visually rich card-style introduction component that pairs a thumbnail image with a title and descriptive text. It is used as a visual introduction to units, lessons, topics, or case studies — providing a compelling entry point with an image, bold title, and descriptive context text. It is purely a display element with no student interaction.

### Key Capabilities

- Thumbnail image upload (displayed alongside text)
- Card title text (contenteditable)
- Description text with rich text formatting (floating toolbar)
- **2 layout styles**: horizontal card (image left + text right) vs vertical card (image top + text below)
- **3 image position options**: left, right, top
- Custom card background color and border color
- Optional show/hide description
- Outline border styling

### Component Identifier

```javascript
"dataType": "thumbs-card-header"
```

### Component Registration (config.js)

```javascript
{
  name: "Thumbs Card Header",
  dataType: "thumbs-card-header",
  url: "templates/thumbs-card-header/thumbs-card-header.html",
  json: "templates/thumbs-card-header/default/thumbs-card-header.json",
  settingsURL: "templates/thumbs-card-header/thumbs-card-header-settings.html",
  iconClass: "icon-thumbs-card"
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
│  "thumbs-card-header")           │                                   │
│                                  ▼                                   │
│        ┌──────────────────────────────────────────────────┐          │
│        │  thumbs-card-header.html (Canvas Template)        │          │
│        │  [thumbsCardHeaderTemplate directive]             │          │
│        │  ┌──────────┬──────────────────────────────┐     │          │
│        │  │ Thumbnail│ Title (contenteditable)       │     │          │
│        │  │   Image  │ Description (rich text)       │     │          │
│        │  └──────────┴──────────────────────────────┘     │          │
│        └──────────────────────────────────────────────────┘          │
│                   │                      │                           │
│                   ▼                      ▼                           │
│      ┌──────────────────────────┐  ┌───────────────────────────┐    │
│      │ thumbs-card-header-      │  │ thumbs-card-header-       │    │
│      │ directive.js             │  │ settings.html             │    │
│      └──────────────────────────┘  └───────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│          fieldData                Settings Controls:                 │
│          - title                   - Style (style1/style2)           │
│          - description (HTML)      - Image Position (left/right/top) │
│          - media.src (thumbnail)   - Show Description                │
│          - settings.*              - BG/Border Color pickers         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── thumbs-card-header/
        ├── thumbs-card-header.html          ← Canvas template
        ├── thumbs-card-header-settings.html ← Settings panel
        ├── scripts/
        │   └── thumbs-card-header-directive.js ← Directive
        ├── styles/
        │   └── thumbs-card-header-template.css ← Styles
        └── default/
            └── thumbs-card-header.json      ← Default config
```

### `thumbs-card-header.json` — Default Configuration

```json
{
  "identifier": "thumbs-card-header",
  "title": "Unit Title",
  "description": "<p>Enter unit description here...</p>",
  "media": {
    "src": "",
    "align": "left"
  },
  "settings": {
    "styleSelected": "style1",
    "showDescription": true,
    "bgColor": "#ffffff",
    "borderColor": "#e0e0e0",
    "imgPosition": "left",
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
| `identifier` | string | `"thumbs-card-header"` | Component type identifier |
| `title` | string | `"Unit Title"` | Card title text (contenteditable plain text) |
| `description` | string (HTML) | `"<p>...</p>"` | Description body — stores raw HTML |
| `media` | object | `{}` | Thumbnail image source |
| `settings` | object | `{}` | Layout and style settings |

### `media` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `src` | string | `""` | CDN URL of uploaded thumbnail image |
| `align` | string | `"left"` | Image alignment (synced with `imgPosition`) |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `styleSelected` | string | `"style1"` | Layout style: `"style1"` (horizontal) / `"style2"` (vertical) |
| `showDescription` | boolean | `true` | Show/hide description text |
| `bgColor` | string | `"#ffffff"` | Card background color |
| `borderColor` | string | `"#e0e0e0"` | Card border color |
| `imgPosition` | string | `"left"` | Image position: `"left"` / `"right"` / `"top"` |
| `outline` | string | `""` | Outer border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Outer border background |
| `metaTags` | array | `[]` | Content search metadata |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### Complete fieldData Example — Unit Card

```json
{
  "identifier": "thumbs-card-header",
  "title": "Unit 2: Environmental Science",
  "description": "<p>In this unit, you will explore <strong>ecosystems</strong>, <em>biodiversity</em>, and the impact of human activity on natural environments.</p><ul><li>Ecosystems and Food Chains</li><li>Biodiversity and Habitats</li><li>Climate Change Impacts</li></ul>",
  "media": {
    "src": "https://cdn.example.com/images/environment-thumb.jpg",
    "align": "left"
  },
  "settings": {
    "styleSelected": "style1",
    "showDescription": true,
    "bgColor": "#f0f7f0",
    "borderColor": "#4CAF50",
    "imgPosition": "left",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "metaTags": ["unit", "environment", "science"],
    "dimensionInfo": []
  }
}
```

---

## Style Variants & Image Position

### Style Variants

| Style | Layout | Typical Use |
|---|---|---|
| `style1` | Horizontal card — thumbnail left/right + title/description right/left | Standard unit/lesson intro |
| `style2` | Vertical card — thumbnail top + title/description below | Mobile-friendly, portrait-oriented cards |

### Image Position Options

| `imgPosition` | Effect in style1 | Effect in style2 |
|---|---|---|
| `"left"` | Thumbnail on left, text on right | Thumbnail at top |
| `"right"` | Thumbnail on right, text on left | Thumbnail at top (overrides to top) |
| `"top"` | Forces vertical layout (thumbnail at top) | Thumbnail at top (default) |

### Visual Reference

```
style1, imgPosition="left":
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐   Unit 2: Environmental Science        │
│  │          │   ────────────────────────────────     │
│  │  [IMAGE] │   In this unit, you will explore       │
│  │          │   ecosystems, biodiversity...           │
│  └──────────┘                                        │
└──────────────────────────────────────────────────────┘

style1, imgPosition="right":
┌──────────────────────────────────────────────────────┐
│  Unit 2: Environmental Science   ┌──────────┐        │
│  ─────────────────────────────   │          │        │
│  In this unit, you will explore  │  [IMAGE] │        │
│  ecosystems, biodiversity...     └──────────┘        │
└──────────────────────────────────────────────────────┘

style2 (vertical):
┌──────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────┐│
│  │                [IMAGE / thumbnail]               ││
│  └──────────────────────────────────────────────────┘│
│  Unit 2: Environmental Science                        │
│  ─────────────────────────────                        │
│  In this unit, you will explore...                    │
└──────────────────────────────────────────────────────┘
```

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<div class="component-holder thumbs-card {{fieldData.settings.styleSelected}}
            img-{{fieldData.settings.imgPosition}} {{fieldData.settings.outline}}"
     thumbs-card-header-template
     ng-style="{
       'background-color': fieldData.settings.bgColor,
       'border-color': fieldData.settings.borderColor
     }">

  <!-- Thumbnail Image -->
  <div class="thumb-image-wrapper">
    <img class="thumb-image"
         ng-src="{{fieldData.media.src}}"
         editprimarymedia
         alt="Card thumbnail">
    <!-- Placeholder when no image -->
    <div class="thumb-placeholder" ng-if="!fieldData.media.src">
      <span>Click to upload image</span>
    </div>
  </div>

  <!-- Text Content -->
  <div class="thumb-content">

    <!-- Title -->
    <h3 class="thumb-title"
        contenteditable="true"
        ng-model="fieldData.title">
    </h3>

    <!-- Description (Rich text) -->
    <div class="thumb-description"
         ng-if="fieldData.settings.showDescription"
         contenteditable="true"
         ng-model="fieldData.description">
    </div>

  </div>

</div>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `changeStyle(style)` | `style: string` | Updates `styleSelected` |
| `changeImgPosition(pos)` | `pos: string` | Updates `imgPosition` and `media.align` |
| `toggleDescription()` | none | Toggles `showDescription` (ng-if) |
| `setBgColor(color)` | `color: string` | Updates `bgColor` |
| `setBorderColor(color)` | `color: string` | Updates `borderColor` |
| `handleImageUpload(response)` | `response: object` | Sets `media.src` from upload response |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Style** | Radio (style1/style2) | `fieldData.settings.styleSelected` | Horizontal vs vertical layout |
| **Image Position** | Button group (left/right/top) | `fieldData.settings.imgPosition` | Position of thumbnail relative to text |
| **Show Description** | Checkbox | `fieldData.settings.showDescription` | Removes description from DOM |
| **Background Color** | Color picker | `fieldData.settings.bgColor` | Hex; card background |
| **Border Color** | Color picker | `fieldData.settings.borderColor` | Hex; card border |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Thumbs Card Header element from Elements panel
       ↓
2. Component renders with image placeholder + placeholder title/description
       ↓
3. Author clicks image area → file picker opens (editprimarymedia)
   Uploads thumbnail image → CDN URL stored in media.src
       ↓
4. Author opens settings panel:
   - Selects style (style1 horizontal / style2 vertical)
   - Sets image position (left / right / top)
   - Sets card background color
   - Sets card border/accent color
       ↓
5. Author edits text in canvas:
   - Click title → type unit/lesson title
   - Click description area → floating toolbar activates
   - Format description text (bold key terms, add lists of objectives)
       ↓
6. Optionally toggles Show Description (hide for image+title only card)
       ↓
7. Save → fieldData persisted (description as HTML, title as string)
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Image upload (click) | Active | Disabled |
| Title editing | Contenteditable | Read-only |
| Description editing | Contenteditable + toolbar | Read-only |
| Settings panel | Accessible | Hidden |
| Card layout | Rendered per style/position | Same rendering |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `thumbs-card-header-directive.js` | Core directive | Style and position management |
| `editprimarymedia` directive | Thumbnail image upload | Click on img triggers upload |
| `ShellService` | HTTP API for image upload | Returns CDN URL |
| `editor/floatingTextPanel.js` | Rich text toolbar for description | Activates on description selection |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on title and description | |
| `thumbs-card-header-template.css` | Card layout styles | Component-specific |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.thumbs-card` | Root card container |
| `.thumbs-card.style1` | Horizontal layout modifier |
| `.thumbs-card.style2` | Vertical layout modifier |
| `.thumbs-card.img-left` | Image positioned left |
| `.thumbs-card.img-right` | Image positioned right |
| `.thumbs-card.img-top` | Image positioned top |
| `.thumb-image-wrapper` | Image container |
| `.thumb-image` | Thumbnail `<img>` |
| `.thumb-placeholder` | Upload prompt placeholder |
| `.thumb-content` | Title + description container |
| `.thumb-title` | Title `<h3>` |
| `.thumb-description` | Description rich-text area |

---

## Known Behaviors & Notes

1. **`style2` overrides imgPosition to "top"**: When `style2` is selected, the CSS layout forces the image above the text regardless of the `imgPosition` setting value. Setting `imgPosition="right"` has no visible effect in style2.

2. **`description` stores raw HTML**: The description field uses the floating toolbar and stores formatted HTML in `fieldData.description`. Same storage/sanitization considerations as the Text element body.

3. **`title` is plain text**: The card title is a plain contenteditable string — no floating toolbar, no HTML markup. Title text is stored as plain string in `fieldData.title`.

4. **`showDescription=false` uses ng-if**: Description div is removed from DOM. HTML content in `fieldData.description` is preserved — reappears when toggled back on.

5. **`imgPosition` and `media.align` synced**: When `imgPosition` changes, `media.align` is also updated to match. Both fields should always be in sync.

6. **Card is not a navigation element**: Despite looking like a clickable card, there are no click handlers for student navigation. Authors who want navigation should use a different component type (e.g., Flashcard widget or Carousel widget).

7. **No TOC integration**: This component does not use `.tocTextContent` class and does not appear in the TOC panel.

8. **Image is decorative — no alt text field**: The default template does not expose an alt text setting for the thumbnail image. For accessibility compliance, the directive should set a meaningful alt attribute from the title text. Verify this behavior in the implementation.

9. **BgColor and borderColor are card-level**: These colors style the outer card container, not individual elements within. The title and description text colors inherit from platform CSS unless explicitly styled via floating toolbar.

10. **No SCORM**: Display-only element — no student interaction tracking.

---

## Checklist for Implementation

### For Authors
- [ ] Upload a high-quality thumbnail image (recommended: 16:9 or square ratio)
- [ ] Write a clear unit/lesson title
- [ ] Write a compelling 2-4 sentence description; use bold for key terms
- [ ] Choose style and image position that best suits your content layout
- [ ] Set card background and border colors to match your course theme
- [ ] Test appearance in preview (especially with image loaded)

### For Developers
- [ ] Verify `editprimarymedia` triggers on thumbnail `<img>` area
- [ ] Confirm `style2` CSS overrides image to top position regardless of `imgPosition` value
- [ ] Test `imgPosition` CSS class (`img-left`, `img-right`, `img-top`) applied to root element
- [ ] Verify `showDescription` ng-if preserves `fieldData.description` HTML on toggle
- [ ] Confirm floating toolbar activates on description area (not title)
- [ ] Check that thumbnail image has appropriate alt attribute for accessibility
- [ ] Test card layout at common viewport widths (mobile breakpoints for style2)
