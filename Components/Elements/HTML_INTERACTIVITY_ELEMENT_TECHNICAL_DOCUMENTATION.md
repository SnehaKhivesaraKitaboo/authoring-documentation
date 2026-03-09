# HTML Interactivity Element — Technical Documentation

## Overview

A ZIP-package-based interactive content element that embeds custom HTML/JavaScript interactivities (simulations, animations, games) within a page. Supports inline playback, cover image, instruction text, header, and caption.

### Component Identifier
```javascript
"dataType": "html-interactivity"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── htmlInteractivity/
        ├── html-interactivity.html              ← AngularJS template
        ├── html-interactive-settings-panel.html ← Settings panel
        ├── scripts/
        │   └── html-interactive-directive.js    ← Directive
        ├── styles/
        │   └── html-interactive-template.css
        └── default/
            └── html-interactivity.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"html-interactivity"` |
| `indexLink` | string | URL to extracted ZIP's `index.html` |
| `align` | string | Component alignment |
| `settings` | object | Display and playback settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `playInline` | boolean | Inline `<object>` playback on canvas |
| `imageuploaded` | boolean | Cover image uploaded |
| `imageUrl` | string | Cover image URL |
| `imageWidth` / `imageHeight` | string | Cover image dimensions |
| `htmlWidth` / `htmlHeight` | string | Container dimensions |
| `isInstructionText` | boolean | Show instruction text section |
| `instructionText` | string | Instruction text (HTML) |
| `isHeaderText` | boolean | Show header text section |
| `headerText` | string | Header text (HTML) |
| `isCaptionText` | boolean | Show caption section |
| `caption` | string | Caption text |
| `outline` | string | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Outline background color |
| `altText` | string | Accessibility alt text |
| `fileuploaded` | boolean | ZIP file uploaded |

---

## Playback Modes

### Inline Mode
```html
<object data="{{fieldData.indexLink}}" style="width:100%;height:100%;">
  <p>Your Browser Does Not Support HTML Interactivity</p>
</object>
```
The interactivity is embedded directly on the canvas.

### Cover Image Mode
A static cover image shows on canvas. In the reader, clicking it launches the content in a modal or full-screen view.

---

## ZIP Validation

When a ZIP is uploaded, the system validates it contains a valid `index.html`. If invalid:
```
Modal ID: #html-interactivity-valid
Message: "Please try a valid zip file."
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `html-interactive-directive.js` | Core directive |
| `ShellService` | HTTP API for ZIP upload and extraction |
| `editor/ngcontroller.js` | Compile and inject |
| Bootstrap Modal | Validation error dialog |
