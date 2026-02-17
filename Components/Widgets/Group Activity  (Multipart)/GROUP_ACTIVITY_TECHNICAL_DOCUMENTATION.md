# Group Activity Component - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Component Types and Variants](#component-types-and-variants)
4. [Core Features](#core-features)
5. [Data Flow and Architecture Diagram](#data-flow-and-architecture-diagram)
6. [File Structure](#file-structure)
7. [Configuration Schema](#configuration-schema)
8. [Editor Mode](#editor-mode)
9. [Preview/Reader Mode](#previewreader-mode)
10. [Scoring and Feedback System](#scoring-and-feedback-system)
11. [Gradable Activity Integration](#gradable-activity-integration)
12. [Offline/Package Behavior](#offlinepackage-behavior)
13. [Error Handling](#error-handling)
14. [Known Issues](#known-issues)
15. [Recommendations](#recommendations)

---

## Overview

The **Group Activity** component is a container-based assessment widget that allows authors to combine multiple interactive assessment components (MCQ, True/False, Fill-in-the-Blank, Match-the-Pairs, etc.) into a single unified activity. It provides centralized controls for submission, feedback, and navigation across all contained assessments.

### Key Characteristics
- **Container Component**: Acts as a wrapper for multiple assessment widgets
- **Unified Control**: Single Submit/Reset/Show Me/Try Again buttons for all contained assessments
- **Multiple Styles**: Three visual presentation styles (Vertical, Horizontal Slider, Worked Example)
- **SCORM Compatible**: Supports gradable activities with time tracking and scoring
- **State Persistence**: Maintains user progress and responses

### Supported Child Widgets
The component can contain the following assessment types:
- Multiple Choice Questions (MCQ)
- True/False Questions
- Fill-in-the-Blank (FIB)
- Match-the-Pairs (MTP)
- Match-the-Pairs Multiple (MTP-Multiple)
- Image Labeling
- Highlight Text
- Correction/Strike-through
- Sorting
- Categorize
- Short/Long Answer
- Identify the Clip
- Table Graphic Organizer

---

## Component Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Group Activity Container                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Header/Navigation (Style 2)                │  │
│  │  [◄] [1] [2] [3] [4] [5] [►]     ⏱ Timer (Gradable) │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Question Container Box                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Child Assessment Widget 1 (MCQ)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Child Assessment Widget 2 (Fill-in-Blank)     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Child Assessment Widget 3 (Match-the-Pairs)   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Common Action Buttons                             │  │
│  │  [Show Me] [Reset] [◄ Prev] [Next ►] [Submit]        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Feedback Alert (Hidden until submission)             │  │
│  │  Questions Attempted: X                               │  │
│  │  ✓ Correct: X  ✗ Incorrect: X  ◐ Partial: X          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### MVC Pattern

```
┌─────────────────┐
│     Model       │
│  (fieldData)    │ ◄─── Configuration JSON (group-activity.json)
│                 │
│ - settings      │
│ - questionBank[]│
│ - metaTags      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │
│  (Directives)   │
│                 │
│ - groupInteractivity         │ ◄─── Editor Mode
│ - groupInteractivitySettings │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      View       │
│  (Templates)    │
│                 │
│ - group-activity.html          │ ◄─── Rendering
│ - group-activity-settings.html │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Preview Logic  │
│(group-activity- │
│  preview1.js)   │ ◄─── Reader/Preview Mode
│                 │
│ - Event Handlers│
│ - Validation    │
│ - Scoring       │
└─────────────────┘
```

---

## Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KITABOO Authoring Tool                         │
│                         (AngularJS Application)                         │
└────────────────────────────────┬────────────────────────────────────────┘                                 │
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
    │  Main   │         │Group      │      │
    │Controller│◄────────┤Activity   │      │
    │(ngCtrl) │         │Directive  │      │
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
    │ Settings│         │ Question  │ │  Drop  │        │Style Selector│
    │  Panel  │         │   Bank    │ │  Zone  │        │Style 1/2/WE  │
    │         │         │Management │ │Handler │        │              │
    └─────────┘         └───────────┘ └────────┘        └──────────────┘
                              │
                        ┌─────▼──────┐
                        │ Child      │
                        │ Widget     │
                        │ Compiler   │
                        └─────┬──────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
              ┌─────▼──────┐      ┌──────▼──────┐
              │ MCQ Widget │      │ FIB Widget  │
              │ Integration│      │ Integration │
              └────────────┘      └─────────────┘
                    │                    │
                    └─────────┬──────────┘
                              │
                  ┌───────────▼────────────┐
                  │   questionBank[] Array │
                  │                        │
                  │  • Child widgets (0-35)│
                  │  • Widget HTML         │
                  │  • Widget configurations│
                  └───────────┬────────────┘
                              │
                  ┌───────────▼────────────┐
                  │    JSON Data Model     │
                  │                        │
                  │  • fieldData           │
                  │  • settings            │
                  │  • styleClass          │
                  │  • isInteractive       │
                  │  • questionBank[]      │
                  │  • metaTags            │
                  └───────────┬────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
     ┌────────▼────────┐             ┌────────▼────────┐
     │   localStorage  │             │  Server Storage │
     │   (Auto-save)   │             │   (Manual Save) │
     └─────────────────┘             └─────────────────┘


═══════════════════════════════════════════════════════════════════════════
                         PREVIEW/READER MODE
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │          group-activity-preview1.js                         │
    │              (jQuery-based)                                 │
    └──────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────────────┐
         │             │                     │
    ┌────▼──────┐ ┌────▼────────┐    ┌──────▼──────┐
    │ Container │ │Navigation   │    │   Child     │
    │  Manager  │ │Controller   │    │  Widget     │
    │           │ │(Style 2)    │    │  Loaders    │
    └────┬──────┘ └────┬────────┘    └──────┬──────┘
         │             │                    │
         └─────────────┼────────────────────┘
                       │
              ┌────────▼────────┐
              │  Button Handler │
              │  Centralized    │
              │  Control        │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │  Submit   │ │  Show   │    │   Reset     │
    │  Handler  │ │   Me    │    │   Handler   │
    │           │ │ Handler │    │             │
    └────┬──────┘ └────┬────┘    └──────┬──────┘
         │             │                │
         └─────────────┼────────────────┘
                       │
              ┌────────▼────────┐
              │  Child Widget   │
              │  Trigger Logic  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────────┐
         │             │                 │
    ┌────▼──────┐ ┌────▼────┐    ┌──────▼──────┐
    │  Trigger  │ │Aggregate│    │   Visual    │
    │  Child    │ │ Results │    │  Feedback   │
    │Validation │ │         │    │  Display    │
    └────┬──────┘ └────┬────┘    └──────┬──────┘
         │             │                │
         └─────────────┼────────────────┘
                       │
              ┌────────▼────────┐
              │ Scoring Manager │
              │ • Correct count │
              │ • Incorrect     │
              │ • Partial       │
              │ • Progress %    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Attempt Manager │
              │ • Track attempts│
              │ • Button states │
              │ • Timer (if     │
              │   gradable)     │
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
Directive registration → Group Activity template clicked → 
groupInteractivity directive link → Scope setup → 
Initialize questionBank array → Create first drop zone → 
Settings panel opened → Style selection → Load saved widgets → 
Compile child widgets → Render in container
```

### Widget Drop & Integration Flow

```
Author drags widget from panel → Drop zone detects hover → 
Author releases widget → onDropComplete() triggered → 
Validate widget type (enableGroupInteractivity check) → 
Retrieve widget HTML template → Compile with AngularJS → 
Add to questionBank[] array → Insert into DOM → 
Add new empty drop zone (if < 35) → Update indices → 
Hide child widget buttons → Save component
```

### Student Interaction Flow (Style 1: Vertical)

```
Student loads activity → Parse JSON → Render all questions vertically → 
Initialize child widgets → Student answers questions → 
Click Submit → SubmitAnswerGroupActivity() →  
Loop through questionBank → Find each child's submit button → 
Trigger click on each → Collect results from children → 
Aggregate scores (correct/incorrect/partial) → 
Calculate percentage → Show feedback alert → 
Update attempt counter → Toggle button states → 
Report to SCORM (if gradable) → Enable/Disable Try Again
```

### Student Interaction Flow (Style 2: Horizontal Slider)

```
Student loads activity → Parse JSON → Render first question → 
Initialize slide navigation → Hide other questions → 
Build bullet navigation (numbered circles) → 
Student answers current question → Click Next → 
Slide transition (CSS transform) → Show next question → 
Update active bullet indicator → Update counter (2/5) → 
Repeat for all questions → Last slide shows Submit button → 
Click Submit → Same validation flow as Style 1 → 
Show feedback → Navigate back to review incorrect answers
```

### Submit & Validation Flow

```
Submit button clicked → Check if all required questions attempted → 
Show reminder popup if incomplete (with question numbers) → 
User confirms → Loop through questionBank array → 
For each child widget:
  - Find .submit-btn element
  - Trigger click() to activate child validation
  - Wait for child to update its state
  - Read child's result (correct/incorrect/partial)
  - Aggregate to counters → 
After all children validated → 
Calculate total score percentage → 
Construct feedback message:
  "Questions Attempted: X
   ✓ Correct: X  ✗ Incorrect: X  ◐ Partial: X" → 
Show feedback alert → Increment attempt counter → 
If attempts < maxTries: Enable Try Again → 
If attempts >= maxTries: Disable all buttons, Show final message → 
Report to SCORM with score and completion status
```

### Data Flow Diagram 

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDITOR MODE                                   │
│                                                                         │
│  Author Input → AngularJS Binding → JSON Model Update →                │
│  Settings Panel → fieldData.settings → Template Re-render              │
│                                                                         │
│  Widget Management:                                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Drag Widget → Validate → Compile HTML → Add to questionBank →   │ │
│  │ Insert into DOM → Create new drop zone → Save state             │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Child Widget Integration:                                              │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Each child maintains its own fieldData → Independent settings →  │ │
│  │ Parent hides child buttons → Parent provides common controls →  │ │
│  │ Parent triggers child validation → Parent aggregates results    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PREVIEW/READER MODE                                │
│                                                                         │
│  Page Load → Parse JSON → Render child widgets → Apply style →         │
│  Initialize navigation (if Style 2) → Student interacts →              │
│  Common button actions trigger child widget functions                  │
│                                                                         │
│  Centralized Control Flow:                                              │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Group Activity Button Click → Find child buttons (.submit-btn,  │ │
│  │ .showme-btn, etc.) → Trigger click on each → Wait for child     │ │
│  │ processing → Collect results → Aggregate → Show feedback →      │ │
│  │ Update parent UI state                                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Child-Parent Communication:                                            │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Children don't know they're in Group Activity → Parent creates  │ │
│  │ facade of independence → Parent reads child DOM/classes to get  │ │
│  │ results → No direct function calls → CSS class inspection for   │ │
│  │ correctness (.correct, .incorrect, .partial-correct)            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Style-Specific Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GROUP ACTIVITY STYLE VARIANTS                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   Style 1            │  │   Style 2            │  │   Worked Example     │
│   Vertical Scroll    │  │   Horizontal Slider  │  │   Collapsible        │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ ┌──────────────────┐ │  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │
│ │ Question 1       │ │  │ │Navigation Header │ │  │ │ ▼ Header Toggle  │ │
│ │ (MCQ)            │ │  │ │ [1][2][3][4][5]  │ │  │ │ [Show/Hide]      │ │
│ └──────────────────┘ │  │ │ Timer: 05:00     │ │  │ └──────────────────┘ │
│ ┌──────────────────┐ │  │ └──────────────────┘ │  │ ┌──────────────────┐ │
│ │ Question 2       │ │  │ ┌──────────────────┐ │  │ │ Content (Hidden) │ │
│ │ (True/False)     │ │  │ │ Question 1 (MCQ) │ │  │ │ Question 1       │ │
│ └──────────────────┘ │  │ │ [Only one visible│ │  │ │ Question 2       │ │
│ ┌──────────────────┐ │  │ │  at a time]      │ │  │ │ Question 3       │ │
│ │ Question 3       │ │  │ └──────────────────┘ │  │ └──────────────────┘ │
│ │ (FIB)            │ │  │ ┌──────────────────┐ │  │                      │
│ └──────────────────┘ │  │ │ [◄ Prev][Next ►] │ │  │ isInteractive: No   │
│  ↕ Scroll            │  │ │ Counter: 1/5     │ │  │ No action buttons   │
│ ┌──────────────────┐ │  │ └──────────────────┘ │  │ Read-only mode      │
│ │ [Submit] [Reset] │ │  │ ┌──────────────────┐ │  │                      │
│ └──────────────────┘ │  │ │[Submit][Try Again│ │  │                      │
│                      │  │ │(on last slide)   │ │  │                      │
│ All widgets visible  │  │ └──────────────────┘ │  └──────────────────────┘
│ Single scrollable    │  │                      │
│ container            │  │ Slide transitions    │  Use Case:
└──────────────────────┘  │ Bullet navigation    │  • Demonstrations
                          │ Progressive reveal   │  • Step-by-step examples
Use Case:                 └──────────────────────┘  • Reference materials
• Quick assessments                                 • Non-gradable content
• Short quizzes          Use Case:
• 1-10 questions         • Long assessments
• Simple navigation      • 10+ questions
                         • Sequential approach
                         • Mobile-friendly
```

### Timer & Gradable Integration Flow

```
Gradable Activity Enabled → Initialize timer on load → 
Display countdown in header/navigation → Track elapsed time → 
Student interacts with questions → Timer counts up/down → 
Submit clicked → Stop timer → Record time taken → 
Calculate score with time weighting (if configured) → 
Report to LMS:
  - Score (correct/incorrect/partial)
  - Time taken (minutes:seconds)
  - Completion timestamp
  - Attempt number → 
LMS stores data → Student can review results
```

---

## Component Types and Variants

### 1. Style 1: Vertical Scroll View

**Type Name**: `style1`

**Behavior**:
- All questions displayed vertically in a scrollable container
- Best for activities with 1-10 questions
- Timer displayed in top-right corner (for gradable activities)
- Questions are stacked vertically
- User can scroll through all questions at once

**Visual Characteristics**:
- Continuous scroll
- Single-column layout
- Compact navigation
- All questions visible in viewport (scrollable)

**Use Cases**:
- Quick assessments
- Review activities
- Short quizzes (3-5 questions)

**Configuration**:
```json
{
  "styleClass": "style1"
}
```

---

### 2. Style 2: Horizontal Slider View

**Type Name**: `style2`

**Behavior**:
- One question per slide with horizontal navigation
- Bullet navigation at top showing all question numbers
- Previous/Next buttons for slide navigation
- Submit button appears only on last slide (non-CL clients)
- Automatic slide counter (e.g., "1/5")
- Smooth slide transitions (CSS transform)

**Visual Characteristics**:
- Horizontal slide animation
- Numbered bullet navigation (clickable)
- Navigation arrows (◄ ►)
- Slide counter at bottom
- Timer in navigation bar (gradable activities)

**Use Cases**:
- Long assessments (10+ questions)
- Focused question-by-question approach
- Exam-like experiences
- Mobile-friendly assessments

**Navigation Features**:
- Click bullets to jump to specific questions
- Left/Right arrows for sequential navigation
- Automatic scroll of bullet navigation (5 bullets visible)
- Visual indicators:
  - Active slide: Blue border
  - Attempted: Green background
  - Unattempted: Default gray

**Configuration**:
```json
{
  "styleClass": "style2"
}
```

---

### 3. Worked Example Style

**Type Name**: `workedExample`

**Behavior**:
- Collapsible header with Show/Hide toggle
- Magnifying glass icon in header
- Non-interactive by default (isInteractive: "no")
- Background color and border radius enabled by default
- Designed for demonstration/example content
- Questions hidden initially (can be toggled)

**Visual Characteristics**:
- Header bar with toggle
- Magnifying glass branding
- Custom header background color
- Rounded corners (16px default)
- Background color (#F1F6FF default)

**Use Cases**:
- Step-by-step demonstrations
- Example problems
- Reference materials
- Instructional content

**Default Configuration**:
```json
{
  "styleClass": "workedExample",
  "isInteractive": "no",
  "allowGroupActivityBorderRadius": true,
  "grpBorder_radius": "16",
  "allowGroupActivityBackgroundColor": true,
  "groupComponentBgColor": "#F1F6FF",
  "headerBgColor": "#6F7D9F"
}
```

**Toggle Behavior**:
```javascript
// Show/Hide button toggles question-container-box display
scope.toggleContent = function() {
  scope.fieldData.settings.isContentVisible = !scope.fieldData.settings.isContentVisible;
  // CSS display toggled between 'none' and ''
}
```

---

### 4. Coming Soon Style

**Type Name**: `comingSoon`

**Behavior**:
- Placeholder for future style implementation
- Currently disabled/non-functional
- Shows "coming soon" placeholder image

---

## Core Features

### 1. Drag-and-Drop Interface (Editor Mode)

**Mechanism**:
- Uses Angular `ng-drop` directive
- Authors drag assessment widgets from right panel
- Drop zones show on hover (dashed border)
- Empty state: "Drag Assessment widget from right panel"
- Paste functionality supported

**Drop Zone Behavior**:
```javascript
scope.onDropComplete = function(index, data, evt) {
  // Validates drop
  // Compiles widget HTML
  // Adds to questionBank array
  // Auto-adds new empty slot (max 35)
}
```

**Paste Behavior**:
```javascript
scope.pastecomp = function (e) {
  // Retrieves from localStorage
  // Creates copy of component
  // Handles math editor components
  // Maintains unique IDs
}
```

**Limitations**:
- Maximum 35 questions per group activity
- Only widgets with `enableGroupInteractivity: true` can be dropped
- Cannot nest Group Activity inside another Group Activity

---

### 2. Interactive vs Non-Interactive Mode

**Interactive Mode** (`isInteractive: "yes"`):
- Shows Submit, Reset, Show Me, Try Again buttons
- Validates user responses
- Provides feedback
- Tracks attempts
- Default for Style 1 and Style 2

**Non-Interactive Mode** (`isInteractive: "no"`):
- No action buttons displayed
- Read-only display
- No validation or scoring
- Default for Worked Example style
- Used for reference/instructional content

**Toggle in Settings**:
```html
<input type="radio" name="yes" value="yes" ng-model="currSettings.isInteractive">
<input type="radio" name="no" value="no" ng-model="currSettings.isInteractive">
```

---

### 3. Question Shuffling

**Feature**:
- Randomizes question order on load
- Checkbox in settings: "Shuffle Questions"
- Applied via Angular ng-class

**Implementation**:
```html
<div ng-class="{'questionShuffleEnable': fieldData.settings.shuffleQuestionCheckbox}">
```

**Use Cases**:
- Reduce cheating in assessments
- Create question banks with varied orderings
- A/B testing of question sequences

---

### 4. Common Button Actions

All child widgets' buttons are hidden, replaced by centralized Group Activity buttons.

#### Submit Button
- Triggers submission for all child widgets
- Validates all questions are attempted (optional)
- Shows reminder popup if questions skipped
- Calculates aggregate scores
- Disabled after all attempts exhausted

**Behavior**:
```javascript
function SubmitAnswerGroupActivity(event) {
  // Triggers submit on each child widget
  // Aggregates results (correct, incorrect, partial)
  // Shows feedback alert
  // Handles state persistence (SCORM)
  // Disables further submission if max attempts reached
}
```

**Unattempted Question Reminder**:
```
┌────────────────────────────────────┐
│ It seems you haven't attempted a   │
│ few questions. Please attempt it   │
│ before submitting it.              │
│                                    │
│ Skipped Questions: 2, 5, 7         │
│                                    │
│                    [Yes Attempt]   │
└────────────────────────────────────┘
```

#### Show Me Button
- Reveals correct answers for all child widgets
- Triggers each widget's showme-btn
- Disables Submit, Reset, Try Again buttons
- Non-reversible action

**Implementation**:
```javascript
function showAnswerGroupActivity(event) {
  // Find all .showme-btn in child widgets
  // Trigger click on each
  // Disable other buttons
  // Mark as "show me" state
}
```

#### Reset Button
- Clears all user responses
- Resets to initial state
- Re-enables submission
- Scrolls to first question (Style 2)

**Implementation**:
```javascript
function resetAnswerGroupActivity(event) {
  // Trigger reset-btn on each child
  // Clear attempt indicators
  // Reset counter displays
  // Go to first slide (Style 2)
}
```

#### Try Again Button
- Appears after incorrect submission (if attempts remain)
- Clears feedback but retains question state
- Increments attempt counter
- Hides after max attempts reached

**Visibility Logic**:
```javascript
// Show if:
// 1. totalAttempts > attempts
// 2. Not all questions correct
// 3. Not a gradable activity (or specific settings)
```

---

### 5. Attempt Management

**Maximum Attempts**:
- Configurable: 1-5 attempts
- Default: 1 attempt
- Gradable activities: Typically 1 attempt

**Attempt Counter**:
```html
<button class="submit-btn" 
        data-no-of-attempts="{{fieldData.settings.maxTries}}" 
        data-attempts="0">Submit</button>
```

**Increment Logic**:
```javascript
var attempts = $(event.target).attr('data-attempts');
attempts ? attempts++ : attempts = 1;
$(event.target).attr('data-attempts', attempts);
```

---

### 6. Navigation Controls (Style 2)

**Bullet Navigation**:
- One bullet per question
- Click to jump to question
- Active: Blue border, bold
- Attempted: Green background (#035E27)
- Scrollable container (5 visible)

**Arrow Navigation**:
- Left arrow: Previous slide (disabled on first)
- Right arrow: Next slide (disabled on last)
- Auto-scrolls bullet container

**Slide Animation**:
```javascript
// Calculate percentage offset
let num = currentSlide - 2;
let percent = (100 / totalSlides) * num;
$('.question-container-box').css('transform', 'translateX(-'+percent+'%)');
```

**Keyboard Navigation**:
- Not currently implemented (potential enhancement)

---

### 7. Scoring and Feedback

**Aggregate Scoring**:
The component calculates scores across all child widgets:

```
┌──────────────────────────────────────┐
│  Questions Attempted: 8              │
│  ✓ Correct Answers: 5                │
│  ✗ Incorrect Answers: 2              │
│  ◐ Partially Correct Answers: 1      │
└──────────────────────────────────────┘
```

**Scoring Logic**:

1. **Multiple Choice**: 
   - Single select: 1 point (correct) or 0 (incorrect)
   - Multi-select: Proportional scoring based on correctly selected options

2. **True/False**: 
   - 1 point (correct) or 0 (incorrect)

3. **Fill-in-the-Blank**: 
   - 1 point per correct blank
   - Partial credit for multiple blanks

4. **Match-the-Pairs**: 
   - Individual marks per pair (default)
   - Or all-or-nothing (configurable)

5. **Image Labeling**: 
   - Proportional scoring
   - 1 / totalLabels per correct label

6. **Highlight/Correction**: 
   - Proportional scoring
   - Incorrect selections deducted

7. **Categorize**: 
   - All correct: 1 point
   - Partial/Incorrect: 0 points

8. **Short/Long Answer**: 
   - Treated as "unanticipated" (manual grading required)
   - Not scored automatically

9. **Identify the Clip**:
   - Correct: 1 point
   - Incorrect/Empty: 0 points

**Client-Specific Logic**:
```javascript
// CL client: No partial credit
if(window.client == 'CL' || window.parent.client == 'CL'){
  incorrectQuestions = incorrectQuestions + partialCorrect;
  partialCorrect = 0;
}
```

---

### 8. Meta Tags

**Purpose**:
- SEO and content classification
- Comma-separated tags
- Stored in settings.metaTags array

**Input**:
```html
<input type="text" placeholder="Enter Tags" ng-model="currSettings.metaTags">
<label>Enter , to separate tags</label>
```

---

### 9. Visual Customization

**Outline Options**:
- **No Outline** (`outline: "outline"`): Transparent border
- **Outline** (`outline: "outlineBg"`): Colored border using Appearance color

**Appearance Color**:
- Controls action button colors
- Border color (when outline enabled)
- Default: #7eb1eb

**Background Color** (Optional):
- Checkbox-controlled
- Applied to question container
- Default: #F3ECFE (Style 1/2), #F1F6FF (Worked Example)

**Corner Radius** (Optional):
- Checkbox-controlled
- Range: 0-99px
- Default: 16px (Worked Example)

**Header Background Color** (Worked Example):
- Customizable via color picker
- Default: #6F7D9F

---

## Data Flow and Architecture Diagram

### Editor Mode Data Flow

```
┌──────────────┐
│   Author     │
│   Actions    │
└──────┬───────┘
       │
       │ 1. Drag widget from panel
       ▼
┌──────────────────────┐
│ groupInteractivity   │
│    Directive         │
│                      │
│ - onDropComplete()   │
└──────┬───────────────┘
       │
       │ 2. Validate widget compatibility
       │ 3. Compile widget HTML
       ▼
┌──────────────────────┐
│  Question Bank       │
│   (fieldData.        │
│   settings.          │
│   questionBank[])    │
│                      │
│ [{                   │
│   questionType: "MCQ"│
│   questionTemplate:  │
│     "<html>...</html>"│
│ }]                   │
└──────┬───────────────┘
       │
       │ 4. Update DOM
       ▼
┌──────────────────────┐
│  question-container  │
│       (View)         │
│                      │
│ - Renders each widget│
│ - Shows drop zones   │
└──────────────────────┘
       │
       │ 5. Author configures settings
       ▼
┌──────────────────────┐
│  Settings Panel      │
│                      │
│ - Style selection    │
│ - Interactive toggle │
│ - Attempt config     │
│ - Visual settings    │
└──────┬───────────────┘
       │
       │ 6. Save to savedJson
       ▼
┌──────────────────────┐
│   savedJson[pageNo]  │
│     [uniqueId]       │
│                      │
│ - Persists all       │
│   config & content   │
└──────────────────────┘
```

---

### Preview/Reader Mode Data Flow

```
┌──────────────┐
│   Student    │
│   Actions    │
└──────┬───────┘
       │
       │ 1. Interact with widgets
       ▼
┌──────────────────────┐
│  Child Widget        │
│  Event Handlers      │
│                      │
│ - Input changes      │
│ - Selections         │
│ - Drag-drop answers  │
└──────┬───────────────┘
       │
       │ 2. Mark as attempted
       │ 3. Enable/disable buttons
       ▼
┌──────────────────────┐
│ highlightGroupBullets│
│    (Interval)        │
│                      │
│ - Check attempt state│
│ - Update navigation  │
│ - Enable submit      │
└──────┬───────────────┘
       │
       │ 4. User clicks Submit
       ▼
┌──────────────────────┐
│SubmitAnswerGroup     │
│    Activity()        │
│                      │
│ - Trigger child      │
│   submissions        │
└──────┬───────────────┘
       │
       │ 5. Collect results from each widget
       ▼
┌──────────────────────────────────────┐
│     Scoring Engine                   │
│                                      │
│ For each widget type:                │
│ - MCQ: Check selections              │
│ - FIB: Validate inputs               │
│ - MTP: Match pairs                   │
│ - Highlight: Compare selections      │
│ - etc.                               │
│                                      │
│ Calculate:                           │
│ - correct += X                       │
│ - incorrect += Y                     │
│ - partial += Z                       │
│ - marks += weighted score            │
└──────┬───────────────────────────────┘
       │
       │ 6. Aggregate scores
       ▼
┌──────────────────────┐
│  marksObj            │
│                      │
│ {                    │
│   correct: 5,        │
│   incorrect: 2,      │
│   partialCorrect: 1, │
│   unanticipated: 0,  │
│   total: 8,          │
│   marks: 6.5         │
│ }                    │
└──────┬───────────────┘
       │
       │ 7. Display feedback
       ▼
┌──────────────────────┐
│ Feedback Alert       │
│                      │
│ Questions Attempted:8│
│ ✓ Correct: 5         │
│ ✗ Incorrect: 2       │
│ ◐ Partial: 1         │
└──────┬───────────────┘
       │
       │ 8. State management
       ▼
┌──────────────────────┐
│stateMainatain        │
│GroupActiviy()        │
│                      │
│ scoObj = {           │
│   isSubmitEnable,    │
│   isTryAgainEnable,  │
│   marks,             │
│   componentId,       │
│   gradableActivitySettingsJSON│
│ }                    │
└──────┬───────────────┘
       │
       │ 9. Persist state
       ▼
┌──────────────────────┐
│   SCORM / API        │
│   (if available)     │
│                      │
│ - Save suspend data  │
│ - Update score       │
│ - Set completion     │
└──────────────────────┘
```

---

### State Machine Diagram

```
                    ┌─────────────┐
                    │   Initial   │
                    │   (Empty)   │
                    └──────┬──────┘
                           │
                           │ Author adds widgets
                           ▼
                    ┌─────────────┐
                    │  Configured │
                    │ (Editor Mode)│
                    └──────┬──────┘
                           │
                           │ Preview/Publish
                           ▼
        ┌──────────────────────────────────────┐
        │           Preview/Reader             │
        └──────────┬──────────────┬────────────┘
                   │              │
      Interactive  │              │ Non-Interactive
          Mode     │              │     Mode
                   ▼              ▼
            ┌─────────────┐  ┌─────────────┐
            │ Ready for   │  │  Read-Only  │
            │ Interaction │  │   Display   │
            └──────┬──────┘  └─────────────┘
                   │
                   │ User interacts
                   ▼
            ┌─────────────┐
            │  Attempted  │ ◄───┐
            │  (Partial)  │     │
            └──────┬──────┘     │
                   │             │ Reset
                   │ Submit      │
                   ▼             │
            ┌─────────────┐     │
            │  Submitted  │─────┘
            │  (Feedback  │
            │   Shown)    │
            └──────┬──────┘
                   │
         ┌─────────┼─────────┐
         │         │         │
    Correct    Incorrect  Partial
         │         │         │
         ▼         ▼         ▼
    ┌─────────┬─────────┬─────────┐
    │         │         │         │
    │ Max     │ Tries   │ Show Me │
    │Attempts │Remain   │ Clicked │
    │Reached  │         │         │
    │         │         │         │
    └────┬────┴────┬────┴────┬────┘
         │         │         │
         │         │         │
         ▼         ▼         ▼
    ┌─────────────────────────────┐
    │       Final State           │
    │ (No further interaction)    │
    └─────────────────────────────┘
                   │
                   │
                   ▼
            ┌─────────────┐
            │   SCORM     │
            │ Completion  │
            └─────────────┘
```

---

## File Structure

```
templates/group-activity/
│
├── group-activity.html                      # Main template (Angular view)
├── group-activity-settings.html             # Settings panel (right sidebar)
│
├── scripts/
│   ├── group-activity-directive.js          # Editor mode directive
│   └── group-activity-preview1.js           # Preview/Reader mode logic
│
├── styles/
│   └── group-activity-template.css          # Component-specific styles
│
└── default/
    └── group-activity.json                  # Default configuration schema
```

### File Dependencies

```
group-activity.html
  ├── Requires: Angular.js, jQuery
  ├── Directives: groupInteractivity, ng-drop, ng-repeat
  └── References: bottom-footer.html (commonbuttons)

group-activity-directive.js
  ├── Depends: editor/ngdragdrop.js (commonbuttons directive)
  ├── Services: $timeout, TemplateService, $sce, $compile
  └── Global: con.savedJson, con.guid(), con.findTag()

group-activity-preview1.js
  ├── Depends: jQuery, window.apiHandle (SCORM)
  ├── External: stateMainatainGroupActiviy()
  └── Global: window.isGradableActivity, window.client

group-activity-template.css
  ├── Depends: css/common.css (base button styles)
  └── Responsive: Media queries for mobile/tablet
```

---

## Configuration Schema

### Default JSON Structure

```json
{
  "identifier": "group-interactivity-template",
  "settings": {
    "type": "scroll-view",
    "maxTries": "1",
    "reset": false,
    "showmecheckbox": false,
    "allowRestart": false,
    "shuffleQuestionCheckbox": false,
    "allowGroupActivityBackgroundColor": false,
    "grpBorder_radius": "16",
    "align": "none",
    "pagebgcolor": "#fff",
    "outline": "outline",
    "sidebarBgColor": "#F1F6FF",
    "headerBgColor": "#6F7D9F",
    "isInteractive": "yes",
    "verticalSlide": "vertical-slideshow",
    "outlineBgColor": "#FFFFFF",
    "styleClass": "style2",
    "Appearance": "#7eb1eb",
    "groupComponentBgColor": "#F3ECFE",
    "allowGroupActivityBorderRadius": false,
    "isContentVisible": true,
    "style_tab": [
      {
        "stylefunction": "changeGroupActivityStyle",
        "stylesHolder": [
          {
            "name": "style1",
            "bgurl": "images/groupVertical.png",
            "styleactive": true
          },
          {
            "name": "style2",
            "bgurl": "images/groupHorizontal.png",
            "styleactive": false
          },
          {
            "name": "workedExample",
            "bgurl": "images/group_Style3.svg",
            "styleactive": false
          },
          {
            "name": "comingSoon",
            "bgurl": "images/coming-soon.png",
            "styleactive": false
          }
        ],
        "name": "",
        "class": "card-style"
      }
    ],
    "colorvalues": [
      {
        "colornumber": "1",
        "coloractive": false,
        "colorcode": "#D2E6E8"
      },
      {
        "colornumber": "2",
        "coloractive": false,
        "colorcode": "#EAE2C8"
      },
      {
        "colornumber": "3",
        "coloractive": false,
        "colorcode": "#EDEFBA"
      },
      {
        "colornumber": "4",
        "coloractive": false,
        "colorcode": "#C7C7C7"
      },
      {
        "colornumber": "5",
        "coloractive": false,
        "colorcode": "#FFFFFF"
      }
    ],
    "questionBank": [
      {
        "questionType": "Widget Type",
        "questionTemplate": ""
      }
    ],
    "metaTags": []
  },
  "custom": {
    "css": ["css/templates/group-activity-template.css"],
    "javascript": ["js/templates/group-activity-preview1.js"]
  }
}
```

### Settings Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `styleClass` | String | `"style2"` | Visual style: `"style1"`, `"style2"`, `"workedExample"` |
| `isInteractive` | String | `"yes"` | Enable user interaction: `"yes"` or `"no"` |
| `maxTries` | String | `"1"` | Maximum submission attempts: `"1"` to `"5"` |
| `allowRestart` | Boolean | `false` | Show Try Again button |
| `showmecheckbox` | Boolean | `false` | Show Show Me button |
| `reset` | Boolean | `false` | Show Reset button |
| `shuffleQuestionCheckbox` | Boolean | `false` | Randomize question order |
| `allowGroupActivityBackgroundColor` | Boolean | `false` | Enable background color customization |
| `groupComponentBgColor` | String | `"#F3ECFE"` | Background color (hex) |
| `allowGroupActivityBorderRadius` | Boolean | `false` | Enable corner radius |
| `grpBorder_radius` | String | `"16"` | Corner radius in pixels (0-99) |
| `outline` | String | `"outline"` | Border style: `"outline"` (none) or `"outlineBg"` (colored) |
| `Appearance` | String | `"#7eb1eb"` | Action button color (hex) |
| `headerBgColor` | String | `"#6F7D9F"` | Header background (Worked Example only) |
| `isContentVisible` | Boolean | `true` | Initial visibility of questions (Worked Example) |
| `metaTags` | Array | `[]` | SEO/classification tags |
| `questionBank` | Array | `[{...}]` | Array of child widget configurations |

---

## Editor Mode

### Initialization Sequence

1. **Directive Linking** (`group-activity-directive.js`):
   ```javascript
   $timeout(function() {
     scope.isGradableActivity = scope.$parent.isGradableActivity;
     scope.fieldData.identifier = $(element).parents('[data-type]').attr('data-type');
     // Render existing widgets
     element.find('.column-content').each(function(e) {
       scope.compileAndAppendHtml($(this), questionTemplate);
     });
   });
   ```

2. **Empty State Rendering**:
   - Shows drop zones with "Drag Assessment widget from right panel"
   - Hover shows "Paste Here" if clipboard has component

3. **Settings Panel Load**:
   - Right panel shows `group-activity-settings.html`
   - Style selector (radio buttons)
   - Interactive toggle
   - Visual customization options

### Widget Drop Handling

**Drag Event Flow**:
```
Author drags widget
    ↓
dragOver() → Set con.childrenDrop = true
    ↓
onDropComplete() → Validate widget compatibility
    ↓
Compile widget HTML with $compile
    ↓
Append to questionBank array
    ↓
Update DOM with new widget
    ↓
Add new empty slot (if < 35 questions)
    ↓
Enable Save button
```

**Validation Rules**:
```javascript
if ($(scope.dropElement).children().length !== 0 || !data || !data.enableGroupInteractivity) {
  return; // Reject drop
}
```

**Widget Compatibility**:
Only widgets with `enableGroupInteractivity: true` in their config can be dropped.

### Unique ID Management

**Duplicate Handling**:
When duplicating a Group Activity, all child widgets get new unique IDs:
```javascript
if(duplicateActivityId) {
  htmlElement.find('section[page-no]').each(function () {
    $(this).attr('page-no', parentPageNo);
  });
  // Update saved-index attributes
  var UUID = con.guid();
  $(this).attr("saved-index", elementId);
  $(this).attr("uuid", UUID);
  con.savedJson[pageNo][elementId] = jsonData;
}
```

### Math Editor Support

**MathField Initialization**:
```javascript
currentDroppable.find('.auth-mathfield-holder').each(function(itm, inx){
  let mathData = $(inx).attr('data-equation-latex');
  let mfId = $(inx).find('math-field').attr('id');
  let mf = document.getElementById(mfId);
  mf.setValue(mathData);
  $(mf).on('input', con.mathFieldChange);
  window.mathVirtualKeyboard.targetOrigin = "*";
  mf.virtualKeyboardTargetOrigin = "*"; 
  mf.mathModeSpace = '\\:';
});
```

### Style Switching

**changeGroupActivityStyle Function**:
```javascript
window.changeGroupActivityStyle = function(event, optionname, ...) {
  if(optionname == 'workedExample'){
    scope.fieldData.settings.styleClass = optionname;
    scope.fieldData.settings.isInteractive = "no";
    scope.fieldData.settings.allowGroupActivityBorderRadius = true;
    scope.fieldData.settings.grpBorder_radius = "16";
    scope.fieldData.settings.allowGroupActivityBackgroundColor = true;
    scope.fieldData.settings.groupComponentBgColor = '#F1F6FF';
  }
  // Update active style in style_tab array
  con.currSettings.style_tab[parentindex].stylesHolder[index].styleactive = true;
}
```

---

## Preview/Reader Mode

### Initialization

**On Page Load** (`group-activity-preview1.js`):
```javascript
$(function() {
  // Set max attempts on submit button
  $(".group-interactivity-container[data-maxtries]").each(function(){
    if(window.isGradableActivity){
      $(this).find(".submit-btn").attr("data-no-of-attempts", "1");
    } else {
      $(this).find(".submit-btn").attr("data-no-of-attempts", $(this).attr("data-maxtries"));
    }
  });
  
  // Initialize Style 2 navigation
  $(".group-interactivity-container.style2").each(function(){
    let len = $(this).find('.question-container-box .question-container').length;
    let bottomCounter = '<div class="bottomCounter">1/' + len + '</div>';
    $(bottomCounter).insertAfter(btnPrev);
  });
});
```

### Event Handlers

**Submit Button**:
```javascript
$('.group-interactivity-container .group-interactivity-btn .submit-btn').off('click').click(function(event) {
  let noOfQuestions = $(event.target).parents('.group-interactivity-container').find('.question-container-box .question-container form:not(.non-interactive)').length;
  let noOfAttempted = $(event.target).parents('.group-interactivity-container').find('.question-container-box .question-container form.attempted-question:not(.non-interactive)').length;

  if(noOfQuestions == noOfAttempted || window.client == 'CL'){
    SubmitAnswerGroupActivity(event);
  } else {
    // Show unattempted questions reminder
    $(event.target).parents('.group-interactivity-container').find('.remainingQuestionsReminder').show();
  }
});
```

**Show Me Button**:
```javascript
function showAnswerGroupActivity(event) {
  var $form = $(event.target).parents('.group-interactivity-container');
  var questionContainer = $form.find('.save-html.column-content');
  
  // Trigger show me on all child widgets
  $(questionContainer).find(".showme-btn").each(function(e) {
    $(this).trigger('click');
  });
  
  // Disable all buttons
  $form.find(".group-interactivity-btn .reset-btn").addClass('disabled');
  $form.find(".group-interactivity-btn .submit-btn").addClass('disabled');
  $form.find(".group-interactivity-btn .tryagn-btn").addClass("disabled");
  $form.find(".group-interactivity-btn .showme-btn").addClass('disabled');
}
```

**Reset Button**:
```javascript
function resetAnswerGroupActivity(event) {
  var $form = $(event.target).parents('.group-interactivity-container');
  var questionContainer = $form.find('.save-html.column-content');
  
  // Trigger reset on all child widgets
  $(questionContainer).find(".reset-btn").each(function(e) {
    $(this).trigger('click');
  });
  
  // Clear feedback and state classes
  $form.find(".group-interactivity-alert").removeClass("showAlert");
  $form.find(".incorrect-question").removeClass("incorrect-question");
  $form.find(".correct-question").removeClass("correct-question");
  $form.find(".attempted-question").removeClass("attempted-question");
  
  // Go to first slide (Style 2)
  goToFirstSlide(event);
}
```

**Try Again Button**:
```javascript
function tryagainGroupActivity(event) {
  var $form = $(event.target).parents('.group-interactivity-container');
  
  // Trigger try again on all child widgets
  $(questionContainer).find(".tryagn-btn").each(function(e) {
    $(this).trigger('click');
  });
  
  // Clear short/long answer text
  $(event.target).parents('.customClass[data-type="group-interactivity-template"]').find('.customClass[data-type="shortLongAns"]').find('input,textarea').val("").removeAttr("disabled");
  
  // Reset state
  $form.removeClass("enableTryAgain");
  $form.addClass("enableReset enableSubmit");
  
  goToFirstSlide(event);
}
```

### Navigation (Style 2)

**Slide Transition**:
```javascript
$(document).on("click", ".group-interactivity-container.style2 .group-interactivity-btn .next-btn", function(event){
  let currentSlide = parseInt($(event.target).parents('.group-interactivity-container').find('.style2NavigationBtns .number.active').eq(0).html());
  let len = $(event.target).parents('.group-interactivity-container').find('.question-container-box .question-container').length;
  
  if(currentSlide < len){
    let num = currentSlide;
    let percent = (100 / len) * num;
    $(event.target).parents('.group-interactivity-container').find('.question-container-box').css('transform', 'translateX(-'+percent+'%)');
    $(event.target).parents('.group-interactivity-container').find('.numbersContainer .number').removeClass('active');
    $(event.target).parents('.group-interactivity-container').find('.numbersContainer .number').eq(currentSlide).addClass('active');
  }
  
  scrollStyle2GroupNavigation(event, currentSlide+1);
});
```

**Bullet Click**:
```javascript
$(document).on("click", ".group-interactivity-container.style2 .style2NavigationBtns .numbersContainer .number", function(event){
  let itemNum = $(event.target).html();
  let num = parseInt(itemNum) - 1;
  let len = $(event.target).parents('.group-interactivity-container').find('.question-container-box .question-container').length;
  let percent = (100 / len) * num;
  
  $(event.target).parents('.group-interactivity-container').find('.question-container-box').css('transform', 'translateX(-'+percent+'%)');
  $(event.target).parents('.numbersContainer').find('.number').removeClass('active');
  $(event.target).addClass('active');
  
  scrollStyle2GroupNavigation(event, itemNum);
});
```

**Auto-scroll Bullets**:
```javascript
function scrollStyle2GroupNavigation(event, slideNum){
  let slideDiv = Math.ceil(slideNum/5) - 1;
  var leftPos = slideDiv * 225; // 5 bullets visible (45px each)
  $(event.target).parents(".group-interactivity-container").find(".style2NavigationBtns .numbersContainer").animate({scrollLeft: leftPos}, 300);
}
```

### Attempt Tracking

**highlightGroupBullets Function** (runs every 1 second):
```javascript
window.highlightGroupBullets = function(container){
  // Mark attempted questions
  container.find(".question-container-box .question-container").each(function(index, item) {
    if($(item).find('form').hasClass('attempted-question')){
      $(item).parents(".group-interactivity-container").find(".style2NavigationBtns .numbersContainer .number").eq(index).addClass('attempted');
      container.find('.group-interactivity-btn .reset-btn').removeClass('disabled');
    }
  });
  
  // Check if all questions attempted
  container.find(".question-container-box .question-container").each(function(index, item) {
    if($(item).find("form").length && !$(item).find('form').hasClass('attempted-question')) {
      container.find('.group-interactivity-btn .submit-btn').addClass('disabled');
      return false;
    } else {
      container.find('.group-interactivity-btn .submit-btn').removeClass('disabled');
    }
  });
};

// Run every second
var groupSubmitBtnCheckInterval = setInterval(() => {
  $('.customClass[data-type="group-interactivity-template"]').find(".group-interactivity-container").each(function(index, item){
    window.highlightGroupBullets($(item));
  });
}, 1000);
```

---

## Scoring and Feedback System

### Scoring Algorithm

**Per-Widget Scoring**:

```javascript
function SubmitAnswerGroupActivity(event) {
  let correctQuestions = 0;
  let incorrectQuestions = 0;
  let partialCorrect = 0;
  let unanticipated = 0;
  let marks = 0;
  let totalQuestion = [count of all assessment widgets];

  // Trigger submit on each child widget
  $(questionContainer).find(".submit-btn").each(function(e) {
    $(this).trigger('click');
  });

  // Iterate through each child widget
  $(event.target).parents('.customClass').eq(0).find('.question-container-box .customClass').each(function(index, item){
    let widgetType = $(item).attr('data-type');
    
    switch(widgetType) {
      case "multiple-choice-template":
        // MCQ scoring logic
        break;
      case "fill-in-the-blank":
        // FIB scoring logic
        break;
      // ... other widget types
    }
  });

  // Display aggregate results
  $form.find(".correct-grp-question").text(correctQuestions);
  $form.find(".incorrect-grp-question").text(incorrectQuestions);
  $form.find(".partial-grp-question").text(partialCorrect);
  $form.find(".total-grp-question").text(Number(correctQuestions) + Number(incorrectQuestions) + Number(partialCorrect));
}
```

### Widget-Specific Scoring

**1. Multiple Choice**:
```javascript
if($(item).attr('data-type') == "multiple-choice-template"){
  let isCorrect = $(item).find(".correct-question").length;
  let isIncorrect = $(item).find(".incorrect-question").length;
  let isMultiSelect = $(item).find('.question-select-wrap').hasClass('multiple-questions');
  
  if(isCorrect){
    correctQuestions++;
    marks++;
  } else if(isIncorrect){
    if(isMultiSelect){
      // Partial credit for multi-select
      let resArr = $(item).attr("result").split(',').map(Number);
      let corrLen = $(item).find('input[data-iscorrect="true"]').length;
      let corr = resArr[1]; // Number of correct selections
      let indMark = 1 / corrLen;
      let indCorrMark = indMark * corr;
      marks += indCorrMark;
      
      if(corr == 0){
        incorrectQuestions++;
      } else {
        partialCorrect++;
      }
    } else {
      incorrectQuestions++;
    }
  }
}
```

**2. Fill-in-the-Blank**:
```javascript
if($(item).attr('data-type') == "fill-in-the-blank"){
  let correctBlanks = 0;
  let incorrectBlanks = 0;
  
  $(item).find(".js-form-row").each(function() {
    if ($(this).hasClass('correct-attempt') || $(this).find('.correct-tick').length > 0) {
      correctBlanks++;
      marks++;
    }
    if ($(this).hasClass('incorrect-attempt') || $(this).find('.incorrect-tick').length > 0) {
      incorrectBlanks++;
    }
  });
  
  correctQuestions += correctBlanks;
  incorrectQuestions += incorrectBlanks;
  totalQuestion += (correctBlanks + incorrectBlanks - 1);
}
```

**3. Match-the-Pairs**:
```javascript
if($(item).attr('data-type') == "match-the-pairs"){
  let individualMarks = true; // Toggle for all-or-nothing scoring
  
  if(individualMarks){
    let total = $(item).find('.mtp-pair2-block').length;
    let correctPairs = $(item).find('.mtp-pair2-block.mtp-correct-pair').length;
    let incorrectPairs = $(item).find('.mtp-pair2-block.mtp-incorrect-pair').length;
    correctQuestions += correctPairs;
    incorrectQuestions += incorrectPairs;
    totalQuestion += (total - 1);
    marks += correctPairs;
  } else {
    // All-or-nothing scoring
    let isCorrect = $(item).find('.component-holder.mtp').hasClass('correct-question');
    if(isCorrect){
      correctQuestions++;
      marks++;
    } else {
      // Partial credit calculation
      let totalCount = $(item).find('.mtp-pair2 .mtp-pair2-block').length;
      let correctCount = $(item).find('.mtp-pair2 .mtp-pair2-block.mtp-correct-pair').length;
      let indMark = 1 / totalCount;
      let indCorrMark = indMark * correctCount;
      marks += indCorrMark;
      partialCorrect++;
    }
  }
}
```

**4. Image Labeling**:
```javascript
if($(item).attr('data-type') == "imagelabelling"){
  let isCorrect = $(item).find('.component-holder.imageLabelling').hasClass('correct-question');
  
  if(isCorrect){
    correctQuestions++;
    marks++;
  } else {
    // Proportional scoring
    let totalCount = $(item).find('.mainLabelDiv').length;
    let correctCount = $(item).find('.mainLabelDiv .labelCorrect').length;
    let incorrectCount = $(item).find('.mainLabelDiv .labelInCorrect').length;
    let indMark = 1 / totalCount;
    let indCorrMark = indMark * correctCount;
    marks += indCorrMark;
    
    if(totalCount == incorrectCount){
      incorrectQuestions++;
    } else {
      partialCorrect++;
    }
  }
}
```

**5. Highlight Text**:
```javascript
if($(item).attr('data-type') == "highlight"){
  $(item).find('.form-row').each(function(index, data){
    let rightAnswers = $(data).find('.selectedHighlightWord').length || 0;
    let possibleRightAnswerLength = $(data).find(".myWords").length;
    let incorrectAnswers = $(data).find(".wrongWords").length;

    if(rightAnswers == possibleRightAnswerLength){
      correctQuestions++;
      marks++;
    } else {
      let indMark = 1 / rightAnswers;
      let indCorrMark = indMark * possibleRightAnswerLength;
      marks += indCorrMark;
      
      if(rightAnswers == incorrectAnswers || possibleRightAnswerLength == 0){
        incorrectQuestions++;
      } else {
        partialCorrect++;
      }
    }
  });
}
```

**6. Short/Long Answer & Identify the Clip**:
```javascript
if($(item).attr('data-type') == "shortLongAns"){
  // Disable editing
  $(item).find('.shortAnsText').attr("contenteditable", false);
  unanticipated++; // Manual grading required
}
```

**7. Categorize**:
```javascript
if($(item).attr('data-type') == "Categorize"){
  let isCorrect = $(item).find(".categorize-body .categories-container.isCorrect").length;
  let isIncorrect = $(item).find(".categorize-body .categories-container.isInCorrect").length;
  let isPartial = $(item).find(".categorize-body .categories-container.isPartialCorrect").length;
  
  if(isCorrect) {
    correctQuestions++;
    marks++;
  } else if(isIncorrect || isPartial) {
    incorrectQuestions++;
  }
}
```

### Feedback Display

**Alert Structure**:
```html
<div class="group-interactivity-alert showAlert">
  <div class="group-interactivity-attempt-info">
    <span>Questions Attempted : </span>
    <span class="total-grp-question">8</span>
  </div>
  <div class="group-interactivity-result-parent">
    <div class="group-interactivity-result">
      <span class="icon-correct"></span>
      <span>Correct Answers : </span>
      <span class="correct-grp-question">5</span>
    </div>
    <div class="group-interactivity-result">
      <span class="icon-close-filled"></span>
      <span>Incorrect Answers : </span>
      <span class="incorrect-grp-question">2</span>
    </div>
    <div class="group-interactivity-result">
      <span class="icon-close-filled"></span>
      <span>Partially Correct Answers : </span>
      <span class="partial-grp-question">1</span>
    </div>
  </div>
</div>
```

**Client-Specific Behavior**:
```javascript
// CL client hides partial credit
if(window.client == 'CL' || window.parent.client == 'CL'){
  incorrectQuestions = incorrectQuestions + partialCorrect;
  partialCorrect = 0;
  $form.find(".partial-grp-question").parent('.group-interactivity-result').addClass('hide');
  $form.find(".group-interactivity-alert").removeClass("showAlert");
}
```

---

## Gradable Activity Integration

### Overview
Group Activity supports SCORM-compliant gradable activities with time tracking, scoring, and completion status.

### Initialization

**Gradable Flag**:
```javascript
scope.isGradableActivity = scope.$parent.isGradableActivity;
```

**Button Removal**:
```javascript
// In commonbuttons directive
if(attrs.isgradableactivity == "true"){
  showmebtn.remove();
  resetbtn.remove();
  tryagnbtn.remove();
  submitbtn.removeClass('disabled');
}
```

### Timer Integration

**Timer Display** (Style 1):
```html
<div class="groupActivityAssessmentTimingContainer" ng-if="isGradableActivity && fieldData.settings.styleClass == 'style1'">
  <div class="timePieChart"></div>
  <div class="time">
    <div class="minutes">00</div>
    <div class="timeSeperator">:</div>
    <div class="seconds">00</div>
    <div class="timeDesc">&nbsp; min</div>
  </div>
</div>
```

**Timer Display** (Style 2):
```html
<div class="style2NavigationBtns" ng-if="fieldData.settings.styleClass == 'style2'">
  <!-- Navigation bullets -->
  <div class="groupActivityAssessmentTimingContainer" ng-if="isGradableActivity">
    <div class="timePieChart"></div>
    <div class="time">...</div>
  </div>
</div>
```

**Pie Chart Visual**:
```css
.timePieChart {
  width: 20px;
  height: 20px;
  background-image: conic-gradient(#3E5274 0%, #FFFFFF 0%);
  border-radius: 50%;
  border: 2px solid #3E5274;
}
```

### State Management

**State Object**:
```javascript
function stateMainatainGroupActiviy(event, marks) {
  let scoObj = {};
  scoObj.isSubmitEnable = $container.hasClass("enableSubmit");
  scoObj.isShowMeEnable = true;
  scoObj.isTryAgainEnable = $container.hasClass("enableTryAgain");
  scoObj.isResetEnable = $container.hasClass("enableReset");
  scoObj.totalNoOfAttempt = Number($container.attr("data-maxtries"));
  scoObj.attemptsDone = Number($container.find(".submit-btn").attr('data-attempts'));
  scoObj.marks = marks;
  scoObj.componentId = $container.parents(".customClass").eq(0).attr('data-saved-index');
  
  if(window.isGradableActivity){
    scoObj.gradableActivitySettingsJSON = window.gradableActivitySettingsJSON;
  }
  
  saveAction(event, scoObj);
}
```

### SCORM Integration

**Score Calculation** (`scorm/scorm.js`):
```javascript
if(scoObj.marks && scoObj.gradableActivitySettingsJSON){
  let totalPoints = +(scoObj.gradableActivitySettingsJSON.points * scoObj.marks.marks).toFixed(2);
  let maxScore = scoObj.marks.total * scoObj.gradableActivitySettingsJSON.points;
  let passingPercentage = window.gradableActivitySettingsJSON.passingPercentage;
  
  let percent = +((scoObj.gradableActivitySettingsJSON.points * scoObj.marks.marks) / maxScore) * 100;
  
  // SCORM API calls
  scorm.set("cmi.core.score.raw", totalPoints);
  scorm.set("cmi.core.score.max", maxScore);
  scorm.set("cmi.core.score.min", 0);
  
  if(percent >= passingPercentage) {
    scorm.set("cmi.core.lesson_status", "passed");
  } else {
    scorm.set("cmi.core.lesson_status", "failed");
  }
}
```

**Time Tracking**:
```javascript
let session_time = window.timeDiff(window.gradableActivitySettingsJSON.ogTime, scoObj.remainingTime);
scorm.set("cmi.core.session_time", session_time);
```

### Gradable Activity Settings JSON

**Structure**:
```json
{
  "points": 1,
  "passingPercentage": 70,
  "durationMin": "10",
  "durationSec": "00",
  "ogTime": "2024-02-17T10:30:00"
}
```

### Result View

**After Submission**:
```javascript
var groupSubmitBtnCheckInterval = setInterval(() => {
  if(window.isGradableActivity){
    if($('.viewGradableActivityResult').length){
      clearInterval(groupSubmitBtnCheckInterval);
      $('.group-interactivity-container').removeClass('enableSubmit');
      $('.group-interactivity-btn .submit-btn').addClass('disabled');
    }
  }
}, 1000);
```

---

## Offline/Package Behavior

### Package Creation

**Asset Loading**:
1. HTML templates are embedded
2. CSS files included in package
3. JavaScript files bundled
4. Images referenced locally

**Dependencies**:
- jQuery (local copy)
- Angular.js (local copy)
- Custom CSS/JS for each widget type

### Offline Functionality

**State Persistence**:
- Uses `localStorage` for temporary state
- `savedJson` object maintains all component states
- Math editor LaTeX stored as data attributes

**Network-Independent Features**:
✓ All widget interactions
✓ Validation and scoring
✓ Navigation (Style 2)
✓ Show Me/Reset/Try Again
✗ SCORM reporting (requires LMS connection)
✗ External asset loading (must be packaged)

### SCORM Package

**Manifest Structure**:
```xml
<resources>
  <resource identifier="group_activity_1" href="index.html">
    <file href="templates/group-activity/group-activity.html"/>
    <file href="js/templates/group-activity-preview1.js"/>
    <file href="css/templates/group-activity-template.css"/>
    <!-- Child widget dependencies -->
  </resource>
</resources>
```

**API Availability**:
```javascript
if (typeof apiHandle != "undefined") {
  stateMainatainGroupActiviy(event, marksObj);
} else {
  // Offline mode: no SCORM reporting
}
```

---

## Error Handling

### Common Errors

**1. Widget Compilation Failure**

**Symptom**: Child widget doesn't render after drop

**Cause**:
- Missing widget JavaScript file
- Angular compilation error
- Invalid HTML in questionTemplate

**Handle**:
```javascript
try {
  currentDroppable.html($compile(content || '')(con));
} catch(e) {
  console.error('Widget compilation failed:', e);
  // Error not currently surfaced to user
}
```

**Recommendation**: Add user-visible error message

---

**2. Math Editor Initialization Failure**

**Symptom**: Math equations don't render or are uneditable

**Cause**:
- Math field ID collision
- Virtual keyboard not loaded
- Missing mathVirtualKeyboard global

**Handle**:
```javascript
currentDroppable.find('.auth-mathfield-holder').each(function(itm, inx){
  try {
    let mf = document.getElementById(mfId);
    mf.setValue(mathData);
    $(mf).on('input', con.mathFieldChange);
    window.mathVirtualKeyboard.targetOrigin = "*";
  } catch(e) {
    console.error('Math field initialization failed:', e);
  }
});
```

**Recommendation**: Graceful fallback to text input

---

**3. Navigation Bullet Overflow (Style 2)**

**Symptom**: Bullets not scrolling correctly with many questions (15+)

**Cause**:
- Fixed scroll calculation assumes 5 bullets visible
- Doesn't handle edge cases

**Handle**:
```javascript
function scrollStyle2GroupNavigation(event, slideNum){
  let slideDiv = Math.ceil(slideNum/5) - 1;
  var leftPos = slideDiv * 225;
  $(event.target).parents(".group-interactivity-container").find(".style2NavigationBtns .numbersContainer").animate({scrollLeft: leftPos}, 300);
}
```

**Limitation**: Hardcoded 225px width (5 bullets × 45px)

**Recommendation**: Calculate dynamically based on container width

---

**4. State Persistence Failure**

**Symptom**: User responses lost on page navigation

**Cause**:
- `localStorage` full or disabled
- SCORM API unavailable
- Browser privacy mode

**Handle**:
```javascript
try {
  localStorage.setItem("data", JSON.stringify(data));
} catch(e) {
  // Quota exceeded or disabled
}

if (typeof apiHandle != "undefined") {
  saveAction(event, scoObj);
} else {
  // No SCORM available - state not persisted
}
```

**Recommendation**: Implement session storage fallback

---

**5. Scoring Discrepancies**

**Symptom**: Partial credit not calculated correctly

**Cause**:
- Rounding errors in proportional scoring
- Client-specific logic (CL client removes partial)
- Widget-specific scoring bugs

**Handle**:
```javascript
marks = +(marks + indCorrMark).toFixed(2); // Round to 2 decimals

if(window.client == 'CL'){
  incorrectQuestions += partialCorrect;
  partialCorrect = 0;
}
```

**Known Issue**: Some widgets don't properly set result attributes

---

**6. Double-Submit Prevention**

**Symptom**: Submit button clickable after submission

**Cause**:
- State classes not properly applied
- Timer delays in button state updates

**Handle**:
```javascript
$form.addClass('submitted');
$form.removeClass("enableSubmit");
$form.find('.group-interactivity-btn .submit-btn').addClass('disabled');
```

**Edge Case**: Rapid clicking can still trigger double-submit

**Recommendation**: Add `pointer-events: none` immediately on click

---

**7. Mobile Responsiveness Issues**

**Symptom**: Navigation buttons overlap, bullets cut off

**Cause**:
- Fixed pixel widths don't scale
- Media queries have breakpoints gaps

**Handle**:
```css
@media screen and (max-width: 400px) {
  .group-interactivity-container .style2NavigationBtns .numbersContainer .number {
    min-height: 28px;
    min-width: 28px;
    font-size: 1rem;
  }
}
```

**Limitation**: Doesn't cover all device sizes (401px-449px gap)

---

### Error Logging

**Current State**: Errors logged to console only

**Recommendation**: Implement structured error tracking:
```javascript
window.logGroupActivityError = function(errorType, errorDetails) {
  let errorObj = {
    timestamp: new Date().toISOString(),
    componentId: $(element).parents("[data-saved-index]").attr("data-saved-index"),
    errorType: errorType,
    details: errorDetails,
    userAgent: navigator.userAgent
  };
  
  // Send to analytics endpoint
  if(window.analyticsEndpoint) {
    fetch(window.analyticsEndpoint, {
      method: 'POST',
      body: JSON.stringify(errorObj)
    });
  }
  
  console.error('[Group Activity Error]', errorObj);
};
```

---

## Known Issues

### 1. Maximum Question Limit
**Issue**: Hard limit of 35 questions per Group Activity

**Impact**: Authors cannot create very long assessments

**Workaround**: Split into multiple Group Activities

**Location**:
```javascript
if (scope.fieldData.settings.questionBank.length < 35) {
  scope.fieldData.settings.questionBank.push({...});
}
```

**Recommendation**: Make configurable or remove limit

---

### 2. Style 2 Submit Button Visibility
**Issue**: Submit button hidden until last slide, confusing for users

**Impact**: Users may think they can't submit until navigating to end

**Workaround**: None for end users

**Location**:
```javascript
if(len == slideNum){
  $(event.target).parents('.group-interactivity-container.style2').find('.group-interactivity-btn .submit-btn').show();
} else {
  $(event.target).parents('.group-interactivity-container.style2').find('.group-interactivity-btn .submit-btn').hide();
}
```

**Recommendation**: 
- Option 1: Always show submit button (like Style 1)
- Option 2: Add "Submit" text to last bullet
- Option 3: Show floating submit button when all attempted

---

### 3. Worked Example Non-Interactive by Default
**Issue**: When switching to Worked Example style, interactive mode is forced off

**Impact**: Authors must manually re-enable if they want interactive worked examples

**Location**:
```javascript
if(optionname == 'workedExample'){
  scope.fieldData.settings.isInteractive = "no";
}
```

**Recommendation**: Preserve interactive setting or make style change non-destructive

---

### 4. Duplicate Activity ID Handling
**Issue**: Complex logic for updating IDs after duplication, prone to bugs

**Impact**: Duplicated Group Activities may have ID collisions

**Location**:
```javascript
let duplicateActivityId = localStorage.getItem('duplicateActivityId');
if(duplicateActivityId && duplicateActivityId != "undefined" && duplicateActivityId != ""){
  // Update page-no attributes
  // Update saved-index attributes
  // Generate new UUIDs
}
```

**Recommendation**: Refactor to use centralized ID management service

---

### 5. State Interval Pollution
**Issue**: `groupSubmitBtnCheckInterval` runs indefinitely, checking every second

**Impact**: Performance degradation, especially with multiple Group Activities

**Location**:
```javascript
var groupSubmitBtnCheckInterval = setInterval(() => {
  // Runs every 1000ms forever
  $('.customClass[data-type="group-interactivity-template"]').each(...);
}, 1000);
```

**Recommendation**: 
- Clear interval when component unmounts
- Use event-driven state updates instead of polling

---

### 6. Math Editor Re-initialization
**Issue**: Math fields lose state when re-rendered

**Impact**: User input in math fields may be lost on certain actions

**Location**: `compileAndAppendHtml()` function

**Recommendation**: Store math field state before re-render, restore after

---

### 7. Partial Credit Rounding
**Issue**: Floating-point arithmetic can cause rounding errors

**Impact**: Scores like 6.666667 instead of 6.67

**Current Handle**:
```javascript
marks = +(marks + indCorrMark).toFixed(2);
```

**Limitation**: Inconsistent application across all widget types

**Recommendation**: Apply consistently and consider banker's rounding

---

### 8. CL Client Special Cases
**Issue**: Multiple hardcoded checks for `window.client == 'CL'`

**Impact**: Behavior differs significantly for specific client, hard to maintain

**Locations**: Throughout `group-activity-preview1.js`

**Recommendation**: Extract client-specific logic into configuration object:
```javascript
const CLIENT_CONFIG = {
  'CL': {
    hidePartialCredit: true,
    hideSubmitUntilLast: true,
    noUnattemptedReminder: true
  },
  'default': {
    hidePartialCredit: false,
    hideSubmitUntilLast: false,
    noUnattemptedReminder: false
  }
};
```

---

### 9. Unattempted Question Reminder Scroll
**Issue**: "Yes Attempt" button only scrolls in Style 2, not Style 1

**Impact**: Style 1 users clicked to unattempted question but no scroll occurs

**Location**:
```javascript
$(document).on("click", "...yesAttempt", function(event){
  if(questionHtml != "" && $(event.target).parents(".group-interactivity-container").hasClass('style2')){
    // Scroll to question (Style 2)
  } else {
    console.log('scroll feature not available for style1');
  }
});
```

**Recommendation**: Implement scrollIntoView() for Style 1

---

### 10. Feedback Alert Localization
**Issue**: Hardcoded English text with incomplete localization

**Location**:
```html
<span data-localize="attempted_message">Questions Attempted : </span>
<span data-localize="correct_answers">Correct Answers : </span>
```

**Impact**: Partial localization, inconsistent with other components

**Recommendation**: Complete localization implementation for all text

---

### 11. Generic Feedback Not Supported
**Issue**: Individual widgets' generic feedback hidden in Group Activity

**Impact**: Loss of detailed per-question feedback

**Location**:
```javascript
$(event.target).parents('.customClass').find('.individual-feedback').each(function(index, item){
  // Encode and hide feedback
  $(item).css({ 'display': 'none' });
})
```

**Recommendation**: Add option to show per-question feedback before aggregate

---

### 12. Coming Soon Style Non-Functional
**Issue**: "comingSoon" style is placeholder with no implementation

**Impact**: Authors see it in settings but can't actually use it

**Location**:
```javascript
if(optionname != "comingSoon"){
  scope.fieldData.settings.styleClass = optionname;
  // ... configure style
}
```

**Recommendation**: Remove from UI or implement functionality

---

## Recommendations

### High Priority

#### 1. Replace Polling with Event-Driven State Management
**Problem**: 1-second interval checking creates performance issues

**Solution**:
```javascript
// Instead of polling
var groupSubmitBtnCheckInterval = setInterval(() => { ... }, 1000);

// Use custom events
$(document).on('groupActivityAttemptChange', function(event, componentId) {
  let $container = $('[data-saved-index="'+componentId+'"]');
  window.highlightGroupBullets($container.find('.group-interactivity-container'));
  updateSubmitButtonState($container);
});

// Trigger from child widgets
$(childWidget).on('change', function() {
  $(this).parents('.question-container').addClass('attempted-question');
  $(document).trigger('groupActivityAttemptChange', [componentId]);
});
```

**Benefits**:
- Eliminates constant DOM queries
- Reduces CPU usage by ~80-90%
- More responsive to user actions

---

#### 2. Implement Comprehensive Error Boundaries
**Problem**: Component failures cascade, poor user feedback

**Solution**:
```javascript
App.directive('groupInteractivity', ['$timeout', 'TemplateService', '$sce', '$exceptionHandler',
  function($timeout, TemplateService, $sce, $exceptionHandler) {
    return {
      link: function(scope, element, attr) {
        try {
          // Existing initialization logic
        } catch(error) {
          $exceptionHandler(error);
          showUserErrorMessage(element, 'Failed to initialize Group Activity. Please refresh and try again.');
        }
      }
    };
  }
]);

function showUserErrorMessage(element, message) {
  let errorHtml = `
    <div class="group-activity-error-state">
      <span class="icon-error"></span>
      <p>${message}</p>
      <button onclick="location.reload()">Reload Page</button>
    </div>
  `;
  $(element).html(errorHtml);
}
```

---

#### 3. Add Accessibility Improvements
**Problem**: Keyboard navigation limited, screen reader support minimal

**Solution**:
```html
<!-- Add ARIA labels -->
<div class="style2NavigationBtns" role="navigation" aria-label="Question Navigation">
  <button class="leftArr" aria-label="Previous question" ng-click="prevSlide()">
    <span class="icon-Back-01" aria-hidden="true"></span>
  </button>
  <div class="numbersContainer" role="list">
    <button role="listitem" 
            class="number" 
            ng-repeat="questions in fieldData.settings.questionBank track by $index"
            aria-label="Go to question {{$index + 1}}"
            aria-current="{{$index == currentSlide ? 'step' : 'false'}}"
            tabindex="0"
            ng-click="goToSlide($index)"
            ng-keydown="$event.key === 'Enter' && goToSlide($index)">
      {{$index + 1}}
    </button>
  </div>
  <button class="rightArr" aria-label="Next question" ng-click="nextSlide()">
    <span class="icon-Next-01" aria-hidden="true"></span>
  </button>
</div>

<!-- Add keyboard shortcuts -->
<script>
$(document).on('keydown', function(e) {
  if(!$('.group-interactivity-container.style2:focus-within').length) return;
  
  if(e.key === 'ArrowLeft') {
    $('.group-interactivity-container.style2 .leftArr').trigger('click');
  } else if(e.key === 'ArrowRight') {
    $('.group-interactivity-container.style2 .rightArr').trigger('click');
  }
});
</script>
```

---

#### 4. Centralized Configuration Management
**Problem**: Client-specific logic scattered throughout code

**Solution**:
```javascript
// config/group-activity-config.js
class GroupActivityConfig {
  constructor(clientId) {
    this.clientId = clientId || 'default';
    this.settings = this.getClientSettings();
  }
  
  getClientSettings() {
    const configs = {
      'CL': {
        hidePartialCredit: true,
        hideSubmitUntilLastSlide: true,
        skipUnattemptedReminder: true,
        autoHideSubmitAfterSuccess: true
      },
      'EU': {
        hidePartialCredit: false,
        hideSubmitUntilLastSlide: false,
        skipUnattemptedReminder: false,
        autoHideSubmitAfterSuccess: false
      },
      'default': {
        hidePartialCredit: false,
        hideSubmitUntilLastSlide: false,
        skipUnattemptedReminder: false,
        autoHideSubmitAfterSuccess: false
      }
    };
    
    return configs[this.clientId] || configs['default'];
  }
  
  shouldHidePartialCredit() { return this.settings.hidePartialCredit; }
  shouldHideSubmitUntilLastSlide() { return this.settings.hideSubmitUntilLastSlide; }
  shouldSkipUnattemptedReminder() { return this.settings.skipUnattemptedReminder; }
}

// Usage
const config = new GroupActivityConfig(window.client || window.parent.client);

if(config.shouldHidePartialCredit()) {
  incorrectQuestions += partialCorrect;
  partialCorrect = 0;
}
```

---

### Medium Priority

#### 5. Lazy Loading for Child Widgets
**Problem**: All widget JavaScript loaded upfront, slows initial page load

**Solution**:
```javascript
const WIDGET_SCRIPTS = {
  'multiple-choice-template': 'js/templates/multiple-choice-preview1.js',
  'fill-in-the-blank': 'js/templates/fib-preview1.js',
  'match-the-pairs': 'js/templates/mtp-preview1.js'
  // ... etc
};

async function loadWidgetScript(widgetType) {
  if(window.loadedWidgetScripts && window.loadedWidgetScripts[widgetType]) {
    return; // Already loaded
  }
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = WIDGET_SCRIPTS[widgetType];
    script.onload = () => {
      window.loadedWidgetScripts = window.loadedWidgetScripts || {};
      window.loadedWidgetScripts[widgetType] = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Load on drop
scope.onDropComplete = async function(index, data, evt) {
  try {
    await loadWidgetScript(data.dataType);
    // Proceed with widget rendering
  } catch(e) {
    console.error('Failed to load widget script:', e);
  }
};
```

---

#### 6. State Persistence Service
**Problem**: State management logic duplicated, no fallback mechanisms

**Solution**:
```javascript
class GroupActivityStateService {
  constructor() {
    this.storage = this.getAvailableStorage();
  }
  
  getAvailableStorage() {
    // Try in order: SCORM API > localStorage > sessionStorage > in-memory
    if(typeof apiHandle !== "undefined") return new SCORMStorage();
    if(this.isStorageAvailable('localStorage')) return new LocalStorage();
    if(this.isStorageAvailable('sessionStorage')) return new SessionStorage();
    return new MemoryStorage();
  }
  
  isStorageAvailable(type) {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }
  
  saveState(componentId, stateObj) {
    try {
      this.storage.set(componentId, stateObj);
      return true;
    } catch(e) {
      console.error('State save failed:', e);
      return false;
    }
  }
  
  loadState(componentId) {
    try {
      return this.storage.get(componentId);
    } catch(e) {
      console.error('State load failed:', e);
      return null;
    }
  }
}

// Usage
const stateService = new GroupActivityStateService();
stateService.saveState(componentId, {
  attemptsDone: 2,
  correctAnswers: 5,
  timestamp: Date.now()
});
```

---

#### 7. Dynamic Question Limit
**Problem**: Hard limit of 35 questions

**Solution**:
```javascript
// Add to settings schema
{
  "maxQuestions": 35, // Configurable per instance
  "showWarningAt": 30 // Warn author approaching limit
}

// In directive
scope.canAddQuestion = function() {
  return scope.fieldData.settings.questionBank.length < scope.fieldData.settings.maxQuestions;
};

scope.addQuestionSlot = function() {
  if(!scope.canAddQuestion()) {
    showNotification('Maximum questions reached (' + scope.fieldData.settings.maxQuestions + ')');
    return false;
  }
  
  if(scope.fieldData.settings.questionBank.length >= scope.fieldData.settings.showWarningAt) {
    showNotification('Approaching maximum question limit', 'warning');
  }
  
  scope.fieldData.settings.questionBank.push({
    "questionType": "Widget Type",
    "questionTemplate": ""
  });
};
```

---

#### 8. Unified Scoring Engine
**Problem**: Scoring logic duplicated for each widget type

**Solution**:
```javascript
class GroupActivityScoringEngine {
  constructor() {
    this.widgetScorers = this.registerScorers();
  }
  
  registerScorers() {
    return {
      'multiple-choice-template': new MCQScorer(),
      'fill-in-the-blank': new FIBScorer(),
      'match-the-pairs': new MTPScorer(),
      'imagelabelling': new ImageLabelScorer(),
      'highlight': new HighlightScorer()
      // ... etc
    };
  }
  
  scoreWidget(widgetElement) {
    const widgetType = $(widgetElement).attr('data-type');
    const scorer = this.widgetScorers[widgetType];
    
    if(!scorer) {
      console.warn('No scorer registered for widget type:', widgetType);
      return { correct: 0, incorrect: 0, partial: 0, marks: 0 };
    }
    
    return scorer.score(widgetElement);
  }
  
  scoreAllWidgets(containerElement) {
    const results = {
      correct: 0,
      incorrect: 0,
      partial: 0,
      unanticipated: 0,
      total: 0,
      marks: 0
    };
    
    $(containerElement).find('.question-container-box .customClass').each((index, widget) => {
      const widgetResult = this.scoreWidget(widget);
      results.correct += widgetResult.correct;
      results.incorrect += widgetResult.incorrect;
      results.partial += widgetResult.partial;
      results.marks += widgetResult.marks;
      results.total += (widgetResult.correct + widgetResult.incorrect + widgetResult.partial);
    });
    
    return results;
  }
}

// Base scorer class
class WidgetScorer {
  score(widgetElement) {
    throw new Error('score() must be implemented by subclass');
  }
  
  normalize(value, precision = 2) {
    return +value.toFixed(precision);
  }
}

// Example implementation
class MCQScorer extends WidgetScorer {
  score(widgetElement) {
    const $widget = $(widgetElement);
    const isCorrect = $widget.find(".correct-question").length > 0;
    const isMultiSelect = $widget.find('.question-select-wrap').hasClass('multiple-questions');
    
    if(isCorrect) {
      return { correct: 1, incorrect: 0, partial: 0, marks: 1 };
    }
    
    if(isMultiSelect) {
      return this.scoreMultiSelect($widget);
    }
    
    return { correct: 0, incorrect: 1, partial: 0, marks: 0 };
  }
  
  scoreMultiSelect($widget) {
    const result = $widget.attr("result").split(',').map(Number);
    const totalCorrect = $widget.find('input[data-iscorrect="true"]').length;
    const userCorrect = result[1];
    const marks = this.normalize(userCorrect / totalCorrect);
    
    if(userCorrect === 0) {
      return { correct: 0, incorrect: 1, partial: 0, marks: 0 };
    }
    
    return { correct: 0, incorrect: 0, partial: 1, marks: marks };
  }
}
```

---

### Low Priority (Nice to Have)

#### 9. Analytics and Telemetry
**Problem**: No visibility into how students interact with Group Activities

**Solution**:
```javascript
class GroupActivityAnalytics {
  trackEvent(eventType, eventData) {
    const analyticsObj = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      componentId: eventData.componentId,
      userId: window.currentUser?.id,
      sessionId: window.sessionId,
      data: eventData
    };
    
    // Send to analytics endpoint
    if(window.analyticsEndpoint) {
      navigator.sendBeacon(window.analyticsEndpoint, JSON.stringify(analyticsObj));
    }
    
    // Also log locally for debugging
    console.log('[Analytics]', analyticsObj);
  }
  
  trackQuestionAttempt(componentId, questionIndex, widgetType, timeTaken) {
    this.trackEvent('question_attempt', {
      componentId: componentId,
      questionIndex: questionIndex,
      widgetType: widgetType,
      timeTaken: timeTaken
    });
  }
  
  trackSubmission(componentId, results, attemptNumber) {
    this.trackEvent('group_activity_submission', {
      componentId: componentId,
      correct: results.correct,
      incorrect: results.incorrect,
      partial: results.partial,
      totalQuestions: results.total,
      score: results.marks,
      attemptNumber: attemptNumber
    });
  }
  
  trackNavigation(componentId, fromSlide, toSlide, navigationMethod) {
    this.trackEvent('navigation', {
      componentId: componentId,
      fromSlide: fromSlide,
      toSlide: toSlide,
      method: navigationMethod // 'bullet', 'arrow', 'keyboard'
    });
  }
}

// Usage
const analytics = new GroupActivityAnalytics();
analytics.trackSubmission(componentId, marksObj, attemptNumber);
```

#### 10. Progressive Enhancement for Math Editor
**Problem**: Math editor failures break the entire component

**Solution**:
```javascript
function handleMathFieldError(mathFieldElement, error) {
  console.error('Math field error:', error);
  
  // Fallback to text input
  const latexValue = $(mathFieldElement).attr('data-equation-latex');
  const fallbackInput = `
    <input type="text" 
           class="math-fallback-input" 
           value="${latexValue}"
           placeholder="Enter LaTeX expression"
           title="Math editor unavailable. Enter LaTeX directly.">
  `;
  
  $(mathFieldElement).replaceWith(fallbackInput);
}

// Wrap math field initialization
scope.compileAndAppendHtml = function(currentDroppable, content) {
  // ... existing compilation logic
  
  currentDroppable.find('.auth-mathfield-holder').each(function(itm, inx){
    try {
      let mathData = $(inx).attr('data-equation-latex');
      let mfId = $(inx).find('math-field').attr('id');
      let mf = document.getElementById(mfId);
      
      if(!mf) {
        throw new Error('Math field element not found');
      }
      
      mf.setValue(mathData);
      $(mf).on('input', con.mathFieldChange);
      window.mathVirtualKeyboard.targetOrigin = "*";
      mf.virtualKeyboardTargetOrigin = "*"; 
      mf.mathModeSpace = '\\:';
    } catch(e) {
      handleMathFieldError($(inx), e);
    }
  });
}
```

#### 11. Responsive Design Improvements
**Problem**: Layout breaks on uncommon screen sizes

**Solution**:
```css
/* Use CSS Grid instead of fixed widths */
.group-interactivity-container.style2 .style2NavigationBtns {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "left bullets right timer";
  gap: 0.5rem;
  padding: 0.5rem;
}

.leftArr { grid-area: left; }
.numbersContainer { 
  grid-area: bullets; 
  overflow-x: auto;
  scrollbar-width: thin;
}
.rightArr { grid-area: right; }
.groupActivityAssessmentTimingContainer { 
  grid-area: timer; 
  justify-self: end;
}

/* Stack vertically on mobile */
@media (max-width: 600px) {
  .group-interactivity-container.style2 .style2NavigationBtns {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "timer"
      "bullets"
      "left right";
  }
  
  .leftArr, .rightArr {
    display: inline-block;
    width: 49%;
  }
}

/* Use container queries for truly responsive design */
@container (max-width: 500px) {
  .style2NavigationBtns .number {
    min-width: 32px;
    min-height: 32px;
    font-size: 0.875rem;
  }
}
```

#### 12. Undo/Redo for Editor Mode
**Problem**: No way to undo widget deletions or configuration changes

**Solution**:
```javascript
class GroupActivityUndoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxStackSize = 50;
  }
  
  pushState(state) {
    this.undoStack.push(JSON.parse(JSON.stringify(state)));
    if(this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo stack on new action
  }
  
  undo() {
    if(this.undoStack.length === 0) return null;
    
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);
    
    return this.undoStack[this.undoStack.length - 1] || null;
  }
  
  redo() {
    if(this.redoStack.length === 0) return null;
    
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    
    return state;
  }
  
  canUndo() { return this.undoStack.length > 0; }
  canRedo() { return this.redoStack.length > 0; }
}

// Usage
const undoManager = new GroupActivityUndoManager();

// Before any change
undoManager.pushState(scope.fieldData.settings);

// Undo button
scope.undo = function() {
  const previousState = undoManager.undo();
  if(previousState) {
    scope.fieldData.settings = previousState;
    scope.$apply();
  }
};
```

---

## Conclusion

The Group Activity component is a **container-based assessment widget** that unifies multiple interactive components under centralized controls. It supports three visual styles (Vertical Scroll, Horizontal Slider, Worked Example), handles complex scoring across diverse widget types, and integrates with SCORM for gradable activities.

### Strengths
✅ Flexible container supporting 14+ widget types  
✅ Multiple presentation styles for different use cases  
✅ Comprehensive scoring with partial credit  
✅ SCORM-compliant for LMS integration  
✅ Mobile-responsive with touch support  

### Weaknesses
❌ Performance issues due to polling-based state management  
❌ Client-specific logic scattered throughout codebase  
❌ Limited error handling and user feedback  
❌ Accessibility needs improvement (keyboard nav, screen readers)  
❌ Hard-coded limitations (35 question max, fixed bullet widths)  

### Priority Improvements
1. **Replace polling with event-driven architecture** (performance)
2. **Implement error boundaries** (reliability)
3. **Add accessibility features** (inclusivity)
4. **Centralize configuration management** (maintainability)
5. **Create unified scoring engine** (accuracy & extensibility)

