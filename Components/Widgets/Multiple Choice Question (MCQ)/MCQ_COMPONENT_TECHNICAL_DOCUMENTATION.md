# Multiple Choice Question (MCQ) Component - Comprehensive Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Component Types & Variants](#component-types--variants)
4. [File Structure](#file-structure)
5. [Data Model](#data-model)
6. [Component Modes](#component-modes)
7. [Style System](#style-system)
8. [User Interactions & Features](#user-interactions--features)
9. [Data Flow Diagram](#data-flow-diagram)
10. [Technical Implementation](#technical-implementation)
11. [Error Handling](#error-handling)
12. [Offline/Package Behavior](#offlinepackage-behavior)
13. [Known Issues](#known-issues)
14. [Recommendations](#recommendations)

---

## 1. Overview

The Multiple Choice Question (MCQ) component is a comprehensive interactive assessment widget in the KITABOO Authoring system that allows authors to create single or multiple-select question formats with rich media support, customizable styles, and feedback mechanisms.

### Key Features
- **Single/Multiple Select**: Supports both single-answer and multiple-answer question types
- **Rich Media Support**: Images, videos (YouTube, local), and audio integration
- **6 Visual Styles**: 3 card styles + 3 full-bleed styles with color customization
- **Label Customization**: 6 label types (Default, Alphabets caps/small, Roman caps/small, Numeric)
- **Feedback System**: Individual option feedback and generic correct/incorrect feedback
- **Try-Again Mechanism**: Configurable attempt limits (1-5)
- **Sample Answers**: Layer-based sample answer display capability
- **Shuffle Options**: Randomize option order for assessments
- **Show Me Feature**: Reveal correct answers on demand

---

## 2. Component Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MCQ Component                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │   Editor Mode   │  │   Preview Mode   │  │ Reader Mode│ │
│  │  (Authoring)    │  │   (Validation)   │  │ (Runtime)  │ │
│  └────────┬────────┘  └────────┬─────────┘  └─────┬──────┘ │
│           │                    │                   │         │
│           └────────────────────┴───────────────────┘         │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Directive Controller Layer                   │   │
│  │   (mcq-template-data directive)                     │   │
│  │   - Option management                                │   │
│  │   - Media handling                                   │   │
│  │   - Style application                                │   │
│  │   - Settings management                              │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Data Model (JSON)                         │   │
│  │   - Field data structure                             │   │
│  │   - Settings configuration                           │   │
│  │   - Style metadata                                   │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            View Layer (HTML Templates)               │   │
│  │   - multiple-choice-template-auth.html               │   │
│  │   - mcq-media-template.html                          │   │
│  │   - multiple-choice-template-settings.html           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Registration
```json
{
  "name": "MCQ",
  "icon": "4",
  "iconClass": "icon-MultipleChoiceSingleSelect",
  "dataType": "multiple-choice-template",
  "url": "templates/multiple-choice-template/multiple-choice-template-auth.html",
  "json": "templates/multiple-choice-template/default/multiple-choice-template.json",
  "settingsURL": "templates/multiple-choice-template/multiple-choice-template-settings.html"
}
```

---

## 3. Component Types & Variants

### 3.1 Question Types

#### Type 1: Single Select (Radio Button)
- **Identifier**: `single-select`
- **Behavior**: Only one option can be selected at a time
- **Use Case**: Questions with exactly one correct answer
- **Data Property**: `fieldData.settings.msOrSsBoolean = "single-select"`
- **Data Property**: `fieldData.listData[0].mcssData.isSingleSelect = true`

#### Type 2: Multiple Select (Checkbox)
- **Identifier**: `multiple-select`
- **Behavior**: Multiple options can be selected simultaneously
- **Use Case**: Questions with multiple correct answers
- **Data Property**: `fieldData.settings.msOrSsBoolean = "multiple-select"`
- **Data Property**: `fieldData.listData[0].mcssData.isSingleSelect = false`

### 3.2 Visual Style Variants

#### Card Styles (3 variants)

**Card Style 1** (`card-style1`)
- Clean card design with left border highlight on selection
- Background color changes to 5% opacity of theme color
- 2px solid left border in theme color
- Box shadow on selection
- Suitable for: Traditional assessments

**Card Style 2** (`card-style2`)
- Border-based selection indication
- Full border changes to theme color on selection
- Text weight becomes bold on selection
- Suitable for: Modern minimalist designs

**Card Style 3** (`card-style3`)
- Option button background color changes
- Bold text on selection
- Custom option background colors supported
- Suitable for: Colorful, engaging assessments

#### Full Bleed Styles (3 variants)

**Full Bleed Style 1** (`mcq_full_bleed_style1`)
- Full-width design without card borders
- Border highlight on selection
- Background opacity change
- 8px border radius
- Suitable for: Immersive content experiences

**Full Bleed Style 2** (`mcq_full_bleed_style2`)
- Background color change on selection
- 5% opacity theme color background
- No border emphasis
- Suitable for: Clean, spacious layouts

**Full Bleed Style 3** (`mcq_full_bleed_style3`)
- Text color change on selection (theme color)
- Option labels displayed prominently
- Suitable for: Text-focused assessments

### 3.3 Label Types (6 variants)

1. **Default** (Index: 1): No labels, radio/checkbox only
2. **Alphabets_caps** (Index: 2): A, B, C, D, E, F, G, H, I, J
3. **Romantype** (Index: 3): I, II, III, IV, V, VI, VII, VIII, IX, X
4. **Numbers** (Index: 4): 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
5. **Alphabets_small** (Index: 5): a, b, c, d, e, f, g, h, i, j
6. **Roman** (Index: 6): i, ii, iii, iv, v, vi, vii, viii, ix, x

### 3.4 Color Schemes

Each style variant supports 10 predefined color schemes:
- **000000**: Black (default)
- **4a0d0d**: Dark Red
- **0d254a**: Dark Blue
- **1c633d**: Dark Green
- **545b15**: Olive
- **755200**: Brown
- **085f68**: Teal
- **550d85**: Purple
- **8c1d7e**: Magenta
- **195b94**: Blue

Custom color options available for:
- Top panel background
- Card background and border
- Bottom panel background
- Option backgrounds
- Shadow effects

---

## 4. File Structure

```
templates/multiple-choice-template/
│
├── config.txt                                      # Component registration config
├── multiple-choice-template-auth.html              # Main authoring template
├── mcq-media-template.html                         # Media component template
├── multiple-choice-template-settings.html          # Settings panel UI
│
├── default/
│   └── multiple-choice-template.json               # Default data structure (563 lines)
│
├── scripts/
│   ├── multiple-choice-template-directive.js       # Angular directive (2103 lines)
│   └── multiple-choice-template-preview1.js        # Preview/Reader logic (895 lines)
│
└── styles/
    ├── multiple-choice-template.css                # Main stylesheet
    ├── multiple-choice-data-template.css           # Data-specific styles
    ├── blue.css                                    # Theme-specific styles
    ├── kitaboo-radio.png                           # Radio button sprite
    └── images/
        ├── card/                                   # Card style images
        │   ├── 1/ (10 color variants)
        │   ├── 2/ (10 color variants)
        │   └── 3/ (10 color variants)
        └── bleed/                                  # Full bleed style images
            ├── 1/ (10 color variants)
            ├── 2/ (10 color variants)
            └── 3/ (10 color variants)
```

---

## 5. Data Model

### 5.1 Core Data Structure

```javascript
{
  "identifier": "multiple-choice-template",
  "header": "",                    // Component header text
  "introduction": "",              // Instruction text
  "instruction": "",               // Question text
  
  // Style configuration
  "style": {
    "selected_style": "card-style1",              // Current style
    "selected_label": 1,                           // Label type index
    "selected_label_class": "Default",             // Label CSS class
    "style_color": "red",                          // Theme color
    "selected_sub_style": "000000",                // Color variant
    "selected_sub_style_image": "...",             // Background image path
    "selected_sub_style_image_name": "1_1.png",    // Image filename
    "dynamic_edit": true,                          // Allow dynamic editing
    "custom_colors": {},                           // Custom color overrides
    "card_edit": false,                            // Card edit mode flag
    
    // Available style classes
    "class": {
      "card-style1": "card-style1",
      "card-style2": "card-style2",
      "card-style3": "card-style3",
      "mcq_full_bleed_style1": "mcq_full_bleed_style1",
      "mcq_full_bleed_style2": "mcq_full_bleed_style2",
      "mcq_full_bleed_style3": "mcq_full_bleed_style3"
    },
    
    // Color variant images for each style
    "images": { /* ... detailed in section 5.2 ... */ },
    
    // Custom color configuration
    "custom_color_options": { /* ... detailed in section 5.3 ... */ },
    
    // Style panel configuration
    "panel": { /* ... detailed in section 5.4 ... */ }
  },
  
  // Component settings
  "settings": {
    "Appearance": "#113e9a",                       // Theme color
    "isLayerEnable": false,                        // Sample answer layer
    "isLayerCheckBoxEnable": true,                 // Layer toggle available
    "colorwithopacity": "rgb(25,98,178,0.05)",     // Selection background
    "maxTries": 1,                                 // Max attempts allowed
    "pagebgcolor": "#fff",                         // Page background
    "isReset": "false",                            // Reset button enabled
    "isShowme": "true",                            // Show Me button enabled
    "allowRestart": false,                         // Try Again enabled
    "msOrSsBoolean": "single-select",              // Question type
    "feedbackCheckbox": false,                     // Individual feedback
    "shuftleChoiceCheckbox": false,                // Shuffle options
    "genericFeedbackCheckbox": false,              // Generic feedback
    "mcqoptionImage": false,                       // Image options enabled
    "showmecheckbox": false,                       // Show Me checkbox
    "reset": false,                                // Reset checkbox
    "isHeaderVisible": true,                       // Header visibility
    "isInstructionVisible": true,                  // Instruction visibility
    "mediaCheckbox": false,                        // Media enabled
    "mediaToUpload": "image",                      // Media type (image/video/audio)
    
    // Generic feedback messages
    "generic_correct_ans_default_text": "Congratulations! Your answer is correct",
    "generic_incorrect_ans_default_text": "Oops! You have selected the wrong answer",
    "generic_correct_ans_text": "",
    "generic_incorrect_ans_text": "",
    
    // Media settings
    "imageUrl": "images/image.jpg",
    "imageUploadOrReplace": "Upload",
    "imageName": "Image.jpg",
    "imageDimension": "",
    
    "uploadVideoType": "uploadVideo",
    "uploadVideoOnline": false,
    "uploadVideoFromDevice": true,
    "onlineVideoVendor": "YouTube",
    "onlineVideoVendorID": "",
    "onlineVideoURL": "",
    
    "uploadAudioType": "uploadAudio",
    "uploadAudioOnline": false,
    "uploadAudioFromDevice": true,
    
    // Label type configuration
    "label_type": [
      {"Type": "Default", "index": 1, "classname": "", "active": true},
      {"Type": "Alphabets_caps", "index": 2, "classname": "icon-label-type_alphabetical-capital-case", "active": false},
      {"Type": "Romantype", "index": 3, "classname": "icon-label-type_roman-capital-case", "active": false},
      {"Type": "Numbers", "index": 4, "classname": "icon-label-type_numeric", "active": false},
      {"Type": "Alphabets_small", "index": 5, "classname": "icon-label-type_alphabetical-small-case", "active": false},
      {"Type": "Roman", "index": 6, "classname": "icon-label-type_roman-small-case", "active": false}
    ]
  },
  
  // Question data
  "listData": [{
    "mcssData": {
      "type": "Multi Choice Single Select",
      "itemHeader": "",
      "itemQuestion": "",
      "itemText": "",
      "note": "",
      
      // Media object
      "media": {
        "id": "",
        "src": "images/image.jpg",
        "type": "WEBLINK",
        "altText": "",
        "captionText": "",
        "imageVisible": true,
        "imageSetting": { /* ... */ },
        "videoSetting": { /* ... */ }
      },
      
      "itemInstruction": "",
      "shuffleChoice": false,
      
      // Choice/Option list (2-10 options)
      "choiceList": [
        {
          "choice": {
            "fixed": false,
            "identifier": "A",
            "choiceText": "",
            "imageoption": false,
            "imageUrl": "images/image.jpg",
            "feedbackinline": ""
          }
        },
        // ... more options
      ],
      
      "modalAnswer": {
        "showHide": "hide",
        "text": ""
      },
      
      "correctChoice": ["C"],                      // Array of correct identifiers
      "isSingleSelect": true,                      // Question type flag
      "showHintIcon": false,
      "showExampleIcon": false,
      "addFeedback": false,
      "mediaVisible": false
    }
  }],
  
  // Hint and example
  "hint": "",
  "example": {
    "text": "",
    "media": { /* ... */ }
  },
  
  // Custom CSS and JS
  "custom": {
    "css": [
      "css/templates/multiple-choice-data-template.css",
      "css/templates/multiple-choice-template.css"
    ],
    "javascript": [
      "js/templates/multiple-choice-template-preview1.js"
    ]
  }
}
```

### 5.2 Style Images Configuration

Each style variant contains a map of image filenames to color hex codes:

```javascript
"images": {
  "card-style1": {
    "folder": "card",
    "subfolder": "1",
    "images": {
      "1_1.png": "000000",
      "1_2.png": "4a0d0d",
      // ... 8 more variants
    }
  },
  // ... other styles
}
```

### 5.3 Custom Color Options

Defines customizable color areas for each style:

```javascript
"custom_color_options": {
  "top_panel": {
    "title": "Top Panel",
    "initOpen": false,
    "styles": ["card-style2"],                     // Applicable styles
    "objects": [
      {
        "label": "Background",
        "spectrum": [
          {
            "id": "top_bg_solid",
            "color": "#000000",
            "selector": ".multiple-choice .sc-intro-holder",
            "property": "background-color",
            "prop_interpolation": "#COLOR#",
            "isActive": true
          }
        ]
      }
    ]
  },
  "card": { /* ... */ },
  "bottom_panel": { /* ... */ },
  "option": { /* ... */ },
  "shadow": { /* ... */ }
}
```

### 5.4 Option Data Structure

Each option in the `choiceList` array:

```javascript
{
  "choice": {
    "fixed": false,              // Fixed position (no shuffle)
    "identifier": "A",           // Display label
    "choiceText": "",           // Option content (HTML)
    "imageoption": false,       // Has image option
    "imageUrl": "images/image.jpg",
    "feedbackinline": "",       // Individual feedback (encrypted base64)
    "checked": false            // Selected state (runtime)
  }
}
```

---

## 6. Component Modes

### 6.1 Editor Mode (Authoring)

**Purpose**: Content creation and configuration

**Key Features**:
- Visual WYSIWYG editor for question and options
- Drag-and-drop ordering (disabled with shuffle)
- Add/remove options (2-10 options)
- Style selector with live preview
- Settings panel with extensive configuration
- Media upload and management
- Math equation support (MathQuill integration)
- Individual feedback editing (encrypted storage)

**Main File**: `multiple-choice-template-auth.html`

**Directive**: `mcq-template-data` in `multiple-choice-template-directive.js`

**Key Functions**:
- `addOptionClick()`: Add new option
- `removeOptionClick()`: Remove option
- `ssMsChange()`: Toggle single/multiple select
- `mcqApplyStyle()`: Apply style variant
- `addMediaClick()`: Enable media
- `setMediaToUpload()`: Set media type

### 6.2 Preview Mode (Validation)

**Purpose**: Author testing before publication

**Key Features**:
- Interactive question simulation
- Submit/Reset/Show Me/Try Again buttons
- Visual feedback (green/red borders)
- Individual and generic feedback display
- Attempt tracking
- No data persistence

**Main File**: `multiple-choice-template-preview1.js`

**Key Functions**:
- `SubmitAnswerMCQ()`: Validate answer
- `showAnswerMCQ()`: Display correct answers
- `resetAnswerMCQ()`: Reset to initial state
- `tryagainMCQ()`: Clear for retry
- `ifChecked()` / `ifUnchecked()`: Option selection handlers

### 6.3 Reader Mode (Runtime/Learner)

**Purpose**: End-user assessment experience

**Key Features**:
- Full interactivity with answer validation
- Progress tracking and scoring
- Attempt management with limits
- Feedback display based on configuration
- State persistence (SCORM/API integration)
- Shuffle options (if enabled)
- Latency time tracking
- Disability support (screen readers)

**State Management**:
```javascript
function stateMainatainMCQ(event) {
  var scoObj = {
    isSubmitEnable: boolean,
    isShowMeEnable: boolean,
    isTryAgainEnable: boolean,
    isResetEnable: boolean,
    totalNoOfAttempt: number,
    attemptsDone: number,
    feedbackMessage: object,
    isIndFeedbackEnable: boolean,
    inputSeleced: array,
    inputCorrect: array,
    inputIncorrect: array,
    dataType: string,
    componentId: string
  };
  saveAction(event, scoObj);  // API call
}
```

---

## 7. Style System

### 7.1 Style Application Mechanism

```javascript
// Style selection in editor
scope.mcqApplyStyle = function(styleName, event) {
  scope.fieldData.style.selected_style = styleName;
  scope.fieldData.style.selected_sub_style = firstColorCode;
  
  // Update component classes
  $(element).removeClass(oldStyles).addClass(styleName);
  
  // Load color picker for selected style
  scope.loadColorOptions(styleName);
  
  // Apply custom colors if exists
  scope.applyCustomColors();
  
  // Re-render option buttons
  scope.enrichOptionButtons();
};
```

### 7.2 Dynamic Color System

**Theme Color Application**:
```javascript
scope.colorchangeMcq = function(value) {
  // Primary color
  $('#target input[type="radio"]:checked ~ .checkmark')
    .css('background-color', value);
  
  // 5% opacity for selection background
  var rgba05 = convertToRGBA(value, 0.05);
  $('#target').scope().fieldData.settings.colorwithopacity = rgba05;
  
  // 30% opacity for option backgrounds
  var rgba30 = convertToRGBA(value, 0.3);
  $('#target div.iradio').css('background-color', rgba30);
  $('#target div.iradio.checked').css('background-color', value);
};
```

### 7.3 Custom Color Options

Allows per-style customization of:
- Top panel background and text
- Card background and borders
- Bottom panel background and text
- Option backgrounds
- Shadow effects

Stored in: `fieldData.style.custom_colors`

Example:
```javascript
"custom_colors": {
  "top_panel_Background": "background-color:#f0f0f0",
  "card_Background": "background-color:#ffffff",
  "bottom_panel_Background": "background-color:#000000;color:#ffffff"
}
```

---

## 8. User Interactions & Features

### 8.1 Option Management

**Add Option** (Max 10):
```javascript
$scope.addOptionClick = function(event) {
  if ($scope.fieldData.listData[0].mcssData.choiceList.length < 10) {
    $scope.fieldData.listData[0].mcssData.choiceList.push({
      "choice": {
        "fixed": "false",
        "identifier": "A",
        "choiceText": "",
        "feedbackinline": ""
      }
    });
    // Re-apply iCheck plugin
    $timeout(function() {
      $(element).find('.mcqradio').iCheck();
    }, 10);
  }
};
```

**Remove Option** (Min 2):
```javascript
$scope.removeOptionClick = function(index) {
  if ($scope.fieldData.listData[0].mcssData.choiceList.length > 2) {
    $scope.fieldData.listData[0].mcssData.choiceList.splice(index, 1);
    // Update selected option if removed
    if (index == $scope.selectedOptionIndex) {
      // Find new selected option or clear
    }
    $timeout(function() {
      $scope.reindexOptions();  // Update labels
    }, 0);
  }
};
```

**Option Image Upload**:
```javascript
$scope.imageOptionClick = function(index) {
  // Trigger file upload for specific option
  con.currentMcqOption = $scope.fieldData.listData[0].mcssData.choiceList;
  // Upload handler sets:
  // choiceList[index].choice.imageoption = true
  // choiceList[index].choice.imageUrl = uploadedPath
};
```

### 8.2 Answer Validation

**Submit Logic**:
```javascript
function SubmitAnswerMCQ(event) {
  var $form = $(event.target).parents('form');
  var attempts = Number($eventTarget.attr('data-attempts'));
  var totalAttempts = Number($eventTarget.attr('data-no-of-attempts'));
  
  // Check if all correct options are selected
  var allCorrect = 
    $form.find('input[data-iscorrect="' + MCQTrueEnc + '"]').length === 
    $form.find('.checked input[data-iscorrect="' + MCQTrueEnc + '"]').length &&
    $form.find('.checked input').length === 
    $form.find('.checked input[data-iscorrect="' + MCQTrueEnc + '"]').length;
  
  if (allCorrect && $form.hasClass('attempted-question')) {
    // CORRECT ANSWER
    $form.find('.checked input[data-iscorrect="' + MCQTrueEnc + '"]')
      .parents('.form-row').addClass('green-border');
    $form.find('input').prop('disabled', true);
    Example.show('Correct!', '', $form, 'correct', correctFeedback);
  } else {
    // INCORRECT ANSWER
    $form.find('.checked').parents('.form-row').addClass('red-border');
    $form.find('.checked input[data-iscorrect="' + MCQTrueEnc + '"]')
      .parents('.form-row').removeClass('red-border').addClass('green-border');
    
    if (attempts === totalAttempts) {
      // Last attempt - show correct answers
      $form.find('input[data-iscorrect="' + MCQTrueEnc + '"]')
        .parents('.form-row').addClass('green-border');
      $form.find('input').prop('disabled', true);
      Example.show('Incorrect!', '', $form, 'incorrect_last_try', incorrectFeedback);
    } else {
      // More attempts available
      $form.find('.tryagn-btn').removeClass('disabled');
      Example.show('Incorrect!', '', $form, 'incorrect_message', 'Please try again');
    }
  }
  
  // Update attempt counter
  $eventTarget.attr('data-attempts', attempts + 1);
}
```

### 8.3 Feedback System

**Individual Option Feedback**:
- Stored encrypted (base64) in `choice.feedbackinline`
- Decrypted on display: `decryptIndividualFeedbackMCQ()`
- Shows below each option after last attempt or show me
- Author sets per option in editor mode

**Generic Feedback**:
- Correct answer message: `settings.generic_correct_ans_text`
- Incorrect answer message: `settings.generic_incorrect_ans_text`
- Displays in modal popup
- Configurable in settings panel

**Feedback Display**:
```javascript
function Example.show(text, className, parent, localized_name, localized_message) {
  var alert_message = 
    '<div class="inline-alert mcq-ans-alert">' +
      '<div class="icon-close-filled icon-correct"></div>' +
      '<div><span class="ans-message">' + localized_message + '</span></div>' +
      '<div class="alert-btn"><a>OK</a></div>' +
    '</div>';
  
  $(parent).find(".inline-alert.mcq-ans-alert").remove();
  $(elem).insertBefore($(parent).find('.mcq-footer'));
  
  // Change icon based on correct/incorrect
  if (text == "Correct!") {
    $(parent).find('.icon-close-filled').removeClass('icon-close-filled');
  } else {
    $(parent).find('.icon-correct').removeClass('icon-correct');
  }
}
```

### 8.4 Try Again Feature

**Configuration**:
- Max tries: 1-5 (set in `settings.maxTries`)
- Displayed in settings: "Try Again Count" input
- Try Again button visibility: `settings.allowRestart`

**Behavior**:
```javascript
function tryagainMCQ(event) {
  var $form = $(event.target).parents('form');
  
  // Reset form
  $form.trigger('reset');
  $form.find('input').prop('disabled', false);
  $form.find('input').iCheck('update');
  
  // Clear feedback
  $form.find('.form-row').find(".individual-feedback").css({'display': 'none'});
  
  // Reset buttons
  $form.find('.submit-btn,.tryagn-btn').addClass('disabled');
  
  // Clear borders
  $form.find('.red-border,.green-border')
    .removeClass('red-border green-border');
  
  // Clear alert
  $form.find('.inline-alert').remove();
  
  // Re-enable interaction
  $form.find('ins').css('cursor', 'pointer');
}
```

### 8.5 Show Me Feature

**Functionality**: Reveals correct answers without validation

```javascript
function showAnswerMCQ(event) {
  var $form = $(event.target).parents('form');
  
  // Reset all selections
  $form.find('input').prop('disabled', false);
  $form.find('input').prop("checked", false);
  $form.find('input').removeAttr('checked').iCheck('update');
  
  // Select correct answers
  $form.find('input[data-iscorrect="' + MCQTrueEnc + '"]')
    .prop("checked", true)
    .iCheck('update')
    .iCheck('check');
  
  // Disable further interaction
  $form.find('input').prop('disabled', true);
  $form.find('.submit-btn,.tryagn-btn,.showme-btn,.reset').addClass('disabled');
  
  // Highlight correct options
  $form.find('input[data-iscorrect="' + MCQTrueEnc + '"]')
    .parents('.form-row').addClass('green-border');
  
  // Show individual feedback if enabled
  if (showIndFeedBack) {
    $form.find('.iradio, .icheckbox').parents('.form-row')
      .find(".individual-feedback").attr('style', 'display: block !important;');
  }
}
```

### 8.6 Shuffle Options

**Configuration**: `settings.shuftleChoiceCheckbox`

**Implementation** (Reader mode only):
```javascript
function shuffleMcqOptions(currentElement) {
  var shuffledOptionsArray = shuffle($(currentElement).find('.form-row'));
  $(currentElement).find('.question-select-wrap').html(shuffledOptionsArray);
  
  // Reinitialize iCheck plugin
  $(currentElement).find('.form-row .icheck').iCheck('destroy');
  $(currentElement).find('.form-row .icheck').iCheck();
  $(currentElement).find('.form-row .icheck').on('ifChecked', ifChecked);
  $(currentElement).find('.form-row .icheck').on('ifUnchecked', ifUnchecked);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
```

### 8.7 Sample Answer Layer

**Purpose**: Display sample answers for reference (typically in answer keys)

**Configuration**:
- `settings.isLayerEnable`: Enable/disable layer
- `settings.isLayerCheckBoxEnable`: Whether toggle is available (disabled in certain contexts)

**Implementation**:
```javascript
$scope.addLayer = function(value, element) {
  let targetElementForAddLayer = $(element).closest('.customClass');
  let LayerParent = $(element).closest('.sd-item');
  let mainContainer = $(element).closest('.save-html');
  
  if (value) {
    $(LayerParent).css('margin-top', '0px');
    mainContainer.find('.sample-layer-marker').remove();
    
    let sampleDiv = $('<div>')
      .addClass('sample-layer-marker')
      .text('Sample Answers: On');
    
    $(LayerParent).addClass('settingLayer');
    $(targetElementForAddLayer).attr('data-isLayerCheckBoxEnable', true);
    $(targetElementForAddLayer).attr('data-sampletaginfo', 
      JSON.stringify({ Sample_Answers: 'On' }));
    
    mainContainer.find('.sd-item').first().before(sampleDiv);
  } else {
    $(LayerParent).css('margin-top', '20px');
    mainContainer.find('.sample-layer-marker').remove();
    $(targetElementForAddLayer).removeAttr('data-isLayerCheckBoxEnable');
    $(LayerParent).removeClass('settingLayer');
    $(targetElementForAddLayer).removeAttr('data-sampletaginfo');
  }
};
```

---

## 9. Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        EDITOR MODE                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  1. Author Creates MCQ                                          │
│     ├─ Select style (card-style1, mcq_full_bleed_style2, etc) │
│     ├─ Set question type (single/multiple select)              │
│     ├─ Add/edit question text                                  │
│     ├─ Add/remove options (2-10)                               │
│     ├─ Set correct answer(s)                                   │
│     ├─ Add media (image/video/audio) - optional                │
│     ├─ Configure settings (attempts, feedback, shuffle)        │
│     └─ Add individual feedback - optional                      │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  2. Data Transformation                                         │
│     ├─ Angular scope updates fieldData object                  │
│     ├─ Individual feedback encrypted (base64)                  │
│     ├─ Correct answers stored in correctChoice array           │
│     ├─ Media URLs and settings stored                          │
│     └─ Style and color config embedded                         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  3. JSON Storage                                                │
│     ├─ savedJson[pageNo][uniqueId] = fieldData                 │
│     ├─ Persisted to backend via API                            │
│     └─ Linked to book/chapter structure                        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                       PREVIEW/READER MODE                       │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  4. Component Initialization                                    │
│     ├─ Load JSON from backend                                  │
│     ├─ Parse fieldData structure                               │
│     ├─ Apply style classes to DOM                              │
│     ├─ Render options with labels                              │
│     ├─ Initialize iCheck plugin (radio/checkbox styling)       │
│     ├─ Load media (audio/video players)                        │
│     ├─ Shuffle options if enabled                              │
│     └─ Decrypt individual feedback (stored for later)          │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  5. User Interaction                                            │
│     ├─ User selects option(s)                                  │
│     │   ├─ ifChecked event fired                               │
│     │   ├─ Visual styling applied (MCQCustomStyling)           │
│     │   ├─ Submit button enabled                               │
│     │   └─ Latency time tracked                                │
│     │                                                           │
│     ├─ User clicks Submit                                      │
│     │   ├─ SubmitAnswerMCQ() called                            │
│     │   ├─ Validate selected vs correct answers               │
│     │   ├─ Apply green/red borders                             │
│     │   ├─ Show feedback popup                                 │
│     │   ├─ Show individual feedback if last attempt            │
│     │   ├─ Update attempt counter                              │
│     │   └─ Enable/disable Try Again button                     │
│     │                                                           │
│     ├─ User clicks Try Again (if available)                    │
│     │   ├─ tryagainMCQ() called                                │
│     │   ├─ Reset form and borders                              │
│     │   ├─ Re-enable options                                   │
│     │   └─ Clear feedback                                      │
│     │                                                           │
│     ├─ User clicks Show Me                                     │
│     │   ├─ showAnswerMCQ() called                              │
│     │   ├─ Auto-select correct answers                         │
│     │   ├─ Highlight correct options                           │
│     │   ├─ Disable all interaction                             │
│     │   └─ Show individual feedback                            │
│     │                                                           │
│     └─ User clicks Reset                                       │
│         ├─ resetAnswerMCQ() called                             │
│         ├─ Clear all selections                                │
│         ├─ Reset UI to initial state                           │
│         └─ Disable submit button                               │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  6. State Persistence (Reader Mode Only)                        │
│     ├─ stateMainatainMCQ() called on every interaction        │
│     ├─ Build state object:                                     │
│     │   ├─ Button states (enabled/disabled)                    │
│     │   ├─ Attempt counters                                    │
│     │   ├─ Selected options                                    │
│     │   ├─ Correct/incorrect indicators                        │
│     │   └─ Feedback visibility                                 │
│     ├─ saveAction(event, scoObj) - API call                    │
│     └─ SCORM/LMS integration for progress tracking             │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  7. Scoring & Analytics                                         │
│     ├─ Calculate score based on attempts                       │
│     ├─ Track correct/incorrect/unattempted                     │
│     ├─ Store latency time                                      │
│     ├─ Update learner progress                                 │
│     └─ Generate reports                                        │
└────────────────────────────────────────────────────────────────┘
```

### Detailed Component Interaction Flow

```
User Action                  Component Response               Backend/State
───────────                  ──────────────────               ─────────────

[Select Option]  ──────────> ifChecked() event
                              │
                              ├─> Apply MCQCustomStyling()
                              │   ├─ Change background color
                              │   ├─ Change border/text style
                              │   └─ Based on selected_style
                              │
                              ├─> Enable Submit button
                              ├─> Mark form as "attempted-question"
                              └─> Track latency time  ─────────> Save timestamp

[Click Submit]   ──────────> SubmitAnswerMCQ()
                              │
                              ├─> Compare selections with correctChoice[]
                              │   ├─ All correct? ──> SUCCESS PATH
                              │   │   ├─ Add green-border class
                              │   │   ├─ Show correct feedback
                              │   │   ├─ Disable options
                              │   │   └─ Show individual feedback
                              │   │
                              │   └─ Has errors? ──> ERROR PATH
                              │       ├─ Add red-border to wrong
                              │       ├─ Add green-border to correct
                              │       ├─ Increment attempts
                              │       ├─ Check if last attempt
                              │       │   ├─ YES: Show all correct answers
                              │       │   └─ NO: Enable Try Again
                              │       └─ Show feedback popup
                              │
                              ├─> Update attempt counter
                              └─> Call stateMainatainMCQ() ────> Save state to LMS

[Click Try Again] ─────────> tryagainMCQ()
                              │
                              ├─> Reset form (trigger('reset'))
                              ├─> Clear all borders
                              ├─> Re-enable options
                              ├─> Hide feedback
                              └─> Reset button states

[Click Show Me]   ─────────> showAnswerMCQ()
                              │
                              ├─> Auto-check correct options
                              ├─> Add green-border to all correct
                              ├─> Disable all interaction
                              ├─> Show individual feedback
                              └─> Call stateMainatainMCQ() ────> Save state to LMS

[Click Reset]     ─────────> resetAnswerMCQ()
                              │
                              ├─> Clear all selections
                              ├─> Remove all borders
                              ├─> Reset button states
                              └─> Call stateMainatainMCQ() ────> Save state to LMS
```

---

## 10. Technical Implementation

### 10.1 Core Technologies

**Frontend Framework**:
- **AngularJS 1.x**: Directive-based architecture
- **jQuery**: DOM manipulation and event handling
- **iCheck**: Radio/checkbox styling and events
- **Bootstrap**: Grid and UI components

**Plugins & Libraries**:
- **MathQuill 2.0**: Math equation rendering
- **audiojs**: Audio player
- **video.js**: Video player
- **Spectrum.js**: Color picker
- **iCheck**: Custom checkbox/radio styling

**File Processing**:
- **html2canvas**: Screenshot generation
- **jsPDF**: PDF export
- **Cropper.js**: Image cropping

### 10.2 Angular Directive Structure

```javascript
App.directive('mcqTemplateData', ['modalService', '$timeout', '$compile', '$sce', 
  function(modalService, $timeout, $compile, $sce) {
    return {
      restrict: 'EA',
      replace: false,
      
      // Controller: Business logic
      controller: function($scope, $compile) {
        // Option management
        $scope.addOptionClick = function(event) { /* ... */ };
        $scope.removeOptionClick = function(index) { /* ... */ };
        $scope.imageOptionClick = function(index) { /* ... */ };
        
        // Answer selection
        $scope.setChoiceList = function(index) { /* ... */ };
        $scope.ssMsChange = function(type) { /* ... */ };
        
        // Media handling
        $scope.addMediaClick = function(state) { /* ... */ };
        $scope.setMediaToUpload = function(type) { /* ... */ };
        
        // Style management
        $scope.mcqApplyStyle = function(styleName, event) { /* ... */ };
        $scope.mcqApplySubStyle = function(style, key, value, event) { /* ... */ };
        $scope.applyCustomColor = function(event) { /* ... */ };
        
        // Settings
        $scope.allowActivityRestart = function(state) { /* ... */ };
        $scope.addFeedback = function(state) { /* ... */ };
        $scope.addGenericFeedback = function(state) { /* ... */ };
        $scope.enableShuffling = function(state) { /* ... */ };
        
        // Visibility toggles
        $scope.onHeaderVisibilityChanged = function(state) { /* ... */ };
        $scope.onInstructionVisibilityChanged = function(state) { /* ... */ };
        
        // Label type
        $scope.labelvalue = function(val, type, key) { /* ... */ };
        $scope.enrichOptionButtons = function() { /* ... */ };
        
        // Color management
        $scope.colorchangeMcq = function(value) { /* ... */ };
      },
      
      // Link: DOM manipulation and event binding
      link: function(scope, element, attr) {
        $timeout(function() {
          // Initialize equation holders
          $(element).find(".auth-equation-holder").each(function(i) {
            setLatexData(this, $(this).attr('data-equation-latex'));
          });
          
          // Initialize iCheck plugin
          element.find('.icheck').iCheck();
          
          // Bind selection events
          $(element).on('ifChecked', '.mcq-body .iradio,.mcq-body .icheckbox', 
            function(event) {
              // Apply styling based on selected style
              // Update data model
              // Enable save button
            }
          );
          
          $(element).on('ifUnchecked', '.mcq-body .iradio,.mcq-body .icheckbox', 
            function(event) {
              // Reset styling
              // Update data model
            }
          );
          
          // Click handler for component activation
          $(element).parents('.sd-item').bind('click', function(e, isCustom) {
            // Highlight component
            // Load settings panel
            // Update controller scope
          });
          
          // Audio/video initialization
          scope.loadAudioVideo(element);
          
          // Apply custom colors
          scope.applyCustomColor();
          
          // Load saved state
          var pageNo = $(element).attr('page-no');
          var uniqueId = $(element).attr('saved-index');
          if (pageNo && uniqueId) {
            con.currSettings = con.savedJson[pageNo][uniqueId].settings;
            con.currStyles = con.savedJson[pageNo][uniqueId].style;
          }
        }, 0);
      }
    };
  }
]);
```

### 10.3 iCheck Integration

**Purpose**: Styled radio buttons and checkboxes with consistent behavior

**Initialization**:
```javascript
element.find('.icheck').iCheck({
  checkboxClass: 'icheckbox',
  radioClass: 'iradio'
});
```

**Event Binding**:
```javascript
// On selection
$(element).on('ifChecked', '.form-row .icheck', function(event) {
  $(event.target).addClass('user-selected');
  var $form = $(event.target).parents('form');
  $form.find('.submit-btn').removeClass('disabled');
  $form.find('.reset').removeClass('disabled');
  $form.addClass("attempted-question");
  
  MCQCustomStyling($(event.target));
  
  if (typeof apiHandle != "undefined") {
    stateMainatainMCQ(event);
  }
});

// On deselection
$(element).on('ifUnchecked', '.form-row .icheck', function(event) {
  $(event.target).removeClass('user-selected');
  // Reset styling
  $(event.target).parents('.form-row')
    .css({'background-color': '', 'border-color': '', 'border-left': ''});
  
  if (typeof apiHandle != "undefined") {
    stateMainatainMCQ(event);
  }
});
```

### 10.4 Custom Styling Application

```javascript
function MCQCustomStyling(target) {
  var $form = target.parents('form');
  var color = target.parents('.component-holder')[0].style.borderColor;
  var themeopacity = convertToRGBA(color, 0.05);
  
  // Style based on component style class
  if (target.parents('.component-holder').hasClass('mcq_full_bleed_style2')) {
    target.parents('.form-row').css('background-color', themeopacity);
  } 
  else if (target.parents('.component-holder').hasClass('card-style2')) {
    target.parents('.form-row').css('border-color', color);
    if (target.parents('.question-select-wrap').hasClass('single-questions')) {
      target.parent().next('.mcq-options').find('.radio-text')
        .css('color', 'black');
    } else {
      target.parent().next('.mcq-options').find('.radio-text')
        .css({'font-weight': 'bold', 'color': 'black'});
    }
  }
  else if (target.parents('.component-holder').hasClass('mcq_full_bleed_style3')) {
    target.parent().next('.mcq-options').find('.radio-text')
      .css('color', color);
  }
  else if (target.parents('.component-holder').hasClass('card-style1')) {
    target.parents('.form-row').css('background-color', themeopacity);
    target.parents('.form-row').css('border-left', '2px solid ' + color);
    target.parents('.form-row').css('box-shadow', '0 2px 3px 0px rgba(0, 0, 0, 0.15)');
  }
  else if (target.parents('.component-holder').hasClass('card-style3')) {
    if (target.attr('type') == "checkbox") {
      target.parent().find('input[type="checkbox"]:checked')
        .parents('.icheckbox').css('background-color', color);
    } else {
      target.parent().next('.mcq-options').find('.radio-text')
        .css('font-weight', 'bold');
    }
  }
  
  // Update checkmark/checkboxmark
  var themeColor = target.parents('.component-holder')[0].style.borderColor;
  var result30 = convertToRGBA(themeColor, 0.3);
  
  if (target.attr('type') == "radio") {
    target.parents('.single-questions').find('div.iradio')
      .css('background-color', result30);
    target.parent().find('.checkmark')
      .css({'background-color': themeColor, 'box-shadow': 'inset 0 0 0 5px #fff'});
    target.parents(".form-row").find('div.iradio')
      .css('background-color', themeColor);
  } else if (target.attr('type') == "checkbox") {
    target.parent().find('.checkboxmark')
      .css('background-color', themeColor);
  }
}
```

### 10.5 Feedback Encryption/Decryption

**Why Encrypt?** 
To prevent learners from viewing correct answers in browser dev tools or source code.

**Encryption (Editor)**:
```javascript
// Before saving, individual feedback is encoded
var feedbackText = option.choice.feedbackinline;
var encodedFeedback = btoa(unescape(encodeURIComponent(feedbackText)));
option.choice.feedbackinline = encodedFeedback;
```

**Decryption (Reader)**:
```javascript
function decryptIndividualFeedbackMCQ(event) {
  $(event.target).parents('.customClass[data-type="multiple-choice-template"]')
    .eq(0).find('.individual-feedback').each(function(index, item) {
      try {
        let data1 = $(item).find('span.template-instruction').eq(0).text().trim();
        let data2 = $(item).find('.individual-feedback-text').eq(0).text().trim();
        
        // Decrypt: base64 decode -> decodeURIComponent -> display
        let newData1 = decodeURIComponent(escape(window.atob(data1)));
        let newData2 = decodeURIComponent(escape(window.atob(data2)));
        
        $(item).find('.template-instruction').eq(0).text(newData1);
        $(item).find('.individual-feedback-text').eq(0).text(newData2);
      } catch(e) {
        console.log('Decryption error:', e);
      }
    });
}
```

### 10.6 Math Equation Support

**Library**: MathQuill 2.0

**Rendering**:
```javascript
function setLatexData(mathHolder, encodedString) {
  var MQData = MathQuill.getInterface(2);
  var dataCall = MQData.StaticMath(mathHolder, {});
  var decodedLatex = JSON.parse(decodeURIComponent(encodedString)).latex;
  dataCall.latex(decodedLatex);
}

// In link function
$(element).find(".auth-equation-holder").each(function(i) {
  $(this).empty();
  setLatexData(this, $(this).attr('data-equation-latex'));
  $(this).on('click', scope.onAuthEquationClick);
});
```

**Editor Integration**:
```javascript
$scope.onMathEditiorClick = function(event, currEqBox) {
  var mathEditFrame = $('#equationiframe');
  $("#equationPopup").modal('show');
  
  if (event === false) {  // Edit existing equation
    var encodeString = $(currEqBox).attr('data-equation-latex');
    mathEditFrame.attr('data-equation-latex', encodeString)
                 .attr('data-edit', true);
  } else {  // New equation
    mathEditFrame.removeAttr('data-equation-latex')
                 .removeAttr('data-edit');
  }
};
```

### 10.7 Media Handling

**Image Upload**:
```javascript
// Trigger: uploadfiles directive
$('#upload-comp-img').on('click', function() {
  // File input dialog
  // On file select:
  //   - Upload to server
  //   - Get URL
  //   - Update fieldData.listData[0].mcssData.media.imageSetting.imageUrl
  //   - Update preview
});

// Display
<img class="img-responsive" 
     ng-src="{{fieldData.listData[0].mcssData.media.imageSetting.imageUrl}}" 
     ng-if="fieldData.listData[0].mcssData.media.imageVisible">
```

**Video Integration**:
```javascript
// Local video
<video class="video-js vjs-default-skin" controls 
       data-videosrc="{{fieldData.listData[0].mcssData.media.src}}">
  <source ng-src="{{fieldData.listData[0].mcssData.media.src | trusted}}" 
          type="video/mp4">
</video>

// YouTube video
<iframe class="embed-responsive-item" 
        ng-src="{{fieldData.settings.onlineVideoURL | trusted}}" 
        allowfullscreen></iframe>
```

**Audio Integration**:
```javascript
// audiojs library initialization
scope.loadAudioVideo = function(element) {
  if ($(element).find('audio').length > 0) {
    var audioScr = scope.fieldData.listData[0].mcssData.media.src;
    $(element).find('audio').attr('src', audioScr);
    audiojs.create($(element).find('audio')[0]);
    
    // Handle blank audio (no source)
    if (!audioScr || audioScr === "images/image.jpg") {
      $(element).find('.play-pause').addClass('blank-audio');
      $(element).find('.scrubber').addClass('blank-audio');
    }
  }
};
```

---

## 11. Error Handling

### 11.1 Common Error Scenarios

#### Error 1: Minimum Options Constraint
**Issue**: Author tries to remove option when only 2 remain

**Handling**:
```javascript
$scope.removeOptionClick = function(index) {
  if ($scope.fieldData.listData[0].mcssData.choiceList.length > 2) {
    // Allow removal
  } else {
    // Silently prevent removal (button disabled in UI)
    return;
  }
};
```

**UI Prevention**:
```html
<a href="#" class="row-delete" 
   ng-click="removeOptionClick($index, 'reapplyAlphaIndex')" 
   ng-class="{'btn-disabled': fieldData.listData[0].mcssData.choiceList.length <= 2}">
  <i class="icon-Delete"></i>
</a>
```

#### Error 2: Maximum Options Constraint
**Issue**: Author tries to add more than 10 options

**Handling**:
```javascript
$scope.addOptionClick = function(event) {
  if ($scope.fieldData.listData[0].mcssData.choiceList.length < 10) {
    // Allow addition
  } else {
    // Silently prevent addition (button disabled in UI)
    return false;
  }
};
```

**UI Prevention**:
```html
<label for="add-option" 
       data-ng-click="addOptionClick($event)" 
       ng-class="fieldData.listData[0].mcssData.choiceList.length >= 10 ? 'btn-disabled' : ''">
  <i class="icon-Add"></i> Add Option
</label>
```

#### Error 3: No Option Selected on Submit
**Issue**: Learner clicks Submit without selecting any option

**Handling**:
```javascript
// Submit button remains disabled until selection
$('.form-row .icheck').on('ifChecked', function(event) {
  var $form = $(event.target).parents('form');
  $form.find('.submit-btn').removeClass('disabled');
});

// If somehow submitted without selection, validation fails gracefully
if (!$form.find('.checked input').length) {
  // No action taken, button should be disabled anyway
  return;
}
```

#### Error 4: Audio/Video Loading Failure
**Issue**: Media file not found or loading error

**Handling**:
```javascript
// Audio error handling
$(element).find('audio').on('error', function() {
  $(this).parents('.audio-source').find('.audiojs').addClass('error');
  $(this).parents('.audio-source').find('.play-pause').addClass('blank-audio');
  // Show placeholder instead of broken player
});

// Video error handling
<video onerror="this.style.display='none'; 
                $(this).parent().append('<div class=\'video-error\'>Video not available</div>');">
  <source src="...">
</video>
```

#### Error 5: Invalid Try Again Count
**Issue**: Author enters invalid number for max tries

**Handling**:
```javascript
// Input validation on blur
$('#try-again-count').on('blur', function() {
  var thisVal = parseInt($(this).val());
  
  if (isNaN(thisVal)) {
    thisVal = 3;  // Default
    $('#try-again-count').val(thisVal);
  } else if (thisVal < 1) {
    thisVal = 1;  // Minimum
    $('#try-again-count').val(thisVal);
  } else if (thisVal > 5) {
    thisVal = 5;  // Maximum
    $('#try-again-count').val(thisVal);
  }
  
  scope.setDataAttr('.mcq-submit', 'data-no-of-attempts', thisVal + 1);
});

// Keyboard input restriction
scope.isWithinTryAgainRange = function(event) {
  var allowedKeys = {
    39: true, 37: true, 27: true, 8: true, 9: true, 
    13: true, 46: true, 49: true, 50: true, 51: true, 
    52: true, 53: true  // 1-5 only
  };
  
  if (!allowedKeys[event.keyCode]) {
    event.preventDefault();
  }
};
```

#### Error 6: Missing Correct Answer
**Issue**: Author doesn't set any correct answer

**Handling**:
```javascript
// In editor mode, first option is auto-selected as correct
if (!$(element).hasClass('mcq-sett')) {
  var arrLen = scope.fieldData.listData[0].mcssData.choiceList;
  var isSelectedSaved = false;
  
  for (i = 0; i < arrLen.length; i++) {
    if (scope.fieldData.listData[0].mcssData.choiceList[i].choice.checked == true) {
      isSelectedSaved = true;
      break;
    }
  }
  
  if (isSelectedSaved == false) {
    // Auto-select first option
    scope.fieldData.listData[0].mcssData.choiceList[0].choice.checked = true;
    scope.selectedOption = scope.fieldData.listData[0].mcssData.choiceList[0];
    scope.selectedOptionIndex = 0;
  }
}
```

#### Error 7: Equation Rendering Failure
**Issue**: Invalid LaTeX or missing MathQuill library

**Handling**:
```javascript
function setLatexData(mathHolder, encodedString) {
  try {
    var MQData = MathQuill.getInterface(2);
    var dataCall = MQData.StaticMath(mathHolder, {});
    var decodedLatex = JSON.parse(decodeURIComponent(encodedString)).latex;
    dataCall.latex(decodedLatex);
  } catch(e) {
    console.error('Math rendering error:', e);
    $(mathHolder).text('[Math Error]');
  }
}
```

### 11.2 Validation Rules

**Client-Side Validation**:
1. **Option Count**: 2 ≤ options ≤ 10
2. **Max Tries**: 1 ≤ attempts ≤ 5
3. **At Least One Correct**: Auto-select first if none chosen
4. **Option Text**: Can be empty (author responsibility)
5. **Media URLs**: Validated on upload, not on render
6. **Color Codes**: Must be valid hex (#RRGGBB)

**Server-Side Validation** (assumed):
1. **JSON Structure**: Must match schema
2. **Media File Size**: Limits enforced on upload
3. **Text Length**: Reasonable limits for database storage
4. **XSS Prevention**: HTML sanitization

---

## 12. Offline/Package Behavior

### 12.1 SCORM Package Mode

**Scenario**: MCQ component in exported SCORM package for offline use

**Key Differences**:
1. **No Server Calls**: All data embedded in package
2. **Local Media**: All images/videos/audio included in package
3. **State Persistence**: Uses SCORM API (SCORMAdapter)
4. **Encryption**: Individual feedback still encrypted in package

**Implementation**:
```javascript
// Detect SCORM environment
if (typeof apiHandle != "undefined") {
  // SCORM mode active
  stateMainatainMCQ(event);  // Calls SCORM API
} else {
  // Standalone mode (no persistence)
}
```

**State Persistence**:
```javascript
function stateMainatainMCQ(event) {
  // Build state object
  var scoObj = {
    isSubmitEnable: !$form.find(".submit-btn").hasClass("disabled"),
    attemptsDone: Number($form.find(".submit-btn").attr('data-attempts')),
    inputSeleced: [],  // Selected option IDs
    inputCorrect: [],  // Correct option IDs
    inputIncorrect: [],  // Incorrect option IDs
    feedbackMessage: {},
    componentId: $form.parents(".customClass").eq(0).attr('data-saved-index')
  };
  
  // Save to SCORM
  saveAction(event, scoObj);
}

function saveAction(event, scoObj) {
  if (typeof apiHandle != "undefined" && apiHandle) {
    // SCO API call
    var jsonString = JSON.stringify(scoObj);
    apiHandle.LMSSetValue(
      'cmi.interactions.' + scoObj.componentId + '.student_response', 
      jsonString
    );
    apiHandle.LMSCommit('');
  }
}
```

**Loading Saved State**:
```javascript
// On component initialization in SCORM mode
if (typeof apiHandle != "undefined") {
  var savedState = apiHandle.LMSGetValue(
    'cmi.interactions.' + componentId + '.student_response'
  );
  
  if (savedState) {
    var stateObj = JSON.parse(savedState);
    
    // Restore button states
    if (!stateObj.isSubmitEnable) {
      $form.find('.submit-btn').addClass('disabled');
    }
    
    // Restore selections
    stateObj.inputSeleced.forEach(function(optionId) {
      $('#' + optionId).iCheck('check');
    });
    
    // Restore correct/incorrect indicators
    stateObj.inputCorrect.forEach(function(optionId) {
      $('#' + optionId).parents('.form-row').addClass('green-border');
    });
    stateObj.inputIncorrect.forEach(function(optionId) {
      $('#' + optionId).parents('.form-row').addClass('red-border');
    });
    
    // Restore attempt counter
    $form.find('.submit-btn').attr('data-attempts', stateObj.attemptsDone);
    
    // Restore feedback visibility
    if (stateObj.feedbackMessage.enable) {
      Example.show(
        stateObj.feedbackMessage.symbol, 
        '', 
        $form, 
        '', 
        stateObj.feedbackMessage.message
      );
    }
  }
}
```

### 12.2 Offline ePub Mode

**Scenario**: MCQ in ePub3 package for e-readers

**Limitations**:
1. **JavaScript Support**: Depends on e-reader
2. **Complex Interactions**: May not work on all devices
3. **Media Support**: Video/audio may be limited
4. **No External Resources**: All assets must be packaged

**Fallback Strategies**:
```javascript
// Detect ePub environment
var isEpub = (typeof navigator.epubReadingSystem !== 'undefined');

if (isEpub) {
  // Disable features not supported
  $scope.fieldData.settings.mediaCheckbox = false;
  $scope.fieldData.settings.shuffleCheckbox = false;
  
  // Use simpler styling
  $scope.fieldData.style.selected_style = 'card-style1';
  
  // Fallback for audio/video
  $('video, audio').replaceWith('<p>[Media not available in ePub]</p>');
}
```

### 12.3 Print/PDF Export

**Scenario**: Print-friendly version for worksheets

**Implementation**:
```javascript
// Print mode detection
var isPrintMode = window.matchMedia('print').matches;

if (isPrintMode) {
  // Show all options without interaction
  $('.icheck').css('pointer-events', 'none');
  
  // Show correct answers (for answer key)
  if (showAnswers) {
    $('.form-row').each(function() {
      var $option = $(this).find('.icheck');
      if ($option.attr('data-iscorrect') === btoa('true')) {
        $(this).append('<span class="print-indicator">✓ Correct</span>');
      }
    });
  }
  
  // Remove interactive buttons
  $('.mcq-footer').remove();
  
  // Linearize media
  $('video, audio').replaceWith(function() {
    return '<p>[' + $(this).attr('alt') + ': ' + $(this).attr('src') + ']</p>';
  });
}
```

---

## 13. Known Issues

### 13.1 Critical Issues

#### Issue 1: iCheck Double-Wrapping on Shuffle
**Description**: When shuffle is enabled and options are dynamically re-rendered, iCheck plugin wraps radio/checkbox multiple times, causing duplicate elements.

**Location**: `multiple-choice-template-preview1.js`, line ~850

**Code**:
```javascript
function shuffleMcqOptions(currentElement) {
  // ... shuffle logic ...
  
  // This attempts to fix it but not always reliable
  $(currentElement).find('.form-row').each(function(index, item) {
    if ($(item).find('div.iradio').length > 1) {
      $(item).children('div.iradio').contents().unwrap();
      $(item).children('ins.iCheck-helper').remove();
    }
  });
}
```

**Impact**: Visual glitches, click events may fire twice

**Workaround**: Destroy and reinitialize iCheck plugin
```javascript
$(currentElement).find('.form-row .icheck').iCheck('destroy');
$(currentElement).find('.form-row .icheck').iCheck();
```

**Proper Fix Needed**: Implement proper cleanup before shuffle

#### Issue 2: Feedback Decryption Failure on Rapid Clicks
**Description**: If user clicks Submit rapidly multiple times, decryption function may fail with empty/null values.

**Location**: `multiple-choice-template-preview1.js`, `decryptIndividualFeedbackMCQ()`

**Code**:
```javascript
try {
  let data1 = $(item).find('span.template-instruction').eq(0).text().trim();
  let newData1 = decodeURIComponent(escape(window.atob(data1)));
  // Sometimes data1 is already decrypted from previous call
} catch(e) {
  console.log(e);  // Silently fails, feedback not shown
}
```

**Impact**: Individual feedback may not display

**Workaround**: Add flag to track decryption state
```javascript
if ($(item).attr('data-decrypted') === 'true') {
  return;  // Already decrypted
}
// ... decrypt ...
$(item).attr('data-decrypted', 'true');
```

#### Issue 3: Theme Color Not Applied on Load
**Description**: When component loads with custom theme color, radio/checkbox backgrounds don't update until first interaction.

**Location**: `multiple-choice-template-directive.js`, `enrichOptionButtons()`

**Impact**: Visual inconsistency on initial load

**Cause**: `enrichOptionButtons()` called before `fieldData.settings.Appearance` is populated

**Fix**: Call `enrichOptionButtons()` in a second $timeout after data load
```javascript
$timeout(function() {
  scope.enrichOptionButtons();
  scope.colorchangeMcq(scope.fieldData.settings.Appearance);
}, 100);
```

### 13.2 Minor Issues

#### Issue 4: Math Equation Alignment in Options
**Description**: Math equations in option text sometimes misalign with checkbox/radio button.

**Impact**: Visual only, no functional impact

**CSS Fix**:
```css
.mcq-options .auth-equation-holder {
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px;
}
```

#### Issue 5: Audio Player Persistence Across Media Switch
**Description**: When switching from audio to video/image, old audio player sometimes remains in DOM.

**Location**: `multiple-choice-template-directive.js`, `setMediaToUpload()`

**Workaround**: Explicitly remove audio elements
```javascript
case 'video':
case 'image':
  currentTarget.find('.audiojs, audio').remove();
  break;
```

#### Issue 6: Label Re-indexing on Option Removal
**Description**: When option is removed, labels (A, B, C, etc.) don't always update immediately.

**Location**: `multiple-choice-template-directive.js`, `removeOptionClick()`

**Current Fix**: Calls `reindexOptions()` in $timeout, but delay noticeable

**Better Fix**: Update labels synchronously
```javascript
$scope.removeOptionClick = function(index) {
  // ... remove option ...
  $scope.reindexOptions();  // Remove $timeout wrapper
};
```

#### Issue 7: Group Activity Integration Issues
**Description**: When MCQ is inside Group Activity template, some settings don't sync properly (max tries, appearance).

**Location**: Multiple files

**Impact**: Settings may revert to defaults in nested context

**Root Cause**: `#target` ID conflicts when nested

**Recommendation**: Refactor to use data attributes instead of `#target` ID

### 13.3 Browser-Specific Issues

#### Issue 8: Safari - iCheck Click Detection
**Description**: On Safari (iOS/macOS), iCheck sometimes doesn't register clicks on first tap.

**Workaround**: Added touch-punch library for better touch support
```html
<script src="js/jquery.ui.touch-punch.js"></script>
```

#### Issue 9: IE11 - Flexbox Layout Issues
**Description**: Option layout breaks in IE11 with full-bleed styles.

**Workaround**: Fallback to table-based layout
```css
.mcq_full_bleed_style1 .form-row {
  display: table-row; /* IE11 fallback */
}
```

#### Issue 10: Mobile - Long Press Context Menu
**Description**: Long press on options shows browser context menu instead of preventing it.

**Fix Needed**:
```javascript
$(element).on('contextmenu', '.form-row', function(e) {
  e.preventDefault();
  return false;
});
```

---

## 14. Recommendations

### 14.1 Code Quality Improvements

#### Recommendation 1: Refactor Large Functions
**Current State**: `SubmitAnswerMCQ()` is 300+ lines, `multiple-choice-template-directive.js` is 2100+ lines

**Proposed**:
```javascript
// Break into smaller, testable functions
function SubmitAnswerMCQ(event) {
  var context = buildSubmissionContext(event);
  var validation = validateAnswer(context);
  
  if (validation.isCorrect) {
    handleCorrectAnswer(context, validation);
  } else {
    handleIncorrectAnswer(context, validation);
  }
  
  updateAttemptCounter(context);
  persistState(context);
}

function buildSubmissionContext(event) { /* ... */ }
function validateAnswer(context) { /* ... */ }
function handleCorrectAnswer(context, validation) { /* ... */ }
function handleIncorrectAnswer(context, validation) { /* ... */ }
```

#### Recommendation 2: Eliminate Global Scope Pollution
**Current State**: Many functions declared globally in preview file

**Proposed**: Use module pattern
```javascript
var MCQModule = (function() {
  'use strict';
  
  // Private functions
  function submitAnswer(event) { /* ... */ }
  function showAnswer(event) { /* ... */ }
  
  // Public API
  return {
    submit: submitAnswer,
    showAnswer: showAnswer,
    reset: resetAnswer
  };
})();

// Attach to global only when needed
window.SubmitAnswerMCQ = MCQModule.submit;
```

#### Recommendation 3: Use Angular Best Practices
**Current State**: Heavy jQuery DOM manipulation in Angular directive

**Proposed**: More Angular-idiomatic approach
```javascript
// Use ng-class instead of addClass/removeClass
<div ng-class="{
  'green-border': option.isCorrect && option.isChecked,
  'red-border': !option.isCorrect && option.isChecked
}">

// Use ng-show/ng-hide instead of jQuery show/hide
<div class="individual-feedback" 
     ng-show="showFeedback && attempts >= maxAttempts">

// Use ng-disabled instead of prop('disabled')
<input type="radio" 
       ng-disabled="isSubmitted || attemptsExhausted">
```

### 14.2 Performance Improvements

#### Recommendation 4: Optimize Re-renders
**Issue**: Every style change triggers full re-render

**Proposed**: Use CSS classes instead of inline styles
```javascript
// Current: Inline style injection
$('#target').find('.form-row').css('background-color', color);

// Better: CSS class toggle
$('#target').find('.form-row').addClass('selected-' + styleName);

// CSS
.card-style1.selected-card-style1 .form-row {
  background-color: var(--theme-color-5);
  border-left: 2px solid var(--theme-color);
}
```

#### Recommendation 5: Lazy Load Media
**Issue**: All media loaded on component init, even if not visible

**Proposed**: Intersection Observer for lazy loading
```javascript
var mediaObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var $media = $(entry.target);
      var src = $media.attr('data-src');
      $media.attr('src', src);
      mediaObserver.unobserve(entry.target);
    }
  });
});

$(element).find('img, video, audio').each(function() {
  mediaObserver.observe(this);
});
```

#### Recommendation 6: Debounce Color Picker Changes
**Issue**: Color picker triggers style update on every pixel change

**Proposed**: Debounce updates
```javascript
var colorChangeDebounced = _.debounce(function(color) {
  scope.colorchangeMcq(color);
}, 300);

$("#mcq-settings-panel .mcq_color_picker").spectrum({
  move: function(color) {
    colorChangeDebounced(color.toHexString());
  }
});
```

### 14.3 Accessibility Improvements

#### Recommendation 7: ARIA Labels
**Current State**: Limited ARIA support

**Proposed**: Comprehensive ARIA implementation
```html
<div class="form-row" 
     role="radio" 
     aria-checked="false"
     aria-labelledby="option-text-{{$index}}"
     tabindex="0">
  <input type="radio" 
         id="option-{{$index}}" 
         aria-describedby="feedback-{{$index}}">
  <label for="option-{{$index}}" 
         id="option-text-{{$index}}">
    <span class="radio-text">{{option.choice.choiceText}}</span>
  </label>
  <div class="individual-feedback" 
       id="feedback-{{$index}}" 
       role="alert" 
       aria-live="polite">
  </div>
</div>
```

#### Recommendation 8: Keyboard Navigation
**Current State**: Tab navigation works but not intuitive

**Proposed**: Full keyboard support
```javascript
$(element).on('keydown', '.form-row', function(e) {
  switch(e.keyCode) {
    case 38: // Up arrow
      $(this).prev('.form-row').focus();
      break;
    case 40: // Down arrow
      $(this).next('.form-row').focus();
      break;
    case 32: // Space
    case 13: // Enter
      $(this).find('.icheck').click();
      break;
  }
});
```

#### Recommendation 9: Screen Reader Feedback
**Current State**: Visual-only feedback

**Proposed**: Announce changes to screen readers
```html
<div aria-live="assertive" aria-atomic="true" class="sr-only">
  {{feedbackMessage}}
</div>

```javascript
scope.announceFeedback = function(message) {
  $('.sr-only').text(message);
  $timeout(function() {
    $('.sr-only').text('');
  }, 3000);
};
```

### 14.4 Maintainability Improvements

#### Recommendation 10: TypeScript Migration
**Proposed**: Migrate to TypeScript for type safety

```typescript
interface MCQOption {
  choice: {
    fixed: boolean;
    identifier: string;
    choiceText: string;
    imageoption: boolean;
    imageUrl: string;
    feedbackinline: string;
    checked?: boolean;
  };
}

interface MCQFieldData {
  identifier: string;
  header: string;
  instruction: string;
  style: MCQStyle;
  settings: MCQSettings;
  listData: MCQListData[];
}

class MCQController {
  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService
  ) {}
  
  addOption(): void {
    if (this.fieldData.listData[0].mcssData.choiceList.length < 10) {
      // ...
    }
  }
}
```

#### Recommendation 11: Unit Testing
**Current State**: No automated tests

**Proposed**: Jest/Jasmine test suite
```javascript
describe('MCQ Component', function() {
  describe('Option Management', function() {
    it('should add option when count < 10', function() {
      var scope = createMCQScope();
      scope.addOptionClick();
      expect(scope.fieldData.listData[0].mcssData.choiceList.length).toBe(5);
    });
    
    it('should not add option when count = 10', function() {
      var scope = createMCQScope({ optionCount: 10 });
      scope.addOptionClick();
      expect(scope.fieldData.listData[0].mcssData.choiceList.length).toBe(10);
    });
  });
  
  describe('Answer Validation', function() {
    it('should mark correct answer as green', function() {
      // ...
    });
  });
});
```

#### Recommendation 12: Documentation
**Current State**: Minimal inline comments

**Proposed**: JSDoc comments
```javascript
/**
 * Validates user's answer against correct choices
 * @param {Event} event - Submit button click event
 * @returns {Object} Validation result with isCorrect flag and details
 * @example
 * var result = validateAnswer(event);
 * if (result.isCorrect) {
 *   showCorrectFeedback();
 * }
 */
function SubmitAnswerMCQ(event) {
  // ...
}
```

### 14.5 Feature Enhancements

#### Recommendation 13: Partial Credit Scoring
**Proposed**: Award partial points for multi-select questions

```javascript
function calculateScore(selected, correct) {
  var correctSelected = selected.filter(x => correct.includes(x));
  var incorrectSelected = selected.filter(x => !correct.includes(x));
  var correctNotSelected = correct.filter(x => !selected.includes(x));
  
  var score = correctSelected.length / correct.length;
  score -= (incorrectSelected.length * 0.5);  // Penalty
  score = Math.max(0, score);  // No negative scores
  
  return {
    score: score,
    maxScore: 1.0,
    percentage: score * 100
  };
}
```

#### Recommendation 14: Hint System
**Proposed**: Implement multi-level hints

```javascript
"hints": [
  {
    "level": 1,
    "text": "Think about the properties of...",
    "cost": 0.1  // 10% score penalty
  },
  {
    "level": 2,
    "text": "The answer relates to...",
    "cost": 0.2
  }
]

function showHint(level) {
  var hint = scope.fieldData.hints[level - 1];
  displayHintPopup(hint.text);
  scope.scorePenalty += hint.cost;
}
```

#### Recommendation 15: Analytics & Insights
**Proposed**: Track detailed learner analytics

```javascript
var analytics = {
  componentId: 'mcq-123',
  timeSpent: 0,  // seconds
  attempts: [],  // [{timestamp, selections, isCorrect}]
  hintsUsed: 0,
  showMeUsed: false,
  optionChangeCount: 0,  // how many times changed selection
  firstAttemptTime: 0,  // time to first submit
  distractorAnalysis: {}  // which wrong options were selected
};

function trackInteraction(event, data) {
  analytics.attempts.push({
    timestamp: Date.now(),
    selections: data.selections,
    isCorrect: data.isCorrect
  });
  
  // Send to analytics API
  sendAnalytics(analytics);
}
```

---

## 15. Summary

### Component Strengths
✅ **Versatile**: Supports 2 question types, 6 visual styles, 6 label types
✅ **Rich Media**: Integrated image, video, audio support
✅ **Customizable**: Extensive style and color options
✅ **Interactive**: Try-again, show-me, shuffle features
✅ **Feedback**: Individual and generic feedback systems
✅ **Accessible**: Basic screen reader support
✅ **Portable**: SCORM/ePub export support

### Areas for Improvement
⚠️ **Code Quality**: Large functions, mixed concerns, limited modularity
⚠️ **Performance**: Unnecessary re-renders, inline style injection
⚠️ **Testing**: No automated test coverage
⚠️ **Documentation**: Limited inline comments
⚠️ **Accessibility**: Could be enhanced further
⚠️ **Error Handling**: Some edge cases not handled gracefully

### Overall Assessment
The MCQ component is **production-ready** with **comprehensive features** but would benefit from **refactoring** and **modernization** for long-term maintainability.

---

## Appendices

### A. Configuration Reference

#### Default Settings
```json
{
  "Appearance": "#113e9a",
  "maxTries": 1,
  "msOrSsBoolean": "single-select",
  "isHeaderVisible": true,
  "isInstructionVisible": true,
  "mediaCheckbox": false,
  "feedbackCheckbox": false,
  "genericFeedbackCheckbox": false,
  "shuftleChoiceCheckbox": false,
  "showmecheckbox": false,
  "reset": false,
  "allowRestart": false
}
```

#### Style Defaults
```json
{
  "selected_style": "card-style1",
  "selected_label": 1,
  "selected_label_class": "Default",
  "selected_sub_style": "000000"
}
```

### B. Event Reference

#### Editor Events
- `addOptionClick`: Add new option
- `removeOptionClick`: Remove option
- `ssMsChange`: Toggle question type
- `mcqApplyStyle`: Apply style variant
- `addMediaClick`: Enable/disable media
- `setMediaToUpload`: Change media type
- `allowActivityRestart`: Toggle try-again
- `addFeedback`: Toggle individual feedback
- `addGenericFeedback`: Toggle generic feedback
- `enableShuffling`: Toggle shuffle
- `onHeaderVisibilityChanged`: Toggle header
- `onInstructionVisibilityChanged`: Toggle instruction

#### Reader Events
- `ifChecked`: Option selected
- `ifUnchecked`: Option deselected
- `SubmitAnswerMCQ`: Submit answer
- `showAnswerMCQ`: Show correct answers
- `tryagainMCQ`: Reset for retry
- `resetAnswerMCQ`: Clear all selections
- `stateMainatainMCQ`: Persist state

### C. CSS Classes Reference

#### Component Classes
- `.multiple-choice`: Root component
- `.mcss`: MCQ-specific styles
- `.single-questions`: Single-select variant
- `.multiple-questions`: Multiple-select variant

#### Style Variant Classes
- `.card-style1`, `.card-style2`, `.card-style3`: Card styles
- `.mcq_full_bleed_style1`, `.mcq_full_bleed_style2`, `.mcq_full_bleed_style3`: Full-bleed styles

#### State Classes
- `.attempted-question`: At least one option selected
- `.correct-question`: Correct answer submitted
- `.incorrect-question`: Incorrect answer submitted
- `.green-border`: Correct option indicator
- `.red-border`: Incorrect option indicator
- `.checked`: Option is selected (iCheck)
- `.disabled`: Button/option is disabled

#### Label Classes
- `.Default`, `.Alphabets_caps`, `.Romantype`, `.Numbers`, `.Alphabets_small`, `.Roman`: Label type classes
- `.checkmark`: Radio button label
- `.checkboxmark`: Checkbox label

### D. API Integration Points

#### SCORM Integration
```javascript
// LMS Initialization
apiHandle.LMSInitialize('');

// Set value
apiHandle.LMSSetValue('cmi.interactions.id.student_response', data);

// Get value
var savedState = apiHandle.LMSGetValue('cmi.interactions.id.student_response');

// Commit
apiHandle.LMSCommit('');

// Finish
apiHandle.LMSFinish('');
```

#### Custom Backend Integration
```javascript
// Save state
function saveAction(event, scoObj) {
  $.ajax({
    url: '/api/save-mcq-state',
    method: 'POST',
    data: JSON.stringify(scoObj),
    contentType: 'application/json',
    success: function(response) {
      console.log('State saved');
    }
  });
}

// Load state
function loadState(componentId) {
  $.ajax({
    url: '/api/get-mcq-state/' + componentId,
    method: 'GET',
    success: function(state) {
      restoreState(state);
    }
  });
}

