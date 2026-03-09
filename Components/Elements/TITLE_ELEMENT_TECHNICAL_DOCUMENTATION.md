# Title Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants](#style-variants)
6. [Directive Behavior](#directive-behavior)
7. [Settings Panel](#settings-panel)
8. [Integration & Dependencies](#integration--dependencies)
9. [Known Behaviors & Notes](#known-behaviors--notes)

---

## Overview

### Purpose
The Title element (`chapter-headingNew-h1`) is the primary chapter-level heading component. It occupies the full width of the page canvas and supports rich visual customization including background images (with Cropper.js), color themes, overlay opacity, chapter labels, author name, and multiple layout styles.

### Component Identifier
```javascript
"dataType": "chapter-headingNew-h1"
```

### Key Capabilities
- Multiple visual style variants (card-style-1..4, full-bleed-1/2)
- Background image with crop/mask support (Cropper.js)
- Background solid color or gradient
- Color overlay with opacity control
- Editable Chapter Name & Number labels (character-limited)
- Editable Author Name field
- Divider line with custom color
- Apply All / Ignore Apply All toggle
- Undo support for title and author text
- TOC integration

---

## Component Architecture

```
config.js Registry (dataType: chapter-headingNew-h1)
        │
        ▼
ngcontroller.js (Drag-drop + $compile)
        │
        ▼
chapter-heading.html (AngularJS template)
        │
        ▼
chapterHeadingNewTemplate Directive (titleNew-directive.js)
        │
        ├── fieldData (scope, bound to savedJson)
        ├── Settings Panel (chapter-heading-settings-panel.html)
        ├── ShellService API (image upload/crop)
        ├── UndoRedo Stack (headerTitleText + authorName)
        ├── ApplyAll System
        └── TOC Update (updateActivePageToc)
```

---

## File Structure

```
KITABOO_Authoring/
├── config/
│   └── config.js                          ← Widget registry entry
│
└── templates/
    └── titleNew/
        ├── chapter-heading.html           ← AngularJS template (editor)
        ├── chapter-heading-settings-panel.html  ← Settings panel
        ├── scripts/
        │   └── titleNew-directive.js      ← chapterHeadingNewTemplate directive
        ├── styles/
        │   └── titleNew-template.css      ← Component CSS
        └── default/
            └── header.json               ← Default fieldData JSON
```

### config.js Registry Entry

```javascript
{
  name: "Title",
  iconClass: "icon-Hero-header",
  dataType: "chapter-headingNew-h1",
  url: "templates/titleNew/chapter-heading.html",
  json: "templates/titleNew/default/header.json",
  settingsURL: "templates/titleNew/chapter-heading-settings-panel.html",
  isDroppable: true,
  preview: { imgURL: "templates/preview/Title-popup.png" }
}
```

---

## Data Model

All state is stored as `fieldData` in `savedJson[pageNo][uniqueId]`.

### Root-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"chapter-headingNew-h1"` | Component type identifier |
| `headerTitleText` | string | `""` | Main H1 title text |
| `chapterheadingTitleText` | string | `"Chapter"` | Chapter label text (max 7 chars) |
| `headerChapterNo` | string | `"01"` | Chapter number (max 3 chars) |
| `authorName` | string | `""` | Author name field |
| `styleClass` | string | `"card-style-4"` | Active visual style variant |
| `ignoreApplyAll` | boolean | `false` | Exclude from Apply All |
| `settings` | object | — | All style & display settings |

### settings Object (Key Fields)

| Field | Type | Default | Description |
|---|---|---|---|
| `imgOrColorBoolean` | string | `"bg-color"` | Background mode: `"bg-image"` or `"bg-color"` |
| `imageUrl` | string | `"images/image.jpg"` | Background image URL |
| `bgColor` | string | `"#efe7db"` | Background panel color |
| `bgColortitle` | string | `"#7eb1eb"` | Overlay/title panel background color |
| `bgColorpanel` | string | `"#e4164a"` | Chapter label panel color |
| `opacityColortitle` | string | `"0"` | Overlay opacity (0–1) |
| `elementColor` | string | `"#000000"` | Title text color |
| `chapterAlign` | string | `"left"` | Chapter panel alignment |
| `chapternamedisplay` | boolean | `true` | Show/hide chapter name label |
| `chapternumberdisplay` | boolean | `true` | Show/hide chapter number |
| `allowAuthorName` | boolean | `true` | Show/hide author name |
| `allowDivider` | boolean | `true` | Show/hide divider line |
| `dividerColor` | string | `"#000000"` | Divider color |
| `labeltext` | boolean | `true` | Show/hide chapter label section |
| `style_tab` | array | — | Style picker groups |
| `colorvalues` | array | 10 colors | Color palette |
| `altText` | string | `""` | Image alt text |

---

## Style Variants

| Style Class | Description |
|---|---|
| `card-style-1` | Side panel with chapter label + full background image |
| `card-style-2` | Full bleed background image, compact layout |
| `card-style-3` | Split layout with color panel and image |
| `card-style-4` | Default — bold title with bottom divider |
| `full-bleed-1` | Minimal text-only, no background |
| `full-bleed-2` | Full-width colored panel with overlay |

---

## Directive Behavior

### Initialization (link function)

```javascript
// 1. Undo stack setup
scope.undoHeaderTitleTextStack = [];
scope.undoTitleAuthorNameStack = [];

// 2. First-load ApplyAll check
if (element.parents('.template-main-body').eq(0).hasClass('first-time-load')) {
  if (scope.$parent.ApplyToAllStyleSettingJson['chapter-headingNew-h1'].styleSettingFlag) {
    // Apply stored style settings, preserve text content
  }
}

// 3. Font size normalization on load
element.find('.headerTitle').css('font-size', fontValue + 'rem');

// 4. Click → load settings panel
$(element).parents('.sd-item').bind('click', function(e) {
  con.currSettings = con.savedJson[pageNo][uniqueId].settings;
  con.settingsUrl = templateScope.settingsPath;
  con.displaySettingPanel();
});
```

### Special Constraints

| Field | Constraint |
|---|---|
| Chapter Name | Max 7 characters (enforced via keydown) |
| Chapter Number | Max 3 characters (enforced via keydown) |
| Enter key | Blocked in chapter name field |
| Paste | Custom handler strips HTML formatting |

### Image Upload & Crop

The Title element integrates **Cropper.js**:
1. Author uploads image via settings panel
2. Image uploaded to server via `ShellService.httpServiceCall(POST)`
3. Cropper initialized with `aspectRatio: 2/1`, drag mode
4. On "Crop" click: canvas exported as JPEG → re-uploaded → URL stored in `fieldData.settings.imageUrl`
5. Original image preserved in `data-og-img` attribute

---

## Settings Panel

### Style Tab
- Visual style picker (6 thumbnail options)
- Color palette switcher (10 predefined colors)
- Label style picker (4 options)

### Background Tab
- Toggle: image vs. solid color
- Image upload / replace / crop
- Image library selector
- Color picker for background color
- Overlay color + opacity slider

### Text & Layout Tab
- Chapter alignment (left/right)
- Show/hide chapter name & number
- Show/hide author name
- Show/hide divider line + color picker
- Title text color
- Apply All / Ignore toggle
- Alt text input

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/ngcontroller.js` | Compiles and injects template; ApplyAll, undo/redo, TOC |
| `editor/ngdragdrop.js` | Drag-drop from Elements panel |
| `editor/sd.js` | JSON serialization for save & load |
| `editor/UndoRedo.js` | Global undo/redo system |
| `ShellService` | HTTP wrapper for image upload API |
| `Cropper.js` | Third-party image crop library |
| `css/authoring/authoring-style.css` | Global element styles |
| `templates/titleNew/styles/titleNew-template.css` | Component-specific styles |

---

## Known Behaviors & Notes

- **Apply All:** When Apply All is active, a new Title inherits style settings but text content fields are reset to defaults.
- **Duplicate Component:** When duplicated (`data-duplicatecomp="true"`), text content is preserved even when Apply All is active.
- **TOC Integration:** `headerTitleText` is registered in the TOC. The directive calls `con.updateActivePageToc()` on click.
- **Font Size:** Font size is re-calculated and applied in a `setTimeout(10ms)` to allow DOM rendering before measuring.
