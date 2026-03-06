# Layout Component - Comprehensive Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Layout Types and Variants](#layout-types-and-variants)
3. [Architecture](#architecture)
4. [Data Flow Diagram](#data-flow-diagram)
5. [Component Structure](#component-structure)
6. [Data Model](#data-model)
7. [Directive Implementation](#directive-implementation)
8. [Behavioral Modes](#behavioral-modes)
9. [User Interactions](#user-interactions)
10. [Styling and Responsive Design](#styling-and-responsive-design)
11. [Error Handling](#error-handling)
12. [Known Issues](#known-issues)
13. [Recommendations](#recommendations)

---

## Overview

The **Layout Component** is a multi-column page layout system for the KITABOO Authoring application. It provides authors with flexible container structures to organize and arrange content elements and widgets on a page. The layout system supports drag-and-drop functionality, copy-paste operations, and dynamic content management.

**Primary Purpose:**
- Provide structured content organization through multi-column layouts
- Enable drag-and-drop of widgets/elements into designated drop zones
- Support responsive content arrangement for different screen sizes
- Manage nested content hierarchies within page structures

**Key Capabilities:**
- 6 predefined layout types (Left, Center, Right, Four Column, Three Column, Custom Center)
- Real-time content editing and arrangement
- Full-width and narrow page width toggles
- Nested widget support with parent-child relationships
- Copy-paste functionality within and across pages
- Undo/redo operation tracking

---

## Layout Types and Variants

The system provides 6 distinct layout types, each serving different content organization needs:

### 1. Layout-1 (Left) - `layout1.html`
**Type Name:** "Left"  
**Data Type:** `layout-1`  
**Column Structure:** 1/3 - 2/3 split (30% - 70%)

**Description:**  
Two-column layout with a narrower left column and wider right column. Ideal for sidebar navigation, supplementary content, or images on the left with main content on the right.

**Use Cases:**
- Sidebar with main content
- Image gallery with descriptions
- Table of contents with detailed content

**Template Fields:**
- `fieldData.template1` - Left column (30%)
- `fieldData.template2` - Right column (70%)

---

### 2. Layout-2 (Center) - `layout2.html`
**Type Name:** "Center"  
**Data Type:** `layout-2`  
**Column Structure:** 1/2 - 1/2 split (50% - 50%)

**Description:**  
Balanced two-column layout with equal width columns. Perfect for side-by-side comparisons, parallel content, or dual learning materials.

**Use Cases:**
- Compare and contrast content
- Before/after displays
- Parallel translations
- Dual-topic presentations

**Template Fields:**
- `fieldData.template1` - Left column (50%)
- `fieldData.template2` - Right column (50%)

---

### 3. Layout-3 (Right) - `layout3.html`
**Type Name:** "Right"  
**Data Type:** `layout-3`  
**Column Structure:** 2/3 - 1/3 split (70% - 30%)

**Description:**  
Two-column layout with a wider left column and narrower right column. Mirror of Layout-1, suitable for main content with right sidebar.

**Use Cases:**
- Main content with side notes
- Article with references sidebar
- Content with supplementary images

**Template Fields:**
- `fieldData.template1` - Left column (70%)
- `fieldData.template2` - Right column (30%)

---

### 4. Layout-4 (Four Column) - `layout4.html`
**Type Name:** "Four Column"  
**Data Type:** `layout-4`  
**Column Structure:** 1/4 - 1/4 - 1/4 - 1/4 (25% each)

**Description:**  
Four equal-width columns arranged horizontally. Uses flexbox for equal height distribution.

**Use Cases:**
- Multi-step processes
- Feature comparisons
- Grid-based content
- Card layouts

**Template Fields:**
- `fieldData.template1` - Column 1 (25%)
- `fieldData.template2` - Column 2 (25%)
- `fieldData.template3` - Column 3 (25%)
- `fieldData.template4` - Column 4 (25%)

---

### 5. Layout-5 (Three Column) - `layout5.html`
**Type Name:** "Three Column"  
**Data Type:** `layout-5`  
**Column Structure:** 1/3 - 1/3 - 1/3 (33.33% each)

**Description:**  
Three equal-width columns. Uses flexbox for consistent height.

**Use Cases:**
- Triple comparisons
- Three-step workflows
- Balanced content distribution

**Template Fields:**
- `fieldData.template1` - Column 1 (33.33%)
- `fieldData.template2` - Column 2 (33.33%)
- `fieldData.template3` - Column 3 (33.33%)

---

### 6. Layout-6 (Custom Center) - `layout6.html`
**Type Name:** "Custom Center"  
**Data Type:** `layout-6`  
**Column Structure:** 1/2 - 1/2 with question banks

**Description:**  
Advanced two-column layout supporting multiple question banks. Each column can hold multiple widgets in a repeating structure, ideal for quiz/assessment layouts.

**Use Cases:**
- Question banks
- Multiple assessment items
- Shuffleable content collections
- Dynamic multi-widget containers

**Template Fields:**
- `fieldData.settings.questionBank[]` - Left column questions (max 15)
- `fieldData.settings.questionBank2[]` - Right column questions (max 15)

**Special Features:**
- Scrollable question containers
- Shuffle support (`shuffleQuestionCheckbox`)
- Dynamic question addition (up to 15 per bank)
- Individual question type tracking

---

## Architecture

### High-Level Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     KITABOO Authoring Editor                     │
│                      (ngcontroller.js)                           │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Manages state, coordinates operations
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌─────────────┐          ┌──────────────┐
│  Services   │          │   Config     │
├─────────────┤          ├──────────────┤
│ Template    │          │ Widget       │
│ Service     │◄─────────┤ Definitions  │
│             │          │              │
│ Shell       │          │ Layout Types │
│ Service     │          │              │
└─────┬───────┘          └──────────────┘
      │
      │ Loads JSON, manages HTTP
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│              Layout Directive (layout-directive.js)              │
│                  layoutTemplate directive                        │
├─────────────────────────────────────────────────────────────────┤
│  • Handles drop events (onDropComplete)                          │
│  • Manages paste operations (onPasteDropComplete)                │
│  • Compiles nested widgets (compileAndAppendHtml)                │
│  • Tracks layout settings (fullWidth, layoutType)                │
│  • Coordinates with main controller                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Renders layout templates
                 │
    ┌────────────┴──────────────────────────────────┐
    │                                                │
    ▼                                                ▼
┌─────────────┐                              ┌──────────────┐
│  Layout     │                              │   Layout     │
│  Templates  │                              │   Settings   │
├─────────────┤                              ├──────────────┤
│ layout1.html│◄─────Data Binding───────────►│  Settings    │
│ layout2.html│                              │  Panel       │
│ layout3.html│                              │              │
│ layout4.html│                              │  Full Width  │
│ layout5.html│                              │  Toggle      │
│ layout6.html│                              └──────────────┘
└─────┬───────┘
      │
      │ Styled by
      │
      ▼
┌─────────────────────┐
│   Styling           │
├─────────────────────┤
│ layout-template.css │
│                     │
│ • Column widths     │
│ • Responsive rules  │
│ • Drop zone styles  │
└─────────────────────┘
```

---

## Data Flow Diagram

### Data Flow from Widget Selection to Layout Rendering

```
┌────────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                                │
└────────────┬───────────────────────────────────────────────────────┘
             │
             │ Drags widget OR copies/pastes component
             │
             ▼
┌────────────────────────────────────────────────────────────────────┐
│                   ng-drop-success Trigger                           │
│                onDropComplete($index,$data,$event)                  │
└────────────┬───────────────────────────────────────────────────────┘
             │
             │ Event captured by directive
             │
             ▼
    ┌────────────────────────┐
    │  Layout Directive      │
    │  onDropComplete()      │
    └────────┬───────────────┘
             │
             │ Validates drop operation
             │ Checks: isDroppable, isPastable, empty dropzone
             │
             ▼
    ┌────────────────────────┐        NO       ┌──────────────┐
    │  Valid Drop?           │────────────────►│  Abort       │
    └────────┬───────────────┘                 └──────────────┘
             │ YES
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         Main Controller: findTag()                          │
    │  Retrieves widget data from config.js                      │
    │  Calls: addAttr(data, isCustom, paraValue, jsonData)       │
    └────────┬───────────────────────────────────────────────────┘
             │
             │ Creates DOM structure
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         TemplateService.getJSONData()                       │
    │  Loads widget's default JSON structure                     │
    │  Path: data.json (e.g., layout.json)                       │
    └────────┬───────────────────────────────────────────────────┘
             │
             │ Returns JSON data
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         Save to State                                       │
    │  $scope.savedJson[pageNo][elementId] = jsonData            │
    │  Stores:                                                    │
    │    - identifier (layout-1, layout-2, etc.)                 │
    │    - settings (fullWidth, questionBank, etc.)              │
    │    - template1, template2 (nested HTML content)            │
    └────────┬───────────────────────────────────────────────────┘
             │
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         Compile and Append                                  │
    │  $compile(item)($scope)                                    │
    │  Creates DOM element with:                                 │
    │    - add-custom-template directive                         │
    │    - saved-index, page-no, data-type attributes            │
    └────────┬───────────────────────────────────────────────────┘
             │
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         Layout Template Loaded                              │
    │  Includes layout HTML (e.g., layout1.html)                 │
    │  Applies layoutTemplate directive                          │
    └────────┬───────────────────────────────────────────────────┘
             │
             │ $timeout triggers after DOM ready
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         compileAndAppendHtml() for each column             │
    │  For each column (template1, template2, etc.):             │
    │    1. Get saved content from fieldData                     │
    │    2. Replace 'first-time-load' class                      │
    │    3. $compile content with main controller scope          │
    │    4. Append to column-content div                         │
    └────────┬───────────────────────────────────────────────────┘
             │
             │ Renders nested widgets recursively
             │
             ▼
    ┌────────────────────────────────────────────────────────────┐
    │         Rendered Layout with Content                        │
    │  - Columns visible with nested widgets                     │
    │  - Drop zones active for additional content                │
    │  - Settings panel available                                │
    └────────────────────────────────────────────────────────────┘
```

### Paste Operation Data Flow

```
┌──────────────────┐
│  User copies     │
│  component       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  localStorage stores:                 │
│  - "data" (widget metadata)           │
│  - "copiedComponent" (full structure) │
└────────┬─────────────────────────────┘
         │
         │ User clicks paste zone
         │
         ▼
┌──────────────────────────────────────┐
│  pastecomp($event, 'layout')         │
│  Calls componentPaste()               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  onPasteDropComplete()                │
│  - Retrieves from localStorage        │
│  - Validates drop conditions          │
│  - Calls findTag() with copiedData    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Component appended to drop zone     │
│  Updates fieldData for layout type   │
└──────────────────────────────────────┘
```

---

## Component Structure

### File Organization

```
templates/layouts/
├── layout1.html                    # Left layout (30-70)
├── layout2.html                    # Center layout (50-50)
├── layout3.html                    # Right layout (70-30)
├── layout4.html                    # Four column layout (25-25-25-25)
├── layout5.html                    # Three column layout (33-33-33)
├── layout6.html                    # Custom center with question banks
├── layout-setting-panel.html      # Settings UI for layouts
├── default/
│   └── layout.json                # Default data model
├── scripts/
│   └── layout-directive.js        # Main directive logic
└── styles/
    └── layout-template.css        # All layout styles
```

### HTML Structure (layout1.html Example)

```html
<div class="main-layout-4-border">                          <!-- Outer border container -->
    <div class="layout-container template-clear-div layout-1"  <!-- Main layout container -->
         layout-template                                     <!-- Directive attribute -->
         add-common-hover>                                   <!-- Hover behavior -->
        
        <!-- LEFT COLUMN (30%) -->
        <div class="column one-third selector">
            <!-- Drop zone for widgets -->
            <div class="save-html column-content editables" 
                 ng-drop="true" 
                 ng-drop-success="onDropComplete($index,$data,$event)" 
                 ng-model="fieldData.template1" 
                 contenteditable=false>
            </div>
            
            <!-- Visual placeholder during drag -->
            <div class="layout-placeholder"></div>
            
            <!-- Empty state / Paste zone -->
            <div class="empty-droppable-text"
                 ng-mouseenter="questions.showPasteHere = true" 
                 ng-mouseleave="questions.showPasteHere = false" 
                 ng-click="pastecomp($event,'layout')"
                 ng-style="{ 'background': questions.showPasteHere ? '#AFEBFF' : 'transparent',
                            'border': questions.showPasteHere ? '2px solid #CFC0FB' : 'transparent' }">
                
                <!-- Default drag instruction -->
                <div ng-if="!questions.showPasteHere">
                    <div class="empty-droppable-border">
                        <span>+</span>
                    </div>
                    Drag Elements or Widgets
                </div>
                
                <!-- Paste instruction on hover -->
                <div ng-if="questions.showPasteHere">
                    <div class="empty-droppable-border empty-droppable-border-paste 
                                icon-Paste-Icon generic-step-empty-droppable-border">
                    </div>
                    <span>Paste Here</span>
                </div>
            </div>
        </div>
        
        <!-- VISUAL DIVIDER -->
        <div class="vertical-divider"></div>
        
        <!-- RIGHT COLUMN (70%) -->
        <div class="column two-thirds selector">
            <!-- Similar structure to left column with template2 binding -->
            <div class="save-html column-content editables" 
                 ng-drop="true" 
                 ng-drop-success="onDropComplete($index,$data,$event)" 
                 ng-model="fieldData.template2" 
                 contenteditable=false>
            </div>
            <!-- ... similar empty-droppable-text structure ... -->
        </div>
    </div>
</div>
```

### Key HTML Classes and Attributes

| Class/Attribute | Purpose |
|----------------|---------|
| `main-layout-4-border` | Outer border container with dashed blue border in editor mode |
| `layout-container` | Main flexbox container for columns |
| `layout-1`, `layout-2`, etc. | Specific layout type identifier |
| `layout-template` | Directive attribute that activates layout behavior |
| `column` | Individual column wrapper |
| `one-third`, `two-thirds`, etc. | Width modifiers for columns |
| `selector` | Makes column clickable/selectable |
| `save-html` | Marks content area for persistence |
| `column-content` | Actual content container within column |
| `editables` | Marks as editable/droppable zone |
| `ng-drop="true"` | Enables drag-drop on this element |
| `ng-drop-success` | Callback when drop succeeds |
| `ng-model` | Data binding to fieldData properties |
| `layout-placeholder` | Visual feedback during drag operations |
| `empty-droppable-text` | Empty state instruction display |

---

## Data Model

### Layout JSON Structure (`layout.json`)

```json
{
    "identifier": "layout-1",
    "settings": {
        "align": "none",
        "type": "scroll-view",
        "maxTries": "1",
        "reset": false,
        "showmecheckbox": false,
        "allowRestart": false,
        "shuffleQuestionCheckbox": false,
        "pagebgcolor": "#fff",
        "outline": "outline",
        "verticalSlide": "vertical-slideshow",
        "outlineBgColor": "#FFFFFF",
        "styleClass": "style2",
        "Appearance": "#7eb1eb",
        "metaTags": [],
        "questionBank": [{
            "questionType": "Widget Type",
            "questionTemplate": ""
        }],
        "questionBank2": [{
            "questionType": "Widget Type",
            "questionTemplate": ""
        }],
        "fullWidth": false,
        "layoutType": null
    },
    "custom": {
        "css": ["css/templates/layout-template.css"],
        "javascript": []
    }
}
```

### Data Model Properties

| Property | Type | Description | Used In |
|----------|------|-------------|---------|
| `identifier` | String | Layout type identifier (e.g., "layout-1") | All layouts |
| `settings.fullWidth` | Boolean | Toggle between full-width and narrow page margins | All layouts (toggleable via settings panel) |
| `settings.layoutType` | String | Stores layout dataType during runtime | All layouts |
| `settings.questionBank` | Array | Collection of questions/widgets for left column | Layout-6 only |
| `settings.questionBank2` | Array | Collection of questions/widgets for right column | Layout-6 only |
| `settings.shuffleQuestionCheckbox` | Boolean | Enable shuffling of question order in Layout-6 | Layout-6 only |
| `custom.css` | Array | CSS file paths to load | All layouts |
| `custom.javascript` | Array | JavaScript file paths to load | All layouts |

### Runtime Data Structure (savedJson)

When a layout is added to a page, it's stored in the controller's `savedJson` object:

```javascript
$scope.savedJson[pageNo][elementId] = {
    identifier: "layout-1",
    layoutChildren: true,  // Indicates this layout contains nested widgets
    template1: "<div>...nested widget HTML...</div>",  // For layout-1,2,3,4,5
    template2: "<div>...nested widget HTML...</div>",
    template3: "<div>...nested widget HTML...</div>",  // For layout-4,5
    template4: "<div>...nested widget HTML...</div>",  // For layout-4
    template5: "<div>...nested widget HTML...</div>",  // For layout-5 (not actively used)
    settings: {
        fullWidth: false,
        layoutType: "layout-1",
        templateName: "Left",
        templateImage: "icon-Page_Layout_Left",
        layoutPageDataIndex: "pg-1-12345",  // Page and element identifier
        questionBank: [...],  // For layout-6
        questionBank2: [...]  // For layout-6
    }
}
```

### Field Data Binding

The directive binds layout data through `fieldData` scope object:

```javascript
// For layouts 1-5:
fieldData.identifier = "layout-1"
fieldData.template1 = "<html content>"  // Left or first column
fieldData.template2 = "<html content>"  // Right or second column
fieldData.template3 = "<html content>"  // Third column (layout-4, layout-5)
fieldData.template4 = "<html content>"  // Fourth column (layout-4)
fieldData.settings = { fullWidth: false, ... }

// For layout-6:
fieldData.settings.questionBank = [
    { questionType: "MCQ", questionTemplate: "<html>" },
    { questionType: "Widget Type", questionTemplate: "" }
]
fieldData.settings.questionBank2 = [...]
```

---

## Directive Implementation

### layoutTemplate Directive

**File:** `templates/layouts/scripts/layout-directive.js`

**Directive Registration:**
```javascript
App.directive('layoutTemplate', ['$timeout', 'TemplateService', '$sce', 
    function($timeout, TemplateService, $sce) {
    return {
        restrict: 'A',
        controller: function($scope, $compile) { ... },
        link: function(scope, element, attr) { ... }
    }
}]);
```

### Key Functions

#### 1. compileAndAppendHtml()

**Purpose:** Compiles and inserts nested widget HTML into layout columns

```javascript
$scope.compileAndAppendHtml = function (currentDroppable, content) {
    var con = angular.element(document.getElementById('myController')).scope();
    
    // Remove first-time-load class to prevent re-triggering
    if(content) {
        content = content.replace('first-time-load','')
    }
    
    // Compile content with main controller scope and insert
    currentDroppable.html($compile(content || '')(con));
}
```

**Called For:** Each column during layout initialization in `$timeout`

**Execution Flow:**
1. Gets main controller scope
2. Removes 'first-time-load' class from nested content
3. Compiles HTML with AngularJS directives
4. Appends to target column element

---

#### 2. onDropComplete()

**Purpose:** Handles widget drop events into layout columns

```javascript
scope.onDropComplete = function (index, data, evt, boxNo) {
    var con = angular.element(document.getElementById('myController')).scope();
    
    // Validation checks
    let isDroppable = localStorage.getItem("isDroppable");
    let isPastable = localStorage.getItem("isPastable");
    
    if (!data || $(scope.dropElement).children().length !== 0 || 
        !data.isDroppable || isDroppable === 'false' || isPastable == false) {
        localStorage.setItem("isDroppable", true);
        localStorage.setItem("isPastable", true);
        return;
    }
    
    // Get or resolve widget data
    if(!data) {
        dataType = $(evt.element).find('[data-type]').eq(0).attr('data-type');
        // ... lookup widget data from config
    }
    
    // Handle moving existing element vs. new widget
    if(evt.element.hasClass('sd-item')) {
        item = evt.element;  // Moving existing element
        con.savedJson[pageNo][savedIndex].layoutChildren = true;
    } else {
        item = con.findTag(data, true);  // Creating new widget
    }
    
    // Append to drop zone
    $(scope.dropElement).append(item);
    
    // For layout-6: Update question banks
    if(boxNo === 0) {
        scope.fieldData.settings.questionBank[questionIndex].questionType = data.name;
        if (scope.fieldData.settings.questionBank.length < 15) {
            scope.fieldData.settings.questionBank.push({
                "questionType": "Widget Type", 
                "questionTemplate": ""
            });
        }
    }
    
    // Enable save button
    enableDisableSaveButton(true);
    
    // Track for undo/redo
    setTimeout(function() {
        // ... undo/redo tracking logic
        con.undo_stack.push({
            "Action": "DragComponent",
            "data-type": undodata,
            "uniqueid": uniqueid,
            "pageNo": pageNo,
            "data": data,
            "uuid": con.undo_stack2,
            "parentid": parentid,
            "parentdatatype": parentdatatype
        });
    }, 600);
}
```

**Parameters:**
- `index`: Drop zone index
- `data`: Widget/element data object
- `evt`: Drop event
- `boxNo`: For layout-6, identifies which question bank (0 or 1)

**Validation:**
1. Checks if data exists
2. Verifies drop zone is empty
3. Checks isDroppable flag in localStorage
4. Validates isPastable flag

**Actions:**
1. Appends widget to drop zone
2. Updates question banks (for layout-6)
3. Marks parent as having children (`layoutChildren: true`)
4. Tracks undo/redo state
5. Enables save button

---

#### 3. onPasteDropComplete()

**Purpose:** Handles paste operations from clipboard

```javascript
scope.onPasteDropComplete = function(evt) {
    var retrievedData = localStorage.getItem("data");
    let copiedComponent = JSON.parse(localStorage.getItem("copiedComponent"));
    var data = JSON.parse(retrievedData);
    
    // Get main controller reference
    var con = angular.element(document.getElementById('myController')).scope();
    
    // Validation
    if ($(scope.dropElement).children().length !== 0 || !data) {
        return;
    }
    
    // Create widget from copied data
    var item = con.findTag(data, false, null, copiedComponent);
    
    $(scope.dropElement).append(item);
    
    // Update data model based on layout type
    if (scope.fieldData.identifier === "layout-6") {
        // Handle question banks
        var parentElement = $(scope.dropElement).closest('[ng-repeat]');
        var targetBank = parentElement.attr('ng-repeat').includes('questionBank2') 
                         ? 'questionBank2' : 'questionBank';
        updateQuestionBank(targetBank, questionIndex, data, item);
    }
    else if (["layout-1", "layout-2", "layout-3", "layout-4", "layout-5"]
             .includes(scope.fieldData.identifier)) {
        // Update template field directly
        var ngModel = $(scope.dropElement).attr('ng-model');
        if (ngModel && ngModel.startsWith('fieldData.')) {
            var key = ngModel.split('fieldData.')[1];
            scope.fieldData[key] = item instanceof jQuery 
                                   ? item.get(0).outerHTML 
                                   : item.outerHTML;
        }
    }
    
    enableDisableSaveButton(true);
    con.safeApply();
}
```

**Data Sources:**
- `localStorage.getItem("data")`: Widget metadata
- `localStorage.getItem("copiedComponent")`: Full component structure

**Layout-Specific Handling:**
- **Layout-6:** Updates appropriate questionBank or questionBank2 array
- **Layouts 1-5:** Updates template1, template2, etc. directly in fieldData

---

#### 4. pastecomp()

**Purpose:** Orchestrates paste operation

```javascript
scope.pastecomp = function (e) {
    var con = angular.element(document.getElementById('myController')).scope();
    
    // Trigger controller's paste logic
    con.componentPaste(e, 'layout');
    
    // Check if paste is allowed
    let isDroppable = localStorage.getItem("isDroppable");
    var retrievedData = localStorage.getItem("data");
    var data = JSON.parse(retrievedData);
    
    if (isDroppable !== 'false') {
        if (data.dataType !== "layout-7") {  // Prevent pasting flexi layouts
            scope.onPasteDropComplete(e);
        }
    }
    
    // Handle math editor if present
    onPasteComponentHanddleMathEditor(element);
}
```

---

#### 5. Layout Initialization Logic

**Executed in `$timeout` after DOM ready:**

```javascript
$timeout(function () {
    // Store layout type identifier
    scope.fieldData.identifier = $(element).parents('[data-type]').attr('data-type');
    
    // Auto-trigger click for first-time load
    if(element.parents('.template-main-body').eq(0).hasClass('first-time-load')) {
        element.trigger('click').addClass('focusactive').focus();
        element[0].scrollIntoView();
    }
    
    // Compile and insert content for each column
    scope.compileAndAppendHtml(element.find('.column-content').eq(0), scope.fieldData.template1);
    scope.compileAndAppendHtml(element.find('.column-content').eq(1), scope.fieldData.template2);
    scope.compileAndAppendHtml(element.find('.column-content').eq(2), scope.fieldData.template3);
    scope.compileAndAppendHtml(element.find('.column-content').eq(3), scope.fieldData.template4);
    scope.compileAndAppendHtml(element.find('.column-content').eq(4), scope.fieldData.template5);
    
    // For layout-6 with question banks
    element.find('.column-content.first-box').each(function(e) {
        scope.compileAndAppendHtml($(this), 
            scope.fieldData.settings.questionBank[e].questionTemplate);
    });
    element.find('.column-content.second-box').each(function(e) {
        scope.compileAndAppendHtml($(this), 
            scope.fieldData.settings.questionBank2[e].questionTemplate);
    });
    
    // Apply fullWidth setting to parent container
    if (scope.fieldData && scope.fieldData.settings && scope.fieldData.settings.fullWidth) {
        $(element).parents('.sd-item').eq(0).attr('data-pagemargin', 'fullwidth');
    } else {
        $(element).parents('.sd-item').eq(0).attr('data-pagemargin', 'narrow');
    }
});
```

---

#### 6. fullWidth Toggle Handler

```javascript
$(element).on('change', '.layout-width-setup', function(){
    var con = angular.element(document.getElementById('myController')).scope();
    const el = $('[data-saved-index="'+con.currSettings.layoutPageDataIndex+'"]');
    
    if (!con.currSettings.fullWidth) {
        con.currSettings.fullWidth = true;
        $(el).eq(0).attr('data-pagemargin', 'fullwidth');
    } else {
        con.currSettings.fullWidth = false;
        $(el).eq(0).attr('data-pagemargin', 'narrow');
    }
});
```

**Effect:** Toggles `data-pagemargin` attribute which CSS uses to adjust page width

---

#### 7. Click Event Handlers

```javascript
// Clicking empty drop zone closes settings panels
$(".empty-droppable-text").on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    var con = angular.element(document.getElementById('myController')).scope();
    con.closeSetting();
    if(con.closeHeaderSetting){
        con.closeHeaderSetting();
    }
});

// Clicking layout container closes settings (for specific layout types)
$(element).on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    var layoutDataType = $(e.target).parents(".customClass").eq(0).attr("data-type");
    if(layoutDataType === "layout-3" || layoutDataType === "layout-1" || 
       layoutDataType === "layout-2" || layoutDataType === "layout-4" ||
       layoutDataType === "layout-5" || layoutDataType === "layout-6"){
        var con = angular.element(document.getElementById('myController')).scope();
        con.closeSetting();
        if(con.closeHeaderSetting){
            con.closeHeaderSetting();
        }
    }
});
```

---

#### 8. Settings Panel Integration

```javascript
$(element).parents('.sd-item').bind('click', function(e, isCustom) {	
    e.preventDefault();
    e.stopPropagation();
    
    var layout = scope.fieldData.identifier;
    var con = angular.element(document.getElementById('myController')).scope();	
    
    // Open settings panel
    con.setSettingsValues($('#target'), 'settings');
    
    let layoutDataIndex = $(e.target).parents('.sd-item').attr('data-saved-index');
    let layoutData = con.widgets[0].widget.filter(item => item.dataType == layout);
    
    // Populate settings panel with layout data
    con.currSettings.fullWidth = con.currSettings.fullWidth || false;
    con.currSettings.layoutType = layoutData[0].dataType;
    con.currSettings.templateName = layoutData[0].name;
    con.currSettings.templateImage = layoutData[0].iconClass;
    con.currSettings.layoutPageDataIndex = layoutDataIndex;
});
```

**Populates Settings Panel With:**
- Layout type name (e.g., "Left")
- Layout icon class
- Full-width toggle state
- Page and element index for reference

---

## Behavioral Modes

### 1. Editor Mode

**Description:** Primary authoring interface where layouts are created, edited, and arranged.

**Visual Characteristics:**
- Blue dashed border around layout (`border: 1px dashed #2175d1`)
- Visible column dividers
- Drop zone indicators with "+" icons
- Hover effects on paste zones (blue highlight: `#AFEBFF`)
- Widget toolbar visible on each element

**Active Features:**
- Drag-and-drop widget insertion
- Copy-paste operations
- Settings panel access
- Undo/redo tracking
- Full-width toggle
- Delete/move operations
- Real-time content editing

**Data Binding:**
- Two-way binding through `ng-model` on column-content divs
- Changes immediately reflected in `$scope.savedJson`
- Settings synced through `$scope.currSettings`

**User Interactions:**
1. **Adding Widgets:**
   - Drag from widget panel → Drop onto column
   - OR Copy existing widget → Click paste zone
   
2. **Editing Content:**
   - Click widget to open settings
   - Modify properties in right panel
   - Changes auto-saved to JSON model

3. **Layout Configuration:**
   - Click layout background
   - Settings panel opens on right
   - Toggle full-width checkbox
   - Changes apply immediately

---

### 2. Preview Mode

**Description:** Read-only preview of authored content, simulating reader experience.

**Visual Characteristics:**
- No editor borders (`.preview-row-container .main-layout-4-border { border: none; }`)
- No drop zones visible
- No widget toolbars
- Clean content presentation
- Responsive column stacking on mobile

**Active Features:**
- Content visibility only
- Responsive design preview
- Interactive widgets functional (MCQ, drag-drop, etc.)
- No editing capabilities

**Rendering:**
- Uses same HTML templates
- CSS hides editor-specific elements
- Compiled widgets render normally
- Full-width setting respected

**Data Source:**
- Reads from saved JSON
- No modifications to data model
- Widgets in "view" mode

---

### 3. Reader Mode (Published Content)

**Description:** Final published form consumed by end users in KITABOO Reader application.

**Visual Characteristics:**
- Clean, distraction-free layout
- No authoring tools visible
- Optimized for reading and interaction
- Fully responsive across devices

**Active Features:**
- All interactive widgets functional
- Assessment submission enabled
- Progress tracking
- Bookmarking and annotations
- Responsive column stacking
- Touch-optimized interactions

**Rendering Process:**
1. Content exported from authoring tool
2. Compiled into EPUB/HTML package
3. Loaded by KITABOO Reader
4. Widgets initialized in reader context
5. User interactions tracked and submitted

**Responsive Behavior:**
- Desktop: Full multi-column layout
- Tablet: Columns maintained but narrower
- Mobile: Single column stack (width: 100%)

**Data Persistence:**
- User progress saved to cloud
- Assessment responses tracked
- Annotations stored separately
- Original layout structure preserved

---

### 4. Offline/Package Mode

**Description:** Content packaged for offline use, embedded in EPUB or SCORM packages.

**Characteristics:**
- All resources bundled (HTML, CSS, JS, images)
- No server dependencies for base content
- Local JSON data files
- Cached widget libraries

**Functionality:**
- Full reader mode features
- Interactive widgets work offline
- Assessments queue for later sync
- Local storage for progress

**Limitations:**
- No cloud sync until online
- Assessment submissions queued
- Media streaming unavailable (must be pre-downloaded)
- Collaborative features disabled

**Package Structure:**
```
content-package/
├── index.html
├── templates/
│   ├── layouts/
│   │   ├── layout1.html
│   │   ├── layout-template.css
│   │   └── ...
├── data/
│   └── saved-content.json
├── assets/
│   ├── images/
│   ├── videos/
│   └── audio/
└── js/
    ├── angular.min.js
    ├── widgets/
    └── ...
```

---

## User Interactions

### 1. Drag and Drop Widget into Layout

**User Action Flow:**
1. User selects widget from left panel
2. Drags over layout column
3. Drop zone highlights (green dashed border appears)
4. Releases widget
5. Widget appears in column with toolbar

**Technical Flow:**
```
User drags widget
    ↓
ng-drag directive captures dragstart
    ↓
Stores widget data in $scope
    ↓
User hovers over column-content
    ↓
ng-drop="true" activates drop zone
    ↓
drag-enter class added → .layout-placeholder shows
    ↓
User releases mouse
    ↓
ng-drop-success="onDropComplete($index,$data,$event)" fires
    ↓
onDropComplete() validates drop
    ↓
con.findTag() creates widget DOM
    ↓
Widget appended to column-content
    ↓
$compile() activates widget directive
    ↓
Widget renders with content
```

**Visual Feedback:**
- Drag start: Widget becomes semi-transparent
- Hover over drop zone: Green dashed placeholder appears
- Drop: Widget animates into place
- Invalid drop: Red flash and rejection

---

### 2. Copy-Paste Component

**User Action Flow:**
1. User right-clicks existing widget
2. Selects "Copy" from context menu
3. Hovers over empty layout column
4. "Paste Here" text appears
5. Clicks paste zone
6. Widget appears as duplicate

**Technical Flow:**
```
Right-click widget → Copy (context menu)
    ↓
componentCopy() in main controller
    ↓
Stores to localStorage:
  - "data" = widget metadata
  - "copiedComponent" = full JSON structure
    ↓
User hovers over paste zone
    ↓
ng-mouseenter triggers showPasteHere = true
    ↓
Paste zone changes color (#AFEBFF background)
    ↓
User clicks paste zone
    ↓
ng-click="pastecomp($event,'layout')" fires
    ↓
pastecomp() calls componentPaste()
    ↓
onPasteDropComplete() reads localStorage
    ↓
con.findTag() creates widget from copiedComponent
    ↓
Widget appended and compiled
```

**Data Stored in localStorage:**
```javascript
{
    "data": {
        "name": "Paragraph",
        "dataType": "paragraph",
        "url": "templates/paragraph.html",
        "json": "templates/default/paragraph.json",
        ...
    },
    "copiedComponent": {
        "identifier": "paragraph",
        "header": "<p>This is the copied content...</p>",
        "settings": {...}
    }
}
```

---

### 3. Toggle Full Width

**User Action Flow:**
1. User clicks layout background
2. Settings panel opens on right
3. User checks/unchecks "Full Width" checkbox
4. Layout immediately adjusts width

**Technical Flow:**
```
Click layout
    ↓
Click event handler fires
    ↓
setSettingsValues() opens settings panel
    ↓
Populates currSettings with layout data
    ↓
User toggles checkbox (class="layout-width-setup")
    ↓
'change' event listener fires
    ↓
Checks currSettings.fullWidth
    ↓
If true: Sets data-pagemargin="fullwidth"
If false: Sets data-pagemargin="narrow"
    ↓
CSS applies corresponding styles
```

**CSS Effect:**
```css
/* Narrow (default) */
[data-pagemargin="narrow"] .layout-container {
    max-width: 960px;
    margin: 0 auto;
}

/* Full Width */
[data-pagemargin="fullwidth"] .layout-container {
    max-width: 100%;
    padding: 0 20px;
}
```

---

### 4. Delete Widget from Layout

**User Action Flow:**
1. User hovers over widget in layout
2. Toolbar appears
3. User clicks delete icon (trash can)
4. Confirmation modal appears
5. User confirms
6. Widget removed from column

**Technical Flow:**
```
Hover over widget
    ↓
Toolbar div becomes visible
    ↓
Click delete icon
    ↓
deleteWidget() in main controller
    ↓
Shows confirmation modal
    ↓
User confirms
    ↓
Removes widget from DOM
    ↓
Updates fieldData.templateN (removes HTML)
    ↓
Updates savedJson (removes entry or sets to "")
    ↓
Tracks undo/redo
    ↓
Enables save button
```

---

### 5. Reorder Widgets Within Layout

**User Action Flow:**
1. User drags widget within same column
2. Drop indicator line appears
3. User releases
4. Widget moves to new position

**Technical Flow:**
```
Mousedown on widget toolbar
    ↓
ng-drag activates
    ↓
Widget becomes draggable clone
    ↓
Drag over same column
    ↓
Drop position calculated
    ↓
Widget DOM element moved
    ↓
fieldData.templateN updated with new order
    ↓
savedJson updated
```

---

### 6. Settings Panel Interactions

**Opening Settings:**
- Click layout background
- Layout-specific settings appear
- Shows layout name, icon, full-width toggle

**Closing Settings:**
- Click empty drop zone
- Click different element
- Press Escape key
- Click close button

**Available Settings:**
- **Full Width Toggle:** Adjusts page margins
- **Accessibility (commented out):** Alt text for layout (not currently implemented)

---

## Styling and Responsive Design

### Base Layout Styles

**Container:**
```css
.layout-container {
    position: relative;
    width: 100%;
    margin: 0px auto;
    border: 1px dashed #2175d1;  /* Editor mode only */
}
```

**Columns:**
```css
.layout-container .column {
    float: left;
    display: inline;
    position: relative;
    padding: 10px;
}
```

**Column Width Classes:**
```css
/* Layout-1 (Left): 30-70 */
.layout-container .one-third.column { width: 30%; }
.layout-container .two-thirds.column { width: 70%; }

/* Layout-2 (Center): 50-50 */
.layout-container .one-half { width: 50%; }

/* Layout-4 (Four Column): 25-25-25-25 */
.layout-container .one-fourth { width: 25%; }

/* Layout-5 (Three Column): 33-33-33 */
.layout-container .one-by-three { width: 33.33%; }
```

---

### Vertical Dividers

**Visual separator between columns:**
```css
.layout-container .vertical-divider {
    border-right: 1px dashed #2175d1;
    bottom: 0;
    content: " ";
    position: absolute;
    top: 0;
    width: 1px;
    float: left;
    display: inline;
}

/* Positioned based on layout type */
.layout-1 .vertical-divider { left: 30%; }
.layout-2 .vertical-divider { left: 50%; }
.layout-3 .vertical-divider { left: 70%; }
.layout-4 .vertical-divider { left: 100%; }  /* Hidden for 4-col */
.layout-5 .vertical-divider { left: 100%; }  /* Hidden for 3-col */
```

---

### Drop Zone Styling

**Empty State Text:**
```css
.layout-container .empty-droppable-text {
    text-align: center;
    color: #ccc;
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    bottom: 0;
    margin: auto auto;
    height: 200px;
    display: none;  /* Shown when column is empty */
    padding: 20px;
}
```

**Placeholder During Drag:**
```css
.layout-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto auto;
    margin-left: 10px;
    margin-right: 10px;
    height: 75px;
    border: 1px dashed #039423;  /* Green border */
    display: none;
}

/* Show placeholder when dragging over empty column */
.layout-container .drag-enter:empty ~ .layout-placeholder {
    display: block;
}

/* Hide instructions when placeholder shown */
.layout-container .drag-enter:empty ~ .empty-droppable-text {
    display: none;
}
```

---

### Responsive Breakpoints

**Mobile (≤ 586px):**
```css
@media screen and (max-width: 586px) {
    /* All columns become full width */
    .layout-container .one-third.column { width: 100%; }
    .layout-container .two-thirds.column { width: 100%; }
    .layout-container .one-half { width: 100%; }
    .layout-container .one-fourth { width: 100%; }
    .layout-container .one-by-three { width: 100%; }
    
    /* Adjust column padding for vertical stacking */
    .layout-container .column:first-child {
        padding-right: 0px;
        padding-bottom: 10px;
    }
    
    .layout-container .column:last-child {
        padding-left: 0px;
        padding-top: 10px;
    }
}
```

**Mobile View Class (Additional):**
```css
.mobile-view .row-fluid-margin-for-mobile-port .layout-container .one-third.column {
    width: 100%;
}
/* ... similar rules for all column types */
```

**Multi-Column Reader View:**
```css
.readium-multiple-column .layout-container .one-third.column { width: 100%; }
.readium-multiple-column .layout-container .two-thirds.column { width: 100%; }
/* ... columns stack vertically in multi-column view mode */
```

---

### Preview Mode Styling

**Remove Editor-Specific Borders:**
```css
.preview-row-container .main-layout-4-border {
    border: none;
}

.white_center_bg_main .main-layout-4-border {
    border: none;
}

/* Hide authoring-specific padding/margins in reader */
body:not(#myController) .layout-container .authoring-div {
    padding: 0 !important;
    margin: 0 !important;
}
```

---

### Layout-6 Specific Styling

**Question Bank Containers:**
```css
.layout-6 .question-container-box {
    scrollbar-width: thin;
    scrollbar-color: #626262 #F5F5F5;
}

/* Webkit scrollbar styling */
.layout-6 .question-container-box::-webkit-scrollbar {
    width: 5px;
    display: block;
}

.layout-6 .question-container-box::-webkit-scrollbar-track {
    background: #F5F5F5;
}

.layout-6 .question-container-box::-webkit-scrollbar-thumb {
    background: #626262;
}

/* Individual question container */
.layout-6 .question-container {
    position: relative;
    margin-bottom: 15px;
}

/* Minimum height when questions are present */
.layout-6 .questionsAdded .column-content {
    min-height: 231px !important;
}
```

---

### Flexbox Layouts (Layout-4 and Layout-5)

**Equal Height Columns:**
```css
.layout-4.layout-container,
.layout-5.layout-container {
    display: flex;
    flex-wrap: wrap;
}

.layout-4 .column,
.layout-5 .column {
    flex: 1;  /* Equal width distribution */
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.layout-4 .column-content,
.layout-5 .column-content {
    flex-grow: 1;  /* All columns same height */
}
```

---

### Settings Panel Styling

```css
#layout-template-setting .layout-setting-icon {
    font-size: 24px !important;
    display: inline-block;
    width: auto;
    vertical-align: middle;
    color: #1b66b9;
    margin-top: 1px;
}

#layout-template-setting .templateName {
    display: inline-block;
    font-size: 17px;
    height: 25px;
    text-align: left;
    vertical-align: middle;
    margin-top: 0px;
    padding-left: 8px;
    color: #0f3b6b;
}
```

---

### Widget-Specific Adjustments

**Paragraph Select Within Layouts:**
```css
.layout-5 .column-content .paragraph-select .inline-text,
.layout-4 .column-content .paragraph-select .inline-text {
    width: 100px;
}
```

**Template Heading Adjustments:**
```css
.layout-1 .one-third .template-main-heading .single_name,
.layout-3 .one-third .template-main-heading .single_name,
.layout-5 .one-by-three .template-main-heading .single_name {
    font-size: 16px;
    left: 35px;
}
```

**Component-Specific:**
```css
/* Sidebar components in layouts */
.layout-container .sidebarComponent.imageTemplateMainDiv.style4 .sidebarHeaderText {
    padding: unset !important;
}

/* Identify the clip component */
.layout-1 .identifyTheClipComponent .shortAnsText {
    min-width: unset;
}
```

---

## Error Handling

### 1. Drop Validation Errors

**Issue:** User attempts invalid drop operation

**Detection:**
```javascript
if (!data || $(scope.dropElement).children().length !== 0 || 
    !data.isDroppable || isDroppable === 'false' || isPastable == false) {
    // Abort drop
    localStorage.setItem("isDroppable", true);
    localStorage.setItem("isPastable", true);
    return;
}
```

**Causes:**
- Drop zone already contains widget
- Widget is not droppable
- System flags prevent drop
- Invalid data object

**Handling:**
- Silently ignores invalid drop
- Resets localStorage flags
- No error message shown to user
- Original widget remains in place

**Recommendation:** Add visual feedback for failed drops (shake animation, tooltip message)

---

### 2. Missing JSON Data

**Issue:** Widget's JSON configuration file fails to load

**Detection:**
```javascript
TemplateService.getJSONData(data.json).then(function (data1) {
    // Success
}).catch(function (err) {
    console.log(err[0].description);
});
```

**Causes:**
- Incorrect file path in config.js
- Network error
- File doesn't exist
- Permission issues

**Handling:**
- Error logged to console
- Widget appears but without default settings
- May cause runtime errors in widget

**Current Limitation:** No user-facing error message

**Recommendation:** 
- Display error notification to user
- Provide fallback default settings
- Allow retry mechanism

---

### 3. Compilation Errors

**Issue:** Angular fails to compile nested widget HTML

**Detection:**
- Silent failure in `$compile()`
- Widget appears empty or broken

**Causes:**
- Invalid HTML structure in saved data
- Missing required directives
- Syntax errors in templates
- Circular dependencies

**Handling:**
- Widget renders as empty div
- No error message
- Console may show errors

**Debugging:**
```javascript
try {
    currentDroppable.html($compile(content || '')(con));
} catch(e) {
    console.error("Compile error:", e);
    // Could add fallback content here
}
```

**Recommendation:** Add try-catch blocks around compile operations with user feedback

---

### 4. Undo/Redo Tracking Failures

**Issue:** Undo/redo operation doesn't work correctly

**Detection:**
- User notices undo doesn't revert change
- Stack corruption

**Causes:**
- Async timing issues (setTimeout 600ms)
- Missing UUID assignments
- Incorrect parent tracking
- Nested widget complications

**Current Handling:**
```javascript
setTimeout(function() {
    // Track undo/redo after 600ms delay
    con.undo_stack.push({...});
}, 600);
```

**Problem:** Fixed 600ms delay may not be sufficient for complex widgets

**Recommendation:**
- Use promises or callbacks instead of fixed timeout
- Verify operation completion before tracking
- Add error recovery for corrupted undo stack

---

### 5. Copy-Paste Across Pages

**Issue:** Pasted widget loses context or fails

**Causes:**
- localStorage cleared between operations
- Page scope mismatch
- Missing dependencies
- Incompatible layout types

**Current Handling:**
- Checks for data in localStorage
- Returns silently if missing
```javascript
if (!data) {
    return;  // No error message
}
```

**Recommendation:**
- Validate copied data before allowing paste
- Show clear error message if paste fails
- Provide "paste special" option for cross-page/cross-layout pastes

---

### 6. Layout-6 Question Bank Limits

**Issue:** Question bank exceeds 15 items

**Prevention:**
```javascript
if (scope.fieldData.settings.questionBank.length < 15) {
    scope.fieldData.settings.questionBank.push({...});
}
```

**Limitation:** Hard limit of 15 questions per bank

**No User Feedback:** User not notified when limit reached

**Recommendation:**
- Display warning when approaching limit (e.g., at 13/15)
- Show error message when limit reached
- Consider making limit configurable
- Add scroll or pagination for large question sets

---

### 7. Full Width Toggle Race Conditions

**Issue:** Multiple rapid toggles cause inconsistent state

**Causes:**
- No debouncing on checkbox change
- Direct DOM manipulation without Angular digest
- Settings panel may not reflect actual state

**Current Code:**
```javascript
$(element).on('change', '.layout-width-setup', function(){
    // Direct manipulation, no debouncing
    if (!con.currSettings.fullWidth) {
        con.currSettings.fullWidth = true;
        $(el).eq(0).attr('data-pagemargin', 'fullwidth');
    } else {
        con.currSettings.fullWidth = false;
        $(el).eq(0).attr('data-pagemargin', 'narrow');
    }
});
```

**Recommendation:**
- Add debounce to change handler
- Use Angular's two-way binding
- Trigger $scope.$apply() after changes
- Validate state before applying

---

### 8. Memory Leaks

**Potential Issue:** Event listeners not cleaned up

**Risk Areas:**
```javascript
$(element).on('click', function(e){ ... });
$(element).on('change', '.layout-width-setup', function(){ ... });
$(".empty-droppable-text").on("click", function(e){ ... });
```

**No Cleanup:** No corresponding `$scope.$on('$destroy')` handlers to unbind events

**Recommendation:**
```javascript
// Add cleanup
$scope.$on('$destroy', function() {
    $(element).off('click');
    $(element).off('change', '.layout-width-setup');
    $(".empty-droppable-text").off("click");
});
```

---

### 9. XSS Vulnerabilities

**Risk:** User-provided content compiled and executed

**Vulnerable Code:**
```javascript
currentDroppable.html($compile(content || '')(con));
```

**Issue:** If `content` contains malicious scripts, they execute

**Current Mitigation:** AngularJS's $sce service (Strict Contextual Escaping)

**Recommendation:**
- Sanitize HTML before compilation
- Use `$sanitize` service
- Implement Content Security Policy (CSP)
- Validate widget source
```javascript
var sanitizedContent = $sanitize(content);
currentDroppable.html($compile(sanitizedContent)(con));
```

---

### 10. Browser Compatibility

**jQuery Dependencies:** Heavy reliance on jQuery for DOM manipulation

**Potential Issues:**
- Different behaviors across browsers
- Deprecated jQuery methods
- Performance issues in older browsers

**Recommendation:**
- Migrate to AngularJS native DOM manipulation
- Add polyfills for older browsers
- Test thoroughly on target browsers (IE11, Edge, Chrome, Firefox, Safari)

---

## Known Issues

### 1. **First-Time Load Flash**

**Description:**  
When a layout is first added to a page, there's a visible flash as the `first-time-load` class is processed.

**Impact:** Poor user experience, content "pops" into view

**Root Cause:**
```javascript
angular.element(item).children().eq(1).addClass('first-time-load')...
```
Then later:
```javascript
content = content.replace('first-time-load','')
```

**Workaround:** None currently

**Fix Recommendation:**
- Use Angular's `ng-cloak` directive
- Implement CSS transitions
- Pre-render templates before display

---

### 2. **Inconsistent Column Heights in Layout-1, 2, 3**

**Description:**  
In layouts 1, 2, and 3, columns with less content appear shorter than adjacent columns, creating visual imbalance.

**Affected Layouts:** Layout-1, Layout-2, Layout-3

**Not Affected:** Layout-4, Layout-5 (use flexbox with flex-grow: 1)

**Visual Example:**
```
┌─────────┬─────────────────┐
│ Column1 │ Column2         │
│ Short   │ Long content    │
│ Content │ that continues  │
└─────────┤ and continues   │
          │ and continues   │
          │ ...             │
          └─────────────────┘
```

**Recommendation:**
```css
.layout-1.layout-container,
.layout-2.layout-container,
.layout-3.layout-container {
    display: flex;
    flex-wrap: wrap;
}

.layout-1 .column,
.layout-2 .column,
.layout-3 .column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.layout-1 .column-content,
.layout-2 .column-content,
.layout-3 .column-content {
    flex-grow: 1;
}
```

---

### 3. **Undo/Redo Timing Issues**

**Description:**  
The 600ms setTimeout for undo/redo tracking is arbitrary and may not capture state correctly for complex widgets.

**Code:**
```javascript
setTimeout(function() {
    con.undo_stack.push({...});
}, 600);
```

**Issues:**
- Simple widgets: 600ms is excessive
- Complex widgets: 600ms may not be enough
- User actions within 600ms not tracked
- No confirmation that widget is fully initialized

**Recommendation:**
- Use widget initialization callbacks
- Implement promise-based tracking
- Track state immediately, queue async operations

---

### 4. **Layout-6 Shuffle Not Implemented**

**Description:**  
`settings.shuffleQuestionCheckbox` exists in data model and adds CSS class, but actual shuffling logic is not implemented.

**Data Model:**
```json
"shuffleQuestionCheckbox": false
```

**Template:**
```html
<div class="question-container-box" 
     ng-class="fieldData.settings.shuffleQuestionCheckbox ? 'questionShuffleEnable' : ''">
```

**Missing:** JavaScript logic to actually shuffle questionBank array

**Recommendation:**
```javascript
if (scope.fieldData.settings.shuffleQuestionCheckbox) {
    scope.fieldData.settings.questionBank = shuffleArray(
        scope.fieldData.settings.questionBank
    );
    scope.fieldData.settings.questionBank2 = shuffleArray(
        scope.fieldData.settings.questionBank2
    );
}

function shuffleArray(array) {
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

---

### 5. **No Visual Feedback for Drop Errors**

**Description:**  
When a drop operation fails validation, the widget simply doesn't drop with no explanation.

**User Experience:**  
Confusing—user doesn't know why drop failed

**Recommendation:**
- Show temporary tooltip: "This area already contains a widget"
- Add shake animation to invalid drop zone
- Display error message in status bar

**Implementation:**
```javascript
if ($(scope.dropElement).children().length !== 0) {
    // Show error feedback
    $(scope.dropElement).addClass('drop-error');
    setTimeout(() => {
        $(scope.dropElement).removeClass('drop-error');
    }, 1000);
    return;
}
```

```css
.drop-error {
    animation: shake 0.5s;
    border: 2px solid red !important;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
```

---

### 6. **Performance Degradation with Nested Layouts**

**Description:**  
Layouts can be nested within layouts, creating deep hierarchies that slow down rendering and compilation.

**Example:**
```
Page
└── Layout-1
    ├── Layout-2
    │   ├── Widget
    │   └── Layout-3
    │       ├── Widget
    │       └── Widget
    └── Widget
```

**Issues:**
- Exponential compilation time
- High memory usage
- Slow save operations
- Difficult to debug

**Current Limitation:** No depth limit enforced

**Recommendation:**
- Limit nesting depth to 2 or 3 levels
- Show warning when nesting deeply
- Optimize compilation with caching
- Consider virtualizing off-screen content

---

### 7. **Mobile Responsive Issues**

**Description:**  
While columns stack on mobile, some widgets don't adapt well to narrow widths.

**Specific Issues:**
- Images overflow containers
- Tables don't become scrollable
- MCQ options wrap awkwardly
- Video players don't resize

**Current CSS:**
```css
@media screen and (max-width: 586px) {
    .layout-container .one-third.column { width: 100%; }
    /* ... columns stack, but content doesn't adapt */
}
```

**Recommendation:**
- Add overflow handling for images
- Make tables horizontally scrollable
- Stack MCQ options vertically
- Implement responsive video containers

---

### 8. **Accessibility Concerns**

**Missing ARIA Attributes:**
- No `role="region"` on columns
- No `aria-label` for drop zones
- No keyboard navigation for drag-drop
- Screen readers can't identify layout structure

**Keyboard Navigation:**
- Can't drag-drop with keyboard
- No tab order through columns
- No shortcuts for common actions

**Recommendation:**
```html
<div class="column one-third selector" 
     role="region" 
     aria-label="Left column, 30% width">
    <div class="column-content editables" 
         role="group"
         aria-label="Drop zone for widgets"
         tabindex="0">
        ...
    </div>
</div>
```

Implement keyboard shortcuts:
- `Ctrl+C/Ctrl+V` for copy-paste (currently only mouse)
- `Tab` to navigate between columns
- `Enter` to select/activate
- `Delete` to remove selected widget

---

### 9. **localStorage Dependency**

**Description:**  
Copy-paste functionality relies entirely on localStorage, which has limitations:

**Issues:**
- Storage quota limits (5-10MB typically)
- Cleared by user/browser
- Doesn't work in private/incognito mode
- Not shared across tabs
- Large components may not fit

**Current Code:**
```javascript
localStorage.setItem("data", JSON.stringify(data));
localStorage.setItem("copiedComponent", JSON.stringify(copiedComponent));
```

**Recommendation:**
- Use IndexedDB for larger data
- Implement clipboard API for modern browsers
- Add session-based copy-paste as fallback
- Validate storage availability before use

```javascript
function safeCopyToStorage(key, data) {
    try {
        const serialized = JSON.stringify(data);
        if (serialized.length > 5000000) {  // 5MB
            alert("Component too large to copy");
            return false;
        }
        localStorage.setItem(key, serialized);
        return true;
    } catch(e) {
        console.error("Storage error:", e);
        // Fallback to memory-based copy
        window.copiedData = window.copiedData || {};
        window.copiedData[key] = data;
        return true;
    }
}
```

---

### 10. **No Validation for Circular References**

**Description:**  
User can copy a layout and paste it inside itself, creating circular references.

**Example:**
```
Layout-1 (A)
├── Layout-2 (B)
│   └── Layout-1 (A) ← Copy of parent!
│       └── Layout-2 (B) ← Infinite nesting
```

**Issues:**
- Infinite loops during save
- JSON serialization fails
- Application crashes
- Data corruption

**Recommendation:**
```javascript
function isCircularPaste(pasteTarget, copiedElement) {
    // Check if copiedElement is an ancestor of pasteTarget
    let parent = $(pasteTarget).parents('[data-saved-index]');
    parent.each(function() {
        if ($(this).attr('data-saved-index') === 
            copiedElement.savedIndex) {
            return true;  // Circular reference detected
        }
    });
    return false;
}

// In onPasteDropComplete:
if (isCircularPaste(scope.dropElement, copiedComponent)) {
    alert("Cannot paste a layout inside itself");
    return;
}
```

---

## Recommendations

### High Priority Improvements

#### 1. **Implement Flexbox for All Layouts**

**Current State:** Only Layout-4 and Layout-5 use flexbox

**Benefit:** Equal height columns, better responsiveness

**Implementation:**
```css
.layout-container {
    display: flex;
    flex-wrap: wrap;
}

.layout-container .column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.layout-container .column-content {
    flex-grow: 1;
}
```

**Estimated Effort:** 2 hours  
**Impact:** High - improves visual consistency

---

#### 2. **Add Error Notifications**

**Current State:** Silent failures for most errors

**Benefit:** Better user experience, faster debugging

**Implementation:**
```javascript
function showErrorNotification(message, duration = 3000) {
    const notification = $('<div class="error-notification"></div>')
        .text(message)
        .appendTo('body');
    
    setTimeout(() => {
        notification.fadeOut(() => notification.remove());
    }, duration);
}

// Usage:
if (dropValidationFailed) {
    showErrorNotification("Cannot drop widget here: area already occupied");
    return;
}
```

**Estimated Effort:** 4 hours  
**Impact:** High - significantly improves usability

---

#### 3. **Replace setTimeout with Promises**

**Current State:** Fixed 600ms delays for undo/redo

**Benefit:** More reliable state tracking, better performance

**Implementation:**
```javascript
function trackWidgetCreation(widgetElement) {
    return new Promise((resolve) => {
        // Wait for widget directive to initialize
        widgetElement.ready(function() {
            // Wait one more tick for Angular compilation
            $timeout(() => {
                resolve();
            }, 0);
        });
    });
}

// Usage:
trackWidgetCreation(item).then(() => {
    con.undo_stack.push({...});
});
```

**Estimated Effort:** 8 hours  
**Impact:** Medium-High - more reliable, better performance

---

#### 4. **Add Accessibility Features**

**Current State:** Limited keyboard support, no ARIA

**Benefit:** WCAG compliance, better usability

**Priority Actions:**
- Add ARIA roles and labels
- Implement keyboard shortcuts
- Add screen reader announcements
- Improve focus management

**Implementation:**
```html
<div class="column one-third selector" 
     role="region" 
     aria-label="Left column, narrow width"
     tabindex="0">
    
    <div class="column-content editables" 
         role="group"
         aria-label="Drop zone for widgets. Press Enter to paste."
         aria-live="polite"
         tabindex="0"
         onkeydown="handleKeyboardDrop(event)">
    </div>
</div>
```

```javascript
function handleKeyboardDrop(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        scope.pastecomp(event, 'layout');
    }
}
```

**Estimated Effort:** 16 hours  
**Impact:** High - legal compliance, improved accessibility

---

#### 5. **Optimize Performance for Large Pages**

**Current State:** All layouts compile eagerly

**Benefit:** Faster load times, better memory usage

**Strategies:**
- Lazy load off-screen layouts
- Use virtual scrolling for Layout-6
- Cache compiled templates
- Debounce resize events

**Implementation:**
```javascript
// Lazy compilation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Layout entered viewport, compile now
            scope.compileAndAppendHtml(entry.target, scope.fieldData.template1);
            observer.unobserve(entry.target);
        }
    });
});

element.find('.column-content').each(function() {
    observer.observe(this);
});
```

**Estimated Effort:** 12 hours  
**Impact:** Medium - noticeable on large books

---

### Medium Priority Improvements

#### 6. **Add Layout Presets**

**Benefit:** Speed up authoring, ensure consistency

**Features:**
- Pre-populated layout templates (e.g., "Text + Image", "Quiz Bank")
- Save custom templates
- Template library

**Estimated Effort:** 20 hours  
**Impact:** Medium - improves authoring speed

---

#### 7. **Implement Drag-to-Resize Columns**

**Current State:** Fixed column widths per layout type

**Benefit:** More flexibility for authors

**Implementation:**
- Add draggable handles on vertical dividers
- Store custom widths in settings
- Maintain responsive behavior

**Estimated Effort:** 24 hours  
**Impact:** Medium - power user feature

---

#### 8. **Add Visual Grid System**

**Benefit:** Better alignment, consistency

**Features:**
- Optional grid overlay
- Snap-to-grid for widgets
- Baseline grid for text

**Estimated Effort:** 16 hours  
**Impact:** Medium - improves design quality

---

#### 9. **Implement Layout-6 Shuffle**

**Current State:** Checkbox exists but doesn't work

**Benefit:** Complete feature, enable quiz randomization

**Implementation:**
```javascript
scope.shuffleQuestions = function() {
    if (scope.fieldData.settings.shuffleQuestionCheckbox) {
        scope.fieldData.settings.questionBank = 
            fisherYatesShuffle(scope.fieldData.settings.questionBank);
        scope.fieldData.settings.questionBank2 = 
            fisherYatesShuffle(scope.fieldData.settings.questionBank2);
    }
}

function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Call during reader mode initialization
scope.shuffleQuestions();
```

**Estimated Effort:** 4 hours  
**Impact:** Medium - enables quiz features

---

### Low Priority Enhancements

#### 10. **Add Layout Templates Gallery**

**Benefit:** Inspiration, faster authoring

**Features:**
- Visual gallery of layout examples
- Preview before adding
- Category filtering

**Estimated Effort:** 16 hours  
**Impact:** Low - nice-to-have

---

#### 11. **Implement Column Background Colors**

**Benefit:** Visual interest, emphasis

**Implementation:**
- Add color picker to settings panel
- Store per-column colors
- Ensure accessibility (contrast ratios)

**Estimated Effort:** 8 hours  
**Impact:** Low - aesthetic enhancement

---

#### 12. **Add Animation Options**

**Benefit:** Engaging content

**Features:**
- Fade-in, slide-in, zoom effects
- Configure per-layout or per-column
- Reader mode only (not in editor)

**Estimated Effort:** 12 hours  
**Impact:** Low - polish feature

---

### Code Quality Improvements

#### 13. **Refactor to AngularJS 1.6+ Best Practices**

**Current State:** Mix of old patterns, jQuery dependencies

**Actions:**
- Remove jQuery where possible
- Use components instead of directives
- Implement one-way data binding
- Use $onInit lifecycle hooks

**Estimated Effort:** 40 hours  
**Impact:** High - maintainability, performance

---

#### 14. **Add Unit Tests**

**Current State:** No automated tests

**Coverage Targets:**
- Directive logic (onDropComplete, compileAndAppendHtml)
- Data validation
- Error handling
- Edge cases

**Tools:**
- Jasmine for test framework
- Karma for test runner
- PhantomJS for headless browsing

**Estimated Effort:** 32 hours  
**Impact:** High - prevents regressions

---

#### 15. **Migrate to Modern Framework (Long-term)**

**Consideration:** AngularJS reached end-of-life

**Options:**
- Angular (2+)
- React
- Vue.js

**Estimated Effort:** 200+ hours  
**Impact:** Critical - future-proofing

---

## Conclusion

The **Layout Component** is a foundational system for content organization in KITABOO Authoring. It provides flexible, multi-column structures supporting drag-drop, copy-paste, and nested widgets. While functional, the component has technical debt, accessibility gaps, and performance opportunities.

**Key Strengths:**
- Flexible column layouts (6 types)
- Drag-and-drop integration
- Copy-paste support
- Responsive design foundation
- Extensible architecture

**Critical Improvements Needed:**
1. Error handling and user feedback
2. Accessibility enhancements
3. Performance optimization
4. Code modernization
5. Comprehensive testing

**Next Steps:**
1. Prioritize high-impact fixes (error notifications, flexbox)
2. Address accessibility for compliance
3. Plan framework migration timeline
4. Implement testing infrastructure
5. Document API for future developers

This documentation serves as a comprehensive reference for developers maintaining or enhancing the layout system.

---

## Appendix A: File Reference

| File Path | Purpose | Lines of Code |
|-----------|---------|---------------|
| `templates/layouts/layout1.html` | Left layout (30-70) | 50 |
| `templates/layouts/layout2.html` | Center layout (50-50) | 50 |
| `templates/layouts/layout3.html` | Right layout (70-30) | 52 |
| `templates/layouts/layout4.html` | Four column layout | 106 |
| `templates/layouts/layout5.html` | Three column layout | 81 |
| `templates/layouts/layout6.html` | Custom center with questions | 60 |
| `templates/layouts/scripts/layout-directive.js` | Main directive logic | 301 |
| `templates/layouts/styles/layout-template.css` | All layout styles | 366 |
| `templates/layouts/default/layout.json` | Default data model | 32 |
| `templates/layouts/layout-setting-panel.html` | Settings UI | 30 |
| `config/config.js` | Layout type definitions | (within 5028 total) |
| `editor/services.js` | TemplateService | 308 |
| `editor/ngcontroller.js` | Main controller with findTag | 20966 |

---

## Appendix B: Configuration Reference

### config.js Layout Definitions

```javascript
{
  title: "Layout",
  isCollapsed: true,
  widget: [
    {
      name: "Left",
      icon: "Ҍ",
      iconClass: "icon-Page_Layout_Left",
      dataType: "layout-1",
      url: "templates/layouts/layout1.html",
      json: "templates/layouts/default/layout.json",
      settingsURL: "templates/layouts/layout-setting-panel.html",
      preview: { imgURL: "templates/preview/layout-left-popup.png" }
    },
    // ... similar for layout-2 through layout-6
  ]
}
```

---

## Appendix C: API Reference

### Scope Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `compileAndAppendHtml` | (dropZone, htmlContent) | void | Compiles and inserts HTML into column |
| `onDropComplete` | (index, data, evt, boxNo) | void | Handles widget drop |
| `onPasteDropComplete` | (evt) | void | Handles paste operation |
| `pastecomp` | (event, type) | void | Orchestrates paste |

### Controller Functions (accessed via con)

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `findTag` | (data, isCustom, paraValue, jsonData) | DOM Element | Creates widget element |
| `addAttr` | (data, isCustom, paraValue, jsonData) | DOM Element | Adds attributes and structure |
| `setSettingsValues` | (target, type) | void | Opens settings panel |
| `closeSetting` | () | void | Closes settings panel |
| `componentPaste` | (event, type) | void | Handles copy-paste |


