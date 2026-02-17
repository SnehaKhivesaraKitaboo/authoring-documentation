# True/False Component - Comprehensive Technical Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Component Overview](#component-overview)
3. [Architecture & Design](#architecture--design)
4. [Component Structure](#component-structure)
5. [Data Model](#data-model)
6. [Component Types & Variants](#component-types--variants)
7. [Rendering Modes](#rendering-modes)
8. [Data Flow](#data-flow)
9. [Key Features](#key-features)
10. [Offline/Package Behavior](#offlinepackage-behavior)
11. [Error Handling](#error-handling)
12. [Known Issues](#known-issues)
13. [Recommendations](#recommendations)
14. [API Reference](#api-reference)

---

## Executive Summary

The **True/False Component** is an interactive assessment widget within the KITABOO Authoring platform that allows authors to create binary choice questions. While traditionally used for true/false questions, the component supports customizable two-option scenarios. It's built using AngularJS 1.x, jQuery, and follows a directive-based architecture.

### Key Characteristics:
- **Type**: Interactive assessment component
- **Framework**: AngularJS 1.x + jQuery
- **Modes**: Editor (Authoring), Preview, Reader (Runtime)
- **Primary Use**: Binary choice assessments (True/False questions)
- **Deployment**: Client-side rendering with server-side storage

---

## Component Overview

### Purpose
The True/False component enables authors to:
- Create binary choice questions (typically True/False)
- Add media (images, videos, audio) to enhance questions
- Provide individual feedback for each option
- Configure styling, behavior, and interaction patterns
- Track user responses and validate answers

### Technical Stack
- **Frontend Framework**: AngularJS 1.x
- **DOM Manipulation**: jQuery 3.x
- **Styling**: CSS3 with custom theme support
- **Media Handling**: HTML5 Video/Audio APIs
- **Data Format**: JSON

---

## Architecture & Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     KITABOO Authoring Platform                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    True/False Component Layer                    │
│  ┌────────────────┬──────────────────┬──────────────────────┐  │
│  │  Editor Mode   │   Preview Mode   │    Reader Mode       │  │
│  │  (Authoring)   │   (Testing)      │    (Publishing)      │  │
│  └────────────────┴──────────────────┴──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌──────────────┐    ┌──────────────────┐    ┌───────────────────┐
│  Templates   │    │   Controllers    │    │   Data Models     │
│              │    │                  │    │                   │
│ - Auth HTML  │◄──►│ - Directive JS   │◄──►│ - JSON Schema    │
│ - Settings   │    │ - Preview JS     │    │ - Field Data     │
│ - Media      │    │ - Event Handlers │    │ - Settings       │
└──────────────┘    └──────────────────┘    └───────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
             ┌──────────────────────────────────┐
             │        Styling Layer             │
             │  - truefalse-template.css       │
             │  - truefalse-data-template.css  │
             │  - Style Variants (6 themes)    │
             └──────────────────────────────────┘
```

### Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                       User Interaction Flow                          │
└─────────────────────────────────────────────────────────────────────┘

Author Mode (Editor):
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Create  │───►│Configure │───►│  Style   │───►│   Save   │
│Question  │    │ Options  │    │Component │    │   JSON   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │                │                │
     │               ▼                ▼                ▼
     │          Add Media       Select Theme     Persist Data
     │          Add Feedback    Edit Colors      to Server
     └──────────────────────────────────────────────────┘

Learner Mode (Reader):
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Load   │───►│ Display  │───►│  Select  │───►│  Submit  │
│Component │    │ Question │    │  Option  │    │  Answer  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │                │
                                      ▼                ▼
                                 Enable Submit   Validate
                                 Enable Reset    Show Feedback
                                                 Check Answer
                                      │                │
                                      ▼                ▼
                              ┌──────────────────────────┐
                              │   Try Again / Show Me    │
                              │   (Based on Settings)    │
                              └──────────────────────────┘
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
    │  Main   │         │True/False │      │
    │Controller│◄────────┤ Directive │      │
    │(ngCtrl) │         │           │      │
    └────┬────┘         └─────┬─────┘      │
         │                    │            │
         │              ┌─────▼──────┐     │
         │              │   Scope    │     │
         │              │ Functions  │     │
         │              └─────┬──────┘     │
         │                    │            │
         ├────────────────────┼────────────┼──────────────────────┐
         │                    │            │                      │
    ┌────▼────┐         ┌─────▼─────┐ ┌───▼────┐        ┌───────▼──────┐
    │ Settings│         │  Option   │ │ Media  │        │    Style     │
    │  Panel  │         │  Manager  │ │Manager │        │   Selector   │
    │         │         │(True/False│ │        │        │  6 Variants  │
    └─────────┘         │  Options) │ └────────┘        └──────────────┘
                        └───────────┘                           │
                              │                          ┌──────▼──────┐
                        ┌─────▼──────┐                   │ Card Styles │
                        │  Feedback  │                   │   1, 2, 3   │
                        │  Manager   │                   └─────────────┘
                        │(Individual)│                   ┌──────────────┐
                        └────────────┘                   │  Full-Bleed  │
                                                         │    Styles    │
                                                         │    1, 2, 3   │
                                                         └──────────────┘

         │                                              │
         └──────────────────┬───────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │   JSON Data Model  │
                  │                    │
                  │  • identifier      │
                  │  • header          │
                  │  • instruction     │
                  │  • style           │
                  │  • settings        │
                  │  • listData[]      │
                  │    - choiceList[]  │
                  │    - media         │
                  │  • correctOptionIdx│
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

    ┌─────────────────────────────────────────────────────────────┐
    │        truefalse-template-preview1.js                       │
    │              (jQuery-based)                                 │
    └──────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │  Option   │ │ Radio   │    │   Media     │
    │ Renderer  │ │ Button  │    │   Player    │
    │           │ │ Handler │    │(Img/Vid/Aud)│
    └────┬──────┘ └────┬────┘    └──────┬──────┘
         │             │                │
         └─────────────┼────────────────┘
                       │
              ┌────────▼────────┐
              │  Selection      │
              │  Manager        │
              │  (Enable Submit)│
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Submit Answer  │
              │   Validation    │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │  Compare  │ │  Visual │    │  Feedback   │
    │  Indices  │ │Feedback │    │  Display    │
    │(selected  │ │(CSS)    │    │ (Individual)│
    │vs correct)│ │         │    │             │
    └────┬──────┘ └────┬────┘    └──────┬──────┘
         │             │                │
         └─────────────┼────────────────┘
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

### Editor Mode Initialization Flow

```
index.html loads → AngularJS bootstrap → ngController init → 
Directive registration → True/False template clicked → 
trueFalseData directive link → Scope setup → 
Load default 2 options (True/False) → Set correct answer → 
Settings panel opened → Style selection → Media upload (optional) → 
Configure feedback → Apply label type → Save component
```

### Option Creation & Configuration Flow

```
Component initialized → Default 2 options created → 
Author edits option text (contenteditable) → 
Select correct answer (click radio button) → 
Mark as correctOptionIndex → Toggle individual feedback → 
Add feedback text for each option → Configure appearance → 
Select style variant → Choose color scheme → 
Apply label type (A-B, 1-2, etc.) → Save to JSON
```

### Student Interaction & Validation Flow

```
Student loads question → Parse JSON → Render media (if present) → 
Render 2 options with radio buttons → Apply selected style CSS → 
Student reads question → Clicks option radio button → 
Option selected (CSS class added) → Submit button enabled → 
Student clicks Submit → SubmitAnswerTrueFalse() triggered → 
Compare selectedIndex with correctOptionIndex → 
If match: Mark correct (green), show tick icon → 
If no match: Mark incorrect (red), show cross icon → 
Display individual feedback (if configured) → 
Increment attempt counter → Update button states → 
Report to SCORM → Enable/Disable Try Again based on attempts
```

### Answer Validation Flow

```
Submit clicked → Get selected option index → 
Get correctOptionIndex from JSON data → 
Compare values:
  ┌─ Match? → Correct
  │   - Add 'correct' CSS class
  │   - Show ✓ icon
  │   - Display positive feedback
  │   - Count as correct
  │
  └─ No Match? → Incorrect
      - Add 'incorrect' CSS class
      - Show ✗ icon  
      - Display corrective feedback
      - Highlight correct answer (if Show Me)
      - Count as incorrect
→ Calculate percentage (50% or 100%) → 
Show generic feedback message (if configured) → 
Update attempt counter → Toggle button availability → 
Save state to SCORM/localStorage
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDITOR MODE                                   │
│                                                                         │
│  Author Input → AngularJS Binding → JSON Model Update →                │
│  Settings Panel → fieldData updates → Template Re-render               │
│                                                                         │
│  Option Management:                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 2 options (fixed count) → Edit text → Select correct →          │ │
│  │ Set correctOptionIndex → Save to listData[0].mcssData.choiceList│ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Style Application:                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Select style variant → Update style.selected_style →            │ │
│  │ Choose color → Update style.selected_sub_style →                │ │
│  │ Apply to preview → CSS classes dynamically added                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Media Integration:                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Toggle media checkbox → Upload file → Process image/video/audio→│ │
│  │ Store in listData[0].mcssData.media → Configure dimensions →   │ │
│  │ Render in template                                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PREVIEW/READER MODE                                │
│                                                                         │
│  Page Load → Parse JSON → Render media → Render 2 options →            │
│  Apply style CSS → Initialize radio buttons → Student interaction      │
│                                                                         │
│  Selection Flow:                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Click option → Update checked property → Toggle CSS class →     │ │
│  │ Enable Submit button → Store selection temporarily              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Validation Flow:                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Submit clicked → Get selected index → Compare with correct →    │ │
│  │ Apply visual feedback → Show message → Count attempt →          │ │
│  │ Update UI state → Toggle buttons → Report to SCORM              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Style Variant Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRUE/FALSE STYLE VARIANTS                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   Card Style 1       │  │   Card Style 2       │  │   Card Style 3       │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ ┌──────────────────┐ │  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │
│ │ ○ True           │ │  │ │ ○ True           │ │  │ │ (A) ○ True       │ │
│ │ [Subtle shadow   │ │  │ │ [Outlined border │ │  │ │ [Filled bg with  │ │
│ │  Left accent]    │ │  │ │  Bold on select] │ │  │ │  radio buttons]  │ │
│ └──────────────────┘ │  │ └──────────────────┘ │  │ └──────────────────┘ │
│ ┌──────────────────┐ │  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │
│ │ ○ False          │ │  │ │ ○ False          │ │  │ │ (B) ○ False      │ │
│ └──────────────────┘ │  │ └──────────────────┘ │  │ └──────────────────┘ │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Full-Bleed Style 1  │  │  Full-Bleed Style 2  │  │  Full-Bleed Style 3  │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ ┌──────────────────┐ │  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │
│ │ ○ True           │ │  │ │ ○ True           │ │  │ │ A. True          │ │
│ │ [Edge-to-edge    │ │  │ │ [BG fill on      │ │  │ │ [Color-coded text│ │
│ │  Border emphasis]│ │  │ │  selection w/    │ │  │ │  Alphabetical    │ │
│ └──────────────────┘ │  │ │  transparency]   │ │  │ │  indicators]     │ │
│ ┌──────────────────┐ │  │ └──────────────────┘ │  │ └──────────────────┘ │
│ │ ○ False          │ │  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │
│ └──────────────────┘ │  │ │ ○ False          │ │  │ │ B. False         │ │
└──────────────────────┘  │ └──────────────────┘ │  │ └──────────────────┘ │
                          └──────────────────────┘  └──────────────────────┘

Color Application:
Each style × 10 color presets = 60 unique appearances
CSS classes: .card-style1, .card-style2, .card-style3,
             .mcq_full_bleed_style1, .mcq_full_bleed_style2, 
             .mcq_full_bleed_style3
Dynamic color injection via inline styles or CSS variables
```

### Media Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MEDIA UPLOAD & RENDERING                           │
└─────────────────────────────────────────────────────────────────────────┘

Editor Mode:
─────────────
Enable Media Checkbox → Select Media Type (Image/Video/Audio) → 
Click Upload → File picker opens → Select file → 
Upload to server → Get URL → Store in listData[0].mcssData.media:
  {
    "type": "IMAGE" | "VIDEO" | "AUDIO",
    "src": "images/filename.jpg",
    "imageVisible": true,
    "imageSetting": { width, height, position },
    "videoSetting": { autoplay, controls, loop }
  } → 
Preview updates with media → Configure dimensions → Save

Reader Mode:
────────────
Parse media object → Check media.type:
  ┌─ IMAGE:
  │   Render <img> with src
  │   Apply dimensions from imageSetting
  │   Position per settings (top/left/center/right)
  │
  ├─ VIDEO:
  │   Check videoSetting.videoType:
  │   ├─ "uploaded": <video> element with controls
  │   ├─ "youtube": <iframe> embed
  │   └─ "kaltura": Kaltura player embed
  │   Apply autoplay, controls, loop settings
  │
  └─ AUDIO:
      Render <audio> element
      Show player controls
      Autoplay if configured → 
Display media above question text → Student interacts with media → 
Proceed with question interaction
```

---

## Component Structure

### File Organization

```
templates/truefalse/
│
├── config.txt                              # Component registration config
├── truefalse-template-auth.html           # Editor mode template
├── truefalse-template-settings.html       # Settings panel template
├── truefalse-media-template.html          # Media upload template
│
├── default/
│   └── truefalse.json                     # Default configuration schema
│
├── scripts/
│   ├── truefalse-template-directive.js    # AngularJS directive (Editor)
│   └── truefalse-template-preview1.js     # Reader mode runtime logic
│
└── styles/
    ├── truefalse-template.css             # Main component styles
    ├── truefalse-data-template.css        # Data-specific styles
    ├── blue.css                           # Theme variant
    └── images/                            # Style assets
        ├── card/                          # Card style images (1, 2, 3)
        ├── bleed/                         # Full-bleed style images (1, 2, 3)
        └── [various style assets]
```

### Key Files Description

#### 1. **truefalse-template-auth.html** (Editor Template)
- Main authoring interface
- Contains editable fields: Header, Instruction, Question, Options
- Displays media upload area
- Includes option management (add/delete options)
- Feedback configuration UI
- Button panel (Submit, Reset, Show Me, Try Again)

#### 2. **truefalse-template-settings.html** (Settings Panel)
- Style selection (Card styles 1-3, Full-bleed styles 1-3)
- Color customization options
- Appearance settings (header/instruction visibility)
- Media upload configuration (Image/Video/Audio)
- Behavioral settings (attempts, feedback, shuffling)
- Label type selection (Default, A-Z, a-z, 1-5, I-V, i-v)

#### 3. **truefalse-template-directive.js** (Editor Logic)
- AngularJS directive: `trueFalseData`
- ~2000+ lines of code
- Handles editor interactions, style application, media management
- Manages option creation/deletion
- Applies custom colors and themes
- Integrates with parent controller

#### 4. **truefalse-template-preview1.js** (Reader Logic)
- ~750 lines of code
- Handles runtime interactions (option selection, submission)
- Validates answers and displays feedback
- Manages attempts and Try Again functionality
- State persistence for SCORM/LMS integration

#### 5. **truefalse.json** (Default Configuration)
- 561 lines of JSON schema
- Defines default structure, settings, styles
- Includes 6 style variants with 10 color combinations each
- Complete settings object with all configurable properties

---

## Data Model

### Core Data Structure

```json
{
  "identifier": "true-false-template",
  "header": "",
  "introduction": "",
  "instruction": "",
  "correctOptionIndex": 0,
  
  "style": {
    "selected_style": "card-style1",
    "selected_label": 1,
    "selected_label_class": "Default",
    "style_color": "red",
    "selected_sub_style": "000000",
    "selected_sub_style_image": "./templates/truefalse/styles/images/bleed/1/1_1.png",
    "selected_sub_style_image_name": "1_1.png",
    "dynamic_edit": true,
    "custom_colors": {},
    "class": {
      "card-style1": "card-style1",
      "card-style2": "card-style2",
      "card-style3": "card-style3",
      "mcq_full_bleed_style1": "mcq_full_bleed_style1",
      "mcq_full_bleed_style2": "mcq_full_bleed_style2",
      "mcq_full_bleed_style3": "mcq_full_bleed_style3"
    },
    "images": {
      "card-style1": {
        "folder": "card",
        "subfolder": "1",
        "images": {
          "1_1.png": "000000",
          "1_2.png": "4a0d0d",
          ...
        }
      }
      // Similar structure for all 6 styles
    },
    "custom_color_options": {
      "top_panel": { /* color customization */ },
      "card": { /* color customization */ },
      "bottom_panel": { /* color customization */ },
      "option": { /* color customization */ },
      "shadow": { /* shadow settings */ }
    }
  },
  
  "settings": {
    "Appearance": "#7eb1eb",
    "colorwithopacity": "rgb(25,98,178,0.05)",
    "maxTries": 1,
    "allowRestart": false,
    "templateImage": "icon-MultipleChoiceSingleSelect",
    "msOrSsBoolean": "single-select",
    "feedbackCheckbox": false,
    "genericFeedbackCheckbox": false,
    "showmecheckbox": false,
    "reset": false,
    "isHeaderVisible": true,
    "isInstructionVisible": true,
    "mediaCheckbox": false,
    "mediaToUpload": "image",
    "generic_correct_ans_text": "",
    "generic_incorrect_ans_text": "",
    "label_type": [
      {"Type": "Default", "index": 1, "active": true},
      {"Type": "Alphabets_caps", "index": 2, "active": false},
      {"Type": "Romantype", "index": 3, "active": false},
      {"Type": "Numbers", "index": 4, "active": false},
      {"Type": "Alphabets_small", "index": 5, "active": false},
      {"Type": "Roman", "index": 6, "active": false}
    ]
  },
  
  "listData": [
    {
      "mcssData": {
        "type": "Multi Choice Single Select",
        "media": {
          "id": "",
          "src": "images/image.jpg",
          "type": "WEBLINK",
          "imageVisible": true,
          "imageSetting": { /* image config */ },
          "videoSetting": { /* video config */ }
        },
        "shuffleChoice": false,
        "choiceList": [
          {
            "choice": {
              "fixed": false,
              "identifier": "A",
              "choiceText": "",
              "imageoption": false,
              "imageUrl": "images/image.jpg",
              "feedbackinline": "",
              "checked": false
            }
          },
          {
            "choice": {
              "fixed": false,
              "identifier": "B",
              "choiceText": "",
              "imageoption": false,
              "imageUrl": "images/image.jpg",
              "feedbackinline": "",
              "checked": false
            }
          }
        ],
        "isSingleSelect": true,
        "addFeedback": false,
        "mediaVisible": false
      }
    }
  ]
}
```

### Key Data Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `correctOptionIndex` | Number | Index of the correct answer (0 or 1) |
| `style.selected_style` | String | Current theme (card-style1-3, mcq_full_bleed_style1-3) |
| `style.custom_colors` | Object | Override colors for specific elements |
| `settings.maxTries` | Number | Number of attempts allowed (1-5) |
| `settings.Appearance` | String | Primary theme color (hex) |
| `settings.mediaCheckbox` | Boolean | Whether media is enabled |
| `listData[0].mcssData.choiceList` | Array | Array of 2 options with text and metadata |
| `listData[0].mcssData.media` | Object | Media configuration (image/video/audio) |

---

## Component Types & Variants

### 1. Style Variants

The True/False component supports **6 primary style types**:

#### Card Styles (3 variants)
1. **Card Style 1**: Classic card with subtle elevation and left border accent
2. **Card Style 2**: Outlined card with border emphasis on selection
3. **Card Style 3**: Filled background with rounded radio buttons

#### Full-Bleed Styles (3 variants)
1. **Full-Bleed Style 1**: Edge-to-edge design with border-based selection
2. **Full-Bleed Style 2**: Background color fill on selection with transparency
3. **Full-Bleed Style 3**: Color-coded text with alphabetical indicators

### 2. Color Variations

Each style supports **10 color presets**:
- Black (000000)
- Dark Red (4a0d0d)
- Navy Blue (0d254a)
- Forest Green (1c633d)
- Olive (545b15)
- Brown (755200)
- Teal (085f68)
- Purple (550d85)
- Magenta (8c1d7e)
- Royal Blue (195b94)

**Total Combinations**: 6 styles × 10 colors = **60 unique appearances**

### 3. Label Type Options

Options can be labeled with:
1. **Default**: No visible label (just radio button)
2. **Alphabets (Uppercase)**: A, B
3. **Roman Numerals (Uppercase)**: I, II
4. **Numbers**: 1, 2
5. **Alphabets (Lowercase)**: a, b
6. **Roman Numerals (Lowercase)**: i, ii

### 4. Media Integration Types

- **Image**: Static images with caption support
- **Video**: 
  - Uploaded MP4 files
  - YouTube embedded videos
  - Kaltura integration (conditional)
- **Audio**: 
  - MP3/MP4 audio files
  - Inline audio player with controls

---

## Rendering Modes

### 1. Editor Mode (Authoring)

**File**: `truefalse-template-auth.html` + `truefalse-template-directive.js`

#### Characteristics:
- All fields are editable via `contenteditable` attributes
- Real-time style preview
- Option management (cannot go below 2 options, max is 5 - though typically 2 for True/False)
- Settings panel on right side
- Drag-and-drop disabled on text fields (`ng-cancel-drag`)
- Click events route to settings panel
- Math equation editor integration
- Image dimension controls

#### Key Editor Functions:
```javascript
// Add new option
scope.addOptionClick = function(event) {
  if (scope.fieldData.listData[0].mcssData.choiceList.length < 5) {
    scope.fieldData.listData[0].mcssData.choiceList.push({...});
  }
}

// Remove option
scope.removeOptionClick = function(index) {
  if (scope.fieldData.listData[0].mcssData.choiceList.length > 2) {
    scope.fieldData.listData[0].mcssData.choiceList.splice(index, 1);
  }
}

// Apply style
scope.mcqApplyStyle = function(mcqThemeClass, event) {
  scope.fieldData.style.selected_style = mcqThemeClass;
  // Update visual appearance
}

// Set correct answer
scope.optionClick = function(event, idx) {
  scope.fieldData.correctOptionIndex = idx;
}
```

#### Editor Interactions:
1. **Header/Instruction/Question**: Direct text editing
2. **Options**: Click to edit text, click radio to set as correct
3. **Settings Panel**: Dynamically loads based on active element
4. **Style Changes**: Apply immediately to preview
5. **Media Upload**: Triggers file upload dialog

---

### 2. Preview Mode

**File**: Same as Editor, but with restricted interactions

#### Characteristics:
- Similar to Editor but with simulated interactivity
- Allows testing before publishing
- Uses same JavaScript logic as Reader mode
- Can test answer submission and feedback

---

### 3. Reader Mode (Runtime)

**File**: `truefalse-template-preview1.js`

#### Characteristics:
- Read-only content (no editing)
- Fully interactive answer selection
- Submit/Reset/Try Again/Show Me buttons functional
- Feedback display (generic and individual)
- State persistence for LMS/SCORM
- Attempt tracking

#### Key Reader Functions:
```javascript
// Submit answer
function SubmitAnswerTrueFalse(event) {
  var $form = $(event.target).parents('form');
  var attempts = parseInt($eventTarget.attr('data-attempts'));
  
  // Check if correct
  if (isCorrect) {
    showCorrectFeedback();
    disableAllOptions();
  } else {
    if (attempts < maxAttempts) {
      showTryAgain();
    } else {
      showIncorrectFeedback();
      disableAllOptions();
    }
  }
}

// Show correct answer
function showAnswerTrueFalse(event) {
  var $form = $(event.target).parents('form');
  $form.find('input[data-iscorrect]').addClass("selected-tfoption");
  showIndividualFeedback();
}

// Reset
function resetAnswerTrueFalse(event) {
  var $form = $(event.target).parents('form');
  $form.trigger('reset');
  clearAllSelections();
  enableAllOptions();
}

// Try Again
function tryagainTrueFalse(event) {
  resetAnswerTrueFalse(event);
  clearFeedback();
}
```

#### Reader Flow:
```
Load Component
      │
      ▼
Display Question & Options
      │
      ▼
User Selects Option ────► Enable Submit Button
      │                   Enable Reset Button
      ▼
User Clicks Submit
      │
      ├─► Correct Answer ────► Show Correct Feedback
      │                        Mark option green
      │                        Disable all interactions
      │                        Hide Submit button
      │
      └─► Incorrect Answer
                │
                ├─► Attempts Left ────► Show "Try Again" button
                │                       Show feedback
                │                       Allow retry
                │
                └─► No Attempts Left ──► Show Incorrect Feedback
                                        Show correct answer
                                        Disable all interactions
```

---

## Data Flow

### 1. Initialization Flow

```
Page Load
    │
    ▼
Load JSON Configuration
    │
    ▼
Parse Component Data
    │
    ├─► Editor Mode
    │   │
    │   ├─► Compile AngularJS Directive
    │   ├─► Render Editable Template
    │   ├─► Load Settings Panel
    │   ├─► Bind Event Handlers
    │   └─► Apply Initial Styles
    │
    └─► Reader Mode
        │
        ├─► Render Static Template
        ├─► Load Answer Validation Logic
        ├─► Bind Interaction Handlers
        ├─► Restore Previous State (if any)
        └─► Enable User Interactions
```

### 2. User Interaction Flow (Editor)

```
User Action
    │
    ├─► Edit Text Field
    │   │
    │   ├─► Update ng-model
    │   ├─► Enable Save Button
    │   └─► Persist Changes on Save
    │
    ├─► Select Option as Correct
    │   │
    │   ├─► Update correctOptionIndex
    │   ├─► Apply visual indicator
    │   └─► Enable Save Button
    │
    ├─► Change Style
    │   │
    │   ├─► Update selected_style
    │   ├─► Apply CSS classes
    │   ├─► Re-render component
    │   └─► Enable Save Button
    │
    ├─► Upload Media
    │   │
    │   ├─► Open File Dialog
    │   ├─► Upload to Server
    │   ├─► Receive URL
    │   ├─► Update media.src
    │   └─► Display in Template
    │
    └─► Modify Settings
        │
        ├─► Update settings object
        ├─► Apply behavioral changes
        └─► Enable Save Button
```

### 3. Answer Validation Flow (Reader)

```
User Selects Option
    │
    ▼
Mark Option as Selected
    │
    ▼
Enable Submit Button
    │
    ▼
User Clicks Submit
    │
    ▼
Retrieve correctOptionIndex
    │
    ▼
Compare with Selected Index
    │
    ├─► Match Found (Correct)
    │   │
    │   ├─► Increment Score
    │   ├─► Show Green Border
    │   ├─► Display Correct Feedback
    │   ├─► Show Individual Feedback (if enabled)
    │   └─► Disable Further Attempts
    │
    └─► No Match (Incorrect)
        │
        ├─► Increment Attempt Counter
        ├─► Show Red Border
        ├─► Display Incorrect Feedback
        │
        ├─► Check Remaining Attempts
        │   │
        │   ├─► Attempts Available
        │   │   │
        │   │   ├─► Enable "Try Again" Button
        │   │   └─► Allow Retry
        │   │
        │   └─► No Attempts Left
        │       │
        │       ├─► Show Correct Answer (green)
        │       ├─► Show Individual Feedback (if enabled)
        │       └─► Disable All Interactions
        │
        └─► Send Result to LMS (if integrated)
```

### 4. State Persistence Flow

```
Component Interaction
    │
    ▼
Capture State Data
    ├─► Selected Option
    ├─► Attempt Count
    ├─► Correct/Incorrect Status
    ├─► Feedback Displayed
    └─► Button States
    │
    ▼
Create State Object
    │
    ▼
apiHandle.saveAction()
    │
    ▼
SCORM/LMS API Call
    │
    ├─► Success ────► State Persisted
    │
    └─► Failure ────► Retry or Log Error
```

---

## Key Features

### 1. Answer Selection Mechanism

**Radio Button Simulation**:
- Uses custom styled `<div>` elements with `.tf-option-box` class
- Click handler on entire option container
- Visual feedback via `.selected-tfoption` class
- Custom checkmarks (`.checkmark`, `.checkboxmark`)

```javascript
$('.tf-option-box').on('click', function(event) {
    let $allTFOptions = $(this).parents('.component-holder.true-false').find('.tf-option-box');
    $allTFOptions.removeClass('selected-tfoption');
    $(this).addClass('selected-tfoption');
    $form.find('.submit-btn').removeClass('disabled');
});
```

### 2. Feedback System

**Two Types of Feedback**:

#### A. Generic Feedback (Per Question)
- Set in settings panel
- `generic_correct_ans_text`: Shown on correct submission
- `generic_incorrect_ans_text`: Shown on incorrect submission
- Displayed in modal/inline alert

#### B. Individual Feedback (Per Option)
- Unique message for each option
- Stored in `choice.feedbackinline`
- Displayed below option after submission
- Encoded/decoded to prevent cheating (Base64)

```javascript
// Encoding feedback in preview
$(item).find('.template-instruction').eq(0).text(btoa(unescape(encodeURIComponent(data1))));

// Decoding feedback on display
let newData = decodeURIComponent(escape(window.atob(data)));
$(item).find('.template-instruction').eq(0).text(newData);
```

### 3. Attempt Management

**Configurable Attempts**: 1-5 tries
- Tracked via `data-attempts` attribute on submit button
- Compared against `data-no-of-attempts` (maxTries + 1)
- Try Again button shown if attempts remaining
- Final submission shows correct answer and all feedback

```javascript
attempts ? attempts++ : attempts = 1;
if (attempts === totalAttempts) {
    isLastChance = true;
    disableAllOptions();
    showCorrectAnswer();
}
```

### 4. Media Integration

**Supported Media Types**:
- **Images**: JPG, PNG with alt text and captions
- **Videos**: MP4 (uploaded), YouTube (embedded), Kaltura
- **Audio**: MP3, MP4 with audio.js player

**Media Positioning**:
- Left or right alignment
- Responsive width adjustments
- Caption support below media

```javascript
scope.setMediaToUpload = function(type) {
    switch (type) {
        case 'image':
            templateScope.$$childHead.fieldData.imageVisible = true;
            break;
        case 'video':
            templateScope.$$childHead.fieldData.imageVisible = false;
            // Handle video-specific logic
            break;
        case 'audio':
            templateScope.fieldData.src = '';
            audiojs.create($('#target')[0]);
            break;
    }
}
```

### 5. Style Customization

**Multi-Level Customization**:
1. **Preset Themes**: 6 base styles
2. **Color Palettes**: 10 colors per style
3. **Custom Colors**: Manual color picker for:
   - Top panel background
   - Card background
   - Card border
   - Bottom panel background
   - Option background
   - Shadow effects

```javascript
scope.applyCustomColor = function(event) {
    $("#mcq-settings-panel .mcq_color_picker").spectrum({
        change: function(color) {
            var oColor = color.toHexString();
            scope.fieldData.style.custom_colors[oDataContainer] = oProperty + ':' + oPropertyValue;
            scope.$apply();
            scope.handleStyle3();
        }
    });
}
```

### 6. Mathematical Equation Support

**Integration with Math Editor**:
- Uses MathQuill library
- LaTeX rendering
- Inline equation editing in all text fields
- Stored as encoded LaTeX strings

```javascript
scope.onAuthEquationClick = function(event) {
    event.preventDefault();
    scope.onMathEditiorClick(false, this);
}

var setLatexData = function(mathHolder, encodedString) {
    var MQData = MathQuill.getInterface(2),
        dataCall = MQData.StaticMath(mathHolder, {}),
        decodedLatex = JSON.parse(decodeURIComponent(encodedString)).latex;
    dataCall.latex(decodedLatex);
}
```

### 7. Accessibility Features

**Keyboard Support**:
- Enter key to confirm text editing
- Tab navigation through options
- Escape key to close modals

**Screen Reader Support**:
- Alt text for images
- ARIA labels (partially implemented)
- Semantic HTML structure

---

## Offline/Package Behavior

### Online Mode
- All features fully functional
- Media loads from server
- Real-time save to backend
- SCORM calls to LMS

### Offline/Packaged Mode

**Characteristics**:
1. **Static Asset Loading**:
   - Media must be bundled in package
   - Relative paths used: `./images/`, `./videos/`
   - No external CDN dependencies

2. **Local Storage for State**:
   - Uses browser localStorage
   - State saved on every interaction
   - Restored on component reload

3. **No LMS Integration**:
   - SCORM calls fail gracefully
   - Results stored locally
   - Option to sync on reconnection (if implemented)

4. **Media Limitations**:
   - YouTube videos may not work without internet
   - Audio/video playback depends on codec support
   - Kaltura integration unavailable

**Packaging Checklist**:
```
✓ Ensure all media uploaded is included in package
✓ Convert absolute URLs to relative paths
✓ Include all CSS and JS dependencies
✓ Test media playback offline
✓ Verify state persistence in localStorage
✓ Handle SCORM API absence gracefully
```

---

## Error Handling

### 1. Media Loading Errors

**Image Load Failure**:
```javascript
// No explicit error handler found in code
// Recommendation: Add onerror attribute to <img> tags
<img src="..." onerror="this.src='images/placeholder.jpg'">
```

**Video/Audio Load Failure**:
```javascript
// Checks for blank audio
if (!audioScr || audioScr === "images/image.jpg" || audioScr === "") {
    $('#target').parents('.audio-source').find('.audiojs.loading').removeClass('loading');
    $('#target').parents('.audio-source').find('.audiojs.error').removeClass('error');
    $('#target').parents('.audio-source').find('.play-pause').addClass('blank-audio');
}
```

### 2. Data Validation Errors

**Missing Required Fields**:
- No explicit validation in JavaScript
- Relies on HTML5 `contenteditable` and `placeholder` attributes
- Could result in empty questions being saved

**Recommendation**:
```javascript
// Add validation before save
function validateTrueFalseComponent() {
    if (!scope.fieldData.instruction || scope.fieldData.instruction.trim() === '') {
        alert('Question text is required');
        return false;
    }
    if (scope.fieldData.listData[0].mcssData.choiceList[0].choice.choiceText.trim() === '' ||
        scope.fieldData.listData[0].mcssData.choiceList[1].choice.choiceText.trim() === '') {
        alert('Both option texts are required');
        return false;
    }
    return true;
}
```

### 3. State Persistence Errors

**SCORM API Unavailable**:
```javascript
if (typeof apiHandle != "undefined") {
    stateMainatainTrueFalse(event);
}
// Gracefully skips if API not present
```

**localStorage Quota Exceeded**:
- No explicit handling
- Could fail silently on large content

### 4. Browser Compatibility Issues

**Known Issues**:
- IE 11 support partially broken (older jQuery/AngularJS)
- Audio.js may not work in Safari iOS (restrictions on autoplay)
- CSS Grid not supported in older browsers

---

## Known Issues

### 1. Hardcoded "Multiple Choice" References

**Issue**: Component internally shares code with Multiple Choice component
- Variable names use `mcq` (Multiple Choice Question) prefix
- Function names reference MCQ instead of True/False

**Impact**: 
- Confusing for developers
- Potential bugs when modifying MCQ code affects True/False

**Evidence**:
```javascript
// From truefalse-template-auth.html
<div class="component-holder ... multiple-choice mcq_full_bleed_style1 true-false">

// From directive.js
scope.fieldData.listData[0].mcssData.choiceList

// Settings panel
<div id="mcq-settings-panel" class="wrap js-choice-questions mcq-sett" true-false-data>
```

**Recommendation**: Refactor to use consistent `truefalse` or `tf` naming

---

### 2. Two-Option Limitation Not Enforced

**Issue**: Code allows up to 5 options, but True/False should only have 2

**Evidence**:
```javascript
scope.addOptionClick = function(event) {
    if (scope.fieldData.listData[0].mcssData.choiceList.length < 5) {
        // Allows adding options beyond 2
    }
}
```

**Impact**: Authors could create 3+ option "True/False" questions

**Recommendation**:
```javascript
if (scope.fieldData.listData[0].mcssData.choiceList.length < 2) {
    // Strictly limit to 2 options
}
// Remove "Add Option" button in True/False mode
```

---

### 3. Feedback Encoding/Decoding Complexity

**Issue**: Feedback is Base64 encoded to prevent cheating, but implementation is inconsistent

**Evidence**:
```javascript
// Encoding happens in multiple places
let newData1 = btoa(unescape(encodeURIComponent(data1)));

// Decoding
let newData1 = decodeURIComponent(escape(window.atob(data1)));
```

**Issues**:
- Try-catch blocks missing in some decode operations
- Unicode characters may fail encoding
- Adds unnecessary complexity

**Recommendation**: 
- Server-side answer validation instead of client-side encoding
- Or use more robust encryption (AES)

---

### 4. Media Alignment Bugs

**Issue**: Media alignment (left/right) logic is convoluted

**Evidence**:
```javascript
scope.mediaalignBtnChange = function(value) {
    switch(value) {
        case 'img-left':
            if($("#target").parents('.template-width-5').length==0){
                $("#target").find('.template-width-5').addClass('media-align');
            } else {
                $("#target").parents('.template-width-5').addClass('media-align');
            }
            // Different logic paths based on DOM structure
    }
}
```

**Impact**: Media may not align properly in certain scenarios

**Recommendation**: 
- Use CSS Flexbox/Grid for consistent alignment
- Simplify JavaScript to just toggle classes

---

### 5. Audio Player Initialization Timing

**Issue**: Audio players sometimes fail to initialize due to timing issues

**Evidence**:
```javascript
$timeout(function() {
    if ($(element).find('audio').length > 0) {
        audiojs.create($(element).find('audio')[0]);
    }
}, 300); // Arbitrary 300ms delay
```

**Impact**: Audio may not be playable immediately

**Recommendation**:
- Use proper async/await or promises
- Listen for DOM ready events rather than timeouts

---

### 6. Style Application Redundancy

**Issue**: Styles are applied multiple times through different code paths

**Evidence**:
```javascript
scope.enrichOptionButtons(); // Called in multiple places
scope.handleStyle3(); // Called after every style change
// Multiple $timeout blocks that apply similar styles
```

**Impact**: 
- Performance overhead
- Potential visual glitches during re-rendering

**Recommendation**: 
- Consolidate style application into single function
- Use AngularJS $watch efficiently

---

### 7. Incomplete Accessibility

**Issue**: Missing ARIA labels, keyboard navigation incomplete

**Missing**:
- `role="radiogroup"` on option container
- `aria-checked` on options
- `aria-live` regions for feedback
- Focus management after submission

**Recommendation**:
```html
<div role="radiogroup" aria-labelledby="question-text">
    <div role="radio" aria-checked="false" tabindex="0">
        Option 1
    </div>
    <div role="radio" aria-checked="false" tabindex="0">
        Option 2
    </div>
</div>
<div role="alert" aria-live="polite" class="feedback"></div>
```

---

### 8. Error Messages Not Localized

**Issue**: Error messages and feedback are hardcoded in English

**Evidence**:
```javascript
alert('Oops! You have selected the wrong answer');
```

**Impact**: Cannot be translated for international users

**Recommendation**: Use localization framework (i18n)

---

## Recommendations

### 1. Architectural Improvements

#### A. Separate True/False from MCQ
**Current State**: Shares codebase with Multiple Choice component  
**Recommendation**: Create independent True/False component

**Benefits**:
- Cleaner codebase
- Easier maintenance
- Specialized features per component

**Implementation**:
```
templates/
├── multiplechoice/          # MCQ component
│   ├── scripts/
│   └── styles/
└── truefalse/               # Standalone True/False
    ├── scripts/
    │   ├── tf-directive.js  # Renamed, refactored
    │   └── tf-runtime.js
    └── styles/
        └── tf-styles.css    # Independent styles
```

---

#### B. Migrate from AngularJS 1.x to Modern Framework
**Current State**: Uses deprecated AngularJS 1.x  
**Recommendation**: Migrate to React, Vue, or Angular (latest)

**Benefits**:
- Better performance
- TypeScript support
- Modern tooling
- Long-term maintainability

**Migration Path**:
1. Create new component in target framework
2. Implement feature parity
3. Run both in parallel (gradual migration)
4. Deprecate old component

---

#### C. Implement Component-Based Architecture
**Current State**: Monolithic directive with 2000+ lines  
**Recommendation**: Break into smaller, reusable components

**Example Structure** (React):
```jsx
<TrueFalseComponent>
  <QuestionHeader />
  <QuestionInstruction />
  <QuestionText />
  <MediaPanel />
  <OptionsContainer>
    <Option index={0} />
    <Option index={1} />
  </OptionsContainer>
  <FeedbackPanel />
  <ButtonPanel>
    <SubmitButton />
    <ResetButton />
    <ShowMeButton />
    <TryAgainButton />
  </ButtonPanel>
</TrueFalseComponent>
```

---

### 2. Code Quality Improvements

#### A. Add Comprehensive Error Handling
```javascript
// Current: No error handling
audiojs.create($('#target')[0]);

// Recommended:
try {
    const audioPlayer = audiojs.create($('#target')[0]);
    if (!audioPlayer) {
        throw new Error('Audio player initialization failed');
    }
} catch (error) {
    console.error('Audio Error:', error);
    displayMediaErrorMessage('Unable to load audio. Please try again.');
}
```

#### B. Implement Input Validation
```javascript
function validateTrueFalseData(data) {
    const errors = [];
    
    if (!data.instruction || data.instruction.trim() === '') {
        errors.push('Question text is required');
    }
    
    if (!data.listData[0].mcssData.choiceList[0].choice.choiceText.trim()) {
        errors.push('First option text is required');
    }
    
    if (!data.listData[0].mcssData.choiceList[1].choice.choiceText.trim()) {
        errors.push('Second option text is required');
    }
    
    if (data.correctOptionIndex === null || data.correctOptionIndex === undefined) {
        errors.push('Please mark the correct answer');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
```

#### C. Add Unit Tests
```javascript
describe('TrueFalse Component', () => {
    describe('Answer Validation', () => {
        it('should mark correct answer as correct', () => {
            const component = new TrueFalseComponent(mockData);
            component.selectOption(0); // Correct option
            const result = component.validateAnswer();
            expect(result.isCorrect).toBe(true);
        });
        
        it('should mark incorrect answer as incorrect', () => {
            const component = new TrueFalseComponent(mockData);
            component.selectOption(1); // Incorrect option
            const result = component.validateAnswer();
            expect(result.isCorrect).toBe(false);
        });
        
        it('should enforce attempt limits', () => {
            const component = new TrueFalseComponent({...mockData, maxTries: 2});
            component.selectOption(1);
            component.submit(); // Attempt 1
            expect(component.canRetry()).toBe(true);
            
            component.selectOption(1);
            component.submit(); // Attempt 2
            expect(component.canRetry()).toBe(false);
        });
    });
});
```

---

### 3. Performance Optimizations

#### A. Lazy Load Media
```javascript
// Current: All media loads on component init
// Recommended: Lazy load on scroll or interaction

const lazyLoadMedia = () => {
    const mediaElements = document.querySelectorAll('.lazy-media');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                media.src = media.dataset.src;
                observer.unobserve(media);
            }
        });
    });
    
    mediaElements.forEach(media => observer.observe(media));
};
```

#### B. Debounce Style Changes
```javascript
// Current: Styles applied on every change
// Recommended: Debounce frequent changes

const debouncedStyleUpdate = _.debounce(() => {
    applyStyles();
}, 300);

scope.$watch('fieldData.style', () => {
    debouncedStyleUpdate();
}, true);
```

#### C. Optimize DOM Manipulation
```javascript
// Current: Multiple jQuery calls
$('.form-row').css('background-color', '');
$('.checkmark').removeAttr('style');
$('.checkboxmark').removeAttr('style');

// Recommended: Batch updates
const resetStyles = () => {
    const fragment = document.createDocumentFragment();
    // Batch all changes, then apply once
    requestAnimationFrame(() => {
        // Apply all style changes
    });
};
```

---

### 4. Accessibility Enhancements

#### A. Add Full ARIA Support
```html
<div role="group" aria-labelledby="tf-question">
    <h3 id="tf-question">{{fieldData.instruction}}</h3>
    
    <div role="radiogroup" aria-labelledby="tf-question">
        <div role="radio" 
             aria-checked="false" 
             tabindex="0"
             ng-repeat="option in choices">
            {{option.choiceText}}
        </div>
    </div>
    
    <div role="alert" 
         aria-live="polite" 
         aria-atomic="true"
         class="feedback-region">
        <!-- Feedback appears here -->
    </div>
</div>
```

#### B. Implement Keyboard Navigation
```javascript
document.addEventListener('keydown', (e) => {
    const focusedOption = document.activeElement;
    
    switch(e.key) {
        case 'ArrowDown':
            focusNextOption(focusedOption);
            break;
        case 'ArrowUp':
            focusPreviousOption(focusedOption);
            break;
        case 'Enter':
        case ' ':
            selectOption(focusedOption);
            break;
    }
});
```

#### C. Screen Reader Announcements
```javascript
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Usage
announceToScreenReader('Your answer is correct!');
```

---

### 5. Security Enhancements

#### A. Server-Side Answer Validation
```javascript
// Current: Answer checked client-side (can be manipulated)
// Recommended: Validate on server

async function submitAnswer(componentId, selectedOption) {
    const response = await fetch('/api/validate-answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            componentId: componentId,
            selectedOption: selectedOption,
            timestamp: Date.now()
        })
    });
    
    const result = await response.json();
    return result; // {isCorrect: true/false, feedback: "..."}
}
```

#### B. Sanitize User Input
```javascript
// Current: No XSS protection on editable fields
// Recommended: Sanitize all user input

import DOMPurify from 'dompurify';

function sanitizeInput(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'u', 'em', 'strong', 'br'],
        ALLOWED_ATTR: []
    });
}

// Apply to all contenteditable fields
$('[contenteditable]').on('blur', function() {
    const clean = sanitizeInput($(this).html());
    $(this).html(clean);
});
```

#### C. Implement Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               media-src 'self' https:;">
```

---

### 6. UX Improvements

#### A. Add Loading States
```html
<div class="tf-component" ng-class="{'loading': isLoading}">
    <div class="loader" ng-if="isLoading">
        <span>Loading...</span>
    </div>
    <!-- Component content -->
</div>
```

#### B. Improve Feedback Timing
```javascript
// Current: Feedback shows immediately
// Recommended: Add brief delay for better UX

function showFeedback(message, type) {
    setTimeout(() => {
        const feedback = createFeedbackElement(message, type);
        animateIn(feedback);
        
        setTimeout(() => {
            animateOut(feedback);
        }, 3000);
    }, 300); // Small delay allows user to see their selection
}
```

#### C. Add Confirmation Dialogs
```javascript
// Before Submit (optional)
if (settings.confirmBeforeSubmit) {
    showConfirmDialog('Are you sure you want to submit?', () => {
        submitAnswer();
    });
}

// Before Reset
showConfirmDialog('This will clear your answer. Continue?', () => {
    resetComponent();
});
```

---

### 7. Documentation Improvements

#### A. Code Documentation
```javascript
/**
 * Validates user's answer and provides feedback
 * @param {number} selectedIndex - Index of selected option (0 or 1)
 * @param {boolean} isLastAttempt - Whether this is the final attempt
 * @returns {Object} Result object with isCorrect, feedback, and shouldShowAnswer
 * @throws {Error} If selectedIndex is out of bounds
 */
function validateAnswer(selectedIndex, isLastAttempt) {
    if (selectedIndex < 0 || selectedIndex > 1) {
        throw new Error('Invalid option index');
    }
    
    const isCorrect = selectedIndex === this.correctOptionIndex;
    // ... rest of implementation
}
```

#### B. User Documentation
Create comprehensive author guide:
- Step-by-step tutorials with screenshots
- Video walkthroughs
- Best practices for True/False questions
- Common pitfalls to avoid

#### C. API Documentation
```markdown
## True/False Component API

### Configuration Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| correctOptionIndex | number | 0 | Index of correct answer (0 or 1) |
| maxTries | number | 1 | Number of attempts allowed |
| feedbackCheckbox | boolean | false | Enable individual feedback |
| mediaCheckbox | boolean | false | Enable media attachment |

### Events

- `tf:answer-selected` - Fired when user selects an option
- `tf:answer-submitted` - Fired when user submits answer
- `tf:answer-validated` - Fired after answer validation
- `tf:reset` - Fired when component is reset
```

---

### 8. Future Enhancements

#### A. Advanced Features
1. **Timed Questions**: Add countdown timer
2. **Confidence Rating**: Ask user how confident they are
3. **Explanation Mode**: Author can add detailed explanation for correct answer
4. **Randomization**: Randomly swap option order to prevent pattern recognition
5. **Hint System**: Progressive hints that reduce score
6. **Analytics**: Track time to answer, attempt patterns

#### B. Gamification
1. **Points System**: Award points for correct answers
2. **Streaks**: Track consecutive correct answers
3. **Badges**: Award badges for achievements
4. **Leaderboard**: Compare performance with peers

#### C. Collaboration Features
1. **Peer Discussion**: Allow learners to discuss answer
2. **Expert Commentary**: Include expert insights on answer
3. **Poll Results**: Show how other learners answered

---

## API Reference

### Public Methods (Editor Mode)

```javascript
/**
 * Initialize True/False component
 * @param {Object} config - Configuration object
 */
trueFalseData.init(config);

/**
 * Get current component data
 * @returns {Object} Complete component data
 */
trueFalseData.getData();

/**
 * Set component data
 * @param {Object} data - Component data to set
 */
trueFalseData.setData(data);

/**
 * Apply style theme
 * @param {string} styleName - Name of style ('card-style1', etc.)
 * @param {string} colorCode - Hex color code
 */
trueFalseData.applyStyle(styleName, colorCode);

/**
 * Add media to component
 * @param {string} type - Media type ('image', 'video', 'audio')
 * @param {string} url - Media URL
 */
trueFalseData.addMedia(type, url);

/**
 * Validate component before save
 * @returns {Object} {isValid: boolean, errors: Array}
 */
trueFalseData.validate();
```

### Public Methods (Reader Mode)

```javascript
/**
 * Submit user's answer
 * @param {number} optionIndex - Selected option (0 or 1)
 * @returns {Promise<Object>} Validation result
 */
trueFalseRuntime.submitAnswer(optionIndex);

/**
 * Reset component to initial state
 */
trueFalseRuntime.reset();

/**
 * Show correct answer
 */
trueFalseRuntime.showAnswer();

/**
 * Get current state
 * @returns {Object} Current component state
 */
trueFalseRuntime.getState();

/**
 * Restore previous state
 * @param {Object} state - State object to restore
 */
trueFalseRuntime.restoreState(state);
```

### Events

```javascript
// Editor Events
$scope.$on('tf:style-changed', function(event, data) {
    console.log('Style changed to:', data.style);
});

$scope.$on('tf:media-uploaded', function(event, data) {
    console.log('Media uploaded:', data.url);
});

$scope.$on('tf:option-modified', function(event, data) {
    console.log('Option modified:', data.index, data.text);
});

// Reader Events
document.addEventListener('tf:answer-selected', (e) => {
    console.log('Answer selected:', e.detail.index);
});

document.addEventListener('tf:answer-submitted', (e) => {
    console.log('Answer submitted:', e.detail);
});

document.addEventListener('tf:validated', (e) => {
    console.log('Validation result:', e.detail.isCorrect);
});
```

---

## Conclusion

The True/False component is a feature-rich, flexible assessment widget that supports binary choice questions with extensive customization options. While it shares architectural patterns with the Multiple Choice component, it has unique characteristics suited for simpler, two-option scenarios.

### Strengths:
✅ Highly customizable visual styles (60+ combinations)  
✅ Rich media support (images, videos, audio)  
✅ Flexible feedback system  
✅ Multiple attempt handling  
✅ Mathematical equation support  
✅ SCORM/LMS integration  

### Areas for Improvement:
⚠️ Modernize codebase (migrate from AngularJS 1.x)  
⚠️ Improve accessibility (ARIA labels, keyboard nav)  
⚠️ Add comprehensive error handling  
⚠️ Implement server-side answer validation  
⚠️ Separate from MCQ codebase for clarity  
⚠️ Add unit and integration tests  
⚠️ Optimize performance (lazy loading, debouncing)  

### Recommended Next Steps:
1. **Immediate**: Fix critical bugs (media alignment, audio initialization)
2. **Short-term**: Add validation, error handling, and accessibility features
3. **Medium-term**: Refactor into standalone component with modern framework
4. **Long-term**: Implement advanced features and gamification

---

**Document Version**: 1.0  
**Last Updated**: February 17, 2026  
**Author**: Technical Documentation Team  
**Review Status**: Comprehensive Analysis Complete  

For questions or clarifications, please contact the development team.
