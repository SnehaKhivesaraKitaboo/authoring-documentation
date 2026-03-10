# HTML Interactivity Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [ZIP Upload & Extraction Flow](#zip-upload--extraction-flow)
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

The **HTML Interactivity Element** (`dataType: "html-interactivity"`) enables authors to embed custom HTML5 interactive content inside lessons by uploading a ZIP file. The ZIP is extracted server-side and the `index.html` entry point is served via a sandboxed `<iframe>`. This allows third-party or custom-built HTML interactives (animations, simulations, mini-games, drag-and-drop exercises) to be embedded without modification to the authoring platform.

### Key Capabilities

- **ZIP file upload** — upload a complete HTML package as a ZIP archive
- **Server-side extraction** — server extracts ZIP and serves `index.html`
- **Sandboxed iframe** — content isolated from authoring environment
- **Configurable dimensions** — author sets iframe height and width
- **Optional caption** — descriptive text below the iframe
- **Outline border** with configurable background color
- No student interaction tracking (SCORM within the HTML package itself handles tracking, if any)

### Component Identifier

```javascript
"dataType": "html-interactivity"
```

### Component Registration (config.js)

```javascript
{
  name: "HTML Interactivity",
  dataType: "html-interactivity",
  url: "templates/html-interactivity/html-interactivity.html",
  json: "templates/html-interactivity/default/html-interactivity.json",
  settingsURL: "templates/html-interactivity/html-interactivity-setting.html",
  iconClass: "icon-html-interactivity"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      KITABOO Authoring Tool                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ─────────────────► ngcontroller.js ─────► $compile        │
│  (dataType:"html-interactivity")  (drag-drop)        (canvas inject) │
│                                        │                             │
│                                        ▼                             │
│          ┌──────────────────────────────────────────────┐            │
│          │  html-interactivity.html (Canvas Template)    │            │
│          │  [htmlInteractivity directive]                │            │
│          │  <iframe ng-src="fieldData.iframeUrl">        │            │
│          └──────────────────────────────────────────────┘            │
│                    │                         │                       │
│                    ▼                         ▼                       │
│       ┌────────────────────────┐  ┌─────────────────────────────┐   │
│       │ html-interactivity-   │  │ html-interactivity-setting  │   │
│       │  directive.js         │  │  .html (Settings Panel)     │   │
│       └────────────────────────┘  └─────────────────────────────┘   │
│                    │                                                 │
│                    ▼                                                 │
│       ┌──────────────────────────────────────────────┐              │
│       │   ZIP Upload → ShellService                   │              │
│       │                                               │              │
│       │   1. POST ZIP to /api/upload/zip-interactivity│              │
│       │   2. Server extracts ZIP                      │              │
│       │   3. Server serves extracted folder           │              │
│       │   4. Returns iframeUrl pointing to index.html │              │
│       │   5. fieldData.iframeUrl = returned URL       │              │
│       │   6. <iframe ng-src="iframeUrl"> renders      │              │
│       └──────────────────────────────────────────────┘              │
│                    │                                                 │
└────────────────────┼─────────────────────────────────────────────────┘
                     ▼
        ┌────────────────────────────────────────┐
        │          Sandboxed iframe               │
        │   (Isolated HTML5 interactive content)  │
        │   - No access to authoring APIs         │
        │   - Own JS context                      │
        │   - CDN-hosted extracted content        │
        └────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── html-interactivity/
        ├── html-interactivity.html         ← AngularJS canvas template
        ├── html-interactivity-setting.html ← Settings panel
        ├── scripts/
        │   └── html-interactivity-directive.js ← htmlInteractivity directive
        └── default/
            └── html-interactivity.json     ← Default configuration
```

### `html-interactivity.json` — Default Configuration

```json
{
  "identifier": "html-interactivity",
  "iframeUrl": "",
  "caption": "",
  "settings": {
    "height": "400",
    "width": "100%",
    "optionalcaption": false,
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
| `identifier` | string | `"html-interactivity"` | Component type identifier |
| `iframeUrl` | string | `""` | URL to extracted `index.html` (set by server after ZIP upload) |
| `caption` | string | `""` | Optional caption text below iframe |
| `settings` | object | `{}` | Display and dimension settings |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `height` | string | `"400"` | iframe height in pixels (numeric string) |
| `width` | string | `"100%"` | iframe width (px value or `"100%"`) |
| `optionalcaption` | boolean | `false` | Show/hide caption text |
| `outline` | string | `""` | Border style: `"outlineBg"` or `""` (none) |
| `outlineBgColor` | string | `"#ffffff"` | Background color of outline box |
| `metaTags` | array | `[]` | Content search metadata tags |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### Complete fieldData Example

```json
{
  "identifier": "html-interactivity",
  "iframeUrl": "https://cdn.example.com/interactives/simulation-v1/index.html",
  "caption": "Interactive: Photosynthesis Simulation",
  "settings": {
    "height": "600",
    "width": "100%",
    "optionalcaption": true,
    "outline": "outlineBg",
    "outlineBgColor": "#f0f8ff",
    "metaTags": ["simulation", "interactive", "science"],
    "dimensionInfo": []
  }
}
```

---

## ZIP Upload & Extraction Flow

### Required ZIP Structure

```
my-interactive.zip
├── index.html          ← REQUIRED — entry point (must be at root)
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── lib.js
├── assets/
│   ├── images/
│   └── sounds/
└── data/
    └── content.json
```

> **Critical**: `index.html` must be at the root level of the ZIP. Nested entry points are not supported.

### Upload & Extraction Sequence

```
1. Author clicks "Upload ZIP" in settings panel
         ↓
2. File picker opens (accept: .zip)
         ↓
3. Author selects ZIP file
         ↓
4. ShellService.uploadZip(file) called
   POST /api/upload/zip-interactivity
   Headers: Content-Type: multipart/form-data
         ↓
5. Server receives ZIP
   Server extracts ZIP contents to CDN storage
   Root structure: /cdn/interactives/{unique-id}/
         ↓
6. Server validates index.html exists at root
   If missing → error returned
         ↓
7. Server generates iframe URL:
   "https://cdn.example.com/interactives/{unique-id}/index.html"
         ↓
8. Server returns: { iframeUrl: "https://cdn..." }
         ↓
9. fieldData.iframeUrl = response.iframeUrl
         ↓
10. Angular binding: ng-src="{{fieldData.iframeUrl | trusted}}"
    iframe renders extracted interactive content
```

### Error States

| Error Condition | Behavior |
|---|---|
| ZIP missing `index.html` | Server returns error; `iframeUrl` not set; placeholder shown |
| ZIP upload fails (network) | Error toast displayed; `iframeUrl` remains empty |
| Server extraction error | Error response; empty iframe state |
| `iframeUrl` empty | Placeholder div shown instead of iframe |

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<section class="component-holder html-interactivity-container" html-interactivity-template>

  <!-- iframe placeholder shown when no iframeUrl -->
  <div class="iframe-placeholder" ng-if="!fieldData.iframeUrl">
    <p>Upload a ZIP file to embed an HTML interactive</p>
    <button class="upload-btn" ng-click="triggerZipUpload()">
      Upload ZIP
    </button>
  </div>

  <!-- iframe — shown when iframeUrl is set -->
  <div ng-if="fieldData.iframeUrl"
       class="iframe-wrapper {{fieldData.settings.outline}}"
       ng-style="{'background-color': fieldData.settings.outlineBgColor}">

    <iframe ng-src="{{fieldData.iframeUrl | trusted}}"
            ng-style="{'height': fieldData.settings.height + 'px',
                       'width': fieldData.settings.width}"
            frameborder="0"
            scrolling="auto"
            allowfullscreen>
    </iframe>

    <!-- Optional caption -->
    <div class="html-caption"
         ng-if="fieldData.settings.optionalcaption"
         contenteditable="true"
         ng-model="fieldData.caption">
    </div>

  </div>

</section>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `triggerZipUpload()` | none | Opens file picker for ZIP selection |
| `handleZipUpload(file)` | `file: File` | Calls ShellService, updates `iframeUrl` |
| `setHeight(px)` | `px: string` | Updates `settings.height` |
| `setWidth(val)` | `val: string` | Updates `settings.width` (px or %) |
| `toggleCaption()` | none | Toggles `settings.optionalcaption` |
| `replaceZip()` | none | Opens file picker to replace existing ZIP |
| `clearInteractive()` | none | Resets `iframeUrl` to empty string |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Upload ZIP** | File button | `fieldData.iframeUrl` (set by server) | `.zip` format only; `index.html` required |
| **Replace ZIP** | File button | Replaces existing `iframeUrl` | Same constraints as upload |
| **Height** | Number input | `fieldData.settings.height` | Pixels; min 100, max 2000; default 400 |
| **Width** | Text input | `fieldData.settings.width` | Pixels (`"800"`) or percent (`"100%"`) |
| **Show Caption** | Checkbox | `fieldData.settings.optionalcaption` | |
| **Caption Text** | Contenteditable (in canvas) | `fieldData.caption` | Free text |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Background Color** | Color picker | `fieldData.settings.outlineBgColor` | Hex; visible when outline active |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of keyword strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags HTML Interactivity element from Elements panel onto canvas
       ↓
2. Component renders with placeholder (no iframeUrl yet)
       ↓
3. Author opens settings panel → clicks "Upload ZIP"
   File picker opens (accept: .zip)
       ↓
4. Author selects ZIP file containing their HTML interactive
       ↓
5. ShellService uploads ZIP → server extracts → returns iframeUrl
   fieldData.iframeUrl = CDN URL to index.html
       ↓
6. Placeholder replaced by iframe rendering extracted content
       ↓
7. Author adjusts settings:
   - Height (default 400px → adjust for content needs)
   - Width (100% default or fixed px)
   - Toggle caption + type caption text
   - Outline border style
       ↓
8. Author previews to verify interactive works correctly
       ↓
9. Save → fieldData.iframeUrl + settings persisted to savedJson
```

### ZIP Preparation Checklist for Authors

Authors preparing a ZIP file should ensure:

1. `index.html` is at the **root level** of the ZIP (not inside a subfolder)
2. All assets use **relative paths** from `index.html` location
3. No absolute CDN/external dependencies that may be blocked
4. JavaScript does not attempt to access `parent` frame or `window.top` (cross-origin restriction)
5. Interactive is **self-contained** within the ZIP archive

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Upload ZIP button | Visible (placeholder state) | Hidden |
| Replace ZIP button | Visible | Hidden |
| iframe content | Rendered (may be interactive) | Fully interactive |
| Caption editing | Contenteditable active | Read-only |
| Settings panel | Accessible | Hidden |
| iframe interaction | Authors can test in canvas | Full student interaction |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `html-interactivity-directive.js` | Core directive `htmlInteractivity` | ZIP upload coordination |
| `ShellService` | ZIP upload + extraction trigger | Server extracts ZIP |
| `| trusted` Angular filter | iframe `ng-src` sanitization | CDN domain must be trusted |
| `editor/ngcontroller.js` | `$compile` + inject + `savedJson` | |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` for caption | |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.html-interactivity-container` | Root section wrapper |
| `.iframe-placeholder` | Upload prompt shown when no iframeUrl |
| `.iframe-wrapper` | Wrapper for iframe + caption |
| `.outlineBg` | Outline border box |
| `.html-caption` | Caption text area below iframe |

---

## Known Behaviors & Notes

1. **`index.html` MUST be at ZIP root**: The server extraction process only serves `index.html` from the root of the extracted ZIP. If the author's ZIP has `my-interactive/index.html` nested inside a subfolder, the server will return an error and `iframeUrl` will not be set.

2. **Server-side extraction — no client preview**: Authors cannot preview or browse the ZIP contents before uploading. Only after server extraction and iframe rendering can they verify the content loaded correctly.

3. **Sandbox restrictions apply**: The iframe may have a `sandbox` attribute with restricted permissions (no `allow-same-origin`, no `allow-scripts` if sandboxed). Verify the platform's iframe sandbox configuration against the interactive's JavaScript requirements.

4. **`iframeUrl` only set after successful extraction**: In empty/error states, `fieldData.iframeUrl` remains `""` and the placeholder div is shown. Authors must upload a valid ZIP to activate the iframe.

5. **No SCORM from authoring side**: The HTML Interactivity element itself generates no SCORM interactions. If the HTML interactive package includes its own SCORM communication code, it must handle its own SCORM API access — the authoring platform does not bridge SCORM for embedded iframes.

6. **Height is critical for usability**: The default 400px height may clip taller interactives. Authors should test their content at appropriate heights. There is no auto-height/resize feature — height must be manually configured.

7. **Replacing ZIP resets `iframeUrl`**: When author uploads a replacement ZIP, the old `iframeUrl` is replaced. Old extracted content remains on CDN but is no longer referenced.

8. **Cross-origin JavaScript restrictions**: If the interactive's JavaScript tries to access `window.parent`, `window.top`, or the DOM outside the iframe, it will be blocked by the browser's same-origin policy (since the iframe CDN origin differs from the authoring tool origin).

9. **CDN accessibility in reader**: The `iframeUrl` points to a CDN path. This CDN must be accessible from the reader environment (student devices, LMS). Ensure CDN is not firewalled in target deployment environments.

10. **ZIPs with invalid HTML or missing assets**: Malformed ZIP content (broken HTML, missing linked files) will render as a blank or broken iframe. No validation of ZIP contents is performed beyond checking for `index.html` presence.

---

## Checklist for Implementation

### For Authors (ZIP Preparation)
- [ ] Verify `index.html` is at root of ZIP (not nested)
- [ ] Use relative asset paths in HTML (`./js/main.js` not `/js/main.js`)
- [ ] Remove any external CDN dependencies that may be unavailable
- [ ] Test ZIP content independently in a browser before upload
- [ ] Set appropriate iframe height for your content (default 400px may be too small)
- [ ] Add meaningful caption for context

### For Developers
- [ ] Verify ShellService ZIP upload endpoint accepts `.zip` and extracts to CDN
- [ ] Confirm server validates `index.html` presence and returns appropriate error if missing
- [ ] Verify `| trusted` filter allows the CDN domain hosting extracted content
- [ ] Test iframe sandbox attribute configuration against typical interactive JS requirements
- [ ] Confirm CDN-hosted content is accessible from all reader deployment environments
- [ ] Test height/width settings apply correctly to iframe `ng-style`
- [ ] Verify `iframeUrl` update triggers Angular digest and re-renders iframe
