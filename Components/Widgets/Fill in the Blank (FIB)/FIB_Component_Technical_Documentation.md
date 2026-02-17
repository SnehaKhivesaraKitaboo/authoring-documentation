# Fill in the Blank (FIB) Component - Technical Documentation

## Executive Summary

The Fill in the Blank (FIB) component is an interactive authoring and assessment tool that supports three distinct interaction modes: **Dropdown**, **Text Input**, and **Drag & Drop**. It also includes a variant with image support (FIB with Image). The component is built using AngularJS for the editor interface and jQuery for preview/reader rendering.

**Version:** Current implementation (as of February 2026)  
**Platform:** KITABOO Authoring Tool  
**Primary Technologies:** AngularJS 1.x, jQuery, MathLive (for mathematical equations), Temml (for LaTeX rendering)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Core Features](#core-features)
4. [File Organization](#file-organization)
5. [Data Model](#data-model)
6. [Rendering Logic](#rendering-logic)
7. [User Interaction Flow](#user-interaction-flow)
8. [Validation and Answer Checking](#validation-and-answer-checking)
9. [State Management](#state-management)
10. [Integration Points](#integration-points)
11. [Known Issues and Edge Cases](#known-issues-and-edge-cases)
12. [Recommendations](#recommendations)


## 1. Architecture Overview

### 1.1 High-Level Design

The FIB component follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    EDITOR MODE (Authoring)                  │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  fib.html       │  │  Directive   │  │  Settings     │ │
│  │  (Template)     │──│  Controller  │──│  Panel        │ │
│  └─────────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (JSON Model)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  fib.json - Default configuration & data structure   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              PREVIEW/READER MODE (Rendering)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  fib-template-preview1.js - Runtime interaction      │  │
│  │  - Answer validation                                  │  │
│  │  - Drag & drop logic                                  │  │
│  │  - User input handling                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 1.2 Architectural Diagram

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
         ├────────────────────┼────────────┼──────────────────────┐
         │                    │            │                      │
    ┌────▼────┐         ┌─────▼─────┐ ┌───▼────┐        ┌───────▼──────┐
    │ Settings│         │  Blank    │ │Sentence│        │  FIB Type    │
    │  Panel  │         │Management │ │Manager │        │  Selection   │
    └─────────┘         └───────────┘ └────────┘        │Dropdown/Text/│
                              │                         │  Drag&Drop   │
                        ┌─────▼──────┐                  └──────────────┘
                        │  Response  │
                        │   List     │
                        │  Builder   │
                        └────────────┘

         │                                              │
         └──────────────────┬───────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │   JSON Data Model  │
                  │                    │
                  │  • fieldData       │
                  │  • settings        │
                  │  • isWithOption    │
                  │  • fibInfo[]       │
                  │  • responseList[]  │
                  │  • distractors[]   │
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
    └──────────────────┬────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │ Dropdown  │ │  Text   │    │  Drag &     │
    │ Handler   │ │  Input  │    │  Drop       │
    │           │ │ Handler │    │  Handler    │
    └────┬──────┘ └────┬────┘    └──────┬──────┘
         │             │                │
         └─────────────┼────────────────┘
                       │
              ┌────────▼────────┐
              │  Submit Answer  │
              │   Validation    │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │ Normalize │ │ Compare │    │   Visual    │
    │  Answer   │ │ Answers │    │  Feedback   │
    │           │ │         │    │  (CSS)      │
    └───────────┘ └────┬────┘    └─────────────┘
                       │
              ┌────────▼────────┐
              │  Math Equation  │
              │  Support        │
              │ (MathLive/Temml)│
              └────────┬────────┘
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

### Editor Initialization Flow

```
index.html loads → AngularJS bootstrap → ngController init → 
Directive registration → FIB template clicked → fibTemplate directive link → 
Scope setup → Initialize FIB type (dropdown/text/drag-drop) → 
Load sentences → loadBlanks() → Parse existing blanks → 
Render in editor → Settings panel opened → currSettings bound → 
Author ready to edit
```

### Blank Insertion Flow (All Types)

```
Author types in sentence → Positions cursor → Clicks "Insert Blank" → 
insertBlank() called → Determines FIB type (isWithOption) → 
Generates HTML structure based on type:
  ├─ Dropdown: <select> with options
  ├─ Text Input: <input type="text">
  └─ Drag & Drop: <span> drop zone → 
Creates responseList entry → Assigns unique ID (response-X) → 
Compiles with AngularJS ($compile) → Inserts into DOM at cursor → 
Updates statement in fibInfo[] → Encodes in Base64 → 
Enables save button → Author continues adding blanks
```

### Answer Validation Flow (Preview/Reader)

```
Student completes answers → Clicks Submit → SubmitAnswerFIB(event) → 
Determine FIB type → Loop through all blanks → 
For each blank:
  - Extract correct answer (decode Base64)
  - Get student's answer (from input/select/drop zone)
  - Normalize both answers (trim, lowercase if insensitive)
  - Compare:
      • Dropdown: Compare selected index
      • Text Input: Compare text (support multiple answers with |)
      • Drag & Drop: Compare data-id attributes
  - Apply CSS classes (.correct, .incorrect)
  - Add visual icons (✓ or ✗)
  - Count results → 
Calculate percentage → Show feedback → Increment attempts → 
Update button states (Submit/Try Again/Show Me/Reset) → 
Report to SCORM (if enabled) → Save state
```

### FIB Type-Specific Architectures

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DROPDOWN TYPE (with-option)                         │
└─────────────────────────────────────────────────────────────────────────┘

Editor Mode:
───────────
Insert Blank → Create <select> element → Add options (2-20) → 
Mark correct answer with checkmark → Configure properties:
  • Option text/image
  • Shuffle setting
  • Points allocation → 
Compile and insert into sentence → Save to responseList:
  {
    "id": "response-1",
    "type": "dropdown",
    "options": [...],
    "correctIndex": 0,
    "shuffle": true
  }

Reader Mode:
──────────
Parse responseList → Render <select> → Populate options → 
Apply shuffle (if enabled) → Student selects → Submit validates:
  selectedIndex === correctIndex ? correct : incorrect → 
Visual feedback applied

┌─────────────────────────────────────────────────────────────────────────┐
│                  TEXT INPUT TYPE (without-option)                       │
└─────────────────────────────────────────────────────────────────────────┘

Editor Mode:
───────────
Insert Blank → Create <input type="text"> → Enter correct answer(s) → 
Support multiple answers (separated by |) → Configure:
  • Case sensitivity
  • Math equation mode (MathLive)
  • Max length
  • Points → 
Save to responseList:
  {
    "id": "response-2",
    "type": "text",
    "correctAnswers": "answer1|answer2|answer3",
    "caseSensitive": false,
    "mathMode": false
  }

Reader Mode:
──────────
Render <input> → Student types → Submit validates:
  Normalize answer → Split correct answers by | → 
  Check if student answer matches any → 
  If mathMode: Parse LaTeX/MathML → Compare equation structure → 
Visual feedback + icon

┌─────────────────────────────────────────────────────────────────────────┐
│                   DRAG & DROP TYPE (drag-and-drop)                      │
└─────────────────────────────────────────────────────────────────────────┘

Editor Mode:
───────────
Insert Blank → Create drop zone <span> → Define correct answer → 
Auto-generate answer pool (# of blanks) → Optional distractors → 
Configure:
  • Answer pool size
  • Distractor count (0-10)
  • Shuffle pool → 
Save to responseList:
  {
    "id": "response-3",
    "type": "dragdrop",
    "correctAnswer": "Paris",
    "correctId": "drag-item-1"
  }
Distractors saved separately in distractors[] array

Reader Mode:
──────────
Initialize jQuery UI draggable/droppable → Render answer pool → 
Apply shuffle → Student drags → Drop event validates zone → 
Item snaps to blank → Submit validates:
  Check data-id of item in zone === correctId → 
Visual feedback on drop zone

```

### Math Equation Support Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   MATH EQUATION INTEGRATION                             │
└─────────────────────────────────────────────────────────────────────────┘

Editor Mode:
───────────
Enable math mode → Insert blank → Math editor opens (MathLive) → 
Author enters equation (LaTeX syntax) → Preview renders → 
Save as LaTeX string in responseList:
  "correctAnswers": "\\frac{x^2}{2} + 3x - 5"

Reader Mode:
──────────
Detect math mode → Initialize MathLive input → 
Render LaTeX with Temml → Student enters equation → 
MathLive captures input → Submit validates:
  Parse both LaTeX strings → 
  Normalize (whitespace, equivalent forms) → 
  Compare symbolic equality (not just string match) → 
Visual feedback

Supported Formats:
• LaTeX: \\frac{a}{b}, \\sqrt{x}, x^2, etc.
• Mathematical symbols: ∫, ∑, π, √, etc.
• Inline and display modes
• Equation editor UI with keyboard
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDITOR MODE                                   │
│                                                                         │
│  Author Input → AngularJS Binding → JSON Model Update →                │
│  Settings Panel → fieldData.settings → Template Re-render              │
│                                                                         │
│  Sentence Management:                                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Add/Remove Sentences → Update fibInfo[] → Re-index blanks →     │ │
│  │ Compile HTML → Render in editor                                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Blank Management:                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Insert Blank → Generate HTML by type → Add to responseList →    │ │
│  │ Encode answer (Base64) → Store in fibInfo[].statement →         │ │
│  │ Update DOM → Save component                                      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PREVIEW/READER MODE                                │
│                                                                         │
│  Page Load → Parse JSON → Render sentences → Create inputs →           │
│  Initialize interactions → Student fills blanks → Submit validates     │
│                                                                         │
│  Type-Specific Rendering:                                               │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Dropdown: Render <select>, populate options, shuffle           │ │
│  │ Text Input: Render <input>, enable typing, math support        │ │
│  │ Drag & Drop: Initialize jQuery UI, render pool, enable drag    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Validation Logic:                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Submit → Loop blanks → Decode correct answer → Get student     │ │
│  │ answer → Normalize → Compare → Apply CSS → Count results →     │ │
│  │ Show feedback → Update attempts → Toggle buttons → Save state  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Mode-Specific Behavior

| Mode | Purpose | Key Files | Interaction |

| **Editor** | Content authoring | `fib-template-directive.js`, `fib.html` | - Add/remove sentences<br>- Insert/delete blanks<br>- Configure answers<br>- Apply styles |
| **Preview** | Content validation | `fib-template-preview1.js` | - Test interactions<br>- Validate functionality<br>- Review appearance |
| **Reader** | Student assessment | `fib-template-preview1.js` | - Answer submission<br>- Score calculation<br>- Feedback display |


## 2. Component Structure

### 2.1 Directory Layout

```
templates/fib/
├── fib.html                          # Main template markup
├── fib-settings-panel.html           # Configuration UI (933 lines)
├── default/
│   └── fib.json                      # Default configuration
├── scripts/
│   ├── fib-template-directive.js     # Editor directive (1926 lines)
│   └── fib-template-preview1.js      # Preview/Reader logic (2346 lines)
└── styles/
    ├── fib-template.css              # Component styling
    └── images/                       # Style thumbnails
```

### 2.2 Key Components

#### 2.2.1 Main Template ([fib.html](d:\Authoring\closify\KITABOO_Authoring\templates\fib\fib.html))

**Purpose:** Defines the HTML structure for the FIB component across all modes.

**Key Sections:**
- **Header Section:** Optional label type (primary/secondary question numbering)
- **Instruction Section:** Customizable instruction text
- **Paragraph Section:** Optional paragraph with image (FIB with Image variant)
- **Sentence Container:** Dynamic list of sentences with blanks
- **Distractor Section:** Additional incorrect options for drag-and-drop
- **Action Buttons:** Submit, Show Me, Try Again, Reset
- **Custom Keyboard:** Special character input for language subjects

**Critical Attributes:**
```html
<div class="component-holder fib" 
     data-fib-type="{{fieldData.settings.isWithOption}}"
     data-maxtries="{{fieldData.settings.maxTries}}"
     data-user-subject-lang="{{fieldData.settings.userSubjectLang}}">
```

#### 2.2.2 Editor Directive ([fib-template-directive.js](d:\Authoring\closify\KITABOO_Authoring\templates\fib\scripts\fib-template-directive.js))

**Purpose:** Manages authoring interactions and component configuration.

**Key Functions:**

| Function | Purpose | Line Range |
||
| `insertBlank()` | Creates new blank input fields | 679-879 |
| `loadBlanks()` | Renders saved blanks from JSON | 105-168 |
| `blankClick()` | Handles blank selection in editor | Various |
| `addSentenceClick()` | Adds new sentence rows | 78-91 |
| `removeSentenceClick()` | Deletes sentence rows | 100-111 |
| `correctOptionClick()` | Sets correct answer for dropdown | Event handler |
| `fibradioChange()` | Switches between option types | Event handler |

**Initialization Logic:**
```javascript
// Check if this is FIB with Image variant
if (con.tocSelected == "FIB with Image" || con.fibStyle == 'fibcard-style7') {
    $scope.setFIBImageStyle();
    $scope.fieldData.settings.fibWithImage = true;
}
```

**Blank Insertion Logic:**
- Maximum 20 blanks per sentence
- Each blank type (dropdown/text/drag-drop) has unique HTML structure
- Uses `$compile` to dynamically generate Angular-bound elements
- Maintains `responseList` array in data model

#### 2.2.3 Preview Script ([fib-template-preview1.js](d:\Authoring\closify\KITABOO_Authoring\templates\fib\scripts\fib-template-preview1.js))

**Purpose:** Handles runtime interactions, validation, and state persistence.

**Key Functions:**

| Function | Purpose | Lines | Description |
||||
| `SubmitAnswerFIB()` | Validates student answers | 900-1290 | - Compares user input with correct answers<br>- Marks correct/incorrect<br>- Manages attempts<br>- Shows feedback |
| `showAnswerFIB()` | Reveals correct answers | 1294-1444 | - Displays all correct answers<br>- Disables further input<br>- Shows visual indicators |
| `tryagainFIB()` | Resets for retry | 1449-1523 | - Clears incorrect answers<br>- Re-enables input<br>- Preserves attempt count |
| `resetAnswerFIB()` | Complete reset | 1595-1663 | - Clears all answers<br>- Resets attempt counter<br>- Restores initial state |
| `stateMainatainFIB()` | SCORM state management | 745-886 | - Captures current state<br>- Persists to LMS<br>- Supports resume |

**Answer Validation Logic:**
```javascript
// Support for multiple correct answers (pipe-separated)
var correctAnswers = correctAnswer.toLowerCase().split('|').map(temp => temp.trim());

// Case-sensitive or insensitive comparison
if (correctAnswers && currenrAnswer && 
    correctAnswers.includes(currenrAnswer.toLowerCase().trim())) {
    // Mark correct
}
```


## 3. Core Features

### 3.1 Three Interaction Types

**Overview Diagram:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FILL IN THE BLANK - INTERACTION TYPES                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   1. DROPDOWN TYPE      │  │   2. TEXT INPUT TYPE    │  │   3. DRAG & DROP TYPE   │
│   (with-option)         │  │   (without-option)      │  │   (drag-and-drop)       │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│                         │  │                         │  │                         │
│  The capital of France  │  │  The capital of France  │  │  The capital of France  │
│  is [Select ▼]          │  │  is [________]          │  │  is [        ]          │
│     ┌─────────────┐     │  │                         │  │                         │
│     │ Paris       │     │  │  • Type answer          │  │  ┌─────────────────┐    │
│     │ London      │     │  │  • Free text entry      │  │  │ ANSWER POOL:    │    │
│     │ Berlin      │     │  │  • Multiple answers OK  │  │  │ ┌─────┐ ┌─────┐ │    │
│     │ Madrid      │     │  │  • Case sensitivity     │  │  │ │Paris│ │Rome │ │    │
│     └─────────────┘     │  │  • Math equations       │  │  │ └─────┘ └─────┘ │    │
│                         │  │                         │  │  │ ┌─────┐ ┌─────┐ │    │
│  • Select from list     │  │                         │  │  │ │Lisbo│ │Berl │ │    │
│  • One correct answer   │  │                         │  │  │ └─────┘ └─────┘ │    │
│  • 2-20 options         │  │                         │  │  └─────────────────┘    │
│  • Can shuffle          │  │                         │  │  • Drag to blank        │
│  • Text/Math/Images     │  │                         │  │  • Visual manipulation  │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
         ▼                            ▼                             ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   BEST FOR:             │  │   BEST FOR:             │  │   BEST FOR:             │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│ • Multiple choice       │  │ • Short answers         │  │ • Vocabulary matching   │
│ • Limited options       │  │ • Spelling tests        │  │ • Sequencing            │
│ • Preventing typos      │  │ • Math problems         │  │ • Categorization        │
│ • Guided assessment     │  │ • Open-ended response   │  │ • Kinesthetic learning  │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

**Comparison Matrix:**

| Feature | Dropdown | Text Input | Drag & Drop |
|||
| **Data Model** | `isWithOption: "with-option"` | `isWithOption: "without-option"` | `isWithOption: "drag-and-drop"` |
| **Input Method** | Click to select | Type/keyboard | Click & drag |
| **Answer Precision** | Exact match (index) | Flexible (multiple accepted) | Exact match (position) |
| **Options Count** | 2-20 per blank | Unlimited (pipe-separated) | Pool size = blank count |
| **Typo Tolerance** | ✅ No typos possible | ❌ Exact spelling required | ✅ No typos possible |
| **Shuffle Support** | ✅ Yes | ❌ N/A | ✅ Yes |
| **Math Equations** | ✅ Yes | ✅ Yes (MathLive) | ✅ Yes (display only) |
| **Images Support** | ✅ Yes | ❌ No | ✅ Yes |
| **Case Sensitivity** | ❌ N/A | ✅ Optional | ❌ N/A |
| **Touch Friendly** | ✅ Excellent | ✅ Good | ⚠️ Requires polyfill |
| **Accessibility** | ⚠️ Limited | ✅ Good | ❌ Poor |
| **Cognitive Load** | 🟢 Low | 🟡 Medium | 🔴 High |

**Interaction Flow:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          STUDENT INTERACTION                            │
└─────────────────────────────────────────────────────────────────────────┘

DROPDOWN:                    TEXT INPUT:                 DRAG & DROP:
─────────                    ──────────                  ────────────
1. Click blank               1. Click blank              1. Click draggable item
   ↓                            ↓                           ↓
2. Menu opens                2. Cursor active            2. Hold & drag
   ↓                            ↓                           ↓
3. Click option              3. Type answer              3. Move to drop zone
   ↓                            ↓                           ↓
4. Selection shown           4. Text appears             4. Release to drop
   ↓                            ↓                           ↓
5. Submit                    5. Submit                   5. Item fills blank
                                                            ↓
                                                         6. Submit

VALIDATION:                  VALIDATION:                 VALIDATION:
───────────                  ───────────                 ───────────
Compare selectedIndex        Compare text content        Compare data-id
with correctIndex           with correct answer(s)      attributes
                            (case-sensitive option)
```

**Author Configuration View:**

```
┌──────────────────────────────────────────────────────────────────┐
│ FIB SETTINGS PANEL - Option Type Selection                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Select Option Type:                                            │
│                                                                  │
│   ○ Dropdown      [When to use: Guided choice, prevent typos]  │
│   ○ Text          [When to use: Open-ended, math, spelling]    │
│   ○ Drag & Drop   [When to use: Matching, sorting, visual]     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Preview:                                                   │ │
│  │                                                            │ │
│  │  The Earth revolves around the [        ]                 │ │
│  │                                                            │ │
│  │  [Configure Answer Options →]                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Additional Settings:                                           │
│  ☑ Shuffle choices (Dropdown/Drag & Drop only)                 │
│  ☐ Case-sensitive (Text Input only)                            │
│  ☐ Allow multiple correct answers (Text Input only)            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Dropdown (with-option)

**Use Case:** Multiple choice selection with predefined options

**Characteristics:**
- Dropdown menu with 2-20 options per blank
- One correct answer marked with checkmark icon
- Options can include text, equations, or images
- Supports shuffle on preview

**HTML Structure:**
```html
<div class="dropdown fib-with-option">
    <div class="btn dropdownbtn">
        <span class="chosenAns">Select Answer</span>
        <span class="icon-Down dropdown-arrow"></span>
    </div>
    <ul class="dropdown-menu">
        <li data-id="rowIndex_blankIndex_optionIndex">
            <span class="icon-Check"></span>
            <span class="fib-option-text" contenteditable="true"></span>
            <span class="delete-fib-option">×</span>
        </li>
    </ul>
</div>
```

**Data Structure:**
```json
{
    "responseList": [{
        "responseId": "blankArea1",
        "choiceList": [
            {"choice": {"choiceText": "Option 1"}},
            {"choice": {"choiceText": "Option 2"}}
        ],
        "correctIndex": 0
    }]
}
```

#### 3.1.2 Text Input (without-option)

**Use Case:** Free-form text entry with exact or partial matching

**Characteristics:**
- Contenteditable div for text input
- Supports multiple correct answers (pipe-separated: `ans1|ans2|ans3`)
- Case-sensitive option available
- Math equation support via MathLive integration

**HTML Structure:**
```html
<div class="js-form-row fib-without-option">
    <div class="form-control-wrap drag">
        <div contenteditable="true" 
             class="inputbox-selected fib_input_click" 
             placeholder="Type Answer"
             data-correct-answer="{{encodedAnswer}}">
        </div>
    </div>
</div>
```

**Math Integration:**
```javascript
// Inserting math field at cursor
function insertMathFieldAtCursor(inputElement, openKeyboard) {
    document.execCommand("insertHTML", false, 
        "<span class='auth-mathfield-holder'>" +
        "<math-field class='mathFieldEq'></math-field>" +
        "</span>");
}
```

#### 3.1.3 Drag & Drop (drag-and-drop)

**Use Case:** Physical manipulation of answer options

**Characteristics:**
- Draggable answer options from a pool
- Drop zones within sentences
- Supports both text and images
- Optional distractor options

**Drag Logic:**
```javascript
$(".fib .sort-with-row").droppable({
    accept: ".fib .draggable-div",
    drop: function(event, ui) {
        var draggable = $(ui.draggable);
        var droppable = $(this);
        dropTheBlank(draggable, droppable, $form);
    }
});
```

**Drop Validation:**
```javascript
$(".sort-select").each(function(i) {
    correctAnswer = $(this).attr('data-id');
    currentAnswer = $(this).next().attr('data-id');
    if (correctAnswer === currentAnswer) {
        $(this).next().addClass('sort-correct');
    }
});
```

### 3.2 FIB with Image Variant

**Key Differences:**
- Paragraph section with image/audio/video
- Media placement options (top/bottom for paragraph, left/right for sentences)
- Per-sentence media support
- Uses style `fibcard-style7`

**Settings:**
```javascript
currSettings.fibWithImage = true;
currSettings.isParagraphVisible = true;
paragraphData.showMedia = true;
paragraphData.mediaType = 'image'; // or 'audio', 'video'
```

### 3.3 Mathematical Equation Support

**Integration:** Uses **MathLive** library for LaTeX equation input

**Capabilities:**
- Insert math equations into text blanks
- Virtual math keyboard (manual policy)
- LaTeX syntax support
- Render-only mode for display

**Implementation:**
```javascript
// Show math keyboard icon (only for Math subject)
if (userSubjectLang.toLowerCase() === 'math') {
    const $icon = $('<span class="fib-math-icon icon-Keyboard"></span>');
    $inputBox.after($icon);
}

// Math field initialization
mathField.mathVirtualKeyboardPolicy = "manual";
mathField.setValue('');
```

**Known Issue:** Empty math fields cause XML validation errors in package generation

### 3.4 Custom Character Keyboard

**Purpose:** Support special characters for language subjects (French, Spanish, German)

**Activation:**
```javascript
$scope.fieldData.settings.isCustomKeyboardEnable = true;
$scope.fieldData.settings.userSubjectLang = "FRA"; // or "ESP", "GER"
```

**Character Insertion:**
```javascript
$scope.keyboardKeyPressEvent = function(event) {
    document.execCommand('insertText', false, event.currentTarget.textContent);
}
```


## 4. File Organization

### 4.1 Core Files

| File | Size | Purpose | Key Responsibilities |
|
| **fib.html** | 149 lines | Template markup | - Component structure<br>- Angular bindings<br>- Dynamic content areas |
| **fib-settings-panel.html** | 933 lines | Configuration UI | - Option type selection<br>- Style picker<br>- Feature toggles<br>- Media settings |
| **fib-template-directive.js** | 1926 lines | Editor logic | - Blank insertion/deletion<br>- Answer configuration<br>- Undo/Redo support<br>- Data binding |
| **fib-template-preview1.js** | 2346 lines | Runtime logic | - Answer validation<br>- Drag & drop handling<br>- State persistence<br>- Feedback display |
| **fib.json** | ~200 lines | Default config | - Initial settings<br>- Data structure template<br>- Style definitions |
| **fib-template.css** | N/A | Styling | - Visual styles<br>- Responsive layout<br>- 7 style variants |

### 4.2 Dependencies

**External Libraries:**
- `angular.min.js` - AngularJS framework
- `jquery-ui.min.js` - Drag & drop, resizable
- `jquery.ui.touch-punch.js` - Touch support
- `jquery.mCustomScrollbar.js` - Custom scrollbars
- MathLive (loaded dynamically) - Math equations
- Temml (loaded dynamically) - LaTeX rendering

**Internal Dependencies:**
- `commonbuttons` directive - Submit/Reset/Show Me buttons
- `modalService` - Popup dialogs
- `uploadfiles` directive - Media upload
- `edittemplate` attribute - Editor mode activation


## 5. Data Model

### 5.1 JSON Structure

**Top-Level Configuration:**
```json
{
    "identifier": "fill-in-the-blank",
    "question": "Question 1",
    "secondaryQuestion": "Part A",
    "settings": { /* ... */ },
    "style": { /* ... */ },
    "media": { /* ... */ },
    "TemplateData": { /* ... */ },
    "custom": { /* ... */ }
}
```

### 5.2 Settings Object

**Key Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isWithOption` | string | "with-option" | Interaction type: "with-option", "without-option", "drag-and-drop" |
| `maxTries` | string | "3" | Maximum attempts allowed |
| `isHeaderVisible` | boolean | true | Show/hide header text |
| `isInstructionVisible` | boolean | true | Show/hide instruction |
| `isLabelType` | boolean | false | Show question label (Q1, Part A, etc.) |
| `labelType` | string | "primary" | Label style: "primary" or "secondary" |
| `fibWithImage` | boolean | false | Enable FIB with Image variant |
| `isParagraphVisible` | boolean | true | Show/hide paragraph section |
| `shuftleChoiceCheckbox` | boolean | false | Shuffle dropdown options on preview |
| `Case_SensitiveCheckbox` | boolean | false | Enable case-sensitive matching |
| `allowRestart` | boolean | false | Enable "Try Again" functionality |
| `showmecheckbox` | boolean | false | Show "Show Me" button |
| `genericFeedbackCheckbox` | boolean | false | Use generic feedback messages |
| `selected_style` | string | "fibcard-style1" | Visual style (1-7) |
| `isCustomKeyboardEnable` | boolean | false | Enable special character keyboard |
| `userSubjectLang` | string | "" | Subject language code (FRA, ESP, GER, MATH) |
| `showFIBdistractor` | boolean | true | Show distractor insertion option |
| `distractor` | array | [] | List of distractor options (drag-and-drop only) |

### 5.3 Template Data Structure

**Sentence and Blank Configuration:**
```json
{
    "fibInfo": [
        {
            "id": "fib1",
            "statement": "The capital of France is {blank}.",
            "itemInstruction": "Enter Answer",
            "showMedia": false,
            "mediaType": "image",
            "imageUrl": "images/image.jpg",
            "mediaPosition": "left",
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
                                "choiceText": "Paris",
                                "textData": { "type": "Text", "text": "Paris" },
                                "media": { /* image/audio/video config */ }
                            }
                        }
                    ],
                    "correctIndex": 0,
                    "correctChoice": []
                }
            ]
        }
    ]
}
```

**Key Arrays:**

1. **`fibInfo`** - Array of sentences (max 20)
   - Each sentence can have multiple blanks
   - Supports HTML content with embedded blanks

2. **`responseList`** - Array of blanks per sentence (max 20)
   - Stores answer options
   - Tracks correct answer index
   - Maintains blank width for UI

3. **`choiceList`** - Array of options per blank (2-20 for dropdown)
   - Contains answer text or media
   - First item is typically correct answer

4. **`distractor`** - Array of incorrect options (drag-and-drop)
   - Added to option pool
   - Not associated with any blank

### 5.4 Paragraph Data (FIB with Image)

```json
{
    "paragraphData": {
        "paragraph": "Descriptive text...",
        "showMedia": true,
        "mediaType": "image",
        "imageUploadOrReplace": "Upload",
        "imageUrl": "images/image.jpg",
        "optionalcaption": "",
        "mediaPosition": "top",
        "altText": "Description"
    }
}
```

---

## 6. Rendering Logic

### 6.1 Editor Mode Rendering

**Flow:**
1. Directive controller initializes scope data
2. `$timeout` loads existing blanks via `loadBlanks()`
3. User edits trigger `$compile` to regenerate HTML
4. Changes sync to `fieldData.TemplateData`

**Dynamic Blank Generation:**
```javascript
// Dropdown blank HTML generation
sentence = `
<div class="dropdown fib-with-option" inarrayindex="${blankindex}">
    <div class="btn dropdownbtn">
        <span class="chosenAns">Select Answer</span>
    </div>
    <ul class="dropdown-menu">
        <li ng-repeat="curValue in fieldData.TemplateData.fibInfo[${rowNo}].responseList[${blankindex}].choiceList">
            <span class="fib-option-text" contenteditable="true"></span>
        </li>
    </ul>
</div>`;

// Compile and insert
pasteFibAtCaret(sentence, false, window.range, window.sel, $compile, scope);
```

**Blank Width Management:**
- Blanks are resizable via jQuery UI `.resizable()`
- Width stored in `datadragwidth` attribute
- Persisted to `responseList[i].datadragwidth`

### 6.2 Preview/Reader Mode Rendering

**Initialization (on page load):**
```javascript
$(function() {
    // Hide editor-only elements
    $('.deleteBlank, .fib-delete-sentence').addClass('hide');
    
    // Set contenteditable based on mode
    if (!window.isActivityInprogress) {
        $('.fib[data-fib-type="without-option"] .inputbox-selected').attr('contenteditable', true);
    }
    
    // Initialize drag-and-drop pool
    $('.fib.drag-and-drop .sentence-text').each(function(i) {
        // Extract draggables from sentences
        // Append to .preview-sort pool
    });
    
    // Shuffle options if enabled
    if ($(".fib-body").hasClass("shuffle-choices")) {
        shuffledOptionsArray = shuffle(options);
    }
});
```

**Drag & Drop Setup:**
```javascript
$(".fib .sort-with-row").droppable({
    accept: ".fib .draggable-div",
    drop: function(event, ui) {
        dropTheBlank($(ui.draggable), $(this), $form);
        
        // Check if all blanks filled
        if (allBlanksFilled) {
            $form.find('.submit-btn').removeClass('disabled');
        }
    }
});
```

### 6.3 Style Application

**7 Pre-defined Styles:**
- `fibcard-style1` - Default
- `fibcard-style2` - Alternate color scheme
- `fibcard-style3` - Underline style
- `fibcard-style4` - Dashed underline
- `fibcard-style5` - Box style
- `fibcard-style6` - Rounded box
- `fibcard-style7` - FIB with Image (special layout)

**Dynamic CSS:**
```javascript
$('.fib').each(function(index, item) {
    var assetcolor = $(item).data('assetcolor');
    $(item).find('.preview-drop').css('border-color', assetcolor);
    
    if ($(item).hasClass("fibcard-style3")) {
        $(item).find('.preview-drop').css('border-bottom', '2px solid');
    }
});
```

---

## 7. User Interaction Flow

### 7.1 Editor Workflow

```
┌──────────────────┐
│  Drag FIB from   │
│  Template Tray   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Component Initialized   │
│  - Default style applied │
│  - 1 empty sentence      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Author Types Sentence   │
│  - Position cursor       │
│  - Click "Insert Blank"  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Configure Blank         │
│  - Select option type    │
│  - Add answer options    │
│  - Mark correct answer   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Repeat for More Blanks  │
│  - Max 20 per sentence   │
│  - Add more sentences    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Configure Settings      │
│  - Max attempts          │
│  - Show Me/Reset options │
│  - Shuffle choices       │
│  - Case sensitivity      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Apply Style & Save      │
└──────────────────────────┘
```

### 7.2 Student Assessment Flow

```
┌──────────────────┐
│  Student Loads   │
│  Assessment Page │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  Read Instructions           │
│  - View question context     │
│  - Understand task           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Provide Answers             │
│  DROPDOWN: Select from list  │
│  TEXT: Type answer           │
│  DRAG: Drag option to blank  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Click "Submit"              │
│  - Disabled until all filled │
│  - Validates answers         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Receive Feedback            │
│  ✓ Correct answers marked    │
│  ✗ Incorrect answers marked  │
│  - Generic message displayed │
└────────┬─────────────────────┘
         │
         ▼
     ┌───┴────┐
     │ All    │  Yes  ┌──────────────┐
     │Correct?├───────│  End         │
     └───┬────┘       └──────────────┘
         │ No
         ▼
┌──────────────────────────────┐
│  Attempts Remaining?         │
│  - Max 3 by default          │
└────────┬─────────────────────┘
         │ Yes
         ▼
┌──────────────────────────────┐
│  Click "Try Again"           │
│  - Clears incorrect answers  │
│  - Re-enables input          │
└──────────────────────────────┘
         │ No
         ▼
┌──────────────────────────────┐
│  Show "Show Me" Option       │
│  - Displays correct answers  │
│  - Disables further input    │
└──────────────────────────────┘
```

### 7.3 Button State Logic

| Button | Enabled When | Action | After Action |
|--------|--------------|--------|--------------|
| **Submit** | All blanks filled | Validate answers | Disabled |
| **Reset** | After 1st interaction | Clear all answers | Disabled |
| **Try Again** | After incorrect submit (attempts remain) | Clear incorrect, keep correct | Disabled until next submit |
| **Show Me** | After final attempt OR manually enabled | Show all correct answers | Disabled permanently |

---

## 8. Validation and Answer Checking

### 8.1 Answer Comparison Logic

**Text Input (without-option):**

```javascript
// Extract correct answer(s)
correctAnswer = decodeURIComponent(escape(window.atob(
    $(blank).find(selector).data('correct-answer')
)));

// Support multiple correct answers
var correctAnswers = correctAnswer.toLowerCase().split('|').map(temp => temp.trim());

// Get user's answer
currenrAnswer = $(blank).find(selector).html();
currenrAnswer = normalizeQuotes(currenrAnswer.toLowerCase());

// Compare
if (correctAnswers.includes(currenrAnswer.toLowerCase().trim())) {
    // CORRECT
} else {
    // INCORRECT
}
```

**Dropdown (with-option):**

```javascript
// Correct answer stored as index
correctAnswer = $(blank).find('ul.previewList').attr('data-correctoption-index');

// User's selection
currenrAnswer = $(blank).find('ul.previewList').attr('data-selected-index');

// Compare
if (correctAnswer === currenrAnswer) {
    // CORRECT
}
```

**Drag & Drop (drag-and-drop):**

```javascript
$(".sort-select").each(function(i) {
    correctAnswer = $(this).attr('data-id');  // e.g., "DI_0_0"
    currentAnswer = $(this).next().attr('data-id');
    
    if (correctAnswer === currentAnswer) {
        // CORRECT
    } else {
        // INCORRECT
    }
});
```

### 8.2 Case Sensitivity

**Configuration:**
```javascript
scope.fieldData.settings.Case_SensitiveCheckbox = true;
```

**Application:**
```javascript
if ($form.find('.Case_Sensitive').length > 0) {
    // Exact match (case-sensitive)
    if (correctAnswer === currenrAnswer) { /* CORRECT */ }
} else {
    // Case-insensitive match
    if (correctAnswer.toLowerCase() === currenrAnswer.toLowerCase()) { /* CORRECT */ }
}
```

### 8.3 Multiple Correct Answers

**Format:** Pipe-separated values in `data-correct-answer`
```html
<div data-correct-answer="Paris|paris|PARIS"></div>
```

**Splitting:**
```javascript
var correctAnswers = correctAnswer.split('|').map(ans => ans.trim());
```

**Hint Display:**
```html
<div class="ansTextHint">
    Use a pipe ( | ) to separate multiple answers. 
    Example, answer1|answer2|answer3
</div>
```

### 8.4 Visual Feedback

**Correct Answer:**
```javascript
$(blank).find(selector).addClass('correct');
var tickIcon = '<span class="correct-tick icon-correct"></span>';
$(blank).append(tickIcon);
```

**Incorrect Answer:**
```javascript
$(blank).find(selector).addClass('incorrect');
var crossIcon = '<span class="incorrect-tick icon-close-filled"></span>';
$(blank).append(crossIcon);
```

**Generic Feedback Alert:**
```javascript
var fibAlert = {
    show: function(symbol, className, $form, localized_name, message) {
        $form.find(".fib-alert-container").html(
            '<span class="fib-alert-icon icon-correct"></span>' +
            '<span class="fib-alert-message">' + message + '</span>'
        );
        $form.find(".fib-alert").css('display', 'block');
    }
};
```

---

## 9. State Management

### 9.1 SCORM Integration

**Function:** `stateMainatainFIB(event)`

**Captured State:**
```javascript
var scoObj = {
    isSubmitEnable: !$form.find(".submit-btn").hasClass("disabled"),
    isShowMeEnable: !$form.find(".showme-btn").hasClass("disabled"),
    isTryAgainEnable: !$form.find(".tryagn-btn").hasClass("disabled"),
    isResetEnable: !$form.find(".reset-btn").hasClass("disabled"),
    totalNoOfAttempt: Number($form.find(".submit-btn").data('no-of-attempts')),
    attemptsDone: Number($form.find(".submit-btn").attr('data-attempts')),
    feedbackMessage: {
        enable: $form.find(".fib-alert").css("display") == "block",
        symbol: "Correct!" | "Incorrect!",
        message: "..."
    },
    inputSeleced: [...],  // Array of user answers
    inputCorrect: [...],  // Indices of correct blanks
    inputIncorrect: [...], // Indices of incorrect blanks
    dataType: "fill-in-the-blank",
    componentId: $form.parents(".customClass").attr('data-saved-index')
};

saveAction(event, scoObj);
```

**Resume Logic:**
```javascript
// On page load, check for saved state
if (typeof apiHandle != "undefined") {
    var savedState = getSavedState(componentId);
    
    // Restore answers
    savedState.inputSeleced.forEach((answer, index) => {
        $(blanks[index]).find(selector).val(answer);
    });
    
    // Restore button states
    if (!savedState.isSubmitEnable) {
        $form.find('.submit-btn').addClass('disabled');
    }
    
    // Restore feedback
    if (savedState.feedbackMessage.enable) {
        fibAlert.show(savedState.feedbackMessage.symbol, '', $form, null, savedState.feedbackMessage.message);
    }
}
```

### 9.2 Undo/Redo Support

**Structure:**
```javascript
con.undo_stack.push({
    "Action": "EditAddComponent",
    "pageNo": pageNo,
    "uniqueId": uniqueId,
    "templateInfo": {
        "prevjson": angular.copy(prevSettings),
        "currjson": angular.copy(currSettings),
        "parrentuuid": blankUUID,
        "parentsprevhtml": prevHTML,
        "parentcurrenthtml": currentHTML
    }
});
```

**Restoration:**
```javascript
// Undo last blank insertion
var lastAction = con.undo_stack.pop();
$(currentElement).find('[fib-template]').scope().fieldData.TemplateData.settings = 
    angular.copy(lastAction.templateInfo.prevjson);
$(currentElement).html(lastAction.templateInfo.parentsprevhtml);
```

### 9.3 Activity Start Time Tracking

```javascript
if (!$form.parents('.customClass').attr('latencyTime')) {
    let d = new Date();
    let tm = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    $form.parents('.customClass').attr('activityStartTime', tm);
}

// On first interaction
if ($form.parents('.customClass').attr('activityStartTime') == 
    $form.parents('.customClass').attr('latencyTime')) {
    $form.parents('.customClass').attr('latencyTime', currentTime);
}
```

---

## 10. Integration Points

### 10.1 Common Systems Integration

**1. Template Tray**
- Widget drag-and-drop from left panel
- Identifier: `"fill-in-the-blank"`
- Icon class: `"icon-Fill-in-the-blank"`

**2. Settings Panel**
- Global settings panel (`#fib-settings-panel`)
- Integrates with style panel directive (`<stylepanel></stylepanel>`)
- Common settings: attempts, restart, show me

**3. Common Buttons Directive**
- Provides Submit, Reset, Try Again, Show Me buttons
- Attributes: `data-submitattr`, `data-resetattr`, etc.
- Consistent across all interactive components

**4. Media Upload**
- Uses `uploadfiles` directive
- Supports images, audio, video
- Integration with asset management system

**5. Equation Editor**
- MathLive for authoring
- Temml for rendering
- Math keyboard for mobile

### 10.2 Multipart Question Integration

**Context:** FIB can be embedded within Multipart Questions

**Challenges:**
- Settings isolation (FIB settings vs. parent settings)
- Button state coordination (submit all vs. submit individual)
- Group activity detection

**Handling:**
```javascript
if ($(e.target).parents(".group-interactivity-container").length > 0) {
    con.currSettings.isGroupActivity = true;
    
    // Check if all components in group are attempted
    if ($form.parents(".group-interactivity-container")
            .find("form.attempted-question").length == 
        $form.parents(".group-interactivity-container")
            .find("form").length) {
        $form.parents(".group-interactivity-container").addClass("enableSubmit");
    }
}
```

### 10.3 Localization

**String Externalization:**
```javascript
if (window.localeJson) {
    $(element).find('.inline-alert span').text(window.localeJson['incorrect_message']);
}
```

**Supported Keys:**
- `correct`
- `incorrect_last_try`
- `incorrect_message`
- `select_answer`

### 10.4 SCORM/xAPI

**Functions Called:**
- `saveAction(event, scoObj)` - Persists state
- `stateMainatainFIB(event)` - Captures state changes

**Data Points:**
- User responses
- Score (correct/total)
- Attempts used
- Time spent
- Completion status

---

## 11. Known Issues and Edge Cases

### 11.1 Critical Issues

#### **Issue 1: Empty Math Fields Cause Package Generation Failures**

**Severity:** HIGH  
**Impact:** Content cannot be packaged for deployment

**Description:**
When a math field is inserted but left empty, the `data-correct-answer` attribute contains invalid HTML/XML that causes parsing errors during package generation.

**Example:**
```html
<div data-correct-answer="<div contenteditable='true'>..."></div>
```

**Symptoms:**
- Package generation fails with XML validation errors
- Error message references CDATA or invalid character sequences

**Workaround (Implemented):**
```javascript
// In fib-template-preview1.js
$(".js-form-row.fib-without-option div.inputbox-selected[data-correct-answer]").each(function() {
    const correctAnswer = $(this).attr("data-correct-answer");
    
    if (correctAnswer && (correctAnswer.includes('<div') || correctAnswer.includes('<math-field'))) {
        const extractedLatex = extractLatexFromHTML(correctAnswer);
        if (extractedLatex) {
            $(this).attr("data-correct-answer", extractedLatex);
        } else {
            $(this).attr("data-correct-answer", ""); // Clear to prevent errors
        }
    }
});
```

**Permanent Fix Needed:**
- Validate math fields before save
- Strip HTML from `data-correct-answer` at save time
- Store LaTeX directly instead of HTML

---

#### **Issue 2: Dropdown Positioning Overflow**

**Severity:** MEDIUM  
**Impact:** Dropdowns extend beyond visible area

**Description:**
When dropdown blanks are near the bottom of the page, the dropdown menu extends beyond the viewport, causing scrolling issues.

**Recent Fix (Implemented):**
```javascript
function addClassDropdown() {
    $(".fib .dropdown.js-form-row").each(function() {
        var elementTop = $(this).position().top;
        var halfHeight = $(this).closest("article").height() / 2;
        
        if (elementTop < halfHeight) {
            $(this).addClass("inUpperHalf").removeClass("inBottomHalf");
        } else {
            $(this).addClass("inBottomHalf").removeClass("inUpperHalf");
        }
    });
}
```

**CSS:**
```css
.dropdown.inBottomHalf .dropdown-menu {
    bottom: 100%;
    top: auto;
}

.dropdown.inUpperHalf .dropdown-menu {
    top: 100%;
    bottom: auto;
}
```

---

#### **Issue 3: Drag & Drop State Persistence Issues**

**Severity:** MEDIUM  
**Impact:** User progress lost on page refresh

**Description:**
Dragged items are not properly restored from SCORM state when resuming an activity.

**Root Cause:**
- `data-id` attributes not consistently saved
- Drop zone HTML regeneration doesn't preserve dragged items

**Partial Fix:**
```javascript
// Save dragged item IDs
inputSeleced.push($(blank).find(".inputbox-selected.draggable-div").attr("data-id"));

// Restore on load
if (savedState.inputSeleced[index]) {
    var draggedItem = $form.find('.preview-sort [data-id="' + savedState.inputSeleced[index] + '"]');
    dropTheBlank(draggedItem, $(blanks[index]), $form);
}
```

**Full Fix Needed:**
- Store complete drag state (source ID, destination ID)
- Restore both pool and dropped items

---

### 11.2 Edge Cases

#### **Edge Case 1: 20 Blank Limit Enforcement**

**Scenario:** User tries to insert 21st blank

**Current Behavior:**
- Insert button becomes disabled
- No error message displayed

**Code:**
```javascript
if ($('#target .js-form-row').length + 1 >= 20) {
    scope.fieldData.TemplateData.fibInfo[rowNo].active = true;
    $('#target').parents('.row-item').find('.insert-blank').addClass('disabled');
}
```

**Improvement Needed:**
- Show tooltip: "Maximum 20 blanks per sentence"
- Display alert when limit reached

---

#### **Edge Case 2: Multiple Correct Answers with Special Characters**

**Scenario:** Correct answer contains pipe character (`|`)

**Problem:**
Pipe is used as delimiter for multiple correct answers, so answers containing pipes cannot be validated correctly.

**Example:**
```
Correct Answer: "echo $PATH | grep bin"
User Answer: "echo $PATH | grep bin"
Result: INCORRECT (splits on pipes)
```

**Workaround:**
- Escape pipe: `echo $PATH \| grep bin`
- Use alternative delimiter (comma)

**Proper Fix:**
- Allow custom delimiter selection in settings
- Support escape sequences

---

#### **Edge Case 3: Case-Sensitive with Unicode Characters**

**Scenario:** Non-ASCII characters in case-sensitive mode

**Problem:**
JavaScript `toLowerCase()` may not handle all Unicode characters correctly across locales.

**Example:**
- Turkish: `I.toLowerCase() === "ı"` (not "i")
- German: `"ß".toUpperCase() === "SS"`

**Current Implementation:**
```javascript
correctAnswer.toLowerCase() === currenrAnswer.toLowerCase()
```

**Better Implementation:**
```javascript
correctAnswer.localeCompare(currenrAnswer, locale, { sensitivity: 'base' }) === 0
```

---

#### **Edge Case 4: HTML Injection in Text Blanks**

**Scenario:** User types HTML tags in text blank

**Risk:** XSS vulnerability

**Current Protection:** Minimal (contenteditable with `ng-paste="pasteprevent($event)"`)

**Attack Vector:**
```html
User types: <img src=x onerror="alert('XSS')">
```

**Protection Applied:**
```javascript
$scope.pasteprevent = function(event) {
    event.preventDefault();
    var text = (event.originalEvent || event).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}
```

**Additional Security Needed:**
- Sanitize on save
- Strip all HTML tags except `<math-field>` and `<auth-mathfield-holder>`

---

### 11.3 Browser Compatibility Issues

#### **Issue: Drag & Drop on Touch Devices**

**Problem:** Standard HTML5 drag-and-drop doesn't work on iOS/Android

**Solution Applied:**
- `jquery.ui.touch-punch.js` polyfill

**Remaining Issue:**
- Touch-punch doesn't handle scrolling while dragging
- Long-press sometimes triggers context menu

---

#### **Issue: MathLive Virtual Keyboard on iOS**

**Problem:** iOS keyboard interferes with MathLive virtual keyboard

**Workaround:**
```javascript
mathField.mathVirtualKeyboardPolicy = "manual";
mathField.readOnly = false; // Allow input but don't trigger system keyboard
```

**Known Limitation:**
- System keyboard still appears briefly before being dismissed
- User must manually open virtual keyboard

---

#### **Issue: Dropdown Auto-Close on Scroll**

**Problem:** Dropdowns remain open when user scrolls, causing visual overlap

**Fix Applied:**
```javascript
function detectScroll() {
    $(window).on('scroll', function() {
        let scrollDistance = Math.abs($(window).scrollTop() - lastScrollTop);
        
        if (scrollDistance >= 100) {
            $('.fib-with-option ul.dropdown-menu:visible').hide();
            lastScrollTop = $(window).scrollTop();
        }
    });
}
```

---

### 11.4 Accessibility Issues

#### **Issue: Keyboard Navigation for Dropdowns**

**Current State:** Dropdowns only support mouse clicks

**Problem:** Keyboard-only users cannot interact

**Required Fixes:**
- Add `tabindex="0"` to dropdowns
- Implement arrow key navigation
- Support Enter key to select
- Add ARIA attributes

```html
<div class="dropdown fib-with-option" tabindex="0" role="combobox" aria-expanded="false">
    <ul role="listbox">
        <li role="option" tabindex="-1">Option 1</li>
    </ul>
</div>
```

---

#### **Issue: Screen Reader Support**

**Current State:** Limited screen reader compatibility

**Problems:**
- Blanks not announced as form fields
- Correct/incorrect feedback not announced
- Drag & drop not describable

**Required Additions:**
```html
<div class="inputbox-selected" 
     role="textbox" 
     aria-label="Answer blank 1 of 3"
     aria-invalid="false"
     aria-describedby="blank-1-feedback">
</div>
<div id="blank-1-feedback" class="sr-only">
    Type your answer here
</div>
```

---

## 12. Recommendations

### 12.1 Immediate Improvements (High Priority)

#### **1. Fix Math Field Package Generation**

**Goal:** Prevent empty math fields from breaking package generation

**Action Items:**
1. Add validation before save:
   ```javascript
   $(element).find('math-field').each(function() {
       if (!this.getValue() || this.getValue().trim() === '') {
           alert('Please remove empty math equations or add content');
           return false;
       }
   });
   ```

2. Strip HTML from `data-correct-answer` at save time:
   ```javascript
   $scope.saveComponent = function() {
       $scope.fieldData.TemplateData.fibInfo.forEach(sentence => {
           sentence.responseList.forEach(blank => {
               blank.choiceList.forEach(choice => {
                   if (choice.choice.choiceText.includes('<math-field')) {
                       choice.choice.choiceText = extractLatexFromHTML(choice.choice.choiceText);
                   }
               });
           });
       });
   };
   ```

3. Store LaTeX separately:
   ```json
   {
       "choice": {
           "choiceText": "x^2",
           "choiceType": "latex",
           "choiceLatex": "x^2"
       }
   }
   ```

**Effort:** 8 hours  
**Risk:** Low (mostly data sanitization)

---

#### **2. Improve Drag & Drop State Persistence**

**Goal:** Properly save and restore dragged items

**Action Items:**
1. Enhance state capture:
   ```javascript
   var dragState = {
       sourcePoolIndex: [...],
       droppedBlanks: [
           { blankIndex: 0, draggedItemId: "DI_0_0" },
           { blankIndex: 1, draggedItemId: "DI_0_1" }
       ]
   };
   ```

2. Restore on page load:
   ```javascript
   function restoreDragState(dragState) {
       dragState.droppedBlanks.forEach(drop => {
           var dragItem = $form.find('[data-id="' + drop.draggedItemId + '"]');
           var dropZone = $(blanks[drop.blankIndex]).find('.preview-drop');
           dropTheBlank(dragItem, dropZone, $form);
       });
   }
   ```

**Effort:** 12 hours  
**Risk:** Medium (affects core functionality)

---

#### **3. Add User-Facing Error Messages**

**Goal:** Provide clear feedback for common issues

**Action Items:**
1. Blank limit warning:
   ```javascript
   if (blankCount >= 20) {
       showTooltip('Maximum 20 blanks per sentence reached');
       return false;
   }
   ```

2. Empty answer validation:
   ```javascript
   $scope.saveComponent = function() {
       var hasEmptyAnswers = false;
       // Check all blanks
       if (hasEmptyAnswers) {
           alert('Please provide correct answers for all blanks');
           return false;
       }
   };
   ```

**Effort:** 6 hours  
**Risk:** Low (UI only)

---

### 12.2 Medium-Term Enhancements

#### **4. Refactor Duplicate Code**

**Current State:** Answer validation logic duplicated across dropdown, text, drag-and-drop

**Proposal:** Extract to shared validation service

```javascript
// Create validation service
App.factory('FIBValidationService', function() {
    return {
        validateAnswer: function(correctAnswer, userAnswer, options) {
            var caseSensitive = options.caseSensitive || false;
            var allowMultiple = options.allowMultiple || false;
            
            // Unified validation logic
            if (allowMultiple) {
                var correctAnswers = correctAnswer.split('|').map(a => a.trim());
                return correctAnswers.some(ans => 
                    caseSensitive ? ans === userAnswer : 
                                    ans.toLowerCase() === userAnswer.toLowerCase()
                );
            }
            
            return caseSensitive ? correctAnswer === userAnswer : 
                                   correctAnswer.toLowerCase() === userAnswer.toLowerCase();
        }
    };
});
```

**Benefits:**
- Single source of truth for validation
- Easier to maintain and test
- Consistent behavior across modes

**Effort:** 16 hours  
**Risk:** Medium (requires testing all interaction types)

---

#### **5. Implement Comprehensive Accessibility**

**Goal:** Achieve WCAG 2.1 AA compliance

**Action Items:**
1. Add ARIA labels to all interactive elements
2. Implement full keyboard navigation
3. Add screen reader announcements for feedback
4. Support high contrast mode
5. Add focus indicators

**Effort:** 40 hours  
**Risk:** Medium (requires thorough testing with assistive tech)

---

#### **6. Enhance Math Equation Support**

**Current Limitations:**
- No equation preview in dropdown options
- Math keyboard sometimes conflicts with system keyboard
- LaTeX rendering can be slow

**Improvements:**
1. Pre-render equations in dropdown:
   ```javascript
   $(dropdown).find('li').each(function() {
       if ($(this).find('.auth-mathfield-holder').length) {
           renderMathFields($(this));
       }
   });
   ```

2. Optimize keyboard toggling:
   ```javascript
   mathField.addEventListener('focus', function() {
       if (!window.mathVirtualKeyboard.visible) {
           window.mathVirtualKeyboard.show();
       }
   });
   ```

3. Debounce LaTeX rendering:
   ```javascript
   var renderTimeout;
   mathField.addEventListener('input', function() {
       clearTimeout(renderTimeout);
       renderTimeout = setTimeout(() => {
           updateLatexPreview(mathField.getValue());
       }, 300);
   });
   ```

**Effort:** 24 hours  
**Risk:** Low (incremental improvements)

---

### 12.3 Long-Term Strategic Improvements

#### **7. Migrate to Modern Framework**

**Current State:** AngularJS 1.x (end-of-life)

**Proposal:** Migrate to Angular 15+ or React

**Benefits:**
- Better performance
- Modern development practices
- Improved maintainability
- Better TypeScript support

**Challenges:**
- Large codebase (~4200 lines for FIB alone)
- Tight coupling with other components
- Risk of regression

**Recommended Approach:**
1. Create component library in new framework
2. Build adapter layer for backward compatibility
3. Migrate components incrementally
4. Maintain dual support during transition

**Effort:** 200+ hours (full component library)  
**Risk:** High (major architectural change)

---

#### **8. Automated Testing Suite**

**Current State:** Minimal automated testing

**Proposal:** Comprehensive test coverage

**Test Categories:**
1. **Unit Tests** (Jest/Jasmine)
   - Validation logic
   - Data model operations
   - Utility functions

2. **Integration Tests** (Cypress/Playwright)
   - Editor interactions
   - Answer submission flow
   - State persistence

3. **Visual Regression Tests** (Percy/Chromatic)
   - Style application
   - Layout consistency
   - Cross-browser rendering

**Sample Unit Test:**
```javascript
describe('FIB Validation', () => {
    it('should accept multiple correct answers', () => {
        const correct = 'Paris|PARIS|paris';
        const userAnswer = 'PARIS';
        const result = FIBValidationService.validateAnswer(correct, userAnswer, {
            caseSensitive: false,
            allowMultiple: true
        });
        expect(result).toBe(true);
    });
});
```

**Sample Integration Test:**
```javascript
describe('FIB Assessment Flow', () => {
    it('should validate answers and show feedback', () => {
        cy.visit('/assessment.html');
        cy.get('.fib-without-option input').first().type('Paris');
        cy.get('.submit-btn').click();
        cy.get('.correct-tick').should('be.visible');
        cy.get('.fib-alert-message').should('contain', 'Congratulations');
    });
});
```

**Effort:** 80 hours (initial setup + core tests)  
**Risk:** Low (doesn't affect production)

---

#### **9. Performance Optimization**

**Current Bottlenecks:**
1. **Excessive DOM manipulation** during blank insertion
2. **No virtual scrolling** for long option lists
3. **Inefficient Angular watchers** on large datasets

**Optimization Strategies:**

**Strategy 1: Virtual Scrolling for Dropdowns**
```javascript
// Use libraries like ngx-virtual-scroller
<cdk-virtual-scroll-viewport itemSize="40">
    <li *cdkVirtualFor="let option of choiceList">
        {{option.choice.choiceText}}
    </li>
</cdk-virtual-scroll-viewport>
```

**Strategy 2: Debounce Frequent Operations**
```javascript
var saveTimeout;
$scope.onBlankWidthChange = function(newWidth) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        $scope.fieldData.TemplateData.fibInfo[rowNo].responseList[blankNo].datadragwidth = newWidth;
    }, 300);
};
```

**Strategy 3: Lazy Load MathLive**
```javascript
function loadMathLive() {
    if (!window.MathfieldElement) {
        return import('//unpkg.com/mathlive').then(() => {
            console.log('MathLive loaded');
        });
    }
    return Promise.resolve();
}
```

**Expected Improvements:**
- 50% faster blank insertion
- 30% reduction in memory usage
- Smoother drag-and-drop on low-end devices

**Effort:** 40 hours  
**Risk:** Medium (requires profiling and benchmarking)

---

### 12.4 Code Quality Improvements

#### **10. TypeScript Migration**

**Benefits:**
- Type safety for data models
- Better IDE support
- Catch errors at compile time

**Sample Type Definitions:**
```typescript
interface FIBSettings {
    isWithOption: 'with-option' | 'without-option' | 'drag-and-drop';
    maxTries: string;
    isHeaderVisible: boolean;
    isInstructionVisible: boolean;
    Case_SensitiveCheckbox: boolean;
    shuftleChoiceCheckbox: boolean;
    selected_style: string;
}

interface FIBBlank {
    responseId: string;
    mainIndex: number;
    responseIndex: number;
    datadragwidth: string;
    choiceList: FIBChoice[];
    correctIndex?: number;
    correctChoice?: any[];
}

interface FIBChoice {
    choice: {
        identifier: string;
        choiceText?: string;
        textData?: { type: string; text: string };
        media?: FIBMedia;
    };
}
```

**Effort:** 60 hours  
**Risk:** Low (incremental, non-breaking)

---

#### **11. Documentation and Code Comments**

**Current State:** Minimal inline documentation

**Proposed Standards:**

**JSDoc for Functions:**
```javascript
/**
 * Validates user's answer against correct answer(s)
 * 
 * @param {string} correctAnswer - Pipe-separated list of correct answers
 * @param {string} userAnswer - Answer provided by user
 * @param {Object} options - Validation options
 * @param {boolean} options.caseSensitive - Enable case-sensitive matching
 * @param {boolean} options.allowMultiple - Support multiple correct answers
 * @returns {boolean} True if answer is correct
 * 
 * @example
 * validateAnswer('Paris|PARIS', 'paris', { caseSensitive: false, allowMultiple: true })
 * // returns true
 */
function validateAnswer(correctAnswer, userAnswer, options) {
    // ...
}
```

**Inline Comments for Complex Logic:**
```javascript
// Extract correct answer from base64-encoded data attribute
// Format: base64(encodeURIComponent(escape(JSON.stringify({answer: "value"}))))
var encodedAnswer = $(blank).data('correct-answer');
var correctAnswer = decodeURIComponent(escape(window.atob(encodedAnswer)));
```

**Effort:** 20 hours  
**Risk:** None (documentation only)

---

## Conclusion

The Fill in the Blank (FIB) component is a complex, feature-rich assessment tool with extensive functionality across three interaction modes. While the core functionality is solid, there are several areas for improvement:

**Strengths:**
- Flexible design supporting multiple interaction types
- Robust answer validation logic
- Good integration with SCORM/xAPI
- Strong math equation support

**Key Challenges:**
- Math field HTML causing package generation failures (HIGH PRIORITY)
- Legacy AngularJS codebase requiring modernization
- Accessibility gaps
- Limited automated testing

**Recommended Focus Areas:**
1. **Immediate:** Fix critical packaging issues
2. **Short-term:** Improve UX with better error messages
3. **Medium-term:** Refactor for maintainability and accessibility
4. **Long-term:** Migrate to modern framework with comprehensive testing

By addressing these recommendations systematically, the FIB component can be transformed from a functional but fragile tool into a robust, maintainable, and delightful user experience for both authors and students.

---

## Appendix A: File Reference

| File Path | Lines | Key Contents |
|-----------|-------|--------------|
| `templates/fib/fib.html` | 149 | Template markup, Angular bindings |
| `templates/fib/fib-settings-panel.html` | 933 | Settings UI, configuration options |
| `templates/fib/scripts/fib-template-directive.js` | 1926 | Editor logic, blank insertion, undo/redo |
| `templates/fib/scripts/fib-template-preview1.js` | 2346 | Validation, drag-and-drop, state management |
| `templates/fib/default/fib.json` | ~200 | Default configuration template |
| `templates/fib/styles/fib-template.css` | N/A | Component styling, 7 style variants |

---

## Appendix B: API Reference

### Editor Functions (fib-template-directive.js)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `insertBlank(event)` | `event: Event` | `void` | Inserts new blank at cursor position |
| `loadBlanks()` | None | `void` | Renders saved blanks from JSON |
| `addSentenceClick(event)` | `event: Event` | `boolean` | Adds new sentence row |
| `removeSentenceClick(index)` | `index: number` | `void` | Removes sentence at index |
| `blankClick(event)` | `event: Event` | `void` | Handles blank selection for editing |
| `correctOptionClick(index)` | `index: number` | `void` | Marks option as correct answer |
| `fibradioChange(type)` | `type: string` | `void` | Switches interaction type |

### Preview Functions (fib-template-preview1.js)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `SubmitAnswerFIB(event)` | `event: Event` | `void` | Validates and grades answers |
| `showAnswerFIB(event)` | `event: Event` | `void` | Reveals correct answers |
| `tryagainFIB(event)` | `event: Event` | `void` | Clears incorrect answers for retry |
| `resetAnswerFIB(event)` | `event: Event` | `void` | Complete reset to initial state |
| `stateMainatainFIB(event)` | `event: Event` | `void` | Persists state to SCORM/xAPI |
| `dropTheBlank(draggable, droppable, form)` | `draggable: jQuery`, `droppable: jQuery`, `form: jQuery` | `void` | Handles drag-and-drop logic |

---

## Appendix C: Data Model JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["identifier", "settings", "TemplateData"],
  "properties": {
    "identifier": {
      "type": "string",
      "const": "fill-in-the-blank"
    },
    "question": {
      "type": "string",
      "description": "Primary question label"
    },
    "secondaryQuestion": {
      "type": "string",
      "description": "Secondary question label"
    },
    "settings": {
      "type": "object",
      "properties": {
        "isWithOption": {
          "type": "string",
          "enum": ["with-option", "without-option", "drag-and-drop"]
        },
        "maxTries": {
          "type": "string",
          "pattern": "^[1-9][0-9]*$"
        },
        "isHeaderVisible": {
          "type": "boolean"
        },
        "isInstructionVisible": {
          "type": "boolean"
        },
        "Case_SensitiveCheckbox": {
          "type": "boolean"
        },
        "shuftleChoiceCheckbox": {
          "type": "boolean"
        },
        "selected_style": {
          "type": "string",
          "pattern": "^fibcard-style[1-7]$"
        }
      }
    },
    "TemplateData": {
      "type": "object",
      "required": ["fibInfo"],
      "properties": {
        "introduction": {
          "type": "string"
        },
        "instruction": {
          "type": "string"
        },
        "fibInfo": {
          "type": "array",
          "minItems": 1,
          "maxItems": 20,
          "items": {
            "$ref": "#/definitions/sentence"
          }
        }
      }
    }
  },
  "definitions": {
    "sentence": {
      "type": "object",
      "required": ["id", "statement", "responseList"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^fib[0-9]+$"
        },
        "statement": {
          "type": "string",
          "description": "Sentence text with embedded blanks"
        },
        "responseList": {
          "type": "array",
          "maxItems": 20,
          "items": {
            "$ref": "#/definitions/blank"
          }
        }
      }
    },
    "blank": {
      "type": "object",
      "required": ["responseId", "choiceList"],
      "properties": {
        "responseId": {
          "type": "string"
        },
        "mainIndex": {
          "type": "number"
        },
        "responseIndex": {
          "type": "number"
        },
        "datadragwidth": {
          "type": "string"
        },
        "choiceList": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/choice"
          }
        },
        "correctIndex": {
          "type": "number",
          "description": "Index of correct answer (dropdown mode)"
        }
      }
    },
    "choice": {
      "type": "object",
      "required": ["choice"],
      "properties": {
        "choice": {
          "type": "object",
          "properties": {
            "identifier": {
              "type": "string"
            },
            "choiceText": {
              "type": "string"
            },
            "textData": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "const": "Text"
                },
                "text": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
