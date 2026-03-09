# Image Element — Technical Documentation

## Overview

A standalone media image component supporting upload, alignment, optional header text, caption, outline styles, and accessibility alt text.

### Component Identifier
```javascript
"dataType": "image"
```

> **Architecture Note:** The Image directive lives in `editor/image-directive.js` (not `templates/`) so it can be reused in standalone context, within layout columns, and as an inline image inside paragraphs.

---

## File Structure

```
KITABOO_Authoring/
├── editor/
│   └── image-directive.js          ← imageTemplate directive (shared)
│
└── templates/
    ├── image.html                   ← AngularJS template
    └── image/
        ├── image-settings-pannel.html
        └── image.json
```

---

## Data Model

### Root Fields

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"image"` |
| `caption` | string | Caption below image |
| `media` | object | Image source info |
| `settings` | object | Display settings |

### media Object

| Field | Type | Description |
|---|---|---|
| `src` | string | Image URL |
| `align` | string | Alignment: `"left"`, `"center"`, `"right"` |
| `outline` | string | CSS outline style string |

### settings Object

| Field | Type | Description |
|---|---|---|
| `altText` | string | Accessibility alt text |
| `captiondisplay` | boolean | Show/hide caption |
| `isHeaderVisible` | boolean | Show/hide header text (style1 only) |
| `outline` | string | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Background color for outlined box |
| `styleSelected` | string | Visual style: `"style1"`, `"style2"` |

---

## Template Structure

```html
<section class='component-holder primary-media imageTemplateMainDiv' image-template>
  <!-- Optional header text (style1 only) -->
  <div ng-show="fieldData.settings.isHeaderVisible && styleSelected == 'style1'"
       contenteditable="true" ng-model="fieldData.TemplateData.introduction">
  </div>
  <figure class='pc-figure' ng-style="{'outline':fieldData.media.outline}">
    <img class='pc-image primary-image' alt={{fieldData.settings.altText}}
         ng-src={{fieldData.media.src}} editprimarymedia>
    <figcaption ng-show="fieldData.settings.captiondisplay"
                contenteditable="true" ng-model="fieldData.caption">
    </figcaption>
  </figure>
</section>
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/image-directive.js` | Core directive (shared) |
| `editprimarymedia` directive | Upload click handler |
| `ShellService` | HTTP API for image upload |
| `editor/ngcontroller.js` | Compile and inject |
