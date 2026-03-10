# Audio Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Editor Mode Implementation](#editor-mode-implementation)
6. [Settings Panel Reference](#settings-panel-reference)
7. [Authoring Flow](#authoring-flow)
8. [Background Playback Mode](#background-playback-mode)
9. [Preview Mode Behavior](#preview-mode-behavior)
10. [Reader Mode & Persistence](#reader-mode--persistence)
11. [Integration & Dependencies](#integration--dependencies)
12. [CSS Reference](#css-reference)
13. [Known Behaviors & Notes](#known-behaviors--notes)
14. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Audio Element** (`dataType: "audio"`) is an HTML5 audio player component embedded in the authoring canvas. It supports local audio file upload, optional visible caption, outline border styling, and a special **background ambient playback** mode that hides the player controls and auto-plays audio in the reader. It is used for podcasts, narration tracks, ambient background music, and supplementary audio content.

### Key Capabilities

- Upload local MP3/MP4/OGG audio files via `editprimarymedia` directive
- Optional visible caption text beneath the player (contenteditable)
- **Background Playback Mode** — hides player UI, auto-plays as ambient audio in reader
- Outline border box styling with configurable background color
- Custom audio skin support via `skinName` parameter
- Meta Tags for content searchability
- Shared directive reusable inside layout column containers
- Non-assessment element — purely informational, no SCORM state

### Component Identifier

```javascript
"dataType": "audio"
```

### Component Registration (config.js)

```javascript
{
  name: "Audio",
  dataType: "audio",
  url: "templates/audio.html",
  json: "templates/audio/audio.json",
  settingsURL: "templates/audio/audio-setting-panel.html",
  iconClass: "icon-audio"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     KITABOO Authoring Tool                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  config.js ──────────► ngcontroller.js ──────► $compile          │
│  (dataType:"audio")      (drag-drop)          (canvas inject)    │
│                                │                                 │
│                                ▼                                 │
│             ┌──────────────────────────────────┐                 │
│             │        audio.html (Canvas)        │                 │
│             │   [audio-template directive]      │                 │
│             │   [editprimarymedia directive]    │                 │
│             └──────────────────────────────────┘                 │
│                        │              │                          │
│                        ▼              ▼                          │
│           ┌────────────────┐  ┌──────────────────┐              │
│           │ audio-directive│  │ audio-setting-   │              │
│           │     .js        │  │   panel.html      │              │
│           │ (audioTemplate │  │ (Settings Panel)  │              │
│           │  directive)    │  └──────────────────┘              │
│           └────────────────┘           │                         │
│                   │                    ▼                         │
│                   ▼          ┌──────────────────────┐           │
│            fieldData         │   Settings Bindings   │           │
│            (savedJson)       │  - optionalcaption    │           │
│                              │  - playinBackground   │           │
│                              │  - outline / color    │           │
│                              └──────────────────────┘           │
│                   │                                              │
│                   ▼                                              │
│  ┌──────────────────────────────────────────┐                   │
│  │           ShellService (Upload)           │                   │
│  │  POST audio file → returns CDN URL        │                   │
│  │  Stored in fieldData.media.src           │                   │
│  └──────────────────────────────────────────┘                   │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    ▼
   ┌─────────────────────────────────────────┐
   │           KITABOO Reader                │
   │  - Reads playInBackground attribute     │
   │  - If true: hidden auto-play ambient    │
   │  - If false: visible HTML5 player       │
   └─────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
├── editor/
│   └── audio-directive.js          ← audioTemplate shared directive
│                                      (used in standalone + layout columns)
│
├── templates/
│   ├── audio.html                  ← AngularJS canvas template
│   └── audio/
│       ├── audio-setting-panel.html ← Right-side settings panel
│       └── audio.json              ← Default configuration JSON
│
└── css/
    └── authoring/
        └── authoring-style.css     ← Shared element styles (.audioBorder, etc.)
```

### File Descriptions

#### `editor/audio-directive.js` — Core Directive
- **Purpose**: AngularJS directive `audioTemplate` — handles audio player initialization and skin loading
- **Shared usage**: Used in standalone `audio.html` AND inside layout column templates
- **Key responsibility**: Applies `selectedSkin` to player, manages `playInBackground` attribute
- **Caution**: Shared scope — modifications affect all audio instances on the page

#### `templates/audio.html` — Canvas Template
- **Purpose**: Defines the rendered HTML structure on the authoring canvas
- **Key elements**: `<section audio-template>`, `<audio editprimarymedia>`, `<figcaption>`
- **Angular directives used**: `audio-template`, `editprimarymedia`, `ng-model`, `ng-if`, `ng-style`

#### `templates/audio/audio-setting-panel.html` — Settings Panel
- **Purpose**: Right-side panel shown when author clicks the component
- **Fields**: Caption toggle, Play in Background toggle, Outline radio, Background Color, Meta Tags

#### `templates/audio/audio.json` — Default Configuration
```json
{
  "identifier": "audio",
  "caption": "",
  "altText": "",
  "media": {
    "src": "",
    "align": "center"
  },
  "settings": {
    "optionalcaption": false,
    "playinBackground": false,
    "outline": "",
    "outlineBgColor": "#ffffff",
    "skinName": "",
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
| `identifier` | string | `"audio"` | Component type identifier |
| `caption` | string | `""` | Caption text below audio player |
| `altText` | string | `""` | Accessibility alt text for screen readers |
| `media` | object | `{}` | Audio source configuration |
| `settings` | object | `{}` | Display and playback settings |

### `media` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `src` | string | `""` | Uploaded audio file URL (CDN/server path) |
| `align` | string | `"center"` | Player alignment: `"left"`, `"center"`, `"right"` |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `optionalcaption` | boolean | `false` | Show/hide `<figcaption>` below player |
| `playinBackground` | boolean | `false` | Ambient mode — hides player, auto-plays in reader |
| `outline` | string | `""` | Border style: `"outlineBg"` (bordered box) or `""` (none) |
| `outlineBgColor` | string | `"#ffffff"` | Background color of outline box |
| `skinName` | string | `""` | Custom client audio player skin identifier |
| `metaTags` | array | `[]` | Metadata tags for content search |
| `dimensionInfo` | array | `[]` | Inline image dimension tracking (for caption images) |

### Complete fieldData Example

```json
{
  "identifier": "audio",
  "caption": "Listen to the podcast episode on climate change",
  "altText": "Podcast audio: Climate change discussion",
  "media": {
    "src": "https://cdn.example.com/audio/podcast-ep1.mp3",
    "align": "center"
  },
  "settings": {
    "optionalcaption": true,
    "playinBackground": false,
    "outline": "outlineBg",
    "outlineBgColor": "#f5f5f5",
    "skinName": "",
    "metaTags": ["podcast", "climate", "science"],
    "dimensionInfo": []
  }
}
```

---

## Editor Mode Implementation

### Canvas Template Structure

```html
<section class="component-holder primary-media audio-source" audio-template
  selectedSkin="{{getSkinName()}}"
  playInBackground="{{fieldData.settings.playinBackground}}">

  <figure class="pc-figure audioBorder outlineBg {{fieldData.settings.outline}}"
    ng-style="{'background-color': fieldData.settings.outlineBgColor}">

    <!-- Native HTML5 audio player -->
    <audio class="pc-audio primary-audio" controls="" editprimarymedia>
      Your browser does not support HTML5 Audio.
    </audio>

    <!-- Optional caption (removed from DOM when hidden) -->
    <figcaption
      ng-if="fieldData.settings.optionalcaption"
      contenteditable="true"
      ng-model="fieldData.caption">
    </figcaption>

  </figure>
</section>
```

### Key Directive Interactions

| Directive | Role |
|---|---|
| `audio-template` | Initializes audio player, reads `selectedSkin` and `playInBackground` attributes |
| `editprimarymedia` | Click handler — opens media upload dialog, calls `ShellService.uploadAudio()` |
| `ng-if="fieldData.settings.optionalcaption"` | Removes/adds `<figcaption>` from DOM entirely |
| `ng-style` | Applies `outlineBgColor` inline when outline mode active |
| `ng-model="fieldData.caption"` | Two-way binding for caption text content |

### Upload Flow

```
Author clicks audio player area
    └──► editprimarymedia directive intercepts click
              └──► Opens file picker (accept: audio/*)
                        └──► ShellService.upload(file)
                                  └──► POST /api/upload/audio
                                            └──► Returns { url: "https://cdn.../file.mp3" }
                                                      └──► fieldData.media.src = url
                                                                └──► ng-src updates <audio> src
                                                                          └──► Player ready
```

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Add Caption** | Checkbox | `fieldData.settings.optionalcaption` | true / false |
| **Caption Text** | Contenteditable (in canvas) | `fieldData.caption` | Free text, max ~500 chars |
| **Play in Background** | Toggle switch | `fieldData.settings.playinBackground` | true / false |
| **Outline** | Radio buttons | `fieldData.settings.outline` | `""` (None) / `"outlineBg"` (Box) |
| **Background Color** | Color picker | `fieldData.settings.outlineBgColor` | Hex color; shown only when outline = "outlineBg" |
| **Alt Text** | Text input | `fieldData.altText` | Accessibility description, max 2000 chars |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of keyword strings |

---

## Authoring Flow

### Step-by-Step Authoring Sequence

```
1. Author drags Audio element from Elements panel onto canvas
       ↓
2. ngcontroller.js $compile(audio.html) → injects component
   fieldData initialized from audio.json defaults
       ↓
3. Audio element renders with empty player placeholder
   (no src yet — placeholder state)
       ↓
4. Author clicks the audio player area
       ↓
5. editprimarymedia fires → file picker opens
   Author selects MP3/MP4/OGG file
       ↓
6. ShellService uploads file → receives CDN URL
   fieldData.media.src = CDN URL
   Player src attribute updated → audio player ready
       ↓
7. Author opens settings panel (click settings icon):
   - Toggle "Add Caption" → figcaption appears
   - Type caption in canvas contenteditable
   - Toggle "Play in Background" if ambient mode needed
   - Select outline style + color
       ↓
8. Author saves page → fieldData persisted to savedJson
       ↓
9. Package generation embeds audio file + fieldData
```

### Play in Background Author Warning

When `playinBackground` is enabled, authors should be informed:
- The audio player controls will be **hidden** from students
- Audio will **auto-play** when the page loads in the reader
- The audio **cannot be paused** by students (no visible controls)
- Best for: ambient background music, narration auto-play

---

## Background Playback Mode

### How It Works

The `playinBackground` attribute is passed from `fieldData.settings.playinBackground` to the `<section>` element via:

```html
<section ... playInBackground="{{fieldData.settings.playinBackground}}">
```

The KITABOO Reader runtime reads this attribute and:

1. **If `playInBackground="true"`**:
   - CSS hides the entire `<section>` (player invisible)
   - JavaScript auto-plays the audio on page load
   - No student interaction possible
   - Audio continues playing across widget interactions (same page)

2. **If `playInBackground="false"` (default)**:
   - Native HTML5 `<audio controls>` shown
   - Student can play/pause/seek manually
   - Standard behavior

### Use Cases

| Use Case | playinBackground | optionalcaption |
|---|---|---|
| Podcast episode | `false` | `true` (episode title) |
| Narration track | `false` | `false` |
| Ambient background music | `true` | `false` |
| Sound effect | `true` | `false` |
| Audio quiz | `false` | `false` |

---

## Preview Mode Behavior

In Preview Mode (author clicking "Preview" in authoring tool):

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Upload button | Visible (editprimarymedia) | Hidden |
| Settings panel | Accessible | Hidden |
| Caption editing | Contenteditable active | Read-only |
| Audio playback | May not work (inline editor) | Fully functional |
| Player skin | Default | skinName applied |
| Background mode | Shown as normal player | Hidden if playinBackground=true |

Preview mode is handled by the `audioTemplate` directive detecting the preview context and adjusting rendering accordingly.

---

## Reader Mode & Persistence

### How Audio Content Is Packaged

When a lesson is published:

1. Audio file is uploaded to CDN — `fieldData.media.src` stores the URL
2. `fieldData` JSON is serialized into `savedJson[pageNo][componentId]`
3. Package includes: fieldData JSON + CDN audio URL reference
4. Reader loads `fieldData` and reconstructs the component

### SCORM Notes

| Property | Value |
|---|---|
| **SCORM tracking** | None — Audio is content-only |
| **Completion trigger** | Page completion (not audio play) |
| **State persistence** | None (playback position not saved) |
| **LMS interaction** | No |

> **Note:** Audio element does not generate SCORM interactions. If audio completion tracking is required, use a widget component with explicit submit logic.

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `editor/audio-directive.js` | Core directive `audioTemplate` | Shared — used in standalone + layout columns |
| `editprimarymedia` directive | Upload/link audio file | Handles click, invokes ShellService |
| `ShellService` | HTTP API for audio upload | Returns CDN URL |
| `editor/ngcontroller.js` | $compile + inject into canvas | Manages savedJson |
| `editor/ngdragdrop.js` | Drag source from Elements panel | |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on `<figcaption>` | |
| `css/authoring/authoring-style.css` | `.audioBorder`, `.outlineBg` | Shared styling |
| HTML5 `<audio>` API | Native browser player | Appearance varies by browser/OS |

---

## CSS Reference

| CSS Class | Location | Description |
|---|---|---|
| `.audio-source` | `authoring-style.css` | Root section wrapper for audio element |
| `.audioBorder` | `authoring-style.css` | Base border/figure styling |
| `.outlineBg` | `authoring-style.css` | Adds border box around player when active |
| `.pc-figure` | `authoring-style.css` | Figure element layout |
| `.pc-audio` | `authoring-style.css` | Audio element sizing/display |
| `.primary-audio` | `authoring-style.css` | Primary audio player identifier |

### Outline Box Styling Logic

```css
/* When outline = "outlineBg" — figure gets both classes */
.audioBorder.outlineBg {
  border: 1px solid var(--border-color);
  padding: 16px;
  /* background-color applied via ng-style from outlineBgColor */
}
```

---

## Known Behaviors & Notes

1. **Shared directive scope**: `audio-directive.js` is shared between standalone audio and layout column audio instances. Modifying this directive affects all contexts — test both contexts after any change.

2. **Background mode irreversible in session**: Once `playinBackground=true` and a page loads in the reader, there is no UI to stop the audio mid-session without navigating away and back.

3. **skinName not exposed in default UI**: The `skinName` field supports custom client-specific audio player skins but there is no built-in skin picker in the default settings panel. Client-specific implementations may add this.

4. **Caption uses contenteditable**: The `<figcaption>` uses `ng-model` on a contenteditable element. Authors can accidentally paste rich HTML including scripts — no sanitization is applied to caption content.

5. **ng-if vs ng-show for caption**: `figcaption` uses `ng-if` — the DOM element is completely removed when `optionalcaption=false`. This means any text typed is lost if caption is toggled off then on again (different from ng-show which hides but keeps DOM).

6. **outlineBgColor ignored without outline**: The color picker applies to `background-color` via `ng-style`, but this only has visual effect when `outline = "outlineBg"`. The color is still persisted even when outline is off.

7. **Browser-dependent player UI**: Native HTML5 `<audio controls>` renders differently on Chrome, Firefox, Safari, Edge — no cross-browser styling is applied in default implementation.

8. **Multiple audio elements on same page**: Each audio instance is fully independent with its own `fieldData`. No cross-element coordination or conflict detection.

9. **No SCORM state**: Audio is purely informational. If tracking audio play events is required, this requires custom reader-side instrumentation not available in the default platform.

10. **metaTags not displayed to students**: The `metaTags` array is for content management/search purposes only. Tags are not rendered in any visible UI to students.

11. **Upload size limits**: File size limits for audio upload are enforced by `ShellService`/server configuration, not by the component itself. Large files may time out during upload.

12. **align field**: `fieldData.media.align` stores alignment but the audio player itself is typically full-width in the canvas. Alignment may affect surrounding layout context.

---

## Checklist for Implementation

### For Authors
- [ ] Upload audio file (click player area → file picker)
- [ ] Verify audio plays correctly in editor preview
- [ ] Add caption if needed (toggle in settings panel)
- [ ] Decide if background ambient mode is required
- [ ] Set outline border style if required
- [ ] Add alt text for accessibility compliance
- [ ] Add meta tags for content discoverability

### For Developers
- [ ] Verify `editprimarymedia` directive is registered before `audio-template`
- [ ] Confirm `ShellService` upload endpoint is configured
- [ ] Test audio in both standalone and layout column contexts
- [ ] Verify `playInBackground` attribute propagation to reader runtime
- [ ] Test caption `ng-if` toggle — confirm text is preserved on toggle
- [ ] Confirm `skinName` handling if client skin required
- [ ] Validate `outlineBgColor` applies only when `outline = "outlineBg"`
- [ ] Test on all target browsers (Chrome, Safari, Firefox, Edge)

---

## API Reference

### ShellService Upload Call

```javascript
// Triggered by editprimarymedia directive on audio click
ShellService.upload({
  file: selectedFile,         // File object from file picker
  type: "audio",              // Upload type identifier
  pageId: currentPageId       // Current page context
}).then(function(response) {
  fieldData.media.src = response.data.url;  // Store CDN URL
});
```

### Component Save Flow

```javascript
// On page save — ngcontroller.js
savedJson[pageNo][componentId] = fieldData;
// fieldData.media.src: CDN URL to audio file
// fieldData.settings.*: All user settings
// fieldData.caption: Caption text (if optionalcaption=true)
```

### Reader Integration

```javascript
// Reader runtime checks for background playback
var section = document.querySelector('[audio-template]');
if (section.getAttribute('playInBackground') === 'true') {
  // Hide player
  section.style.display = 'none';
  // Create hidden audio element and auto-play
  var audio = new Audio(fieldData.media.src);
  audio.play();
}
```
