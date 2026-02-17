# FIB with Image Component - Technical Documentation

## Table of Contents
1. [Component Overview](#component-overview)
2. [Architecture](#architecture)
3. [Component Types & Variants](#component-types--variants)
4. [Data Structure](#data-structure)
5. [Core Features](#core-features)
6. [Editor Mode](#editor-mode)
7. [Preview/Reader Mode](#previewreader-mode)
8. [Data Flow](#data-flow)
9. [Architectural Diagram](#architectural-diagram)
10. [Offline/Package Behavior](#offlinepackage-behavior)
11. [Error Handling](#error-handling)
12. [Known Issues](#known-issues)
13. [Recommendations](#recommendations)

---

## Component Overview

### Purpose
The **FIB (Fill in the Blanks) with Image** component is an interactive assessment widget that allows authors to create fill-in-the-blank exercises with optional image support. Students can answer questions through multiple input methods including text input, dropdown selections, or drag-and-drop interactions.

### Key Characteristics
- **Component Type**: Assessment Widget
- **Identifier**: `fill-in-the-blank`
- **Data Type**: `objective`
- **Template Name**: `Fill in the Blank` / `FIB with Image`
- **Icon Class**: `icon-Fill-in-the-blank` / `icon-Fill-in-the-blank-image`
- **Supported Modes**: Editor, Preview, Reader
- **Assessment Type**: Auto-graded

### File Structure
```
templates/fib/
├── fib.html                          # Main template HTML
├── fib-settings-panel.html           # Settings panel UI
├── default/
│   └── fib.json                      # Default configuration
├── scripts/
│   ├── fib-template-directive.js     # Editor mode directive (1942 lines)
│   └── fib-template-preview1.js      # Preview/Reader mode logic (2082 lines)
└── styles/
    ├── fib-template.css              # Component styles (2286 lines)
    └── images/                       # Style thumbnails
```

---

## Architecture

### Technology Stack
- **Framework**: AngularJS 1.x
- **UI Library**: Bootstrap 3.x
- **jQuery**: 1.9.1+
- **jQuery UI**: Touch-punch enabled for mobile support
- **Math Support**: MathQuill, MathLive (for LaTeX equations)
- **Additional Libraries**: 
  - Custom scrollbar (jquery.mCustomScrollbar.js)
  - Drag & drop (jQuery UI Draggable/Droppable)
  - Image cropper
  - Colorbox

### Component Hierarchy

```
AngularJS App
│
├── Main Controller (ngController.js)
│   ├── Manages global state
│   ├── Handles image uploads
│   ├── Manages undo/redo
│   └── Coordinates settings panel
│
└── FIB Template Directive (fibTemplate)
    ├── Editor Mode Logic
    │   ├── Blank insertion
    │   ├── Sentence management
    │   ├── Image handling
    │   ├── Distractor management
    │   └── Custom keyboard support
    │
    └── Preview Mode Logic
        ├── Answer validation
        ├── Feedback display
        ├── State management
        ├── Drag & drop handling
        └── LaTeX rendering
```

### Key Directives & Services

#### Main Directive
- **`fibTemplate`**: Core directive managing both editor and initialization logic
  - Scope isolation: No
  - Replace: false
  - Restrict: EA (Element/Attribute)

#### Supporting Directives
- **`commonbuttons`**: Submit, Show Answer, Reset, Try Again buttons
- **`uploadfiles`**: Image upload handler
- **`add-hover`**: Hover effects for editor elements
- **`add-click`**: Click handling for editable sections
- **`change-fonts`**: Font style management
- **`fibstyles`**: Style application logic

---

## Component Types & Variants

### 1. FIB Type Variants

The component supports three distinct interaction types:

#### A. **Text Input Type** (`without-option`)
- **Default Behavior**: 
  - Students type answers directly into input fields
  - Supports multiple correct answers separated by pipe (`|`)
  - Case-sensitive option available
  - Example: `answer1|answer2|answer3`

- **Use Case**: Open-ended answers, vocabulary exercises
- **Validation**: String matching with normalization
- **Settings**:
  ```json
  {
    "isWithOption": "without-option",
    "Case_SensitiveCheckbox": false
  }
  ```

#### B. **Dropdown Type** (`with-option`)
- **Default Behavior**:
  - Students select from predefined options
  - Dropdown menu with 2+ choices
  - Single correct answer per blank
  - Visual feedback with checkmarks

- **Use Case**: Multiple choice fill-ins, structured assessments
- **Validation**: Index-based matching
- **Structure**:
  ```javascript
  "choiceList": [
    {
      "choice": {
        "identifier": "A_1",
        "choiceText": "Option text"
      }
    }
  ],
  "correctIndex": 0
  ```

#### C. **Drag & Drop Type** (`drag-and-drop`)
- **Default Behavior**:
  - Students drag answer items into blank spaces
  - Supports both text and image draggables
  - Visual drop zones with borders
  - Distractors supported

- **Use Case**: Interactive matching, visual learning
- **Validation**: ID-based matching
- **Two Sub-variants**:
  1. **Text-based drag & drop**: `.sort-with-Text`
  2. **Image-based drag & drop**: `.sort-with-Image`

### 2. Enhanced Variant: FIB with Image

When `fibWithImage: true`, the component enables:

#### Additional Features:
1. **Paragraph Section with Media**
   - Optional image above/below paragraph text
   - Supports top/bottom positioning
   - Image caption support
   - Alt text for accessibility

2. **Per-Sentence Media**
   - Each sentence can have its own image
   - Left/right positioning options
   - Independent caption per image
   - Upload/Replace functionality

3. **Style Restriction**
   - Forces `fibcard-style7` style
   - Locks style selector to image-compatible layout
   - Disables other style options

#### Configuration:
```json
{
  "settings": {
    "fibWithImage": true,
    "selected_style": "fibcard-style7",
    "isParagraphVisible": true
  },
  "TemplateData": {
    "paragraphData": {
      "showMedia": true,
      "mediaType": "image",
      "imageUrl": "path/to/image.jpg",
      "mediaPosition": "top",
      "optionalcaption": "Caption text"
    },
    "fibInfo": [{
      "showMedia": true,
      "imageUrl": "path/to/sentence-image.jpg",
      "mediaPosition": "left"
    }]
  }
}
```

### 3. Style Variants

The component supports 7 predefined card styles:

| Style | Class | Image Support | Description |
|-------|-------|---------------|-------------|
| Style 1 | `fibcard-style1` | No | Default clean layout |
| Style 2 | `fibcard-style2` | No | Alternate color scheme |
| Style 3 | `fibcard-style3` | No | Bordered variant |
| Style 4 | `fibcard-style4` | No | Shaded background |
| Style 5 | `fibcard-style5` | No | Minimal design |
| Style 6 | `fibcard-style6` | No | Contrast variant |
| Style 7 | `fibcard-style7` | **Yes** | Image-enabled layout |

### 4. Special Features Matrix

| Feature | Text Input | Dropdown | Drag & Drop |
|---------|-----------|----------|-------------|
| Multiple Answers | ✅ (pipe-separated) | ❌ | ❌ |
| Case Sensitive | ✅ | N/A | N/A |
| Shuffle Options | ❌ | ✅ | ✅ |
| Distractors | ❌ | ❌ | ✅ |
| Image Answers | ❌ | ❌ | ✅ |
| LaTeX Support | ✅ | ✅ | ✅ |
| Custom Keyboard | ✅ | ❌ | ❌ |

---

## Data Structure

### Complete JSON Schema

```json
{
  "identifier": "fill-in-the-blank",
  "question": "Question 1",
  "secondaryQuestion": "Part A",
  
  "settings": {
    "fibWithImage": false,
    "labelType": "primary",
    "maxTries": "3",
    "isReset": "false",
    "isShowme": "true",
    "templateName": "Fill in the Blank",
    "isWithOption": "with-option",
    "shuftleChoiceCheckbox": false,
    "Case_SensitiveCheckbox": false,
    "allowRestart": false,
    "isHeaderVisible": true,
    "isInstructionVisible": true,
    "isParagraphVisible": true,
    "questionNoField": false,
    "isLabelType": false,
    "selected_style": "fibcard-style1",
    "styleType": "card-style",
    "outline": "outline",
    "outlineBgColor": "1px solid #ccc",
    "Appearance": "rgb(17,62,154,0.5)",
    "BgAppearance": "",
    "genericFeedbackCheckbox": false,
    "generic_correct_ans_text": "",
    "generic_incorrect_ans_text": "",
    "addFeedback": false,
    "isCustomKeyboardEnable": false,
    "userSubjectLang": "",
    "showFIBdistractor": true,
    "distractor": [],
    "dimensionInfo": [],
    "blanks": "1",
    "style_tab": [/* 7 style configurations */]
  },
  
  "style": {
    "selected_style": "fibcard-style1"
  },
  
  "TemplateData": {
    "pageId": "",
    "templateId": "",
    "templateName": "fill-in-the-blank",
    "adaptive": "false",
    "isAssessmentPage": "true",
    "identifier": "FIB_TEXT",
    "title": "Fill-in-the-Blank",
    "introduction": "",
    "instruction": "",
    
    "paragraphData": {
      "paragraph": "",
      "showMedia": false,
      "mediaType": "image",
      "imageUrl": "images/image.jpg",
      "imageUploadOrReplace": "Upload",
      "optionalcaption": "",
      "mediaPosition": "top",
      "altText": ""
    },
    
    "fibInfo": [
      {
        "id": "fib1",
        "statement": "",
        "itemInstruction": "Enter Answer",
        "showMedia": false,
        "mediaType": "image",
        "imageUrl": "images/image.jpg",
        "optionalcaption": "",
        "caption": "",
        "mediaPosition": "left",
        "altText": "",
        "responseList": [
          {
            "responseId": "blankArea1",
            "mainIndex": 1,
            "responseIndex": 0,
            "datadragwidth": "auto",
            "choiceList": [
              {
                "choice": {
                  "identifier": "A_1",
                  "choiceText": "",
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
                      "imageUrl": "images/rsz_2image.jpg",
                      "imageUploadOrReplace": "Upload",
                      "imageName": "Image.jpg",
                      "imageDimension": "",
                      "metaTags": []
                    }
                  }
                }
              }
            ],
            "correctChoice": [],
            "correctIndex": 0
          }
        ]
      }
    ],
    
    "feedback": "",
    "hint": "",
    "example": {
      "text": "",
      "media": {
        "type": "IMAGE",
        "id": "",
        "src": "",
        "altText": "",
        "captionText": ""
      }
    }
  },
  
  "custom": {
    "css": ["css/templates/fib-template.css"],
    "javascript": [
      "js/jquery-ui.min.js",
      "js/jquery-ui-1.10.3.min.js",
      "js/jquery.ui.touch-punch.js",
      "js/jquery.mCustomScrollbar.js",
      "js/templates/fib-template-preview1.js"
    ]
  }
}
```

### Key Data Elements

#### 1. Blank/Response Structure
Each blank in a sentence is represented by a `responseList` item:

```javascript
{
  "responseId": "blankArea1",      // Unique identifier
  "mainIndex": 1,                  // Global blank index
  "responseIndex": 0,              // Index within sentence
  "datadragwidth": "auto",         // Resizable width
  "choiceList": [],                // Array of answer choices
  "correctChoice": [],             // Correct answers (drag & drop)
  "correctIndex": 0                // Correct answer index (dropdown)
}
```

#### 2. Sentence Statement Structure
The `statement` field contains HTML with embedded blanks:

**Text Input Example:**
```html
The capital of France is <div class="js-form-row fib-without-option" inarrayindex="0" uniqinputnumber="1">
  <div class="form-control-wrap drag">
    <div contenteditable="true" class="inputbox-selected FIB_style_inputbox js-input" 
         data-correct-answer="encoded_answer">
    </div>
  </div>
</div>.
```

**Dropdown Example:**
```html
Select the <div class="dropdown fib-with-option js-form-row" inarrayindex="0">
  <div class="btn btn-default dropdownbtn">
    <span class="chosenAns">Select Answer</span>
    <span class="icon-Down dropdown-arrow"></span>
  </div>
  <ul class="dropdown-menu" data-correctoption-index="0">
    <li><span class="fib-add-delete icon-Check"></span>
        <span class="fib-option-text">Option 1</span></li>
  </ul>
</div>.
```

#### 3. Image Media Structure
```javascript
{
  "showMedia": true,
  "mediaType": "image",
  "imageUrl": "assets/image_library/filename.jpg",
  "imageUploadOrReplace": "Replace",
  "mediaPosition": "left",          // or "right", "top", "bottom"
  "altText": "Description",
  "optionalcaption": "Image caption",
  "caption": "Caption text"
}
```

#### 4. Distractor Structure (Drag & Drop only)
```javascript
"distractor": [
  {
    "timestamp": "1234567890",
    "lableText": "Distractor text"
  }
]
```

---

## Core Features

### 1. Blank Management

#### Insert Blank
- **Location**: `fib-template-directive.js` lines 677-900
- **Function**: `scope.insertBlank(e)`
- **Behavior**:
  - Inserts blank at cursor position
  - Maximum 20 blanks per sentence
  - Auto-generates UUID for tracking
  - Different HTML structures per type
  - Updates JSON model automatically
  - Supports undo/redo

**Implementation:**
```javascript
scope.insertBlank = function(e) {
    var uuid = scope.guidFIb();
    var rows = element.find('.form-row');
    var rowNo = rows.index($('#target').parents('.form-row'));
    var blankinputindex = scope.fieldData.settings.blanks;
    
    // Different structures for each type
    if (scope.fieldData.settings.isWithOption === 'with-option') {
        // Dropdown HTML generation
    } else if (scope.fieldData.settings.isWithOption === 'drag-and-drop') {
        // Drag & drop HTML generation
    } else {
        // Text input HTML generation
    }
}
```

#### Delete Blank
- **Function**: `scope.deleteBlank(index)`
- **Constraints**: Cannot delete if it's the last blank with content
- **Cleanup**: Removes from JSON, re-indexes remaining blanks

### 2. Sentence Management

#### Add Sentence
- **Maximum**: 20 sentences per component
- **Function**: `scope.addSentenceClick(event)`
- **Default Structure**:
```javascript
{
  "id": "fib{n}",
  "statement": "",
  "itemInstruction": "Enter Answer",
  "showMedia": false,
  "responseList": []
}
```

#### Remove Sentence
- **Minimum**: 1 sentence required
- **Function**: `scope.removeSentenceClick(index)`
- **Cleanup**: Re-indexes remaining sentences, updates DOM

### 3. Answer Options (Dropdown Type)

#### Add Option
- **Location**: Dropdown menu bottom button
- **Maximum**: 20 options per dropdown
- **Auto-adds**: New choice to `choiceList`

#### Delete Option
- **Minimum**: 2 options required
- **Visual**: × button per option
- **Updates**: Correct index if necessary

#### Mark Correct
- **Interaction**: Click checkmark icon
- **Stores**: Index in `correctIndex` and `data-correctoption-index`
- **Visual**: Blue checkmark for correct answer

### 4. Drag & Drop Features

#### Distractors
- **Enable**: `showFIBdistractor: true`
- **Button**: "Insert Blank" dropdown → "Add Distractor"
- **Stored**: Separate `distractor` array
- **Rendering**: Below sentence area, draggable items
- **Limit**: No explicit limit mentioned

#### Draggable Setup
```javascript
$(".fib .preview-sort .inputbox-selected.draggable-div").draggable({
    cursor: "move",
    revert: "invalid",
    helper: 'clone',
    appendTo: 'body',
    start: function(event, ui) {
        var width = $(this).width() + 20;
        ui.helper[0].style.width = width + "px";
    }
});
```

#### Droppable Setup
```javascript
$('.sort-select').droppable({
    accept: '.draggable-div',
    hoverClass: 'ui-state-hover',
    drop: function(event, ui) {
        // Clone element into drop zone
        // Disable original draggable
        // Mark as "added" and "dropped"
    }
});
```

### 5. Image Handling

#### Upload Flow
1. **Trigger**: Click on image placeholder
2. **Location Tracking**: `fibMediaLoc` variable
   - `'Paragraph'`: Main paragraph image
   - `'Sentence'`: Per-sentence image
   - `'Blank'`: Drag & drop image answers
3. **Main Controller**: `ngcontroller.js` handles upload
4. **Update**: Updates `imageUrl` in appropriate data location

#### Image Settings (FIB with Image)
- **Paragraph Media**:
  - Checkbox: "Add Media"
  - Position: Top/Bottom radio buttons
  - Upload button with preview
- **Sentence Media**:
  - Per-sentence checkbox in settings
  - Position: Left/Right icons
  - Independent captions

### 6. Custom Keyboard Support

#### Purpose
Support special characters for language learning (French, Spanish, German, etc.)

#### Configuration
```json
{
  "isCustomKeyboardEnable": true,
  "userSubjectLang": "FRA"  // or "ESP", "GER"
}
```

#### UI Elements
- **Button**: "+ Add Special Characters"
- **Keyboard Panel**: Displays character grid
- **Insertion**: `document.execCommand('insertText', false, character)`
- **Visibility**: Only for Text Input type

### 7. Mathematical Expressions

#### Supported Formats
1. **MathQuill**: Legacy equation editor
   - Class: `.auth-equation-holder`
   - Attribute: `data-equation-latex`

2. **MathLive**: Modern math input
   - Class: `.auth-mathfield-holder`
   - Web component: `<math-field>`
   - Virtual keyboard support

#### Initialization (Editor)
```javascript
$(element).find(".auth-mathfield-holder").each(function(i) {
    let mathData = $(this).attr('data-equation-latex');
    let mf = $(this).find('math-field')[0];
    if (mf && typeof mf.setValue === "function") {
        mf.setValue(mathData);
        mf.mathModeSpace = '\\:';
    }
});
```

#### Preview Mode Handling
```javascript
// Extract LaTeX from HTML for validation
function extractLatexFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mathField = doc.querySelector('math-field');
    return mathField ? mathField.textContent : null;
}
```

---

## Editor Mode

### User Interface Components

#### 1. Header Section
- **Visibility Toggle**: `isHeaderVisible` setting
- **Default Text**: "Header Text"
- **Editable**: Contenteditable div
- **Model**: `fieldData.TemplateData.introduction`
- **Styling**: `.template-header`, font customization

#### 2. Instruction Section
- **Visibility Toggle**: `isInstructionVisible` setting
- **Default Placeholder**: 
  - Standard: "Fill in the blanks"
  - With Image: "Fill in the blanks with Images"
- **Model**: `fieldData.TemplateData.instruction`
- **Color Override**: `instructionTextColor` setting

#### 3. Label Type (Question Number)
- **Options**: Primary / Secondary
- **Standard FIB**: `isLabelType` checkbox
- **FIB with Image**: `questionNoField` checkbox
- **Models**: 
  - Primary: `fieldData.question`
  - Secondary: `fieldData.secondaryQuestion`

#### 4. Paragraph Section (FIB with Image only)
- **Visibility**: `isParagraphVisible` checkbox
- **Components**:
  - Paragraph text (contenteditable)
  - Optional media section
  - Media position controls
  - Image upload button
  - Caption field

#### 5. Sentence Section
- **Container**: `.fib-questions`
- **Each Sentence**:
  - Label: "Sentence"
  - Contenteditable text area
  - Delete button (disabled if only 1 sentence)
  - Insert Blank button
  - Optional media (FIB with Image)
- **Add Sentence Button**: Bottom of section (max 20)

#### 6. Distractor Area (Drag & Drop only)
- **Visibility**: When `showFIBdistractor: true` and type is `drag-and-drop`
- **Display**: Below sentences, above action buttons
- **Editable**: Each distractor has contenteditable text
- **Delete**: × icon per distractor

#### 7. Action Buttons Preview
- **Display**: Non-functional visual preview
- **Controlled by**: `commonbuttons` directive
- **Buttons**: Submit, Show Answer, Reset, Try Again

#### 8. Custom Keyboard (if enabled)
- **Button**: "+ Add Special Characters"
- **Panel**: Character grid
- **Behavior**: Toggles visibility, inserts characters

### Editing Interactions

#### Click Handlers
- **Blank Click**: 
  - **Dropdown**: Opens settings panel with blank options
  - **Text Input**: Shows blank settings
  - **Drag & Drop**: Shows drag & drop configuration

- **Sentence Click**: Opens settings panel with sentence-specific options

- **Image Click**: 
  - Opens image upload modal
  - Shows image dimension settings
  - Allows replacement

- **Header/Instruction Click**: Closes setting panels, focuses element

#### Sentence Statement Editing
- **Contenteditable**: Direct text editing
- **Paste Prevention**: Custom paste handler
- **Enter Key**: Triggers blur, prevents newline
- **Insert Blank**: Cursor position insertion

#### Blank Configuration

**Dropdown Type Settings:**
- Add/Delete Options
- Mark Correct Answer (checkmark)
- Edit option text (contenteditable)
- Delete blank button

**Text Input Settings:**
- Correct answer(s) input
- Hint text (pipes for multiple answers)
- Delete blank button

**Drag & Drop Settings:**
- Text or Image mode toggle
- Correct answer configuration
- Distractor management
- Delete blank button

### Settings Panel Integration

**Location**: Right panel (`fib-settings-panel.html`)

**Sections**:

1. **Select Option Type**
   - Radio buttons: Dropdown, Text, Drag & Drop
   - Changes `isWithOption` setting
   - Triggers rebuild of all blanks via `fibradioChange()`

2. **Visibility Controls**
   - Show Header
   - Show Instruction
   - Show Label Type
   - Show Paragraph (FIB with Image only)

3. **Label Type Selection** (if enabled)
   - Radio: Primary / Secondary

4. **Paragraph Media Settings** (FIB with Image)
   - Add Media checkbox
   - Media type: Image / Audio / Video (only Image active)
   - Position: Top / Bottom
   - Upload button
   - Alt text input
   - Optional caption checkbox

5. **Sentence Media Settings** (FIB with Image)
   - Per-sentence "Add Media" checkbox
   - Position: Left / Right
   - Upload button
   - Caption checkbox

6. **Assessment Settings**
   - Max attempts dropdown (1-5)
   - Shuffle choices checkbox
   - Case sensitive checkbox (Text Input only)
   - Show distractor checkbox (Drag & Drop only)
   - Generic feedback checkbox
   - Allow restart checkbox
   - Show me checkbox

7. **Custom Keyboard**
   - Enable custom keyboard checkbox
   - Language selection (auto-populated)

8. **Appearance Settings** (accessed via style tab)
   - Outline style
   - Border color
   - Background color
   - Accent color

### Real-time Updates

#### Model-View Binding
- **AngularJS Two-way Binding**: Changes in settings immediately reflect in template
- **Safe Apply**: `con.safeApply()` prevents digest errors
- **Enable Save**: `enableDisableSaveButton(true)` marks content as modified

#### Dynamic Blank Rendering
- **Function**: `scope.loadBlanks()`
- **Trigger**: After sentence deletion, type change, blank deletion
- **Process**:
  1. Parse `statement` HTML from JSON
  2. Extract blank placeholders
  3. Build appropriate HTML structure per type
  4. Compile with AngularJS
  5. Replace in DOM
  6. Re-initialize draggable/resizable

#### Resizable Blanks
- **Library**: jQuery UI Resizable
- **Handles**: East and West (`'w, e'`)
- **Storage**: Width saved in `datadragwidth`
- **Max Width**: Container width - 140px

---

## Preview/Reader Mode

### Initialization (fib-template-preview1.js)

#### On Load
```javascript
$(function() {
    // Set contenteditable for text inputs
    $('.fib[data-fib-type="without-option"] .inputbox-selected').attr('contenteditable', true);
    
    // Hide custom keyboard in dropdown/drag & drop
    $('.fib[data-fib-type="with-option"] .customKeybord-cantsiner').css('display','none');
    
    // Initialize drag & drop classes
    $('.fib.drag-and-drop .preview-drop').addClass('inputbox-selected js-input');
    
    // Hide editor-only elements
    $('.deleteBlank').addClass('hide');
    $('.form-row .fib-delete-sentence').addClass('hide');
    $('.ansTextHint').addClass('hide');
    
    // Initialize MathLive styles
    if (!$('#mathLiveFibStyles').length) {
        $('head').append(/* MathLive CSS */);
    }
    
    // XML escaping for validation
    $(".js-form-row.fib-without-option div.inputbox-selected[data-correct-answer]").each(function() {
        var valueText = $(this).attr("data-correct-answer")
            .replace(/>/g, "&gt;").replace(/</g, "&lt;");
        $(this).attr("data-correct-answer", valueText);
    });
    
    // Hide all dropdowns initially
    $('.dropdown-menu, .icon-Up').css('display', 'none');
});
```

### Student Interactions

#### 1. Text Input Type

**Input Handler:**
```javascript
$('.fib .form-row div.inputbox-selected').on('keyup', function(event) {
    $form.find('.submit-btn').removeClass('disabled');
    $form.find('.reset').removeClass('disabled');
    
    // Check if any input has value
    var isFibAttempted = false;
    $form.find('div.inputbox-selected').each(function(idx, itm) {
        if (itm.innerHTML != "") {
            isFibAttempted = true;
        }
    });
});
```

**Paste Prevention:**
```javascript
$(".fib").on("keypress", "div.inputbox-selected", function(ev) {
    let key = ev.keyCode || ev.which;
    if (key === 13) {  // Enter key
        ev.preventDefault();
        ev.stopPropagation();
    }
});
```

#### 2. Dropdown Type

**Click Handler:**
```javascript
$(document).on('click', '.fib .dropdown.fib-with-option .dropdownbtn', function(event) {
    event.stopPropagation();
    var $dropdown = $(this).parent();
    var $menu = $dropdown.find('ul.dropdown-menu');
    
    if ($menu.is(':visible')) {
        $menu.hide();
        $(this).find('.icon-Up').hide();
        $(this).find('.icon-Down').show();
    } else {
        $('.dropdown-menu:visible').hide();  // Close others
        $menu.show();
        $(this).find('.icon-Down').hide();
        $(this).find('.icon-Up').show();
    }
});
```

**Option Selection:**
```javascript
$(document).on('click', '.fib .dropdown.fib-with-option ul.dropdown-menu li', function(event) {
    var selectedText = $(this).find('.fib-option-text').text();
    var selectedIndex = $(this).index();
    
    $(this).closest('.dropdown').find('.chosenAns').text(selectedText);
    $(this).closest('ul').attr('data-selected-index', selectedIndex);
    $(this).closest('ul').hide();
    
    // Enable submit button
    $form.find('.submit-btn').removeClass('disabled');
});
```

**Scroll Hiding:**
```javascript
function detectScroll() {
    let lastScrollTop = $(window).scrollTop();
    $(window).on('scroll', function() {
        let scrollDistance = Math.abs($(window).scrollTop() - lastScrollTop);
        if (scrollDistance >= 100) {
            $('.fib-with-option ul.dropdown-menu:visible').hide();
        }
    });
}
```

#### 3. Drag & Drop Type

**Draggable Configuration:**
```javascript
$(".fib .preview-sort .inputbox-selected.draggable-div").draggable({
    cursor: "move",
    revert: "invalid",
    helper: 'clone',
    appendTo: 'body',
    start: function(event, ui) {
        // Set helper width
        var width = $(this).width() + 20;
        ui.helper[0].style.width = width + "px";
    }
});
```

**Droppable Configuration:**
```javascript
$(".fib .preview-drop").droppable({
    accept: ".draggable-div",
    hoverClass: "ui-state-hover",
    drop: function(event, ui) {
        var draggedElement = ui.draggable;
        var dropZone = $(this);
        
        // Clone into drop zone
        var clonedElement = draggedElement.clone();
        clonedElement.draggable({ disabled: true });
        dropZone.append(clonedElement);
        
        // Disable original
        draggedElement.addClass('added');
        draggedElement.css('opacity', '0.5');
        draggedElement.draggable('disable');
        
        // Mark zone as filled
        dropZone.parent().addClass('dropped');
        
        // Enable submit
        $form.find('.submit-btn').removeClass('disabled');
        $form.find('.reset').removeClass('disabled');
    }
});
```

### Answer Submission

#### Submit Function Flow
```javascript
function SubmitAnswerFIB(event) {
    event.preventDefault();
    $form = $(event.target).parents('form');
    
    // Disable inputs
    if ($form.parents('.fib').attr('data-fib-type') == "without-option") {
        $form.find('div.inputbox-selected').attr('contenteditable', false);
    }
    
    // Get attempt tracking
    var attempts = $eventTarget.attr('data-attempts');
    var totalAttempts = Number($eventTarget.attr('data-no-of-attempts'));
    attempts ? attempts++ : attempts = 1;
    $eventTarget.attr('data-attempts', attempts);
    
    // Validation logic per type
    if ($(event.target).parents('.drag-and-drop').length > 0) {
        validateDragDrop();
    } else if ($form.find('.fib-body').hasClass('with-option-body')) {
        validateDropdown();
    } else {
        validateTextInput();
    }
}
```

#### Validation: Text Input
```javascript
function validateTextInput() {
    for (rowCounter = 0; rowCounter < rows.length; rowCounter++) {
        blanks = $(rows[rowCounter]).find('.js-form-row');
        for (blankCounter = 0; blankCounter < blanks.length; blankCounter++) {
            // Decode correct answer
            correctAnswer = decodeURIComponent(escape(
                window.atob(String($(blanks[blankCounter]).find(selector).data('correct-answer')))
            ));
            
            // Normalize student answer
            currenrAnswer = normalizeQuotes($(blanks[blankCounter]).find(selector).html().toLowerCase());
            
            // Check multiple answers (pipe-separated)
            var correctAnswers = correctAnswer.toLowerCase().split('|').map(temp => temp.trim());
            
            if (correctAnswers.includes(currenrAnswer.trim())) {
                // Mark correct
                $(blanks[blankCounter]).find(selector).addClass('correct');
                var tickIcon = '<span class="correct-tick icon-correct"></span>';
                $(blanks[blankCounter]).find('.form-control-wrap').append(tickIcon);
            } else {
                // Mark incorrect
                $(blanks[blankCounter]).find(selector).addClass('incorrect');
                var crossIcon = '<span class="incorrect-tick icon-close-filled"></span>';
                $(blanks[blankCounter]).find('.form-control-wrap').append(crossIcon);
            }
        }
    }
}
```

**Normalization Function:**
```javascript
function normalizeQuotes(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let cleaned = doc.body ? doc.body.textContent : '';
    
    cleaned = cleaned
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/[''‚‛]/g, "'")
        .replace(/[""„‟]/g, '"')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, '')
        .toLowerCase()
        .trim();
    
    return cleaned;
}
```

#### Validation: Dropdown
```javascript
function validateDropdown() {
    for (blankCounter = 0; blankCounter < blanks.length; blankCounter++) {
        correctAnswer = $(blanks[blankCounter]).find('ul').attr('data-correctoption-index');
        currenrAnswer = $(blanks[blankCounter]).find('ul').attr('data-selected-index');
        
        if (correctAnswer === currenrAnswer) {
            $(blanks[blankCounter]).find('.dropdownbtn').addClass('correct');
            $(blanks[blankCounter]).addClass('disabled');
            var tickIcon = '<span class="correct-tick icon-correct"></span>';
            $(blanks[blankCounter]).append(tickIcon);
        } else {
            $(blanks[blankCounter]).find('.dropdownbtn').addClass('incorrect');
            var crossIcon = '<span class="incorrect-tick icon-close-filled"></span>';
            $(blanks[blankCounter]).append(crossIcon);
        }
    }
}
```

#### Validation: Drag & Drop
```javascript
function validateDragDrop() {
    $form.find(".sort-select").each(function(i) {
        correctAnswer = $form.find(this).attr('data-id');
        currenrAnswer = $form.find(this).next().attr('data-id');
        
        if (correctAnswer === currenrAnswer) {
            $form.find(this).next().addClass('sort-correct');
            var tickIcon = '<span class="correct-tick icon-correct"></span>';
            $form.find(this).next().parent().append(tickIcon);
        } else {
            // On non-final attempts: remove incorrect, re-enable
            if (attempts < totalAttempts) {
                $form.find(this).next().remove();
                $form.find(this).parents(".dropped").removeClass("dropped");
                // Re-enable draggable
                $(".added").each(function(i) {
                    dragId = $(this).attr('data-id');
                    if (correctAnswer === dragId) {
                        $(this).css('opacity', '1');
                        $(this).draggable('enable');
                        $(this).removeClass("added");
                    }
                });
            } else {
                // Final attempt: show incorrect
                $form.find(this).next().addClass('sort-incorrect');
                var crossIcon = '<span class="incorrect-tick icon-close-filled"></span>';
                $form.find(this).next().parent().append(crossIcon);
            }
        }
    });
}
```

### Attempt Management

#### Max Attempts Logic
```javascript
if (attempts === totalAttempts || $form.find('.tryagn-btn').hasClass("nghidedata")) {
    // Final attempt
    $form.find('.submit-btn').addClass('disabled');
    $form.find('.submit-btn').css("display", "none");
    // Show correct answers if configured
} else {
    // Non-final attempt
    $form.find('.submit-btn').css("display", "none");
    $form.find('.tryagn-btn').removeClass('disabled');
    // Keep incorrect answers editable
}
```

#### Try Again Functionality
```javascript
function tryagainFIB(event) {
    event.preventDefault();
    var $form = $(event.target).parents('form');
    
    // Remove incorrect markers
    $form.find('.incorrect-tick').remove();
    $form.find('.incorrect').removeClass('incorrect');
    $form.find('.incorrect-attempt').removeClass('incorrect-attempt');
    
    // Keep correct answers locked
    $form.find('.correct').prop('disabled', true);
    
    // Re-enable submit
    $form.find('.submit-btn').removeClass('disabled');
    $form.find('.submit-btn').css("display", "");
    $form.find('.tryagn-btn').addClass('disabled');
    
    // Clear incorrect fields
    if (drag & drop) {
        // Remove incorrect drops, re-enable draggables
    } else if (dropdown) {
        // Reset to "Select Answer"
        $(this).find('.dropdownbtn .chosenAns').text("Select Answer");
    } else {
        // Clear text inputs
        $form.find('div.inputbox-selected').each(function() {
            if (!$(this).hasClass('correct')) {
                $(this).html('');
            }
        });
    }
}
```

#### Show Answer Functionality
```javascript
function showAnswerFIB(event) {
    event.preventDefault();
    var $form = $(event.target).parents('form');
    
    if (dropdown) {
        $form.find('.dropdown.fib-with-option').each(function() {
            var correctIndex = $(this).find('ul').attr('data-correctoption-index');
            var correctText = $(this).find('ul li').eq(correctIndex).find('.fib-option-text').text();
            $(this).find('.chosenAns').text(correctText);
            $(this).addClass('disabled');
        });
    } else if (text input) {
        $form.find('div.inputbox-selected').each(function() {
            var correctAnswer = decodeURIComponent(escape(
                window.atob($(this).data('correct-answer'))
            ));
            // Show first correct answer if multiple
            var firstAnswer = correctAnswer.split('|')[0].trim();
            $(this).html(firstAnswer);
            $(this).attr('contenteditable', false);
        });
    } else if (drag & drop) {
        $form.find('.sort-select').each(function() {
            var correctId = $(this).attr('data-id');
            var correctDraggable = $form.find('.preview-sort .inputbox-selected[data-id="' + correctId + '"]');
            var cloned = correctDraggable.clone();
            $(this).parent().append(cloned);
            $(this).parent().addClass('dropped');
        });
    }
    
    // Disable all interactions
    $form.find('.submit-btn').addClass('disabled');
    $form.find('.showme-btn').addClass('disabled');
    $form.find('.tryagn-btn').addClass('disabled');
}
```

#### Reset Functionality
```javascript
function resetAnswerFIB(event) {
    event.preventDefault();
    var $form = $(event.target).parents('form');
    
    if (drag & drop) {
        $form.find(".sort-select").each(function() {
            $(this).next().remove();
            $(this).parent().removeClass("dropped");
        });
        $form.find('.preview-sort .inputbox-selected').css('opacity', '1');
        $form.find('.preview-sort .inputbox-selected').draggable('enable');
        $form.find('.preview-sort .added').removeClass("added");
    } else if (dropdown) {
        $form.find(".dropdown.fib-with-option").each(function() {
            if (!$(this).hasClass('correct')) {
                $(this).find('.chosenAns').text("Select Answer");
                $(this).find('.icon-Down').show();
            }
        });
    } else {
        $form.find('div.inputbox-selected').each(function() {
            if (!$(this).hasClass('correct')) {
                $(this).html('');
            }
        });
    }
    
    // Remove all feedback
    $form.find('.incorrect-tick').remove();
    $form.find('.incorrect').removeClass('incorrect');
    $form.find('.submit-btn').addClass('disabled');
    $form.find('.reset').addClass('disabled');
}
```

### Feedback Display

#### Generic Feedback (if enabled)
```javascript
var genericCorrectText = $form.find('.fib-alert').attr('data-generic-correct-feedback');
var genericIncorrectText = $form.find('.fib-alert').attr('data-generic-incorrect-feedback');

if (allCorrect) {
    $form.find('.fib-alert').show();
    $form.find('.fib-alert .fib-alert-message').text(genericCorrectText);
    $form.find('.fib-alert').addClass('success-feedback');
} else {
    $form.find('.fib-alert').show();
    $form.find('.fib-alert .fib-alert-message').text(genericIncorrectText);
    $form.find('.fib-alert').addClass('error-feedback');
}
```

#### Visual Feedback Classes
- **Correct**: `.correct`, green border, checkmark icon
- **Incorrect**: `.incorrect`, red border, X icon
- **Icons**:
  - Correct: `<span class="correct-tick icon-correct"></span>`
  - Incorrect: `<span class="incorrect-tick icon-close-filled"></span>`

---

## Data Flow

### Editor Mode Data Flow

```
User Action
    ↓
Event Handler (Click/Input/Blur)
    ↓
Directive Scope Function
    ↓
Update fieldData JSON Model
    ↓
Angular Digest Cycle
    ↓
DOM Update via ng-model/ng-repeat
    ↓
Save Button Enabled
    ↓
On Save: Main Controller
    ↓
Serialize JSON to savedJson[pageNo][uniqueId]
    ↓
Store in localStorage / Server
```

#### Key Update Triggers

1. **Insert Blank**:
   ```
   insertBlank() → Update responseList → Re-compile HTML → Update statement
   ```

2. **Change FIB Type**:
   ```
   fibradioChange() → Update isWithOption → loadBlanks() → Rebuild all blanks
   ```

3. **Add/Remove Sentence**:
   ```
   addSentenceClick() / removeSentenceClick() → Update fibInfo array → ng-repeat updates DOM
   ```

4. **Upload Image**:
   ```
   Image selection → Main controller upload → Update imageUrl → ng-src updates image
   ```

5. **Mark Correct Answer**:
   ```
   correctOptionClick() → Update correctIndex → Update data-correctoption-index
   ```

### Preview/Reader Mode Data Flow

```
Page Load
    ↓
Parse JSON from data attributes
    ↓
Initialize jQuery event handlers
    ↓
Render blanks based on type
    ↓
User Interaction (Type/Select/Drag)
    ↓
Update DOM state (not JSON)
    ↓
Submit Button Click
    ↓
Validate answers
    ↓
Compare with correct answers
    ↓
Apply visual feedback (correct/incorrect)
    ↓
Update attempt counter
    ↓
Show/Hide buttons based on attempts
    ↓
Optional: Report to LMS (SCORM/xAPI)
```

#### Validation Data Flow

**Text Input:**
```
Submit → Get data-correct-answer → Decode Base64 → Normalize → Split by '|' → Compare with input → Mark correct/incorrect
```

**Dropdown:**
```
Submit → Get data-correctoption-index → Get data-selected-index → Compare → Mark correct/incorrect
```

**Drag & Drop:**
```
Submit → Get data-id from drop zone → Get data-id from dropped element → Compare → Mark correct/incorrect → Re-enable if wrong on non-final attempt
```

### State Management

#### Editor State (savedJson)
```javascript
savedJson[pageNo][uniqueId] = {
    identifier: "fill-in-the-blank",
    question: "...",
    settings: { /* all settings */ },
    TemplateData: { /* template data */ },
    style: { /* style info */ },
    media: { /* media info */ }
}
```

#### Preview State (data attributes + jQuery state)
- **Answer State**: Stored in DOM elements
- **Attempt Tracking**: `data-attempts`, `data-no-of-attempts` attributes
- **Validation State**: CSS classes (`.correct`, `.incorrect`, `.disabled`)
- **Drag State**: `.added`, `.dropped`, `opacity` CSS

#### SCORM/xAPI Integration
```javascript
function stateMainatainFIB(event) {
    if (typeof apiHandle != "undefined") {
        // Build state object
        var scoObj = {
            dataType: "fill-in-the-blank",
            componentId: $form.parents(".customClass").eq(0).attr('data-saved-index'),
            feedbackMessage: "...",
            inputSeleced: [],   // Student answers
            inputCorrect: [],   // Correct flags
            inputIncorrect: []  // Incorrect flags
        };
        saveAction(event, scoObj);
    }
}
```

---

## Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KITABOO Authoring Tool                         │
│                         (AngularJS Application)                         │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼──────────┐
         │   Editor Mode       │   │  Preview/Reader    │
         │  (Authoring)        │   │     Mode           │
         └──────────┬──────────┘   └─────────┬──────────┘
                    │                        │
         ┌──────────┴──────────┐            │
         │                     │            │
    ┌────▼────┐         ┌─────▼─────┐      │
    │  Main   │         │    FIB    │      │
    │Controller│◄────────┤ Template  │      │
    │(ngCtrl) │         │ Directive │      │
    └────┬────┘         └─────┬─────┘      │
         │                    │            │
         │              ┌─────▼──────┐     │
         │              │   Scope    │     │
         │              │ Functions  │     │
         │              └─────┬──────┘     │
         │                    │            │
         ├────────────────────┼────────────┼──────────────┐
         │                    │            │              │
    ┌────▼────┐         ┌─────▼─────┐ ┌───▼───┐    ┌─────▼─────┐
    │ Settings│         │   Blank   │ │Sentence│   │  Image    │
    │  Panel  │         │Management │ │Manager │   │  Upload   │
    └─────────┘         └───────────┘ └────────┘   └───────────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │Asset Library│
                                                    └─────────────┘

         │                                              │
         └──────────────────┬───────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │   JSON Data Model  │
                  │                    │
                  │  • fieldData       │
                  │  • settings        │
                  │  • TemplateData    │
                  │  • fibInfo[]       │
                  │  • responseList[]  │
                  └─────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │                           │
     ┌────────▼────────┐         ┌────────▼────────┐
     │   localStorage  │         │  Server Storage │
     │   (Auto-save)   │         │   (Manual Save) │
     └─────────────────┘         └─────────────────┘


═══════════════════════════════════════════════════════════════════════════
                         PREVIEW/READER MODE
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────┐
    │          fib-template-preview1.js                   │
    │              (jQuery-based)                          │
    └──────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼──────┐ ┌────▼────┐ ┌─────▼──────┐
    │ Text      │ │Dropdown │ │ Drag &     │
    │ Input     │ │         │ │ Drop       │
    │ Handler   │ │ Handler │ │ Handler    │
    └────┬──────┘ └────┬────┘ └─────┬──────┘
         │             │            │
         └─────────────┼────────────┘
                       │
              ┌────────▼────────┐
              │  Submit Answer  │
              │   Validation    │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼──────┐ ┌────▼────┐ ┌─────▼──────┐
    │ Normalize │ │ Compare │ │  Visual    │
    │  Answer   │ │ Answers │ │  Feedback  │
    └───────────┘ └────┬────┘ └────────────┘
                       │
              ┌────────▼────────┐
              │ Attempt Manager │
              │ • Track attempts│
              │ • Show buttons  │
              │ • Final feedback│
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  State Storage  │
              │  (SCORM/xAPI)   │
              └─────────────────┘
```

### Component Interaction Flow

#### 1. Editor Initialization
```
index.html loads → AngularJS bootstrap → ngController init → 
Directive registration → Template clicked → fibTemplate directive link → 
Scope setup → loadBlanks() → Render initial state → 
Settings panel opened → currSettings bound
```

#### 2. Blank Insertion Flow
```
User types in sentence → Positions cursor → Clicks "Insert Blank" → 
insertBlank() called → Determines FIB type → Generates HTML structure → 
Creates responseList entry → Compiles with AngularJS → 
Inserts into DOM at cursor → Updates statement in JSON → 
Enables save button
```

#### 3. Answer Validation Flow
```
Student completes answers → Clicks Submit → SubmitAnswerFIB(event) → 
Determines FIB type → Loops through blanks → 
Extracts correct answer (decode Base64) → Normalizes student answer → 
Compares → Applies CSS classes → Adds tick/cross icons → 
Increments attempts → Updates button states → 
Reports to SCORM (if enabled)
```

---

## Offline/Package Behavior

### Asset Packaging

#### Image Assets
- **Storage Location**: `assets/image_library/`
- **Reference Format**: Relative paths in JSON
  ```json
  {
    "imageUrl": "assets/image_library/uuid_filename.jpg"
  }
  ```
- **Packaging**: Images copied to package folder structure
- **Offline Access**: Local file references work without network

#### Script Dependencies
Packaged in `custom.javascript` array:
```json
"custom": {
  "javascript": [
    "js/jquery-ui.min.js",
    "js/jquery-ui-1.10.3.min.js",
    "js/jquery.ui.touch-punch.js",
    "js/jquery.mCustomScrollbar.js",
    "js/templates/fib-template-preview1.js"
  ]
}
```

#### CSS Dependencies
```json
"custom": {
  "css": ["css/templates/fib-template.css"]
}
```

### Offline Functionality

#### What Works Offline
✅ **Full Rendering**: All content displays correctly  
✅ **Student Interactions**: All input methods functional  
✅ **Answer Validation**: Client-side validation works  
✅ **Visual Feedback**: Correct/incorrect indicators display  
✅ **Attempt Tracking**: Local state management functional  
✅ **LaTeX Rendering**: MathQuill/MathLive work offline  
✅ **Drag & Drop**: jQuery UI fully functional offline

#### What Doesn't Work Offline (without configuration)
❌ **Image Upload**: Requires server-side processing  
❌ **SCORM/xAPI Reporting**: Queues for later sync  
❌ **Auto-save**: localStorage as fallback, no server sync  
❌ **External CDN Resources**: If not locally packaged

### SCORM Package Structure

```
scorm_package/
├── imsmanifest.xml
├── index.html
├── player/
│   ├── scormdriver.js
│   └── SCOFunctions.js
├── content/
│   ├── page1.html
│   ├── page2.html
│   └── ...
├── css/
│   ├── templates/
│   │   └── fib-template.css
│   └── common.css
├── js/
│   ├── templates/
│   │   └── fib-template-preview1.js
│   ├── jquery-ui.min.js
│   └── ...
├── assets/
│   └── image_library/
│       ├── image1.jpg
│       └── image2.png
└── data/
    └── content.json
```

### Answer Encoding for Security

#### Editor Output (before packaging)
```javascript
// Plain text answers in editor
"choiceList": [
  {
    "choice": {
      "choiceText": "Paris"
    }
  }
]
```

#### Packaged Output (encoded)
```javascript
// Base64 encoded in package
data-correct-answer="UGFyaXM="  // Base64 encode of "Paris"
data-correctoption-index="0"
```

#### Decoding in Preview
```javascript
let encoded = $(element).data('correct-answer');
let decoded = decodeURIComponent(escape(window.atob(String(encoded))));
```

### Caching Strategy

#### Browser Caching
- **CSS/JS**: Cached with versioning via query params
  ```html
  <link href="css/templates/fib-template.css?v=1.2.3">
  <script src="js/templates/fib-template-preview1.js?v=1.2.3">
  ```
- **Images**: Long-term cache headers
- **Fonts**: Preloaded and cached

#### LocalStorage Usage
```javascript
// Auto-save draft in editor
localStorage.setItem('fib_draft_' + pageId, JSON.stringify(fieldData));

// Restore on reload
let draft = localStorage.getItem('fib_draft_' + pageId);
if (draft) {
    fieldData = JSON.parse(draft);
}
```

---

## Error Handling

### Current Error Handling

#### 1. LaTeX Parsing Errors
**Location**: `fib-template-preview1.js`, lines 824-825

```javascript
try {
    correctAnswer1 = normalizeQuotes(
        decodeURIComponent(escape(window.atob(String(encoded))))
    );
} catch (e) {
    console.error('Error decoding correct answer:', e);
    // Silent failure - continues without correct answer
}
```

**Issue**: Errors are logged but not shown to users. If Base64 decoding fails, validation silently fails.

#### 2. MathField Parsing Errors
**Location**: `fib-template-preview1.js`, lines 1642-1643

```javascript
try {
    const doc = parser.parseFromString(mathFieldHTML, 'text/html');
    // Extract LaTeX
} catch (error) {
    console.error('Error parsing math field HTML:', error);
    // Continues without LaTeX rendering
}
```

**Issue**: Math fields may appear blank if parsing fails.

#### 3. XML Parsing Protection
**Location**: `fib-template-preview1.js`, line 613

```javascript
// Use DOMParser in HTML mode (not XHTML) to avoid XML parsing errors
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
```

**Mitigation**: Uses HTML parsing mode instead of XML to be more forgiving of malformed markup.

#### 4. Blank Limit Enforcement
**Location**: `fib-template-directive.js`, line 703

```javascript
if (blank_count - 1 < max_blanks) {
    // Allow insertion
} else {
    // Silently ignore - no error message
}
```

**Issue**: No user feedback when limit reached (max 20 blanks).

#### 5. Image Upload Failures
**Handling**: No explicit error handling in FIB component. Relies on main controller.

**Observed Behavior**: Upload button remains active, no loading indicator, no error message on failure.

### Missing Error Scenarios

#### Not Handled

1. **Network Errors**:
   - No retry logic for failed uploads
   - No offline detection
   - No queuing of failed operations

2. **Data Validation**:
   - No validation that `fibInfo` array has at least 1 sentence
   - No validation that dropdowns have ≥2 options
   - No validation that text inputs have correct answers

3. **Browser Compatibility**:
   - No fallback if `DOMParser` unavailable
   - No check for `contenteditable` support
   - No polyfills for missing APIs

4. **Resource Loading**:
   - No error handling if CSS/JS fails to load
   - No fallback if MathQuill/MathLive libraries missing
   - No graceful degradation

5. **Concurrent Editing**:
   - No conflict resolution for multiple editors
   - No locking mechanism
   - SavedJson can be overwritten

### Error Recovery Mechanisms

#### Auto-save Recovery
```javascript
// Editor mode has auto-save
window.addEventListener('beforeunload', function() {
    // Saves current state to localStorage
    saveToLocalStorage();
});
```

#### Undo/Redo
```javascript
// Main controller tracks history
con.undoHistory.push({
    json: angular.copy(con.currSettings),
    html: $("#target").html()
});
```

#### State Reset
```javascript
// Try Again button allows student to retry
function tryagainFIB(event) {
    // Clears incorrect answers
    // Keeps correct answers
    // Re-enables inputs
}
```

---

## Known Issues

### Critical Issues

#### 1. **Drag & Drop State Inconsistency**
- **Symptom**: After Try Again, some draggable items remain disabled
- **Location**: `tryagainFIB()` function
- **Root Cause**: Opacity and draggable state not consistently restored
- **Workaround**: Reset answer instead of Try Again
- **Impact**: Medium - confuses students

#### 2. **LaTeX Answer Validation Failure**
- **Symptom**: Math equations in answers not validated correctly
- **Location**: Answer normalization
- **Root Cause**: HTML structure of `<math-field>` not handled in comparison
- **Workaround**: Use text representations
- **Impact**: High - affects math assessments

#### 3. **Dropdown Scroll Hiding Conflicts**
- **Symptom**: Dropdowns hide when scrolling 100px, can interrupt selection
- **Location**: `detectScroll()` function, line 95
- **Root Cause**: Aggressive scroll detection
- **Workaround**: Scroll less than 100px or use keyboard
- **Impact**: Low - minor UX annoyance

#### 4. **Blank Resizing Breaks on Type Change**
- **Symptom**: Width stored in `datadragwidth` lost when switching FIB types
- **Location**: `loadBlanks()` rebuild
- **Root Cause**: `datadragwidth` not transferred to new HTML structure
- **Workaround**: Resize blanks again after type change
- **Impact**: Low - cosmetic issue

### Moderate Issues

#### 5. **Image Media Position Changes Not Reflected**
- **Symptom**: Changing image position in settings doesn't update immediately
- **Location**: Paragraph/Sentence media position settings
- **Root Cause**: `ng-style` not triggering digest
- **Workaround**: Click elsewhere to trigger update
- **Impact**: Low - settable with extra click

#### 6. **Custom Keyboard Character Duplication**
- **Symptom**: Clicking character button twice inserts character twice
- **Location**: `keyboardKeyPressEvent()`
- **Root Cause**: No debouncing on character insertion
- **Workaround**: Type carefully
- **Impact**: Low - easy for students to undo

#### 7. **Sentence Image Upload Target Confusion**
- **Symptom**: Uploading image may target wrong sentence if multiple open
- **Location**: `fibMediaLoc` tracking
- **Root Cause**: Global variable not sentence-specific
- **Workaround**: Ensure correct sentence selected before upload
- **Impact**: Medium - can cause data corruption

#### 8. **Max Blanks Not Enforced Consistently**
- **Symptom**: Sometimes 21st blank can be inserted
- **Location**: Blank insertion validation
- **Root Cause**: Race condition in count check
- **Workaround**: Manual count management
- **Impact**: Low - edge case

### Minor Issues

#### 9. **Dropdown Option Deletion Animation**
- **Symptom**: Deleted options briefly flash before removal
- **Location**: Delete option click handler
- **Root Cause**: AngularJS digest delay
- **Workaround**: None needed
- **Impact**: Very Low - cosmetic

#### 10. **Settings Panel Scroll Position Not Saved**
- **Symptom**: Settings panel scrolls to top when switching components
- **Location**: Settings panel display
- **Root Cause**: Panel re-rendered on each open
- **Workaround**: Scroll manually
- **Impact**: Very Low - minor UX

### Design Limitations

#### 11. **No Rich Text in Blanks**
- **Current**: Plain text only in blank answers
- **Requested**: Formatted text, bold, italics
- **Reason**: Comparison complexity
- **Workaround**: Use LaTeX for math, plain text elsewhere

#### 12. **Image Answers Only in Drag & Drop**
- **Current**: Text Input and Dropdown don't support image answers
- **Requested**: Image-based dropdowns
- **Reason**: Template type restrictions
- **Workaround**: Use Drag & Drop type

#### 13. **No Audio/Video in Blanks**
- **Current**: Paragraph media supports audio/video (UI present) but disabled
- **Reason**: Playback control complexity
- **Workaround**: Use separate media components

#### 14. **Single Media per Sentence**
- **Current**: Each sentence can have 0 or 1 image
- **Requested**: Multiple images per sentence
- **Reason**: Layout complexity
- **Workaround**: Split into multiple sentences

### Browser-Specific Issues

#### 15. **IE11 Drag & Drop Performance**
- **Symptom**: Slow drag initiation on IE11
- **Cause**: jQuery UI Touch Punch overhead
- **Workaround**: Upgrade browser
- **Impact**: Low - IE11 deprecated

#### 16. **Safari Contenteditable Caret Jump**
- **Symptom**: Cursor jumps to end when typing in blanks on Safari
- **Cause**: Safari's contenteditable implementation
- **Workaround**: Use Chrome/Firefox
- **Impact**: Medium on Safari

#### 17. **Mobile Touch Drag Issues**
- **Symptom**: Drag & drop occasionally fails on mobile
- **Cause**: Touch event conflicts
- **Mitigation**: jQuery UI Touch Punch plugin used
- **Impact**: Medium on mobile

---

## Recommendations

### High Priority

#### 1. **Refactor to Modern Framework**
**Current**: AngularJS 1.x (EOL since 2022)  
**Recommendation**: Migrate to Angular 12+, React, or Vue 3  
**Benefits**:
- Better performance
- Modern tooling (TypeScript, Webpack)
- Active community support
- Better mobile support

**Migration Path**:
```
Phase 1: Convert to TypeScript (keep AngularJS)
Phase 2: Create React/Vue equivalent components
Phase 3: Parallel run both versions
Phase 4: Gradual migration with feature parity
Phase 5: Deprecate AngularJS version
```

#### 2. **Implement Comprehensive Error Handling**

**Add User-Facing Error Messages**:
```javascript
function handleError(context, error, userMessage) {
    console.error(`[${context}]`, error);
    showToast(userMessage, 'error');
    logToAnalytics(context, error);
}

// Usage
try {
    const decoded = window.atob(encoded);
} catch (e) {
    handleError('Answer Decoding', e, 'Unable to load correct answers. Please refresh the page.');
}
```

**Add Loading States**:
```html
<button ng-click="uploadImage()" ng-disabled="uploading">
    <span ng-if="!uploading">Upload Image</span>
    <span ng-if="uploading"><i class="spinner"></i> Uploading...</span>
</button>
```

#### 3. **Centralize Data Model with Schema Validation**

**Use JSON Schema**:
```javascript
const fibSchema = {
    type: 'object',
    required: ['identifier', 'settings', 'TemplateData'],
    properties: {
        settings: {
            type: 'object',
            properties: {
                isWithOption: {
                    enum: ['with-option', 'without-option', 'drag-and-drop']
                },
                maxTries: {
                    type: 'string',
                    pattern: '^[1-5]$'
                }
            }
        },
        TemplateData: {
            type: 'object',
            properties: {
                fibInfo: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 20
                }
            }
        }
    }
};

// Validate before save
const valid = ajv.validate(fibSchema, fieldData);
if (!valid) {
    console.error('Validation errors:', ajv.errors);
}
```

#### 4. **Separate Editor and Preview Code**

**Current Issue**: Single directive handles both modes  
**Recommendation**: Split into two components

```
fib-template-editor.js    (Editor-specific logic)
fib-template-preview.js   (Already separated, keep as is)
fib-template-shared.js    (Common validation, utilities)
```

**Benefits**:
- Smaller bundle size for preview
- Clearer separation of concerns
- Easier testing

### Medium Priority

#### 5. **Improve Drag & Drop Implementation**

**Replace jQuery UI with Native HTML5 Drag & Drop**:
```javascript
// Modern approach
element.draggable = true;
element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', element.dataset.id);
});

dropZone.addEventListener('drop', (e) => {
    const draggedId = e.dataTransfer.getData('text/plain');
    // Handle drop
});
```

**Benefits**:
- Better mobile support
- Native browser performance
- Smaller library footprint

#### 6. **Implement State Management Pattern**

**Current**: Scattered state in `con.currSettings`, directive scope, DOM attributes  
**Recommendation**: Use Redux, MobX, or Vuex pattern

```javascript
// Centralized state
const fibState = {
    editorMode: {
        selectedBlank: null,
        activeSentence: 0,
        unsavedChanges: false
    },
    previewMode: {
        attempts: 0,
        maxAttempts: 3,
        submittedAnswers: {},
        feedback: []
    }
};

// Actions
function updateBlank(sentenceIndex, blankIndex, data) {
    fibState.editorMode.selectedBlank = { sentenceIndex, blankIndex };
    fibState.editorMode.unsavedChanges = true;
    // Update JSON model
    // Trigger re-render
}
```

#### 7. **Add Accessibility (A11y) Features**

**ARIA Labels**:
```html
<div class="js-form-row" role="textbox" aria-label="Fill in the blank 1 of 3" 
     aria-describedby="instructions" contenteditable="true">
</div>
```

**Keyboard Navigation**:
```javascript
element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Move to next blank
    } else if (e.key === 'Enter') {
        // Submit if on last blank
    }
});
```

**Screen Reader Support**:
```html
<div role="alert" aria-live="polite" class="fib-feedback">
    <span class="sr-only">3 of 5 answers correct</span>
</div>
```

#### 8. **Optimize Performance**

**Lazy Load MathLive**:
```javascript
// Load only when needed
if (hasMathContent) {
    import('mathlive').then(module => {
        initializeMathFields();
    });
}
```

**Virtual Scrolling for Long Lists**:
```javascript
// Use for 20+ sentences
<virtual-scroll [items]="fibInfo" [itemHeight]="80">
    <ng-template let-sentence>
        <sentence-editor [data]="sentence"></sentence-editor>
    </ng-template>
</virtual-scroll>
```

**Debounce Auto-save**:
```javascript
const debouncedSave = _.debounce(saveToLocalStorage, 2000);
element.addEventListener('input', debouncedSave);
```

### Low Priority

#### 9. **Add Unit Tests**

**Framework**: Jest + Testing Library

```javascript
describe('FIB Validation', () => {
    test('validates correct text input answer', () => {
        const blank = { correctAnswer: 'Paris', type: 'text' };
        const studentAnswer = 'paris';
        expect(validateAnswer(blank, studentAnswer)).toBe(true);
    });
    
    test('handles multiple correct answers', () => {
        const blank = { correctAnswer: 'gray|grey', type: 'text' };
        expect(validateAnswer(blank, 'gray')).toBe(true);
        expect(validateAnswer(blank, 'grey')).toBe(true);
    });
});
```

#### 10. **Add Visual Regression Tests**

**Tool**: Percy, Chromatic, or BackstopJS

```javascript
cy.visit('/fib-component-preview');
cy.matchImageSnapshot('fib-initial-state');

cy.get('.js-form-row input').first().type('Answer');
cy.matchImageSnapshot('fib-with-answer');

cy.get('.submit-btn').click();
cy.matchImageSnapshot('fib-after-submit');
```

#### 11. **Improve Developer Documentation**

**Add JSDoc Comments**:
```javascript
/**
 * Inserts a new blank at the cursor position
 * @param {Event} event - Click event from Insert Blank button
 * @param {string} [type='text'] - Type of blank: 'text', 'dropdown', or 'drag-drop'
 * @returns {boolean} True if blank inserted, false if limit reached
 * @throws {Error} If responseList is malformed
 * @example
 * scope.insertBlank(clickEvent, 'dropdown');
 */
scope.insertBlank = function(event, type = 'text') {
    // Implementation
};
```

**Component Storybook**:
```javascript
export default {
    title: 'FIB/TextInput',
    component: FibTextInput
};

export const Empty = () => ({
    component: FibTextInput,
    props: { fibInfo: defaultFibInfo }
});

export const WithAnswers = () => ({
    component: FibTextInput,
    props: { fibInfo: prefilledFibInfo }
});
```

#### 12. **Add Analytics Tracking**

**Track User Behavior**:
```javascript
// Editor analytics
analytics.track('FIB Blank Inserted', {
    type: 'dropdown',
    sentenceIndex: 0,
    totalBlanks: 5
});

// Preview analytics
analytics.track('FIB Answer Submitted', {
    attempts: 2,
    correct: 4,
    incorrect: 1,
    timeSpent: 127  // seconds
});
```

### Future Enhancements

#### 13. **AI-Powered Features**

**Auto-Generate Blanks**:
```javascript
async function suggestBlanks(sentenceText) {
    const response = await openai.complete({
        prompt: `Identify 3 words in this sentence that would make good fill-in-blank questions: "${sentenceText}"`,
        model: 'gpt-4'
    });
    return response.suggestions;
}
```

**Distractor Generation**:
```javascript
async function generateDistractors(correctAnswer) {
    const response = await openai.complete({
        prompt: `Generate 3 plausible but incorrect alternatives to: "${correctAnswer}"`,
        model: 'gpt-4'
    });
    return response.distractors;
}
```

#### 14. **Collaborative Editing**

**Real-time Co-authoring**:
```javascript
// WebSocket connection
socket.on('fib_update', (data) => {
    if (data.userId !== currentUser.id) {
        applyRemoteUpdate(data.changes);
        showUserCursor(data.userId, data.position);
    }
});

// Operational Transform for conflict resolution
const ot = new OperationalTransform();
const merged = ot.merge(localChanges, remoteChanges);
```

#### 15. **Advanced Scoring Options**

**Partial Credit**:
```javascript
function calculateScore(answers) {
    let score = 0;
    answers.forEach(answer => {
        if (answer.isCorrect) {
            score += answer.weight || 1;
        } else if (answer.isPartiallyCorrect) {
            score += (answer.weight || 1) * 0.5;
        }
    });
    return score;
}
```

**Time-based Scoring**:
```javascript
const timeBonus = Math.max(0, 100 - (timeSpent / maxTime) * 50);
const finalScore = baseScore + timeBonus;
```

#### 16. **Responsive Design Improvements**

**Mobile-First Layout**:
```css
/* Stack images above text on mobile */
@media (max-width: 768px) {
    .sentenceRow {
        flex-direction: column !important;
    }
    
    .fibSentence {
        order: 2;
    }
    
    .mediaContainer {
        order: 1;
        width: 100% !important;
    }
}
```

**Touch-Friendly Controls**:
```css
@media (pointer: coarse) {
    .insert-blank, .fib-add-delete-btn {
        min-height: 44px;  /* Apple HIG recommendation */
        min-width: 44px;
    }
}
```

---

## Conclusion

The **FIB with Image** component is a feature-rich, versatile assessment widget that supports multiple interaction types and enhanced media capabilities. While built on a legacy AngularJS foundation, it demonstrates robust functionality for both authoring and learner experiences.

### Strengths
✅ Flexible answer input methods (Text, Dropdown, Drag & Drop)  
✅ Image integration for enriched questions  
✅ LaTeX/MathLive support for STEM subjects  
✅ Offline-capable packaging  
✅ Comprehensive styling options  
✅ SCORM/xAPI integration  

### Areas for Improvement
⚠️ Modern framework migration needed  
⚠️ Error handling and user feedback  
⚠️ Performance optimization for large content  
⚠️ Mobile experience refinement  
⚠️ Accessibility compliance  

### Strategic Recommendations
1. **Short-term** (3-6 months): Address critical bugs, improve error handling, add loading states
2. **Medium-term** (6-12 months): TypeScript conversion, centralized state management, accessibility audit
3. **Long-term** (12-24 months): Framework migration, AI features, real-time collaboration

