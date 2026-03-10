# Video Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Video Source Types](#video-source-types)
6. [Style Variants](#style-variants)
7. [Editor Mode Implementation](#editor-mode-implementation)
8. [Settings Panel Reference](#settings-panel-reference)
9. [Transcript & Closed Captions](#transcript--closed-captions)
10. [Authoring Flow](#authoring-flow)
11. [Preview Mode Behavior](#preview-mode-behavior)
12. [Integration & Dependencies](#integration--dependencies)
13. [CSS Reference](#css-reference)
14. [Known Behaviors & Notes](#known-behaviors--notes)
15. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Video Element** (`dataType: "video"`) is a full-featured video media component supporting local MP4 upload, YouTube embeds, and Kaltura embeds. It features an in-canvas settings overlay for toggling transcripts and closed captions (VTT tracks), optional header text, caption text, and outline border styling. Local MP4 files are rendered with Video.js for full playback controls and VTT CC integration.

### Key Capabilities

- **Local MP4 upload** — Video.js player with full controls, CC, and transcript support
- **YouTube embed** — responsive iframe with native YouTube player
- **Kaltura embed** — responsive iframe with Kaltura player
- Optional **header text** (style1 variant) above the player
- Optional **caption text** (figcaption) below the player
- **Transcript panel** — loads VTT content as scrollable text
- **Closed Captions (CC)** — VTT track injection for local MP4
- Multi-language caption track support
- Outline border box with configurable background color
- Shared directive reusable inside layout column containers

### Component Identifier

```javascript
"dataType": "video"
```

### Component Registration (config.js)

```javascript
{
  name: "Video",
  dataType: "video",
  url: "templates/video-template.html",
  json: "templates/video/video.json",
  settingsURL: "templates/video/video-settings-panel.html",
  iconClass: "icon-video"
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
│  (dataType:"video")     (drag-drop)            (canvas inject)       │
│                               │                                      │
│                               ▼                                      │
│          ┌────────────────────────────────────────┐                  │
│          │  video-template.html (Canvas Template)  │                  │
│          │  [videoTemplate directive]              │                  │
│          └────────────────────────────────────────┘                  │
│                    │                   │                             │
│                    ▼                   ▼                             │
│       ┌───────────────────┐  ┌───────────────────────────┐          │
│       │ video-directive.js │  │ video-settings-panel.html  │          │
│       │ (videoTemplate)    │  │ (Settings Panel)           │          │
│       └───────────────────┘  └───────────────────────────┘          │
│                    │                                                 │
│                    ▼                                                 │
│         ┌──────────────────────────────────┐                        │
│         │  Video Source Switch             │                        │
│         │                                  │                        │
│         │  MP4 Upload → Video.js Player    │                        │
│         │  YouTube → <iframe> embed        │                        │
│         │  Kaltura → <iframe> embed        │                        │
│         └──────────────────────────────────┘                        │
│                    │                                                 │
│                    ▼                                                 │
│         ┌──────────────────────────────────┐                        │
│         │  In-Canvas Settings Overlay      │                        │
│         │  - Transcript toggle             │                        │
│         │  - CC toggle                     │                        │
│         │  - Language selector             │                        │
│         └──────────────────────────────────┘                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
   ┌─────────────────────────────────────────┐
   │         KITABOO Reader                  │
   │  - Renders Video.js or iframe           │
   │  - Injects VTT tracks                   │
   │  - Shows transcript panel               │
   └─────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
├── editor/
│   └── video-directive.js              ← videoTemplate shared directive
│
├── templates/
│   ├── video-template.html             ← AngularJS canvas template
│   └── video/
│       ├── video-settings-panel.html   ← Right-side settings panel
│       └── video.json                  ← Default configuration JSON
│
└── lib/
    └── video.js/                       ← Video.js library (MP4 playback)
        ├── video.min.js
        └── video-js.css
```

### `video.json` — Default Configuration

```json
{
  "identifier": "video",
  "videoUploaded": false,
  "youtube": false,
  "kaltura": false,
  "altText": "",
  "ratio": "16:9",
  "caption": "",
  "header": "",
  "media": {
    "src": ""
  },
  "settings": {
    "showTranscript": false,
    "showClosedCaptions": false,
    "optionalcaption": false,
    "isHeaderVisible": false,
    "outline": "",
    "outlineBgColor": "#ffffff",
    "styleSelected": "style1",
    "tracks": [],
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
| `identifier` | string | `"video"` | Component type identifier |
| `videoUploaded` | boolean | `false` | `true` = local MP4 video has been uploaded |
| `youtube` | boolean | `false` | `true` = YouTube iframe embed mode |
| `kaltura` | boolean | `false` | `true` = Kaltura iframe embed mode |
| `altText` | string | `""` | Accessibility alt text for video |
| `ratio` | string | `"16:9"` | Aspect ratio (informational; CSS handles actual ratio) |
| `caption` | string | `""` | Figcaption text below video |
| `header` | string | `""` | Header text above video (style1 only) |
| `media` | object | `{}` | Video source configuration |
| `settings` | object | `{}` | Display and playback settings |

### `media` Object

| Field | Type | Description |
|---|---|---|
| `src` | string | Video URL: CDN path (MP4), YouTube embed URL, or Kaltura embed URL |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `showTranscript` | boolean | `false` | Enable transcript text panel |
| `showClosedCaptions` | boolean | `false` | Enable CC overlay on player |
| `optionalcaption` | boolean | `false` | Show/hide `<figcaption>` below video |
| `isHeaderVisible` | boolean | `false` | Show/hide header text above video (style1) |
| `outline` | string | `""` | Border: `"outlineBg"` or `""` (none) |
| `outlineBgColor` | string | `"#ffffff"` | Background color of outline box |
| `styleSelected` | string | `"style1"` | Visual style: `"style1"` / `"style2"` |
| `tracks` | array | `[]` | VTT caption track objects (MP4 only) |
| `metaTags` | array | `[]` | Content search metadata tags |
| `dimensionInfo` | array | `[]` | Inline image dimension tracking |

### `tracks[]` Item Object

```json
{
  "src": "https://cdn.example.com/captions/en.vtt",
  "srclang": "en",
  "label": "English",
  "kind": "captions",
  "default": true
}
```

### Complete fieldData Example — Local MP4 with CC

```json
{
  "identifier": "video",
  "videoUploaded": true,
  "youtube": false,
  "kaltura": false,
  "altText": "Video lecture on photosynthesis",
  "ratio": "16:9",
  "caption": "Fig. 1: Photosynthesis process overview",
  "header": "Understanding Photosynthesis",
  "media": {
    "src": "https://cdn.example.com/video/photosynthesis.mp4"
  },
  "settings": {
    "showTranscript": true,
    "showClosedCaptions": true,
    "optionalcaption": true,
    "isHeaderVisible": true,
    "outline": "",
    "outlineBgColor": "#ffffff",
    "styleSelected": "style1",
    "tracks": [
      { "src": "https://cdn.example.com/cc/en.vtt", "srclang": "en", "label": "English", "kind": "captions", "default": true },
      { "src": "https://cdn.example.com/cc/es.vtt", "srclang": "es", "label": "Español", "kind": "captions", "default": false }
    ],
    "metaTags": ["video", "science", "biology"],
    "dimensionInfo": []
  }
}
```

---

## Video Source Types

### 1. Local MP4 Upload

```html
<!-- Rendered HTML (Video.js player) -->
<div class="video-container embed-responsive embed-responsive-16by9">
  <video class="video-js vjs-default-skin" controls preload="auto">
    <source src="{{fieldData.media.src}}" type="video/mp4">
    <track ng-repeat="track in fieldData.settings.tracks"
           ng-src="{{track.src | trusted}}" kind="{{track.kind}}"
           srclang="{{track.srclang}}" label="{{track.label}}"
           ng-attr-default="{{track.default || undefined}}">
  </video>
</div>
```

**Capabilities**: Full controls, CC track injection, transcript panel, multi-language captions.

### 2. YouTube Embed

```html
<!-- Rendered HTML (iframe) -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item"
          ng-src="{{fieldData.media.src | trusted}}"
          frameborder="0"
          allowfullscreen>
  </iframe>
</div>
```

**Requirements**: URL must be in embed format: `https://www.youtube.com/embed/VIDEO_ID`
**Not supported**: Raw watch URLs (`https://www.youtube.com/watch?v=VIDEO_ID`)

### 3. Kaltura Embed

Same iframe pattern as YouTube. Uses Kaltura-specific embed URL format.

### Source Type Detection

| Field | Value | Rendering |
|---|---|---|
| `videoUploaded=true` | MP4 CDN URL | Video.js player |
| `youtube=true` | YouTube embed URL | `<iframe>` |
| `kaltura=true` | Kaltura embed URL | `<iframe>` |
| All false | No source | Placeholder/empty state |

---

## Style Variants

| Style | Header Text | Player Layout |
|---|---|---|
| `style1` | Shown when `isHeaderVisible=true` | Video with optional header above |
| `style2` | Always hidden | Clean full-width video, no header |

```
style1:
  ┌─────────────────────────────────┐
  │  [Header Text: optional]        │
  ├─────────────────────────────────┤
  │                                 │
  │         VIDEO PLAYER            │
  │                                 │
  └─────────────────────────────────┘
  │  [Caption: optional]            │

style2:
  ┌─────────────────────────────────┐
  │                                 │
  │         VIDEO PLAYER            │
  │  (Full width, no header)        │
  │                                 │
  └─────────────────────────────────┘
```

---

## Editor Mode Implementation

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `uploadVideo(file)` | `file: File` | Calls ShellService, sets `media.src`, sets `videoUploaded=true` |
| `setYouTube(url)` | `url: string` | Converts to embed URL, sets `youtube=true`, clears `videoUploaded` |
| `setKaltura(url)` | `url: string` | Sets Kaltura embed URL, sets `kaltura=true` |
| `clearSource()` | none | Resets all source flags and `media.src` |
| `uploadCCTrack(file, lang)` | `file, lang` | Uploads VTT, appends to `tracks[]` |
| `removeTrack(index)` | `index: number` | Removes track from `tracks[]` by index |
| `initVideoJS()` | none | Initializes/reinitializes Video.js player after src change |

### In-Canvas Settings Overlay

A semi-transparent overlay inside the video element on the canvas provides live toggles:

```html
<div class="video-settings-overlay">
  <!-- Transcript toggle -->
  <label>
    <input type="checkbox" ng-model="fieldData.settings.showTranscript">
    Show Transcript
  </label>
  <!-- CC toggle -->
  <label>
    <input type="checkbox" ng-model="fieldData.settings.showClosedCaptions">
    Show Closed Captions
  </label>
  <!-- Language selector (shown when tracks exist) -->
  <select ng-model="selectedLanguage" ng-options="t.label for t in fieldData.settings.tracks">
  </select>
</div>
```

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Video Type** | Radio (MP4/YouTube/Kaltura) | `videoUploaded` / `youtube` / `kaltura` | Only one active |
| **Upload Video** | File button | `fieldData.media.src` | MP4; calls ShellService |
| **YouTube URL** | Text input | `fieldData.media.src` | Must be embed format URL |
| **Kaltura URL** | Text input | `fieldData.media.src` | Kaltura embed URL |
| **Alt Text** | Text input | `fieldData.altText` | Max 2000 chars |
| **Show Header** | Checkbox | `fieldData.settings.isHeaderVisible` | Only visual in style1 |
| **Style** | Radio (style1/style2) | `fieldData.settings.styleSelected` | Two options |
| **Show Caption** | Checkbox | `fieldData.settings.optionalcaption` | |
| **Show Transcript** | Toggle | `fieldData.settings.showTranscript` | MP4 only (VTT required) |
| **Show Closed Captions** | Toggle | `fieldData.settings.showClosedCaptions` | MP4 only |
| **Upload CC (VTT)** | File button | `fieldData.settings.tracks[]` | `.vtt` format |
| **CC Language** | Text input | `track.label` + `track.srclang` | Per-track language |
| **Remove Track** | Delete button | `tracks[]` splice | |
| **Outline** | Radio | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Background Color** | Color picker | `fieldData.settings.outlineBgColor` | Hex; when outline active |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Transcript & Closed Captions

### Transcript Panel

When `showTranscript=true` and VTT tracks are present:

1. Reader loads the VTT file for the active language track
2. VTT cues are parsed and rendered as scrollable text
3. Transcript text is synchronized with video playback position (cue highlighting)
4. Student can scroll transcript independently of video

### Closed Captions Flow

```
Author uploads VTT file (CC track)
       ↓
ShellService uploads VTT → returns CDN URL
       ↓
Track object appended to fieldData.settings.tracks[]
{ src: "cdn-url.vtt", srclang: "en", label: "English", kind: "captions" }
       ↓
Reader: Video.js injects <track> elements into <video>
       ↓
Student toggles CC via Video.js control bar
       ↓
VTT captions displayed as overlay on video
```

### VTT File Format Reference

```
WEBVTT

00:00:01.000 --> 00:00:04.000
Welcome to this lesson on photosynthesis.

00:00:05.000 --> 00:00:09.000
Photosynthesis converts light energy into chemical energy.
```

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Video element onto canvas
       ↓
2. Component renders with placeholder (no video yet)
       ↓
3. Author chooses video type in settings panel:
   Option A: Upload MP4 → file picker → ShellService → CDN URL
   Option B: Paste YouTube URL → embed format validation → stored
   Option C: Paste Kaltura URL → stored
       ↓
4. Video player appears in canvas (Video.js or iframe)
       ↓
5. Author configures optional features:
   - Style selection (style1 / style2)
   - Toggle header text → types header above player
   - Toggle caption → types caption below player
   - Outline border style
       ↓
6. For MP4 only — CC/Transcript configuration:
   - Upload VTT file(s) → one per language
   - Set language code (en, es, fr...)
   - Enable showTranscript and/or showClosedCaptions toggles
       ↓
7. Save → fieldData persisted
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| In-canvas settings overlay | Visible (transcript/CC toggles) | Hidden |
| Settings panel | Accessible | Hidden |
| Header text editing | Contenteditable active | Read-only |
| Caption editing | Contenteditable active | Read-only |
| Video.js player | May not autoplay in editor | Fully functional |
| CC track injection | Not active (editor only shows controls) | Active |
| Transcript panel | Not shown | Shown if enabled |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `editor/video-directive.js` | Core directive `videoTemplate` | Shared between standalone + layout |
| `editprimarymedia` directive | Upload click handler for MP4 | |
| `ShellService` | HTTP API for video + VTT upload | Returns CDN URLs |
| `Video.js` | HTML5 video player library | Local MP4 only |
| `| trusted` Angular filter | URL sanitization for iframes | Custom domains need whitelist |
| `editor/ngcontroller.js` | `$compile` + inject + `savedJson` | |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.video-container` | Root wrapper for all video types |
| `.embed-responsive` | Responsive aspect-ratio container |
| `.embed-responsive-16by9` | 16:9 aspect ratio constraint |
| `.embed-responsive-item` | Full-size child (video or iframe) |
| `.vjs-default-skin` | Video.js default player skin |
| `.video-settings-overlay` | In-canvas CC/transcript toggle overlay |
| `.outlineBg` | Border box style |

---

## Known Behaviors & Notes

1. **Video.js must be reinitialized on src change**: When `media.src` changes, the directive must call `player.src({ type: 'video/mp4', src: newUrl })` — not simply change the `<video>` src attribute. Failure causes player to show old source.

2. **YouTube URLs must be embed format**: Raw YouTube watch URLs (`?v=ID`) will fail to load in the iframe. Authors must use or be given the embed URL format (`/embed/ID`). The settings panel should auto-convert watch URLs to embed URLs.

3. **`| trusted` filter whitelist**: The Angular `$sce.trustAsResourceUrl` (via `| trusted` filter) may be restricted to known CDN domains. New YouTube/Kaltura domains may need to be added to the platform's trusted URL whitelist.

4. **VTT tracks only work with MP4**: The `<track>` element injection inside `<video>` only works for local Video.js players. YouTube and Kaltura handle CC natively through their own player interfaces — the `tracks[]` array is ignored for iframe embeds.

5. **Transcript requires VTT file**: The `showTranscript` toggle is meaningless without at least one VTT track in `tracks[]`. The transcript panel will render empty if no VTT is uploaded.

6. **`showTranscript` and `showClosedCaptions` are independent**: Both can be active simultaneously. A student can see CC on the video AND a scrollable transcript below simultaneously.

7. **style2 hides header regardless of `isHeaderVisible`**: When `styleSelected="style2"`, the header text area is CSS-hidden. However, `isHeaderVisible` flag and `header` text data are preserved in `fieldData` — switching back to style1 restores the header.

8. **Shared directive scope**: `video-directive.js` is the shared `videoTemplate` directive used in both standalone video and layout column video contexts. Changes to the directive affect all contexts.

9. **`ratio` field is informational**: `fieldData.ratio` stores the intended aspect ratio string (e.g., `"16:9"`) but the actual visual aspect ratio is controlled by CSS classes (`embed-responsive-16by9`), not this field.

10. **No SCORM for Video element**: The Video element is content-only and generates no SCORM interactions. Play events, completion percentage, and time-watched are not tracked unless custom reader-level instrumentation is implemented.

---

## Checklist for Implementation

### For Authors
- [ ] Select video source type (Upload / YouTube / Kaltura)
- [ ] Verify video plays correctly in preview
- [ ] Upload VTT caption files if CC required (one per language)
- [ ] Enable transcript if text transcript accessibility needed
- [ ] Add alt text for accessibility compliance
- [ ] Choose appropriate style (style1 with header / style2 clean)
- [ ] Add header and caption text as needed

### For Developers
- [ ] Verify Video.js library loaded before `video-directive.js`
- [ ] Confirm `| trusted` filter allows target CDN and YouTube/Kaltura domains
- [ ] Test Video.js `player.src()` call on src change (not setAttribute)
- [ ] Test CC track injection with multiple language tracks
- [ ] Test transcript panel VTT parsing and scrolling
- [ ] Verify YouTube embed URL auto-conversion from watch URL
- [ ] Test in both standalone and layout column contexts
- [ ] Confirm VTT upload via ShellService returns accessible CDN URL
