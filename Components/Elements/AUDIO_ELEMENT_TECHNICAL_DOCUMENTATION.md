# Audio Element — Technical Documentation

## Overview

An HTML5 audio player component supporting audio file upload, optional caption, outline styles, background playback mode, and custom skin selection.

### Component Identifier
```javascript
"dataType": "audio"
```

---

## File Structure

```
KITABOO_Authoring/
├── editor/
│   └── audio-directive.js          ← audioTemplate directive (shared)
│
└── templates/
    ├── audio.html                   ← AngularJS template
    └── audio/
        ├── audio-setting-panel.html
        └── audio.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"audio"` |
| `caption` | string | Caption below audio player |
| `media` | object | Audio source (`src`, `align`) |
| `settings` | object | Display settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `optionalcaption` | boolean | Show/hide caption |
| `playinBackground` | boolean | Background/ambient playback mode |
| `outline` | string | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Outline background color |
| `skinName` | string | Custom audio player skin identifier |

---

## Template Structure

```html
<section class="component-holder primary-media audio-source" audio-template
  selectedSkin="{{getSkinName()}}" playInBackground={{fieldData.settings.playinBackground}}>
  <figure class="pc-figure audioBorder outlineBg {{fieldData.settings.outline}}"
    ng-style="{'background-color':fieldData.settings.outlineBgColor}">
    <audio class="pc-audio primary-audio" controls="" editprimarymedia>
      Your browser does not support HTML5 Audio.
    </audio>
    <figcaption ng-if="fieldData.settings.optionalcaption" contenteditable="true"
      ng-model="fieldData.caption">
    </figcaption>
  </figure>
</section>
```

---

## Background Playback

When `playinBackground` is enabled, the audio plays as ambient background music in the reader without visible player controls. The `playInBackground` attribute on the `<section>` communicates this to the reader runtime.

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `editor/audio-directive.js` | Core directive (shared) |
| `editprimarymedia` directive | Upload/link audio |
| `ShellService` | HTTP API for audio upload |
| `editor/ngcontroller.js` | Compile and inject |
