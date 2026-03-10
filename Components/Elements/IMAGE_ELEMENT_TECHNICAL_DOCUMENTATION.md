# Image Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants & Alignment](#style-variants--alignment)
6. [Editor Mode Implementation](#editor-mode-implementation)
7. [Settings Panel Reference](#settings-panel-reference)
8. [Upload Flow](#upload-flow)
9. [Authoring Flow](#authoring-flow)
10. [Preview Mode Behavior](#preview-mode-behavior)
11. [Integration & Dependencies](#integration--dependencies)
12. [CSS Reference](#css-reference)
13. [Known Behaviors & Notes](#known-behaviors--notes)
14. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Image Element** (`dataType: "image"`) is the primary standalone image display component. It supports image upload via click, configurable alignment (left/center/right), optional header text (style1), figcaption, outline border box, and full accessibility alt text. The directive is shared and reused in layout column contexts and as inline image containers within the Text (Paragraph) element.

### Key Capabilities

- Image upload via click (`editprimarymedia` directive)
- Three alignment modes: left, center, right
- Two style variants: style1 (with optional header), style2 (clean, no header)
- Optional header text above the image (style1 only)
- Optional caption text (figcaption) below image
- Outline border box with configurable background color
- Accessibility alt text (max 2000 chars)
- Shared directive — works in standalone, layout columns, and inline paragraph context
- No student interaction — content-only display element

### Component Identifier

```javascript
"dataType": "image"
```

### Component Registration (config.js)

```javascript
{
  name: "Image",
  dataType: "image",
  url: "templates/image.html",
  json: "templates/image/image.json",
  settingsURL: "templates/image/image-settings-pannel.html",
  iconClass: "icon-image"
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
│  (dataType:"image")     (drag-drop)            (canvas inject)       │
│                               │                                      │
│                               ▼                                      │
│          ┌────────────────────────────────────────┐                  │
│          │  image.html (Canvas Template)           │                  │
│          │  [imageTemplate directive]              │                  │
│          │  <img editprimarymedia>                 │                  │
│          └────────────────────────────────────────┘                  │
│                    │                   │                             │
│                    ▼                   ▼                             │
│       ┌───────────────────┐  ┌──────────────────────────────┐       │
│       │ image-directive.js │  │ image-settings-pannel.html   │       │
│       │ (imageTemplate     │  │ (Settings Panel)             │       │
│       │  shared directive) │  └──────────────────────────────┘       │
│       └───────────────────┘           │                             │
│                    │                  ▼                              │
│                    │        Settings Controls:                       │
│                    │        - Style selector (style1/style2)         │
│                    │        - Alignment (left/center/right)          │
│                    │        - Show Header checkbox                   │
│                    │        - Show Caption checkbox                  │
│                    │        - Alt Text input                         │
│                    │        - Outline radio + color                  │
│                    ▼                                                 │
│          fieldData (savedJson)                                       │
│          - caption                                                   │
│          - media.src, media.align                                    │
│          - TemplateData.introduction (header text)                   │
│          - settings.*                                                │
│                                                                      │
│                    │                                                 │
│                    ▼                                                 │
│       ┌──────────────────────────────────────────┐                  │
│       │   ShellService (Image Upload)             │                  │
│       │   POST image → CDN URL → media.src        │                  │
│       └──────────────────────────────────────────┘                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
├── editor/
│   └── image-directive.js              ← imageTemplate shared directive
│                                          (standalone + layout + inline)
│
├── templates/
│   ├── image.html                      ← AngularJS canvas template
│   └── image/
│       ├── image-settings-pannel.html  ← Settings panel (note: "pannel" typo in filename)
│       └── image.json                  ← Default configuration JSON
│
└── css/
    └── authoring/
        └── authoring-style.css         ← Shared element styles
```

> **Note**: The settings panel file is named `image-settings-pannel.html` (double "n") — this is a known typo in the codebase. Preserve the exact filename.

### `image.json` — Default Configuration

```json
{
  "identifier": "image",
  "caption": "",
  "media": {
    "src": "",
    "align": "center",
    "outline": ""
  },
  "TemplateData": {
    "introduction": ""
  },
  "settings": {
    "altText": "",
    "captiondisplay": false,
    "isHeaderVisible": false,
    "outline": "",
    "outlineBgColor": "#ffffff",
    "styleSelected": "style1",
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
| `identifier` | string | `"image"` | Component type identifier |
| `caption` | string | `""` | Caption text below image (figcaption) |
| `media` | object | `{}` | Image source and alignment |
| `TemplateData` | object | `{}` | Header text storage |
| `settings` | object | `{}` | Display settings |

### `media` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `src` | string | `""` | Image CDN URL after upload |
| `align` | string | `"center"` | Alignment: `"left"` / `"center"` / `"right"` |
| `outline` | string | `""` | Inline CSS outline string (legacy field) |

### `TemplateData` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `introduction` | string | `""` | Header text above image (style1 only) |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `altText` | string | `""` | Accessibility alt text (max 2000 chars) |
| `captiondisplay` | boolean | `false` | Show/hide figcaption below image |
| `isHeaderVisible` | boolean | `false` | Show/hide header text (style1 only) |
| `outline` | string | `""` | Border class: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Background color of outline box |
| `styleSelected` | string | `"style1"` | Visual style: `"style1"` / `"style2"` |
| `metaTags` | array | `[]` | Content search metadata tags |
| `dimensionInfo` | array | `[]` | Inline image dimension tracking |

### Complete fieldData Example — Image with Caption and Header

```json
{
  "identifier": "image",
  "caption": "Fig. 1: Human digestive system anatomy",
  "media": {
    "src": "https://cdn.example.com/images/digestive-system.jpg",
    "align": "center",
    "outline": ""
  },
  "TemplateData": {
    "introduction": "Anatomy of the Human Digestive System"
  },
  "settings": {
    "altText": "Diagram of the human digestive system showing stomach, small intestine, and large intestine",
    "captiondisplay": true,
    "isHeaderVisible": true,
    "outline": "outlineBg",
    "outlineBgColor": "#f9f9f9",
    "styleSelected": "style1",
    "metaTags": ["anatomy", "biology", "digestive"],
    "dimensionInfo": []
  }
}
```

---

## Style Variants & Alignment

### Style Variants

| Style | Header Area | Image Layout |
|---|---|---|
| `style1` | Optional header text above image (controlled by `isHeaderVisible`) | Standard figure layout |
| `style2` | No header — always hidden regardless of `isHeaderVisible` | Clean figure-only layout |

### Visual Reference

```
style1 (with header + caption):
  ┌──────────────────────────────────┐
  │  [Header: Introduction text]     │   ← TemplateData.introduction
  ├──────────────────────────────────┤
  │                                  │
  │          [IMAGE]                 │
  │                                  │
  └──────────────────────────────────┘
    Fig. 1: Caption text here          ← fieldData.caption

style2 (clean):
  ┌──────────────────────────────────┐
  │                                  │
  │          [IMAGE]                 │
  │                                  │
  └──────────────────────────────────┘
```

### Alignment Behavior

| `media.align` | Visual Effect |
|---|---|
| `"left"` | Image figure floats left; text flows right |
| `"center"` | Image centered in container (default) |
| `"right"` | Image figure floats right; text flows left |

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<section class="component-holder primary-media imageTemplateMainDiv" image-template>

  <!-- Header text — style1 only -->
  <div ng-show="fieldData.settings.isHeaderVisible && fieldData.settings.styleSelected == 'style1'"
       contenteditable="true"
       ng-model="fieldData.TemplateData.introduction"
       class="image-header">
  </div>

  <!-- Figure with image and caption -->
  <figure class="pc-figure {{fieldData.settings.outline}}"
          ng-class="{'align-left': fieldData.media.align == 'left',
                     'align-right': fieldData.media.align == 'right',
                     'align-center': fieldData.media.align == 'center'}"
          ng-style="{'background-color': fieldData.settings.outlineBgColor}">

    <!-- Image (click triggers editprimarymedia upload) -->
    <img class="pc-image primary-image"
         alt="{{fieldData.settings.altText}}"
         ng-src="{{fieldData.media.src}}"
         editprimarymedia>

    <!-- Optional caption -->
    <figcaption ng-show="fieldData.settings.captiondisplay"
                contenteditable="true"
                ng-model="fieldData.caption">
    </figcaption>

  </figure>

</section>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `changeStyle(style)` | `style: string` | Updates `settings.styleSelected` |
| `changeAlignment(align)` | `align: string` | Updates `media.align` |
| `toggleHeader()` | none | Toggles `settings.isHeaderVisible` |
| `toggleCaption()` | none | Toggles `settings.captiondisplay` |
| `setAltText(text)` | `text: string` | Updates `settings.altText` |
| `setOutline(outlineClass)` | `outlineClass: string` | Updates `settings.outline` |
| `setOutlineColor(color)` | `color: string` | Updates `settings.outlineBgColor` |
| `handleImageUpload(response)` | `response: object` | Sets `media.src` from upload response URL |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Style** | Radio (style1/style2) | `fieldData.settings.styleSelected` | `"style1"` / `"style2"` |
| **Alignment** | Button group | `fieldData.media.align` | `"left"` / `"center"` / `"right"` |
| **Show Header** | Checkbox | `fieldData.settings.isHeaderVisible` | Visible only in style1 |
| **Show Caption** | Checkbox | `fieldData.settings.captiondisplay` | |
| **Alt Text** | Text input | `fieldData.settings.altText` | Max 2000 chars |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Background Color** | Color picker | `fieldData.settings.outlineBgColor` | Hex; visible when outline active |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Upload Flow

```
Author clicks image element on canvas
     ↓
editprimarymedia directive intercepts click event
     ↓
File picker opens (accept: image/*)
     ↓
Author selects image file (JPG, PNG, GIF, SVG, WebP)
     ↓
ShellService.upload({ file, type: "image", pageId })
     ↓
POST /api/upload/image → Server processes file
     ↓
Server returns: { url: "https://cdn.example.com/img/file.jpg" }
     ↓
fieldData.media.src = response.url
     ↓
ng-src="{{fieldData.media.src}}" updates <img>
     ↓
Image renders in canvas
```

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Image element from Elements panel onto canvas
       ↓
2. ngcontroller.js $compile(image.html) → injects component
   fieldData initialized from image.json
   Placeholder image / empty figure shown
       ↓
3. Author clicks image placeholder → file picker opens
   Selects image file → uploaded to CDN
   fieldData.media.src = CDN URL → image renders
       ↓
4. Author opens settings panel:
   a. Selects style (style1 / style2)
   b. Chooses alignment (left / center / right)
   c. Toggles Show Header → types intro text in canvas header area
   d. Toggles Show Caption → types caption in canvas figcaption
   e. Enters Alt Text for accessibility
   f. Selects outline style + background color
       ↓
5. Author types caption directly in the canvas figcaption (contenteditable)
   OR types header text in the canvas header div
       ↓
6. Save → fieldData persisted to savedJson
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Image upload (click) | Active | Disabled |
| Header text editing | Contenteditable active | Read-only |
| Caption editing | Contenteditable active | Read-only |
| Settings panel | Accessible | Hidden |
| Alt text | Stored in fieldData | Rendered as `<img alt="">` |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `editor/image-directive.js` | Core directive `imageTemplate` | Shared in 3 contexts |
| `editprimarymedia` directive | Upload click handler on `<img>` | |
| `ShellService` | HTTP API for image upload | Returns CDN URL |
| `editor/ngcontroller.js` | `$compile` + inject + `savedJson` | |
| `editor/ngdragdrop.js` | Drag source from Elements panel | |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on header + caption | |
| `css/authoring/authoring-style.css` | `.pc-figure`, `.outlineBg` styles | Shared |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.imageTemplateMainDiv` | Root section wrapper |
| `.pc-figure` | Figure element base style |
| `.pc-image` | Image element sizing and display |
| `.primary-image` | Primary image identifier |
| `.image-header` | Header text area above image |
| `.outlineBg` | Outline border box class |
| `.align-left` | Float figure left |
| `.align-center` | Center figure in container |
| `.align-right` | Float figure right |

---

## Known Behaviors & Notes

1. **Shared directive — three contexts**: `image-directive.js` is the shared `imageTemplate` directive used in: (a) standalone Image element, (b) layout column image slots, (c) inline image containers inside Text element splitParagraph layout. Scope modifications affect all three contexts.

2. **Two outline fields exist**: `fieldData.media.outline` (legacy — stores inline CSS string) and `fieldData.settings.outline` (stores CSS class name `"outlineBg"`). Both must be kept in sync during save/load to avoid rendering inconsistencies in older content.

3. **`isHeaderVisible` has no effect in style2**: When `styleSelected="style2"`, the header area is CSS-hidden regardless of `isHeaderVisible` value. Switching back to style1 will show the header if `isHeaderVisible=true`.

4. **Alt text max 2000 chars**: The maxlength is enforced by the settings panel input field. Long alt text descriptions improve accessibility for complex diagrams.

5. **`ng-src` prevents broken image state**: The template uses `ng-src` (not `src`) to prevent browsers from immediately requesting an empty or undefined URL before Angular processes the binding.

6. **Clicking image triggers upload — no separate button**: The `editprimarymedia` directive is applied directly to the `<img>` element. Any click on the image area in editor mode triggers the file upload dialog. There is no explicit "Upload Image" button.

7. **`media.align` affects CSS class**: The `media.align` value (`"left"`, `"center"`, `"right"`) drives `ng-class` which applies `.align-left`, `.align-center`, or `.align-right` to the figure element. The CSS handles the visual float/centering.

8. **`dimensionInfo[]` for inline context**: When the image directive is used inside a Text element's splitParagraph layout, `dimensionInfo[]` is populated with the inline image dimensions. In standalone context, `dimensionInfo` remains an empty array.

9. **`TemplateData.introduction` for header**: Header text is stored in `TemplateData.introduction`, not in a root-level `header` field. This is unique to the Image element — do not confuse with the Video element's `header` field at root level.

10. **No SCORM**: The Image element is content-only with no student interaction. No SCORM interactions are generated.

---

## Checklist for Implementation

### For Authors
- [ ] Click image area to upload (file picker opens)
- [ ] Choose appropriate alignment (center for standalone, left/right for text wrap context)
- [ ] Add alt text for all images (accessibility requirement)
- [ ] Use style1 when introductory header text is needed
- [ ] Add caption for figure attribution or supplementary information
- [ ] Test image appearance in preview before publishing

### For Developers
- [ ] Verify `editprimarymedia` directive registered before `imageTemplate`
- [ ] Confirm `ShellService` upload endpoint configured and returns CDN URL
- [ ] Test directive in all 3 contexts (standalone, layout column, paragraph inline)
- [ ] Verify `ng-src` used (not `src`) on `<img>` element
- [ ] Sync `media.outline` (legacy) and `settings.outline` (class-based) on load
- [ ] Test style2 suppresses header even when `isHeaderVisible=true`
- [ ] Confirm alt text rendered as `alt` attribute in packaged HTML output
- [ ] Verify alignment CSS classes apply correctly (float handling in layout context)
