# Image Labeling Component - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Types](#component-types)
3. [Architecture Overview](#architecture-overview)
4. [File Structure](#file-structure)
5. [Data Model](#data-model)
6. [Core Features](#core-features)
7. [Mode-Specific Behavior](#mode-specific-behavior)
8. [Data Flow](#data-flow)
9. [Configuration Options](#configuration-options)
10. [Known Issues](#known-issues)
11. [Recommendations](#recommendations)

---

## Overview

The **Image Labeling** component is an interactive educational widget that allows learners to drag and drop labels onto specific areas of an image. It supports both numbered/alphabetic labels and free-text labels, making it ideal for anatomy diagrams, geography maps, equipment identification, and other visual learning activities.

**Primary Purpose**: Enable interactive image annotation and assessment with drag-and-drop functionality.

**Target Use Cases**:
- Anatomy and biology diagrams (labeling body parts)
- Geography maps (labeling countries, cities, landmarks)
- Equipment identification (labeling machine parts)
- Diagram comprehension activities
- Visual assessment and quizzes

---

## Component Types

The Image Labeling component supports **two distinct label types**:

### 1. Number Type (with-Number)
- **Description**: Uses numeric identifiers (1, 2, 3...) or alphabetic identifiers (A, B, C...) as labels
- **Visual**: Circular or square shapes containing numbers/letters
- **Use Case**: When you need sequential or categorical labeling
- **Label Display**: 
  - Label identifier (number/letter) in a shape
  - Associated text displayed below in a separate area
- **Data Model**: `fieldData.settings.isNumber = "with-Number"`

### 2. Text Type (with-Text)
- **Description**: Uses free-text input as labels that can be dragged and dropped
- **Visual**: Rectangular text boxes with editable content
- **Use Case**: When labels need custom descriptive text
- **Label Display**: 
  - Full text visible in draggable box
  - Text box can be resized by authors
- **Data Model**: `fieldData.settings.isNumber = "with-Text"`

---

## Architecture Overview

### Technology Stack
- **Framework**: AngularJS (Angular 1.x)
- **DOM Manipulation**: jQuery
- **Drag & Drop**: jQuery UI (Draggable, Droppable)
- **Styling**: Custom CSS with responsive design
- **State Management**: AngularJS scope and controller-based state

### Component Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    KITABOO Authoring System                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Angular Directive: labellingTemplate           │
│  - Manages component lifecycle                              │
│  - Handles editor interactions                              │
│  - Manages settings panel communication                     │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   HTML Template  │ │  JavaScript      │ │   CSS Styles     │
│   (Structure)    │ │  (Logic)         │ │   (Presentation) │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ - Main template  │ │ - Editor logic   │ │ - Component      │
│ - Settings panel │ │ - Preview logic  │ │   styling        │
│ - Media template │ │ - Interactions   │ │ - Label styles   │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    JSON Data Model                          │
│  - Configuration                                            │
│  - Label information                                        │
│  - Settings                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Core Files

| File | Purpose | Lines | Key Responsibilities |
|------|---------|-------|---------------------|
| `image-labelling-number.html` | Main template | 93 | Component structure, label display, interaction UI |
| `image-labelling-number-setting.html` | Settings panel | 285 | Configuration UI, style options, properties |
| `media-template-labelling.html` | Media container | 48 | Image upload/display, label positioning |
| `image-labelling-number.js` | Editor controller | 2962 | Label creation, positioning, arrow drawing, editor interactions |
| `image-labelling-preview1.js` | Preview/Reader logic | 880 | Drag-drop functionality, answer validation, state management |
| `image-labelling-template.css` | Component styles | 1649 | Layout, label styles, arrow styles, responsive design |
| `image-labelling-number.json` | Default configuration | 145 | Initial state, default settings, schema |

### Directory Structure
```
templates/image-label-number/
├── image-labelling-number.html         # Main template
├── image-labelling-number-setting.html # Settings UI
├── media-template-labelling.html       # Media template
├── temp.html                           # Temporary/test file
├── scripts/
│   ├── image-labelling-number.js       # Editor logic (2962 lines)
│   └── image-labelling-preview1.js     # Preview/reader logic (880 lines)
├── styles/
│   └── image-labelling-template.css    # Component styles (1649 lines)
└── default/
    └── image-labelling-number.json     # Default data model
```

---

## Data Model

### Primary Data Structure

```javascript
{
  "identifier": "Image Labeling",
  "templateName": "Image Labeling",
  "introduction": "",        // Header text
  "instruction": "",         // Instruction text
  "question": "",           // Question text
  "caption": "",            // Image caption
  
  "settings": {
    "outline": "outline",                    // "outline" | "outlineBg"
    "Appearance": "#7eb1eb",                 // Outline color
    "maxTries": "3",                         // 1-5 attempts
    "allowRestart": false,                   // Try again enabled
    "showmecheckbox": true,                  // Show me enabled
    "isHeaderVisible": true,                 // Show header
    "isInstructionVisible": true,            // Show instruction
    "captiondisplay": true,                  // Show caption
    "genericFeedbackCheckbox": false,        // Generic feedback enabled
    "isNumber": "with-Number",               // "with-Number" | "with-Text"
    
    // Media configuration
    "media": {
      "src": "images/image.jpg",            // Image source
      "type": "Image",                       // Media type
      "labelType": "Number",                 // Label type name
      "shape": "circle",                     // "circle" | "square"
      "arrowshape": "arrow",                 // "arrow" | "circleArrow" | "lineArrow"
      "textDiv": "true",                     // Number type (true) or Text type (false)
      "isArrowVisible": true,                // Show arrows
      "Arrow": true,                         // Arrow type active
      "circleArrow": false,                  // Circle arrow type
      "lineArrow": false,                    // Line arrow type
      "width": 120,                          // Label width
      "height": 35,                          // Label height
      "textPreviewHeight": 35,               // Text label height
      "labelColor": "#ffffff",               // Label background color
      "textColor": "#0f0f0f",                // Text color
      "arrowColor": "#0f0f0f",               // Arrow color
      
      // Array of label definitions
      "labelInfo": [
        {
          "identifier": "1",                 // Label ID (number or letter)
          "labelText": "Label text",         // Label content
          "labelLeft": "10%",                // Position from left
          "labelTop": "20%",                 // Position from top
          "width": "120px",                  // Label width
          "height": "35px",                  // Label height
          "singleConnector": true,           // Single arrow
          "doubleConnector": false,          // Double arrows
          "tripleConnector": false,          // Triple arrows
          "box1left": "80px",                // Arrow start point X
          "box1top": "45px",                 // Arrow start point Y
          "box2left": "20px",                // Arrow end point X
          "box2top": "20px",                 // Arrow end point Y
          "box3left": "80px",                // Second arrow point X (if double/triple)
          "box3top": "80px",                 // Second arrow point Y
          "box4left": "80px",                // Third arrow point X (if triple)
          "box4top": "120px",                // Third arrow point Y
          "line1left": "20px",               // Arrow line position X
          "line1top": "20px",                // Arrow line position Y
          "line1width": "60px",              // Arrow line width
          "line1angle": "rotate(0deg)",      // Arrow rotation
          "line2left": "20px",               // Second line (if double/triple)
          "line2top": "40px",
          "line2width": "60px",
          "line2angle": "rotate(-90deg)",
          "line3left": "20px",               // Third line (if triple)
          "line3top": "60px",
          "line3width": "60px",
          "line3angle": "rotate(90deg)"
        }
        // ... additional labels
      ]
    },
    
    // Style configuration
    "style": {
      "selected_style": "Label-style1"      // "Label-style1" | "Label-style3"
    },
    
    // Feedback text
    "generic_correct_ans_default_text": "Congratulations! Your answer is correct",
    "generic_incorrect_ans_default_text": "Oops! You have selected the wrong answer",
    "generic_correct_ans_text": "",         // Custom correct feedback
    "generic_incorrect_ans_text": "",       // Custom incorrect feedback
    
    "metaTag": ["Labeling", "Drag and drop"]
  }
}
```

### Key Data Properties

- **`labelInfo` Array**: Contains all label definitions with positioning and styling information
- **`textDiv` Boolean**: Determines label type (true = Number, false = Text)
- **Shape Options**: Circle or square for number labels
- **Arrow Types**: Arrow, circle arrow, or line arrow
- **Connector Modes**: Single, double, or triple connectors per label

---

## Core Features

### 1. Label Management

#### Adding Labels (Editor Mode)
- Authors click "Add Label" button (max 20 labels)
- System generates unique identifier:
  - **Number type**: Sequential numbers (1, 2, 3...) or letters (A, B, C...)
  - **Text type**: Sequential identifiers with editable text boxes
- Label automatically positioned on image
- Arrow connector dynamically drawn from label to target area

#### Label Positioning
- **Drag and Drop**: Authors can drag labels to any position on the image
- **Percentage-based Coordinates**: Position stored as percentage for responsiveness
- **Collision Detection**: Labels can overlap (no automatic collision prevention)
- **Containment**: Labels constrained within image boundaries

#### Label Properties
- **Shape**: Circle or square (for number type)
- **Size**: Width and height adjustable
- **Colors**: Background, text, and arrow colors customizable
- **Text**: Editable in editor mode, up to 30 characters
- **Arrows**: Show/hide with type selection

### 2. Arrow/Connector System

#### Arrow Types
1. **Arrow**: Standard arrow head (`icon-Line-Circle-right-Arrow-01`)
2. **Circle Arrow**: Circle at end (`icon-Line-Circle-Right-Symbol-01`)
3. **Line Arrow**: Plain line without end decoration (`icon-line-01`)

#### Connector Modes
- **Single Connector**: One arrow from label to one point
- **Double Connector**: Two arrows from label to two points
- **Triple Connector**: Three arrows from label to three points
- **Add/Remove**: Authors can dynamically add/remove connectors

#### Arrow Calculation
```javascript
// Dynamic arrow positioning and rotation
var x1 = box1.offset().left + boxCenterXOffset;
var x2 = box2.offset().left + boxCenterXOffset;
var y1 = box1.offset().top + boxCenterYOffset;
var y2 = box2.offset().top + boxCenterYOffset;

// Calculate hypotenuse (arrow length)
var hypotenuse = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

// Calculate angle (arrow rotation)
var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
```

### 3. Interactive Assessment Features

#### Drag and Drop Interaction (Preview/Reader Mode)
- Labels displayed in a scrollable container below image
- Learners drag labels from container to target areas on image
- Drop zones highlighted on hover (`dragOver` class)
- jQuery UI draggable/droppable implementation

#### Answer Validation
```javascript
// Check if dropped label matches target area
var userAnswer = draggable.attr("data-my-ans");      // e.g., "1"
var correctAnswer = droppable.attr("data-my-ans");   // e.g., "1"

if (userAnswer === correctAnswer) {
  // Correct - apply green styling
  draggable.addClass("labelCorrect");
} else {
  // Incorrect - apply red styling
  draggable.addClass("labelInCorrect");
}
```

#### Attempt Management
- **Configurable Attempts**: 1-5 attempts (default: 3)
- **Attempt Tracking**: `data-attempts` attribute incremented on submit
- **Partial Credit**: Correct labels remain, incorrect removed on try again
- **Final Attempt Behavior**: All labels locked after final attempt

#### Feedback System
- **Generic Feedback**: 
  - Correct: "Congratulations! Your answer is correct"
  - Incorrect: "Please try again" (during attempts)
  - Last Attempt: "Oops! You have selected the wrong answer"
- **Custom Feedback**: Authors can override default messages
- **Visual Feedback**: 
  - Green checkmark for correct
  - Red X for incorrect
  - Feedback popup with icon and message

#### Action Buttons
1. **Submit**: Validates answers, shows feedback
2. **Show Me**: Reveals correct answers (disables further attempts)
3. **Try Again**: Removes incorrect labels, allows retry
4. **Reset**: Returns all labels to original container

### 4. Styling and Appearance

#### Style Variants
- **Label-style1**: Default style with standard spacing
- **Label-style3**: Alternative style with different layout

#### Outline Options
- **No Outline** (`outline`): Component blends with page background
- **Outline** (`outlineBg`): Component has border with custom color
- **Configurable Color**: Border/outline color customizable via color picker

#### Responsive Behavior
- Component detects mobile view and shows warning popup
- Labels scale with image (percentage-based positioning)
- Touch support via `jquery.ui.touch-punch.js`

### 5. Additional Features

#### Header/Instruction Management
- **Introduction**: Optional header text with formatting
- **Instruction**: Optional instruction text
- **Question**: Required question text
- **Caption**: Optional image caption
- **Visibility Toggles**: Show/hide each section independently

#### Math Support
- Math fields marked with `math-read-only-field` class
- Supports equation rendering in labels and text fields

#### Group Activity Support
- Can be embedded in group interactivity templates
- Special handling for group activity context (`isGroupActivity` flag)

---

## Mode-Specific Behavior

### Editor Mode (Authoring)

#### Responsibilities
- Allow authors to add, remove, and position labels
- Configure label properties (shape, color, arrow type)
- Set assessment options (attempts, feedback, buttons)
- Upload and replace images
- Preview label placement

#### Key Interactions
1. **Click Component**: Opens settings panel
2. **Click Add Label**: Creates new label on image
3. **Click Label Number**: Opens label editing panel
4. **Click Label Text Box**: Opens text editing panel
5. **Drag Label**: Repositions label with real-time arrow adjustment
6. **Drag Arrow Points**: Adjusts arrow start/end positions
7. **Click Delete Icon**: Removes label

#### Editor-Specific Features
- **Label Highlighting**: Active label highlighted with blue border
- **Arrow Manipulation**: Drag individual arrow control points
- **Text Editing**: Content editable divs with character limits
- **Settings Panel**: Real-time configuration updates
- **Undo/Redo Support**: Component state tracked for undo operations

### Preview Mode (Author Testing)

#### Responsibilities
- Simulate learner experience for testing
- Allow authors to test drag-drop functionality
- Test answer validation logic
- Test feedback messages

#### Behavior
- Same UI as Reader Mode
- Full interactive functionality
- Reset available for repeated testing
- No score tracking or state persistence

### Reader Mode (Learner Interaction)

#### Responsibilities
- Present assessment to learners
- Track learner responses
- Validate answers and provide feedback
- Manage attempt limits
- Track completion and scoring

#### Key Interactions
1. **Drag Label**: Pick label from container
2. **Drop Label**: Place on target area
3. **Submit**: Validate all placed labels
4. **Try Again**: Remove incorrect, retry
5. **Show Me**: Reveal correct answers
6. **Reset**: Clear all answers (if available)

#### Reader-Specific Features
- **State Persistence**: Progress saved across sessions
- **SCORM Integration**: Tracks completion and score via `apiHandle`
- **Latency Tracking**: Records interaction timestamps
- **Disable on Complete**: Locks component after completion

---

## Data Flow

### Component Initialization Flow

```
1. Angular Bootstrap
   │
   ├─> labellingTemplate directive created
   │
   ├─> Link function executes
   │   ├─> Load JSON data (fieldData)
   │   ├─> Initialize settings from savedJson
   │   └─> Apply default values if missing
   │
   ├─> Render HTML template
   │   ├─> Main component structure
   │   ├─> Image with media-template-labelling
   │   ├─> Label container with ng-repeat
   │   └─> Common buttons
   │
   ├─> Execute $timeout callbacks
   │   ├─> Load color pickers
   │   ├─> Apply shape classes (circle/square)
   │   ├─> Apply arrow type classes
   │   └─> Position labels at saved coordinates
   │
   └─> Attach event handlers
       ├─> Click handlers (labels, settings)
       ├─> Drag handlers (label positioning)
       └─> Settings change handlers
```

### Label Addition Flow (Editor)

```
Author clicks "Add Label"
   │
   ├─> addLabel($event) called
   │
   ├─> Determine label type (textDiv: true/false)
   │
   ├─> Generate identifier
   │   ├─> Number type: Increment counter (1, 2, 3...)
   │   └─> Text type: Generate unique ID
   │
   ├─> Create label object
   │   {
   │     identifier: "1",
   │     labelText: "",
   │     labelLeft: "10%",
   │     labelTop: "20%",
   │     width: "120px",
   │     height: "35px",
   │     singleConnector: true,
   │     box1left: "80px",
   │     box1top: "45px",
   │     ...
   │   }
   │
   ├─> Push to fieldData.settings.media.labelInfo[]
   │
   ├─> Angular re-renders template (ng-repeat)
   │
   ├─> Position label on image
   │   ├─> Calculate default position
   │   └─> Apply CSS transforms
   │
   ├─> Draw arrow connector
   │   ├─> Calculate line length (hypotenuse)
   │   ├─> Calculate rotation angle
   │   └─> Position arrow elements
   │
   ├─> Attach drag handler to label
   │
   ├─> Update JSON in savedJson
   │
   └─> Enable Save button
```

### Drag and Drop Flow (Reader)

```
Learner clicks label in container
   │
   ├─> jQuery UI draggable.start
   │   ├─> Clone helper element
   │   ├─> Set z-index to 10000
   │   └─> Follow cursor
   │
Learner drags over target area
   │
   ├─> jQuery UI droppable.over
   │   └─> Add "dragOver" class (highlight)
   │
Learner releases mouse
   │
   ├─> jQuery UI droppable.drop
   │
   ├─> droppingLabels() function
   │   │
   │   ├─> Verify draggable is from this form
   │   │
   │   ├─> Check if target already has label
   │   │   └─> If occupied, reject drop
   │   │
   │   ├─> Append draggable to droppable
   │   │
   │   ├─> Add classes:
   │   │   ├─> "dropped" to target
   │   │   ├─> "added" to label
   │   │   └─> "ui-state-highlight" to target
   │   │
   │   ├─> Disable label drag (draggable('disable'))
   │   │
   │   ├─> Check if all labels placed
   │   │   └─> If yes, enable Submit button
   │   │
   │   └─> Call state persistence
   │       └─> stateMainatainImageLabel()
   │
   └─> Hide any existing feedback
```

### Answer Submission Flow

```
Learner clicks Submit
   │
   ├─> SubmitAnswerIL(event) called
   │
   ├─> Get attempt count
   │   ├─> Current: data-attempts attribute
   │   └─> Total: data-no-of-attempts attribute
   │
   ├─> Increment attempt counter
   │
   ├─> Check if all labels dropped
   │   └─> If not, show error/do nothing
   │
   ├─> Validate each label
   │   for each labelPreview:
   │     ├─> Get user answer: draggable.data-my-ans
   │     ├─> Get correct answer: droppable.data-my-ans
   │     ├─> Compare values
   │     └─> Apply class:
   │         ├─> "labelCorrect" if match
   │         └─> "labelInCorrect" if mismatch
   │
   ├─> Check if last attempt
   │   │
   │   ├─> IF last attempt:
   │   │   ├─> Lock all labels
   │   │   ├─> Disable Submit/Try Again
   │   │   ├─> Show final feedback
   │   │   └─> Enable Reset (if configured)
   │   │
   │   └─> ELSE (attempts remain):
   │       ├─> Remove incorrect labels
   │       ├─> Return to container
   │       ├─> Keep correct labels locked
   │       ├─> Disable Submit
   │       ├─> Enable Try Again
   │       └─> Show attempt feedback
   │
   ├─> Calculate score
   │   ├─> Correct count / Total count
   │   └─> Update component state classes
   │       ├─> "correct-question" if 100%
   │       └─> "incorrect-question" if < 100%
   │
   ├─> Display feedback popup
   │   ├─> Correct: Green checkmark + message
   │   ├─> Incorrect (mid-attempt): Red X + "Try again"
   │   └─> Incorrect (final): Red X + "Wrong answer"
   │
   └─> Persist state
       └─> stateMainatainImageLabel()
           ├─> Collect state data:
           │   ├─> isSubmitEnable
           │   ├─> isTryAgainEnable
           │   ├─> attemptsDone
           │   ├─> inputSelected[]
           │   ├─> inputCorrect[]
           │   └─> inputIncorrect[]
           │
           └─> Call saveAction() for SCORM
```

### Settings Update Flow

```
Author changes setting in Settings Panel
   │
   ├─> Setting change handler triggered
   │   (e.g., onHeaderVisibilityChanged)
   │
   ├─> Find target component
   │   $('#target').find('[labelling-template]').scope()
   │
   ├─> Update fieldData.settings
   │   fieldData.settings.isHeaderVisible = newValue
   │
   ├─> Update controller's currSettings
   │   con.currSettings.isHeaderVisible = newValue
   │
   ├─> Angular re-renders affected elements
   │   (ng-class, ng-show, ng-if watchers)
   │
   ├─> Update UI state
   │   ├─> Show/hide elements
   │   ├─> Apply/remove CSS classes
   │   └─> Update visual indicators
   │
   ├─> Enable Save button
   │   enableDisableSaveButton(true)
   │
   └─> Trigger undo/redo tracking
       con.headervisible(settingId)
```

---

## Configuration Options

### General Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Show Header | Boolean | true | Display introduction text section |
| Show Instruction | Boolean | true | Display instruction text section |
| Show Caption | Boolean | true | Display image caption |
| Select Type | Enum | "with-Number" | "with-Number" (numbered) or "with-Text" (free text) |

### Assessment Settings

| Setting | Type | Range | Default | Description |
|---------|------|-------|---------|-------------|
| No. of attempts | Number | 1-5 | 3 | Maximum submission attempts |
| Allow activity restart | Boolean | - | false | Enable Try Again button |
| Show Me | Boolean | - | true | Enable Show Answer button |
| Reset | Boolean | - | false | Enable Reset button |

### Style Settings

| Setting | Type | Options | Default | Description |
|---------|------|---------|---------|-------------|
| Styles | Enum | No Outline, Outline | No Outline | Component border style |
| Action Assets | Color | Any hex | #7eb1eb | Border/button color |
| Selected Style | Enum | Label-style1, Label-style3 | Label-style1 | Visual style variant |

### Label Properties (Number Type)

| Setting | Type | Options | Default | Description |
|---------|------|---------|---------|-------------|
| Show Arrow | Boolean | - | true | Display connector arrows |
| Label Arrow Type | Enum | Arrow, Circle, Line | Arrow | Arrow end decoration |
| Label Type | Enum | Numbers, Alphabets | Numbers | Identifier format (1,2,3 or A,B,C) |
| Arrow Color | Color | Any hex | #0f0f0f | Connector line color |
| Shape | Enum | Circle, Square | Circle | Label shape (internal) |

### Label Properties (Text Type)

| Setting | Type | Options | Default | Description |
|---------|------|---------|---------|-------------|
| Show Arrow | Boolean | - | true | Display connector arrows |
| Label Arrow Type | Enum | Arrow, Circle, Line | Arrow | Arrow end decoration |
| Arrow Color | Color | Any hex | #0f0f0f | Connector line color |
| Label Width | Number | 120-304 px | 120 | Text box width |
| Label Height | Number | 35-100 px | 35 | Text box height |

### Feedback Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Generic Feedback | Boolean | false | Enable custom feedback messages |
| Correct Feedback | String | "Congratulations!..." | Message for correct answer |
| Incorrect Feedback | String | "Oops!..." | Message for wrong answer |

### Image Settings

| Setting | Type | Description |
|---------|------|-------------|
| Upload/Replace | Action | Upload new image or replace existing |
| Image Format | Info | JPG, PNG, SVG supported |
| Alt Text | String | Accessibility text for image |
| Caption | String | Visible caption below image |

---

## Known Issues

### Critical Issues

1. **Mobile/Small Screen Compatibility**
   - **Issue**: Component shows warning popup on mobile view: "This template is best suited for screens with bigger sizes (Tablets and above)"
   - **Impact**: Component not fully functional on phones
   - **Root Cause**: Drag-drop interactions difficult on small touch screens
   - **Location**: `image-labelling-preview1.js:41-47`
   - **Current Behavior**: Modal popup shown, but functionality still enabled (confusing UX)

2. **Max Labels Hard-Coded**
   - **Issue**: Maximum 20 labels enforced without clear UI indication
   - **Impact**: Add Label button becomes disabled without explanation
   - **Location**: Counter check in `addLabel()` function
   - **Code**: `ng-class="fieldData.labelInfo.length >=20 ? 'btn-disabled':'"`

3. **Character Limit Handling**
   - **Issue**: Label text limited to 30 characters with inconsistent enforcement
   - **Impact**: Paste operations can bypass limit, then get truncated
   - **Location**: 
     - `image-labelling-number.js:1589-1605`
     - Keydown and paste event handlers
   - **Behavior**: Prevents typing after 30 chars, but paste can exceed then truncates

### Moderate Issues

4. **No Label Collision Detection**
   - **Issue**: Labels can overlap each other and obscure content
   - **Impact**: Difficult to manage dense label layouts
   - **Recommendation**: Add collision warning or auto-adjust positioning

5. **Arrow Positioning Algorithm**
   - **Issue**: Complex arrow calculation logic with magic numbers
   - **Impact**: Difficult to maintain, arrows can clip image boundaries
   - **Location**: Mouse move handlers in `addLabel()` function
   - **Code**: Multiple hardcoded offsets (80px, 120px, 45px, etc.)

6. **State Persistence Complexity**
   - **Issue**: State management split across multiple functions and event handlers
   - **Impact**: Difficult to debug state-related issues
   - **Functions**: `stateMainatainImageLabel()`, `dragAndDropImageLabelling()`, saveAction()
   - **Risk**: State sync issues between UI and saved data

7. **Mixed jQuery and Angular**
   - **Issue**: Extensive use of jQuery DOM manipulation inside Angular directive
   - **Impact**: 
     - Potential memory leaks from unremoved event handlers
     - Digest cycle issues
     - Difficult to migrate to modern frameworks
   - **Examples**: 
     - `$('.label-div').off('click').on('click', ...)`
     - Direct DOM manipulation: `$(element).addClass()`, `$(element).css()`

8. **Undo/Redo Implementation**
   - **Issue**: Incomplete undo/redo support with global flags
   - **Variables**: `window.firsttime`, `window.fromfirsttime`, `window.fromundo`
   - **Impact**: Undo behavior inconsistent for some operations
   - **Risk**: Global state conflicts with multiple components

### Minor Issues

9. **Hardcoded Localization**
   - **Issue**: Some text strings hardcoded, others using localization
   - **Impact**: Incomplete internationalization support
   - **Examples**: 
     - Localized: `window.localeJson.correct`
     - Hardcoded: "Please Note", "Add Label", etc.

10. **Custom Scrollbar Dependency**
    - **Issue**: Component depends on mCustomScrollbar plugin
    - **Impact**: Additional dependency, commented out in many places
    - **Status**: Appears to be deprecated/removed but code remains
    - **Location**: Multiple sections have mCustomScrollbar calls commented out

11. **Commented Code**
    - **Issue**: Large sections of commented code throughout files
    - **Impact**: Clutters codebase, unclear if needed
    - **Examples**: 
       - Scrollbar initialization (lines 1-40 in preview1.js)
       - Settings button handlers (image-labelling-number-setting.html)
       - Alternative positioning logic

12. **Z-Index Management**
    - **Issue**: Complex z-index manipulation for overlapping elements
    - **Impact**: Difficult to predict stacking order
    - **Code**: Manual z-index updates on click/drag operations
    - **Risk**: Elements may appear behind others unexpectedly

### Performance Issues

13. **Inefficient Label Updates**
    - **Issue**: Full label array iterated on every position change
    - **Impact**: Performance degradation with many labels
    - **Location**: Drag stop handlers iterate all labels
    - **Example**: 
    ```javascript
    $form.find('.mainLabelDiv').each(function(i) {
      con.currSettings.media.labelInfo[i].labelLeft = ...
      con.currSettings.media.labelInfo[i].labelTop = ...
    });
    ```

14. **Repeated DOM Queries**
    - **Issue**: Same elements queried multiple times instead of cached
    - **Impact**: Unnecessary DOM traversal
    - **Example**: `$('#target').find('[labelling-template]')` called repeatedly

### Accessibility Issues

15. **Keyboard Navigation**
    - **Issue**: Limited keyboard support for drag-drop
    - **Impact**: Not accessible for keyboard-only users
    - **WCAG Violation**: Fails WCAG 2.1 Level AA (2.1.1 Keyboard)

16. **Screen Reader Support**
    - **Issue**: Drag-drop zones not properly announced
    - **Impact**: Screen reader users cannot complete activity
    - **Missing**: ARIA labels, live regions, drag-drop announcements

17. **Color Contrast**
    - **Issue**: Default colors may not meet WCAG contrast ratios
    - **Impact**: Low vision users may struggle to see labels
    - **Example**: White text on light backgrounds

### Browser Compatibility

18. **jQuery Rotate Plugin**
    - **Issue**: Uses jQuery rotate plugin for arrow rotation
    - **Dependency**: `jQueryRotateCompressed.2.2.js`
    - **Risk**: May not work in all modern browsers
    - **Alternative**: CSS transforms would be more compatible

19. **Firefox-Specific CSS**
    - **Issue**: Mozilla-specific CSS for placeholder handling
    - **Location**: CSS line ~125
    - **Code**: `@-moz-document url-prefix() { ... }`
    - **Risk**: Brittle browser detection

### Security Considerations

20. **XSS Vulnerability**
    - **Issue**: User input directly inserted into DOM
    - **Location**: Label text content, feedback messages
    - **Risk**: Potential XSS if input not sanitized
    - **Angular Protection**: Angular's `ng-model` provides some protection
    - **Recommendation**: Validate/sanitize HTML in parseHtmltoDiv()

---

## Recommendations

### High Priority

#### 1. Modernize Technology Stack
**Current**: AngularJS 1.x + jQuery
**Recommended**: Migrate to modern framework
- **Option A**: Angular (latest) with CDK Drag-Drop
- **Option B**: React with react-dnd library
- **Option C**: Vue 3 with VueDraggable
- **Benefits**:
  - Better performance
  - Modern tooling and development experience
  - Active support and security updates
  - Improved accessibility features
  - Easier testing

**Migration Path**:
1. Create component abstraction layer
2. Refactor into smaller, testable modules
3. Replace jQuery DOM manipulation with framework-specific approaches
4. Implement modern state management (Redux, Vuex, NgRx)
5. Migrate in phases (settings panel → editor → reader)

#### 2. Improve Mobile Responsiveness
**Current**: Warning popup, limited functionality
**Recommended**: Create mobile-optimized experience
- **Approach A**: Click-to-place instead of drag-drop on mobile
  - Tap label to select
  - Tap target area to place
  - Visual indicator for selected label
- **Approach B**: Responsive drag-drop implementation
  - Use touch events instead of mouse events
  - Larger touch targets (min 44x44 CSS pixels)
  - Simplified arrow controls
- **Approach C**: Separate mobile and desktop templates
**Benefits**: Accessible on all devices, better user experience

#### 3. Enhance Accessibility (WCAG 2.1 AA Compliance)
**Current**: Limited accessibility support
**Recommended Actions**:
- **Keyboard Navigation**:
  - Tab to navigate labels
  - Space/Enter to select/place label
  - Arrow keys to adjust position
  - Escape to cancel operation
- **Screen Reader Support**:
  - Add ARIA labels to all interactive elements
  - Implement ARIA live regions for feedback
  - Announce drag-drop state changes
  - Provide text alternatives for visual feedback
- **Visual Accessibility**:
  - Ensure 4.5:1 contrast ratio for text
  - Don't rely solely on color for feedback
  - Add focus indicators (2px outline minimum)
  - Support high contrast mode
- **Testing**: Use NVDA/JAWS and keyboard-only testing

#### 4. Refactor State Management
**Current**: State scattered across multiple locations
**Recommended**: Centralized state management
```javascript
// Proposed state structure
const componentState = {
  // Configuration
  config: {
    type: 'number' | 'text',
    maxAttempts: number,
    showHeader: boolean,
    // ...
  },
  
  // Content
  content: {
    image: { src, alt, caption },
    labels: [
      { id, text, position, arrow, ... }
    ],
    texts: { introduction, instruction, question }
  },
  
  // User interaction
  interaction: {
    attemptCount: number,
    placedLabels: Map<labelId, targetId>,
    correctLabels: Set<labelId>,
    incorrectLabels: Set<labelId>,
    isComplete: boolean
  },
  
  // UI state
  ui: {
    activeLabel: labelId | null,
    selectedTool: 'move' | 'arrow' | 'edit',
    showFeedback: boolean,
    feedbackMessage: string
  }
};

// State mutations through actions
dispatch({ type: 'PLACE_LABEL', labelId, targetId });
dispatch({ type: 'SUBMIT_ANSWERS' });
dispatch({ type: 'RESET_ACTIVITY' });
```

**Benefits**:
- Single source of truth
- Easier to debug
- Predictable updates
- Undo/redo simplified
- Better testing

### Medium Priority

#### 5. Improve Label Management
**Recommendations**:
- **Visual Label Limit Indicator**: Show "Labels: 15/20" counter
- **Label Collision Detection**: 
  - Warn when labels overlap
  - Option to auto-arrange labels
- **Label Groups**: Allow grouping related labels
- **Bulk Operations**: 
  - Select multiple labels
  - Delete multiple labels
  - Move multiple labels
- **Label Library**: Save/reuse common label sets

#### 6. Enhanced Arrow System
**Current**: Complex positioning logic with magic numbers
**Recommended Improvements**:
- **Smart Arrow Routing**: 
  - Auto-avoid overlapping arrows
  - Curved paths for better readability
- **Arrow Styles**: 
  - Dashed, dotted line options
  - Thickness control
  - Glow effect for emphasis
- **Multi-Point Support**: 
  - Bezier curves for complex paths
  - Waypoint system for custom routing
- **Arrow Templates**: Save common arrow configurations

#### 7. Feedback System Enhancements
**Current**: Generic feedback only
**Recommended**: 
- **Individual Label Feedback**: 
  - Feedback per label
  - Hint text per label
- **Partial Credit**: Award points for partially correct answers
- **Feedback Modes**:
  - Immediate: Feedback after each drop
  - Deferred: Feedback only on submit
  - Mixed: Immediate for incorrect, deferred for correct
- **Rich Feedback**: 
  - Images in feedback
  - Audio feedback
  - Video explanations

#### 8. Performance Optimization
**Recommendations**:
- **Virtual Scrolling**: For labels list with many items
- **Memoization**: Cache calculated arrow positions
- **Debouncing**: Debounce position updates during drag
- **Lazy Loading**: Load images on demand
- **Web Workers**: Offload validation logic to worker thread
- **Code Splitting**: Split editor/preview/reader code

### Low Priority

#### 9. Developer Experience
**Improvements**:
- **TypeScript Migration**: Add type safety
- **Unit Tests**: Jest/Vitest for business logic
- **E2E Tests**: Playwright/Cypress for interactions
- **Storybook**: Component documentation and testing
- **ESLint/Prettier**: Code quality tools
- **Documentation**: JSDoc comments throughout

#### 10. Advanced Features
**Future Enhancements**:
- **Auto-Layout Algorithm**: Automatically position labels
- **Image Annotations**: 
  - Highlight regions on image
  - Draw shapes on image
  - Zoom and pan
- **Collaborative Editing**: Multiple authors editing simultaneously
- **Version History**: Track changes over time
- **Templates**: Pre-built label layouts
- **AI Assistance**: 
  - Auto-detect labelable regions
  - Suggest label positions
  - Generate questions from image
- **Import/Export**: 
  - Export to PDF
  - Import from other tools
  - Bulk import labels from CSV

#### 11. Analytics and Insights
**Recommendations**:
- **Learner Analytics**:
  - Time spent per label
  - Most commonly missed labels
  - Heatmap of placement attempts
- **Author Analytics**:
  - Most used label types
  - Common error patterns
  - Component usage statistics
- **A/B Testing**: Test different configurations

#### 12. Integration Improvements
**Enhancements**:
- **LTI 1.3**: Modern LMS integration
- **xAPI/Tin Can**: Advanced learning analytics
- **Content Packages**: 
  - QTI export
  - Common Cartridge support
- **External Assets**: 
  - Link to asset management systems
  - Use external image URLs
  - Integrate with image libraries

---

## Appendix: Code Quality Metrics

### Complexity Analysis

| File | Lines | Functions | Cyclomatic Complexity | Maintainability Index |
|------|-------|-----------|----------------------|---------------------|
| image-labelling-number.js | 2962 | ~45 | High (10-30 per function) | Low (40-60/100) |
| image-labelling-preview1.js | 880 | ~20 | Medium (5-15 per function) | Medium (60-70/100) |
| image-labelling-template.css | 1649 | N/A | N/A | N/A |

### Technical Debt Score

**Overall Technical Debt**: High

**Breakdown**:
- **Architecture**: High debt (mixed concerns, tight coupling)
- **Code Quality**: Medium debt (some duplication, complex functions)
- **Testing**: Very high debt (no tests found)
- **Documentation**: High debt (minimal inline comments)
- **Dependencies**: Medium debt (some outdated libraries)

**Estimated Effort to Address**: 
- **Full modernization**: 3-6 months (2-3 developers)
- **Critical issues only**: 1-2 months (1-2 developers)
- **Accessibility compliance**: 2-4 weeks (1 developer)

---

## Architectural Diagram

### High-Level Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     KITABOO Authoring System                    │
│                    (Main Application Context)                   │
└───────────────────────────┬────────────────────────────────────┘
                            │
     ┌──────────────────────┴─────────────────────┐
     │                                            │
     ▼                                            ▼
┌─────────────────────┐                  ┌──────────────────────┐
│  ngController.js    │                  │  Template Registry   │
│  (Main Controller)  │                  │                      │
├─────────────────────┤                  ├──────────────────────┤
│ - savedJson         │◄─────────────────┤ - imagelabelling     │
│ - currSettings      │                  │ - Template paths     │
│ - currentSettings   │                  │ - Default configs    │
└──────────┬──────────┘                  └───────────────┬──────┘
           │                                             │
           │ Creates & Manages                           │
           ▼                                             │
┌─────────────────────────────────────────────────────┐ │
│      labellingTemplate Angular Directive             │ │
│                                                       │ │
├───────────────────────────────────────────────────────┤ │
│  Scope:                                               │ │
│  - fieldData (component data)                         │ │
│  - settings (configuration)                           │◄┘
│  - Functions:                                         │
│    - addLabel()                                       │
│    - deleteDiv()                                      │
│    - labellingColorpicker()                           │
│    - Applystyle()                                     │
│    - attemptsChange()                                 │
└────────┬─────────────────┬──────────────────┬─────────┘
         │                 │                  │
         │                 │                  │
    ┌────▼──────┐    ┌────▼──────┐     ┌────▼──────────┐
    │  HTML     │    │  Editor   │     │   Preview/    │
    │ Templates │    │  Logic    │     │ Reader Logic  │
    └────┬──────┘    └────┬──────┘     └────┬──────────┘
         │                │                  │
         │                │                  │
┌────────┴────────────────┴──────────────────┴──────────┐
│                                                        │
│              Component DOM Structure                   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  .imageLabelling.component-holder            │    │
│  │  (Main Container)                            │    │
│  ├──────────────────────────────────────────────┤    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Header (Introduction)                 │ │    │
│  │  │  [contenteditable]                    │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Instruction                           │ │    │
│  │  │  [contenteditable]                    │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Question                              │ │    │
│  │  │  [contenteditable]                    │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Image Container                       │ │    │
│  │  │  .image-source                        │ │    │
│  │  ├────────────────────────────────────────┤ │    │
│  │  │  <img> (Primary Image)                │ │    │
│  │  │                                        │ │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  │ │    │
│  │  │  │ .mainLabelDiv│  │ .mainLabelDiv│  │ │    │
│  │  │  │ [draggable]  │  │ [draggable]  │  │ │    │
│  │  │  ├──────────────┤  ├──────────────┤  │ │    │
│  │  │  │ Label/Text   │  │ Label/Text   │  │ │    │
│  │  │  │ [labelPreview]│  │[labelPreview]│  │ │    │
│  │  │  ├──────────────┤  ├──────────────┤  │ │    │
│  │  │  │ Arrow Lines  │  │ Arrow Lines  │  │ │    │
│  │  │  │ .box1, .box2 │  │ .box1, .box2 │  │ │    │
│  │  │  │ .boxline     │  │ .boxline     │  │ │    │
│  │  │  └──────────────┘  └──────────────┘  │ │    │
│  │  │                                        │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Caption [contenteditable]             │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Label Container (Preview/Reader)      │ │    │
│  │  │  .label-Container                     │ │    │
│  │  ├────────────────────────────────────────┤ │    │
│  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │ │    │
│  │  │  │ 1  │ │ 2  │ │ 3  │ │ 4  │ ...     │ │    │
│  │  │  └────┘ └────┘ └────┘ └────┘         │ │    │
│  │  │  [draggable labels]                   │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Action Buttons                        │ │    │
│  │  │  [commonbuttons directive]            │ │    │
│  │  ├────────────────────────────────────────┤ │    │
│  │  │  [Submit] [Try Again] [Show Me] [Reset]│ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────────┐ │    │
│  │  │  Feedback Alert                        │ │    │
│  │  │  .alert.IML-pop-up                    │ │    │
│  │  │  [hidden by default]                  │ │    │
│  │  └────────────────────────────────────────┘ │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    EDITOR MODE                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Author creates content
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Upload Image                                            │
│     ├─> media-template-labelling directive                  │
│     ├─> Store in fieldData.settings.media.src              │
│     └─> Display in .image-source container                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Add Labels (addLabel function)                          │
│     ├─> Generate identifier (number or text)                │
│     ├─> Create label object {identifier, position, ...}     │
│     ├─> Push to fieldData.settings.media.labelInfo[]        │
│     ├─> Angular renders via ng-repeat                       │
│     └─> Attach drag handlers                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Position Labels (drag handlers)                         │
│     ├─> Author drags label on image                         │
│     ├─> Calculate position as percentage                    │
│     ├─> Update labelInfo[i].labelLeft/Top                   │
│     ├─> Recalculate arrow positions                         │
│     └─> Update savedJson                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Configure Settings (settings panel)                     │
│     ├─> Change attempts, feedback, visibility, etc.         │
│     ├─> Update currSettings                                 │
│     ├─> Update fieldData.settings                           │
│     └─> Trigger re-render via Angular watchers              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Save (Save button)                                      │
│     ├─> Serialize fieldData to JSON                         │
│     ├─> Store in savedJson[pageNo][uniqueId]               │
│     └─> Persist to server                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Content published
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  PREVIEW/READER MODE                        │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ Load content
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Initialize (page load)                                  │
│     ├─> Load JSON data                                      │
│     ├─> Render image with target areas (.labelPreview)      │
│     ├─> Render label container with draggable labels        │
│     ├─> Initialize jQuery UI draggable/droppable            │
│     └─> Restore saved state (if resuming)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Learner Interaction (drag-drop)                         │
│     ├─> Learner drags label from container                  │
│     ├─> droppable.drop event fires                          │
│     ├─> droppingLabels() function                           │
│     │   ├─> Append label to target area                     │
│     │   ├─> Add "dropped" class                             │
│     │   ├─> Disable dragging for that label                 │
│     │   └─> Enable Submit if all labels placed              │
│     └─> Call stateMainatainImageLabel() for persistence     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Submit Answer (SubmitAnswerIL)                          │
│     ├─> Increment attempt counter                           │
│     ├─> For each label:                                     │
│     │   ├─> Get user's answer (draggable.data-my-ans)       │
│     │   ├─> Get correct answer (droppable.data-my-ans)      │
│     │   ├─> Compare values                                  │
│     │   └─> Apply .labelCorrect or .labelInCorrect class    │
│     ├─> Calculate score (correct / total)                   │
│     ├─> Display feedback popup                              │
│     ├─> Update button states                                │
│     │   ├─> If last attempt: disable Submit/Try Again       │
│     │   └─> Else: enable Try Again                          │
│     └─> Persist state                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Try Again (tryagainIL)                                  │
│     ├─> Remove incorrect labels (labelInCorrect)            │
│     ├─> Return them to label container                      │
│     ├─> Keep correct labels locked                          │
│     ├─> Re-enable dragging for incorrect labels             │
│     ├─> Disable Submit until labels re-placed               │
│     └─> Persist state                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Show Me (showAnswerIL)                                  │
│     ├─> Place all labels in correct positions               │
│     ├─> Apply .labelCorrect to all                          │
│     ├─> Disable all further interactions                    │
│     ├─> Mark component as complete (no score)               │
│     └─> Persist state                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Reset (resetAnswerIL)                                   │
│     ├─> Remove all labels from target areas                 │
│     ├─> Return all labels to container                      │
│     ├─> Remove all correct/incorrect classes                │
│     ├─> Re-enable dragging                                  │
│     ├─> Reset button states                                 │
│     └─> Persist state                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  7. State Persistence (stateMainatainImageLabel)            │
│     ├─> Collect state data:                                 │
│     │   ├─> isSubmitEnable                                  │
│     │   ├─> isTryAgainEnable                                │
│     │   ├─> attemptsDone                                    │
│     │   ├─> inputSelected[] (placed labels)                 │
│     │   ├─> inputCorrect[] (correct labels)                 │
│     │   └─> inputIncorrect[] (incorrect labels)             │
│     ├─> Create scoObj with all state                        │
│     └─> Call saveAction(event, scoObj)                      │
│         └─> Persist to SCORM/xAPI/backend                   │
└─────────────────────────────────────────────────────────────┘
```

### Settings Panel Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Settings Panel UI                        │
│             (image-labelling-number-setting.html)           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ User changes setting
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Angular Event Handler (ng-change)                          │
│  Examples:                                                  │
│  - onHeaderVisibilityChanged(state)                         │
│  - attemptsChange(state)                                    │
│  - addGenericFeedbackIML(state)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Scope Function in Directive                                │
│  (image-labelling-number.js)                                │
│                                                              │
│  scope.onHeaderVisibilityChanged = function(state) {        │
│    // Find target component                                 │
│    $('#target').find('[labelling-template]')                │
│      .scope().fieldData.settings.isHeaderVisible = state;   │
│                                                              │
│    // Update controller                                     │
│    con.currSettings.isHeaderVisible = state;                │
│                                                              │
│    // Trigger undo tracking                                 │
│    con.headervisible('header-visibility');                  │
│                                                              │
│    // Enable save                                           │
│    enableDisableSaveButton(true);                           │
│  }                                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Angular Digest Cycle                                       │
│  - Watchers detect change                                   │
│  - ng-class/ng-show/ng-if update DOM                        │
│  - Component re-renders affected elements                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Visual Update                                              │
│  - Header shown/hidden                                      │
│  - Settings panel reflects new state                        │
│  - Save button enabled                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Offline/Package Behavior

### Package Structure
When the component is packaged for offline use (e.g., SCORM, EPUB, downloaded content):

1. **Asset Bundling**:
   ```
   package/
   ├── index.html
   ├── templates/image-label-number/
   │   ├── scripts/
   │   │   ├── image-labelling-number.js
   │   │   └── image-labelling-preview1.js
   │   ├── styles/
   │   │   └── image-labelling-template.css
   │   └── (HTML templates inlined)
   ├── images/
   │   ├── uploaded-image-1.jpg
   │   ├── uploaded-image-2.png
   │   └── ...
   ├── js/
   │   ├── angular.min.js
   │   ├── jquery-1.9.1.min.js
   │   ├── jquery-ui.min.js
   │   └── (other dependencies)
   └── data/
       └── content.json (saved component state)
   ```

2. **Resource Loading**:
   - All images converted to relative paths or embedded as base64
   - CSS and JS paths adjusted to relative URLs
   - External dependencies bundled locally

3. **State Persistence**:
   - **SCORM Packages**: Uses SCORM API (`apiHandle`) to save state
   - **Offline Mode**: Uses localStorage or IndexedDB
   - **State Data**:
     ```javascript
     {
       componentId: "image-label-123",
       attemptCount: 2,
       placedLabels: {"1": "target-a", "2": "target-b"},
       correctLabels: ["1"],
       incorrectLabels: ["2"],
       isComplete: false,
       timestamp: "2026-02-16T10:30:00Z"
     }
     ```

4. **Offline Limitations**:
   - Cannot upload new images
   - Settings panel disabled (view-only)
   - No server-side validation
   - Limited analytics tracking

### SCORM Integration
```javascript
// State persistence in SCORM
function saveAction(event, scoObj) {
  if (typeof apiHandle !== "undefined") {
    // SCORM LMS integration
    var jsonData = JSON.stringify(scoObj);
    apiHandle.LMSSetValue("cmi.suspend_data", jsonData);
    apiHandle.LMSCommit("");
  }
}

// State restoration
function restoreState() {
  if (typeof apiHandle !== "undefined") {
    var savedData = apiHandle.LMSGetValue("cmi.suspend_data");
    if (savedData) {
      var scoObj = JSON.parse(savedData);
      // Restore UI state
      restorePlacedLabels(scoObj.inputSelected);
      restoreFeedback(scoObj.feedbackMessage);
      updateButtonStates(scoObj);
    }
  }
}
```

---

## Summary

The **Image Labeling** component is a feature-rich, interactive educational widget with two distinct modes (Number and Text), supporting drag-and-drop label placement, arrow connectors, multiple attempts, and feedback. Built with AngularJS and jQuery, it provides comprehensive authoring tools and learner interactions.

### Strengths
- ✅ Two flexible label types (Number and Text)
- ✅ Rich arrow customization (types, connectors)
- ✅ Comprehensive attempt and feedback management
- ✅ SCORM integration for state persistence
- ✅ Flexible styling options
- ✅ Group activity support

### Weaknesses
- ❌ Limited mobile responsiveness
- ❌ Accessibility issues (keyboard, screen reader)
- ❌ Complex state management
- ❌ High technical debt (AngularJS 1.x, jQuery)
- ❌ Limited testing and documentation
- ❌ Performance concerns with many labels

### Priority Actions
1. **Improve accessibility** (keyboard navigation, ARIA labels)
2. **Enhance mobile experience** (touch-friendly interactions)
3. **Refactor state management** (centralized state)
4. **Modernize technology stack** (consider migration plan)
5. **Add comprehensive testing** (unit, integration, E2E)


