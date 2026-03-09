# Video Element — Technical Documentation

## Overview

A video media component supporting MP4 upload, YouTube/Kaltura embeds, transcript display, closed captions (CC), and optional header/caption text.

### Component Identifier
```javascript
"dataType": "video"
```

---

## File Structure

```
KITABOO_Authoring/
├── editor/
│   └── video-directive.js           ← videoTemplate directive (shared)
│
└── templates/
    ├── video-template.html           ← AngularJS template
    └── video/
        ├── video-settings-panel.html
        └── video.json
```

---

## Data Model

### Root Fields

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"video"` |
| `videoUploaded` | boolean | Video has been uploaded/linked |
| `youtube` | boolean | YouTube embed |
| `kaltura` | boolean | Kaltura embed |
| `altText` | string | Accessibility alt text |
| `ratio` | string | Aspect ratio (e.g., `"16:9"`) |
| `caption` | string | Figcaption text |
| `header` | string | Header text (style1 only) |
| `media` | object | Video source (`src`) |
| `settings` | object | Display settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `showTranscript` | boolean | Enable transcript panel |
| `showClosedCaptions` | boolean | Enable CC |
| `optionalcaption` | boolean | Show/hide figcaption |
| `isHeaderVisible` | boolean | Show/hide header text |
| `outline` | string | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Outline background color |
| `styleSelected` | string | Visual style: `"style1"`, `"style2"` |

---

## Video Sources

### MP4 Upload
Renders as **Video.js** player (`vjs-default-skin`):
- Full playback controls
- CC track injection (VTT files)
- Transcript panel
- Multi-language captions

### YouTube / Kaltura
Renders as responsive iframe (`embed-responsive-16by9`):
- URL sanitized via `| trusted` Angular filter
- CC handled natively by the platform

---

## In-Player Settings Overlay

An overlay inside the video element exposes transcript and CC toggles on the authoring canvas:

```
Transcript toggle  → fieldData.settings.showTranscript
CC toggle          → fieldData.settings.showClosedCaptions
Language selector  → List of available VTT caption tracks
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/video-directive.js` | Core directive |
| `Video.js` | HTML5 video player library |
| `editprimarymedia` directive | Upload/link video |
| `ShellService` | HTTP API for video upload |
| `| trusted` filter | URL sanitization for iframes |
