# Match The Pairs Component - Technical Documentation

**Component Identifier:** `match-the-pairs`  
**Display Name:** Match The Pairs (Match The Columns)  
**Version:** Current Implementation  
**Last Updated:** February 17, 2026

---

## Table of Contents

1. [Component Overview](#1-component-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Types and Variants](#3-types-and-variants)
4. [Data Model & Configuration](#4-data-model--configuration)
5. [Editor Mode Implementation](#5-editor-mode-implementation)
6. [Preview/Reader Mode Implementation](#6-previewreader-mode-implementation)
7. [Interaction Logic & Line Drawing](#7-interaction-logic--line-drawing)
8. [Scoring & Assessment Logic](#8-scoring--assessment-logic)
9. [Visual Styles & Theming](#9-visual-styles--theming)
10. [State Management & Persistence](#10-state-management--persistence)
11. [Offline/Package Behavior](#11-offlinepackage-behavior)
12. [Data Flow & Architecture Diagram](#12-data-flow--architecture-diagram)
13. [Error Handling](#13-error-handling)
14. [Known Issues](#14-known-issues)
15. [Recommendations for Improvement](#15-recommendations-for-improvement)

---

## 1. Component Overview

### Purpose
The Match The Pairs component is an interactive assessment widget that allows learners to connect matching elements from two columns (Column A and Column B) by drawing lines between paired items. The component supports both text and image-based elements.

### Key Features
- **Dual Column Layout**: Column A (left) and Column B (right) with 2-10 element pairs
- **Content Types**: Text or images for each column (mixed mode supported)
- **Visual Interaction**: Drag-and-drop or click-to-connect interface with SVG line drawing
- **Shuffling**: Optional auto-shuffle of Column B elements
- **Multiple Attempts**: Configurable 1-5 attempts with progressive feedback
- **Show Me**: Answer reveal functionality
- **Try Again**: Reset after incorrect attempts
- **Individual Feedback**: Per-pair custom feedback messages
- **Generic Feedback**: Overall correct/incorrect messages
- **Visual Styles**: 4 predefined style variants
- **Label Types**: Primary/Secondary question labeling
- **SCORM Compatible**: State persistence for LMS integration
- **Responsive**: Mobile and tablet support with touch capabilities

### User Workflow
1. Read instructions/question
2. Connect elements from Column A to Column B by:
   - Dragging circles from Column A to Column B, OR
   - Clicking a pair in Column A, then clicking corresponding pair in Column B
3. Submit answer for validation
4. Review feedback (individual per-pair or generic)
5. Use Try Again (if attempts remain) or Show Me (if enabled)
6. View final results with visual indicators

---

## 2. Architecture & File Structure

### Core Files

```
templates/match-the-pairs/
│
├── match-the-pairs.html                      # Main HTML template (AngularJS view)
├── match-the-pairs-setting-panel.html        # Settings panel UI
├── media-template2.html                      # Media/image template sub-component
│
├── scripts/
│   ├── match-the-pairs-directive.js          # AngularJS directive (Editor mode)
│   ├── match-the-pairs-preview1.js           # Preview/Reader functionality
│   └── match-pair-line-preview1.js           # SVG line drawing logic
│
├── styles/
│   └── match-the-pairs-template.css          # Component-specific styles
│
└── default/
    └── match-the-pairs.json                  # Default configuration/schema
```

### Dependencies

**External Libraries:**
- jQuery (1.9.1+)
- jQuery UI (1.10.3+) - Drag & Drop support
- jQuery UI Touch Punch - Mobile touch support
- AngularJS (for editor mode)
- SVG (native browser support)

**KITABOO Platform:**
- Editor framework (`editor/ngcontroller.js`)
- SCORM wrapper (`scorm/scorm.js`)
- Common button components
- Asset color theming system

### Integration Points

1. **Main Application** (`index.html`)
   - Line 59: CSS import
   - Line 1382: Template selection modal
   - Line 3859: Directive script import

2. **Editor Controller** (`editor/ngcontroller.js`)
   - Lines 145-146: Gradable assessment widget registration
   - Line 11181-11182: JSON path mapping
   - Lines 11656-11657: Preview script loading

3. **SCORM Module** (`scorm/scorm.js`)
   - Lines 9, 526, 821, 1225, 1980: State management integration

---

## 3. Types and Variants

### Primary Variant: Vertical Match-The-Pairs (Single Type)

**Type Name:** `mtp_vertical` (only active type)  
**Identifier:** `match-the-pairs`  
**isSingleSelect:** `false`

**Characteristics:**
- Two-column vertical layout
- Line drawing between paired elements
- Each element in Column A connects to exactly one element in Column B
- Column B can be shuffled before interaction

### Legacy/Deprecated: Horizontal Type

**Note:** The horizontal variant (`mtp_horizontal`) code exists but appears deprecated:
```javascript
// From match-the-pairs-directive.js line 189
scope.fieldData.settings.templateImage = (scope.fieldData.settings.hsMlBoolean === 'vertical') 
    ? 'icon-Match-the-pair_draw-line' 
    : 'icon-Match-The-Pairs---Horizontal';
```

The horizontal type implementation is incomplete in the current codebase. Only vertical mode is fully functional.

### Content Type Variants

Each column can independently be configured as:

1. **Text Mode** (`pair1_text` / `pair2_text`)
   - Editable text content
   - Rich text support with math editor
   - Minimum 80px height

2. **Image Mode** (`pair1_image` / `pair2_image`)
   - PNG, JPG, SVG formats
   - Three display modes:
     - **Default**: Original ratio, constrained size
     - **Large**: Original ratio, larger display
     - **Custom**: User-defined width/height (minimum 1px)

**Mixed Mode Example:**
- Column A: Text
- Column B: Images
- (All 4 combinations are supported)

---

## 4. Data Model & Configuration

### JSON Schema Structure

```json
{
    "identifier": "match-the-pairs",
    "elementTitle1": "",              // Column A header
    "elementTitle2": "",              // Column B header
    "header": "",                     // Main header text
    "instruction": "",                // Instruction text
    "question": "Question 1",         // Primary label
    "secondaryQuestion": "Part A",    // Secondary label
    
    "settings": {
        // Visibility Controls
        "isHeaderVisible": true,
        "isInstructionVisible": true,
        "isLabelTypeMTP": false,
        "labelType": "primary",       // or "secondary"
        
        // Assessment Configuration
        "maxTries": "3",              // 1-5 attempts
        "isReset": "false",
        "isShowme": "true",
        "allowRestart": false,
        "showmecheckbox": false,
        
        // Layout & Structure
        "isVerticalMtp": "mtp_vertical",
        "hsMlBoolean": "vertical",
        
        // Theming
        "activeStyle": "mtpStyle1",   // mtpStyle1-4
        "Appearance": "#7eb1eb",      // Primary color
        "BgAppearance": "rgb(126,177,235,0.3)",  // Background color
        "outline": "outline",         // or "outlineBg"
        "outlineBgColor": "1px solid #ccc",
        
        // Feedback
        "feedbackCheckbox": false,    // Individual per-pair feedback
        "genericFeedbackCheckbox": false,
        "generic_correct_ans_text": "",
        "generic_incorrect_ans_text": "",
        
        // Image Configuration
        "imageConfiguration": {
            "1": {  // Column A
                "imageDisplayMode": "default-img",  // or "large-img"
                "imageRatio": "original-ratio",     // or "custom-ratio"
                "imageCustomWidth": "",
                "imageCustomHeight": ""
            },
            "2": {  // Column B (same structure)
                ...
            }
        },
        
        // Other Settings
        "shuftleChoiceCheckbox": true,
        "templateImage": "icon-Match-the-pair_draw-line",
        "templateName": "Match the Pairs",
        "isLayerEnable": false,
        "isLayerCheckBoxEnable": true
    },
    
    "listData": [{
        "hpvpData": {
            "pairedList": [
                {
                    "pairInfo": {
                        "pair1": {
                            "identifier": 1,      // Unique pair ID
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
                            "isImageEnable": "pair1_text"  // or "pair1_image"
                        },
                        "pair2": {
                            "identifier": 1,
                            // Same structure as pair1
                            "isImageEnable": "pair2_text"  // or "pair2_image"
                        },
                        "feedbackinline": ""  // Individual feedback text
                    }
                }
                // ... additional pairs (2-10 total)
            ],
            "isSingleSelect": false,
            "isTextorImage1": true,
            "isTextorImage2": true
        }
    }],
    
    "custom": {
        "css": ["css/templates/match-the-pairs-template.css"],
        "javascript": [
            "js/jquery-ui.min.js",
            "js/jquery-ui-1.10.3.min.js",
            "js/jquery.ui.touch-punch.js",
            "js/templates/match-the-pairs-preview1.js",
            "js/templates/match-pair-line-preview1.js"
        ]
    }
}
```

### Key Data Attributes

**Element Limits:**
- Minimum pairs: 2
- Maximum pairs: 10
- Max attempts: 5
- Min attempts: 1

**Identifier System:**
- Each pair has a unique `identifier` (1-based index)
- pair1 and pair2 within a pair share the same identifier
- Used for matching logic: `pair1.identifier === pair2.identifier` = correct match

---

## 5. Editor Mode Implementation

### Directive: `mtp-template`

**File:** `match-the-pairs-directive.js`  
**Framework:** AngularJS

### Core Responsibilities

1. **Content Editing**
   - Header/instruction editing with contenteditable
   - Column title editing (elementTitle1, elementTitle2)
   - Element text editing (inline rich text)
   - Math formula support integration
   - Image upload and replacement

2. **Pair Management**
   - Add pairs (up to 10): `addPairsClick()`
   - Remove pairs (min 2): `removePairClick()`
   - Auto-reindex identifiers after deletion

3. **Settings Panel Integration**
   - Display settings: `addTagPanel()`
   - Edit element properties (text/image toggle)
   - Configure image dimensions
   - Set attempts, feedback, styles

4. **Real-time Preview**
   - SVG line generation for visual preview: `setPairConnectingLines()`
   - Style application based on selected theme
   - Image dimension updates

### Key Functions

```javascript
// Add new pair
addPairsClick(event) {
    // Adds new pair object with default structure
    // Increments identifier counter
    // Limited to 10 pairs maximum
}

// Remove pair and reindex
removePairClick(index) {
    // Removes pair at index
    // Reindexes all remaining pairs (1-based)
    // Updates identifiers for pair1, pair2, and media
}

// Settings panel display
addTagPanel(e) {
    // Determines current pair from event target
    // Loads settings panel with pair-specific settings
    // Initializes dropdown for attempts
}

// Image configuration
initCustomRatioDims(pairIndex) {
    // Sets initial dimensions from natural image size
    // Defaults: 250x120 if image not loaded
}

onCustomDimensionChange(pairIndex) {
    // Updates all images in the pair with custom dimensions
    // Enforces minimum 1px for width/height
}
```

### Validation & Sanitization

```javascript
// Text sanitization (removes HTML tags)
changeColumnAElement(value, placeholder) {
    $scope.columnAElement = value ? String(value).replace(/<[^>]+>/gm, '') : '';
    if($scope.columnAElement.length == 0)
        $scope.columnAElementOutput = $scope.columnAElement;
}

// Header/instruction validation (similar pattern)
changeHeader(data, val) {
    $scope.headerOutput = data ? String(data).replace(/<[^>]+>/gm, '') : '';
    if($scope.headerOutput.length == 0)
        $scope.fieldData.header = $scope.headerOutput;
}
```

### Settings Panel Features

**File:** `match-the-pairs-setting-panel.html`

Organized sections:
1. **Display Settings**
   - Show/Hide Header
   - Show/Hide Instruction
   - Show Label Type (Primary/Secondary)

2. **Element Properties** (per pair)
   - Column A: Text/Image radio selector
   - Column B: Text/Image radio selector
   - Image upload interface
   - Image display mode (Default/Large/Custom)

3. **Assessment Settings**
   - Number of attempts (1-5) with easy dropdown
   - Allow Restart toggle
   - Show Me toggle

4. **Feedback Configuration**
   - Individual feedback toggle
   - Generic feedback toggle
   - Custom success/failure messages

5. **Style Selection**
   - Visual thumbnail selector
   - 4 style variants + "coming soon" placeholder

6. **Advanced Options**
   - Shuffle choices toggle
   - Sample layer marker
   - Asset color picker

---

## 6. Preview/Reader Mode Implementation

### Main Logic: `match-the-pairs-preview1.js`

This file handles all learner interactions, validation, and feedback.

### Initialization

```javascript
$(function () {
    $('.customClass[data-type="match-the-pairs"]').each(function (index, item) {
        // Check if activity is in progress
        if (window.isActivityInprogress) {
            const $form = $(item).find('form');
            $form.find('.pairContainer').addClass('disabledInput');
        }
    });
    
    // Auto-shuffle if enabled
    $(".mtpShuffleEnable").each(function () {
        // Fisher-Yates shuffle algorithm for pair2 elements
        // Shuffles both content blocks and connection dots
    });
    
    // Initialize drag-drop after shuffle
    initialize();
});
```

### Core Functions

#### 1. Submit Answer

```javascript
function SubmitAnswerMtpSingle(event) {
    // 1. Increment attempt counter
    // 2. Check all pairs are connected
    // 3. Validate each connection
    // 4. Calculate score (correctCount / totalPairs)
    // 5. Display feedback (individual + generic)
    // 6. Update UI states (disable submit, enable try again)
    // 7. Handle final attempt logic
    // 8. Persist state to SCORM
}
```

**Validation Logic:**
```javascript
function checkPairs($form) {
    let correctCount = 0, incorrectCount = 0, dragData = [];
    
    $form.find('.sort-drag').find('input:hidden').each(function () {
        let inputVal = $(this).val();
        let mappedData = inputVal.split('_');  // Format: "sourceID_targetID"
        
        if (mappedData[1]) {
            if (mappedData[0] == mappedData[1]) {
                correctCount++;
                // Visual feedback: green check icon
                $form.find('.drop-' + mappedData[0])
                    .parents(".mtp-pair2")
                    .append("<span class='feedbackIcon icon-Check'></span>")
                    .find('.mtp-pair2-block').addClass('mtp-correct-pair');
            } else {
                incorrectCount++;
                // Visual feedback: red X icon
                $form.find('.drop-' + mappedData[0])
                    .parents(".mtp-pair2")
                    .append("<span class='feedbackIcon icon-Close'></span>")
                    .find('.mtp-pair2-block').addClass('mtp-incorrect-pair');
            }
        } else {
            incorrectCount++;
            // Unpaired element = incorrect
        }
    });
    
    return { correctCount, incorrectCount, dragData };
}
```

#### 2. Show Answer

```javascript
function showAnswerMtp(event) {
    // 1. Disable all interactions
    // 2. Hide incorrect lines
    // 3. Draw all correct pair connections
    // 4. Set all pair2 elements to correct identifiers
    // 5. Display correct visual indicators
    // 6. Apply asset colors
    // 7. Disable all buttons
    // 8. Show individual feedback
    // 9. Persist state
}
```

#### 3. Try Again

```javascript
function tryagainMtp(event) {
    // 1. Reset form
    // 2. Remove all drawn lines
    // 3. Clear feedback icons and messages
    // 4. Re-enable draggable elements
    // 5. Clear connection data
    // 6. Reset UI button states
    // 7. Persist cleared state
}
```

#### 4. Reset Answer

```javascript
function resetAnswerMtp(event) {
    // Similar to Try Again but:
    // - Does NOT increment attempts
    // - Called before submission
    // - Clears current connections
}
```

### Feedback System

```javascript
function handleFeedback($form, $eventTarget, attempts, totalAttempts, correctCount, incorrectCount) {
    let genericCorrectFeedback = $form.find(".mtp-alert").attr("data-generic-correct-feedback");
    let genericIncorrectFeedback = $form.find(".mtp-alert").attr("data-generic-incorrect-feedback");
    let genericFeedbackEnable = $form.find(".mtp-alert").hasClass("genericFeedbackEnable");
    
    // Determine feedback type
    if ($form.find('.mtp-correct-pair').length === $form.find('.mtp-pair2-block').length) {
        // 100% correct
        showFeedback($form, "Correct!", genericFeedbackEnable, genericCorrectFeedback, 
                     "correct", "Congratulations! Your answer is correct");
        $form.parents(".component-holder").addClass("correct-question");
    } else if (attempts == totalAttempts) {
        // Final attempt, still wrong
        showFeedback($form, "Incorrect!", genericFeedbackEnable, genericIncorrectFeedback, 
                     "incorrect_last_try", "Oops! You have selected the wrong answer");
    } else {
        // Partial correct, attempts remain
        mtpAlert.show("Incorrect!", "", $form, "incorrect_message", "Please try again.");
    }
    
    // Show individual feedback on final attempt or complete success
    if (attempts == totalAttempts || incorrectCount == 0) {
        $form.find(".individualFeedbackEnable").addClass("showindividualFeedback");
    }
}
```

---

## 7. Interaction Logic & Line Drawing

### File: `match-pair-line-preview1.js`

### Drag-and-Drop Initialization

```javascript
function initialize() {
    // Draggable elements (Column A circles)
    $(".mtp-single .draggable").draggable({
        revert: true,
        cursor: "move",
        scroll: true,
        scrollSensitivity: 200,
        start: function(event, ui) { mtpdragStart = true; },
        stop: function(event, ui) { mtpdragStart = false; }
    });
    
    // Droppable elements (Column B circles)
    $(".mtp-single .droppable").droppable({
        hoverClass: "ui-state-hover",
        cursor: "move",
        scroll: true,
        scrollSensitivity: 200,
        drop: function(event, ui) {
            // Prevent duplicate connections
            if($(this).attr('data-drop-identifier') || 
               $(ui.draggable).find("input").attr("value").includes("_")) return;
            
            let $form = $(this).parents('form');
            mtpJoinThePair($(this), $(ui.draggable), $form, tempDraggable);
            
            // Enable submit if all pairs connected
            if($form.find(".mtp-pair2 [data-drag-identifier]").length == 
               $form.find(".mtp-pair2 [data-drop-identifier]").length) {
                $form.find('.submit-btn').removeClass('disabled');
            }
            $form.find('.reset').removeClass('disabled');
        }
    });
}
```

### Click-to-Connect (Mobile/Touch Pattern)

```javascript
// Select Column A element
$(".mtp-single .mtp-pair1").click(function(e) {
    let assetColor = $(this).parents(".component-holder.mtp").attr("data-asset");
    
    // Clear previous selection
    $(".pair1Selected").find(".mtp-content-block, .circle-half, .overlay-half").removeAttr("style");
    $(".pair1Selected").removeClass("pair1Selected");
    
    // Mark as selected if not already connected
    if(!$(this).hasClass("pairConnected")) {
        $(this).addClass("pair1Selected");
        applyAssetColorToPair($(this).find(".mtp-content-block"), assetColor, bgAssetColor);
    }
});

// Connect to Column B element
$(".mtp-single .mtp-pair2").click(function(e) {
    let $form = $(this).parents('form');
    
    if($form.find(".pair1Selected").length > 0 && !$(this).hasClass("pairConnected")) {
        let pair2Element = $(this).find(".circle-wrap[data-drag-identifier]");
        let pair1Element = $form.find(".pair1Selected .circle-wrap[data-drag-identifier]");
        
        mtpJoinThePair(pair2Element, pair1Element, $form, tempDraggable);
        
        // Enable submit if all connected
        if($form.find(".mtp-pair2 [data-drag-identifier]").length == 
           $form.find(".mtp-pair2 [data-drop-identifier]").length) {
            $form.find('.submit-btn').removeClass('disabled');
        }
    }
});
```

### Pair Connection Logic

```javascript
function mtpJoinThePair(pair2Element, pair1Element, $form, tempDraggable) {
    // 1. Get identifiers
    let sourceValue = pair1Element.find("input:hidden").val();
    let targetValue = pair2Element.find("input:hidden").val();
    let targetId = pair1Element.attr('data-drag-identifier');
    
    // 2. Set drop identifier
    pair2Element.attr('data-drop-identifier', targetId);
    
    // 3. Update hidden input to store mapping
    pair1Element.find("input:hidden").val(sourceValue + "_" + targetValue);
    
    // 4. Disable dragging on completed pair
    pair1Element.draggable({ 'disabled': false });
    pair1Element.css('opacity', 0);  // Hide source dot
    
    // 5. Visual feedback
    pair1Element.parent().find(".circle-half, .overlay-half").css("background-color", assetColor);
    pair2Element.find(".circle-half").css("background-color", assetColor);
    
    // 6. Mark as connected
    pair1Element.parents(".mtp-pair1").addClass("pairConnected");
    pair2Element.parents(".mtp-pair2").addClass("pairConnected");
    
    // 7. Apply style colors
    applyAssetColorToPair(pair1Element.parents(".mtp-pair1").find(".mtp-content-block"), 
                          assetColor, bgAssetColor);
    applyAssetColorToPair(pair2Element.parents(".mtp-pair2").find(".mtp-content-block"), 
                          assetColor, bgAssetColor);
    
    // 8. Draw connecting line
    svgDrawLine(pair2Element, pair1Element, sourceValue + "_" + targetValue, assetColor);
    
    // 9. Enable/disable submit based on completion
    if($form.find(".droppable").length !== $form.find(".dropped").length) {
        $form.find('.submit-btn').addClass('disabled');
    } else {
        $form.find('.submit-btn').removeClass('disabled');
    }
}
```

### SVG Line Drawing

```javascript
function svgDrawLine(eTarget, eSource, id, color) {
    setTimeout(function () {
        let $source = eSource;
        let $target = eTarget;
        let $form = $source.parents('[data-type="match-the-pairs"]');
        
        // Calculate coordinates relative to SVG container
        let originX = $source.offset().left + 7 - $form.find('svg').offset().left;
        let originY = $source.offset().top + 7 - $form.find('svg').offset().top;
        let endingX = $target.offset().left + 22 - $form.find('svg').offset().left;
        let endingY = $target.offset().top + 22 - $form.find('svg').offset().top;
        
        // SVG path: straight line from source to target
        let pathString = "M" + originX + " " + originY + " L" + endingX + " " + endingY;
        
        // Create SVG path element
        let pathElement = '<path d="' + pathString + '" ' +
                          'stroke="' + color + '" ' +
                          'stroke-width="2" ' +
                          'shape-rendering="crispEdges" ' +
                          'pathid="' + id + '"/>';
        
        // Append to SVG
        $form.find("svg").append(parseSVG(pathElement));
    }, 0);
}

// Helper: Parse SVG string to DOM element
function parseSVG(s) {
    let div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
    let frag = document.createDocumentFragment();
    while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
}
```

### Responsive Line Redrawing

```javascript
function mtpResize() {
    // Clear all existing lines
    $('.mtp.mtp-single .svgbasics').each(function () {
        $(this).find("svg path").remove();
    });
    
    // Redraw all connected lines
    $('.mtp.mtp-single .draggable').each(function () {
        let drag = $(this);
        let $form = $(this).parents('.template-editor-mtp');
        let assetColor = $form.parents(".mtp-preview-container").attr("data-asset");
        let dragId = $(this).attr("data-drag-identifier");
        
        // If Show Me is active, draw all correct pairs
        if ($form.find(".showme-btn").hasClass("disabled")) {
            $.each($form.find('.droppable'), function (index, elem) {
                index = index + 1;
                svgDrawLine($form.find('.drop-' + index), 
                           $form.find('.drag-' + index), 
                           index + '_' + index, 
                           assetColor);
            });
        } else {
            // Redraw user-created connections
            $form.find('.droppable').each(function () {
                let drop = $(this);
                let dropId = $(this).attr("data-drop-identifier");
                if ((dragId) == (dropId)) {
                    svgDrawLine(drop, drag, dragId + '_' + dropId, assetColor);
                }
            });
        }
    });
}

// Trigger on window resize
$(window).on("resize", function (event) {
    mtpResize();
});

// Trigger on iframe message (embedded contexts)
window.addEventListener("message", receiveMessage, false);
function receiveMessage() {
    if (event.origin !== trustedOrigin) return;
    if (typeof event.data == "string") {
        mtpResize();
    }
}
```

---

## 8. Scoring & Assessment Logic

### Score Calculation

**Scoring Method:** All-or-Nothing per pair

```javascript
// Pseudocode for scoring
totalPairs = number of element pairs
correctPairs = 0

for each pair:
    if (selectedPair.source.id == selectedPair.target.id):
        correctPairs++

score = (correctPairs / totalPairs) * 100
passed = (score == 100)  // Must be 100% correct to pass
```

**Important:** Partial credit is NOT awarded. The activity is considered correct only when ALL pairs are matched correctly.

### Attempt Management

```javascript
// Attributes on submit button
data-no-of-attempts="3"     // Total allowed attempts (1-5)
data-attempts="1"           // Current attempt counter

// Logic
if (currentAttempt < maxAttempts && !allCorrect) {
    // Enable "Try Again"
    enableTryAgain();
} else if (currentAttempt >= maxAttempts) {
    // Final attempt reached
    disableTryAgain();
    showAllFeedback();
    if (showMeEnabled) {
        enableShowMe();
    }
}
```

### Group Activity Integration

When embedded in Group Activity templates:

```javascript
function updateAttemptsFromGroupTemplate($form, cb) {
    let $group = $form.parents('.customClass[data-type="group-interactivity-template"]');
    if ($group.length) {
        // Inherit attempts from parent group activity
        let attempts = $group.find('.group-interactivity-btn .submit-btn').attr('data-attempts');
        let totalAttempts = $group.find('.group-interactivity-btn .submit-btn').attr('data-no-of-attempts');
        if (attempts && totalAttempts) {
            cb(parseInt(attempts), parseInt(totalAttempts));
        }
    }
}
```

### Pass/Fail Determination

```javascript
// In group-activity-preview1.js (lines 549-576)
if ($(item).attr('data-type') == "match-the-pairs") {
    let totalMtpPairs = $(item).find('.mtp-pair2-block').length;
    let correctMtpPairs = $(item).find('.mtp-correct-pair').length;
    
    if (totalMtpPairs == correctMtpPairs) {
        partialCorrect++;  // Full marks
    } else {
        // Zero marks (no partial credit)
    }
}
```

---

## 9. Visual Styles & Theming

### Available Styles

**File:** `match-the-pairs.json` (lines 69-94)

Four predefined styles with visual thumbnails:

#### Style 1: `mtpStyle1` (Default)
- **Thumbnail:** `images/Style/Match-the-pair/MTP_Style_Thumbnail_1.png`
- **Characteristics:**
  - Simple border with asset color on selected
  - Clean, minimal design
  - Border color changes to `Appearance` color when selected

#### Style 2: `mtpStyle2`
- **Thumbnail:** `images/Style/Match-the-pair/MTP_Style_Thumbnail_2.png`
- **Characteristics:**
  - Background color fill on column headers
  - Uses `Appearance` color for header backgrounds
  - Semi-transparent background on selection (`BgAppearance`)

#### Style 3: `mtpStyle3`
- **Thumbnail:** `images/Style/Match-the-pair/MTP_Style_Thumbnail_3.png`
- **Characteristics:**
  - Alternative border styling
  - Unique visual treatment (implementation similar to Style 1)

#### Style 4: `mtpStyle4`
- **Thumbnail:** `images/Style/Match-the-pair/MTP_Style_Thumbnail_4.png`
- **Characteristics:**
  - Text color changes to `Appearance` color on headers
  - Different from border-focused styles

#### Style 5: Coming Soon
- Placeholder for future style addition

### Asset Color System

**Primary Color:** `Appearance` (default: `#7eb1eb`)
**Background Color:** `BgAppearance` (default: `rgb(126,177,235,0.3)`)

```javascript
// Color application logic
function applyAssetColorToPair(pairSelector, assetColor, bgAssetColor) {
    // Connection dots
    pairSelector.parent().find(".circle-half, .overlay-half")
        .css("background-color", assetColor);
    
    // Style-specific application
    if (pairSelector.parents(".component-holder.mtp").hasClass("mtpStyle1") || 
        pairSelector.parents(".component-holder.mtp").hasClass("mtpStyle4")) {
        // Border color
        pairSelector.css("border-color", assetColor);
    }
    
    if (pairSelector.parents(".component-holder.mtp").hasClass("mtpStyle2")) {
        // Background color
        pairSelector.css("background-color", bgAssetColor);
    }
}
```

### CSS Classes

**File:** `match-the-pairs-template.css`

Key style classes:

```css
/* Layout */
.mtp-vertical { /* Vertical layout (default) */ }
.mtp-horizontal { /* Horizontal layout (deprecated) */ }

/* State Classes */
.pairConnected { /* Applied when pair is connected */ }
.mtp-correct-pair { /* Green styling for correct pairs */ }
.mtp-incorrect-pair { /* Red styling for incorrect pairs */ }
.pair1Selected { /* Highlighting for selected Column A element */ }

/* Feedback */
.feedbackIcon { /* Container for check/X icons */ }
.icon-Check { /* Green checkmark */ }
.icon-Close { /* Red X mark */ }
.showindividualFeedback { /* Display individual feedback messages */ }

/* Content Types */
.mtp-text-container { /* Text element styling */ }
.mtp-image-container { /* Image element container */ }
.default-img-style { /* Default image size */ }
.large-img-style { /* Large image size */ }
.custom-img-style { /* Custom dimensions */ }
```

### Outline Modes

**Setting:** `outline` property

1. **`"outline"`** (default)
   - Standard border around entire component
   - No background fill

2. **`"outlineBg"`**
   - Custom border color: `outlineBgColor`
   - Adds padding to internal sections
   - Used for integrated background designs

---

## 10. State Management & Persistence

### SCORM State Persistence

**Function:** `stateMainatainMTP($form)` in `match-the-pairs-preview1.js` (lines 574-603)

### State Object Structure

```javascript
let scoObj = {
    // Button states
    isSubmitEnable: Boolean,        // Submit button enabled/disabled
    isShowMeEnable: Boolean,        // Show Me button enabled/disabled
    isTryAgainEnable: Boolean,      // Try Again button enabled/disabled
    isResetEnable: Boolean,         // Reset button enabled/disabled
    
    // Attempt tracking
    totalNoOfAttempt: Number,       // Max attempts allowed (1-5)
    attemptsDone: Number,           // Attempts used so far
    
    // Feedback state
    feedbackMessage: {
        enable: Boolean,             // Feedback visible
        symbol: Boolean,             // True = correct icon, False = incorrect
        message: String              // Displayed message text
    },
    isIndFeedbackEnable: Boolean,   // Individual feedback visibility
    
    // User responses
    inputSeleced: {
        pair1: [identifiers],        // Array of selected pair1 IDs
        pair2: [identifiers]         // Array of corresponding pair2 IDs
    },
    
    // Validation results
    inputCorrect: [identifiers],     // Array of correct pair identifiers
    inputIncorrect: [identifiers],   // Array of incorrect pair identifiers
    
    // Component metadata
    dataType: "match-the-pairs",
    componentId: String              // Unique component identifier
};

// Persist to SCORM
saveAction(event, scoObj);
```

### State Restoration Flow

**In SCORM package (offline/LMS):**

1. Load suspended state from SCORM API
2. Parse state object for component
3. Restore button states
4. Redraw user connections:
   ```javascript
   // Pseudocode
   for each pair in inputSeleced:
       pair1Element = find element by inputSeleced.pair1[i]
       pair2Element = find element by inputSeleced.pair2[i]
       connect(pair1Element, pair2Element)
   ```
5. Apply validation results:
   ```javascript
   for each id in inputCorrect:
       addCorrectFeedback(id)
   for each id in inputIncorrect:
       addIncorrectFeedback(id)
   ```
6. Restore feedback messages
7. Set attempt counters
8. Disable/enable appropriate buttons

### Local Storage (Non-SCORM)

For browser-based sessions without SCORM:

```javascript
// Store state
localStorage.setItem('mtp_' + componentId, JSON.stringify(scoObj));

// Retrieve state
let savedState = JSON.parse(localStorage.getItem('mtp_' + componentId));
```

### Activity In Progress Flag

```javascript
// On component load
if (window.isActivityInprogress) {
    // Disable all inputs if activity was previously completed
    $form.find('.pairContainer').addClass('disabledInput');
}
```

---

## 11. Offline/Package Behavior

### SCORM Package Integration

**Location:** `scorm/scorm.js`

**References:**
- Line 9: Component count detection
- Line 526: Score calculation integration
- Line 821: State restoration
- Line 1225: Answer validation
- Line 1980: Final scoring

### Package-Specific Features

1. **Auto-Save on Every Interaction**
   - Each pair connection triggers `stateMainatainMTP()`
   - State persists to SCORM API immediately
   - Prevents data loss on browser close

2. **Latency Tracking**
   ```javascript
   // Timestamp on interaction
   let d = new Date();
   let tm = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
   $form.parents('.customClass').attr('latencyTime', tm);
   ```

3. **Adaptive Scrolling**
   - Auto-scroll during drag operations
   - Handles editor vs. reader context
   ```javascript
   if (ly && mtpdragStart) {
       // Auto-scroll logic based on mouse position
   }
   ```

4. **Offline Resource Loading**
   - All CSS/JS bundled in package
   - Images embedded or bundled
   - No external CDN dependencies

### Known Offline Limitations

1. **Math Formulas**
   - If math rendering relies on external MathJax CDN
   - Consider bundling MathJax locally

2. **Image Loading**
   - Relative paths must be preserved
   - Asset folder structure must match
   - SVG format recommended for scalability

3. **Font Icons**
   - Font Awesome fonts must be bundled
   - Icon classes hardcoded in JS
   - Fallback to Unicode symbols not implemented

---

## 12. Data Flow & Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MATCH THE PAIRS COMPONENT                           │
│                         Architecture & Data Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  EDITOR MODE (Authoring)                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴──────────────┐
                    │                              │
            ┌───────▼────────┐           ┌────────▼────────┐
            │   index.html    │           │ ngcontroller.js │
            │  (Main App)     │           │ (Editor Core)   │
            └───────┬────────┘           └────────┬────────┘
                    │                              │
                    │    ┌─────────────────────────┘
                    │    │
            ┌───────▼────▼─────────────────────────────────────────┐
            │   match-the-pairs-directive.js                       │
            │   (Angular Directive - mtpTemplate)                  │
            │                                                       │
            │   Responsibilities:                                  │
            │   • Content editing (header, instructions, pairs)    │
            │   • Pair management (add/remove/reindex)             │
            │   • Settings panel integration                       │
            │   • Real-time preview (SVG lines)                    │
            │   • Image upload/configuration                       │
            │   • Validation & sanitization                        │
            └───────┬──────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐      ┌────────▼────────┐
│ match-the-    │      │ match-the-pairs-│
│ pairs.html    │      │ setting-panel.  │
│ (View/       │      │ html            │
│  Template)    │      │ (Settings UI)   │
└───────┬───────┘      └────────┬────────┘
        │                       │
        │         ┌─────────────┘
        │         │
        └─────────▼──────────────────┐
                                      │
            ┌─────────────────────────▼────────────────────┐
            │    match-the-pairs.json (Default Schema)     │
            │                                               │
            │    • Structure definition                    │
            │    • Default values                          │
            │    • Validation rules                        │
            │    • Style configurations                    │
            └──────────────────┬───────────────────────────┘
                              │
                              │ (JSON Data)
                              │
            ┌─────────────────▼───────────────────────────┐
            │         SAVED CONTENT JSON                   │
            │      (Stored in savedJson array)             │
            │                                               │
            │   Structure:                                 │
            │   savedJson[pageNo][uniqueId] = {            │
            │       identifier: "match-the-pairs",         │
            │       settings: {...},                       │
            │       listData: [{                           │
            │           hpvpData: {                        │
            │               pairedList: [{...}]            │
            │           }                                  │
            │       }]                                     │
            │   }                                          │
            └──────────────────┬───────────────────────────┘
                              │
                              │ (Export/Publish)
                              │
┌─────────────────────────────▼───────────────────────────────────────────────┐
│  PREVIEW/READER MODE (Learner Perspective)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐   ┌─────────▼────────┐   ┌───────▼──────────┐
│ match-the-    │   │ match-pair-line- │   │ match-the-pairs- │
│ pairs-        │   │ preview1.js      │   │ template.css     │
│ preview1.js   │   │                  │   │                  │
│               │   │ • SVG drawing    │   │ • Visual styles  │
│ Core Logic    │   │ • Line rendering │   │ • Responsive     │
│ • Init        │   │ • Drag/drop      │   │ • Themes         │
│ • Submit      │   │ • Click connect  │   │ • Feedback UI    │
│ • Show Answer │   │ • Resize redraw  │   └──────────────────┘
│ • Try Again   │   └──────────────────┘
│ • Reset       │
└───────┬───────┘
        │
        │ (User Interactions)
        │
┌───────▼──────────────────────────────────────────────────────────┐
│                    INTERACTION FLOW                               │
│                                                                   │
│  1. Page Load                                                     │
│     ├─ Parse JSON data                                           │
│     ├─ Render pairs (text/images)                                │
│     └─ Shuffle if enabled (Fisher-Yates)                         │
│                                                                   │
│  2. Initialize Drag/Click                                         │
│     ├─ jQuery UI Draggable (Column A dots)                       │
│     ├─ jQuery UI Droppable (Column B dots)                       │
│     ├─ Touch support (Touch Punch)                               │
│     └─ Click handlers (mobile pattern)                           │
│                                                                   │
│  3. User Connects Pairs                                           │
│     ├─ Drag: drag dot from A → drop on B                        │
│     │   OR                                                        │
│     ├─ Click: click A element → click B element                 │
│     ├─ Update hidden input: "sourceID_targetID"                 │
│     ├─ Draw SVG line (svgDrawLine)                              │
│     ├─ Apply asset colors                                        │
│     ├─ Mark as "pairConnected"                                   │
│     └─ Enable Submit if all pairs connected                      │
│                                                                   │
│  4. Submit Answer                                                 │
│     ├─ Increment attempt counter                                 │
│     ├─ Validate each pair: source.id == target.id                │
│     ├─ Calculate score: correctCount / totalPairs                │
│     ├─ Display feedback:                                          │
│     │   ├─ Visual: Check/X icons                                 │
│     │   ├─ Individual: Per-pair messages                         │
│     │   └─ Generic: Overall success/failure                      │
│     ├─ Update UI button states                                   │
│     ├─ Persist state (SCORM/localStorage)                        │
│     └─ Handle final attempt logic                                │
│                                                                   │
│  5. Show Answer (if enabled)                                      │
│     ├─ Clear incorrect lines                                     │
│     ├─ Draw all correct connections                              │
│     ├─ Display all as correct                                    │
│     └─ Disable all interactions                                  │
│                                                                   │
│  6. Try Again (if attempts remain)                                │
│     ├─ Clear all lines (remove SVG paths)                        │
│     ├─ Reset hidden inputs                                       │
│     ├─ Re-enable draggable elements                              │
│     ├─ Clear feedback                                            │
│     └─ Reset UI to initial state                                 │
└───────────────────────────────────────────────────────────────────┘
                              │
                              │ (State Persistence)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   STATE MANAGEMENT                               │
│                                                                  │
│  Function: stateMainatainMTP($form)                             │
│                                                                  │
│  Collects:                                                       │
│  ├─ Button states (submit, showme, tryagain, reset)            │
│  ├─ Attempt counters (total, done)                             │
│  ├─ User selections (pair1 IDs, pair2 IDs)                     │
│  ├─ Validation results (correct IDs, incorrect IDs)            │
│  ├─ Feedback state (message, visibility)                       │
│  └─ Component metadata (type, ID)                              │
│                                                                  │
│  Persists to:                                                    │
│  ├─ SCORM API (if available) → saveAction(event, scoObj)       │
│  └─ localStorage (fallback)                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Scoring)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   SCORING & ASSESSMENT                           │
│                                                                  │
│  Scoring Method: All-or-Nothing                                 │
│                                                                  │
│  Algorithm:                                                      │
│  ┌────────────────────────────────────────────────┐            │
│  │ totalPairs = pairedList.length                 │            │
│  │ correctPairs = 0                               │            │
│  │                                                 │            │
│  │ for each pair in userSelections:               │            │
│  │     if pair.source.id == pair.target.id:       │            │
│  │         correctPairs++                          │            │
│  │                                                 │            │
│  │ score = (correctPairs / totalPairs) * 100      │            │
│  │ passed = (score == 100)                        │            │
│  └────────────────────────────────────────────────┘            │
│                                                                  │
│  Integration:                                                    │
│  ├─ Standalone: Score tracked in component                     │
│  ├─ Group Activity: Contributes to aggregate score             │
│  └─ SCORM: Reported as cmi.score.scaled (0.0 or 1.0)          │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
└─────────────────────────────────────────────────────────────────┘
        │                       │                      │
┌───────▼────────┐    ┌─────────▼────────┐   ┌────────▼────────┐
│  SCORM API     │    │ Group Activity   │   │ Asset Library   │
│                │    │ Template         │   │                  │
│ • State save   │    │                  │   │ • Image upload  │
│ • State restore│    │ • Multi-widget   │   │ • Media mgmt    │
│ • Score report │    │ • Shared attempts│   │ • Meta tags     │
└────────────────┘    │ • Aggregate score│   └─────────────────┘
                      └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  KEY DEPENDENCIES                                │
└─────────────────────────────────────────────────────────────────┘
  • jQuery 1.9.1+               → DOM manipulation, AJAX
  • jQuery UI 1.10.3+           → Drag/drop, interactions
  • jQuery UI Touch Punch       → Mobile touch support
  • AngularJS                   → Editor mode framework
  • SVG (Browser native)        → Line drawing
  • Font Awesome                → Icons (check, X, etc.)
  • Temml/MathJax (optional)    → Math formula rendering

┌─────────────────────────────────────────────────────────────────┐
│                     CSS ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────┘
  
  Base Styles (match-the-pairs-template.css)
         │
         ├─ Layout (.mtp-vertical, .mtp-horizontal)
         ├─ Content (.mtp-text-container, .mtp-image-container)
         ├─ Connections (.circle-wrap, .overlay-half)
         ├─ State (.pairConnected, .mtp-correct-pair)
         ├─ Feedback (.feedbackIcon, .mtp-alert)
         └─ Styles (mtpStyle1-4 variations)
                │
                └─ Theme Overrides (Asset Colors)
                       │
                       └─ Applied dynamically via JS

┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER COMPATIBILITY                         │
└─────────────────────────────────────────────────────────────────┘
  
  ✓ Modern Browsers (Chrome, Firefox, Safari, Edge)
  ✓ Legacy: IE10+ (with polyfills)
  ✓ Mobile Safari (iOS)
  ✓ Chrome Mobile (Android)
  ⚠ IE9 and below: Limited support (SVG issues)

┌─────────────────────────────────────────────────────────────────┐
│                  PERFORMANCE CONSIDERATIONS                      │
└─────────────────────────────────────────────────────────────────┘
  
  • SVG rendering: O(n) on resize (n = connected pairs)
  • Drag/drop: jQuery UI overhead (consider modern alternatives)
  • Shuffle: Fisher-Yates O(n) algorithm
  • State persistence: Synchronous localStorage writes
  • Image loading: Unoptimized (no lazy loading)
```

---

## 13. Error Handling

### Current Implementation

The component has **limited explicit error handling**. Error handling is primarily implicit through:

1. **jQuery try-catch wrappers** (implicit in jQuery library)
2. **Defensive checks** for element existence
3. **Early returns** to prevent invalid operations

### Identified Error Scenarios

#### 1. Missing Elements

```javascript
// Example from match-pair-line-preview1.js
$(".mtp-single .draggable").each(function () {
    let $form = $(this).parents('.template-editor-mtp');
    if ($form.length == 0) {
        $form = $(this).parents('#template-editor-mtp');  // Fallback
    }
    // If still not found, no error is thrown - silent failure
});
```

**Issue:** No error message if form element is not found. Operations silently fail.

#### 2. Invalid JSON Data

```javascript
// No validation in match-the-pairs-preview1.js
// Assumes well-formed JSON structure
$form.find('.sort-drag').find('input:hidden').each(function () {
    let inputVal = $(this).val();
    let mappedData = inputVal.split('_');  // Assumes underscore exists
    // No check if mappedData.length is correct
});
```

**Issue:** Malformed data (e.g., missing underscore) causes incorrect behavior without error reporting.

#### 3. Image Loading Failures

```javascript
// match-pair-line-preview1.js line 114-116
$(".mtpImage").load(function() {
    mtpResize();
});
```

**Issue:** No error handler for failed image loads. Broken images render with default browser broken image icon.

**Recommended:**
```javascript
$(".mtpImage")
    .on('load', function() {
        mtpResize();
    })
    .on('error', function() {
        console.error('Failed to load image:', $(this).attr('src'));
        $(this).attr('src', 'images/placeholder.png');  // Fallback
    });
```

#### 4. SCORM API Unavailable

```javascript
// Throughout preview1.js
if (typeof apiHandle != "undefined") {
    stateMainatainMTP($form);
}
```

**Issue:** If SCORM API fails after initialization, no fallback mechanism.

#### 5. SVG Rendering Errors

```javascript
// match-pair-line-preview1.js line 256-267
function parseSVG(s) {
    var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
    var frag = document.createDocumentFragment();
    while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
}
```

**Issue:** No try-catch. Malformed SVG string causes runtime error halting all line drawing.

### Error Handling Recommendations

```javascript
// Recommended wrapper for critical operations
function safeExecute(fn, context, errorMsg) {
    try {
        return fn.call(context);
    } catch (e) {
        console.error(errorMsg, e);
        // Optional: Display user-friendly error
        mtpAlert.show("Error", "", context.$form, null, 
                     "An error occurred. Please refresh and try again.");
        return null;
    }
}

// Usage example
safeExecute(function() {
    svgDrawLine(pair2Element, pair1Element, id, assetColor);
}, this, "Failed to draw connection line");
```

---

## 14. Known Issues

### High Priority

#### 1. Horizontal Mode Non-Functional
**Severity:** High  
**Location:** `match-the-pairs-directive.js` line 189  
**Description:** The horizontal variant (`mtp_horizontal`) setting exists but the UI implementation is incomplete. Selecting horizontal mode breaks the layout.

**Evidence:**
```javascript
scope.hsMlChange = function(state) {
    if (state === 'vertical') {
        scope.fieldData.listData[0].hpvpData.isSingleSelect = false;
    } else {
        scope.fieldData.listData[0].hpvpData.isSingleSelect = true;
        // Horizontal implementation incomplete
    }
}
```

**Workaround:** Hide horizontal option in settings panel.

#### 2. Line Redrawing Performance Issue
**Severity:** Medium  
**Location:** `match-pair-line-preview1.js` `mtpResize()`  
**Description:** On window resize, ALL lines are cleared and redrawn, causing visual flicker and performance degradation with many pairs.

**Impact:**
- Visible flicker on resize
- High CPU usage with 10 pairs (20 SVG path recalculations)
- Poor experience on low-end devices

**Recommendation:** Implement debounced resize handler:
```javascript
let resizeTimer;
$(window).on("resize", function (event) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        mtpResize();
    }, 150);  // Debounce 150ms
});
```

#### 3. Duplicate Connection Prevention Incomplete
**Severity:** Medium  
**Location:** `match-pair-line-preview1.js` line 57-58  
**Description:** Prevention logic exists but can be bypassed in certain rapid-click scenarios.

```javascript
drop: function(event, ui) {
    if($(this).attr('data-drop-identifier') || 
       $(ui.draggable).find("input").attr("value").includes("_")) return;
    // Race condition: rapid clicks can bypass this check
}
```

**Recommendation:** Add mutex lock during pair connection operation.

### Medium Priority

#### 4. Shuffle Randomness Issue
**Severity:** Low  
**Location:** `match-the-pairs-preview1.js` line 462  
**Description:** Fisher-Yates shuffle uses same random seed for both content blocks and dots, resulting in identical shuffle order.

**Issue:**
```javascript
let randomNumber = Math.random();  // Single random seed
// Used for both:
// 1. Shuffling .mtp-pair2-block elements
// 2. Shuffling .drop-wrap2 elements
// Result: No effective randomization
```

**Fix:**
```javascript
// Generate new random number for each shuffle
let randomNumber1 = Math.random();
// ... shuffle content blocks with randomNumber1
let randomNumber2 = Math.random();
// ... shuffle dots with randomNumber2
```

#### 5. Missing Accessibility Features
**Severity:** Medium  
**Location:** All files  
**Description:** 
- No ARIA labels for interactive elements
- No keyboard navigation support (Tab, Enter, Space)
- Screen reader does not announce pair connections
- No focus indicators on interactive elements

**Required Additions:**
```html
<!-- Example accessible markup -->
<div role="button" 
     tabindex="0" 
     aria-label="Connect element 1 from Column A" 
     class="circle-wrap draggable">
    ...
</div>
```

#### 6. Mobile Touch Precision
**Severity:** Low-Medium  
**Location:** Touch interaction on small screens  
**Description:** The circular connection dots (15px diameter) are too small for comfortable touch interaction on mobile devices (recommended: 44x44px touch target).

**Apple Guidelines:** Minimum 44x44pt  
**Android Guidelines:** Minimum 48x48dp

**Current:** ~15x15px

#### 7. SVG Path ID Collision
**Severity:** Low  
**Location:** `match-pair-line-preview1.js` line 273  
**Description:** Path IDs use simple pattern `pathid="drop-X"`, which can collide if multiple MTP components exist on same page.

**Fix:** Use component-unique prefix:
```javascript
let uniqueId = $form.parents('.customClass').attr('data-saved-index');
let pathId = 'mtp-' + uniqueId + '-drop-' + targetId;
```

### Low Priority

#### 8. Math Formula Rendering Timing
**Severity:** Low  
**Location:** Content with math expressions  
**Description:** If math formulas render after line drawing, line positions may be incorrect (formula size affects element dimensions).

**Recommendation:** Delay line drawing until MathJax/Temml rendering complete:
```javascript
if (window.MathJax) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]], function() {
        mtpResize();
    });
}
```

#### 9. Image Dimension Sync Issue
**Severity:** Low  
**Location:** `match-the-pairs-directive.js` lines 668-694  
**Description:** Custom image dimensions apply to ALL pairs even when set for individual pairs.

**Expected:** Pair-specific dimensions  
**Actual:** Global application across all pairs

#### 10. Delete Button Always Visible
**Severity:** Low  
**Location:** `match-the-pairs.html` line 92  
**Description:** Delete button visible even when disabled (with 2 pairs only). Should be hidden for better UX.

**Fix:**
```html
<div width="1%" class="mtp-pair-delete-container" 
     ng-if="fieldData.listData[0].hpvpData.pairedList.length > 2">
    <a href="#" class="mtp-delete" ng-click="removePairClick($index)">
        <i class="icon-Delete"></i>
    </a>
</div>
```

---

## 15. Recommendations for Improvement

### Architecture & Code Quality

#### 1. Migrate from jQuery to Modern Framework
**Priority:** High  
**Effort:** High  
**Benefit:** Improved performance, maintainability, smaller bundle size

**Rationale:**
- jQuery UI is deprecated (last major release 2016)
- Modern browsers have native drag-and-drop API
- React/Vue provide better state management
- Reduce dependency footprint (~90KB jQuery + jQuery UI)

**Suggested Migration:**
- React DnD or React Beautiful DnD
- Vue Draggable
- Native HTML5 Drag and Drop API

#### 2. Separate Concerns: MVC Refactor
**Priority:** Medium  
**Effort:** High  
**Benefit:** Better testability, code reuse, maintenance

**Current Issue:** Business logic mixed with UI manipulation throughout preview scripts.

**Recommended Structure:**
```
models/
  MatchThePairsModel.js       // Data structure, validation
controllers/
  MatchThePairsController.js  // Business logic, scoring
views/
  MatchThePairsView.js        // DOM manipulation, rendering
services/
  MatchThePairsService.js     // SCORM, API interactions
utils/
  svgDrawingUtil.js           // SVG line drawing utilities
  shuffleUtil.js              // Shuffle algorithms
```

#### 3. TypeScript Migration
**Priority:** Medium  
**Effort:** Medium  
**Benefit:** Type safety, better IDE support, fewer runtime errors

**Example Type Definitions:**
```typescript
interface Pair {
    pairInfo: {
        pair1: PairElement;
        pair2: PairElement;
        feedbackinline: string;
    }
}

interface PairElement {
    identifier: number;
    infoData: {
        type: 'Text' | 'Image';
        text: string;
    };
    media: MediaInfo;
    isImageEnable: 'pair1_text' | 'pair1_image' | 'pair2_text' | 'pair2_image';
}

interface Settings {
    maxTries: string;
    isVerticalMtp: 'mtp_vertical' | 'mtp_horizontal';
    activeStyle: 'mtpStyle1' | 'mtpStyle2' | 'mtpStyle3' | 'mtpStyle4';
    // ... etc.
}
```

#### 4. Implement Comprehensive Unit Tests
**Priority:** High  
**Effort:** Medium  
**Benefit:** Regression prevention, refactoring confidence

**Test Coverage Goals:**
- Component initialization: 90%
- Pair connection logic: 100%
- Scoring algorithm: 100%
- State persistence: 90%
- Line drawing: 80%

**Suggested Framework:** Jest + Testing Library

**Sample Tests:**
```javascript
describe('Match The Pairs - Scoring', () => {
    test('should return 100 when all pairs correct', () => {
        const result = calculateScore(allCorrectPairs);
        expect(result.score).toBe(100);
        expect(result.passed).toBe(true);
    });
    
    test('should return 0 when no pairs correct', () => {
        const result = calculateScore(allIncorrectPairs);
        expect(result.score).toBe(0);
        expect(result.passed).toBe(false);
    });
    
    test('should return 0 for partial correctness', () => {
        const result = calculateScore(partialCorrectPairs);
        expect(result.score).toBe(0);  // All-or-nothing
        expect(result.passed).toBe(false);
    });
});
```

### User Experience

#### 5. Enhanced Visual Feedback
**Priority:** Medium  
**Effort:** Low  
**Benefit:** Better user understanding, reduced confusion

**Improvements:**
- **Connection Preview:** Show temporary line while hovering over target
- **Animated Transitions:** Smooth line drawing animation
- **Color Coding:** Use consistent colors (green=correct, red=incorrect, blue=in-progress)
- **Haptic Feedback:** Vibration on mobile when pair connected
- **Audio Cues:** Optional sound on connection, submit, correct/incorrect

**Example:**
```javascript
function svgDrawLineAnimated(eTarget, eSource, id, color, duration = 300) {
    let path = createSVGPath(eTarget, eSource, id, color);
    let length = path.getTotalLength();
    
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    // Animate
    path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
    path.style.strokeDashoffset = '0';
}
```

#### 6. Implement Partial Credit Option
**Priority:** Medium  
**Effort:** Medium  
**Benefit:** More flexible assessment, better learner motivation

**Current:** All-or-nothing scoring (must get 100% for credit)  
**Proposed:** Configurable partial credit option

**Settings Addition:**
```json
"settings": {
    "scoringMethod": "all-or-nothing",  // or "partial-credit"
    "partialCreditPercentage": true,    // true = %, false = binary
}
```

**Scoring Logic:**
```javascript
if (settings.scoringMethod === 'partial-credit') {
    score = (correctPairs / totalPairs) * 100;
    passed = (score >= passingThreshold);  // e.g., 70%
} else {
    // Current all-or-nothing logic
    score = (correctPairs === totalPairs) ? 100 : 0;
    passed = (score === 100);
}
```

#### 7. Accessibility Enhancements
**Priority:** High  
**Effort:** Medium  
**Benefit:** WCAG 2.1 AA compliance, inclusive design

**Required Additions:**

1. **Keyboard Navigation:**
```javascript
// Tab through elements
$('.draggable').attr('tabindex', '0').on('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        // Mark as selected
        selectPair($(this));
    }
});

// Arrow keys to navigate between pairs
$(document).on('keydown', function(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        navigatePairs(e.key);
    }
});
```

2. **Screen Reader Support:**
```html
<div role="application" aria-label="Match The Pairs Activity">
    <div role="region" aria-label="Column A">
        <div role="button" 
             aria-label="Element 1: Capital of France" 
             aria-describedby="instructions">
            Paris
        </div>
    </div>
</div>
```

3. **Focus Management:**
```css
.draggable:focus,
.droppable:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
}
```

4. **Live Regions:**
```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
    <!-- Dynamically announce: "Paris connected to France" -->
</div>
```

#### 8. Responsive Mobile Optimization
**Priority:** Medium  
**Effort:** Medium  
**Benefit:** Better mobile experience

**Improvements:**
- Larger touch targets (44x44px minimum)
- Simplified layout for small screens (stack columns vertically)
- Swipe gestures as alternative to drag-drop
- Optimized for landscape/portrait orientation

**Example:**
```css
@media (max-width: 768px) {
    .mtp-vertical .MTPpair {
        flex-direction: column;
    }
    
    .circle-wrap {
        min-width: 44px;
        min-height: 44px;
    }
    
    .mtp-pair1, .mtp-pair2 {
        width: 100%;
        margin-bottom: 10px;
    }
}
```

### Performance

#### 9. Optimize Line Redrawing
**Priority:** Medium  
**Effort:** Low  
**Benefit:** Smoother animations, better performance

**Current Issue:** Clears ALL lines on every resize, even for lines that haven't moved.

**Optimization:**
```javascript
function mtpResizeOptimized() {
    $('.mtp.mtp-single .draggable').each(function () {
        let drag = $(this);
        let dragId = $(this).attr("data-drag-identifier");
        
        $form.find('.droppable').each(function () {
            let drop = $(this);
            let dropId = $(this).attr("data-drop-identifier");
            
            if (dragId == dropId) {
                let pathId = dragId + '_' + dropId;
                let existingPath = $form.find('path[pathid="' + pathId + '"]');
                
                // Update path instead of recreating
                if (existingPath.length) {
                    updateSVGPath(existingPath, drop, drag);
                } else {
                    svgDrawLine(drop, drag, pathId, assetColor);
                }
            }
        });
    });
}

function updateSVGPath(path, target, source) {
    // Recalculate coordinates
    let originX = source.offset().left + 7 - svg.offset().left;
    let originY = source.offset().top + 7 - svg.offset().top;
    let endingX = target.offset().left + 22 - svg.offset().left;
    let endingY = target.offset().top + 22 - svg.offset().top;
    
    // Update path d attribute
    let newPath = "M" + originX + " " + originY + " L" + endingX + " " + endingY;
    path.attr('d', newPath);
}
```

#### 10. Lazy Loading for Images
**Priority:** Low  
**Effort:** Low  
**Benefit:** Faster initial load, reduced bandwidth

**Implementation:**
```html
<img class="mtpImage" 
     data-src="images/large-image.jpg" 
     alt="Element 1"
     loading="lazy">
```

```javascript
// Intersection Observer for lazy loading
let imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

$('.mtpImage').each(function() {
    imageObserver.observe(this);
});
```

### Features

#### 11. Analytics & Learning Insights
**Priority:** Low  
**Effort:** Medium  
**Benefit:** Data-driven content improvement

**Tracked Metrics:**
- Average attempts per learner
- Most frequently incorrect pairs (identify confusing content)
- Time spent on activity
- Interaction patterns (drag vs. click preference)
- Device types and success rates

**Implementation:**
```javascript
let analytics = {
    startTime: new Date(),
    interactions: [],
    deviceType: detectDeviceType(),
    componentId: componentId
};

function trackInteraction(type, data) {
    analytics.interactions.push({
        timestamp: new Date() - analytics.startTime,
        type: type,  // 'connect', 'disconnect', 'submit', 'tryagain', 'showme'
        data: data
    });
    
    // Send to analytics endpoint
    if (typeof sendAnalytics === 'function') {
        sendAnalytics(analytics);
    }
}
```

#### 12. Hint System
**Priority:** Low  
**Effort:** Low  
**Benefit:** Scaffolded learning, reduced frustration

**Feature:** Progressive hints that guide learners without revealing full answer.

**Example:**
```json
"hints": [
    {
        "level": 1,
        "text": "Look for items that share a common category.",
        "costAttempts": 0
    },
    {
        "level": 2,
        "text": "Paris is the capital of which country?",
        "costAttempts": 1,
        "highlightPairs": [1]  // Highlight specific pair
    },
    {
        "level": 3,
        "text": "Connect Paris to France.",
        "costAttempts": 1,
        "revealPair": 1  // Reveal one pair
    }
]
```

#### 13. Bulk Import/Export
**Priority:** Low  
**Effort:** Low  
**Benefit:** Faster content creation, reusability

**Feature:** Import pairs from CSV, spreadsheet, or JSON.

**CSV Format:**
```csv
Column A,Column B,Feedback
Paris,France,Paris indeed is the capital of France
London,United Kingdom,London is the capital of UK
Berlin,Germany,Berlin has been the capital since 1990
```

**Import Function:**
```javascript
function importPairsFromCSV(csvData) {
    let pairs = parseCSV(csvData);
    pairs.forEach((pair, index) => {
        addPair({
            identifier: index + 1,
            pair1: { infoData: { text: pair.columnA } },
            pair2: { infoData: { text: pair.columnB } },
            feedbackinline: pair.feedback
        });
    });
}
```

---

## Conclusion

The Match The Pairs component is a robust, feature-rich assessment widget with solid core functionality. Key strengths include:

- ✅ Flexible content types (text, images, mixed)
- ✅ Comprehensive feedback system
- ✅ SCORM integration
- ✅ Visual style variants
- ✅ Mobile touch support

Primary areas for improvement:

- 🔧 Code modernization (migrate from jQuery)
- 🔧 Accessibility enhancements (WCAG compliance)
- 🔧 Error handling and validation
- 🔧 Performance optimization (line redrawing)
- 🔧 Test coverage

With the recommended improvements, this component can become a best-in-class interactive assessment tool suitable for modern e-learning platforms.
