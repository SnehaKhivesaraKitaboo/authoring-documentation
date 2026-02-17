# Match The Pairs (Multiple) - Technical Documentation

## 1. Overview

The **Match The Pairs (Multiple)** component (also known as **MTP Multiple** or **1-to-n MTP**) is an interactive educational assessment tool that allows learners to match elements from Column A with one or multiple corresponding elements in Column B by drawing connection lines.

### Component Identifier
- **Template ID**: `mtp-multiple`
- **Display Name**: Match The Pairs (1-to-n)
- **Icon**: `icon-Match-the-pair_draw-line`

---

## 2. Component Types and Variants

The component supports two primary pairing modes:

### 2.1 Single Choice Mode (1-to-1)
- Each element in Column A can be paired with **exactly one** element in Column B
- Traditional matching pairs behavior
- Configured via `pair1.pairChoice = "single"`

### 2.2 Multiple Choice Mode (1-to-n)
- Each element in Column A can be paired with **multiple elements** (up to 3) in Column B
- Allows more complex assessment scenarios
- Configured via `pair1.pairChoice = "multiple"`
- Maximum of 3 pairs per element in Column A

### 2.3 Content Type Variations

For both Column A and Column B, each pair can contain:
- **Text Content**: Editable rich text with math equation support
- **Image Content**: Uploaded images with configurable display modes
  - Default Image Mode (original aspect ratio, max 80px height, 16:9)
  - Large Image Mode (original aspect ratio, max 300px height, 1:1)
  - Custom Ratio Mode (user-defined width and height)

---

## 3. Architecture Overview

### 3.1 File Structure

```
templates/mtp-multiple/
├── mtp-multiple.html                      # Main template (editor view)
├── mtp-multiple-settings-panel.html       # Settings panel UI
├── media-template2.html                   # Media upload template
├── default/
│   └── mtp-multiple.json                  # Default configuration
├── scripts/
│   ├── mtp-multiple-directive.js          # AngularJS directive (editor)
│   ├── mtp-multiple-preview1.js           # Preview/Reader logic
│   └── mtp-multiple-line-preview1.js      # SVG line drawing logic
└── styles/
    └── mtp-multiple-template.css          # Component styling
```

### 3.2 Technology Stack

- **Framework**: AngularJS 1.x
- **UI Libraries**: 
  - jQuery & jQuery UI (drag/drop, touch support)
  - Bootstrap (layout & components)
- **Graphics**: SVG (for drawing connection lines)
- **Math Rendering**: MathQuill/Temml (equation support)
- **Styling**: CSS3 with BEM-like naming conventions

---

## 4. Data Model

### 4.1 Core Data Structure

```json
{
  "identifier": "mtp-multiple",
  "elementTitle1": "",           // Column A header
  "elementTitle2": "",           // Column B header
  "header": "",                  // Optional component header
  "instruction": "",             // Optional instructions
  "question": "Question 1",      // Primary label text
  "secondaryQuestion": "Part A", // Secondary label text
  "settings": { /* ... */ },
  "listData": [
    {
      "hpvpData": {
        "pairedList": [ /* ... */ ],
        "isSingleSelect": false
      }
    }
  ],
  "currentPairIndex": -1,
  "custom": {
    "css": ["css/templates/mtp-multiple-template.css"],
    "javascript": [
      "js/jquery-ui.min.js",
      "js/jquery-ui-1.10.3.min.js",
      "js/jquery.ui.touch-punch.js",
      "js/templates/mtp-multiple-preview1.js",
      "js/templates/mtp-multiple-line-preview1.js"
    ]
  }
}
```

### 4.2 Pair Data Structure

```json
{
  "pairInfo": {
    "pair1": {
      "pairChoice": "single|multiple",
      "identifier": 1,
      "infoData": {
        "type": "Text",
        "text": ""
      },
      "media": {
        "value": 1,
        "id": 1,
        "src": "images/image.jpg",
        "type": "Image",
        "altText": "",
        "imageVisible": true,
        "imageSetting": {
          "imageUrl": "images/image.jpg",
          "imageUploadOrReplace": "Upload",
          "imageName": "Image.jpg",
          "imageDimension": "",
          "metaTags": []
        }
      },
      "isImageEnable": "pair1_text|pair1_image",
      "pair2IsImageEnable": "pair2_text|pair2_image"
    },
    "pair2": [
      {
        "identifier": 1,
        "subIdentifier": 1,
        "infoData": { /* ... */ },
        "media": { /* ... */ },
        "isImageEnable": "pair2_text|pair2_image"
      }
    ],
    "feedbackinline": ""
  }
}
```

### 4.3 Settings Configuration

```json
{
  "labelType": "primary|secondary",
  "isLabelTypeMTPMultiple": false,
  "maxTries": "3",
  "isReset": "false",
  "isShowme": "true",
  "allowRestart": false,
  "showmecheckbox": false,
  "isHeaderVisible": false,
  "isInstructionVisible": false,
  "templateImage": "icon-Match-the-pair_draw-line",
  "templateName": "MTP Multiple",
  "altText": "",
  "isVerticalMtp": "mtp_vertical",
  "outline": "outline",
  "Appearance": "#7eb1eb",               // Primary color
  "BgAppearance": "rgb(126,177,235,0.3)", // Background highlight
  "outlineBgColor": "1px solid #ccc",
  "feedbackCheckbox": false,              // Individual feedback per pair
  "genericFeedbackCheckbox": false,       // Generic correct/incorrect messages
  "generic_correct_ans_default_text": "Congratulations! Your answer is correct",
  "generic_incorrect_ans_default_text": "Oops! You have selected the wrong answer",
  "generic_correct_ans_text": "",
  "generic_incorrect_ans_text": "",
  "shuftleChoiceCheckbox": true,          // Shuffle Column B elements
  "metaTags": [],
  "pagebgcolor": "#fff",
  "activeStyle": "mtpStyle1|mtpStyle2|mtpStyle3|mtpStyle4",
  "imageConfiguration": {
    "1": {  // Column A image settings
      "imageDisplayMode": "default-img|large-img",
      "imageRatio": "original-ratio|custom-ratio",
      "imageCustomWidth": "",
      "imageCustomHeight": ""
    },
    "2": {  // Column B image settings
      "imageDisplayMode": "default-img|large-img",
      "imageRatio": "original-ratio|custom-ratio",
      "imageCustomWidth": "",
      "imageCustomHeight": ""
    }
  }
}
```

---

## 5. Operational Modes

### 5.1 Editor Mode (Authoring)

**Location**: [mtp-multiple-directive.js](scripts/mtp-multiple-directive.js)

#### Key Features:
1. **Interactive Element Management**
   - Add/remove pair elements (minimum 2, maximum based on total elements ≤ 20)
   - Switch between text and image content types
   - Toggle between single and multiple choice modes
   - Real-time SVG line rendering for visual feedback

2. **Content Editing**
   - Contenteditable divs with AngularJS data binding
   - Math equation support (MathQuill integration)
   - Image upload and dimension configuration
   - Column header customization

3. **Visual Feedback**
   - Active pair highlighting (blue border on selected element)
   - SVG connection lines updating in real-time
   - Dynamic form height calculation based on content

4. **Settings Panel Integration**
   - Right-side panel for configuration
   - Per-pair settings (pair choice, content type)
   - Global settings (styles, feedback, attempts)

#### Critical Functions:

```javascript
// Adding new pairs
$scope.addPairsClick = function(event) {
  // Validates max 20 total elements
  // Adds new pair with default structure
  // Enables save button
}

// Removing pairs
$scope.removePairClick = function(index) {
  // Removes pair at index
  // Re-indexes remaining pairs
  // Updates identifiers
}

// SVG line rendering for editor
$scope.setPairConnectingLines = function() {
  // Calculates SVG path coordinates
  // Renders connection lines between pairs
  // Applies color based on focused state
}

// Dynamic positioning
$scope.displaceFromBottom = function(identifier, isFeedback) {
  // Calculates vertical offset for Column A elements
  // Accounts for multiple pairs per element
}
```

### 5.2 Preview/Reader Mode

**Location**: [mtp-multiple-preview1.js](scripts/mtp-multiple-preview1.js), [mtp-multiple-line-preview1.js](scripts/mtp-multiple-line-preview1.js)

#### Interaction Methods:

**Desktop/Tablet:**
- **Drag & Drop**: Drag dots from Column A to Column B
- **Click-to-Pair**: Click Column A element (highlights), then click Column B element

**Mobile:**
- Touch support via jQuery UI Touch Punch
- Auto-scroll during drag operations

#### User Flow:

```
1. Load Component
   ↓
2. Shuffle Column B elements (if enabled)
   ↓
3. Initialize drag/drop handlers
   ↓
4. User makes selections
   ├─ Drag dot from Column A to Column B
   ├─ OR Click Column A (highlight) → Click Column B
   ↓
5. Draw SVG connection line
   ↓
6. Update internal state
   ↓
7. Enable Submit button (when all pairs connected)
   ↓
8. Submit Answer
   ↓
9. Validate and show feedback
   ├─ Correct pairs: Green border, checkmark icon
   ├─ Incorrect pairs: Red border, cross icon
   ├─ Generic feedback message (if enabled)
   ├─ Individual feedback per pair (if enabled)
   ↓
10. Manage attempts
    ├─ Try Again (if attempts remaining)
    ├─ Show Me (reveal correct answers)
    └─ Reset (before submission)
```

#### Key Functions:

```javascript
// Submit answer
function SubmitAnswerMtpMultiple(event) {
  // Validates all pairs
  // Compares user answers with correct answers
  // Shows visual feedback (borders, icons)
  // Displays feedback messages
  // Manages attempt counter
  // Disables/enables action buttons
}

// Show correct answers
function showAnswerMtpMultiple(event) {
  // Reveals correct pairings
  // Draws all correct connection lines
  // Disables all interactions
  // Updates SCORM state
}

// Try again
function tryagainMtpMultiple(event) {
  // Clears user selections
  // Removes SVG lines
  // Resets visual feedback
  // Re-enables interactions
  // Maintains attempt counter
}

// Reset
function resetAnswerMtpMultiple(event) {
  // Clears all user selections (before submit)
  // Removes connection lines
  // Re-enables all interactions
}

// SVG line drawing
function svgDrawLineMultiple(eTarget, eSource, id, color) {
  // Calculates start/end coordinates
  // Creates SVG path element
  // Applies color and styling
  // Appends to SVG container
}

// Join pairs
function mtpJoinThePairMultiple(pair2Element, pair1Element, $form) {
  // Updates data attributes
  // Stores identifier mapping
  // Draws connection line
  // Updates UI states
  // Triggers SCORM state save
}
```

---

## 6. Visual Styles

The component supports 4 pre-defined visual styles:

### mtpStyle1 (Default)
- Bordered pair blocks (#dcdada)
- Blue connection dots (#7eb1eb)
- Clean, professional appearance

### mtpStyle2
- Colored backgrounds for pair headers
- Light backgrounds for pair blocks (#F9F9F9)
- No borders on content blocks

### mtpStyle3
- Gray header backgrounds (#B7B7B7)
- Borderless content blocks
- Minimalist design

### mtpStyle4
- Top/bottom borders on headers (#B7B7B7)
- Light backgrounds (#F9F9F9)
- Colored text headers
- Dynamic borders (show on selection/connection)

**Common Style Elements:**
- Correct pair: Green left border (5px), light green background (#EBF6E7)
- Incorrect pair: Red left border (5px), light red background (#FBE3E3)
- Connection lines: Configurable color (default #7eb1eb)

---

## 7. Data Flow Architecture

### 7.1 Editor Mode Data Flow

```
User Interaction
    ↓
AngularJS Directive (mtpMultipleTemplate)
    ↓
Update fieldData Model
    ↓
AngularJS Two-Way Binding
    ↓
Update DOM (contenteditable, ngModel)
    ↓
Trigger SVG Line Rendering
    ↓
Save to savedJson (main controller)
    ↓
Persist to Server/Local Storage
```

### 7.2 Preview/Reader Mode Data Flow

```
Component Load
    ↓
Parse JSON Configuration
    ↓
Render HTML Template
    ↓
Initialize jQuery Drag/Drop
    ↓
User Interaction (Drag/Click)
    ↓
Update DOM Attributes
    |  - data-drop-identifier
    |  - data-drag-identifier
    ↓
Draw SVG Connection Line
    ↓
User Submits Answer
    ↓
Validate (Compare identifiers)
    ↓
Apply Visual Feedback
    |  - CSS classes
    |  - Feedback icons
    |  - Alert messages
    ↓
Update SCORM/xAPI State (if enabled)
    ↓
Manage Action Buttons
    |  - Submit (disable)
    |  - Try Again (enable/disable)
    |  - Show Me (enable)
    |  - Reset (enable)
```

### 7.3 SCORM State Management

```javascript
function stateMainatainMTPMultiple($form) {
  // Collects current state:
  // - Button states (submit, showme, tryagain, reset)
  // - Attempt counters
  // - User selections (pair mappings)
  // - Correct/incorrect pairs
  // - Feedback visibility
  
  // Saves to SCORM API via saveAction()
}
```

**Saved State Object:**
```json
{
  "isSubmitEnable": true|false,
  "isShowMeEnable": true|false,
  "isTryAgainEnable": true|false,
  "isResetEnable": true|false,
  "totalNoOfAttempt": 3,
  "attemptsDone": 1,
  "feedbackMessage": {
    "enable": true|false,
    "symbol": true|false,
    "message": "..."
  },
  "isIndFeedbackEnable": true|false,
  "inputSeleced": {
    "pair1": ["1", "2", "3"],
    "pair2": ["1_1", "2_1", "3_1"]
  },
  "inputCorrect": ["1", "3"],
  "inputIncorrect": ["2"],
  "dataType": "mtp-multiple",
  "componentId": "..."
}
```

---

## 8. High-Level Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MTP MULTIPLE COMPONENT                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┴────────────────────────┐
            │                                                 │
            ▼                                                 ▼
┌──────────────────────┐                          ┌──────────────────────┐
│   EDITOR MODE        │                          │  PREVIEW/READER MODE │
│  (Authoring Tool)    │                          │   (Student View)     │
└──────────────────────┘                          └──────────────────────┘
            │                                                 │
    ┌───────┴───────┐                            ┌────────────┴─────────────┐
    ▼               ▼                            ▼                          ▼
┌─────────┐   ┌──────────┐              ┌──────────────┐        ┌──────────────┐
│Template │   │Directive │              │jQuery UI     │        │SVG Line      │
│HTML     │   │.js       │              │Drag/Drop     │        │Drawing       │
└─────────┘   └──────────┘              └──────────────┘        └──────────────┘
    │               │                            │                          │
    │         ┌─────┴─────┐                     │                          │
    │         ▼           ▼                     │                          │
    │   ┌─────────┐ ┌──────────┐               │                          │
    │   │Settings │ │SVG Line  │               │                          │
    │   │Panel    │ │Renderer  │               │                          │
    │   └─────────┘ └──────────┘               │                          │
    │         │           │                     │                          │
    └─────────┴───────────┴─────────────────────┴──────────────────────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    ▼                                ▼
            ┌──────────────┐              ┌──────────────────┐
            │   DATA MODEL │              │   SCORM/xAPI     │
            │   (JSON)     │              │   State Handler  │
            └──────────────┘              └──────────────────┘
                    │                                │
                    ▼                                ▼
            ┌──────────────┐              ┌──────────────────┐
            │   CSS STYLES │              │  LMS/Package     │
            │   (4 Themes) │              │  Integration     │
            └──────────────┘              └──────────────────┘

DATA FLOW:
─────────
  Author Input → AngularJS Model → JSON Config → Render Preview
                                                      ↓
  Student Interaction → Validate Answer → Show Feedback → Save State
```

### Data Flow Diagram

```
┌──────────────┐
│   Author     │
│  Configures  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  AngularJS Directive             │
│  - Add/Remove Pairs              │
│  - Set Content Types             │
│  - Configure Settings            │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Data Model (fieldData)          │
│  - pairedList[]                  │
│  - settings{}                    │
│  - currentPairIndex              │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  JSON Serialization              │
│  - Stored in savedJson           │
│  - Persisted to server           │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Package/Publish                 │
│  - Included in content package   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Reader/Preview Render           │
│  - Parse JSON                    │
│  - Generate HTML                 │
│  - Initialize interactions       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Student Interaction             │
│  - Drag/Click to pair            │
│  - Submit answer                 │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Validation Logic                │
│  - Compare identifiers           │
│  - Calculate score               │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Visual Feedback                 │
│  - Color-coded borders           │
│  - Icons (check/cross)           │
│  - Feedback messages             │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  State Management                │
│  - SCORM/xAPI tracking           │
│  - Attempt counter               │
│  - Button states                 │
└──────────────────────────────────┘
```

---

## 9. Key Features

### 9.1 Core Functionality
- ✅ Dynamic pair management (add/remove)
- ✅ Single (1-to-1) and Multiple (1-to-n) pairing modes
- ✅ Text and image content support
- ✅ SVG-based connection line rendering
- ✅ Drag-and-drop interaction
- ✅ Click-to-pair interaction (accessibility)
- ✅ Touch device support
- ✅ Auto-scrolling during drag operations

### 9.2 Assessment Features
- ✅ Configurable attempts (1-5)
- ✅ Submit answer validation
- ✅ Show correct answers
- ✅ Try again functionality
- ✅ Reset before submission
- ✅ Generic feedback messages (correct/incorrect)
- ✅ Individual feedback per pair
- ✅ Shuffle Column B elements

### 9.3 Content Authoring
- ✅ Rich text editing with math equations
- ✅ Image upload with dimension control
- ✅ Multiple image display modes
- ✅ Column headers customization
- ✅ Optional header and instructions
- ✅ Label type (Primary/Secondary)
- ✅ Alt text for accessibility

### 9.4 Visual Customization
- ✅ 4 pre-defined visual styles
- ✅ Configurable color scheme
- ✅ Responsive layout
- ✅ Mobile-optimized views

### 9.5 Advanced Features
- ✅ SCORM/xAPI state persistence
- ✅ Group activity integration
- ✅ Latency time tracking
- ✅ Offline/package support
- ✅ Localization support

---

## 10. Offline/Package Behavior

### 10.1 Package Contents
When published, the component includes:
- HTML template with inline data
- External JavaScript libraries (jQuery, AngularJS)
- CSS stylesheets
- Uploaded images (base64 or packaged assets)
- SCORM wrapper (if applicable)

### 10.2 Offline Functionality
✅ **Fully Supported:**
- All interaction logic (drag/drop, validation)
- Visual rendering and feedback
- Local state management

⚠️ **Limitations:**
- SCORM state persistence requires connection to LMS
- Image loading depends on package structure
- External math rendering libraries must be bundled

### 10.3 Asset Management
- Images stored as relative paths (`images/image.jpg`)
- Base64 encoding option for small images
- Media files packaged with content

---

## 11. Error Handling

### 11.1 Validation Errors

```javascript
// Maximum element limit
if (totalElements >= 20) {
  // Display error message
  // Disable "Add Pair" button
}

// Minimum pair requirement
if (pairedList.length <= 2) {
  // Disable "Remove" button for last 2 pairs
}
```

### 11.2 Runtime Errors

**Missing Dependencies:**
- jQuery not loaded → Fallback or error message
- AngularJS not loaded → Component fails to initialize

**Invalid Data:**
- Missing `pair1` or `pair2` → Skip rendering that pair
- Invalid identifier → Validation fails gracefully

**Browser Compatibility:**
- SVG not supported → Display warning
- Touch events not supported → Fallback to mouse events

### 11.3 User Input Errors

**Incomplete Submission:**
- Not all pairs connected → Submit button remains disabled

**Invalid Drag Operation:**
- Drop on non-droppable area → Revert to original position
- Drop on already paired element → Reject drop (if single mode)

---

## 12. Known Issues

### 12.1 Critical Issues
1. **SVG Line Positioning on Window Resize**
   - Lines don't automatically redraw on resize
   - **Workaround**: `mtpMultipleResize()` called on window resize event
   - **Status**: Partially resolved

2. **Drag Scroll Performance**
   - Performance degradation with many pairs (>15)
   - **Impact**: Laggy drag operations on low-end devices
   - **Status**: Optimization needed

3. **Math Equation Rendering**
   - Math equations may overflow container
   - **Workaround**: CSS `overflow: auto` on text containers
   - **Status**: Open issue

### 12.2 Minor Issues
1. **Z-Index Conflicts**
   - SVG layer occasionally overlaps dropzone dots
   - **Status**: Fixed with explicit z-index values

2. **Mobile Touch Precision**
   - Small touch targets for connection dots (14px)
   - **Recommendation**: Increase touch target size for mobile

3. **Shuffle Randomization**
   - Uses `Math.random()` without seed → different order on refresh
   - **Impact**: Inconsistent experience for same user
   - **Status**: By design (intentional randomization)

4. **SCORM State Size**
   - Large components with images may exceed SCORM suspend data limits
   - **Workaround**: Use external assets, minimize embedded data

### 12.3 Browser-Specific Issues
- **IE11**: SVG rendering performance issues
- **Safari iOS**: Touch punch may have timing issues
- **Edge Legacy**: Drag-and-drop cursor inconsistencies

---

## 13. Recommendations for Improvement

### 13.1 Performance Optimization
1. **Virtual Scrolling**: For large pair lists (>20 elements)
2. **Debounce SVG Redraw**: Reduce redraw frequency on resize
3. **Lazy Image Loading**: Load images on-demand for better initial load time

### 13.2 Accessibility Enhancements
1. **Keyboard Navigation**: 
   - Tab through pairs
   - Arrow keys to select targets
   - Enter/Space to confirm pairing
2. **Screen Reader Support**:
   - ARIA labels for all interactive elements
   - Announce state changes (paired, submitted, correct/incorrect)
3. **High Contrast Mode**: Support for Windows high contrast settings
4. **Focus Indicators**: Visible focus states for all interactive elements

### 13.3 Feature Enhancements
1. **Undo/Redo**: Allow users to undo last pairing
2. **Partial Credit**: Award points for partial correctness
3. **Hint System**: Provide hints after failed attempts
4. **Animated Feedback**: Smooth transitions for feedback states
5. **Bulk Image Upload**: Upload multiple images at once
6. **Export/Import Pairs**: CSV import for rapid content creation

### 13.4 Code Quality
1. **Migrate to Modern Framework**: 
   - Replace AngularJS 1.x with Angular/React/Vue
   - Use TypeScript for type safety
2. **Modularize Code**: 
   - Separate concerns (drag logic, validation, rendering)
   - Create reusable utility functions
3. **Unit Tests**: 
   - Add test coverage for validation logic
   - Test drag/drop interactions
4. **Documentation**: 
   - Add JSDoc comments
   - Create component API reference

### 13.5 UX Improvements
1. **Visual Feedback During Drag**:
   - Show preview line while dragging
   - Highlight valid drop targets
2. **Progressive Disclosure**:
   - Collapse/expand pairs for easier navigation
   - Show progress indicator (X of Y pairs connected)
3. **Error Prevention**:
   - Warning before removing pairs with content
   - Confirmation dialog for "Show Me" action

### 13.6 Content Authoring
1. **Drag-to-Reorder Pairs**: Allow authors to reorder pairs visually
2. **Duplicate Pairs**: Copy existing pair as starting point
3. **Bulk Edit**: Edit multiple pairs simultaneously
4. **Preview Mode**: Toggle between edit and preview without saving
5. **Content Validation**: Warn about empty content before saving

---

## 14. Integration Points

### 14.1 Main Application Integration

The component integrates with the main authoring application through:

1. **Angular Controller** (`myController`):
   - Manages global state (`savedJson`)
   - Handles save operations
   - Coordinates settings panel display

2. **Common Directives**:
   - `add-common-hover`: Hover effects
   - `edittemplate`: Template editing mode
   - `commonbuttons`: Action button rendering

3. **Modal Service**: For image upload and media management

### 14.2 Settings Panel Communication

```javascript
// Settings panel opened via:
scope.addTagPanel = function(e) {
  // Set currentPairIndex
  // Load pair-specific settings
  // Display settings panel with URL: settingsPath + "?t=" + timestamp
}

// Settings changes propagated via:
con.$broadcast('eventName', data);
// Events: attemptsChange, allowRestartClick, onHeaderVisibilityChanged, etc.
```

### 14.3 SCORM/xAPI Integration

```javascript
// Save state to LMS:
if (typeof apiHandle != "undefined") {
  stateMainatainMTPMultiple($form);
  // Calls: saveAction(event, scoObj)
}
```

**Required Functions:**
- `apiHandle`: SCORM API handle
- `saveAction(event, scoObj)`: Save state to LMS

---

## 15. Testing Recommendations

### 15.1 Functional Testing
- [ ] Add pairs (up to max limit)
- [ ] Remove pairs (down to minimum 2)
- [ ] Switch between text and image content
- [ ] Toggle single/multiple choice modes
- [ ] Upload images and verify display
- [ ] Enter text with math equations
- [ ] Drag and drop pairing
- [ ] Click-to-pair interaction
- [ ] Submit with all pairs connected
- [ ] Submit with missing pairs (should block)
- [ ] Validate correct answers
- [ ] Validate incorrect answers
- [ ] Try again functionality
- [ ] Show me functionality
- [ ] Reset functionality
- [ ] Shuffle on page load
- [ ] Resize window (verify line redraw)

### 15.2 Edge Case Testing
- [ ] Single pair (minimum boundary)
- [ ] 20 total elements (maximum boundary)
- [ ] Very long text content
- [ ] Very large images
- [ ] Images with unusual aspect ratios
- [ ] Multiple rapid drag operations
- [ ] Concurrent drag operations (should prevent)
- [ ] Drop on invalid target
- [ ] Submit during drag operation
- [ ] Refresh page during activity

### 15.3 Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 15.4 Accessibility Testing
- [ ] Screen reader navigation (NVDA, JAWS)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Zoom levels (up to 200%)
- [ ] Color blindness simulation

### 15.5 Performance Testing
- [ ] Load time with 20 elements
- [ ] Drag performance with 20 elements
- [ ] Memory usage during extended interaction
- [ ] SVG rendering performance
- [ ] Image loading performance

---

## 16. Maintenance and Support

### 16.1 Dependency Updates
**Critical Dependencies:**
- jQuery 1.9.1+ (consider migrating to 3.x)
- jQuery UI 1.10.3+ (latest: 1.13.x)
- AngularJS 1.x (EOL: consider migration)
- Bootstrap (version unclear)

**Update Risks:**
- AngularJS breaking changes
- jQuery UI drag/drop API changes
- Bootstrap grid system changes

### 16.2 Browser Support Matrix
| Browser          | Minimum Version | Status      |
|------------------|-----------------|-------------|
| Chrome           | 90+             | ✅ Supported |
| Firefox          | 88+             | ✅ Supported |
| Safari           | 14+             | ✅ Supported |
| Edge             | 90+             | ✅ Supported |
| Mobile Safari    | 14+             | ✅ Supported |
| Chrome Mobile    | 90+             | ✅ Supported |
| Internet Explorer| 11              | ⚠️ Limited   |

### 16.3 Version History
- **v1.0**: Initial release
- **vCurrent**: Added 1-to-n pairing, image configuration, 4 visual styles

---

## 17. Security Considerations

### 17.1 Input Sanitization
- ⚠️ **XSS Risk**: Contenteditable fields may allow HTML injection
- **Mitigation**: Sanitize user input before save
- **Status**: Partial (AngularJS ngSanitize may be used)

### 17.2 Image Upload
- ⚠️ **File Type Validation**: Ensure only valid image formats (PNG, JPG, SVG)
- ⚠️ **File Size Limits**: Prevent large file uploads
- **Recommendation**: Server-side validation and virus scanning

### 17.3 State Management
- ✅ **SCORM State**: Read-only after submission (prevent tampering)
- ⚠️ **Local Storage**: Clear sensitive data on logout

---

## 18. Conclusion

The Match The Pairs (Multiple) component is a feature-rich, interactive assessment tool designed for educational content. Its support for 1-to-n pairing, flexible content types, and robust feedback mechanisms make it suitable for diverse learning scenarios.

**Strengths:**
- Flexible pairing modes (1-to-1 and 1-to-n)
- Rich content support (text, images, equations)
- Comprehensive feedback options
- Mobile-friendly interactions
- Multiple visual styles

**Areas for Improvement:**
- Performance optimization for large datasets
- Accessibility enhancements
- Modern framework migration
- Enhanced error handling
- Better documentation and testing

**Recommended Next Steps:**
1. Add comprehensive unit and integration tests
2. Implement accessibility improvements (WCAG 2.1 AA)
3. Optimize performance for mobile devices
4. Conduct user testing with educators and learners
5. Plan migration to modern JavaScript framework

---

## 19. Appendix

### A. Glossary
- **MTP**: Match The Pairs
- **1-to-n**: One element in Column A paired with multiple elements in Column B
- **Pair**: A matching relationship between Column A and Column B elements
- **Identifier**: Unique numeric ID for each element
- **SubIdentifier**: Secondary ID for multiple pairs (1-to-n mode)
- **SCORM**: Sharable Content Object Reference Model (e-learning standard)

### B. File Size Reference
- `mtp-multiple-directive.js`: ~30KB
- `mtp-multiple-preview1.js`: ~27KB
- `mtp-multiple-line-preview1.js`: ~16KB
- `mtp-multiple-template.css`: ~29KB
- `mtp-multiple.json`: ~10KB (default)

### C. Color Palette
- Primary: `#7eb1eb` (blue)
- Primary Light: `rgb(126,177,235,0.3)`
- Correct: `#016001` (green), `#EBF6E7` (light green)
- Incorrect: `#E33030` (red), `#FBE3E3` (light red)
- Border: `#dcdada` (light gray)
- Header: `#B7B7B7` (medium gray)

### D. References
- AngularJS Documentation: https://docs.angularjs.org/
- jQuery UI Draggable: https://jqueryui.com/draggable/
- SVG Path Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
- SCORM 2004: https://scorm.com/scorm-explained/technical-scorm/
