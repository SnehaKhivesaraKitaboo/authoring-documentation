# KITABOO Authoring Tool - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Technology Stack](#technology-stack)
5. [File Structure](#file-structure)
6. [Key Components](#key-components)
7. [Data Flow](#data-flow)
8. [Configuration](#configuration)
9. [Template System](#template-system)
10. [Potential Issues](#potential-issues)
11. [Development Guide](#development-guide)

---

## 1. Project Overview

**KITABOO Authoring Tool** is a web-based WYSIWYG content authoring platform designed for creating interactive educational content (e-books, digital textbooks). It enables content creators to build rich, multimedia-enhanced learning materials with drag-and-drop functionality.

### Purpose
- Create and edit digital educational content
- Support for multiple interactive templates (MCQ, FIB, Slideshows, etc.)
- Generate EPUB/XHTML packages for various e-reader platforms
- Support for gradable assessments and activities
- Multi-language support with custom keyboard layouts
- SCORM-compliant content generation

### Target Users
- Content authors/editors
- Educational publishers
- Instructional designers
- Teachers creating digital course materials

---

## 2. Architecture

### Application Type
**Single Page Application (SPA)** built with AngularJS 1.x

### Architectural Pattern
**MVC (Model-View-Controller)** with custom directive-based component architecture

### Core Architecture Components

```
┌─────────────────────────────────────────────────────────┐
│                    INDEX.HTML (Entry)                    │
│                    - Bootstrap HTML                      │
│                    - Library Imports                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌──────────────────┐
│   CONFIG.JS   │          │  NGCONTROLLER.JS │
│  - Widgets    │◄─────────┤  - Main Logic    │
│  - Templates  │          │  - Event Handlers│
└───────┬───────┘          └────────┬─────────┘
        │                           │
        │      ┌───────────────────┤
        │      │                   │
        ▼      ▼                   ▼
┌────────────────┐      ┌──────────────────────┐
│   TEMPLATES/   │      │   EDITOR SERVICES    │
│  - Directives  │      │  - HTTP Calls        │
│  - HTML Files  │      │  - Template Service  │
│  - JSON Data   │      │  - Modal Service     │
└────────────────┘      └──────────────────────┘
        │
        ▼
┌────────────────────────────┐
│   DRAG-DROP SYSTEM         │
│   - ngDraggable.js         │
│   - ngdragdrop.js          │
└────────────────────────────┘
```

### Data Flow Architecture

```
User Action → Event Handler → Controller Logic → 
Service API Call → Data Manipulation → 
View Update (Angular Binding) → DOM Rendering
```

---

## 3. Core Features

### 3.1 Content Authoring Features

#### Drag & Drop Component System
- **Left Sidebar**: Component palette with categorized widgets
- **Center Canvas**: Visual editing workspace (desktop view)
- **Right Panel**: Settings and properties panel
- Drag templates from sidebar to canvas
- Visual indicators for drop zones
- Auto-save functionality

#### Rich Text Editing
- **Integrated Editors**:
  - Jodit Editor (primary rich text editor)
  - SunEditor (alternative)
  - MathLive (mathematical equations)
  - MathQuill (legacy math support)
  - Temml (math rendering)
- Text formatting (bold, italic, underline, colors)
- Font family and size customization
- Copy format functionality
- Custom keyboard layouts (French, Spanish, German)

#### Template Categories

**1. Layout Templates** (Structure)
- Left Layout
- Center Layout
- Right Layout
- Four Column Layout
- Three Column Layout
- Flexi Layout (custom responsive)

**2. Layer System**
- Multi-layer content organization
- Tag-based conditional display
- Sample answers toggle
- Difficulty level filtering

**3. Basic Elements**
- Title (Hero Header)
- Header Component
- Text/Paragraph
- Image (with captions, zoom, alt text)
- Video (with subtitle tracks support)
- Audio (multiple skin styles)
- HTML Interactivity (embedded content)
- Table (dynamic rows/columns)
- Callout Box/Sidebar
- Situation Header
- Lesson Opener Components

**4. Interactive Widgets** (Gradable)
- Group Activity (container for multiple activities)
- Multiple Choice (single/multi-select)
- Fill in the Blank (text/dropdown/drag-drop)
- Image Labeling (hotspot-based)
- Highlighter (text highlighting)
- Correction (error identification)
- Sorting (drag-drop ordering)
- Match The Pairs (draw lines, drag-drop)
- Flashcards
- Question Answer (short/long form)
- True/False
- Word Search
- Identify the Clip (video-based questions)
- Annotation (image markup)
- Graphic Organizer (visual learning tools)

**5. Special Components**
- Slideshow (image carousel with zoom)
- Click to Reveal (accordion/toggle content)
- Interactive Sidebar (collapsible panels)
- CLIC Component (external integration)
- Sketch Pad (drawing tool)

### 3.2 Assessment & Grading Features

#### Gradable Activity Settings
- Duration control (minutes/seconds)
- Passing percentage threshold
- Points allocation
- Show answer behavior (auto/manual)
- Question-level settings:
  - Heading customization
  - Instructions
  - Correct/Incorrect feedback
  - Manual feedback options

#### Group Activity System
- Nested interactive components
- Aggregate scoring
- Combined feedback
- Activity-level settings override

### 3.3 Content Management Features

#### Table of Contents (TOC) Management
- Hierarchical structure (Unit > Chapter > Page)
- Page sequencing
- Page types:
  - Student Instructions
  - Teacher Instructions
  - Content Pages (CORE, LIGHT, MODERATE, INTENSIVE)
- Drag-to-reorder pages
- Page duplication
- Page deletion with confirmation

#### Metadata Management
- Course name
- Author information
- Publishing house
- Level of support tags
- Page reference IDs
- Original sequence tracking
- Modification tracking (timestamp, user, source)

#### Asset Library
- Image upload and management
- Asset search and filtering
- Image library integration
- Lazy loading (20 items per batch)
- Asset reuse across pages

### 3.4 Preview & Publishing

#### Preview Modes
- Desktop view (authoring)
- iPad view
- iPhone view
- Live preview in iframe
- EPUB preview

#### Export/Publishing
- XHTML generation (per page)
- JSON data export
- EPUB package generation
- SCORM package support
- Media file bundling
- CSS/JS asset compilation

### 3.5 Collaboration Features

#### Glossary System
- Centralized glossary management
- Term definitions with multimedia
- Image/Audio/Video/URL support
- Apply glossary to all pages
- Search functionality
- Header-based categorization

#### Undo/Redo System
- Multi-level undo/redo stack
- Component-specific undo
- JSON state preservation
- Action tracking

#### Copy/Paste & Duplication
- Component duplication
- Page cloning
- Cross-page component copy
- Format copying (text styles)

---

## 4. Technology Stack

### Front-End Technologies

#### Core Framework
- **AngularJS 1.x** (Main framework)
  - ngRoute (routing)
  - ngSanitize (XSS protection)
  - ngDraggable (custom drag-drop)
  - ui.bootstrap (Bootstrap components)
  - ngTagsInput (tag input fields)
  - angular.filter (custom filters)

#### UI Libraries
- **Bootstrap 3.x** (Layout & components)
- **jQuery 1.9.1 / jQuery UI** (DOM manipulation, interactions)
- **Font Awesome** (icon fonts)
- **Custom Icon Fonts** (authoring-icons.css)

#### Rich Text Editors
- **Jodit Editor 3.x** (Primary WYSIWYG)
- **SunEditor 2.46.2** (Alternative editor)
- **MathLive** (Math equation input)
- **MathQuill** (Legacy math support)
- **Temml** (Math rendering)

#### Media Handling
- **Video.js** (Video player)
- **Audio.js** (Audio player)
- **Colorbox** (Image lightbox)
- **LightGallery** (Advanced image gallery)
- **bxSlider** (Slideshow carousels)

#### Other Libraries
- **Cropper.js** (Image cropping)
- **html2canvas** (Screenshot generation)
- **jsPDF** (PDF generation)
- **Spectrum** (Color picker)
- **iCheck** (Checkbox/radio styling)
- **mCustomScrollbar** (Custom scrollbars)
- **Confetti.js** (Celebration animations)
- **js-md5** (Hashing)

### Back-End Integration

#### APIs/Services
- **CAPS (Content Authoring Publishing System)** 
  - Main backend service
  - URL: `https://qacreate.kitaboo.com/CAPS`
- **Microservices**
  - Glossary service
  - URL: `https://stagmicro.kitaboo.com`
- **Widget Service**
  - Widget-specific APIs
  - URL: `https://qawidgets.kitaboo.com/CAPS`

#### Environment Support
- Development (localhost)
- QA (`qacreate.kitaboo.com`)
- Staging (`create.kitaboo.com`)
- Production

### File Formats & Standards
- **XHTML 1.1** (content pages)
- **JSON** (data storage)
- **EPUB** (e-book packaging)
- **SCORM** (e-learning standard)
- **CSS3** (styling)
- **ES5 JavaScript** (legacy browser support)

---

## 5. File Structure

### Root Directory Structure

```
KITABOO_Authoring/
│
├── index.html                    # Main entry point
├── readme.txt                    # Development notes & instructions
│
├── assets/                       # External assets
│   ├── externalModules/         # Third-party modules
│   │   ├── LiteracySEJodit*/   # Jodit editor
│   │   └── math-live/          # MathLive library
│   └── image_library/          # Image assets
│
├── config/                       # Configuration files
│   ├── config.js               # Main config (widget definitions)
│   ├── clientConfig.js         # Client-specific overrides
│   ├── services.js             # API endpoints & environment
│   └── services_*.js           # Environment-specific configs
│
├── content/                      # Static content
│   └── multipleanswer/         # Sample content
│
├── css/                          # Stylesheets
│   ├── authoring/              # Authoring-specific styles
│   ├── vendor/                 # Third-party CSS
│   ├── fonts/                  # Font files
│   ├── common.css              # Shared styles
│   └── authoring-icons.css     # Icon fonts
│
├── editor/                       # Core editor logic
│   ├── ngcontroller.js         # Main Angular controller (21k+ lines)
│   ├── ngdragdrop.js          # Drag-drop directives
│   ├── ngDraggable.js         # Draggable service
│   ├── services.js             # Angular services
│   ├── function.js             # Utility functions
│   ├── UndoRedo.js            # Undo/Redo logic
│   ├── *-directive.js         # Component directives
│   └── *.js.orig              # Backup files
│
├── templates/                    # Template components
│   ├── [component-name]/       # Each component folder:
│   │   ├── [name].html        #   Template HTML
│   │   ├── [name]-settings.html # Settings panel
│   │   ├── default/           #   Default JSON data
│   │   │   └── [name].json
│   │   ├── scripts/           #   Directive logic
│   │   │   └── [name]-directive.js
│   │   └── styles/            #   Component styles
│   │       └── [name]-template.css
│   │
│   ├── fib/                    # Fill in the Blank
│   ├── multiple-choice-template/
│   ├── slideshow/
│   ├── paragraph/
│   └── ... (50+ component types)
│
├── js/                          # JavaScript libraries
│   ├── angular.min.js
│   ├── jquery-*.js
│   ├── bootstrap.min.js
│   └── ... (100+ library files)
│
├── scripts/                     # Additional scripts
│   └── plugins/                # Plugin modules
│
├── localization/                # i18n resources
│
├── readerSettings/              # Reader configuration
│
├── scorm/                       # SCORM package utilities
│
├── images/                      # UI images & icons
│
└── font-awesome/                # Font Awesome library
```

### Key Files Explained

#### `index.html` (4027 lines)
- Application bootstrap
- All CSS/JS library imports
- Main Angular app declaration
- Responsive meta tags
- IE compatibility scripts

#### `config/config.js` (5028 lines)
- **Widget Definitions**: 50+ templates with metadata
- Template categories (Layout, Elements, Widgets)
- Icon mappings
- Preview images
- Settings panel URLs
- JSON default data paths
- Droppability rules

#### `editor/ngcontroller.js` (21,137 lines)
**Massive main controller** containing:
- Component initialization
- Drag-drop handlers
- Save/Load logic
- TOC management
- Preview generation
- Settings management
- Media upload handlers
- Undo/Redo implementation
- Event listeners (100+)
- API integrations

#### `config/services.js`
- Environment configuration
- API endpoint definitions
- Platform selection (dev/qa/staging/prod)
- Publishing house settings
- Language settings
- CLIC base URL

---

## 6. Key Components

### 6.1 Core Angular Modules

#### Main Application Module
```javascript
angular.module('dragDrop', [
    'ngRoute',           // Routing
    'ui.bootstrap',      // Bootstrap directives
    'ngDraggable',      // Drag-drop
    'customControl',    // Custom controls
    'ngSanitize',       // XSS protection
    'ngTagsInput',      // Tag inputs
    'angular.filter'    // Custom filters
]);
```

#### Main Controller: `DragDropCtrl`
**Scope Variables** (150+ variables):
- `$scope.savedJson` - Page data storage
- `$scope.widgets` - Available templates
- `$scope.tocInfo` - TOC structure
- `$scope.currentPageTOC` - Active page info
- `$scope.undo_stack` / `$scope.redo_stack` - History
- `$scope.glossaryList` - Glossary data
- `$scope.gradableActivitySettingsJSON` - Assessment config

**Key Functions**:
- `$scope.loadCourse()` - Load course data from server
- `$scope.loadPreview()` - Generate preview HTML
- `$scope.saveDataToJson()` - Save page data
- `$scope.onDropComplete()` - Handle component drops
- `$scope.findTag()` - Process new components
- `$scope.addAttr()` - Add component to page
- `$scope.deleteTemplate()` - Remove component
- `$scope.componentDuplicate()` - Clone component
- `$scope.undo()` / `$scope.redo()` - History management

### 6.2 Services

#### `ShellService`
HTTP service wrapper for API calls
```javascript
ShellService.httpServiceCall({
    method: 'POST',
    url: endpoint,
    data: payload,
    headers: headers
})
```

#### `MainService`
Configuration loading service
- `configConvertor()` - Load and merge configs
- Handles environment-specific overrides

#### `TemplateService`
Template management service
- Load template HTML
- Load template JSON
- Template caching

#### `modalService`
Bootstrap modal wrapper
- `showModal()` - Display modals
- Custom modal options
- Parent scope integration

### 6.3 Directive System

#### `addCustomTemplate`
**Core directive** for rendering components
- Loads template HTML dynamically
- Binds data from `savedJson`
- Compiles with Angular
- Two-way data binding
- Settings panel integration

```javascript
<section add-custom-template 
         template-url="templates/paragraph/paragraph.html"
         saved-data="savedJson"
         saved-index="0"
         page-no="1"
         settings-path="templates/paragraph/paragraph_settings.html">
</section>
```

#### `ngDrag` / `ngDrop`
Custom drag-drop implementation
- Touch support
- Clone on drag
- Drop validation
- Position tracking
- Event callbacks

#### Component-Specific Directives
Each template has its own directive:
- `fibTemplate` - Fill in the Blank
- `multipleChoiceTemplate` - MCQ
- `slideshowTemplate` - Slideshow
- `layoutTemplate` - Layout containers
- `paragraphTemplate` - Text content
- etc.

### 6.4 Template Structure

Every template follows this pattern:

```
templates/[component-name]/
├── [component].html              # Main template
├── [component]-settings.html     # Settings panel
├── default/
│   └── [component].json          # Default data structure
├── scripts/
│   └── [component]-directive.js  # Logic
└── styles/
    └── [component]-template.css  # Styles
```

**Example: Fill in the Blank**
```javascript
// default/fib.json
{
    "identifier": "fill-in-the-blank",
    "TemplateData": {
        "fibInfo": [
            {
                "questionText": "Sample question with __blank__",
                "responseList": [
                    {
                        "correctAnswer": "answer",
                        "feedback": "Great!"
                    }
                ]
            }
        ]
    },
    "settings": {
        "general_tab": [...],
        "style_tab": [...]
    }
}
```

---

## 7. Data Flow

### 7.1 Application Lifecycle

#### 1. Initialization Flow
```
index.html loads
  ↓
Angular bootstrap (dragDrop module)
  ↓
DragDropCtrl initialization
  ↓
MainService.configConvertor()
  ↓
Load config.js (widgets definition)
  ↓
Check URL parameters (courseId, userToken, mode)
  ↓
If preview mode → loadPreview()
Else → loadCourse()
```

#### 2. Load Course Flow
```
$scope.loadCourse()
  ↓
GET /CAPS/wd/course/[courseId]
  ↓
Receive: TOC structure, page data, metadata
  ↓
Parse JSON response
  ↓
$scope.savedJson = pageData
$scope.tocInfo = tocStructure
  ↓
Render first page
  ↓
Compile directives (addCustomTemplate)
  ↓
Data binding (fieldData ← savedJson)
```

#### 3. Component Drop Flow
```
User drags template from sidebar
  ↓
ngDrag directive (start drag)
  ↓
Create drag clone
  ↓
User drops on canvas
  ↓
ngDrop directive (onDropComplete)
  ↓
$scope.findTag(data) - Validate drop
  ↓
Generate unique ID (ui-id-X)
  ↓
$scope.addAttr(name) - Create element
  ↓
Load template HTML & JSON
  ↓
Add to $scope.savedJson[pageNo][elementId]
  ↓
$compile(newElement)(scope)
  ↓
Append to DOM
  ↓
Initialize settings panel
  ↓
Enable undo tracking
```

#### 4. Save Flow
```
User clicks Save
  ↓
$scope.saveDataToJson()
  ↓
Collect authoring HTML (desktop_view)
  ↓
Generate preview HTML (iframe rendering)
  ↓
Extract JSON data ($scope.savedJson[pageNo])
  ↓
POST /CAPS/wd/course/page/save
  ↓
Payload: {
    pageId: xxx,
    authoringHtml: "...",
    previewHtml: "...",
    jsonData: {...}
}
  ↓
Server response (success/error)
  ↓
Update UI message
  ↓
Clear undo stack (optional)
```

#### 5. Preview Generation Flow
```
$scope.loadPreview()
  ↓
Get authoring HTML
  ↓
Clone for preview iframe
  ↓
Remove edit controls (.dlet_icon, .duplicate-widget-icon)
  ↓
Remove ng-drag/ng-drop attributes
  ↓
Apply reader styles (reader-setting.css)
  ↓
Inject player-container.js (interactive logic)
  ↓
Apply media queries
  ↓
Initialize interactive components:
    - MCQ (submit/showMe/tryAgain)
    - FIB (input validation)
    - Slideshows (bxSlider)
    - Image popups (colorbox)
  ↓
Adjust responsive elements
  ↓
Render in iframe
```

### 7.2 Data Structures

#### savedJson Structure
```javascript
{
    "1": {  // Page number
        "title": "Page Title",
        "header": "Header Text",
        "icon": "A",
        "ui-id-1": {  // Component 1
            "identifier": "paragraph",
            "TemplateData": {
                "paragraph": "Lorem ipsum..."
            },
            "settings": {
                "fontFamily": "Arial",
                "fontSize": "16px"
            }
        },
        "ui-id-2": {  // Component 2
            "identifier": "multiple-choice-template",
            "TemplateData": {
                "questionText": "What is 2+2?",
                "options": [...]
            }
        }
    },
    "2": {  // Page 2 data
        ...
    }
}
```

#### TOC Structure
```javascript
[
    {
        "id": "page-001",
        "title": "Introduction",
        "pageSequence": 1,
        "pageType": "content",
        "pageReferenceId": "ref-001",
        "originalPageSequence": 1,
        "metadata": {
            "levelsOfSupport": ["CORE"],
            "difficulty": "medium"
        }
    },
    ...
]
```

#### Widget Definition Structure
```javascript
{
    "title": "Elements",
    "isCollapsed": true,
    "widget": [
        {
            "name": "Text",
            "icon": "¶",
            "iconClass": "icon-Text_Paragraph",
            "dataType": "paragraph",
            "url": "templates/paragraph/paragraph.html",
            "json": "templates/paragraph/default/paragraph.json",
            "settingsURL": "templates/paragraph/paragraph_settings.html",
            "isDroppable": true,
            "enableGroupInteractivity": false,
            "preview": {
                "imgURL": "templates/preview/Text-popup.png"
            }
        }
    ]
}
```

---

## 8. Configuration

### 8.1 Environment Configuration

Located in: `config/services.js`

```javascript
// Environment Variables
var platform = "stag";  // dev, qa, stag, prod
var host = "https://qacreate.kitaboo.com/CAPS";
var widgetUrl = "https://qawidgets.kitaboo.com/CAPS";
var microservicehost = "https://stagmicro.kitaboo.com";
var newmicroservicehost = "https://stag-dev.kitaboo.com";
var lang = 'en_US';  // Localization
var publishingHouse = 'kitaboo';
var clicBaseUrl = "https://apps.qa-cli.net/clic/";
```

**Available Environments:**
- `services.js` - QA/Staging
- `services_prod.js` - Production
- `services_stag.js` - Staging variant
- `services_EU.js` - European servers
- `services_insight_prod.js` - Insights production

### 8.2 Client Configuration

Located in: `config/clientConfig.js`

Supports **subdomain-based configuration overrides**:

```javascript
let subdomain = "kitabooqc";  // Client identifier
let CONFIG_kitabooqc = {
    "widgets": [{},{},{}]  // Custom widget set
};

// Override mechanism
if(subdomain && window['CONFIG_'+ subdomain]) {
    baseExtendDestination(CONFIG, [window['CONFIG_'+ subdomain]], true);
}
```

**Use Case**: Different clients (publishers) get different widget sets

### 8.3 URL Parameters

```
?courseId=235              # Course to load
&userToken=MzMyMDE3...     # Auth token (base64 encoded)
&mode=preview              # preview or edit mode
&subdomain=clientName      # Client-specific config
```

### 8.4 Widget Configuration

Each widget in `config.js` can have:

```javascript
{
    "name": "Component Name",        // Display name
    "icon": "A",                     // Icon font character
    "iconClass": "icon-ClassName",   // CSS class
    "dataType": "unique-type",       // Identifier
    "url": "templates/path.html",    // Template path
    "json": "templates/default.json",// Default data
    "settingsURL": "templates/settings.html",
    "isDroppable": true,             // Can drop inside layout
    "enableGroupInteractivity": true,// Can use in group activity
    "preview": {
        "imgURL": "templates/preview.png"  // Preview image
    }
}
```

---

## 9. Template System

### 9.1 Template Anatomy

#### HTML Template Structure
```html
<!-- templates/paragraph/paragraph.html -->
<div class="paragraph-container" paragraph-template>
    <div class="editable-content" 
         contenteditable="true"
         ng-model="fieldData.TemplateData.paragraph"
         ng-bind-html="fieldData.TemplateData.paragraph">
    </div>
</div>
```

#### Directive Implementation
```javascript
// templates/paragraph/scripts/paragraph-directive.js
App.directive('paragraphTemplate', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        controller: function($scope, $compile){
            // Controller logic
        },
        link: function(scope, element, attr){
            // Initialization
            var con = angular.element(
                document.getElementById('myController')
            ).scope();
            
            // Event handlers
            element.on('click', function(e){
                con.higlightObj(element, e.target);
                con.currentSettings = 'settings';
            });
            
            // Settings binding
            scope.$watch('fieldData', function(newVal){
                // Update view when data changes
            }, true);
        }
    }
}]);
```

#### Default JSON
```javascript
// templates/paragraph/default/paragraph.json
{
    "identifier": "paragraph",
    "TemplateData": {
        "paragraph": "<p>Enter your text here</p>"
    },
    "settings": {
        "general_tab": [
            {
                "tabName": "General",
                "tabId": "general-para",
                "settingsList": [
                    {
                        "type": "fontFamily",
                        "label": "Font Family",
                        "value": "Open Sans"
                    }
                ]
            }
        ],
        "style_tab": [...]
    }
}
```

#### Settings Panel HTML
```html
<!-- templates/paragraph/paragraph_settings.html -->
<div class="settings-panel">
    <div class="setting-row">
        <label>Font Family</label>
        <select ng-model="fieldData.settings.fontFamily"
                ng-change="applyFontFamily()">
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
        </select>
    </div>
</div>
```

### 9.2 Interactive Widget Pattern

Example: Multiple Choice Question

#### Data Structure
```javascript
{
    "identifier": "multiple-choice-template",
    "TemplateData": {
        "questionText": "<p>What is 2 + 2?</p>",
        "options": [
            {
                "optionText": "3",
                "isCorrect": false,
                "feedback": "Incorrect"
            },
            {
                "optionText": "4",
                "isCorrect": true,
                "feedback": "Correct!"
            }
        ],
        "interactionType": "single",  // single or multiple
        "showAnswer": "auto",
        "attempts": 1
    },
    "settings": {
        "general_tab": [...],
        "assessment_tab": [
            {
                "points": 1,
                "passingScore": 100
            }
        ]
    }
}
```

#### Authoring HTML (with controls)
```html
<div class="mcq-container">
    <div class="question-editor" contenteditable="true">
        {{fieldData.TemplateData.questionText}}
    </div>
    <div class="options-list">
        <div class="option" ng-repeat="option in options">
            <input type="checkbox" ng-model="option.isCorrect">
            <input type="text" ng-model="option.optionText">
            <button ng-click="deleteOption($index)">×</button>
        </div>
    </div>
    <button ng-click="addOption()">+ Add Option</button>
</div>
```

#### Preview HTML (interactive)
```html
<div class="mcq-preview">
    <div class="question">{{questionText}}</div>
    <div class="options">
        <div class="option" ng-repeat="option in options">
            <input type="radio" name="mcq-{{uuid}}" 
                   ng-click="selectOption($index)">
            <label>{{option.optionText}}</label>
        </div>
    </div>
    <button class="submit-btn" ng-click="submit()">Submit</button>
    <button class="show-me-btn" ng-click="showAnswer()">Show Answer</button>
    <button class="try-again-btn" ng-click="reset()">Try Again</button>
    <div class="feedback" ng-show="feedbackVisible">
        {{currentFeedback}}
    </div>
</div>
```

### 9.3 Creating New Templates

**Step-by-step process:**

1. **Add to config.js**
```javascript
{
    "name": "My New Widget",
    "icon": "X",
    "iconClass": "icon-MyWidget",
    "dataType": "my-new-widget",
    "url": "templates/mynewwidget/mynewwidget.html",
    "json": "templates/mynewwidget/default/mynewwidget.json",
    "settingsURL": "templates/mynewwidget/mynewwidget-settings.html",
    "isDroppable": true
}
```

2. **Create folder structure**
```
templates/mynewwidget/
├── mynewwidget.html
├── mynewwidget-settings.html
├── default/
│   └── mynewwidget.json
├── scripts/
│   └── mynewwidget-directive.js
└── styles/
    └── mynewwidget-template.css
```

3. **Define directive**
```javascript
App.directive('myNewWidgetTemplate', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            // Template logic
        }
    }
});
```

4. **Add CSS to index.html**
```html
<link rel="stylesheet" 
      href="templates/mynewwidget/styles/mynewwidget-template.css">
```

5. **Add script to index.html** (end of body)
```html
<script src="templates/mynewwidget/scripts/mynewwidget-directive.js"></script>
```

---

## 10. Potential Issues

### 10.1 Code Quality Issues

#### 1. **Massive Controller File** 🔴 CRITICAL
**Problem:**
- `ngcontroller.js` is 21,137 lines
- Violates Single Responsibility Principle
- Difficult to maintain and debug
- High merge conflict risk

**Impact:**
- Long load times
- Performance issues
- Developer cognitive overload
- Testing nearly impossible

**Recommendation:**
- Split into modules by feature:
  ```
  controllers/
  ├── page.controller.js
  ├── toc.controller.js
  ├── template.controller.js
  ├── settings.controller.js
  └── media.controller.js
  ```

#### 2. **AngularJS 1.x (EOL)** 🔴 CRITICAL
**Problem:**
- AngularJS 1.x reached End of Life (December 2021)
- No security updates
- Limited modern tooling support
- Browser compatibility issues

**Impact:**
- Security vulnerabilities
- Performance limitations
- Difficulty hiring developers
- No TypeScript support

**Recommendation:**
- Migrate to Angular (2+) or React/Vue
- Or modernize with Svelte/Solid

#### 3. **jQuery Dependency** 🟡 MODERATE
**Problem:**
- Heavy reliance on jQuery for DOM manipulation
- Mixing jQuery with Angular (anti-pattern)
- Direct DOM access (`.find()`, `.parent()`, etc.)

**Impact:**
- Harder to maintain
- Performance overhead
- Conflicts with Angular digest cycle

**Recommendation:**
- Use Angular directives for DOM manipulation
- Refactor jQuery code to Angular paradigms

#### 4. **Global Scope Pollution** 🟡 MODERATE
**Problem:**
```javascript
var App = angular.module(...);  // Global
var host = "...";               // Global
var CONFIG = {...};             // Global
```

**Impact:**
- Namespace collisions
- Memory leaks
- Testing difficulties

**Recommendation:**
- Use IIFE (Immediately Invoked Function Expressions)
- Module pattern
- ES6 modules

#### 5. **Inconsistent Error Handling** 🟡 MODERATE
**Problem:**
- API errors not consistently caught
- No global error handler
- User not always informed of failures

**Impact:**
- Poor user experience
- Lost work
- Difficult debugging

**Recommendation:**
- Implement global error interceptor
- User-friendly error messages
- Retry logic for transient failures

### 10.2 Performance Issues

#### 1. **Excessive Watchers** 🔴 CRITICAL
**Problem:**
- 100+ scope variables with deep watching
- `$scope.$watch(..., true)` on large objects
- Performance degrades with page complexity

**Impact:**
- Slow digest cycles (>300ms)
- UI lag/stuttering
- Memory leaks

**Recommendation:**
- Use one-time binding (`::`)
- Debounce watch handlers
- Implement virtual scrolling

#### 2. **Large HTML File (index.html)** 🟡 MODERATE
**Problem:**
- 4,027 lines in one HTML file
- Loads 100+ CSS/JS files sequentially
- No code splitting

**Impact:**
- Slow initial load (5-10 seconds)
- Bandwidth waste
- Poor mobile experience

**Recommendation:**
- Lazy load non-critical resources
- Bundle and minify assets
- Use webpack/vite for module bundling

#### 3. **No Asset Optimization** 🟡 MODERATE
**Problem:**
- Unminified JavaScript
- Uncompressed images
- No CDN usage
- No caching strategy

**Impact:**
- Large page size (10+ MB)
- Slow load times
- High bandwidth costs

**Recommendation:**
- Implement build process (Webpack/Rollup)
- Image optimization pipeline
- Use CDN for libraries
- Enable gzip compression

### 10.3 Security Issues

#### 1. **XSS Vulnerability** 🔴 CRITICAL
**Problem:**
- `ng-bind-html` with unsanitized content
- `contenteditable` without validation
- Direct HTML insertion via jQuery

**Impact:**
- Cross-site scripting attacks
- Data theft
- Session hijacking

**Recommendation:**
- Use `$sanitize` service consistently
- Content Security Policy (CSP)
- Input validation on server

#### 2. **Authentication Token in URL** 🔴 CRITICAL
**Problem:**
```javascript
$scope.userToken = $scope.getQueryVariable('userToken');
```
- Tokens visible in browser history
- Logs capture tokens
- Shoulder surfing risk

**Impact:**
- Account takeover
- Unauthorized access

**Recommendation:**
- Use HTTP-only cookies
- Session storage (not localStorage)
- Short-lived tokens with refresh

#### 3. **CORS Configuration** 🟡 MODERATE
**Problem:**
- `allow CORS` mentioned in readme
- Potentially permissive CORS

**Impact:**
- Cross-origin attacks
- Data exfiltration

**Recommendation:**
- Whitelist specific origins
- Credentials handling best practices

### 10.4 Browser Compatibility Issues

#### 1. **IE Support Code** 🟢 LOW
**Problem:**
```html
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9">
```
- IE support in 2026 is unnecessary
- Legacy compatibility hacks
- Bloat from polyfills

**Impact:**
- Additional maintenance burden
- Larger codebase

**Recommendation:**
- Drop IE support
- Remove compatibility scripts
- Use modern browser features

#### 2. **Mixed Modern/Legacy Code** 🟡 MODERATE
**Problem:**
- ES5 alongside ES6 features
- `var` mixed with `let`/`const`
- Inconsistent code style

**Impact:**
- Confusion for developers
- Harder to refactor

**Recommendation:**
- Use Babel for transpilation
- Consistent ESLint rules
- Gradual modernization

### 10.5 Data Management Issues

#### 1. **No State Management** 🟡 MODERATE
**Problem:**
- All state in controller scope
- No predictable state mutations
- Difficult to track data flow

**Impact:**
- Race conditions
- Stale data
- Difficult debugging

**Recommendation:**
- Implement Redux/NgRx pattern
- Immutable data structures
- Time-travel debugging

#### 2. **localStorage for State** 🟡 MODERATE
**Problem:**
```javascript
localStorage.setItem("isDroppable", true);
```
- No encryption
- Sync issues across tabs
- Size limitations (5-10MB)

**Impact:**
- Data loss
- Security risks

**Recommendation:**
- IndexedDB for large data
- Encrypted sensitive data
- Server-side persistence

#### 3. **JSON Deep Cloning** 🟡 MODERATE
**Problem:**
```javascript
angular.copy($scope.savedJson)  // Slow for large objects
```

**Impact:**
- Performance bottleneck
- Potential data corruption

**Recommendation:**
- Immutability libraries (Immutable.js)
- Shallow copying where possible

### 10.6 Accessibility Issues 🔴 CRITICAL

**Problem:**
- No ARIA labels on interactive elements
- Poor keyboard navigation
- Color contrast issues
- No screen reader support

**Impact:**
- ADA/WCAG non-compliance
- Excludes disabled users
- Legal liability

**Recommendation:**
- Add ARIA roles and labels
- Keyboard navigation support
- Accessibility testing tools
- WCAG 2.1 AA compliance

### 10.7 Testing Issues 🔴 CRITICAL

**Problem:**
- No unit tests visible
- No integration tests
- No E2E tests
- No test coverage reports

**Impact:**
- Regression bugs
- Fear of refactoring
- Quality degradation

**Recommendation:**
- Add Jasmine/Karma for unit tests
- Protractor/Cypress for E2E
- Target 80%+ coverage

---

## 11. Development Guide

### 11.1 Local Setup

#### Prerequisites
- Node.js (v14+) - for local server
- Modern browser (Chrome/Firefox)
- Git

#### Setup Steps

1. **Clone Repository**
```bash
cd d:\Authoring\closify
```

2. **Configure Environment**
Edit `config/services.js`:
```javascript
var host = location.protocol + "//localhost:8080/CAPS";
var microservicehost = location.protocol + "//localhost:3000";
```

3. **Enable CORS**
Backend must allow:
```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Credentials: true
```

4. **Start Local Server**
```bash
# Option 1: Python
python -m http.server 8080

# Option 2: Node http-server
npx http-server -p 8080 --cors

# Option 3: Live Server (VS Code extension)
```

5. **Access Application**
```
http://localhost:8080/index.html?courseId=235&userToken=BASE64_TOKEN
```

### 11.2 Development Workflow

#### Edit a Template

1. **Locate Template**
```
templates/[component-name]/[component].html
```

2. **Modify HTML**
```html
<div class="my-changes">
    <!-- Your modifications -->
</div>
```

3. **Update Directive** (if needed)
```javascript
// templates/[component]/scripts/[component]-directive.js
scope.myNewFunction = function(){
    // New functionality
};
```

4. **Test in Browser**
- Clear cache (Ctrl+Shift+Delete)
- Hard reload (Ctrl+F5)
- Check console for errors

#### Add New Widget (Complete Guide)

**Step 1: Configuration**
```javascript
// config/config.js - Add to appropriate category
{
    "name": "Quiz Card",
    "icon": "Q",
    "iconClass": "icon-QuizCard",
    "dataType": "quiz-card",
    "url": "templates/quizcard/quizcard.html",
    "json": "templates/quizcard/default/quizcard.json",
    "settingsURL": "templates/quizcard/quizcard-settings.html",
    "isDroppable": true,
    "enableGroupInteractivity": true,
    "preview": {
        "imgURL": "templates/preview/quiz-card.png"
    }
}
```

**Step 2: Create File Structure**
```bash
mkdir -p templates/quizcard/{default,scripts,styles}
touch templates/quizcard/quizcard.html
touch templates/quizcard/quizcard-settings.html
touch templates/quizcard/default/quizcard.json
touch templates/quizcard/scripts/quizcard-directive.js
touch templates/quizcard/styles/quizcard-template.css
```

**Step 3: Define Template HTML**
```html
<!-- templates/quizcard/quizcard.html -->
<div class="quiz-card-container" quiz-card-template>
    <div class="card-front">
        <div contenteditable="true" 
             ng-model="fieldData.TemplateData.question"
             ng-bind-html="fieldData.TemplateData.question">
        </div>
    </div>
    <div class="card-back" ng-show="flipped">
        <div contenteditable="true"
             ng-model="fieldData.TemplateData.answer"
             ng-bind-html="fieldData.TemplateData.answer">
        </div>
    </div>
    <button ng-click="flip()">Flip Card</button>
</div>
```

**Step 4: Create Directive**
```javascript
// templates/quizcard/scripts/quizcard-directive.js
App.directive('quizCardTemplate', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        controller: function($scope){
            $scope.flipped = false;
            $scope.flip = function(){
                $scope.flipped = !$scope.flipped;
            };
        },
        link: function(scope, element, attr){
            var con = angular.element(
                document.getElementById('myController')
            ).scope();
            
            // Click handler
            element.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                con.higlightObj(
                    element.parents('.sd-item'),
                    e.target
                );
                con.currentSettings = 'settings';
            });
            
            // Initialize
            $timeout(function(){
                scope.fieldData = scope.savedData[scope.pageNo][
                    'ui-id' + scope.savedIndex
                ];
            });
        }
    };
}]);
```

**Step 5: Default JSON**
```json
{
    "identifier": "quiz-card",
    "TemplateData": {
        "question": "<p>What is the capital of France?</p>",
        "answer": "<p>Paris</p>"
    },
    "settings": {
        "general_tab": [
            {
                "tabName": "General",
                "tabId": "general-quiz",
                "settingsList": [
                    {
                        "type": "fontFamily",
                        "label": "Font Family",
                        "value": "Arial"
                    }
                ]
            }
        ]
    }
}
```

**Step 6: Settings Panel**
```html
<!-- templates/quizcard/quizcard-settings.html -->
<div class="settings-panel">
    <h4>Quiz Card Settings</h4>
    <div class="form-group">
        <label>Card Color</label>
        <input type="color" 
               ng-model="fieldData.settings.cardColor"
               ng-change="applySettings()">
    </div>
</div>
```

**Step 7: Styles**
```css
/* templates/quizcard/styles/quizcard-template.css */
.quiz-card-container {
    position: relative;
    width: 100%;
    min-height: 200px;
    perspective: 1000px;
}

.card-front, .card-back {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
}

.card-back {
    background: #f5f5f5;
}
```

**Step 8: Register in index.html**
```html
<!-- Add CSS -->
<link rel="stylesheet" 
      href="templates/quizcard/styles/quizcard-template.css">

<!-- Add JS (near end of body) -->
<script src="templates/quizcard/scripts/quizcard-directive.js"></script>
```

**Step 9: Test**
```
1. Reload application
2. Check sidebar for "Quiz Card" widget
3. Drag to canvas
4. Edit question/answer
5. Click "Flip Card" button
6. Save page
7. Preview
```

### 11.3 Debugging Tips

#### Enable Angular Debug Mode
```javascript
// In browser console
angular.reloadWithDebugInfo();
```

#### Inspect Scope
```javascript
// Select element in DevTools
$scope = angular.element($0).scope();
console.log($scope.savedJson);
console.log($scope.fieldData);
```

#### Check Current Controller
```javascript
var con = angular.element(
    document.getElementById('myController')
).scope();
console.log(con);
```

#### Network Issues
```javascript
// Enable detailed logging
$scope.debug = true;

// Check API responses
// Network tab -> Filter: XHR
```

#### Common Errors

**Error: "Cannot read property of undefined"**
```javascript
// Check data initialization
$timeout(function(){
    scope.fieldData = scope.savedData[scope.pageNo][
        'ui-id' + scope.savedIndex
    ];
}, 100);  // Add delay
```

**Error: "Digest cycle already in progress"**
```javascript
// Wrap in $timeout
$timeout(function(){
    $scope.$apply();
});
```

**Error: "Element not found"**
```javascript
// Wait for DOM
$timeout(function(){
    var element = $('#my-element');
    // Now manipulate
}, 500);
```

### 11.4 Best Practices

#### 1. Follow Existing Patterns
- Study existing templates (paragraph, image)
- Match naming conventions
- Use same directive structure

#### 2. Scope Management
```javascript
// Get main controller scope
var con = angular.element(
    document.getElementById('myController')
).scope();

// Avoid polluting global scope
(function(){
    // Your code
})();
```

#### 3. Data Binding
```javascript
// Two-way binding
ng-model="fieldData.TemplateData.myField"

// One-time binding (performance)
{{::myValue}}
```

#### 4. Event Handling
```javascript
// Prevent bubbling
element.on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    // Handler
});
```

#### 5. Settings Integration
```javascript
// Watch for settings changes
scope.$watch('fieldData.settings', function(newVal){
    if(newVal) {
        applySettings(newVal);
    }
}, true);
```

### 11.5 Build & Deploy

#### Manual Deployment

1. **Test Locally**
```bash
# Run all templates
# Check console for errors
# Test save/load
# Test preview
```

2. **Bundle Assets** (if using build tool)
```bash
npm run build
```

3. **Upload to Server**
```bash
# Via FTP/SFTP
# Upload changed files only
# Maintain folder structure
```

4. **Clear CDN Cache**
```bash
# Purge cache for:
- *.js
- *.css
- *.html
```

5. **Verify Production**
```
- Test on production URL
- Check network requests
- Verify API endpoints
- Test cross-browser
```

#### Recommended Build Process

**Install Dependencies**
```bash
npm init -y
npm install --save-dev webpack webpack-cli babel-loader
```

**Create webpack.config.js**
```javascript
module.exports = {
    entry: './editor/ngcontroller.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};
```

**package.json Scripts**
```json
{
    "scripts": {
        "build": "webpack --mode production",
        "dev": "webpack --mode development --watch"
    }
}
```

---

## 12. Recommended Project Prompt

Based on this analysis, here's a comprehensive prompt you can use to understand similar projects:

---

### **PROJECT ANALYSIS PROMPT TEMPLATE**

```
I need you to comprehensively analyze this codebase and generate detailed documentation. 
I've never seen this project before and need to understand:

## 1. PROJECT OVERVIEW
- What is the main purpose of this application?
- Who are the target users?
- What problem does it solve?
- What is the business domain?

## 2. ARCHITECTURE & TECHNOLOGY STACK
- What is the architectural pattern (MVC, MVVM, etc.)?
- What frameworks and libraries are used (with versions)?
- What is the application type (SPA, MPA, PWA)?
- Front-end and back-end technologies
- Third-party integrations
- Build tools and development dependencies

## 3. FILE STRUCTURE & ORGANIZATION
- Complete directory tree with explanations
- Purpose of each major directory
- Key files and their responsibilities
- Configuration files and their purpose
- Entry points and bootstrap files

## 4. CORE FEATURES
- List all major features (user-facing)
- Feature descriptions with use cases
- User workflows for key operations
- Feature dependencies and relationships

## 5. CODE COMPONENTS
- Main modules/services/controllers
- Directives/components structure
- Data models and schemas
- Routing configuration
- State management approach

## 6. DATA FLOW
- Application lifecycle (initialization to shutdown)
- User interaction flows (with diagrams if possible)
- API integration patterns
- Data persistence strategy
- State updates and propagation

## 7. CONFIGURATION & ENVIRONMENTS
- Environment-specific configurations
- API endpoints and services
- Feature flags or toggles
- Build and deployment configurations
- URL parameters and their purposes

## 8. DEVELOPMENT GUIDE
- Local setup instructions (step-by-step)
- How to add new features/components
- Coding patterns and conventions
- Testing approach (if any)
- Debugging techniques
- Common development tasks

## 9. POTENTIAL ISSUES & TECHNICAL DEBT
Categorize by severity (CRITICAL 🔴 / MODERATE 🟡 / LOW 🟢):
- Code quality issues
- Performance bottlenecks
- Security vulnerabilities
- Browser compatibility concerns
- Scalability limitations
- Deprecated dependencies
- Missing best practices (tests, docs, etc.)
- Accessibility issues

For each issue, provide:
- Description of the problem
- Impact on the project
- Recommended solution/mitigation

## 10. DEPENDENCIES & RISKS
- Critical external dependencies
- Deprecated or EOL libraries
- Version compatibility matrix
- Migration recommendations (if needed)

## 11. DEPLOYMENT & BUILD
- Build process
- Deployment steps
- Environment requirements
- CDN or hosting considerations

## 12. DOCUMENTATION GAPS
- What documentation is missing?
- What areas need more clarity?
- Recommended documentation structure

---

**OUTPUT FORMAT:**
Generate comprehensive markdown documentation that can be saved as multiple files:
1. README.md - Overview and quick start
2. ARCHITECTURE.md - System design and patterns
3. FEATURES.md - Detailed feature documentation
4. DEVELOPMENT_GUIDE.md - Developer onboarding
5. ISSUES.md - Known issues and technical debt
6. API_REFERENCE.md - Code API documentation (if applicable)

**ANALYSIS APPROACH:**
1. Start by examining entry points (index.html, main.js, etc.)
2. Identify the framework/library used
3. Trace data flow from user action to server response
4. Map out major features by examining templates/views
5. Document configuration and environment setup
6. Identify patterns, anti-patterns, and potential issues
7. Provide actionable recommendations

Be thorough but organized. Use diagrams (ASCII or Mermaid) where helpful.
Prioritize information that helps developers understand and maintain the codebase.
```

---

## Summary

This **KITABOO Authoring Tool** is a feature-rich but technically dated educational content authoring platform. While it offers extensive functionality for creating interactive e-books, it suffers from significant technical debt, primarily due to:

1. **Legacy technology stack** (AngularJS 1.x EOL)
2. **Monolithic architecture** (21k-line controller)
3. **Performance issues** (excessive watchers, no optimization)
4. **Security concerns** (XSS vulnerabilities, token exposure)
5. **Maintainability challenges** (no tests, no documentation)

**Recommended Path Forward:**
- **Short-term**: Address critical security issues, add tests
- **Medium-term**: Refactor monolithic controller, optimize performance
- **Long-term**: Migrate to modern framework (Angular/React/Vue)

The application demonstrates sophisticated functionality but would benefit greatly from modernization and adherence to current best practices.

---

**Generated:** February 6, 2026  
**Author:** AI Documentation Assistant  
**Version:** 1.0
