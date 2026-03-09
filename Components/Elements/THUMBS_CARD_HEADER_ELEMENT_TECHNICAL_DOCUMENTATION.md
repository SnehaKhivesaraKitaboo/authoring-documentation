# Thumbs Card Header Element — Technical Documentation

## Overview

A card-style section header with a selectable icon (48×48px) and an editable heading, supporting custom background and stroke colors. Used to introduce categorized content sections.

### Component Identifier
```javascript
"dataType": "thumbs-card-header"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── thumbs-card-header/
        ├── thumbs-card-header.html                   ← AngularJS template
        ├── thumbs-card-header-settings-pannel.html   ← Settings panel
        ├── scripts/
        │   └── thumbs-card-header-directive.js       ← Directive
        ├── styles/
        │   └── thumbs-card-header-template.css
        └── default/
            └── thumbs-card-header.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"thumbs-card-header"` |
| `introductionText` | string | Editable heading text |
| `settings` | object | Style and icon settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `headerBgColor` | string | Card background color |
| `headerStrokeColor` | string | Card border/stroke color |
| `thumbsCardIcons` | array | Available icons (each with `icon` URL) |
| `thumbsCardActiveIcons` | number | Index of active icon |

---

## Icon Selection Pattern

```javascript
// Icon array structure
settings.thumbsCardIcons = [
  { icon: "images/thumbs-card-icon-1.svg" },
  { icon: "images/thumbs-card-icon-2.svg" },
  // ...
];
settings.thumbsCardActiveIcons = 0; // Active index

// Template binding
src="{{fieldData.settings.thumbsCardIcons[fieldData.settings.thumbsCardActiveIcons].icon}}"
```

---

## Template Structure

```html
<section class='component-holder thumbs-card-header' thumbs-card-header-template>
  <section class="thumbs-card-container"
    ng-style="{'background-color': fieldData.settings.headerBgColor,
               'border-color': fieldData.settings.headerStrokeColor}">
    <div class="thumbs-card-header-div">
      <span>
        <img style="width:100%; min-width:48px; max-width:48px;"
             width="48" height="48"
             src="{{...thumbsCardIcons[...thumbsCardActiveIcons].icon}}" alt="">
      </span>
      <div contenteditable="true" placeholder="Thumbs Card Header"
           ng-model="fieldData.introductionText"
           class="sc-intro thumbs-card-header-heading editables saveClick">
      </div>
    </div>
  </section>
</section>
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `thumbs-card-header-directive.js` | Core directive |
| `editor/ngcontroller.js` | Compile and inject |
| `editor/sd.js` | JSON serialization |
| `thumbs-card-header-template.css` | Component styles |
| Icon image assets | SVG/PNG files for the icon picker |
