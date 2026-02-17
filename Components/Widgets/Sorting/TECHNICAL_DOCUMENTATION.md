# Sorting Component - Technical Documentation

## Table of Contents
1. [Component Overview](#component-overview)
2. [Component Types](#component-types)
3. [Architecture](#architecture)
4. [File Structure](#file-structure)
5. [Data Model](#data-model)
6. [Component Lifecycle](#component-lifecycle)
7. [Editor Mode](#editor-mode)
8. [Preview/Reader Mode](#previewreader-mode)
9. [Settings Panel](#settings-panel)
10. [Visual Styles](#visual-styles)
11. [Data Flow Diagram](#data-flow-diagram)
12. [Key Features](#key-features)
13. [User Interactions](#user-interactions)
14. [Evaluation Logic](#evaluation-logic)
15. [Offline/Package Behavior](#offlinepackage-behavior)
16. [Error Handling](#error-handling)
17. [Known Issues](#known-issues)
18. [Recommendations](#recommendations)
19. [API Reference](#api-reference)

---

## Component Overview

The **Sorting Component** is an interactive educational template that enables learners to arrange draggable items (text or images) into their correct sequential order. It's designed for ordering activities, sequencing tasks, and chronological arrangements.

### Purpose
- Assess learner understanding of sequences, procedures, or chronological order
- Provide interactive drag-and-drop learning experiences
- Support both text and image-based content
- Enable immediate feedback with configurable attempts

### Technical Stack
- **Framework**: AngularJS 1.x
- **UI Library**: jQuery, jQuery UI (draggable/droppable)
- **Templating**: Angular directives & ng-model
- **Styling**: Custom CSS with style variants

---

## Component Types

### Type 1: Text-Based Sorting
**Type Name**: `with-Text`
**Behavior**: 
- Displays text statements as sortable items
- Users drag text elements into correct positions
- Text is editable in editor mode
- Maximum 150 characters per drag item
- Supports mathematical equations via equation editor

**Use Cases**:
- Chronological event ordering
- Step-by-step procedure sequences
- Priority/ranking tasks

### Type 2: Image-Based Sorting
**Type Name**: `with-Image`
**Behavior**:
- Displays images as sortable items
- Users drag images into correct drop zones
- Images are uploadable in editor mode
- Requires alt text for accessibility (max 2000 chars)
- Supports standard image formats (JPG, PNG, etc.)

**Use Cases**:
- Visual sequencing (lifecycle stages, processes)
- Picture-based chronological ordering
- Diagram arrangement tasks

### Hybrid Capability
Both text and image types can be mixed within the same component by switching the drag item type for each sentence/row independently.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   KITABOO Authoring Platform                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Angular Application                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Main Controller (ngcontroller.js)              │ │
│  │    - Component lifecycle management                    │ │
│  │    - Settings panel coordination                       │ │
│  │    - Undo/Redo stack management                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Sorting Component (sortTemplate)                │
│  ┌──────────────────────┬─────────────────────────────────┐ │
│  │   EDITOR MODE        │   PREVIEW/READER MODE           │ │
│  │  (Authoring)         │   (Learning Experience)         │ │
│  ├──────────────────────┼─────────────────────────────────┤ │
│  │ - sorting.js         │ - sorting-preview1.js           │ │
│  │ - sorting.html       │ - sorting.html (rendered)       │ │
│  │ - sorting-settings   │ - Drag & Drop interactions      │ │
│  │   .html              │ - Evaluation logic              │ │
│  │ - Content editing    │ - Feedback display              │ │
│  │ - Item management    │ - State persistence             │ │
│  └──────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  JSON Data Model (sorting.json default)                │ │
│  │  - Component settings                                  │ │
│  │  - Sentence/Statement data                             │ │
│  │  - Response list (drag items)                          │ │
│  │  - Style configurations                                │ │
│  │  - Metadata & tags                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌────────────┬──────────────┬────────────────────────────┐ │
│  │ CSS Styles │ Style Panel  │ Common Directives          │ │
│  │ - sort-    │ - 3 variants │ - commonbuttons           │ │
│  │   template │ - Full Bleed │ - add-hover               │ │
│  │   .css     │   wrapper    │ - change-fonts            │ │
│  │            │              │ - media-template5         │ │
│  └────────────┴──────────────┴────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
templates/Sorting/
│
├── sorting.html                    # Main template (editor view)
├── sorting-settings.html           # Settings panel UI
├── sort-image.html                 # Image drag item template
│
├── scripts/
│   ├── sorting.js                  # Main directive (editor logic) - 1118 lines
│   └── sorting-preview1.js         # Preview/reader logic - 508 lines
│
├── styles/
│   └── sorting-template.css        # Component styles - 1053 lines
│
├── default/
│   └── sorting.json                # Default configuration
│
└── images/
    └── (style thumbnails)
```

### Key Files Description

#### sorting.html
- **Purpose**: Main HTML template for editor mode
- **Key Elements**:
  - Introduction/header section (toggleable)
  - Instruction section (toggleable)
  - Sentence/statement list (1-5 items)
  - Drag item containers
  - Common buttons directive integration

#### sorting.js
- **Purpose**: AngularJS directive for editor functionality
- **Directive Name**: `sortTemplate`
- **Key Responsibilities**:
  - Sentence management (add/remove)
  - Drag item insertion and configuration
  - Settings synchronization
  - Blank loading and compilation
  - Style application
  - Content validation (character limits)
  - Undo/redo integration

#### sorting-preview1.js
- **Purpose**: Preview and reader mode interactivity
- **Key Responsibilities**:
  - jQuery UI drag/drop initialization
  - Answer validation and evaluation
  - Attempt tracking
  - Button handlers (Submit, Show Me, Try Again, Reset)
  - Visual feedback (correct/incorrect styling)
  - State maintenance

#### sorting-settings.html
- **Purpose**: Right panel settings UI
- **Key Controls**:
  - Number of attempts selector (1-5)
  - Allow activity restart checkbox
  - Show Me button toggle
  - Header/instruction visibility toggles
  - Style panel integration
  - Outline options (No Outline/Outline)
  - Action assets color picker
  - Drag item properties (Text/Image radio)
  - Alt text input for images
  - Meta tags management

---

## Data Model

### Primary Data Structure

```json
{
  "identifier": "Sorting",
  "introductionText": "",
  "instructionText": "",
  "style": {
    "selected_style": "sort-style1"
  },
  "settings": {
    "maxTries": "1",
    "allowRestart": false,
    "showmecheckbox": true,
    "isHeaderVisible": true,
    "isInstructionVisible": true,
    "isText": "with-Text",
    "SortingStatementInfo": [
      {
        "id": "1",
        "statement": "",
        "DragItemText": "",
        "itemInstruction": "Enter Answer",
        "selected": "",
        "responseList": [
          {
            "responseId": "blankArea",
            "isTextorImage": false,
            "choiceList": [
              {
                "choiceInfo": {
                  "choice": {
                    "identifier": "1",
                    "textData": {
                      "type": "Text",
                      "text": ""
                    },
                    "media": {
                      "id": "",
                      "src": "images/image.jpg",
                      "type": "Image",
                      "altText": "",
                      "imageVisible": true,
                      "imageSetting": {
                        "imageUrl": "images/image.jpg",
                        "imageUploadOrReplace": "Upload",
                        "imageName": "Image.jpg",
                        "imageDimension": "",
                        "metaTags": [],
                        "altText": ""
                      }
                    }
                  }
                }
              }
            ],
            "correctChoice": []
          }
        ]
      }
    ],
    "style_tab": [
      {
        "stylefunction": "Applystylesorting",
        "stylesHolder": [
          {
            "name": "sort-style1",
            "bgurl": "images/Style/Sorting/Sorting-Style-thumbnail_3.png",
            "styleactive": true
          },
          {
            "name": "sort-style2",
            "bgurl": "images/Style/Sorting/Sorting-Style-thumbnail_2.png",
            "styleactive": false
          },
          {
            "name": "sort-style3",
            "bgurl": "images/Style/Sorting/Sorting-Style-thumbnail_1.png",
            "styleactive": false
          }
        ],
        "name": "Full Bleed",
        "class": "full-bleed"
      }
    ],
    "outline": "outline",
    "Appearance": "#7eb1eb",
    "outlineBgColor": "#fff",
    "colorvalues": [...],
    "metaTags": ["Drag and drop", "Sorting"]
  },
  "custom": {
    "css": [
      "css/authoring/jquery.mCustomScrollbar.css",
      "css/templates/sorting-template.css"
    ],
    "javascript": [
      "js/jquery-ui.min.js",
      "js/jquery-ui-1.10.3.min.js",
      "js/jquery.ui.touch-punch.js",
      "js/jquery.mCustomScrollbar.js",
      "js/templates/sorting-preview1.js"
    ]
  }
}
```

### Data Model Explanation

#### Top Level
- **identifier**: Component type identifier
- **introductionText**: Header/title text (HTML content)
- **instructionText**: Instructions for learner (HTML content)
- **style**: Visual style configuration

#### Settings Object
- **maxTries**: Number of submission attempts (1-5)
- **allowRestart**: Enable/disable activity restart after completion
- **showmecheckbox**: Toggle Show Me button visibility
- **isHeaderVisible**: Toggle header section
- **isInstructionVisible**: Toggle instruction section
- **isText**: Current drag item type ("with-Text" or "with-Image")

#### SortingStatementInfo Array
Each item represents a sentence/row with drag items:
- **id**: Sequential identifier
- **statement**: HTML content of the sentence (may contain blanks)
- **selected**: Currently selected blank index
- **responseList**: Array of drag items (blanks) for this sentence

#### ResponseList Item
- **responseId**: Identifier ("blankArea")
- **isTextorImage**: Boolean flag for item type
- **choiceList**: Array (typically 1 item) containing choice data
- **correctChoice**: Empty array (not used in current implementation)

#### Choice Data
- **textData**: For text-based items
  - text: Actual text content
- **media**: For image-based items
  - src: Image source URL
  - altText: Accessibility text
  - imageSetting: Upload metadata

---

## Component Lifecycle

### 1. Initialization Phase

```
Component Creation
       │
       ▼
Load default JSON ──► Apply to scope
       │
       ▼
Compile template ──► Angular $compile
       │
       ▼
Execute directive link function
       │
       ▼
Load blanks (loadBlanks) ──► Render drag items
       │
       ▼
Apply styles ──► CSS class application
       │
       ▼
Setup event handlers
       │
       ▼
Initialize resizable handles
       │
       ▼
Component ready
```

### 2. Editing Phase (Editor Mode)

```
User Action
    │
    ├─► Add Sentence ──► Update SortingStatementInfo ──► Re-render
    │
    ├─► Remove Sentence ──► Splice array ──► Re-index ──► Re-render
    │
    ├─► Click Sentence ──► Set active ──► Show settings panel
    │
    ├─► Insert Drag Item ──► Add to responseList ──► Compile HTML ──► Insert
    │
    ├─► Change Text/Image ──► dragradioChange ──► Replace element
    │
    ├─► Edit Content ──► ng-model binding ──► Update JSON
    │
    └─► Change Settings ──► Update currSettings ──► Broadcast events
```

### 3. Preview/Reader Initialization

```
Component Load
       │
       ▼
Execute sorting-preview1.js
       │
       ▼
Style drag items ──► Add classes, set dimensions
       │
       ▼
Clone drag items ──► From sentence to preview area
       │
       ▼
Randomize order ──► Fisher-Yates algorithm
       │
       ▼
Initialize jQuery UI draggable
       │
       ▼
Initialize jQuery UI droppable
       │
       ▼
Attach button handlers
       │
       ▼
Ready for interaction
```

### 4. Learner Interaction Phase

```
User Interaction
    │
    ├─► Drag Item ──► dragstart ──► helper clone ──► drag
    │
    ├─► Drop on Zone ──► validate ──► append clone ──► mark added
    │
    ├─► Click Submit ──► SubmitAnswerSort ──► evaluate ──► feedback
    │
    ├─► Click Show Me ──► showAnswerSort ──► reveal answers
    │
    ├─► Click Try Again ──► tryagainSort ──► reset incorrect ──► re-enable
    │
    └─► Click Reset ──► resetAnswerSort ──► clear all ──► initial state
```

---

## Editor Mode

### Add Sentence Functionality

**Function**: `addSentenceClick(event)`

**Logic**:
1. Check if current count < max (5)
2. Generate new ID (counter++)
3. Push new item to `SortingStatementInfo[]` with default structure
4. Re-initialize dropdown settings
5. Enable save button
6. Return if max reached

**Constraints**:
- Maximum 5 sentences
- "Add Sentence" button disabled at limit

### Remove Sentence Functionality

**Function**: `removeSentenceClick(index)`

**Logic**:
1. Check if count > min (1)
2. Splice item from array at index
3. Re-index remaining items (id = i + 1)
4. Call `loadBlanks()` to re-render
5. Hide related popups
6. Enable save button

**Constraints**:
- Minimum 1 sentence required
- Delete button disabled at minimum

### Insert Drag Item

**Function**: `insertDragItem($event)` (triggered via broadcast)

**Logic**:
1. Identify target sentence (rowNo)
2. Check if blank_count < max_blanks (5)
3. Determine item type (isText): "with-Text" or "with-Image"
4. Check for empty slots in responseList (replace vs. push)
5. Create HTML template string with Angular directives
6. Compile template via `$compile(template)(scope)`
7. Insert at cursor via `pasteHtmlAtCaret()`
8. Apply resizable handles
9. Focus new item
10. Push to undo stack

**Text Drag Item Template**:
```html
<div class="js-form-row sort-with-Text sort-row" 
     contenteditable=false 
     ng-click="blankClick($event)" 
     ng-cancel-drag="ng-cancel-drag">
  <div class="form-control-wrap drag sort-with-row" data-count="row{blankNo}">
    <div data-id="DI_{rowNo}_{blankNo}" class="preview-drop">
      <div contenteditable=true 
           uuid="{uuid}" 
           autocomplete=off 
           type="text" 
           data-id="DI_{rowNo}_{blankNo}" 
           class="inputbox-selected js-input sort-text-selected sort-in" 
           ng-model="fieldData.settings.SortingStatementInfo[{rowNo}].responseList[{blankNo-1}].choiceList[0].choiceInfo.choice.textData.text" 
           data-correct-answer="{{...}}">
      </div>
    </div>
  </div>
</div>
```

**Image Drag Item Template**:
Similar structure but:
- `contenteditable=false`
- Uses `data-media-template5` directive
- Binds to `.choice.media` instead of `.textData.text`

### Load Blanks

**Function**: `loadBlanks()`

**Purpose**: Re-render all drag items from JSON data

**Logic**:
1. Iterate through each statement in `SortingStatementInfo`
2. Parse statement HTML to find `.js-form-row` elements
3. Extract `data-count` attribute for each blank
4. Determine if Text or Image type
5. Replace existing DOM element with freshly compiled template
6. Preserve width via CSS
7. Apply resizable handles

**When Called**:
- On component initialization
- After sentence removal
- After undo/redo operations

### Settings Synchronization

**Key Events**:

1. **attemptsChange**: Update `maxTries` setting
2. **allowRestartClick**: Toggle restart capability
3. **addshowmeClick**: Toggle Show Me button
4. **onHeaderVisibilityChanged**: Toggle header section
5. **onInstructionVisibilityChanged**: Toggle instruction section
6. **radioButtonClick**: Switch between Text/Image type
7. **Applystyle**: Apply visual style variant

**Broadcast Pattern**:
```javascript
con.$broadcast('eventName', { state: value, ...options });
```

**Listener Pattern**:
```javascript
scope.$on('eventName', function(event, data) {
    scope.handlerFunction(data);
});
```

### Drag Item Type Toggle

**Function**: `dragradioChange(event)`

**Logic**:
1. Identify current row and blank
2. Determine blankPlacmentIndex from `selected` attribute
3. Create appropriate template (Text or Image)
4. Replace existing element with `$compile()`
5. Apply focus and styling
6. Show related settings panel section
7. Update resizable handles

**Side Effects**:
- Changes `isTextorImage` flag in responseList
- Updates DOM element classes
- Triggers settings panel update

---

## Preview/Reader Mode

### Initialization Styling

**File**: sorting-preview1.js (lines 1-22)

**Actions**:
1. Add `.inputbox-selected` class to `.preview-drop`
2. Remove `.draggable-div` initially
3. Set border styles
4. Set width for `.sort-with-row` (150px)
5. Make inputbox-selected readonly
6. Set layout: sorting-questions at 66.67% width
7. Preview-sort as inline-block

### Drag Item Cloning and Randomization

**Logic** (lines 23-35):
1. Find all `.form-control-wrap` within `.sentence-text`
2. Clone their HTML content
3. Append clones to `.preview-sort` area
4. Style cloned items (width: auto, min-width: 106px, float: left)
5. Add `.draggable-div` class to enable dragging

**Randomization** (lines 119-136):
- Uses Fisher-Yates shuffle algorithm
- Removes original order clues
- Ensures fair assessment

```javascript
var divs = $(this).find('.preview-drop');
var i = divs.length;
while (--i) {
  var j = Math.floor(Math.random() * (i + 1));
  var tempi = divs[i];
  var tempj = divs[j];
  divs[i] = tempj;
  divs[j] = tempi;
}
```

### Drag and Drop Implementation

#### Draggable Setup

**jQuery UI Draggable** (lines 155-175):

```javascript
$(".sorting .preview-sort .inputbox-selected .draggable-div").draggable({
  cursor: "move",
  revert: "invalid",
  helper: 'clone',
  appendTo: 'body',
  start: function (event, ui) {
    // Calculate cursor position
    // Set helper width
    // Adjust padding for equations/images
  }
});
```

**Options**:
- `cursor: "move"`: Changes cursor during drag
- `revert: "invalid"`: Snap back if dropped on invalid target
- `helper: 'clone'`: Drag a copy, preserve original
- `appendTo: 'body'`: Append to body to avoid z-index issues

#### Droppable Setup

**jQuery UI Droppable** (lines 177-232):

```javascript
$(".sorting .sort-with-row").droppable({
  accept: ".sorting .draggable-div",
  activeClass: "greedy",
  hoverClass: "ui-state-active",
  drop: function (event, ui) {
    // Validate not already dropped
    // Clone draggable to droppable
    // Mark as dropped and added
    // Disable draggability for used item
    // Adjust dimensions
    // Enable submit if all filled
  }
});
```

**Key Behaviors**:
- Only accepts `.draggable-div` elements
- Adds `.dropped` class to drop zone
- Adds `.added` class to original item
- Sets opacity to 0.5 for used items
- Disables dragging for used items
- Enables Submit button when all zones filled

#### Alternative Click-Based Interaction

**For Touch/Accessibility** (lines 36-72):

1. Click on draggable item → adds `.blankSelected` class
2. Click on drop zone → if item selected, drop it
3. Function `dropTheBlank()` handles the drop logic
4. Mimics drag-and-drop behavior without dragging

---

## Evaluation Logic

### Submit Answer

**Function**: `SubmitAnswerSort(event)` (lines 241-349)

**Algorithm**:

```
1. Get attempt count (default 1)
2. Increment attempts
3. Check if all zones have items (droppedSorting = true)
4. 
5. IF attempts == maxTries OR isCustom:
6.   FOR each drop zone:
7.     Compare correctAnswer (data-id) with currentAnswer (data-id)
8.     IF match:
9.       Add 'sort-correct' class
10.      Set isAllCorrectIncluded = true
11.    ELSE:
12.      Add 'sort-incorrect' class
13.      Set isAllCorrectIncluded = false
14.  
15.  Disable Submit, Try Again buttons
16.  Disable Reset button
17.  
18.  IF has incorrect AND last attempt:
19.    Show "That's incorrect, this was your last attempt."
20.  ELSE IF has incorrect:
21.    Show "Please try again"
22.    Enable Try Again button
23.
24. ELSE (not final attempt):
25.   FOR each drop zone:
26.     IF correct:
27.       Add 'sort-correct' class
28.       Keep in place
29.     ELSE:
30.       Remove from drop zone
31.       Un-mark as dropped
32.       Re-enable draggability
33.       Reset opacity
34.       Show "Please try again"
35.
36. IF all correct:
37.   Mark component as correct-question
38.   Disable all buttons except Submit (mark disabled)
39. ELSE IF not correct AND attempts remaining:
40.   Enable Try Again button
```

**Evaluation Method**:
- **Comparison**: `data-id` attribute matching
  - Drop zone: `data-id="DI_{rowNo}_{blankNo}"`
  - Dragged item: `data-id="DI_{rowNo}_{blankNo}"`
- **Logic**: Exact string match required

**Visual Feedback**:
- Correct: `.sort-correct` class (green styling)
- Incorrect: `.sort-incorrect` class (red styling)

### Show Me

**Function**: `showAnswerSort(event)` (lines 353-397)

**Behavior**:
1. Iterate through all drop zones
2. Compare correct vs. current answer
3. If correct: Show as is, add `.sort-correct`
4. If incorrect: Hide dragged item, show original (correct) item
5. Disable all buttons (Submit, Reset, Try Again, Show Me)
6. Set opacity 0.5 for preview area items
7. Disable draggability

**Purpose**: 
- Reveal correct answers without evaluation
- Learning aid after attempts exhausted
- Can be disabled via settings

### Try Again

**Function**: `tryagainSort(event)` (lines 400-429)

**Behavior**:
1. Find all drop zones
2. Remove dragged items from zones
3. Remove `.dropped` class from zones
4. Reset draggability for all items
5. Remove `.added` class from items
6. Reset opacity to 1
7. Clear attempt counter
8. Disable Submit, Try Again, Reset initially
9. Wait for user to attempt again

**Use Case**: Allows learner to retry after seeing which answers were incorrect

### Reset

**Function**: `resetAnswerSort(event)` (lines 433-481)

**Behavior**:

**IF Reset clicked during attempts**:
1. Keep correct items in place
2. Remove only incorrect items
3. Re-enable draggability for removed items
4. Reset opacity

**ELSE (full reset)**:
1. Clear all drop zones
2. Reset all items to preview area
3. Re-enable all draggability
4. Reset all states

**Use Case**: 
- Partial reset: Correct items stay, retry incorrect
- Full reset: Start completely over

---

## Settings Panel

### Number of Attempts

**Control**: Dropdown select (1-5 options)

**Implementation**:
- Uses `easyDropDown` jQuery plugin
- Default: 3 attempts
- Broadcasts `attemptsChange` event
- Updates `data-no-of-attempts` attribute on submit button

**Logic**:
```javascript
$('#sort-settings-panel select').easyDropDown({
  wrapperClass: 'selectbox',
  onChange: function() {
    con.$broadcast('attemptsChange', { 
      state: $(this).val(),
      isfromfirsttime: fromfirsttime,
      onchange: true,
      fromundo: window.fromundo
    });
  }
});
```

### Allow Activity Restart

**Control**: Checkbox

**Effect**:
- When enabled: Dropdown remains enabled after selection
- When disabled: Dropdown disabled, maxTries = 1
- When re-enabled: Dropdown re-enabled, maxTries = 3

**Interaction**:
```javascript
scope.allowActivityRestart = function(state, firsttime) {
  $('#sort-settings-panel select').easyDropDown(state ? 'enable' : 'disable');
  if (state == false) {
    $('#sort-settings-panel select').easyDropDown('select', 0);
    con.currSettings.maxTries = 1;
  } else {
    $('#sort-settings-panel select').easyDropDown('select', 2);
    con.currSettings.maxTries = 3;
  }
};
```

### Add Show Me

**Control**: Checkbox

**Effect**: Toggles visibility of "Show Me" button in preview/reader mode

### Add Header / Add Instruction Text

**Controls**: Checkboxes

**Effect**: 
- Dynamically show/hide header and instruction sections
- Uses `ng-class` with `displayBlock`/`displayNone`
- Content remains in JSON even when hidden

### Drag Item Settings Panel

**Triggered by**: Clicking on a drag item (blank) in editor

**Displays**:
1. **Properties of Blank N** heading
2. **Text/Image radio buttons**
   - Text: Shows textarea for text input (max 150 chars)
   - Image: Shows upload box and alt text textarea (max 2000 chars)
3. **Delete button** (icon-Delete)
4. **Character limit indicators**

**Character Limit Enforcement**:

```javascript
scope.pasteprevent = function(e) {          
  setTimeout(function() {
    if (e.which != 8 && $(e.target).context.innerText.length >= 150) {         
      $(e.target).context.innerText = $(e.target).context.innerText.slice(0, 150);        
      e.preventDefault();
    }
  }, 100);            
}
```

### Outline Options

**Controls**: Radio buttons

**Options**:
1. **No Outline** (`outline`): Default, no border styling
2. **Outline** (`outlineBg`): Adds border with color from Appearance setting

**Effect on Padding**:
- Outline mode adds padding: `0px 10px`
- Affects introduction, instruction, and body areas

### Action Assets Color Picker

**Purpose**: Customize color of interactive elements

**Elements Affected**:
- Submit, Show Me, Try Again, Reset buttons (when outline mode)
- Common buttons styling

**Implementation**:
- Custom color picker directive (`settingcolorpicker`)
- Input field for hex code
- Visual color swatch button
- Updates `currSettings.Appearance`

### Style Variants

**Control**: Style panel with thumbnails

**Function**: `Applystylesorting(event, styleOption, styleType, index, parentIndex)`

**Variants**:
1. **sort-style1**: Default style
2. **sort-style2**: Has special intro holder styling (`.for-sort-intro`)
3. **sort-style3**: Alternative visual variant

**Logic**:
```javascript
window.Applystylesorting = function(event, styleOption, styleType, index, parentIndex) {
  $('.active-style').removeClass('active-style');
  var templateScope = $('#target').parents('.sd-item').eq(0).find('[sort-template]').scope();
  
  // Apply Full Bleed class if applicable
  if (templateScope.fieldData.settings.style_tab[parentIndex].name == 'Full Bleed') {
    $('#target').parents('.sd-item').eq(0).addClass(templateScope.fieldData.settings.style_tab[parentIndex].class);
  }
  
  // Remove old style class
  var tempclass = templateScope.fieldData.style.selected_style;
  $(currentElement).children(".component-holder").removeClass(tempclass);
  
  // Add new style class
  var newClass = templateScope.fieldData.settings.style_tab[parentIndex].stylesHolder[index].name;
  $(currentElement).children(".component-holder").addClass(newClass);
  
  // Update JSON
  templateScope.fieldData.style.selected_style = newClass;
  
  // Mark as active
  $(event.currentTarget).addClass('active-style');
};
```

---

## Visual Styles

### Default Styling (sorting-template.css)

**Key Classes**:

- `.sorting`: Root container
- `.sorting-questions`: Left panel (66.67% width)
- `.preview-sort`: Right panel (inline-block, floating items)
- `.inputbox-selected`: Drag item styling
- `.sort-with-row`: Drop zone styling
- `.draggable-div`: Draggable item class
- `.dropped`: Dropped zone class
- `.added`: Used item class

**Drag Item Styles**:
```css
.sorting .inputbox-selected {
  min-width: 95px;
  min-height: 40px;
  border: 0;
  border-bottom: 1px solid #3a3a3a;
  background-color: transparent;
  font-size: 1em !important;
}
```

**Drop Zone Styles**:
```css
.sorting .sort-with-row {
  width: 150px;
}

.sorting .preview-drop {
  border: 1px solid #000000;
  overflow: hidden;
}
```

**Feedback Styles**:
```css
.sorting .sort-correct {
  color: #03bc03; /* Green */
}

.sorting .sort-incorrect {
  color: #F62B2B; /* Red */
}
```

### Resizable Handles

**jQuery UI Resizable**:
```javascript
$('.drag').resizable({
  handles: 'w, e',  // West and East handles
  minWidth: 95
});
```

**Handle Styling**:
```css
.sorting .ui-resizable-handle {
  position: absolute;
  border: 1px solid #8b8b8b;
  background-color: #fff;
  height: 9px;
  width: 9px;
  cursor: e-resize / w-resize;
}
```

### Style Variants

#### sort-style1
- Default clean style
- Standard borders and spacing
- No additional intro styling

#### sort-style2
- Special intro holder
- `.for-sort-intro` class applied to `.sc-intro-holder`
- Additional styling via CSS

#### sort-style3
- Alternative visual layout
- Different thumbnail image

**Full Bleed Wrapper**:
- Class: `.full-bleed`
- Applied to `.sd-item` parent container
- Provides edge-to-edge styling option

---

## Data Flow Diagram

### Overall Data Flow

```
┌───────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                            │
└───────────┬───────────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────┐
    │  EDITOR MODE  │
    └───────┬───────┘
            │
            ├─► Add/Remove Sentence
            │        │
            │        ▼
            │   Update SortingStatementInfo[]
            │        │
            │        ▼
            │   Re-render & Re-index
            │
            ├─► Insert Drag Item
            │        │
            │        ▼
            │   Add to responseList[]
            │        │
            │        ▼
            │   Compile Angular template
            │        │
            │        ▼
            │   Insert into sentence HTML
            │
            ├─► Edit Content
            │        │
            │        ▼
            │   ng-model two-way binding
            │        │
            │        ▼
            │   Update JSON in real-time
            │
            └─► Change Settings
                     │
                     ▼
                Broadcast event
                     │
                     ▼
                Update currSettings
                     │
                     ▼
                Apply to component
                     │
                     ▼
            ┌────────────────┐
            │  SAVE TO JSON  │
            └────────┬───────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │  JSON Data (savedJson structure)   │
    └────────────┬───────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   PACKAGE/EXPORT/PUBLISH   │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   READER/PREVIEW MODE      │
    └────────────┬───────────────┘
                 │
                 ├─► Load JSON
                 │        │
                 │        ▼
                 │   Parse SortingStatementInfo
                 │        │
                 │        ▼
                 │   Render sentences with blanks
                 │        │
                 │        ▼
                 │   Clone drag items to preview area
                 │        │
                 │        ▼
                 │   Randomize order (Fisher-Yates)
                 │        │
                 │        ▼
                 │   Initialize jQuery UI drag/drop
                 │
                 ├─► User Interaction
                 │        │
                 │        ├─► Drag & Drop
                 │        │        │
                 │        │        ▼
                 │        │   Update DOM state
                 │        │        │
                 │        │        ▼
                 │        │   Enable/disable buttons
                 │        │
                 │        └─► Click Submit
                 │                 │
                 │                 ▼
                 │          Evaluate answers
                 │                 │
                 │                 ├─► Compare data-id attributes
                 │                 │        │
                 │                 │        ▼
                 │                 │   Apply .sort-correct / .sort-incorrect
                 │                 │        │
                 │                 │        ▼
                 │                 │   Display feedback message
                 │                 │        │
                 │                 │        ▼
                 │                 │   Update attempt counter
                 │                 │
                 │                 ├─► IF all correct
                 │                 │        │
                 │                 │        ▼
                 │                 │   Mark correct-question
                 │                 │        │
                 │                 │        ▼
                 │                 │   Disable buttons
                 │                 │
                 │                 └─► IF attempts < max
                 │                          │
                 │                          ▼
                 │                     Enable Try Again
                 │
                 ├─► Show Me
                 │        │
                 │        ▼
                 │   Reveal correct answers
                 │        │
                 │        ▼
                 │   Disable all actions
                 │
                 ├─► Try Again
                 │        │
                 │        ▼
                 │   Reset incorrect items
                 │        │
                 │        ▼
                 │   Re-enable dragging
                 │
                 └─► Reset
                          │
                          ▼
                     Clear all/partial
                          │
                          ▼
                     Return to initial state
```

### State Flow in Preview Mode

```
┌──────────────┐
│  INITIAL     │
│  STATE       │
└──────┬───────┘
       │
       ▼
  All items in
  preview area
       │
       ▼
┌──────────────┐
│  DRAGGING    │ ◄──────────┐
│  STATE       │            │
└──────┬───────┘            │
       │                    │
       ▼                    │
  Drop on zone              │
       │                    │
       ▼                    │
┌──────────────┐            │
│  DROPPED     │            │
│  STATE       │            │
└──────┬───────┘            │
       │                    │
       │ All filled?        │
       ├─ No ───────────────┘
       │
       └─ Yes ──┐
                │
                ▼
         Enable Submit
                │
                ▼
┌────────────────────┐
│  EVALUATING STATE  │
└────────┬───────────┘
         │
         ├─► All Correct ──► COMPLETE STATE (final)
         │
         ├─► Some Incorrect + Attempts Left ──► Try Again
         │                                           │
         │                                           └──► DRAGGING STATE
         │
         └─► Some Incorrect + No Attempts ──► FAILED STATE (final)
```

---

## Key Features

### 1. Dynamic Sentence Management
- Add up to 5 sentences/rows
- Remove sentences (minimum 1)
- Auto-reindexing on removal
- Each sentence independent with own drag items

### 2. Flexible Drag Item Configuration
- Maximum 5 drag items per sentence
- Switch between Text and Image per item
- Text items: 150 character limit
- Image items: 2000 character alt text limit
- Resizable drag zones (min 95px width)

### 3. Randomization
- Fisher-Yates shuffle algorithm
- Ensures different order each time
- Prevents memorization of position

### 4. Multi-Attempt Support
- Configurable 1-5 attempts
- Progressive feedback
- Correct items stay, incorrect reset (partial evaluation)
- Attempt counter display

### 5. Accessibility Features
- Alt text support for images
- Click-based interaction alternative to drag/drop
- Keyboard navigation support (Tab, Enter)
- Screen reader compatible structure

### 6. Visual Customization
- 3 style variants
- Outline options
- Color picker for action assets
- Full Bleed layout option

### 7. Undo/Redo Support
- Integrated with main controller undo stack
- Captures:
  - Previous JSON state
  - Current JSON state
  - Parent UUID
  - Previous HTML
  - Current HTML

### 8. Responsive Layout
- Sentence area: 66.67% width
- Preview area: inline-block
- Flexible drag item widths

### 9. Math Equation Support
- Integrates with equation editor
- Renders via `.auth-equation-holder`
- Adjusts padding for equations

### 10. Validation
- Prevents submission until all zones filled
- Character limits enforced
- Paste prevention at limits
- XSS protection via Angular sanitization

---

## User Interactions

### Editor Mode Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| **Add Sentence** | Click "+ Add Sentence" | New sentence row appears, max 5 |
| **Remove Sentence** | Click delete icon | Sentence removed, min 1 |
| **Click Sentence** | Click sentence text | Opens text editing, shows settings |
| **Click Drag Item** | Click on blank/drag item | Shows drag item settings panel |
| **Insert Drag Item** | Click "Insert Sort Item" in settings | Blank inserted at cursor position |
| **Change Type** | Select Text/Image radio | Drag item type switches, content updated |
| **Edit Text Content** | Type in contenteditable area | Real-time update via ng-model |
| **Upload Image** | Click upload box | Opens file dialog, uploads image |
| **Resize Drop Zone** | Drag resize handles | Width adjusts (min 95px) |
| **Change Style** | Click style thumbnail | Visual style applied |
| **Toggle Outline** | Select outline radio | Border styling applied/removed |
| **Change Color** | Use color picker | Action asset color updates |
| **Toggle Header** | Check/uncheck checkbox | Header section shows/hides |
| **Toggle Instruction** | Check/uncheck checkbox | Instruction section shows/hides |
| **Change Attempts** | Select dropdown option | Max attempts updates |
| **Toggle Restart** | Check/uncheck checkbox | Restart functionality enabled/disabled |
| **Toggle Show Me** | Check/uncheck checkbox | Show Me button visible/hidden |

### Preview/Reader Mode Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| **Drag Item** | Click & drag | Helper clone follows cursor |
| **Drop on Zone** | Release on valid zone | Item cloned to zone, original faded |
| **Drop on Invalid** | Release elsewhere | Item reverts to original position |
| **Click Item (alternate)** | Click draggable | Item highlighted (.blankSelected) |
| **Click Zone (alternate)** | Click drop zone | Selected item drops to zone |
| **Submit Answer** | Click Submit | Evaluation runs, feedback shown |
| **Show Me** | Click Show Me | Correct answers revealed |
| **Try Again** | Click Try Again | Incorrect items reset, correct remain |
| **Reset** | Click Reset | Partial or full reset depending on state |

### Button State Logic

| Button | Initial | During | After Submit (Correct) | After Submit (Incorrect, Attempts Left) | After Submit (No Attempts) | After Show Me |
|--------|---------|--------|------------------------|----------------------------------------|---------------------------|---------------|
| **Submit** | Disabled | Enabled when all filled | Disabled | Hidden | Disabled | Disabled |
| **Show Me** | Enabled | Enabled | Disabled | Enabled | Enabled | Disabled |
| **Try Again** | Disabled | Disabled | Disabled | Enabled | Disabled | Disabled |
| **Reset** | Disabled | Enabled after first drop | Disabled | Disabled | Disabled | Disabled |

---

## Offline/Package Behavior

### Custom Asset Loading

**Defined in**: `sorting.json` → `custom` object

```json
"custom": {
  "css": [
    "css/authoring/jquery.mCustomScrollbar.css",
    "css/templates/sorting-template.css"
  ],
  "javascript": [
    "js/jquery-ui.min.js",
    "js/jquery-ui-1.10.3.min.js",
    "js/jquery.ui.touch-punch.js",
    "js/jquery.mCustomScrollbar.js",
    "js/templates/sorting-preview1.js"
  ]
}
```

### Loading Mechanism

**Main Controller** (assumed in ngcontroller.js):
1. Parses `custom` object from JSON
2. Dynamically loads CSS files via `<link>` injection
3. Dynamically loads JS files via `<script>` injection
4. Waits for load completion before initializing component

### Offline Functionality

**Requirements**:
- All assets (CSS, JS, images) must be bundled in package
- Relative paths maintained in JSON
- No CDN dependencies

**Assets Needed**:
- sorting-template.css
- sorting-preview1.js
- jquery-ui.min.js
- jquery-ui-1.10.3.min.js
- jquery.ui.touch-punch.js (for touch devices)
- jquery.mCustomScrollbar.js
- Style thumbnails (optional, for editor only)

**Image Handling**:
- Image drag items upload to local content folder
- Paths stored as relative URLs
- Alt text embedded in JSON for accessibility
- Images packaged with content

### SCORM/LTI Packaging

**Considerations**:
- Component state can be saved to LMS
- Attempt tracking persists across sessions
- Completion status reportable
- Score calculation: (correct / total) * 100

**State Variables to Track**:
- Current attempt number
- Filled drop zones
- Correct/incorrect status
- Completion flag

---

## Error Handling

### Current Implementation

**Limited Error Handling**:
- No explicit try-catch blocks in main logic
- Relies on Angular's error handling
- Console errors for debugging

### Observed Issues

1. **Missing Element Selectors**:
   - If `#target` not found, operations fail silently
   - Example: `$('#target').parents('[sort-template]')[0]`

2. **Undefined Object Access**:
   - Accessing nested properties without existence checks
   - Example: `scope.fieldData.settings.SortingStatementInfo[rowNo].responseList[i]`

3. **Race Conditions**:
   - `$timeout` used extensively (500ms, 100ms, 10ms)
   - Potential for timing issues if DOM not ready

4. **Index Out of Bounds**:
   - No validation before accessing array indices
   - Could throw errors if indices change unexpectedly

5. **Event Handler Multiple Bindings**:
   - `.off('click').click()` used to prevent duplicates
   - Still potential for memory leaks with repeated init

### Validation Gaps

1. **No JSON Schema Validation**:
   - Malformed JSON can break component
   - Missing required fields not caught

2. **Character Limit Bypass**:
   - Paste events only checked in keyup
   - Direct innerHTML manipulation can exceed limits

3. **Image Upload**:
   - No file size check
   - No format validation
   - No error handling for upload failures

4. **Data-ID Uniqueness**:
   - Pattern: `DI_{rowNo}_{blankNo}`
   - No collision detection if indices reused

---

## Known Issues

### Critical Issues

1. **Undo/Redo Incomplete**
   - **Issue**: Undo stack pushed but redo logic incomplete
   - **Impact**: Cannot redo after undo in all scenarios
   - **Location**: sorting.js, lines 956-970
   - **Workaround**: Avoid relying on redo

2. **Global Variable Pollution**
   - **Issue**: `window.firsttime`, `window.fromfirsttime`, `window.fromundo` used as globals
   - **Impact**: Conflicts possible with other components
   - **Location**: sorting.js, line 138-140
   - **Recommendation**: Move to scope or service

3. **Eval Usage**
   - **Issue**: `eval(function_name)` used for button handlers
   - **Impact**: Security risk, CSP violations possible
   - **Location**: sorting-preview1.js, lines 247, 360, 407, 440
   - **Recommendation**: Use direct function calls or $compile

### Major Issues

4. **jQuery ID Selector Dependency**
   - **Issue**: Heavy reliance on `$('#target')` selector
   - **Impact**: Breaks if ID changes or multiple instances
   - **Location**: Throughout sorting.js
   - **Recommendation**: Use Angular scoping or closest() traversal

5. **Timing Dependencies**
   - **Issue**: Multiple `$timeout` calls with arbitrary delays
   - **Impact**: Unreliable on slow devices, race conditions
   - **Location**: Lines 77-86, 160-173, 313-336, and more
   - **Recommendation**: Use promises or $watch

6. **Drag Item Limit Enforcement Inconsistent**
   - **Issue**: Max 5 blanks check scattered, not centralized
   - **Impact**: Possible to exceed limit in edge cases
   - **Location**: Line 717: `if(blank_count - 1 < max_blanks)`
   - **Recommendation**: Centralize validation function

7. **responseList Empty Object Handling**
   - **Issue**: `$.isEmptyObject()` check doesn't handle all cases
   - **Impact**: Can push empty objects to array
   - **Location**: Lines 723, 821
   - **Recommendation**: Add proper validation

### Minor Issues

8. **Character Limit Enforcement Delay**
   - **Issue**: 100ms timeout in pasteprevent()
   - **Impact**: Brief display of excess characters
   - **Location**: Line 1094-1103
   - **Workaround**: Users may see flicker

9. **Commented Code**
   - **Issue**: Large blocks of commented code
   - **Impact**: Code bloat, confusion
   - **Location**: Throughout (e.g., lines 10-11, 20, 397)
   - **Recommendation**: Remove or document

10. **Incomplete Math Equation Support**
    - **Issue**: Special handling for `.auth-equation-holder` not comprehensive
    - **Impact**: Rendering issues with complex equations
    - **Location**: Lines 104-107, 167-174
    - **Recommendation**: Full equation integration testing

11. **Resizable Handle Conflicts**
    - **Issue**: Resizable handles recreated on every loadBlanks()
    - **Impact**: Potential memory leaks, duplicate handles
    - **Location**: Line 390: `$('.drag').resizable()`
    - **Recommendation**: Destroy before recreating

12. **Fisher-Yates Shuffle Early Return**
    - **Issue**: Returns false instead of continuing if no items
    - **Impact**: Silent failure, no feedback
    - **Location**: Line 128: `if (i == 0) return false;`
    - **Recommendation**: Handle gracefully or log warning

13. **Inline Alert Fade Timing**
    - **Issue**: Hardcoded 1500ms display time
    - **Impact**: Too fast for slow readers
    - **Location**: Lines 147-153
    - **Recommendation**: Make configurable or increase

14. **Drop Zone Width Hardcoded**
    - **Issue**: 150px width not responsive
    - **Impact**: Breaks on small screens
    - **Location**: Line 7: `$('.sorting .sort-with-row').css('width', '150px')`
    - **Recommendation**: Use percentages or viewport units

15. **Accessibility Issues**
    - **Issue**: Missing ARIA labels, roles incomplete
    - **Impact**: Poor screen reader experience
    - **Location**: Throughout templates
    - **Recommendation**: Full WCAG 2.1 AA compliance audit

### Browser-Specific Issues

16. **Mozilla User Select Handling**
    - **Issue**: `-moz-user-select: none` scattered throughout
    - **Impact**: Mozilla-specific, not standard
    - **Location**: Lines 385, 910 in sorting.js
    - **Recommendation**: Use standard `user-select: none`

17. **IE7 Support Code**
    - **Issue**: `ie7.js` still referenced
    - **Impact**: Unnecessary for modern browsers
    - **Location**: General file structure
    - **Recommendation**: Remove IE7 support

---

## Recommendations

### High Priority

1. **Refactor to Service Architecture**
   - Move business logic from directive to Angular service
   - Separate concerns: UI, data, evaluation
   - Enable unit testing

2. **Implement Proper Error Boundaries**
   - Add try-catch blocks in critical sections
   - Validate JSON structure on load
   - Provide user-friendly error messages

3. **Remove Eval() Usage**
   - Replace `eval(function_name)` with direct function references
   - Use Angular's `$compile` or direct event binding

4. **Centralize State Management**
   - Remove global variables
   - Use Angular service or scope for state
   - Implement state machine for preview mode

5. **Fix Timing Dependencies**
   - Replace arbitrary timeouts with event-based logic
   - Use Angular's digest cycle properly
   - Implement proper initialization sequence

### Medium Priority

6. **Improve Accessibility**
   - Add ARIA labels to all interactive elements
   - Ensure keyboard navigation works throughout
   - Test with screen readers
   - Provide focus indicators

7. **Enhance Validation**
   - JSON schema validation on load
   - Input validation before save
   - File size/format checks for images
   - Data-ID uniqueness validation

8. **Optimize Performance**
   - Cache jQuery selectors
   - Minimize DOM manipulations
   - Use event delegation instead of multiple bindings
   - Lazy load preview mode scripts

9. **Responsive Design**
   - Replace fixed widths with flexible units
   - Test on various screen sizes
   - Consider mobile-first approach
   - Touch gesture optimization

10. **Remove Code Bloat**
    - Delete commented code
    - Remove unused variables
    - Clean up console.log statements
    - Modularize large functions

### Low Priority

11. **Enhanced Features**
    - Multi-column sorting layout
    - Scoring options (full/partial credit)
    - Timer functionality
    - Audio feedback option
    - Hints system

12. **Developer Experience**
    - Add JSDoc comments
    - Create unit tests
    - Set up E2E tests
    - Improve code documentation

13. **Localization**
    - Externalize all UI strings
    - Support RTL languages
    - Date/number formatting
    - Multi-language alt text

14. **Analytics**
    - Track time spent
    - Track drag attempts before drop
    - Success rate analytics
    - Common error patterns

---

## API Reference

### Directive: sortTemplate

**Usage**: `<div sort-template></div>`

**Scope Bindings**:
- `fieldData`: Two-way binding to component JSON data

**Key Functions**:

#### addSentenceClick(event)
Adds a new sentence row to the component.

**Parameters**:
- `event`: Click event object

**Returns**: `boolean` (false)

**Constraints**: Maximum 5 sentences

---

#### removeSentenceClick(index)
Removes a sentence row from the component.

**Parameters**:
- `index`: Array index of sentence to remove

**Returns**: `void`

**Constraints**: Minimum 1 sentence

---

#### loadBlanks()
Re-renders all drag items from JSON data.

**Parameters**: None

**Returns**: `void`

**Side Effects**: Replaces DOM elements, applies resizable

---

#### insertDragItem(event)
Inserts a new drag item blank at cursor position.

**Parameters**:
- `event`: Event object (optional)

**Returns**: `boolean` (false)

**Constraints**: Maximum 5 blanks per sentence

---

#### dragradioChange(event)
Toggles drag item type between Text and Image.

**Parameters**:
- `event`: Change event object

**Returns**: `void`

**Side Effects**: Replaces element, updates JSON

---

#### blankClick(event)
Handles click on a drag item, shows settings panel.

**Parameters**:
- `event`: Click event object

**Returns**: `void`

**Side Effects**: Opens settings panel, highlights item

---

#### pasteprevent(event)
Prevents paste that exceeds character limit.

**Parameters**:
- `event`: Paste event object

**Returns**: `boolean` (false)

**Logic**: Enforces 150 character limit

---

#### Applystylesorting(event, styleOption, styleType, index, parentIndex)
Applies a visual style variant to the component.

**Parameters**:
- `event`: Click event object
- `styleOption`: Style option data (unused in current implementation)
- `styleType`: Style type identifier (unused)
- `index`: Index in stylesHolder array
- `parentIndex`: Index in style_tab array

**Returns**: `boolean` (false)

**Side Effects**: Adds/removes CSS classes

---

### Preview Mode Functions (Global)

#### SubmitAnswerSort(event)
Evaluates learner's answer and provides feedback.

**Parameters**:
- `event`: Click event object

**Returns**: `void`

**Logic**: Compares data-id attributes, applies styling, manages attempts

---

#### showAnswerSort(event)
Reveals correct answers without evaluation.

**Parameters**:
- `event`: Click event object

**Returns**: `void`

**Side Effects**: Disables all buttons, shows correct items

---

#### tryagainSort(event)
Resets incorrect items, allows retry.

**Parameters**:
- `event`: Click event object

**Returns**: `void`

**Side Effects**: Removes incorrect items, re-enables dragging

---

#### resetAnswerSort(event)
Resets component to initial state (partial or full).

**Parameters**:
- `event`: Click event object

**Returns**: `void`

**Logic**: If reset during attempts: partial reset. Else: full reset.

---

#### dragAndDropSorting(draggable, droppable1, $form)
Handles drop zone population.

**Parameters**:
- `draggable`: jQuery object of dragged item
- `droppable1`: jQuery object of drop zone
- `$form`: jQuery object of parent form

**Returns**: `void`

**Side Effects**: Clones item to zone, adjusts dimensions, marks as dropped

---

### Event Broadcasts

| Event Name | Data | Purpose |
|------------|------|---------|
| `attemptsChange` | `{ state, isfromfirsttime, onchange, fromundo }` | Update max attempts |
| `allowRestartClick` | `state` | Toggle restart functionality |
| `addshowmeClick` | `state` | Toggle Show Me button |
| `onHeaderVisibilityChanged` | `state` | Toggle header section |
| `onInstructionVisibilityChanged` | `state` | Toggle instruction section |
| `radioButtonClick` | `data` | Change drag item type |
| `Applystyle` | `event, data, styleOption, styleType, index, parentIndex` | Apply style variant |
| `insertDragClick` | None | Insert drag item |
| `correctOptionClick` | `data` | Handle correct option (unused) |
| `summaryAudioClick1` | `data` | Handle summary audio (unused) |
| `maxlimit` | `event, data` | Enforce character limit on keydown |
| `maxlimitpaste` | `event, data` | Enforce character limit on paste |

---

## Appendix: Code Quality Metrics

### Code Complexity
- **sorting.js**: 1118 lines (High complexity)
- **sorting-preview1.js**: 508 lines (Medium complexity)
- **sorting-template.css**: 1053 lines (High specificity)

### Maintainability Index
- **Estimated**: Medium-Low
- **Reasons**: 
  - Deeply nested logic
  - Global variables
  - jQuery/Angular mixing
  - Minimal comments

### Testing Coverage
- **Unit Tests**: None found
- **E2E Tests**: None found
- **Manual Testing**: Required

### Dependencies
- AngularJS 1.x
- jQuery 1.9.1+
- jQuery UI (draggable, droppable, resizable)
- easyDropDown plugin
- Custom directives (add-hover, change-fonts, commonbuttons, etc.)

---

## Conclusion

The Sorting component is a feature-rich interactive template that provides robust drag-and-drop sequencing functionality. While it has extensive capabilities, there are opportunities for improvement in code quality, error handling, accessibility, and maintainability.

### Strengths
✅ Flexible text/image support  
✅ Multi-attempt evaluation  
✅ Visual customization  
✅ Undo/redo integration  
✅ Accessibility alternatives (click-based interaction)  
✅ Randomization for fair assessment  
✅ Offline/package ready  

### Areas for Improvement
⚠️ Code complexity and maintainability  
⚠️ Error handling and validation  
⚠️ Global variable usage  
⚠️ Security (eval usage)  
⚠️ Performance optimizations  
⚠️ Accessibility enhancements  
⚠️ Testing coverage  
⚠️ Documentation  

### Recommended Next Steps
1. Refactor to service-based architecture
2. Implement comprehensive error handling
3. Add unit and E2E tests
4. Conduct accessibility audit
5. Performance profiling and optimization
6. Remove deprecated code and global variables
