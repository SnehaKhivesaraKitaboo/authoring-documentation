# Short Long Answer (Question Answer) Component - Technical Documentation

## Table of Contents
1. [Component Overview](#1-component-overview)
2. [Component Structure](#2-component-structure)
3. [Component Types and Variants](#3-component-types-and-variants)
4. [Architecture and Data Flow](#4-architecture-and-data-flow)
5. [Configuration Settings](#5-configuration-settings)
6. [Rendering Logic](#6-rendering-logic)
7. [Key Features](#7-key-features)
8. [Offline/Package Behavior](#8-offlinepackage-behavior)
9. [Error Handling](#9-error-handling)
10. [Technical Specifications](#10-technical-specifications)
11. [Known Issues](#11-known-issues)
12. [Recommendations](#12-recommendations)

---

## 1. Component Overview

### Purpose
The **Short Long Answer Component** (also known as "Question Answer" component) is an interactive authoring and assessment component that allows users to:
- Create short answer questions with single-line text input
- Create long answer questions with multi-line text input
- Create Rich Text Editor (RTE) based questions with formatting capabilities
- Support mathematical equations and special characters
- Provide SCORM-compliant state management for learner responses

### Component Identifier
- **Template Name**: `shortLongAns`
- **Data Type**: `shortLongAns`
- **Component Class**: `.shortLongAnsComponent`

---

## 2. Component Structure

### File Organization
```
templates/shortLongAns/
├── shortLongAns.html                      # Main template HTML
├── shortLongAns-settings-pannel.html      # Settings panel UI
├── default/
│   └── shortLongAns.json                  # Default configuration schema
├── scripts/
│   ├── shortLongAns-directive.js          # Editor/Authoring directive (2163 lines)
│   └── shortLongAns-preview1.js           # Preview/Reader logic (2499 lines)
└── styles/
    └── shortLongAns-template.css          # Component styles (671 lines)
```

### Key Files Description

#### shortLongAns.html (Main Template)
- Renders the question and answer input fields
- Supports 3 answer types: Short Answer, Long Answer, RTE
- Includes custom keyboard support for special characters
- Contains submit/reset button container

#### shortLongAns-directive.js (Editor Mode)
- AngularJS directive for authoring interface
- Manages Jodit and Cazary (Basic RTE) editor initialization
- Handles custom keyboard integration
- Implements math field support via MathLive
- Manages state synchronization with parent scope

#### shortLongAns-preview1.js (Preview/Reader Mode)
- jQuery-based preview and learner interaction logic
- SCORM state management (suspend_data, latency tracking)
- Editor initialization for learner view
- Input validation and character limit enforcement
- Submit/reset functionality

#### shortLongAns-template.css
- Component styling including RTE toolbar
- Custom keyboard styling
- Responsive layout and accessibility styles
- Theme-aware color schemes

---

## 3. Component Types and Variants

### 3.1 Short Answer Type
**Type Name**: `shortAns`

**Behavior**:
- Single-line text input with horizontal scrolling
- Character limit: 150 characters (default, configurable)
- Inline display with auto-scroll for overflow
- `contenteditable` div-based input

**Use Cases**:
- Single word answers
- Dates, names, short phrases
- Fill-in-the-blank responses

**HTML Element**:
```html
<div contenteditable="true" 
     class="shortAnsText characters_count" 
     maxlength="150"
     placeholder="Short Answer Text">
</div>
```

**Rendering Characteristics**:
- No line breaks allowed (CSS: `white-space: nowrap`)
- Min-height: 45px
- Border: 2px solid #ccc

---

### 3.2 Long Answer Type
**Type Name**: `longAns`

**Behavior**:
- Multi-line textarea with vertical scrolling
- Character limit: 5000 characters (default, configurable)
- Line breaks supported
- Native `<textarea>` element

**Use Cases**:
- Paragraph responses
- Essay questions
- Descriptive answers
- Extended explanations

**HTML Element**:
```html
<textarea rows="1" 
          class="longAnsText characters_count longAnsTextArea" 
          maxlength="5000"
          placeholder="Long Answer Text">
</textarea>
```

**Rendering Characteristics**:
- Min-height: 135px
- Auto-resize based on content
- Border: 2px solid #ccc
- Line-height: 1.5

---

### 3.3 RTE (Rich Text Editor) Type
**Type Name**: `RTE`

The RTE type has two keyboard variants:

#### 3.3.1 Basic RTE (Cazary Editor)
**Keyboard Type**: `BASIC`

**Features**:
- Custom lightweight iframe-based RTE
- Minimal toolbar: bold, italic, underline, lists
- Built-in using Cazary library
- Character limit: 5000 characters
- Math equation support via MathLive

**Toolbar Commands**:
```javascript
PRE_DEFINED_MACROS.MINIMAL = [
    "bold italic underline",
    "insertorderedlist insertunorderedlist"
]
```

**Use Cases**:
- Simple formatted responses
- When lightweight editor is needed
- Legacy content compatibility

---

#### 3.3.2 Advanced RTE (Jodit Editor)
**Keyboard Type**: `JODIT`

**Features**:
- Full-featured WYSIWYG editor
- Comprehensive formatting toolbar (40+ buttons)
- Table support, links, media embedding
- Advanced text styling and alignment
- Math equation support via MathLive
- Character limit: 5000 characters

**Toolbar Buttons** (ELA Configuration):
```javascript
joditToolbars.ELA = [
    'bold', 'italic', 'underline', 'strikethrough',
    'eraser', 'ul', 'ol', 'font', 'fontsize', 'paragraph',
    'lineHeight', 'spellcheck', 'indent', 'outdent', 'align', 
    'brush', 'superscript', 'subscript',
    'cut', 'copy', 'paste', 'selectall', 'hr', 'table',
    'link', 'symbols', 'find', 'fullsize', 'preview', 'print', 
    'undo', 'redo'
]
```

**Use Cases**:
- Complex formatted responses
- Research papers
- Rich content creation
- Professional document editing

---

## 4. Architecture and Data Flow

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main Controller                          │
│                    (myController scope)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Component Container (.customClass)                  │
│  Attributes: data-type, page-no, saved-index, data-no          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          shortLongAnsComponent Container                         │
│  Attributes: answer-type, keyboard-type, data-pretext,         │
│              cust-keyb-enabled, data-usersubjectlangformathqa   │
└──┬──────────────────────┬──────────────────────┬────────────────┘
   │                      │                      │
   ▼                      ▼                      ▼
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│ Question │      │ Answer Input │      │Custom Keyboard│
│  Field   │      │   Editor     │      │  (Optional)   │
└──────────┘      └──────────────┘      └──────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  Submit/Reset  │
                  │    Buttons     │
                  └────────────────┘
```

### 4.2 Data Flow Diagram

```
Editor Mode (Authoring):
┌────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Author    │────────▶│  shortlongans    │────────▶│   Scope     │
│  Input     │         │   -Template      │         │  fieldData  │
└────────────┘         │   Directive      │         └─────────────┘
                       └──────────────────┘                │
                                │                          │
                                │                          ▼
                                ▼                 ┌──────────────────┐
                       ┌──────────────────┐       │  savedJson       │
                       │  Settings Panel  │◀──────│  [pageNo]        │
                       │   (Right Panel)  │       │  [uniqueId]      │
                       └──────────────────┘       └──────────────────┘

Preview/Reader Mode:
┌────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Learner   │────────▶│  shortLongAns    │────────▶│   SCORM     │
│  Input     │         │   -preview1.js   │         │   State     │
└────────────┘         └──────────────────┘         └─────────────┘
                                │                          │
                                │                          │
                                ▼                          ▼
                       ┌──────────────────┐       ┌──────────────────┐
                       │  State Maint.    │       │  apiHandle       │
                       │  Function        │──────▶│  SetValue()      │
                       └──────────────────┘       └──────────────────┘
```

### 4.3 Component Lifecycle

#### Editor Mode (Authoring):
1. **Initialization**:
   - Directive link function executes
   - Load default configuration from `shortLongAns.json`
   - Check for custom keyboard language support
   - Set keyboard type based on client configuration

2. **Editor Setup**:
   - For RTE type:
     - If JODIT: Initialize Jodit editor with toolbar config
     - If BASIC: Initialize Cazary iframe-based editor
   - For Short/Long: Setup contenteditable/textarea elements

3. **Data Binding**:
   - Two-way binding with `fieldData` scope
   - Auto-save on input changes
   - Base64 encoding for data persistence (data-pretext attribute)

4. **Settings Management**:
   - Settings panel updates `currSettings`
   - Changes propagate to `savedJson[pageNo][uniqueId]`
   - Save button state management

#### Preview/Reader Mode:
1. **Initialization**:
   - Parse saved data from data-pretext attribute
   - Initialize appropriate editor based on answer-type
   - Restore previous learner responses (SCORM data)

2. **Interaction**:
   - Input validation and character counting
   - Enable/disable submit button based on input
   - Track attempt state and latency

3. **Submission**:
   - Mark form as submitted
   - Disable inputs and editors
   - Save state to SCORM

4. **State Persistence**:
   - Save learner responses to `suspend_data`
   - Track activity start time and latency
   - Maintain dirty bit for unsaved changes

---

## 5. Configuration Settings

### 5.1 Default Configuration (shortLongAns.json)

```json
{
  "identifier": "shortLongAns",
  "templateName": "shortLongAns",
  "questiontext": "",
  "question": "Question 1",
  "secondaryQuestion": "Part A",
  "answerText": "",
  "settings": {
    "labelType": "primary",
    "activeAns": "shortAns",
    "keyboardType": "basic",
    "isSubmitRTEButton": false,
    "shortAnsCharLimit": "150",
    "longAnsCharLimit": "5000",
    "outline": "outline",
    "outlineBgColor": "#ffffff",
    "bgColor": "#ebebeb",
    "metaTags": [],
    "altText": "",
    "styleSelected": "style1",
    "headerStyleSettings": true,
    "isLabelTypeShortLong": false,
    "isCustomKeyboardEnable": false,
    "isLangKeyboardEnable": false,
    "userSubjectLang": "",
    "colorvalues": [...]
  }
}
```

### 5.2 Settings Panel Options

#### Answer Type Settings
| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `activeAns` | Radio | `shortAns`, `longAns`, `RTE` | Type of answer input |
| `keyboardType` | Radio | `BASIC`, `JODIT` | RTE editor type (only for RTE) |
| `isSubmitRTEButton` | Boolean | true/false | Show submit button for RTE |

#### Label Settings
| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `isLabelTypeShortLong` | Checkbox | true/false | Show label type above question |
| `labelType` | Radio | `primary`, `secondary` | Label style (visual variant) |
| `question` | Text | string | Primary label text ("Question 1") |
| `secondaryQuestion` | Text | string | Secondary label text ("Part A") |

#### Character Limits
| Setting | Type | Default | Range | Description |
|---------|------|---------|-------|-------------|
| `shortAnsCharLimit` | Number | 150 | 1-5000 | Max chars for short answer |
| `longAnsCharLimit` | Number | 5000 | 1-10000 | Max chars for long answer |

#### Style Settings
| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `outline` | Radio | `outline`, `outlineBg` | Border style |
| `outlineBgColor` | Color | Hex color | Background color when outlineBg selected |
| `styleSelected` | String | `style1`, `style2` | Style template |

#### Custom Keyboard Settings
| Setting | Type | Values | Description |
|---------|------|--------|-------------|
| `isCustomKeyboardEnable` | Checkbox | true/false | Enable special character keyboard |
| `userSubjectLang` | String | `FRA`, `ESP`, `GER`, etc. | Language for special characters |
| `isLangKeyboardEnable` | Boolean | true/false | System-level keyboard availability |

#### Accessibility
| Setting | Type | Max Length | Description |
|---------|------|------------|-------------|
| `altText` | Textarea | 2000 chars | Alternative text for screen readers |
| `metaTags` | Text | N/A | Comma-separated tags for searchability |

---

## 6. Rendering Logic

### 6.1 Editor Mode (Authoring Interface)

#### Template Rendering
- Directive: `shortlongans-template`
- Settings Directive: `shortlongans-template-setting`
- Controller: AngularJS scope-based

**Key Functions**:

```javascript
// Initialize editors
setTimeout(() => {
  if (fieldData.settings.activeAns == 'RTE' && 
      fieldData.settings.keyboardType == 'JODIT') {
    jEditor = Jodit.make("textarea#jodit-[pagecount]-[uiId]", config);
  }
}, 100);

// String encoding for persistence
scope.getStringifiedPreText = function() {
  return btoa(unescape(encodeURIComponent(fieldData.answerText)));
}

// Custom keyboard interaction
scope.keyboardKeyPressEvent = function(event) {
  if (isRTEIframActive) {
    scope.insertTextAtCursor(event.currentTarget.textContent);
  } else {
    document.execCommand('insertText', false, 
                         event.currentTarget.textContent);
  }
}
```

### 6.2 Preview/Reader Mode

#### Initialization
```javascript
$(function() {
  // Parse data-pretext
  let text = decodeURIComponent(escape(atob($comp.attr("data-pretext"))));
  text = recursiveParseJson(text);
  
  // Set input values
  $comp.find("input, textarea").each(function() {
    $(this).val(text);
  });
  
  // Initialize RTE if needed
  if ($comp.attr("answer-type") == "RTE") {
    initializeJoditEditor();
  }
});
```

#### Input Handling
```javascript
$(document).on('input', '.customClass[data-type="shortLongAns"] div.shortAnsText', 
  function(event) {
    insertValueShortLongAns(event);
  }
);

function insertValueShortLongAns(event) {
  // Check if input has value
  // Enable/disable submit button
  // Update SCORM state
  // Set latency time
}
```

#### Submission
```javascript
function submitAnswerRTE(event) {
  // Mark as submitted
  // Disable inputs
  // Save to SCORM
  if (typeof apiHandle !== "undefined") {
    stateMainatainShortAndLongActiviy(event);
  }
}
```

### 6.3 Reader Mode (Learner View)

**Display States**:
1. **Initial State**: Empty or pre-populated (from previous session)
2. **Active State**: Learner typing, character count updating
3. **Submitted State**: Inputs disabled, read-only view
4. **Read-Only State**: Activity in progress (window.isActivityInprogress)

**State Indicators**:
- Submit button: Disabled until input provided
- Reset button: Enabled after input, clears content
- Character counter: Shows current/max characters
- Attempted class: `.attempted-question` added to form

---

## 7. Key Features

### 7.1 Math Equation Support

**Integration**: MathLive library (math-field web component)

**Functionality**:
- Insert math equations inline with text
- Virtual keyboard for math input
- LaTeX format storage
- Read-only rendering in preview

**Implementation**:
```javascript
var insertMathField = function(editor) {
  var matheqLen = $('.auth-mathfield-holder').length + 1;
  var markerEl = "<span class='auth-mathfield-holder' data-extract='" + 
                 matheqLen + "'><math-field id='mathEq" + matheqLen + 
                 "'></math-field></span>";
  range.insertNode($(markerEl)[0]);
  
  let mf = document.getElementById('mathEq' + matheqLen);
  mf.addEventListener('input', mathFieldChange);
  mf.virtualKeyboardTargetOrigin = "*";
  mf.mathModeSpace = '\\:';
}
```

**Data Storage**:
- LaTeX stored in `data-equation-latex` attribute
- Restored on editor initialization

### 7.2 Custom Keyboard (Special Characters)

**Supported Languages**:
- French (FRA)
- Spanish (ESP)
- German (GER)
- Others (configurable via customKeyboardLanguageData)

**Features**:
- Toggle open/close
- Insert special characters at cursor position
- Works with all answer types
- Disabled if language not compatible

**HTML Structure**:
```html
<div class="SLA-custKeybCont customKeybord-cantsiner">
  <div class="keyboard_btn">
    <span class="open__custom__keyBoard">+</span>
    Add Special Characters
  </div>
  <div class="keyboard-parent hide">
    <div class="keyboard-header">
      <span class="tab-text custom-keyboardTabName active-Tab"></span>
    </div>
    <div class="keys">
      <div class="key__button" ng-repeat="lang in activeKeyboardLanguage">
        {{lang}}
      </div>
    </div>
  </div>
</div>
```

### 7.3 Character Counting

**Display Format**:
```html
<div class="characters_display">
  <span class="current_characters">150 /</span> 
  5000 characters
</div>
```

**Logic**:
- Updates on keyup/paste events
- Shows current count only when >0 characters
- Enforces maxlength via HTML attribute and JS
- Different limits for short/long/RTE types

### 7.4 Submit and Reset Functionality

**Submit Button**:
- Disabled by default
- Enabled when input provided
- On click: Marks as submitted, saves state, disables inputs
- For RTE: Sets read-only mode on editor

**Reset Button**:
- Clears input content
- Resets attempt state
- Re-enables submit button (if disabled)
- Maintains SCORM activity tracking

**Try Again Button**:
- Specific to RTE type with isSubmitRTEButton=true
- Allows re-attempting after submission

### 7.5 Label Types

**Primary Label**:
- Blue background (#F2F5FF)
- Rounded pill shape
- Use case: Main question number ("Question 1")

**Secondary Label**:
- White background with blue border
- Rounded pill shape
- Use case: Sub-question identifier ("Part A", "Part B")

### 7.6 Outline and Background Styles

**Outline Style**:
- No background
- Transparent component background
- Minimal visual footprint

**Outline & Fill Background Style**:
- Colored background for entire component
- 5 preset colors + custom color picker
- Padding adjusts automatically

**Color Palette**:
1. #D2E6E8 (Light Cyan)
2. #EAE2C8 (Beige)
3. #EDEFBA (Light Yellow)
4. #C7C7C7 (Light Gray)
5. #FFFFFF (White)

### 7.7 Group Interactivity

**Container**: `.group-interactivity-container`

**Behavior**:
- Multiple short/long answer components in a group
- Submit enabled only when ALL components attempted
- Class `.enableSubmit` added to container when ready

---

## 8. Offline/Package Behavior

### 8.1 SCORM Integration

**API Connection**:
- Uses `apiHandle` global object
- Standard SCORM 1.2/2004 API methods

**State Management Function**:
```javascript
function stateMainatainShortAndLongActiviy(event) {
  let scoObj = {
    isSubmitEnable: isSubmitEnable,
    componentId: $container.attr('data-saved-index'),
    dirtyBit: "true",
    inputSeleced: userInputValue
  };
  
  // Save to SCORM
  if (typeof apiHandle !== "undefined") {
    apiHandle.SetValue("cmi.suspend_data", JSON.stringify(scoObj));
  }
}
```

**SCORM Data Elements**:

| Element | Description | Data Type |
|---------|-------------|-----------|
| `cmi.suspend_data` | Learner response and state | JSON string |
| `cmi.core.lesson_status` | Activity completion status | Vocabulary |
| `componentId` | Unique identifier for instance | String (pageNo-uniqueId) |
| `inputSeleced` | Learner's answer text | String (HTML for RTE) |
| `isSubmitEnable` | Whether submitted | Boolean |
| `dirtyBit` | Unsaved changes indicator | Boolean |

### 8.2 Data Persistence

**Saved Data**:
- `scorm-saved-ans` attribute: Stores current answer
- `data-pretext` attribute: Base64 encoded answer for restoration
- `latencyTime`: Time of first input
- `activityStartTime`: Activity launch time

**Data Format (RTE)**:
- HTML string with inline styles and math-field elements
- Base64 encoded for transport
- Sanitized to prevent XML/XHTML errors

**Restoration**:
```javascript
// On component load
if ($comp.attr("scorm-saved-ans")) {
  let text = $comp.attr("scorm-saved-ans");
  editor.value(text);
  // Restore math fields
  $(text).find('.auth-mathfield-holder').each(function() {
    let mf = document.getElementById(mfId);
    mf.setValue(mathData);
  });
}
```

### 8.3 Offline Package Considerations

**Assets Required**:
- Jodit CSS/JS files
- MathLive library
- Custom keyboard language data
- Font files (Roboto-Regular)

**Base64 Encoding**:
- Prevents encoding issues in XML packages
- Handles special characters and Unicode
- Used for both data-pretext and suspend_data

**Character Sanitization**:
```javascript
function sanitizeHtmlForJodit(htmlString) {
  // Fix <br> tags to <br />
  // Remove invalid attributes
  // Escape ampersands
  // Remove empty tags
  return cleanedHtml;
}
```

---

## 9. Error Handling

### 9.1 Common Issues and Handling

#### Issue 1: Editor Initialization Failure
**Symptoms**: Editor doesn't appear, textarea visible instead

**Causes**:
- Jodit library not loaded
- Timing issue with DOM ready
- Conflicting CSS

**Handling**:
```javascript
function initializeJoditEditor() {
  if (typeof Jodit === 'undefined') {
    setTimeout(initializeJoditEditor, 500);
    return;
  }
  const textarea = document.querySelector(selector);
  if (!textarea) {
    setTimeout(initializeJoditEditor, 500);
    return;
  }
  // Proceed with initialization
}
```

#### Issue 2: Math Field Not Saving
**Symptoms**: Math equations disappear on save/restore

**Causes**:
- Event listener not attached
- LaTeX data not stored in attribute
- MathLive library not loaded

**Handling**:
```javascript
var mathFieldChange = function(ev) {
  var value = ev.target.value || ev.value;
  const existingEquation = $(selectedNode).closest(".auth-mathfield-holder");
  $(existingEquation).attr('data-equation-latex', value);
  // Trigger parent save
}
```

#### Issue 3: Character Limit Exceeded
**Symptoms**: User can type beyond limit in RTE

**Handling**:
```javascript
.on("input", function() {
  let text = $origin.parents(".shortLongAnsComponent")
                    .find("iframe").contents().find("body").text();
  if (text.length > 5000) {
    text = text.substring(0, 5000);
    editor.value(text);
  }
});
```

#### Issue 4: Custom Keyboard Not Showing
**Symptoms**: Keyboard option disabled or language not found

**Causes**:
- User subject language not set
- Language not in customKeyboardLanguageData
- isLangKeyboardEnable = false

**Handling**:
```javascript
let SelectLang = con.customKeyboardLanguageData.filter(
  item => item.subject === con.userSubjectLang.trim()
);
if (SelectLang.length == 0) {
  scope.fieldData.settings.userSubjectLang = '';
  scope.fieldData.settings.isCustomKeyboardEnable = false;
}
```

#### Issue 5: SCORM State Not Saving
**Symptoms**: Learner responses lost on page refresh

**Causes**:
- `apiHandle` not defined (not in SCORM environment)
- JSON stringify error
- LMS connection issue

**Handling**:
```javascript
if (typeof apiHandle !== "undefined") {
  try {
    stateMainatainShortAndLongActiviy(event);
  } catch (e) {
    console.error("SCORM save failed:", e);
  }
}
```

### 9.2 Validation Errors

**Input Validation**:
- No validation on content type (free text)
- Character limits enforced at input level
- HTML sanitization for RTE to prevent XSS

**Error Messages**:
- No explicit error messages shown
- Invalid states indicated by disabled buttons
- Console warnings for developer debugging

---

## 10. Technical Specifications

### 10.1 Dependencies

**External Libraries**:

| Library | Version | Purpose |
|---------|---------|---------|
| AngularJS | ~1.x | Editor mode framework |
| jQuery | 1.9.1+ | DOM manipulation, preview mode |
| Jodit Editor | 3.x+ | Advanced RTE functionality |
| MathLive | Latest | Math equation rendering |
| Bootstrap | 3.x | UI components (settings panel) |

**Custom Libraries**:
- Cazary: Lightweight iframe-based RTE (embedded in preview1.js)

### 10.2 Browser Compatibility

**Supported Browsers**:
- Chrome 80+ ✅
- Firefox 75+ ✅
- Safari 13+ ✅
- Edge 80+ ✅
- IE 11 ⚠️ (Limited, Cazary only)

**Known Issues**:
- IE 11: Jodit not fully supported
- Safari: Math keyboard positioning issues
- Mobile browsers: Virtual keyboard interference

### 10.3 API Reference

#### Scope Variables (Editor Mode)

```javascript
scope.fieldData = {
  questiontext: String,      // Question prompt
  question: String,          // Primary label text
  secondaryQuestion: String, // Secondary label text
  answerText: String,        // User's answer
  settings: {
    activeAns: String,           // 'shortAns'|'longAns'|'RTE'
    keyboardType: String,        // 'BASIC'|'JODIT'
    shortAnsCharLimit: Number,
    longAnsCharLimit: Number,
    isCustomKeyboardEnable: Boolean,
    // ... (see Configuration Settings)
  }
}
```

#### Key Functions (Editor Mode)

```javascript
scope.getStringifiedPreText()
  // Returns: Base64 encoded answer text
  // Used for: Data persistence

scope.bindStringifiedPreText(value)
  // Params: value (String) - RTE HTML content
  // Used for: Encoding and storing RTE content

scope.openCustomKeyboard(event)
  // Params: event (Object) - Click event
  // Used for: Toggle custom keyboard visibility

scope.keyboardKeyPressEvent(event)
  // Params: event (Object) - Click event on keyboard key
  // Used for: Insert special character at cursor

scope.shoertlongSetting(event)
  // Params: event (Object) - Click event
  // Used for: Show settings panel
```

#### Key Functions (Preview Mode)

```javascript
insertValueShortLongAns(event)
  // Params: event (Object) - Input event
  // Returns: void
  // Used for: Handle input changes, update state

submitAnswerRTE(event)
  // Params: event (Object) - Click event
  // Returns: void
  // Used for: Handle submission

stateMainatainShortAndLongActiviy(event)
  // Params: event (Object) - Input/submit event
  // Returns: void
  // Used for: Save SCORM state

recursiveParseJson(str)
  // Params: str (String) - Potentially JSON string
  // Returns: Object or String
  // Used for: Parse nested JSON-encoded strings

sanitizeHtmlForJodit(htmlString)
  // Params: htmlString (String) - HTML content
  // Returns: String (Sanitized HTML)
  // Used for: Clean RTE content for XML compatibility
```

### 10.4 Events

**Editor Mode Events**:
- `input`: Triggered on content change
- `click`: Settings panel activation
- `change`: Answer type or keyboard type change
- `beforePasteInsert`: Jodit paste sanitization

**Preview Mode Events**:
- `input`: Answer field input
- `click`: Submit/reset button, keyboard keys
- `keyup`: Character counting
- `paste`: Character counting
- `blur`: SCORM state save (RTE)

### 10.5 CSS Classes

**Component Classes**:

| Class | Purpose |
|-------|---------|
| `.shortLongAnsComponent` | Main container |
| `.questionText` | Question prompt field |
| `.shortAnsText` | Short answer input |
| `.longAnsText` | Long answer textarea |
| `.ansRTE` | Basic RTE textarea |
| `.ansJODIT` | Jodit RTE textarea |
| `.SLA-submit` | Submit button container |
| `.SLA-custKeybCont` | Custom keyboard container |
| `.attempted-question` | Form with input |
| `.submitted` | Form after submission |
| `.disabled` | Disabled state |

**Label Classes**:
| Class | Purpose |
|-------|---------|
| `.labelTypeQuestion` | Label container |
| `.questionNoText` | Primary label (blue bg) |
| `.questionNoSecondaryText` | Secondary label (white bg + border) |

---

## 11. Known Issues

### 11.1 High Priority

#### 1. Character Limit Enforcement in RTE
**Issue**: Users can exceed 5000 character limit if pasting large content
**Impact**: Medium
**Workaround**: Trim on input event, but formatting may be lost
**Recommendation**: Implement pre-paste validation

#### 2. Math Field State Loss
**Issue**: Math equations occasionally lose LaTeX data on rapid editing
**Impact**: Medium
**Workaround**: Debounce input events
**Recommendation**: Add explicit save triggers

#### 3. Multiple RTE Instances Conflict
**Issue**: When multiple RTEs on same page, keyboard inputs may target wrong editor
**Impact**: High (for multi-question activities)
**Current Fix**: `SLA_RTE_orderNo` tracking, but not foolproof
**Recommendation**: Implement proper editor instance isolation

### 11.2 Medium Priority

#### 4. Custom Keyboard Z-Index Issues
**Issue**: Keyboard may appear behind other elements in complex layouts
**Impact**: Low
**Workaround**: Manual CSS adjustment
**Recommendation**: Use CSS `isolation` or higher z-index

#### 5. Jodit Fullscreen Mode in Preview
**Issue**: Fullscreen mode doesn't work properly in iframe preview
**Impact**: Medium
**Current Fix**: PostMessage to parent window
**Recommendation**: Better iframe height management

#### 6. Base64 Encoding Performance
**Issue**: Large RTE content (near 5000 chars) causes encoding delay
**Impact**: Low
**Workaround**: None needed for typical use
**Recommendation**: Use async encoding or web workers

### 11.3 Low Priority

#### 7. IE 11 Compatibility
**Issue**: Jodit not supported, falls back to Basic RTE
**Impact**: Low (IE 11 usage declining)
**Recommendation**: Document limitation, no fix needed

#### 8. Mobile Keyboard Interference
**Issue**: Native mobile keyboard conflicts with custom keyboard
**Impact**: Medium (mobile users)
**Recommendation**: Detect mobile, hide custom keyboard option

#### 9. Settings Panel Width
**Issue**: Long language names may overflow in settings panel
**Impact**: Low
**Workaround**: Truncate with ellipsis
**Recommendation**: Responsive settings panel design

---

## 12. Recommendations

### 12.1 Immediate Improvements

#### 1. Refactor to Component-Based Architecture
**Current State**: Mix of AngularJS directives and jQuery code
**Recommendation**: Migrate to modern framework (React, Vue, or Angular 2+)
**Benefits**:
- Better state management
- Easier testing
- Improved maintainability
- Reduced file size

#### 2. Separate Editor and Preview Code
**Current State**: 2163-line directive, 2499-line preview script
**Recommendation**: Split into modular files:
```
scripts/
  ├── editor/
  │   ├── shortLongAns-editor.js
  │   ├── rte-jodit.js
  │   ├── rte-cazary.js
  │   └── custom-keyboard.js
  ├── preview/
  │   ├── shortLongAns-preview.js
  │   ├── state-manager.js
  │   └── validation.js
  └── shared/
      ├── utils.js
      └── constants.js
```

#### 3. Implement Unit Tests
**Current State**: No test coverage
**Recommendation**: Add test suite:
- Jest for JavaScript unit tests
- Cypress for E2E tests
- Test critical functions (encoding, SCORM save, validation)

#### 4. Add Error Boundary and Logging
**Current State**: Silent failures, console.log only
**Recommendation**:
- Implement structured error handling
- Add user-facing error messages
- Integrate with logging service (Sentry, LogRocket)

### 12.2 Feature Enhancements

#### 5. Auto-Save Draft Responses
**Recommendation**: Save learner input every 30 seconds
**Implementation**: Use debounced auto-save to SCORM or localStorage

#### 6. Word Count in Addition to Character Count
**Recommendation**: Display both word and character count
**Benefit**: Better for essay-type questions

#### 7. Spell Check Integration
**Recommendation**: Add spell check option for RTE
**Note**: Jodit has spellcheck button, but needs server-side integration

#### 8. Accessibility Improvements
**Current State**: Basic keyboard navigation
**Recommendations**:
- Add ARIA labels to all interactive elements
- Improve screen reader announcements
- Ensure keyboard-only navigation works
- Add focus indicators

#### 9. Template/Snippet Support
**Recommendation**: Allow teachers to define answer templates
**Use Case**: Structured responses (e.g., "Claim: ___, Evidence: ___")

#### 10. AI-Assisted Features
**Recommendation**: Integrate optional AI features:
- Grammar checking
- Suggested prompts
- Auto-complete for common phrases

### 12.3 Performance Optimizations

#### 11. Lazy Load Editors
**Current State**: All editors initialized on page load
**Recommendation**: Load Jodit/Cazary only when needed
**Benefit**: Faster initial page load

#### 12. Debounce Input Events
**Current State**: Input event fires on every keystroke
**Recommendation**: Debounce at 300ms for SCORM save
**Benefit**: Reduced API calls, better performance

#### 13. Optimize Base64 Encoding
**Current State**: Synchronous encoding blocks UI
**Recommendation**: Use Web Worker for encoding large content
**Benefit**: Smooth UI, no freezing

### 12.4 Code Quality

#### 14. Remove Commented Code
**Observation**: Significant amount of commented-out code
**Recommendation**: Clean up or move to version control history

#### 15. Consistent Naming Conventions
**Observation**: Mix of camelCase, snake_case, kebab-case
**Recommendation**: Standardize to camelCase for JS, kebab-case for CSS

#### 16. Type Safety
**Recommendation**: Migrate to TypeScript
**Benefits**:
- Type checking at compile time
- Better IDE support
- Self-documenting code

#### 17. Documentation
**Current State**: Minimal inline comments
**Recommendation**:
- Add JSDoc comments to all functions
- Document expected data structures
- Create developer guide

### 12.5 Security Enhancements

#### 18. XSS Prevention
**Current State**: Basic HTML sanitization
**Recommendation**: Use DOMPurify library for robust XSS prevention

#### 19. Content Security Policy
**Recommendation**: Implement strict CSP headers
**Benefit**: Prevent injection attacks

#### 20. Input Validation
**Recommendation**: Add server-side validation for SCORM data
**Benefit**: Prevent malicious data injection

---

## 13. Architectural Diagram

### 13.1 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          KITABOO Platform                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     Main Controller (AngularJS)                 │ │
│  │  • savedJson (master state)                                     │ │
│  │  • currSettings (active component config)                       │ │
│  │  • customKeyboardLanguageData                                   │ │
│  └──────────────────┬──────────────────────────────────────────────┘ │
│                     │                                                 │
│  ┌──────────────────▼──────────────────────────────────────────────┐ │
│  │           shortLongAns Component Instance                       │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  HTML Template (shortLongAns.html)                         │ │ │
│  │  │  • Answer type: Short / Long / RTE                         │ │ │
│  │  │  • Question field (contenteditable)                        │ │ │
│  │  │  • Answer field (varies by type)                           │ │ │
│  │  │  • Custom keyboard (optional)                              │ │ │
│  │  │  • Submit/Reset buttons                                    │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Directive (shortlongans-template)                         │ │ │
│  │  │  • Link function: Initialize editors                       │ │ │
│  │  │  • Scope: fieldData, settings                              │ │ │
│  │  │  • Event handlers: input, click, keyboard                  │ │ │
│  │  └────────┬───────────────────────────────┬───────────────────┘ │ │
│  │           │                               │                      │ │
│  │  ┌────────▼────────┐          ┌──────────▼─────────┐            │ │
│  │  │   Jodit Editor  │    OR    │   Cazary Editor    │            │ │
│  │  │  (Advanced RTE) │          │    (Basic RTE)     │            │ │
│  │  │  • 40+ toolbar  │          │  • Minimal toolbar │            │ │
│  │  │    buttons      │          │  • iframe-based    │            │ │
│  │  │  • Math support │          │  • Math support    │            │ │
│  │  └─────────────────┘          └────────────────────┘            │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  MathLive Integration                                      │ │ │
│  │  │  • math-field web component                                │ │ │
│  │  │  • Virtual keyboard                                        │ │ │
│  │  │  • LaTeX rendering                                         │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │           Settings Panel (shortLongAns-settings-pannel.html)   │ │
│  │  • Answer Type selection                                       │ │
│  │  • Keyboard Type selection                                     │ │
│  │  • Character limits                                            │ │
│  │  • Custom keyboard enable                                      │ │
│  │  • Style settings                                              │ │
│  │  • Accessibility (Alt text)                                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │           Preview/Reader Mode (shortLongAns-preview1.js)       │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │  Initialization                                           │  │ │
│  │  │  1. Parse data-pretext (Base64 decode)                   │  │ │
│  │  │  2. Initialize appropriate editor                         │  │ │
│  │  │  3. Restore SCORM data (if exists)                        │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │  Interaction Handlers                                     │  │ │
│  │  │  • Input validation                                       │  │ │
│  │  │  • Character counting                                     │  │ │
│  │  │  • Submit/Reset logic                                     │  │ │
│  │  │  • State tracking (latency, attempts)                     │  │ │
│  │  └───────────────┬──────────────────────────────────────────┘  │ │
│  │                  │                                              │ │
│  │  ┌───────────────▼──────────────────────────────────────────┐  │ │
│  │  │  SCORM State Manager (stateMainatainShortAndLongActiviy) │  │ │
│  │  │  • Build scoObj with learner data                        │  │ │
│  │  │  • Serialize to JSON                                     │  │ │
│  │  │  • Call apiHandle.SetValue()                             │  │ │
│  │  └───────────────┬──────────────────────────────────────────┘  │ │
│  └──────────────────┼────────────────────────────────────────────┘ │
│                     │                                               │
│  ┌──────────────────▼──────────────────────────────────────────┐   │
│  │                    SCORM API                                 │   │
│  │  • apiHandle.SetValue("cmi.suspend_data", jsonString)       │   │
│  │  • apiHandle.GetValue("cmi.suspend_data")                   │   │
│  │  • Data persisted to LMS                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

External Dependencies:
┌──────────────┐  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐
│  AngularJS   │  │    jQuery     │  │ Jodit Editor │  │  MathLive   │
│    1.x       │  │   1.9.1+      │  │     3.x      │  │   Latest    │
└──────────────┘  └───────────────┘  └──────────────┘  └─────────────┘
```

### 13.2 Data Flow Diagram (Detailed)

```
AUTHORING FLOW:
┌─────────────┐
│   Author    │
│   Types     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Question/Answer Fields         │
│  (contenteditable divs/         │
│   textarea/RTE)                 │
└──────┬──────────────────────────┘
       │ ng-model binding
       ▼
┌─────────────────────────────────┐
│  Scope fieldData Object         │
│  {                              │
│    questiontext: "...",         │
│    answerText: "...",           │
│    settings: {...}              │
│  }                              │
└──────┬──────────────────────────┘
       │ getStringifiedPreText()
       ▼
┌─────────────────────────────────┐
│  Base64 Encoded String          │
│  (stored in data-pretext attr)  │
└──────┬──────────────────────────┘
       │ on save
       ▼
┌─────────────────────────────────┐
│  savedJson[pageNo][uniqueId]    │
│  (master state in controller)   │
└──────┬──────────────────────────┘
       │ on publish
       ▼
┌─────────────────────────────────┐
│  Package/Server                 │
│  (HTML output with embedded     │
│   data-pretext attributes)      │
└─────────────────────────────────┘

LEARNER FLOW:
┌─────────────┐
│   Learner   │
│  Launches   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Parse data-pretext Attribute   │
│  (Base64 decode)                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Check SCORM for Previous Data  │
│  apiHandle.GetValue(            │
│    "cmi.suspend_data")          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Initialize Editor with Data    │
│  (if exists, else empty)        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Learner Types Answer           │
└──────┬──────────────────────────┘
       │ on input/change
       ▼
┌─────────────────────────────────┐
│  insertValueShortLongAns()      │
│  • Validate input               │
│  • Update character count       │
│  • Enable submit button         │
│  • Set latency time             │
└──────┬──────────────────────────┘
       │ on submit
       ▼
┌─────────────────────────────────┐
│  submitAnswerRTE()              │
│  • Mark as submitted            │
│  • Disable inputs               │
│  • Set read-only mode           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  stateMainatainShortAnd         │
│  LongActiviy()                  │
│  • Build scoObj                 │
│  • Serialize to JSON            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  SCORM API Call                 │
│  apiHandle.SetValue(            │
│    "cmi.suspend_data",          │
│    JSON.stringify(scoObj))      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  LMS                            │
│  (Data persisted)               │
└─────────────────────────────────┘
```

---

## Appendix A: Code Snippets

### A.1 Basic Component Initialization

```html
<!-- HTML Template Usage -->
<div class='component-holder shortLongAnsComponent' 
     data-usersubjectlangformathqa="{{fieldData.settings.usersubjectlangformathqa}}" 
     shortlongans-template 
     answer-type="{{fieldData.settings.activeAns}}" 
     keyboard-type="{{fieldData.settings.keyboardType}}" 
     data-pretext="{{getStringifiedPreText()}}" 
     add-common-hover 
     ng-style="{'background-color': fieldData.settings.outlineBgColor}"
     edittemplate 
     cust-keyb-enabled="{{fieldData.settings.isCustomKeyboardEnable}}">
  
  <form class="outline template-editor">
    <!-- Question field -->
    <div class="questionText math-read-only-field" 
         placeholder="Enter Question" 
         ng-model="fieldData.questiontext" 
         contenteditable="true">
    </div>
    
    <!-- Answer field (varies by type) -->
    <div contenteditable="true" 
         class="shortAnsText characters_count" 
         ng-if="fieldData.settings.activeAns == 'shortAns'">
    </div>
  </form>
</div>
```

### A.2 Jodit Initialization

```javascript
// Initialize Jodit Editor
jEditor = Jodit.make("textarea#jodit-" + pagecount + "-" + uiId, {
  buttons: [
    'bold', 'italic', 'underline', 'strikethrough',
    'eraser', 'ul', 'ol', 'font', 'fontsize', 'paragraph',
    'lineHeight', 'spellcheck', 'indent', 'outdent', 'align', 
    'brush', 'superscript', 'subscript',
    'cut', 'copy', 'paste', 'selectall', 'hr', 'table',
    'link', 'symbols', 'find', 'fullsize', 'preview', 'print', 
    'undo', 'redo'
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showStatusbar: false,
  toolbarAdaptive: false,
  removeButtons: ['file', 'image', 'video'],
  events: {
    "change": function (value) {
      scope.bindStringifiedPreText(value);
    },
    afterInit: function (editorInstance) {
      editorInstance.editor.addEventListener('click', function (e) {
        const a = e.target.closest('a');
        if (a) {
          window.open(a.href, '_blank');
        }
      });
    }
  }
});

// Sanitize paste content
jEditor.events.on('beforePasteInsert', (html) => {
  if (typeof html === 'string') {
    return html.replace(/<br(?!\/)>/gi, '<br />');
  }
  return html;
});
```

### A.3 SCORM State Management

```javascript
function stateMainatainShortAndLongActiviy(event) {
  let scoObj = {};
  let $eventTarget = $(event.target);
  let $container = $eventTarget.closest('.shortLongAnsComponent');
  
  // Build state object
  scoObj = {
    isSubmitEnable: !$form.hasClass("submitted"),
    componentId: $container.closest('.customClass[data-type="shortLongAns"]')
                           .attr('data-saved-index'),
    dirtyBit: "true"
  };
  
  // For Jodit RTE, get editor value
  if ($form.find('textarea.ansJODIT').length > 0) {
    const targetEditorEl = $form.find('textarea.ansJODIT')[0];
    const editor = targetEditorEl.__jodit || $(targetEditorEl).data('editorInstance');
    
    if (editor) {
      const val = editor.value && editor.value.trim();
      if (val && val !== '<p><br></p>') {
        scoObj.inputSeleced = val
          .replace(/<br([^>]*)>/gi, '<br$1 />')
          .replace(/&nbsp;/g, ' ')
          .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;)/g, '&amp;');
      }
    }
  }
  
  // Save to SCORM
  if (typeof apiHandle !== "undefined") {
    apiHandle.SetValue("cmi.suspend_data", JSON.stringify(scoObj));
  }
}
```

---

## Appendix B: Configuration Examples

### B.1 Short Answer Configuration

```json
{
  "identifier": "shortLongAns",
  "questiontext": "What is the capital of France?",
  "answerText": "",
  "settings": {
    "activeAns": "shortAns",
    "shortAnsCharLimit": "50",
    "outline": "outline",
    "isCustomKeyboardEnable": false,
    "isLabelTypeShortLong": true,
    "labelType": "primary",
    "question": "Question 1"
  }
}
```

### B.2 Long Answer with Custom Keyboard

```json
{
  "identifier": "shortLongAns",
  "questiontext": "Décrivez votre journée typique.",
  "answerText": "",
  "settings": {
    "activeAns": "longAns",
    "longAnsCharLimit": "2000",
    "outline": "outlineBg",
    "outlineBgColor": "#EAE2C8",
    "isCustomKeyboardEnable": true,
    "userSubjectLang": "FRA",
    "isLabelTypeShortLong": true,
    "labelType": "secondary",
    "secondaryQuestion": "Part A"
  }
}
```

### B.3 Advanced RTE Configuration

```json
{
  "identifier": "shortLongAns",
  "questiontext": "Write a detailed essay on climate change.",
  "answerText": "",
  "settings": {
    "activeAns": "RTE",
    "keyboardType": "JODIT",
    "longAnsCharLimit": "5000",
    "isSubmitRTEButton": true,
    "outline": "outline",
    "isCustomKeyboardEnable": false,
    "altText": "Essay response field for climate change question"
  }
}
```

---

## Document Information

**Version**: 1.0  
**Last Updated**: February 2026  
**Author**: Technical Documentation Team  
**Component Version**: Compatible with KITABOO Authoring Platform  
**Status**: Active

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Tech Team | Initial comprehensive documentation |


