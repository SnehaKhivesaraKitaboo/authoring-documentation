# Extended Response about Media (Identify-the-Clip) Component
## Comprehensive Technical Documentation

---

## Table of Contents
1. [Component Overview](#component-overview)
2. [Architecture & Design](#architecture--design)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Component Types & Variants](#component-types--variants)
6. [Operational Modes](#operational-modes)
7. [Data Flow & Interactions](#data-flow--interactions)
8. [Media Support](#media-support)
9. [Answer Validation](#answer-validation)
10. [Custom Keyboard Support](#custom-keyboard-support)
11. [Rich Text Editor (RTE) Integration](#rich-text-editor-integration)
12. [SCORM Integration](#scorm-integration)
13. [Styling & Themes](#styling--themes)
14. [Known Issues](#known-issues)
15. [Recommendations](#recommendations)

---

## Component Overview

### Purpose
The **Extended Response about Media (identify-the-clip)** is an interactive learning component that allows students to provide written responses (short or rich text) in relation to multimedia content (images, videos, or audio). It supports answer validation, feedback mechanisms, and accessibility features.

### Key Features
- **Multi-media support**: Image, Video (system upload/URL), Audio
- **Response types**: Short Answer, Rich Text Editor (RTE) with formatting
- **Answer validation**: Configurable with exact match and multiple answer support
- **Custom keyboard**: Special character support for language subjects (French, Spanish, German, Math)
- **Math equation support**: MathLive integration for mathematical expressions
- **Feedback system**: Generic correct/incorrect feedback with customization
- **Accessibility**: Alt text support, screen reader compatibility
- **SCORM compliant**: State persistence and tracking
- **Theming**: Multiple visual styles with outline and background customization

---

## Architecture & Design

### Component Type
**Angular Directive-based Widget** with jQuery dependencies

### Technology Stack
- **Frontend Framework**: AngularJS 1.x
- **UI Library**: jQuery, Bootstrap
- **Rich Text Editor**: Cazary (custom iframe-based editor)
- **Math Support**: MathLive library
- **Video Player**: Video.js
- **Audio Player**: Audio.js
- **SCORM**: SCORM API integration for LMS tracking

### Design Pattern
- **MVC Pattern**: Model (JSON data), View (HTML template), Controller (Angular directive)
- **Event-driven architecture**: User interactions trigger state updates
- **Observer pattern**: Angular watchers monitor settings changes

---

## File Structure

```
templates/identify-the-clip/
│
├── identify-the-clip.html                    # Main component template
├── identify-the-clip-settings-pannel.html    # Settings/configuration panel
│
├── scripts/
│   ├── identify-the-clip-directive.js        # Editor mode directive (~2001 lines)
│   └── identify-the-clip-preview1.js         # Preview/Reader mode logic (~2224 lines)
│
├── styles/
│   └── identify-the-clip-template.css        # Component-specific styles (~497 lines)
│
└── default/
    └── identify-the-clip.json                # Default configuration/data model
```

---

## Data Model

### Core Data Structure (identify-the-clip.json)

```json
{
  "identifier": "identify-the-clip",
  "templateName": "identify-the-clip",
  "introduction": "",              // Header text
  "instruction": "",               // Optional instruction text
  "questiontext": "",              // Main question prompt
  "question": "Question 1",        // Primary label
  "secondaryQuestion": "Part A",   // Secondary label
  "answerText": "",                // User's response
  
  "media": {
    "src": "#",                    // Media source URL
    "height": "auto",
    "width": "auto",
    "align": "imgCenter",          // imgLeft, imgCenter, imgRight
    "outline": "none",
    "maxWidth": "100%"
  },
  
  "settings": {
    "labelType": "primary",        // primary | secondary
    "showMedia": true,
    "activeAns": "shortAns",       // shortAns | RTE
    "shortAnsCharLimit": "500",
    "longAnsCharLimit": "5000",
    "outline": "outline",          // outline | outlineBg
    "outlineBgColor": "#ffffff",
    "mediaType": "image",          // image | video | audio
    "imageUrl": "images/image.jpg",
    "thumbUrl": "images/thumbDownUp.png",
    "altText": "Alt Text of Image",
    "allowResponse": false,        // Enable answer validation
    "answerMatch": false,          // Exact match validation
    "isHeaderVisible": true,
    "genericFeedbackCheckbox": true,
    "generic_correct_ans_default_text": "Congratulations! Your answer is correct",
    "generic_incorrect_ans_default_text": "Oops! You have selected the wrong answer",
    "questionNoField": false,      // Show label type field
    "ansTextHint": true,           // Show pipe separator hint
    "isCustomKeyboardEnable": false,
    "isLangKeyboardEnable": false,
    "userSubjectLang": "",         // FRA, ESP, GER, MATH
    
    "style_tab": [
      {
        "stylesHolder": [
          {
            "name": "style1",      // Basic style
            "styleactive": true
          },
          {
            "name": "style2",      // Style with thumbnail
            "styleactive": false
          }
        ]
      }
    ],
    
    "tracks": [],                  // Video caption tracks
    "showClosedCaptions": true,
    "showTranscript": false,
    "uploadtype": "uploadbysystem", // uploadbysystem | uploadbyurl
    "playinBackground": false      // Audio-specific setting
  }
}
```

---

## Component Types & Variants

### 1. Answer Types

#### Type: Short Answer (`activeAns: "shortAns"`)
- **Description**: Single-line or brief text response
- **Character Limit**: 500 characters (configurable)
- **Input Type**: Contenteditable div
- **Features**: 
  - Paste sanitization (removes formatting)
  - Multiple answer support with pipe (`|`) separator
  - Auto-disable state on submit
  - Character count display (optional)

**Behavior**:
```javascript
// Multiple answers separated by pipe
// Example: "Paris|paris|PARIS" will accept any of these variations
```

#### Type: Rich Text Editor (RTE) (`activeAns: "RTE"`)
- **Description**: Full-featured rich text editor with formatting
- **Editor**: Cazary (iframe-based WYSIWYG)
- **Features**:
  - Text formatting (Bold, Italic, Underline)
  - Lists (Ordered, Unordered)
  - Math equation support (MathLive)
  - Copy/paste preservation
  - Dynamic height adjustment

**Toolbar Commands**:
```javascript
"MINIMAL": [
  "bold italic underline",
  "insertorderedlist insertunorderedlist matheditor" // matheditor for Math subject
]
```

### 2. Media Types

#### Type: Image (`mediaType: "image"`)
- **Supported Formats**: PNG, JPG, SVG
- **Features**:
  - System upload
  - Alt text for accessibility
  - Optional caption
  - Alignment options (left, center, right)
  - Outline styles

#### Type: Video (`mediaType: "video"`)
- **Upload Methods**:
  - System upload (MP4)
  - YouTube URL
  - Vimeo URL
  
- **Features**:
  - Video.js player integration
  - Closed captions (CC) support
  - Transcript display
  - Full-width mode
  - Play/pause controls
  - Optional caption

**Video URL Structure**:
```javascript
// YouTube: "https://www.youtube.com/embed/{VIDEO_ID}"
// Vimeo: "https://player.vimeo.com/video/{VIDEO_ID}"
```

#### Type: Audio (`mediaType: "audio"`)
- **Supported Format**: MP3, WAV
- **Features**:
  - Audio.js player integration
  - Play in background option
  - Transcript text field
  - Optional caption
  - Custom audio controls

### 3. Style Variants

#### Style 1: Basic (`styleSelected: "style1"`)
- Clean, minimal design
- Question text only
- Full-width layout
- Optional outline and background fill

#### Style 2: Thumbnail Enhanced (`styleSelected: "style2"`)
- Includes thumbnail image display
- Dashed border styling
- Thumb & text side-by-side layout
- Question field with visual indicator

---

## Operational Modes

### 1. Editor Mode (Authoring)
**File**: `identify-the-clip-directive.js`

**Purpose**: Content creation and configuration

**Key Functions**:
- Settings panel interaction
- Media upload/replacement
- Answer configuration
- Style customization
- Real-time preview update

**User Interactions**:
```javascript
// Click handlers
scope.introclick()          // Open settings panel
scope.shoertlongSetting()   // Switch answer type
scope.openCustomKeyboard()  // Toggle special characters
scope.changeCurrentSettings() // Update component settings
```

**Settings Management**:
```javascript
// Settings stored in Angular scope
con.currSettings = con.savedJson[pageNo][uniqueId].settings;
con.templateData = con.savedJson[pageNo][uniqueId];
```

### 2. Preview Mode (Testing)
**File**: `identify-the-clip-preview1.js`

**Purpose**: Student interaction simulation in authoring environment

**Features**:
- Answer input
- Submit/Try Again/Show Me/Reset buttons
- Answer validation
- Feedback display
- SCORM state tracking

### 3. Reader Mode (Student View)
**File**: Same as Preview (`identify-the-clip-preview1.js`)

**Purpose**: Final student interaction in published content

**Workflow**:
1. Student views question and media
2. Enters answer (short or RTE)
3. Submits answer
4. Receives feedback (if enabled)
5. Can try again (if enabled)
6. Progress tracked via SCORM

---

## Data Flow & Interactions

### Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Header     │  │    Media     │  │   Question   │          │
│  │  (Optional)  │  │ Image/Video/ │  │     Text     │          │
│  │              │  │    Audio     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Answer Input Field                        │          │
│  │  (Short Answer or Rich Text Editor)               │          │
│  └──────────────────────────────────────────────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Submit  │ │ Try Again│ │ Show Me  │ │  Reset   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Feedback Display (Correct/Incorrect)      │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR CONTROLLER LAYER                      │
│  ┌──────────────────────────────────────────────────┐          │
│  │          identify-the-clip-directive.js          │          │
│  │  - Event handlers                                 │          │
│  │  - Settings management                            │          │
│  │  - Media upload logic                             │          │
│  │  - Custom keyboard integration                    │          │
│  └──────────────────────────────────────────────────┘          │
│                              ↓↑                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │        identify-the-clip-preview1.js             │          │
│  │  - Answer validation                              │          │
│  │  - Submit/Reset handlers                          │          │
│  │  - Feedback rendering                             │          │
│  │  - State management                               │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐           │
│  │  Validation │  │   Feedback  │  │ Custom       │           │
│  │  Engine     │  │   Manager   │  │ Keyboard     │           │
│  └─────────────┘  └─────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐           │
│  │  Cazary RTE │  │  MathLive   │  │  Media       │           │
│  │  Integration│  │  Integration│  │  Handlers    │           │
│  └─────────────┘  └─────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────────────────────────────────────────┐          │
│  │          Field Data (scope.fieldData)            │          │
│  │  - introduction, questiontext, answerText        │          │
│  │  - settings object                                │          │
│  │  - media object                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                              ↓↑                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Global Saved JSON (con.savedJson)        │          │
│  │  - Page-level component storage                  │          │
│  │  - Indexed by [pageNo][uniqueId]                 │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐           │
│  │  SCORM API  │  │  Video.js   │  │  Audio.js    │           │
│  │  (LMS)      │  │  Player     │  │  Player      │           │
│  └─────────────┘  └─────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  MathLive   │  │  External   │                              │
│  │  Library    │  │  Video URLs │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

### Event Flow Sequence

#### Student Answer Submission Flow

```
User enters answer
       ↓
Click Submit Button
       ↓
submitAnswerITC(event)
       ↓
┌──────────────────────────────┐
│ 1. Disable input fields      │
│ 2. Add 'submitted' class     │
│ 3. Disable buttons           │
└──────────────────────────────┘
       ↓
validateAnswer(textField)
       ↓
┌─────────────────────────────────────────┐
│ Check allowResponse && answerMatch      │
│                                         │
│ ├─ If true → Compare answers           │
│ │   ├─ Split by '|' separator          │
│ │   ├─ Normalize quotes & whitespace   │
│ │   ├─ Case-insensitive compare        │
│ │   └─ Return true/false               │
│ │                                       │
│ ├─ If allowResponse only → Return true │
│ │                                       │
│ └─ Else → Return "notValidate"         │
└─────────────────────────────────────────┘
       ↓
Apply Feedback (correct/incorrect)
       ↓
┌──────────────────────────────┐
│ Correct:                     │
│ - Add 'itcCorrect' class     │
│ - Show green border          │
│ - Display success message    │
│                              │
│ Incorrect:                   │
│ - Add 'itcIncorrect' class   │
│ - Show red border            │
│ - Display error message      │
└──────────────────────────────┘
       ↓
stateMainatainShortAndLongActiviy(event)
       ↓
createScormObject($form)
       ↓
saveAction(event, scoObj) → SCORM API
```

#### Editor Settings Update Flow

```
User clicks component in editor
       ↓
introclick(event)
       ↓
┌──────────────────────────────┐
│ 1. Highlight component       │
│ 2. Get pageNo & uniqueId     │
│ 3. Load settings from JSON   │
└──────────────────────────────┘
       ↓
con.currSettings = con.savedJson[pageNo][uniqueId].settings
       ↓
Display Settings Panel
       ↓
User modifies settings
       ↓
┌──────────────────────────────┐
│ Media Type Changed           │
│ → Update media object        │
│ → Reset upload state         │
│                              │
│ Answer Type Changed          │
│ → Initialize/Remove RTE      │
│ → Update input field         │
│                              │
│ Style Changed                │
│ → Update CSS classes         │
│ → Refresh component view     │
└──────────────────────────────┘
       ↓
enableDisableSaveButton(true)
       ↓
con.safeApply() → Update view
```

---

## Media Support

### Image Handling

**Upload Process**:
```javascript
// Template element triggers upload
<div class="upload-box" id="upload-comp-img" uploadfiles>
  <span class="icon-Image"></span>
</div>

// On upload success:
currSettings.imageUrl = uploadedImagePath;
currSettings.imageUploadOrReplace = "Replace";
```

**Rendering**:
```html
<img class='pc-image primary-image image-source itcMedia' 
     alt="{{fieldData.settings.altText}}"
     ng-src="{{fieldData.settings.imageUrl}}"
     editprimarymedia>
```

### Video Handling

**Upload Types**:

1. **System Upload (MP4)**:
```javascript
currSettings.uploadtype = "uploadbysystem";
// Video.js initialization
videojs(videoElement);
```

2. **YouTube URL**:
```javascript
currSettings.uploadUrltype = "youtube";
currSettings.youtubeVideoName = "VIDEO_ID";
// Embed URL: https://www.youtube.com/embed/VIDEO_ID
```

3. **Vimeo URL**:
```javascript
currSettings.uploadUrltype = "vimeo";
currSettings.youtubeVideoName = "VIDEO_ID";
// Embed URL: https://player.vimeo.com/video/VIDEO_ID
```

**Caption Tracks**:
```javascript
currSettings.tracks = [
  {
    kind: "captions",
    src: "path/to/captions.vtt",
    srclang: "en",
    label: "English"
  }
];
```

### Audio Handling

**Player Initialization**:
```javascript
$('.identifyTheClipComponent').find('audio').each(function(index, ele) {
  audiojs.create(ele);
});
```

**Play in Background**:
```javascript
currSettings.playinBackground = true;
// Audio continues playing during page navigation
```

---

## Answer Validation

### Validation Modes

#### Mode 1: Allow Response Only (`allowResponse: true, answerMatch: false`)
- **Behavior**: Accepts any non-empty answer as correct
- **Use Case**: Open-ended questions where any effort is counted

```javascript
if (JSON.parse(allowResponse) && !JSON.parse(answerMatch)) {
  // If answer field and correct answer are both empty → false
  // Otherwise → true (any response accepted)
  return true;
}
```

#### Mode 2: Exact Match (`allowResponse: true, answerMatch: true`)
- **Behavior**: Validates against expected answer(s)
- **Features**:
  - Multiple correct answers separated by pipe `|`
  - Case-insensitive comparison
  - Whitespace normalization
  - Quote normalization (smart quotes → standard quotes)
  - HTML tag stripping

```javascript
function validateAnswer(textField) {
  const dataCorrectAnswer = $(answerField).attr('data-correct-answer');
  
  // Split correct answers: "Paris|paris|capitale"
  let splittedCorrectAnswers = dataCorrectAnswer.split('|').map(item => {
    return cleanHtmlValues(item);
  });
  
  // Get and normalize user input
  const userInput = answerField.innerHTML || answerField.value;
  let userAnswers = userInput.split('|').map(item => {
    return cleanHtmlValues(item);
  });
  
  // Check if ANY user answer matches ANY correct answer
  for (let i = 0; i < userAnswers.length; i++) {
    if (splittedCorrectAnswers.includes(userAnswers[i])) {
      return true;
    }
  }
  
  return false;
}
```

**Text Normalization**:
```javascript
function cleanHtmlValues(item) {
  return item
    .replace(/<[^>]*>/g, '')      // Remove HTML tags
    .replace(/\&nbsp;/g, '')       // Remove &nbsp;
    .trim()                        // Trim whitespace
}

function normalizeQuotes(html) {
  return cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/[''‚‛]/g, "'")      // Normalize single quotes
    .replace(/[""„‟]/g, '"')      // Normalize double quotes
    .replace(/\s+/g, ' ')         // Collapse multiple spaces
    .toLowerCase()
    .trim();
}
```

#### Mode 3: No Validation (`allowResponse: false`)
- **Behavior**: No validation performed
- **Use Case**: Teacher-graded assignments
- **Result**: Returns "notValidate" status

---

## Custom Keyboard Support

### Language-Based Keyboards

**Supported Languages**:
- French (FRA)
- Spanish (ESP)
- German (GER)
- Math (MATH) - includes mathematical symbols

**Activation**:
```javascript
// Check if subject has custom keyboard available
let SelectLang = con.customKeyboardLanguageData.filter(
  item => item.subject === con.userSubjectLang.trim()
);

if (SelectLang.length > 0) {
  scope.fieldData.settings.isCustomKeyboardEnable = true;
  scope.fieldData.settings.userSubjectLang = con.userSubjectLang;
}
```

**UI Structure**:
```html
<div class="SLA-custKeybCont customKeybord-cantsiner">
  <div class="keyboard_btn" ng-click="openCustomKeyboard()">
    <span class="open__custom__keyBoard">+</span>
    <span class="close__custom__keyBoard hide">x</span>
    Add Special Characters
  </div>
  
  <div class="keyboard-parent hide">
    <div class="keyboard-header">
      <span class="tab-text custom-keyboardTabName active-Tab">FRENCH</span>
    </div>
    <div class="keys">
      <div class='key__button' ng-click="keyboardKeyPressEvent($event)"
           ng-repeat="lang in tempScopeActiveKeyboardLanguage">
        {{lang}}
      </div>
    </div>
  </div>
</div>
```

**Character Insertion**:

For **Short Answer**:
```javascript
scope.keyboardKeyPressEvent = function(event) {
  document.execCommand('insertText', false, event.currentTarget.textContent);
}
```

For **RTE (iframe-based)**:
```javascript
scope.insertTextAtCursor = function(text) {
  const selection = $$orginal.contentDocument.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  // Update RTE value
  $('.ansRTE')[0].value = $$orginal.value();
  scope.fieldData.answerText = $$orginal.value();
}
```

---

## Rich Text Editor (RTE) Integration

### Cazary Editor Architecture

**Iframe-based Editor**:
```javascript
const EditorCore = function(edit, value, style, mathLiveScript) {
  let contentWindow = edit.contentWindow;
  let contentDocument = contentWindow.document;
  
  // Set design mode
  contentDocument.designMode = "on";
  
  // Initialize with HTML structure
  const iframehtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>${style}</style>
        <script src="${mathLiveScript}"></script>
      </head>
      <body></body>
    </html>
  `;
  
  _setHTML(iframehtml);
  _setValue(value);
}
```

**Command Toolbar**:
```javascript
const PRE_DEFINED_MACROS = {
  "MINIMAL": [
    "bold italic underline",
    usersubjectlangformathitc == 'math'
      ? "insertorderedlist insertunorderedlist matheditor"
      : "insertorderedlist insertunorderedlist"
  ]
};
```

**Commands Available**:
- `bold`, `italic`, `underline` - Text formatting
- `insertorderedlist`, `insertunorderedlist` - Lists
- `matheditor` - Math equation insertion (Math subject only)

### Math Equation Support (MathLive)

**Insertion**:
```javascript
// Insert math field into iframe
iframe.execCommand("insertHTML", false, 
  "<span class='auth-mathfield-holder' data-extract='" + matheqLen + "'>" +
    "<math-field class='mathFieldEq' id='mathEq" + matheqLen + "'></math-field>" +
  "</span>"
);

// Initialize math field
let clickEventBind = iframe.document.getElementById('mathEq' + matheqLen);
$(clickEventBind).on('input', mathRTEFieldChange);
```

**Value Tracking**:
```javascript
var mathRTEFieldChange = function(ev) {
  var value = ev.target.value;
  const existingEquation = $(selectedNode).closest(".auth-mathfield-holder");
  $(existingEquation).attr('data-equation-latex', value);
  
  // Update textarea value
  $('.ansRTE')[0].value = $$orginal.value();
}
```

### Dynamic Height Adjustment

```javascript
function adjustEditorHeight() {
  const iframes = document.getElementsByClassName('cazary-edit');
  
  Array.from(iframes).forEach(iframe => {
    const iframeDoc = iframe.contentDocument;
    const contentHeight = Math.max(
      iframeDoc.body.scrollHeight,
      iframeDoc.body.offsetHeight,
      150 // Minimum height
    );
    
    iframe.style.height = `${contentHeight}px`;
  });
}
```

---

## SCORM Integration

### State Tracking Object

```javascript
function createScormObject($form) {
  let scoObj = {
    isSubmitEnable: !$form.find(".submit-btn").hasClass("disabled"),
    isShowMeEnable: !$form.find(".showme-btn").hasClass("disabled"),
    isTryAgainEnable: !$form.find(".tryagn-btn").hasClass("disabled"),
    isResetEnable: !$form.find(".reset-btn").hasClass("disabled"),
    
    totalNoOfAttempt: Number($form.find(".submit-btn").attr('data-no-of-attempts')),
    attemptsDone: Number($form.find(".submit-btn").attr('data-attempts')),
    
    inputSeleced: [],      // User's answers
    inputCorrect: [],      // Indices of correct answers
    inputIncorrect: [],    // Indices of incorrect answers
    
    feedbackMessage: {},
    isSubmitted: $form.hasClass("submitted"),
    
    dataType: "identify-the-clip",
    componentId: $form.parents('.customClass').attr('data-saved-index')
  };
  
  return scoObj;
}
```

### State Persistence

```javascript
function stateMainatainShortAndLongActiviy(event) {
  var $form = $(event.target).parents('form');
  var scoObj = createScormObject($form);
  
  if (typeof apiHandle != "undefined") {
    saveAction(event, scoObj);  // Save to SCORM API
  }
}
```

### Latency Tracking

```javascript
// Track when user first interacts
if (!$(event.target).parents('.customClass').attr('latencyTime')) {
  let d = new Date();
  let tm = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  $(event.target).parents('.customClass').attr('latencyTime', tm);
}
```

---

## Styling & Themes

### Style System

**CSS Architecture**:
```css
.identifyTheClipComponent {
  /* Base component styles */
}

.identifyTheClipComponent.style1 {
  /* Basic style variant */
}

.identifyTheClipComponent.style2 {
  /* Thumbnail style variant */
  border: 1px dashed #2175d1;
  padding: 10px;
  border-radius: 12px !important;
}
```

### Outline Options

**No Outline** (`outline: "outline"`):
```css
.identifyTheClipComponent.outline {
  background-color: transparent;
  border: none;
}
```

**Outline & Background** (`outline: "outlineBg"`):
```css
.identifyTheClipComponent.outlineBg {
  background-color: var(--outlineBgColor);
  padding: 0 10px;
  border-radius: 8px;
}
```

### Color Palette

**Predefined Colors**:
```json
"colorvalues": [
  { "colorcode": "#D2E6E8" },
  { "colorcode": "#EAE2C8" },
  { "colorcode": "#EDEFBA" },
  { "colorcode": "#C7C7C7" },
  { "colorcode": "#FFFFFF" }
]
```

### Feedback States

**Correct Answer**:
```css
.itcCorrect {
  color: green;
  border: 1px solid green !important;
  border-radius: 5px;
  background-color: #EAFBF4 !important;
}
```

**Incorrect Answer**:
```css
.itcIncorrect {
  color: red;
  border: 1px solid red !important;
  border-radius: 5px;
  background-color: #FFF3F4 !important;
}
```

### Responsive Design

**Focus States**:
```css
.identifyTheClipComponent .questionText:focus,
.identifyTheClipComponent .shortAnsText:focus {
  border-bottom: 1px solid var(--theme-color);
  outline-color: #113e9a;
}
```

**Disabled States**:
```css
.disabled-rte {
  pointer-events: none;
}

.disabled-rte .cazary-commands-wrapper {
  opacity: 0.5;
  pointer-events: none;
}
```

---

## Known Issues

### 1. RTE State Management
**Issue**: RTE iframe content sometimes doesn't sync properly with Angular model
**Impact**: Answer might not save correctly on first attempt
**Workaround**: Multiple change event listeners ensure eventual consistency

```javascript
// Current implementation has redundant triggers
$(textArea).on('input', function(event) {
  stateMainatainShortAndLongActiviy(event);
});
$($$orginal.contentDocument).trigger('input');
```

### 2. Custom Keyboard Position
**Issue**: Custom keyboard position isn't dynamically calculated
**Impact**: Can overflow on smaller screens
**Location**: `.SLA-custKeybCont` positioning logic

### 3. Video Caption Loading
**Issue**: Closed captions don't always load on initial render
**Impact**: Accessibility affected for hearing-impaired users
**Workaround**: User must toggle CC button

### 4. Math Editor in RTE
**Issue**: Math equations require manual click binding after insertion
**Impact**: First equation insertion may not trigger input events
**Location**: `identify-the-clip-directive.js` lines 1070-1085

```javascript
// Delayed binding required
setTimeout(function() {
  let clickEventBind = iframe.document.getElementById('mathEq' + matheqLen);
  $(clickEventBind).on('input', mathRTEFieldChange);
}, 1000);
```

### 5. Paste Handling Inconsistency
**Issue**: Different paste behaviors between short answer and RTE
**Impact**: Users may experience unexpected formatting retention
**Location**: `identify-the-clip-preview1.js` lines 99-127

### 6. SCORM Timing
**Issue**: Rapid submit actions can cause race conditions
**Impact**: State might not save correctly
**Recommendation**: Add debouncing to save actions

### 7. Answer Validation Edge Cases
**Issue**: Empty string handling inconsistent
**Examples**:
- `""` vs `"<br>"` vs `" "`
- Multiple pipes `|||` not handled
- Leading/trailing pipes cause issues

```javascript
// Problem case:
userInput = "|answer1||answer2|"
// Creates empty array elements
```

### 8. Media Upload Feedback
**Issue**: No loading indicator during file upload
**Impact**: User uncertain if upload is processing
**Recommendation**: Add spinner/progress bar

### 9. Group Activity Integration
**Issue**: Group interactivity container logic is incomplete
**Impact**: Submit button state doesn't always update correctly
**Location**: Lines checking `.group-interactivity-container`

### 10. Browser Compatibility
**Issue**: Safari has issues with `contenteditable` div behaviors
**Impact**: Special character insertion may fail
**Affected**: Custom keyboard functionality

---

## Recommendations

### High Priority

#### 1. Refactor State Management
**Current Issue**: Scattered state updates across multiple functions
**Recommendation**: Implement centralized state manager

```javascript
// Proposed solution
class IdentifyTheClipState {
  constructor(componentId) {
    this.id = componentId;
    this.answer = '';
    this.isSubmitted = false;
    this.validationResult = null;
  }
  
  updateAnswer(value) {
    this.answer = value;
    this.notifyObservers();
  }
  
  submit() {
    this.isSubmitted = true;
    this.validationResult = this.validate();
    this.save();
  }
}
```

#### 2. Separate Angular Directive and jQuery Logic
**Current Issue**: Mixing AngularJS and jQuery creates maintenance difficulties
**Recommendation**: 
- Move pure DOM manipulations to services
- Use Angular directives for data binding
- Reduce `$scope.$apply()` calls

#### 3. Improve RTE Integration
**Current Issue**: Cazary editor initialization is complex and fragile
**Recommendation**: Consider modern alternatives
- CKEditor 5
- TinyMCE
- Quill.js

**Benefits**:
- Better mobile support
- Modern API
- Active maintenance
- Better accessibility

#### 4. Add Input Sanitization
**Current Issue**: Limited XSS protection
**Recommendation**: Implement DOMPurify or similar

```javascript
function sanitizeInput(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'br', 'p', 'span'],
    ALLOWED_ATTR: []
  });
}
```

### Medium Priority

#### 5. Enhance Error Handling
**Add**:
- Try-catch blocks around critical operations
- User-friendly error messages
- Console logging for debugging

```javascript
try {
  validateAnswer(textField);
} catch (error) {
  console.error('Validation error:', error);
  showUserMessage('An error occurred. Please try again.');
}
```

#### 6. Improve Accessibility
**Additions Needed**:
- ARIA labels for all interactive elements
- Keyboard navigation for custom keyboard
- Screen reader announcements for feedback
- Focus management after submit

```html
<button class="submit-btn" 
        aria-label="Submit your answer"
        aria-describedby="feedback-message">
  Submit
</button>
<div id="feedback-message" role="alert" aria-live="assertive"></div>
```

#### 7. Add Loading States
**For**:
- Media uploads
- Video loading
- SCORM saves

```javascript
function showLoader(targetElement) {
  $(targetElement).append(
    '<div class="spinner-overlay">' +
      '<div class="spinner"></div>' +
    '</div>'
  );
}
```

#### 8. Implement Character Limit Warning
**Enhancement**: Visual feedback before hitting limit

```javascript
// Update as user types
$('.shortAnsText').on('input', function() {
  const current = $(this).text().length;
  const max = scope.fieldData.settings.shortAnsCharLimit;
  const remaining = max - current;
  
  if (remaining < 50) {
    $('.char-count').addClass('warning');
  }
});
```

### Low Priority

#### 9. Code Documentation
**Add**:
- JSDoc comments for all functions
- Inline comments for complex logic
- README for component usage

```javascript
/**
 * Validates user answer against expected response(s)
 * @param {HTMLElement} textField - The answer input field
 * @returns {boolean|string} - true if correct, false if incorrect, "notValidate" if validation disabled
 */
function validateAnswer(textField) {
  // Implementation
}
```

#### 10. Unit Testing
**Implement**:
- Jasmine/Karma for AngularJS
- Test validation logic
- Test state transitions
- Mock SCORM API

```javascript
describe('validateAnswer', function() {
  it('should return true for exact match', function() {
    // Test implementation
  });
  
  it('should handle multiple correct answers', function() {
    // Test implementation
  });
});
```

#### 11. Performance Optimization
**Areas**:
- Debounce input events
- Lazy load media
- Optimize DOM queries
- Cache jQuery selectors

```javascript
// Cache selectors
const $form = $(this).parents('form');
const $submitBtn = $form.find('.submit-btn');
const $inputs = $form.find('input, textarea');
```

#### 12. Mobile Optimization
**Improvements**:
- Touch-friendly button sizes
- Mobile-optimized custom keyboard
- Responsive video player
- Prevent zoom on input focus

```css
/* Prevent zoom on iOS */
input, textarea {
  font-size: 16px;
}

/* Touch-friendly buttons */
.submit-btn {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Offline/Package Behavior

### Offline Capabilities

**What Works Offline**:
✅ Answer input (short and RTE)
✅ Submit/validation (if answer key embedded)
✅ Feedback display
✅ Custom keyboard
✅ Math equation input
✅ Local media (embedded in package)

**What Requires Online**:
❌ YouTube/Vimeo video playback
❌ External media URLs
❌ SCORM saves (queued until online)
❌ Media upload (authoring mode only)

### Package Structure

```
package/
├── index.html
├── templates/
│   └── identify-the-clip/
│       ├── identify-the-clip.html
│       ├── scripts/
│       │   ├── identify-the-clip-directive.js
│       │   └── identify-the-clip-preview1.js
│       ├── styles/
│       │   └── identify-the-clip-template.css
│       └── default/
│           └── identify-the-clip.json
├── assets/
│   ├── externalModules/
│   │   └── math-live/
│   └── images/
│       └── [component-images]
└── js/
    ├── angular.min.js
    ├── jquery.min.js
    ├── video.min.js
    └── audio.min.js
```

### Embedded Media Handling

**Image Packaging**:
```json
"media": {
  "src": "assets/images/lesson1/diagram.png"  // Relative path
}
```

**Video Caption Packaging**:
```json
"tracks": [
  {
    "src": "assets/captions/video1-en.vtt",
    "srclang": "en"
  }
]
```

---

## Security Considerations

### XSS Prevention
**Current Measures**:
- AngularJS automatic escaping for `ng-bind`
- Limited HTML in contenteditable divs

**Improvements Needed**:
- Sanitize RTE output
- Validate media URLs
- Escape user input before SCORM save

### Data Privacy
**User Data Collected**:
- Answer text
- Submission timestamp
- Attempt count
- Latency time
- Validation results

**SCORM Data**:
```javascript
// Data sent to LMS
{
  "cmi.interactions.n.id": "identify-the-clip-{componentId}",
  "cmi.interactions.n.type": "fill-in",
  "cmi.interactions.n.learner_response": "{userAnswer}",
  "cmi.interactions.n.result": "correct|incorrect",
  "cmi.interactions.n.latency": "{latencyTime}"
}
```

---

## Appendix

### A. Event Handlers Reference

| Event | Handler | Description |
|-------|---------|-------------|
| Component Click (Editor) | `introclick()` | Opens settings panel |
| Submit Button | `submitAnswerITC()` | Validates and processes answer |
| Try Again Button | `tryagainITC()` | Resets answer fields |
| Show Me Button | `showAnswerITC()` | Displays correct answer |
| Reset Button | `resetAnswerITC()` | Clears all inputs |
| Custom Keyboard Toggle | `openCustomKeyboard()` | Shows/hides keyboard |
| Keyboard Key Click | `keyboardKeyPressEvent()` | Inserts character |
| Answer Type Change | `answerTypeBtn.onChange()` | Switches short/RTE |
| Media Type Change | `mediaTypeBtn.onChange()` | Switches image/video/audio |

### B. CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.identifyTheClipComponent` | Root component container |
| `.ITCForm` | Form wrapper |
| `.questionText` | Question input field |
| `.shortAnsText` | Short answer input |
| `.longAnsText` / `.ansRTE` | RTE textarea |
| `.itcCorrect` | Correct answer state |
| `.itcIncorrect` | Incorrect answer state |
| `.itc-alert` | Feedback container |
| `.cazary` | RTE wrapper |
| `.SLA-custKeybCont` | Custom keyboard container |
| `.mediaContainer` | Media wrapper |
| `.disabled-rte` | Disabled RTE state |

### C. Configuration Flags Reference

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `showMedia` | Boolean | `true` | Display media section |
| `activeAns` | String | `"shortAns"` | Answer type (shortAns/RTE) |
| `allowResponse` | Boolean | `false` | Enable validation |
| `answerMatch` | Boolean | `false` | Exact match validation |
| `isHeaderVisible` | Boolean | `true` | Show header text |
| `questionNoField` | Boolean | `false` | Show label field |
| `ansTextHint` | Boolean | `true` | Show pipe separator hint |
| `isCustomKeyboardEnable` | Boolean | `false` | Enable custom keyboard |
| `genericFeedbackCheckbox` | Boolean | `true` | Show generic feedback |
| `optionalcaption` | Boolean | `false` | Show media caption |
| `playinBackground` | Boolean | `false` | Audio plays in bg |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Base component implementation |
| 1.1 | - | Added RTE support (Cazary) |
| 1.2 | - | Added custom keyboard |
| 1.3 | - | Added MathLive integration |
| 1.4 | - | Added video caption support |
| Current | Feb 2026 | This documentation |

---

## Contact & Support

For issues or questions regarding this component:
- Check the known issues section first
- Review SCORM API integration
- Test in preview mode before deployment
- Validate media paths in offline packages
